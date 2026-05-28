import httpx
import json
from app.config import settings

class AIService:
    @staticmethod
    async def chat(system_prompt: str, user_message: str, max_tokens: int = 1000) -> str:
        if settings.GROQ_API_KEY:
            return await AIService._groq(system_prompt, user_message, max_tokens)
        elif settings.GEMINI_API_KEY:
            return await AIService._gemini(system_prompt, user_message, max_tokens)
        elif settings.OPENAI_API_KEY:
            return await AIService._openai(system_prompt, user_message, max_tokens)
        else:
            raise ValueError("No AI API key configured in .env")

    @staticmethod
    async def _groq(system: str, user: str, max_tokens: int) -> str:
        async with httpx.AsyncClient(timeout=60) as client:
            res = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
                json={
                    "model": "llama-3.3-70b-versatile",
                    "max_tokens": max_tokens,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user",   "content": user},
                    ],
                },
            )
            data = res.json()
            if "error" in data:
                raise ValueError(f"Groq error: {data['error'].get('message', str(data['error']))}")
            return data["choices"][0]["message"]["content"] 
    @staticmethod
    async def _openai(system: str, user: str, max_tokens: int) -> str:
        async with httpx.AsyncClient(timeout=60) as client:
            res = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                json={"model": "gpt-4o-mini", "max_tokens": max_tokens,
                      "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}]},
            )
            data = res.json()
            if "error" in data:
                raise ValueError(f"OpenAI error: {data['error'].get('message', str(data['error']))}")
            return data["choices"][0]["message"]["content"]

    @staticmethod
    async def chat_json(system_prompt: str, user_message: str, max_tokens: int = 1500) -> dict:
        raw = await AIService.chat(system_prompt, user_message, max_tokens)
        clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        return json.loads(clean)

ai_service = AIService()