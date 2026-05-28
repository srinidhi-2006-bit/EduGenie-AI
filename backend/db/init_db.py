"""
Run once to set up MongoDB indexes and seed a demo user.
Usage:  python db/init_db.py
"""
import asyncio, os, bcrypt
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME   = os.getenv("DB_NAME",   "edugenie_db")

def _hash(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

async def init():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]

    await db.users.create_index("email", unique=True)
    await db.chats.create_index([("user_id", 1), ("timestamp", -1)])
    await db.uploaded_pdfs.create_index([("user_id", 1), ("uploaded_at", -1)])
    await db.quizzes.create_index([("user_id", 1), ("created_at", -1)])
    await db.interview_sessions.create_index([("user_id", 1), ("created_at", -1)])
    await db.mind_maps.create_index([("user_id", 1), ("created_at", -1)])
    await db.study_plans.create_index([("user_id", 1), ("created_at", -1)])
    await db.voice_history.create_index([("user_id", 1), ("timestamp", -1)])
    print("✅ All indexes created")

    if not await db.users.find_one({"email": "demo@edugenie.ai"}):
        await db.users.insert_one({
            "name": "Demo Student",
            "email": "demo@edugenie.ai",
            "password": _hash("demo1234"),
            "plan": "pro",
            "created_at": "2024-01-01T00:00:00"
        })
        print("🌱 Demo user seeded — email: demo@edugenie.ai | password: demo1234")
    else:
        # Re-hash with correct bcrypt in case old passlib hash is present
        await db.users.update_one(
            {"email": "demo@edugenie.ai"},
            {"$set": {"password": _hash("demo1234")}}
        )
        print("🔄 Demo user password re-hashed with bcrypt")

    print(f"🎉 Database '{DB_NAME}' ready!")
    client.close()

asyncio.run(init())
