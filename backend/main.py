from fastapi import FastAPI
from routes import auth, feedback

app = FastAPI()

app.include_router(auth.router)
app.include_router(feedback.router)