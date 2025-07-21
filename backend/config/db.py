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
    
    # Enhanced mock collections for development
    class MockCollection:
        def __init__(self, name="mock"):
            self.name = name
            self._mock_data = []
            
        def find_one(self, query=None): 
            return None
            
        def find(self, query=None): 
            return []
            
        def insert_one(self, doc): 
            return type('obj', (object,), {'inserted_id': 'mock_id'})
            
        def update_one(self, query, update): 
            return type('obj', (object,), {'modified_count': 0})
            
        def delete_one(self, query): 
            return type('obj', (object,), {'deleted_count': 0})
            
        def count_documents(self, query=None):
            # Return some mock data for analytics
            if self.name == "users":
                return 15  # Mock user count
            elif self.name == "feedback":
                return 25  # Mock feedback count
            return 0
            
        def aggregate(self, pipeline):
            # Mock aggregation results for analytics
            if self.name == "feedback":
                # Mock category counts
                return [
                    {"_id": "academic", "count": 8},
                    {"_id": "facilities", "count": 7},
                    {"_id": "events", "count": 5},
                    {"_id": "general", "count": 5}
                ]
            return []
    
    user_collection = MockCollection("users")
    feedback_collection = MockCollection("feedback")