from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Model for submitting feedback (user-facing)
class FeedbackCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=100)
    comment: str = Field(..., min_length=30, max_length=1000)
    rating: int = Field(..., ge=1, le=5)
    is_anonymous: bool = False  # default: not anonymous

# Internal model for storing feedback in DB or returning to admin
class FeedbackInDB(FeedbackCreate):
    user_id: str  # MongoDB user _id as string
    username: Optional[str]  # null if anonymous
    email: str  # always stored for admin
    submitted_at: datetime

# Model for public feedback viewing (for non-admin users)
class PublicFeedback(BaseModel):
    title: str
    comment: str
    rating: int
    username: Optional[str] = None  # shown only if not anonymous
    submitted_at: datetime
