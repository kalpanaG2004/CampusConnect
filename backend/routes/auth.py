from fastapi import APIRouter, HTTPException
from schemas.user import UserRegister, UserLogin
from config.db import db, user_collection
from utils.auth import hash_password, verify_password
from utils.jwt_handler import create_access_token

router = APIRouter()

@router.post("/register")
async def register(user: UserRegister):
    if user_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already exists")
    
    user_data = user.model_dump();
    user_data["password"] = hash_password(user.password)
    user_data["role"] = user_data.get("role", "student")

    user_collection.insert_one(user_data)
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(user: UserLogin):
    db_user = user_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "email": db_user["email"],
        "role": db_user["role"]
    })
    return {"access_token": token,
            "token_type": "bearer",
            "email": db_user["email"],
            "role": db_user.get("role", "student")
            }
