from fastapi import APIRouter, Depends
from datetime import datetime
from app.auth import get_current_user
from app.database import get_db
from app.models.schemas import PlannerRequest
from app.services.ai_service import ai_service

router = APIRouter()

SYSTEM = """Create a personalized study plan. Return ONLY valid JSON (no markdown fences):
{"subject":"...","totalDays":N,"dailyPlan":[{"day":1,"date":"Day 1","topic":"...","tasks":["t1","t2","t3"],"duration":"Xh","type":"learn|revise|practice|test"}],"weeklyGoals":["g1","g2","g3"],"tips":["tip1","tip2","tip3"]}
Include exactly 7 days. type must be one of: learn, revise, practice, test."""

@router.post("/generate")
async def generate(payload: PlannerRequest, current_user=Depends(get_current_user)):
    days_left = 30
    if payload.exam_date:
        try:
            exam = datetime.fromisoformat(payload.exam_date)
            days_left = max(1, (exam - datetime.utcnow()).days)
        except ValueError:
            pass
    msg = f"Subject: {payload.subject}\nDays until exam: {days_left}\nHours/day: {payload.hours_per_day}\nLevel: {payload.current_level}"
    result = await ai_service.chat_json(SYSTEM, msg, max_tokens=2000)
    db = get_db()
    doc = {"user_id": str(current_user["_id"]), "subject": payload.subject, "exam_date": payload.exam_date, "hours_per_day": payload.hours_per_day, "plan": result, "created_at": datetime.utcnow().isoformat()}
    ins = await db.study_plans.insert_one(doc)
    return {"plan_id": str(ins.inserted_id), **result}

@router.get("/history")
async def history(current_user=Depends(get_current_user)):
    db = get_db()
    cursor = db.study_plans.find({"user_id": str(current_user["_id"])}, sort=[("created_at",-1)], limit=10)
    plans = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        plans.append(doc)
    return {"plans": plans}
