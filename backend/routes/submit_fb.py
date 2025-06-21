from fastapi import APIRouter, Depends
from schemas.feedback import FeedbackCreate
from config.db import feedback_collection
from datetime import datetime
from utils.dependencies import get_current_user
import os

router = APIRouter()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

def create_feedback_data(feedback: FeedbackCreate, current_user, category: str):
    return {
        "title": feedback.title,
        "comment": feedback.comment,
        "rating": feedback.rating,
        "category": category,
        "is_anonymous": feedback.is_anonymous,
        "submitted_at": datetime.utcnow(),
        "user_id": str(current_user["_id"]),
        "email": current_user["email"],
        "username": None if feedback.is_anonymous else current_user["username"]
    }

@router.post("/feedback/event")
async def submit_event_feedback(feedback: FeedbackCreate, current_user=Depends(get_current_user)):
    feedback_data = create_feedback_data(feedback, current_user, category="event")
    feedback_collection.insert_one(feedback_data)
    return {"message": "Feedback submitted successfully"}

@router.post("/feedback/club")
async def submit_club_feedback(feedback: FeedbackCreate, current_user=Depends(get_current_user)):
    feedback_data = create_feedback_data(feedback, current_user, category="club")
    feedback_collection.insert_one(feedback_data)
    return {"message": "Feedback submitted successfully"}

@router.post("/feedback/faculty")
async def submit_faculty_feedback(feedback: FeedbackCreate, current_user=Depends(get_current_user)):
    feedback_data = create_feedback_data(feedback, current_user, category="faculty")
    feedback_collection.insert_one(feedback_data)
    return {"message": "Feedback submitted successfully"}

@router.post("/feedback/infrastructure")
async def submit_infrastructure_feedback(feedback: FeedbackCreate, current_user=Depends(get_current_user)):
    feedback_data = create_feedback_data(feedback, current_user, category="infrastructure")
    feedback_collection.insert_one(feedback_data)
    return {"message": "Feedback submitted successfully"}

@router.post("/feedback/other")
async def submit_other_feedback(feedback: FeedbackCreate, current_user=Depends(get_current_user)):
    feedback_data = create_feedback_data(feedback, current_user, category="other")
    feedback_collection.insert_one(feedback_data)
    return {"message": "Feedback submitted successfully"}
