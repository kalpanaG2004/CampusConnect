from fastapi import APIRouter
from config.db import feedback_collection, user_collection
import random

router = APIRouter()

@router.get("/analytics/summary")
def get_analytics_summary():
    total_feedbacks =  feedback_collection.count_documents({})

    total_users = user_collection.count_documents({})

    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}}
    ]
    category_counts_cursor = feedback_collection.aggregate(pipeline)
    category_counts = {}
    for doc in category_counts_cursor:
        category_counts[doc["_id"]] = doc["count"]

    return {
        "total_feedbacks": total_feedbacks,
        "total_users": total_users,
        "category_counts": category_counts
    }

@router.get("/analytics/highlights")
def get_feedback_highlights():
    all_feedbacks = list(feedback_collection.find({}))

    if not all_feedbacks:
        return {"highlights": []}

    high_rated = [fb for fb in all_feedbacks if fb.get('rating', 0) >= 3]
    low_rated = [fb for fb in all_feedbacks if fb.get('rating', 0) <= 2]

    selected_high = random.sample(high_rated, min(3, len(high_rated))) if high_rated else []

    selected_low = random.sample(low_rated, min(2, len(low_rated))) if low_rated else []

    highlights = selected_high + selected_low

    random.shuffle(highlights)

    simplified_highlights = [
        {
            "title": fb.get("title"),
            "comment": fb.get("comment"),
            "rating": fb.get("rating"),
            "category": fb.get("category"),
            "is_anonymous": fb.get("is_anonymous"),
            "username": fb.get("username")
        }
        for fb in highlights
    ]

    return {"highlights": simplified_highlights}

@router.get("/analytics/teasers")
def get_teasers():
    categories = ['faculty', 'event', 'club', 'infrastructure', 'other']
    teasers = []

    for category in categories:
        fb = list(feedback_collection.aggregate([
            {"$match": {"category": category}},
            {"$sample": {"size": 1}}
            ]))
        if fb:
            teasers.append({
                "title": fb[0].get("title", "No Title"),
                "comment": fb[0].get("comment", "No Comment"),
                "category": category
            })

    return {"teasers": teasers}
