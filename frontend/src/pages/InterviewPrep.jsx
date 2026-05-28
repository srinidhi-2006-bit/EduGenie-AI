import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { interviewAPI } from '../api/client'

const CATS = [
  { id: 'hr',        label: '👥 HR Interview',   desc: 'Behavioral & soft skills',     color: '#8b5cf6' },
  { id: 'technical', label: '💻 Technical',       desc: 'Domain-specific questions',    color: '#6366f1' },
  { id: 'aptitude',  label: '🧮 Aptitude',        desc: 'Logic & problem-solving',      color: '#14b8a6' },
  { id: 'mock',      label: '🎭 Mock Interview',  desc: 'Real scenario simulation',     color: '#f59e0b' },
]

const DIFF_COLOR = { easy: '#10b981', medium: '#f59e0b', hard: '#f43f5e' }

export default function InterviewPrep() {
  const [category, setCat]    = useState('technical')
  const [role, setRole]       = useState('')
  const [numQ, setNumQ]       = useState(6)
  const [loading, setLoading] = useState(false)
  const [questions, setQs]    = useState(null)
  const [shown, setShown]     = useState({})

  const generate = async () => {
    if (!role.trim()) return toast.error('Enter a job role first')
    setLoading(true); setQs(null); setShown({})
    try {
      const { data } = await interviewAPI.generate({ role, category, num_questions: numQ })
      setQs(data.questions)
      toast.success(`${data.questions.length} questions ready!`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to generate questions')
    }
    setLoading(false)
  }

  const catColor = CATS.find(c => c.id === category)?.color || '#6366f1'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100">💼 Interview Preparation</h2>
        <p className="text-slate-500 text-sm mt-1">AI-powered interview questions with expert model answers & tips</p>
      </div>

      {/* Category selector */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {CATS.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)}
            className="card p-3 text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ borderColor: category===c.id ? c.color+'50' : undefined, background: category===c.id ? c.color+'10' : undefined }}>
            <div className="text-xs font-semibold mb-0.5" style={{ color: category===c.id ? c.color : '#94a3b8' }}>{c.label}</div>
            <div className="text-xs text-slate-600">{c.desc}</div>
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex gap-3 mb-6">
        <input value={role} onChange={e => setRole(e.target.value)}
          onKeyDown={e => e.key==='Enter' && generate()}
          placeholder="Job role (e.g. Software Engineer, Data Analyst, Product Manager, MBA Finance...)"
          className="input flex-1" />
        <div className="flex items-center gap-2 bg-dark-800 border border-dark-600 rounded-xl px-3">
          <span className="text-xs text-slate-500">Qs:</span>
          <input type="number" min={3} max={10} value={numQ} onChange={e => setNumQ(+e.target.value)}
            className="w-10 bg-transparent text-slate-200 text-sm outline-none text-center" />
        </div>
        <button onClick={generate} disabled={loading || !role.trim()} className="btn-primary px-6"
          style={{ background: `linear-gradient(135deg,${catColor},${catColor}cc)` }}>
          {loading ? <><Spinner /> Generating...</> : '🎯 Generate'}
        </button>
      </div>

      {/* Questions */}
      <AnimatePresence>
        {questions && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-3">
            {questions.map((q, i) => (
              <motion.div key={i} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.04 }}
                className="card overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold" style={{ color: catColor }}>Q{i+1}</span>
                        <span className="badge text-xs" style={{ background: (DIFF_COLOR[q.difficulty]||'#6366f1')+'20', color: DIFF_COLOR[q.difficulty]||'#6366f1', borderColor: (DIFF_COLOR[q.difficulty]||'#6366f1')+'40' }}>
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-slate-200 text-sm leading-relaxed">{q.question}</p>
                    </div>
                    <button onClick={() => setShown(s => ({ ...s, [i]: !s[i] }))}
                      className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
                      style={{
                        background: shown[i] ? catColor+'20' : 'transparent',
                        borderColor: shown[i] ? catColor+'50' : '#1e2d4a',
                        color: shown[i] ? catColor : '#64748b',
                      }}>
                      {shown[i] ? 'Hide' : 'Show Answer'}
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {shown[i] && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                      className="overflow-hidden">
                      <div className="border-t border-dark-600 p-4 bg-dark-700/40 space-y-3">
                        <div>
                          <p className="section-title text-indigo-400">Model Answer</p>
                          <p className="text-slate-300 text-sm leading-relaxed">{q.answer}</p>
                        </div>
                        <div className="flex gap-2 p-3 rounded-xl" style={{ background:'#f59e0b12', border:'1px solid #f59e0b30' }}>
                          <span className="text-yellow-400 text-sm">💡</span>
                          <p className="text-slate-400 text-xs leading-relaxed"><span className="text-yellow-400 font-semibold">Pro Tip: </span>{q.tip}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Spinner() {
  return <div style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
}
