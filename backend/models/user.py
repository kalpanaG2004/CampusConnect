from pymongo import MongoClient
from bson import ObjectId

# User model as a dict; MongoDB is schema-less but we define structure
def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"]
    }
