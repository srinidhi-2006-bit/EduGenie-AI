from fastapi import APIRouter, Depends
from datetime import datetime
from app.auth import get_current_user
from app.database import get_db
from app.models.schemas import MindMapRequest
from app.services.ai_service import ai_service

router = APIRouter()

SYSTEM = """Generate a mind map. Return ONLY valid JSON (no markdown fences):
{"center":"MAIN TOPIC","branches":[{"title":"Branch","color":"#hexcolor","nodes":["concept1","concept2","concept3"]}]}
Use 5-7 branches with distinct hex colors."""

@router.post("/generate")
async def generate(payload: MindMapRequest, current_user=Depends(get_current_user)):
    result = await ai_service.chat_json(SYSTEM, f"Topic: {payload.topic}")
    db = get_db()
    doc = {"user_id": str(current_user["_id"]), "topic": payload.topic, "map_data": result, "created_at": datetime.utcnow().isoformat()}
    ins = await db.mind_maps.insert_one(doc)
    return {"map_id": str(ins.inserted_id), **result}

@router.get("/history")
async def history(current_user=Depends(get_current_user)):
    db = get_db()
    cursor = db.mind_maps.find({"user_id": str(current_user["_id"])}, sort=[("created_at",-1)], limit=10)
    maps = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        maps.append(doc)
    return {"maps": maps}
