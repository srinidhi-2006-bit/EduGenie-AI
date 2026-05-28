from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.database import connect_db, disconnect_db
from app.routes import auth, chat, pdf, quiz, interview, mindmap, planner, voice

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await disconnect_db()

app = FastAPI(
    title="EduGenie AI API",
    description="Intelligent Generative AI-Powered Student Learning Assistant",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://edugenie-ai.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,      prefix="/api/auth",      tags=["Authentication"])
app.include_router(chat.router,      prefix="/api/chat",      tags=["AI Chatbot"])
app.include_router(pdf.router,       prefix="/api/pdf",       tags=["PDF Summarizer"])
app.include_router(quiz.router,      prefix="/api/quiz",      tags=["Quiz Generator"])
app.include_router(interview.router, prefix="/api/interview", tags=["Interview Prep"])
app.include_router(mindmap.router,   prefix="/api/mindmap",   tags=["Mind Map"])
app.include_router(planner.router,   prefix="/api/planner",   tags=["Study Planner"])
app.include_router(voice.router,     prefix="/api/voice",     tags=["Voice Assistant"])

@app.get("/")
async def root():
    return {"message": "EduGenie AI API is live 🚀", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
