from fastapi import APIRouter, HTTPException, Depends
from schemas.feedback import Feedback
from models.feedback import feedback_helper
from config.db import feedback_collection
from datetime import datetime
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
import os

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]) # type: ignore
        email = payload.get("email")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/submit-feedback")
async def submit_feedback(feedback: Feedback, user_email: str = Depends(get_current_user)):
    feedback_data = feedback.model_dump()
    feedback_data["submitted_at"] = datetime.utcnow()
    feedback_data["user_email"] = None if feedback.is_anonymous else user_email

    result = feedback_collection.insert_one(feedback_data)
    return {"message": "Feedback submitted", "id": str(result.inserted_id)}
