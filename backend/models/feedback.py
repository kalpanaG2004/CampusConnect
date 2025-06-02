def feedback_helper(feedback) -> dict:
    return {
        "id": str(feedback["_id"]),
        "title": feedback["title"],
        "comment": feedback["comment"],
        "rating": feedback["rating"],
        "is_anonymous": feedback["is_anonymous"],
        "submitted_at": feedback["submitted_at"],
        "user_email": feedback["user_email"]
    }
