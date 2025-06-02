from fastapi import APIRouter, HTTPException, Depends
from schemas.feedback import FeedbackCreate, FeedbackInDB, PublicFeedback
from models.feedback import admin_feedback_helper, public_feedback_helper
from config.db import user_collection, feedback_collection
from datetime import datetime
from jose import JWTError, jwt
from utils.jwt_handler import decode_access_token
from fastapi.security import OAuth2PasswordBearer
import os
from typing import List

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    email = user_collection.find_one({"email": payload.get("email")})
    if not email:
        raise HTTPException(status_code=404, detail="User not found")

    return email

# Admin-only dependency
async def admin_only(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")
    return user

@router.post("/submit-feedback")
async def submit_feedback(feedback: FeedbackCreate, user=Depends(get_current_user)):
    feedback_data = {
        "title": feedback.title,
        "comment": feedback.comment,
        "rating": feedback.rating,
        "is_anonymous": feedback.is_anonymous,
        "submitted_at": datetime.utcnow(),
        "user_id": str(user["_id"]),
        "email": user["email"],
        "username": None if feedback.is_anonymous else user["username"]
    }
    feedback_collection.insert_one(feedback_data)
    return {"message": "Feedback submitted successfully"}

# Admin View Route
@router.get("/admin/feedbacks", response_model=list[FeedbackInDB])
async def get_all_feedbacks_admin(user=Depends(admin_only)):
    feedbacks = feedback_collection.find()
    return [FeedbackInDB(**fb, user_id=fb["user_id"]) for fb in feedbacks]

# Public View Route
@router.get("/feedbacks", response_model=list[PublicFeedback])
async def get_public_feedbacks():
    feedbacks = feedback_collection.find()
    public_feedbacks = []
    for fb in feedbacks:
        public_feedbacks.append(PublicFeedback(
            title=fb["title"],
            comment=fb["comment"],
            rating=fb["rating"],
            username=None if fb["is_anonymous"] else fb["username"],
            submitted_at=fb["submitted_at"]
        ))
    return public_feedbacks

@router.get("/my-feedbacks")
def get_my_feedbacks(token: str = Depends(oauth2_scheme)):
    user = decode_access_token(token)
    feedbacks = feedback_collection.find({"user_email": user.get("email")}) # type: ignore
    result = []
    for fb in feedbacks:
        result.append({
            "id": str(fb["_id"]),
            "title": fb["title"],
            "comment": fb["comment"],
            "rating": fb["rating"],
            "submitted_at": fb["submitted_at"],
            "is_anonymous": fb["is_anonymous"]
        })
    
    return {"my_feedbacks": result}