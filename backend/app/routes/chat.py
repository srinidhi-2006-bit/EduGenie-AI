from fastapi import APIRouter, Depends
from datetime import datetime
from app.auth import get_current_user
from app.database import get_db
from app.models.schemas import ChatMessage
from app.services.ai_service import ai_service

router = APIRouter()

SYSTEM = """You are EduGenie, an expert AI educational assistant for students.
Help with academics: math, science, history, coding, literature — any subject.
Be clear, encouraging, and concise. Format code in markdown code blocks.
Break complex topics into simple steps with examples."""

@router.post("/send")
async def send(payload: ChatMessage, current_user=Depends(get_current_user)):
    db = get_db()
    history_text = "\n".join(
        f"{'Student' if m.get('role')=='user' else 'EduGenie'}: {m.get('content','')}"
        for m in payload.history[-8:]
    )
    user_prompt = f"{history_text}\nStudent: {payload.message}" if history_text else payload.message
    reply = await ai_service.chat(SYSTEM, user_prompt)
    doc = {"user_id": str(current_user["_id"]), "user_message": payload.message, "ai_reply": reply, "timestamp": datetime.utcnow().isoformat()}
    result = await db.chats.insert_one(doc)
    return {"reply": reply, "chat_id": str(result.inserted_id)}

@router.get("/history")
async def history(current_user=Depends(get_current_user)):
    db = get_db()
    cursor = db.chats.find({"user_id": str(current_user["_id"])}, sort=[("timestamp", -1)], limit=30)
    chats = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        chats.append(doc)
    return {"chats": list(reversed(chats))}

@router.delete("/history")
async def clear(current_user=Depends(get_current_user)):
    db = get_db()
    await db.chats.delete_many({"user_id": str(current_user["_id"])})
    return {"message": "Cleared"}
