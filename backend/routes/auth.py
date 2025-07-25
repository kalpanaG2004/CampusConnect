from fastapi import APIRouter, Depends, HTTPException
from schemas.user import UserRegister
from config.db import user_collection
from utils.auth import hash_password, verify_password
from utils.jwt_handler import create_access_token
from fastapi.security import OAuth2PasswordRequestForm
import os

router = APIRouter()

ADMIN_SECRET = os.getenv("ADMIN_SECRET", "default_admin_code")

@router.post("/register")
async def register(user: UserRegister):
    if user_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already exists")
    
    if user.role == "admin":
        if not user.admin_code or user.admin_code != ADMIN_SECRET:
            raise HTTPException(status_code=403, detail="Invalid or missing admin code")

    user_data = user.model_dump();
    user_data["password"] = hash_password(user.password)
    user_data["role"] = user_data.get("role", "student")
    user_data.pop("admin_code", None)

    user_collection.insert_one(user_data)
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = user_collection.find_one({"email": form_data.username})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email")

    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")


    token = create_access_token({
        "email": user["email"],
        "role": user.get("role", "student")
    })
    return {"access_token": token,
            "token_type": "bearer",
            "email": user["email"],
            "role": user.get("role", "student")
            }
