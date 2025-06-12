from fastapi import FastAPI
from routes import auth, submit_fb, view_fb, modify_fb, search_fb
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(submit_fb.router)
app.include_router(view_fb.router)
app.include_router(modify_fb.router)
app.include_router(search_fb.router)