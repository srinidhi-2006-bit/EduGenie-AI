from fastapi import APIRouter, Depends
from datetime import datetime
from app.auth import get_current_user
from app.database import get_db
from app.models.schemas import InterviewRequest
from app.services.ai_service import ai_service

router = APIRouter()

SYSTEM = """Generate interview questions. Return ONLY valid JSON array (no markdown fences):
[{"question":"...","answer":"Detailed model answer...","difficulty":"easy|medium|hard","tip":"Advice for answering well..."}]"""

@router.post("/generate")
async def generate(payload: InterviewRequest, current_user=Depends(get_current_user)):
    msg = f"Role: {payload.role}\nCategory: {payload.category}\nQuestions: {payload.num_questions}"
    questions = await ai_service.chat_json(SYSTEM, msg, max_tokens=2500)
    db = get_db()
    doc = {"user_id": str(current_user["_id"]), "role": payload.role, "category": payload.category, "questions": questions, "created_at": datetime.utcnow().isoformat()}
    result = await db.interview_sessions.insert_one(doc)
    return {"session_id": str(result.inserted_id), "questions": questions, "role": payload.role, "category": payload.category}

@router.get("/history")
async def history(current_user=Depends(get_current_user)):
    db = get_db()
    cursor = db.interview_sessions.find({"user_id": str(current_user["_id"])}, sort=[("created_at",-1)], limit=10)
    sessions = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        sessions.append(doc)
    return {"sessions": sessions}
