from fastapi import Depends, HTTPException
from config.db import user_collection
from utils.jwt_handler import decode_access_token, oauth2_scheme

# Common Dependency
async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = user_collection.find_one({"email": payload.get("email")})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

# Admin-only dependency
async def admin_only(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")
    return user
