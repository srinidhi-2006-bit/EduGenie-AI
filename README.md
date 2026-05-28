# 🧞 EduGenie AI
### Intelligent Generative AI-Powered Student Learning Assistant

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> **Full-stack AI educational platform** — Major project · Startup MVP · GitHub portfolio · LinkedIn showcase

---

## 🌟 Features

| Module | Description |
|--------|-------------|
| 🔐 **Authentication** | JWT-based signup/login with protected routes |
| 🤖 **AI Chatbot** | Markdown-rendered subject doubt solver with chat history |
| 📄 **PDF Summarizer** | Drag-and-drop upload → AI key points, summary & practice questions |
| 🎯 **Quiz Generator** | MCQs with difficulty levels, countdown timer & instant scoring |
| 💼 **Interview Prep** | HR, Technical, Aptitude & Mock interview questions with model answers |
| 🧠 **Mind Map** | Canvas-rendered visual concept maps with PNG download |
| 📅 **Study Planner** | Personalized 7-day AI schedules with progress tracking |
| 🎙️ **Voice Assistant** | Speech-to-text input + text-to-speech AI output |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 · Vite · Tailwind CSS · Framer Motion · React Router v6 · Axios |
| Backend | FastAPI · Python 3.11+ · Motor (async MongoDB) · PyJWT · Passlib/bcrypt |
| Database | MongoDB 7 (Atlas) |
| AI | OpenAI GPT-4o-mini · Google Gemini Pro · Anthropic Claude (auto-fallback) |
| Deployment | Vercel (frontend) · Render (backend) · MongoDB Atlas |

---

## 📁 Project Structure

```
edugenie/
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js          ← Axios + JWT interceptors + all API calls
│   │   ├── context/
│   │   │   └── AuthContext.jsx    ← Global auth state (login/register/logout)
│   │   ├── components/
│   │   │   └── Layout.jsx         ← Sidebar + topbar layout
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── PDFSummarizer.jsx
│   │   │   ├── QuizGenerator.jsx
│   │   │   ├── InterviewPrep.jsx
│   │   │   ├── MindMap.jsx
│   │   │   ├── StudyPlanner.jsx
│   │   │   └── VoiceAssistant.jsx
│   │   ├── App.jsx                ← Router + protected routes
│   │   ├── main.jsx
│   │   └── index.css              ← Tailwind + custom styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
├── backend/
│   ├── main.py                    ← FastAPI app + CORS + route registration
│   ├── requirements.txt
│   ├── .env.example
│   ├── app/
│   │   ├── config.py              ← Pydantic settings from .env
│   │   ├── database.py            ← Motor async MongoDB connection
│   │   ├── auth.py                ← JWT create/decode + get_current_user
│   │   ├── models/
│   │   │   └── schemas.py         ← All Pydantic request/response models
│   │   ├── routes/
│   │   │   ├── auth.py            ← /register /login /me
│   │   │   ├── chat.py            ← /send /history /clear
│   │   │   ├── pdf.py             ← /upload /history /delete
│   │   │   ├── quiz.py            ← /generate /submit /history
│   │   │   ├── interview.py       ← /generate /history
│   │   │   ├── mindmap.py         ← /generate /history
│   │   │   ├── planner.py         ← /generate /history
│   │   │   └── voice.py           ← /ask /history
│   │   └── services/
│   │       ├── ai_service.py      ← Unified AI wrapper (OpenAI/Gemini/Claude)
│   │       └── pdf_service.py     ← PyPDF2 text extraction
│   ├── db/
│   │   └── init_db.py             ← MongoDB indexes + demo user seed
│   └── uploads/                   ← Uploaded files directory
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+** and **Node.js 18+**
- **MongoDB Atlas** account (free tier works perfectly)
- At least **one** AI API key:
  - [OpenAI](https://platform.openai.com) → `OPENAI_API_KEY`
  - [Google Gemini](https://aistudio.google.com) → `GEMINI_API_KEY`
  - [Anthropic Claude](https://console.anthropic.com) → `ANTHROPIC_API_KEY`

---

### Step 1 — Clone & Setup

```bash
git clone https://github.com/yourusername/edugenie-ai.git
cd edugenie-ai
```

---

### Step 2 — Backend

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Open .env and fill in:
#   MONGO_URI — your MongoDB Atlas connection string
#   OPENAI_API_KEY (or GEMINI_API_KEY or ANTHROPIC_API_KEY)
#   SECRET_KEY — any random 32+ char string

# Initialize database (creates indexes + demo user)
python db/init_db.py

# Start the API server
uvicorn main:app --reload --port 8000
```

✅ API live at: `http://localhost:8000`
📖 Swagger docs: `http://localhost:8000/docs`

---

### Step 3 — Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# (Default points to http://localhost:8000/api — change if needed)

# Start dev server
npm run dev
```

✅ Frontend live at: `http://localhost:5173`

---

### Demo Account

After running `python db/init_db.py`:

```
Email:    demo@edugenie.ai
Password: demo1234
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login → JWT |
| GET | `/api/auth/me` | ✅ | Current user |
| POST | `/api/chat/send` | ✅ | Send chat message |
| GET | `/api/chat/history` | ✅ | Get chat history |
| DELETE | `/api/chat/history` | ✅ | Clear chat history |
| POST | `/api/pdf/upload` | ✅ | Upload & summarize |
| GET | `/api/pdf/history` | ✅ | PDF history |
| POST | `/api/quiz/generate` | ✅ | Generate MCQ quiz |
| POST | `/api/quiz/submit` | ✅ | Submit + get score |
| GET | `/api/quiz/history` | ✅ | Quiz history |
| POST | `/api/interview/generate` | ✅ | Interview questions |
| POST | `/api/mindmap/generate` | ✅ | Mind map JSON |
| POST | `/api/planner/generate` | ✅ | Study plan |
| POST | `/api/voice/ask` | ✅ | Voice → AI answer |

Full interactive docs: `http://localhost:8000/docs`

---

## ☁️ Deployment

### Frontend → Vercel (Free)

```bash
cd frontend
npm run build
# Push to GitHub → import in vercel.com
# Add env var: VITE_API_URL = https://your-backend.onrender.com/api
```

### Backend → Render (Free)

1. Create **Web Service** at [render.com](https://render.com)
2. Connect GitHub repo, root dir = `backend/`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add all `.env` vars in the Render Environment tab

### Database → MongoDB Atlas (Free)

1. Create free M0 cluster at [mongodb.com/atlas](https://cloud.mongodb.com)
2. Network Access → Allow `0.0.0.0/0`
3. Create a database user
4. Copy connection string → paste into `MONGO_URI`

---

## 🔐 Security Checklist

- [ ] Change `SECRET_KEY` before production
- [ ] Never commit `.env` — it's in `.gitignore`
- [ ] Enable MongoDB IP allowlisting in production
- [ ] Add rate limiting middleware for production APIs
- [ ] Set specific CORS origins (not `*`) for production

---

## 🤝 Contributing

Pull requests welcome! Please open an issue first to discuss major changes.

---

## 📄 License

MIT License — free for personal, academic, and commercial use.

---

*Built with ❤️ for students, by a student.*
