from fastapi import FastAPI
from routes import auth, submit_fb, view_fb, modify_fb, search_fb, analytics
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://campusconnect-1-jy1a.onrender.com",
        "http://localhost:3000", 
        "http://192.168.0.101:3000",
        "https://*.googleusercontent.com",  # Firebase IDX preview URLs
        "https://*.cloudworkstations.dev",  # Firebase IDX workspace URLs
        "https://*.studio.firebase.google.com",  # Firebase Studio URLs
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(submit_fb.router)
app.include_router(view_fb.router)
app.include_router(modify_fb.router)
app.include_router(search_fb.router)
app.include_router(analytics.router)