from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")

try:
    conn = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Test the connection
    conn.admin.command('ping')
    db = conn["campusConnect"]
    user_collection = db["users"]
    feedback_collection = db["feedback"]
    print("✅ MongoDB connected successfully")
except Exception as e:
    print(f"⚠️  MongoDB connection failed: {e}")
    print("📝 Using mock database for development")
    # Mock collections for development
    class MockCollection:
        def find_one(self, query): return None
        def find(self, query=None): return []
        def insert_one(self, doc): return type('obj', (object,), {'inserted_id': 'mock_id'})
        def update_one(self, query, update): return None
        def delete_one(self, query): return None
    
    user_collection = MockCollection()
    feedback_collection = MockCollection()