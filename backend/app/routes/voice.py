from fastapi import APIRouter, Depends
from datetime import datetime
from app.auth import get_current_user
from app.database import get_db
from app.models.schemas import VoiceRequest
from app.services.ai_service import ai_service

router = APIRouter()

SYSTEM = """You are EduGenie Voice Assistant — a helpful educational AI.
Give concise plain-text answers suitable for text-to-speech. No markdown, no bullet symbols. Be friendly."""

@router.post("/ask")
async def ask(payload: VoiceRequest, current_user=Depends(get_current_user)):
    reply = await ai_service.chat(SYSTEM, payload.transcript, max_tokens=400)
    db = get_db()
    doc = {"user_id": str(current_user["_id"]), "transcript": payload.transcript, "reply": reply, "timestamp": datetime.utcnow().isoformat()}
    ins = await db.voice_history.insert_one(doc)
    return {"reply": reply, "record_id": str(ins.inserted_id)}

@router.get("/history")
async def history(current_user=Depends(get_current_user)):
    db = get_db()
    cursor = db.voice_history.find({"user_id": str(current_user["_id"])}, sort=[("timestamp",-1)], limit=20)
    records = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        records.append(doc)
    return {"history": records}
