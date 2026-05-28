from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    history: Optional[List[dict]] = []

class QuizGenerateRequest(BaseModel):
    topic: str = Field(..., min_length=2)
    difficulty: str = Field("medium", pattern="^(easy|medium|hard)$")
    num_questions: int = Field(5, ge=3, le=15)

class QuizSubmitRequest(BaseModel):
    quiz_id: str
    answers: List[int]

class InterviewRequest(BaseModel):
    role: str = Field(..., min_length=2)
    category: str = Field("technical", pattern="^(hr|technical|aptitude|mock)$")
    num_questions: int = Field(6, ge=3, le=10)

class MindMapRequest(BaseModel):
    topic: str = Field(..., min_length=2, max_length=200)

class PlannerRequest(BaseModel):
    subject: str = Field(..., min_length=2)
    exam_date: Optional[str] = None
    hours_per_day: int = Field(3, ge=1, le=12)
    current_level: Optional[str] = "beginner"

class VoiceRequest(BaseModel):
    transcript: str = Field(..., min_length=1, max_length=1000)
