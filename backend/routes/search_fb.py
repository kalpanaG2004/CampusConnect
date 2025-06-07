from fastapi import APIRouter, Query, HTTPException
from config.db import feedback_collection
from schemas.feedback import PublicFeedback
from typing import Optional
import re

router = APIRouter()

@router.get("/search-feedbacks", response_model=list[PublicFeedback])
async def search_feedbacks(query: Optional[str] = Query(None, min_length=2),
    sort_by: Optional[str] = Query(None, regex="^(highest|lowest)$")):
    
    filters = {}

    if query:
        # Case-insensitive regex for flexible searching
        regex = {"$regex": re.escape(query), "$options": "i"}
        filters["$or"] = [
            {"title": regex},
            {"comment": regex},
            {"category": regex}
        ]

    # Sorting logic
    sort_criteria = [("submitted_at", -1)]  # default: latest first
    if sort_by == "highest":
        sort_criteria = [("rating", -1)]
    elif sort_by == "lowest":
        sort_criteria = [("rating", 1)]
    
    # Search title, comment, or category fields
    feedbacks = feedback_collection.find(filters).sort(sort_criteria)  # Sort by latest first

    # Converting results to public format
    result = []
    for fb in feedbacks:
        result.append(PublicFeedback(
            title=fb["title"],
            comment=fb["comment"],
            rating=fb["rating"],
            category=fb["category"],
            username=None if fb["is_anonymous"] else fb["username"],
            submitted_at=fb["submitted_at"]
        ))

    if not result:
        raise HTTPException(status_code=404, detail="No matching feedbacks found.")

    return result
