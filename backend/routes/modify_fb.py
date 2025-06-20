from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from schemas.feedback import FeedbackUpdate
from config.db import feedback_collection
from utils.dependencies import get_current_user

router = APIRouter()

# PATCH route: Edit Feedback
@router.patch("/feedbacks/{feedback_id}")
async def update_feedback(feedback_id: str, update_data: FeedbackUpdate, user=Depends(get_current_user)):
    feedback = feedback_collection.find_one({"_id": ObjectId(feedback_id)})

    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")

    if feedback["email"] != user["email"]: # for security, not UI
        raise HTTPException(status_code=403, detail="Unauthorized to edit this feedback")

    updates = {k: v for k, v in update_data.model_dump().items() if v is not None}

    if "is_anonymous" in updates:
        if updates["is_anonymous"]:
            updates["username"] = None
        else:
            updates["username"] = user["username"]

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    feedback_collection.update_one({"_id": ObjectId(feedback_id)}, {"$set": updates})
    return {"message": "Feedback updated successfully"}

# DELETE route: Delete Feedback
@router.delete("/feedbacks/{feedback_id}")
async def delete_feedback(feedback_id: str, user=Depends(get_current_user)):
    feedback = feedback_collection.find_one({"_id": ObjectId(feedback_id)})

    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")

    if user["role"] != "admin" and feedback["email"] != user["email"]:
        raise HTTPException(status_code=403, detail="Unauthorized to delete this feedback")

    feedback_collection.delete_one({"_id": ObjectId(feedback_id)})
    return {"message": "Feedback deleted successfully"}
