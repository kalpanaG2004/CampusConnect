from fastapi import APIRouter, HTTPException, Depends
from schemas.feedback import FeedbackCreate
from config.db import user_collection, feedback_collection
from datetime import datetime
from utils.jwt_handler import decode_access_token, oauth2_scheme
import os

router = APIRouter()
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

def create_feedback_data(feedback: FeedbackCreate, user, category: str):
    return {
        "title": feedback.title,
        "comment": feedback.comment,
        "rating": feedback.rating,
        "category": category,
        "is_anonymous": feedback.is_anonymous,
        "submitted_at": datetime.utcnow(),
        "user_id": str(user["_id"]),
        "email": user["email"],
        "username": None if feedback.is_anonymous else user["username"]
    }

@router.post("/feedback/event")
async def submit_event_feedback(feedback: FeedbackCreate, user=Depends(get_current_user)):
    feedback_data = create_feedback_data(feedback, user, category="event")
    feedback_collection.insert_one(feedback_data)
    return {"message": "Feedback submitted successfully"}

@router.post("/feedback/club")
async def submit_club_feedback(feedback: FeedbackCreate, user=Depends(get_current_user)):
    feedback_data = create_feedback_data(feedback, user, category="club")
    feedback_collection.insert_one(feedback_data)
    return {"message": "Feedback submitted successfully"}

@router.post("/feedback/faculty")
async def submit_faculty_feedback(feedback: FeedbackCreate, user=Depends(get_current_user)):
    feedback_data = create_feedback_data(feedback, user, category="faculty")
    feedback_collection.insert_one(feedback_data)
    return {"message": "Feedback submitted successfully"}

@router.post("/feedback/other")
async def submit_other_feedback(feedback: FeedbackCreate, user=Depends(get_current_user)):
    feedback_data = create_feedback_data(feedback, user, category="other")
    feedback_collection.insert_one(feedback_data)
    return {"message": "Feedback submitted successfully"}
