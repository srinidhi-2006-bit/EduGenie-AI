import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { quizAPI } from '../api/client'

const DIFF = [
  { id: 'easy',   label: '😊 Easy',   color: '#10b981' },
  { id: 'medium', label: '🎯 Medium', color: '#f59e0b' },
  { id: 'hard',   label: '🔥 Hard',   color: '#f43f5e' },
]

export default function QuizGenerator() {
  const [topic, setTopic]         = useState('')
  const [difficulty, setDiff]     = useState('medium')
  const [numQ, setNumQ]           = useState(5)
  const [loading, setLoading]     = useState(false)
  const [quiz, setQuiz]           = useState(null)
  const [quizId, setQuizId]       = useState(null)
  const [answers, setAnswers]     = useState({})
  const [result, setResult]       = useState(null)
  const [timeLeft, setTimeLeft]   = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) {
      if (timeLeft === 0 && quiz && !result) submitQuiz()
      return
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [timeLeft])

  const generate = async () => {
    if (!topic.trim()) return toast.error('Enter a topic first')
    setLoading(true); setQuiz(null); setResult(null); setAnswers({})
    try {
      const { data } = await quizAPI.generate({ topic, difficulty, num_questions: numQ })
      setQuiz(data.questions)
      setQuizId(data.quiz_id)
      setTimeLeft(numQ * 45)
      toast.success(`${data.questions.length} questions generated!`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to generate quiz')
    }
    setLoading(false)
  }

  const submitQuiz = async () => {
    clearTimeout(timerRef.current); setTimeLeft(null)
    const userAnswers = quiz.map((_, i) => answers[i] ?? -1)
    try {
      const { data } = await quizAPI.submit({ quiz_id: quizId, answers: userAnswers })
      setResult(data)
    } catch {
      toast.error('Failed to submit quiz')
    }
  }

  const reset = () => { setQuiz(null); setResult(null); setAnswers({}); setTopic('') }

  const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`

  const diffColor = DIFF.find(d => d.id === difficulty)?.color || '#6366f1'

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100">🎯 Quiz Generator</h2>
        <p className="text-slate-500 text-sm mt-1">AI-generated MCQs with instant scoring & explanations</p>
      </div>

      {/* Config panel */}
      {!quiz && (
        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="card p-6 mb-6">
          <div className="space-y-5">
            <div>
              <label className="section-title">Topic / Subject</label>
              <input value={topic} onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key==='Enter' && generate()}
                placeholder="e.g. Photosynthesis, Python basics, World War II, Newton's Laws..."
                className="input" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="section-title">Difficulty</label>
                <div className="flex gap-2">
                  {DIFF.map(d => (
                    <button key={d.id} onClick={() => setDiff(d.id)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all border"
                      style={{
                        background: difficulty===d.id ? d.color+'25' : 'transparent',
                        borderColor: difficulty===d.id ? d.color+'60' : '#1e2d4a',
                        color: difficulty===d.id ? d.color : '#64748b',
                      }}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="section-title">Questions: {numQ}</label>
                <input type="range" min={3} max={10} value={numQ} onChange={e => setNumQ(+e.target.value)}
                  className="w-full mt-2 accent-indigo-500" />
                <div className="flex justify-between text-xs text-slate-600 mt-1"><span>3</span><span>10</span></div>
              </div>
            </div>
            <button onClick={generate} disabled={loading || !topic.trim()} className="btn-primary w-full"
              style={{ background: `linear-gradient(135deg,${diffColor},${diffColor}cc)` }}>
              {loading ? <><Spinner /> Generating...</> : `🎯 Generate ${numQ} Questions`}
            </button>
          </div>
        </motion.div>
      )}

      {/* Quiz */}
      {quiz && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
          {/* Quiz header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex gap-2">
              <span className="badge" style={{ background: diffColor+'20', color: diffColor, borderColor: diffColor+'40' }}>{topic}</span>
              <span className="badge" style={{ background: diffColor+'15', color: diffColor, borderColor: diffColor+'30' }}>{difficulty}</span>
            </div>
            {timeLeft !== null && !result && (
              <div className="font-mono text-sm px-3 py-1.5 rounded-xl border"
                style={{ background: timeLeft<30?'#f43f5e18':'#1a2035', borderColor: timeLeft<30?'#f43f5e50':'#1e2d4a', color: timeLeft<30?'#f43f5e':'#e2e8f0' }}>
                ⏱ {fmt(timeLeft)}
              </div>
            )}
          </div>

          {/* Result banner */}
          {result && (
            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
              className="card p-6 text-center mb-6"
              style={{ background: 'linear-gradient(135deg,#f59e0b15,#10b98110)', borderColor: '#f59e0b30' }}>
              <div className="text-5xl mb-2">
                {result.percentage===100?'🏆':result.percentage>=70?'🎉':result.percentage>=50?'😊':'😅'}
              </div>
              <div className="text-3xl font-bold text-yellow-400">{result.score}/{result.total}</div>
              <div className="text-slate-400 text-sm mt-1">{result.percentage}% — {
                result.percentage===100?'Perfect score! Outstanding!':
                result.percentage>=70?'Great job! Keep it up!':
                result.percentage>=50?'Good effort! Review the explanations.':
                'Keep practicing! Check the answers below.'
              }</div>
              <button onClick={reset} className="btn-ghost mt-4 mx-auto">Try New Quiz</button>
            </motion.div>
          )}

          {/* Questions */}
          <div className="space-y-4">
            {quiz.map((q, qi) => (
              <motion.div key={qi} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: qi*0.03 }}
                className="card p-5">
                <div className="text-sm font-medium text-slate-200 mb-4">
                  <span className="text-yellow-400 font-bold mr-2">Q{qi+1}.</span>{q.question}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, oi) => {
                    const chosen = answers[qi] === oi
                    const isCorrect = result && oi === result.correct_answers[qi]
                    const isWrong   = result && chosen && !isCorrect
                    return (
                      <button key={oi} disabled={!!result}
                        onClick={() => !result && setAnswers(a => ({ ...a, [qi]: oi }))}
                        className="text-left px-4 py-2.5 rounded-xl text-sm transition-all border"
                        style={{
                          background: isCorrect?'#10b98118':isWrong?'#f43f5e18':chosen?'#6366f118':'#0a0b14',
                          borderColor: isCorrect?'#10b98150':isWrong?'#f43f5e50':chosen?'#6366f150':'#1e2d4a',
                          color: isCorrect?'#10b981':isWrong?'#f43f5e':chosen?'#818cf8':'#94a3b8',
                        }}>
                        {result && isCorrect && <span className="mr-2">✓</span>}
                        {result && isWrong   && <span className="mr-2">✗</span>}
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {result && (
                  <div className="mt-3 px-4 py-2.5 rounded-xl text-xs text-slate-400 leading-relaxed"
                    style={{ background:'#6366f110', border:'1px solid #6366f125' }}>
                    💡 {result.explanations[qi]}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {!result && (
            <button onClick={submitQuiz} className="btn-primary w-full mt-6"
              style={{ background: `linear-gradient(135deg,${diffColor},${diffColor}cc)` }}>
              ✓ Submit Quiz
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}

function Spinner() {
  return <div style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
}
