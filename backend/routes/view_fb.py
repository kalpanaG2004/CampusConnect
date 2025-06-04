from fastapi import APIRouter, Depends, HTTPException
from schemas.feedback import FeedbackInDB, PublicFeedback
from config.db import feedback_collection, user_collection
from utils.jwt_handler import decode_access_token, oauth2_scheme

router = APIRouter()

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

# Admin View Route
@router.get("/admin/feedbacks", response_model=list[FeedbackInDB])
async def get_all_feedbacks_admin(user=Depends(admin_only)):
    feedbacks = feedback_collection.find()
    return [FeedbackInDB(**fb) for fb in feedbacks]

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
            category=fb["category"],
            username=None if fb["is_anonymous"] else fb["username"],
            submitted_at=fb["submitted_at"]
        ))
    return public_feedbacks

@router.get("/my-feedbacks")
def get_my_feedbacks(token: str = Depends(oauth2_scheme)):
    user = decode_access_token(token)
    feedbacks = feedback_collection.find({"email": user.get("email")}) # type: ignore
    result = []
    for fb in feedbacks:
        result.append({
            "id": str(fb["_id"]),
            "title": fb["title"],
            "comment": fb["comment"],
            "rating": fb["rating"],
            "submitted_at": fb["submitted_at"],
            "is_anonymous": fb["is_anonymous"],
            "category": fb["category"]
        })
    
    return {"my_feedbacks": result}