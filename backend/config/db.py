from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")
conn = MongoClient(MONGO_URI)
db = conn["campusConnect"]
user_collection = db["users"]
feedback_collection = db["feedback"]