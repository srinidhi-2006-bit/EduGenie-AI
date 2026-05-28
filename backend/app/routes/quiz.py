from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId
from app.auth import get_current_user
from app.database import get_db
from app.models.schemas import QuizGenerateRequest, QuizSubmitRequest
from app.services.ai_service import ai_service

router = APIRouter()

SYSTEM = """Generate MCQ quiz questions. Return ONLY valid JSON array (no markdown fences):
[{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":0,"explanation":"..."}]
The 'correct' field is the 0-based index of the right answer."""

@router.post("/generate")
async def generate(payload: QuizGenerateRequest, current_user=Depends(get_current_user)):
    msg = f"Topic: {payload.topic}\nDifficulty: {payload.difficulty}\nQuestions: {payload.num_questions}"
    questions = await ai_service.chat_json(SYSTEM, msg, max_tokens=2000)
    if not isinstance(questions, list):
        raise HTTPException(500, "AI returned invalid quiz format")
    db = get_db()
    doc = {"user_id": str(current_user["_id"]), "topic": payload.topic, "difficulty": payload.difficulty, "questions": questions, "completed": False, "created_at": datetime.utcnow().isoformat()}
    result = await db.quizzes.insert_one(doc)
    sanitized = [{"question": q["question"], "options": q["options"]} for q in questions]
    return {"quiz_id": str(result.inserted_id), "questions": sanitized, "topic": payload.topic, "difficulty": payload.difficulty}

@router.post("/submit")
async def submit(payload: QuizSubmitRequest, current_user=Depends(get_current_user)):
    db = get_db()
    quiz = await db.quizzes.find_one({"_id": ObjectId(payload.quiz_id), "user_id": str(current_user["_id"])})
    if not quiz:
        raise HTTPException(404, "Quiz not found")
    questions = quiz["questions"]
    correct_answers = [q["correct"] for q in questions]
    score = sum(1 for i, a in enumerate(payload.answers) if i < len(correct_answers) and a == correct_answers[i])
    pct = round(score / len(questions) * 100, 1)
    await db.quizzes.update_one({"_id": ObjectId(payload.quiz_id)}, {"$set": {"completed": True, "score": score, "percentage": pct}})
    return {"score": score, "total": len(questions), "percentage": pct, "correct_answers": correct_answers, "explanations": [q.get("explanation","") for q in questions]}

@router.get("/history")
async def history(current_user=Depends(get_current_user)):
    db = get_db()
    cursor = db.quizzes.find({"user_id": str(current_user["_id"])}, sort=[("created_at",-1)], limit=20)
    quizzes = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc.pop("questions", None)
        quizzes.append(doc)
    return {"quizzes": quizzes}
