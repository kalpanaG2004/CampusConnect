from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Feedback(BaseModel):
    title: str = Field(..., min_length=5)
    comment: str = Field(..., min_length=30)
    rating: int = Field(..., ge=1, le=5)
    is_anonymous: bool = False
    submitted_at: Optional[datetime] = None
