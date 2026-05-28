import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const MODULES = [
  { to: '/chatbot',   icon: '🤖', title: 'AI Chatbot',       desc: 'Ask doubts, get instant explanations', color: '#8b5cf6', badge: 'Most Used' },
  { to: '/pdf',       icon: '📄', title: 'PDF Summarizer',   desc: 'Upload docs & extract key insights',   color: '#14b8a6', badge: 'Popular' },
  { to: '/quiz',      icon: '🎯', title: 'Quiz Generator',   desc: 'MCQs with scoring & explanations',     color: '#f59e0b', badge: 'Fun' },
  { to: '/interview', icon: '💼', title: 'Interview Prep',   desc: 'HR, Tech & Aptitude questions',        color: '#f43f5e', badge: 'Career' },
  { to: '/mindmap',   icon: '🧠', title: 'Mind Map',         desc: 'Visualize concepts & relationships',   color: '#10b981', badge: 'Visual' },
  { to: '/planner',   icon: '📅', title: 'Study Planner',    desc: 'Personalized AI study schedules',      color: '#a78bfa', badge: 'Planner' },
  { to: '/voice',     icon: '🎙️', title: 'Voice Assistant',  desc: 'Hands-free AI voice interaction',      color: '#fb923c', badge: 'Voice' },
]

const STATS = [
  { label: 'AI Modules',    value: '8',   icon: '⚡', color: '#6366f1' },
  { label: 'Subjects',      value: '∞',   icon: '📚', color: '#14b8a6' },
  { label: 'Quiz Levels',   value: '3',   icon: '🎯', color: '#f59e0b' },
  { label: 'Languages',     value: '10+', icon: '🌍', color: '#10b981' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="mb-8">
        <div className="card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="text-5xl">👋</div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100 mb-1">
                  Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                  Your AI-powered learning assistant is ready. Choose a module below to start studying, practice for interviews, generate quizzes, or explore concepts visually.
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => navigate('/chatbot')} className="btn-primary text-sm">
                🤖 Start Chatting
              </button>
              <button onClick={() => navigate('/quiz')} className="btn-ghost text-sm">
                🎯 Take a Quiz
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
            className="card p-4 relative overflow-hidden">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            <div className="absolute -right-3 -bottom-3 text-5xl opacity-5">{s.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* Modules grid */}
      <div className="mb-4">
        <p className="section-title">All Modules</p>
        <div className="grid grid-cols-2 gap-3">
          {MODULES.map((m, i) => (
            <motion.div
              key={m.to}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
              onClick={() => navigate(m.to)}
              className="card p-4 cursor-pointer hover:border-opacity-60 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] group"
              style={{ borderColor: m.color + '25' }}
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: m.color + '18', border: `1px solid ${m.color}30` }}>
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-slate-200">{m.title}</span>
                    <span className="badge text-xs" style={{ background: m.color+'15', color: m.color, borderColor: m.color+'30' }}>
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
                </div>
                <span className="text-slate-600 group-hover:text-slate-400 transition-colors text-sm mt-0.5">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pro tip */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
        className="card p-4 mt-4 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, #6366f115, #8b5cf610)', borderColor: '#6366f130' }}>
        <div className="text-3xl">💡</div>
        <div>
          <div className="text-sm font-semibold text-slate-200 mb-0.5">Study Tip</div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Upload your notes to <span className="text-teal-400 font-medium">PDF Summarizer</span> → generate a <span className="text-yellow-400 font-medium">Quiz</span> from the summary → review weak areas with the <span className="text-purple-400 font-medium">AI Chatbot</span>. Proven 3-step retention loop!
          </div>
        </div>
      </motion.div>
    </div>
  )
}
