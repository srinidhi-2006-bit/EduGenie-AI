from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from bson import ObjectId
from app.database import get_db
from app.auth import hash_password, verify_password, create_access_token, get_current_user
from app.models.schemas import UserRegister, UserLogin

router = APIRouter()

def _serialize(user: dict) -> dict:
    return {"id": str(user["_id"]), "name": user["name"], "email": user["email"], "plan": user.get("plan", "free")}

@router.post("/register")
async def register(payload: UserRegister):
    db = get_db()
    if await db.users.find_one({"email": payload.email}):
        raise HTTPException(400, "Email already registered")
    doc = {"name": payload.name, "email": payload.email, "password": hash_password(payload.password), "plan": "free", "created_at": datetime.utcnow().isoformat()}
    result = await db.users.insert_one(doc)
    doc["_id"] = result.inserted_id
    token = create_access_token({"sub": str(result.inserted_id)})
    return {"access_token": token, "token_type": "bearer", "user": _serialize(doc)}

@router.post("/login")
async def login(payload: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(401, "Invalid email or password")
    token = create_access_token({"sub": str(user["_id"])})
    return {"access_token": token, "token_type": "bearer", "user": _serialize(user)}

@router.get("/me")
async def me(current_user=Depends(get_current_user)):
    return _serialize(current_user)
