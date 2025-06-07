from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Optional[str] = "student"
    admin_code: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
