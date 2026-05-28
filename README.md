# 🧞 EduGenie AI

### Intelligent Generative AI-Powered Student Learning Assistant

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3-F55036?logo=groq&logoColor=white)](https://console.groq.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> **Full-stack AI educational platform** — Major project · Startup MVP · GitHub portfolio · LinkedIn showcase

---

## 🌟 Features

| Module                 | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| 🔐 **Authentication**  | JWT-based signup/login with protected routes                          |
| 🤖 **AI Chatbot**      | Markdown-rendered subject doubt solver with chat history              |
| 📄 **PDF Summarizer**  | Drag-and-drop upload → AI key points, summary & practice questions    |
| 🎯 **Quiz Generator**  | MCQs with difficulty levels, countdown timer & instant scoring        |
| 💼 **Interview Prep**  | HR, Technical, Aptitude & Mock interview questions with model answers |
| 🧠 **Mind Map**        | Canvas-rendered visual concept maps with PNG download                 |
| 📅 **Study Planner**   | Personalized 7-day AI schedules with progress tracking                |
| 🎙️ **Voice Assistant** | Speech-to-text input + text-to-speech AI output                       |

---

## 🏗️ Tech Stack

| Layer      | Technology                                                                     |
| ---------- | ------------------------------------------------------------------------------ |
| Frontend   | React 18 · Vite · Tailwind CSS · Framer Motion · React Router v6 · Axios       |
| Backend    | FastAPI · Python 3.9+ · Motor (async MongoDB) · PyJWT · bcrypt                 |
| Database   | MongoDB (Atlas or Local)                                                       |
| AI         | **Groq LLaMA 3.3 70B** (primary, free) · Gemini 2.0 Flash · OpenAI GPT-4o-mini |
| Deployment | Vercel (frontend) · Render (backend) · MongoDB Atlas                           |

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
│   │   ├── auth.py                ← JWT + bcrypt (no passlib)
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
│   │       ├── ai_service.py      ← Groq → Gemini → OpenAI (auto-fallback)
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

- **Python 3.9+** and **Node.js 18+**
- **MongoDB** — local (`mongodb://localhost:27017`) or [Atlas free tier](https://cloud.mongodb.com)
- **Groq API key** — free forever at [console.groq.com](https://console.groq.com) ← recommended

---

### Step 1 — Clone

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
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env       # Windows
# cp .env.example .env       # Mac/Linux

# Edit .env — fill in MONGO_URI and GROQ_API_KEY (see .env setup below)

# Initialize database (indexes + demo user)
python db/init_db.py

# Start API server
uvicorn main:app --reload --port 8000
```

✅ API live at: `http://localhost:8000`  
📖 Swagger docs: `http://localhost:8000/docs`

---

### Step 3 — Frontend

```bash
cd frontend

npm install

# Create env file
echo VITE_API_URL=http://localhost:8000/api > .env.local

npm run dev
```

✅ Frontend live at: `http://localhost:5173`

---

## ⚙️ .env Setup

Create `backend/.env` with these values:

```env
# ── MongoDB ──────────────────────────────────────────────────────
MONGO_URI=mongodb://localhost:27017
DB_NAME=edugenie_db

# ── JWT ──────────────────────────────────────────────────────────
SECRET_KEY=your-random-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# ── AI API — set GROQ_API_KEY (free, recommended) ────────────────
GROQ_API_KEY=gsk_...          ← get free at console.groq.com
GEMINI_API_KEY=               ← optional fallback
OPENAI_API_KEY=               ← optional fallback

# ── File Upload ──────────────────────────────────────────────────
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10
```

### AI Key Priority (auto-detected)

The backend tries keys in this order:

1. **Groq** → `GROQ_API_KEY` — ✅ Free forever, fastest, LLaMA 3.3 70B
2. **Gemini** → `GEMINI_API_KEY` — Free tier (limited), model: `gemini-2.0-flash`
3. **OpenAI** → `OPENAI_API_KEY` — Paid, model: `gpt-4o-mini`

Set at least one. **Groq is strongly recommended** — no billing, no quota issues.

---

### Get a Free Groq Key (2 minutes)

1. Go to **[console.groq.com](https://console.groq.com)** → Sign up with Google
2. Click **API Keys** → **Create API Key**
3. Copy the key (starts with `gsk_...`) → paste into `.env`

---

## 👤 Demo Account

After running `python db/init_db.py`:

```
Email:    demo@edugenie.ai
Password: demo1234
```

---

## 🔌 API Reference

| Method | Endpoint                  | Auth | Description         |
| ------ | ------------------------- | ---- | ------------------- |
| POST   | `/api/auth/register`      | ❌   | Create account      |
| POST   | `/api/auth/login`         | ❌   | Login → JWT         |
| GET    | `/api/auth/me`            | ✅   | Current user        |
| POST   | `/api/chat/send`          | ✅   | Send chat message   |
| GET    | `/api/chat/history`       | ✅   | Get chat history    |
| DELETE | `/api/chat/history`       | ✅   | Clear chat history  |
| POST   | `/api/pdf/upload`         | ✅   | Upload & summarize  |
| GET    | `/api/pdf/history`        | ✅   | PDF history         |
| POST   | `/api/quiz/generate`      | ✅   | Generate MCQ quiz   |
| POST   | `/api/quiz/submit`        | ✅   | Submit + get score  |
| GET    | `/api/quiz/history`       | ✅   | Quiz history        |
| POST   | `/api/interview/generate` | ✅   | Interview questions |
| POST   | `/api/mindmap/generate`   | ✅   | Mind map JSON       |
| POST   | `/api/planner/generate`   | ✅   | Study plan          |
| POST   | `/api/voice/ask`          | ✅   | Voice → AI answer   |

Full interactive docs: `http://localhost:8000/docs`

---

## 🐛 Troubleshooting

| Error                          | Fix                                                                         |
| ------------------------------ | --------------------------------------------------------------------------- |
| `passlib` / bcrypt crash       | Removed — now uses `bcrypt` directly. Run `pip install -r requirements.txt` |
| `BaseSettings` import error    | Use `from pydantic_settings import BaseSettings` in `config.py`             |
| `gemini-pro` not found         | Deprecated — use `gemini-2.0-flash`                                         |
| `gemini-1.5-flash` not found   | Deprecated — use `gemini-2.0-flash`                                         |
| Gemini `limit: 0` quota error  | Switch to Groq (free, no quota issues)                                      |
| `KeyError: candidates` in Groq | Wrong return line — Groq uses `data["choices"][0]["message"]["content"]`    |
| `KeyError: choices` in OpenAI  | Invalid/expired key or no credits — switch to Groq                          |

---

## ☁️ Deployment

### Frontend → Vercel (Free)

```bash
cd frontend && npm run build
# Push to GitHub → import at vercel.com
# Add env var: VITE_API_URL = https://your-backend.onrender.com/api
```

### Backend → Render (Free)

1. Create **Web Service** at [render.com](https://render.com)
2. Connect GitHub repo, root dir = `backend/`
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add all `.env` variables in Render's Environment tab

### Database → MongoDB Atlas (Free)

1. Create free M0 cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Network Access → Allow `0.0.0.0/0`
3. Create a database user
4. Copy connection string → paste into `MONGO_URI`

---

## 🔐 Security Checklist

- [ ] Change `SECRET_KEY` to a random 32+ char string before production
- [ ] Never commit `.env` — already in `.gitignore`
- [ ] Enable MongoDB IP allowlisting in production
- [ ] Set specific CORS origins (not `*`) in production
- [ ] Add rate limiting middleware for production APIs

---

## 📦 requirements.txt

```
fastapi==0.111.0
uvicorn[standard]==0.29.0
motor==3.4.0
pymongo==4.7.2
pydantic==2.7.1
pydantic-settings==2.2.1
python-jose[cryptography]==3.3.0
bcrypt==4.1.3
httpx==0.27.0
python-multipart==0.0.9
PyPDF2==3.0.1
python-dotenv==1.0.1
```

> ⚠️ Do **not** add `passlib` — it's incompatible with `bcrypt 4.x`. The project uses `bcrypt` directly.

---

## 🤝 Contributing

Pull requests welcome! Please open an issue first to discuss major changes.

---

## 📄 License

MIT License — free for personal, academic, and commercial use.

---

_Built with ❤️ for students, by a student._
