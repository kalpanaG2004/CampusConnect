from fastapi import APIRouter, Depends, HTTPException
from schemas.feedback import FeedbackInDB, PublicFeedback
from config.db import feedback_collection
from utils.jwt_handler import decode_access_token, oauth2_scheme
from utils.db_utils import serialize_fb
from utils.dependencies import get_current_user, admin_only
from bson import ObjectId

router = APIRouter()

# Admin View Route
@router.get("/admin/feedbacks", response_model=list[FeedbackInDB])
async def get_all_feedbacks_admin(user=Depends(admin_only)):
    feedbacks = feedback_collection.find()
    return [FeedbackInDB(**serialize_fb(fb)) for fb in feedbacks]

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

# User View Route
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

# fetching feedback for modification
@router.get("/feedbacks/{feedback_id}", response_model=FeedbackInDB)
async def get_feedback_by_id(feedback_id: str, user=Depends(get_current_user)):
    feedback = feedback_collection.find_one({
        "_id": ObjectId(feedback_id),
        "email": user["email"]
    })
    
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")

    return FeedbackInDB(**serialize_fb(feedback))