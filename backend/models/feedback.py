def admin_feedback_helper(feedback) -> dict:
    return {
        "id": str(feedback["_id"]),
        "title": feedback["title"],
        "comment": feedback["comment"],
        "rating": feedback["rating"],
        "submitted_at": feedback["submitted_at"],
        "is_anonymous": feedback["is_anonymous"],
        "username": feedback.get("username"),  # could be None if anonymous
        "user_email": feedback.get("user_email")
    }

def public_feedback_helper(feedback) -> dict:
    return {
        "title": feedback["title"],
        "comment": feedback["comment"],
        "rating": feedback["rating"],
        "submitted_at": feedback["submitted_at"],
        "submitted_by": feedback.get("username") if not feedback.get("is_anonymous") else None
    }
