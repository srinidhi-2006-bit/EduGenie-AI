from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from datetime import datetime
from bson import ObjectId
from app.auth import get_current_user
from app.database import get_db
from app.services.ai_service import ai_service
from app.services.pdf_service import pdf_service

router = APIRouter()

SYSTEM = """You are an expert document analyst. Analyze the text and return ONLY valid JSON (no markdown fences):
{"summary":"2-3 paragraph comprehensive summary","key_points":["p1","p2","p3","p4","p5"],"important_questions":["Q1?","Q2?","Q3?","Q4?","Q5?"],"topics":["t1","t2","t3"],"difficulty":"Beginner|Intermediate|Advanced","estimated_read_time":"X minutes"}"""

@router.post("/upload")
async def upload(file: UploadFile = File(...), current_user=Depends(get_current_user)):
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(413, "File too large (max 10MB)")
    text = pdf_service.extract_text(content, file.filename)
    if not text.strip():
        raise HTTPException(422, "Could not extract text from document")
    result = await ai_service.chat_json(SYSTEM, f"Document:\n{text[:6000]}")
    db = get_db()
    doc = {"user_id": str(current_user["_id"]), "filename": file.filename, "text_preview": text[:500], "summary": result, "uploaded_at": datetime.utcnow().isoformat()}
    ins = await db.uploaded_pdfs.insert_one(doc)
    result["pdf_id"] = str(ins.inserted_id)
    return result

@router.get("/history")
async def history(current_user=Depends(get_current_user)):
    db = get_db()
    cursor = db.uploaded_pdfs.find({"user_id": str(current_user["_id"])}, sort=[("uploaded_at", -1)], limit=20)
    docs = []
    async for d in cursor:
        d["_id"] = str(d["_id"])
        docs.append(d)
    return {"pdfs": docs}

@router.delete("/{pdf_id}")
async def delete(pdf_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    await db.uploaded_pdfs.delete_one({"_id": ObjectId(pdf_id), "user_id": str(current_user["_id"])})
    return {"message": "Deleted"}
