import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { plannerAPI } from '../api/client'

const TYPE_META = {
  learn:    { icon: '📚', color: '#6366f1', label: 'Learn' },
  revise:   { icon: '🔄', color: '#14b8a6', label: 'Revise' },
  practice: { icon: '✏️', color: '#f59e0b', label: 'Practice' },
  test:     { icon: '📝', color: '#f43f5e', label: 'Test' },
}

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

export default function StudyPlanner() {
  const [form, setForm]     = useState({ subject: '', exam_date: '', hours_per_day: 3, current_level: 'Beginner' })
  const [loading, setLoad]  = useState(false)
  const [plan, setPlan]     = useState(null)
  const [checked, setChecked] = useState({})

  const today = new Date().toISOString().split('T')[0]

  const generate = async () => {
    if (!form.subject.trim()) return toast.error('Enter a subject or goal first')
    setLoad(true); setPlan(null); setChecked({})
    try {
      const { data } = await plannerAPI.generate({ ...form, hours_per_day: +form.hours_per_day })
      setPlan(data)
      toast.success('Study plan ready!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to generate plan')
    }
    setLoad(false)
  }

  const daysLeft = form.exam_date
    ? Math.max(0, Math.ceil((new Date(form.exam_date) - new Date()) / 86400000))
    : null

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100">📅 Study Planner</h2>
        <p className="text-slate-500 text-sm mt-1">AI-crafted personalized schedules based on your goals & exam date</p>
      </div>

      {/* Config */}
      <div className="card p-6 mb-6">
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div>
            <label className="section-title">Subject / Goal</label>
            <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              placeholder="e.g. UPSC Prelims, JEE Physics, Data Structures, IELTS..."
              className="input" />
          </div>
          <div>
            <label className="section-title">Exam Date (optional)</label>
            <input type="date" min={today} value={form.exam_date}
              onChange={e => setForm(f => ({ ...f, exam_date: e.target.value }))}
              className="input" />
            {daysLeft !== null && (
              <p className="text-xs mt-1" style={{ color: daysLeft < 7 ? '#f43f5e' : '#64748b' }}>
                {daysLeft === 0 ? '⚠️ Exam is today!' : `📆 ${daysLeft} days remaining`}
              </p>
            )}
          </div>
          <div>
            <label className="section-title">Study Hours / Day: {form.hours_per_day}h</label>
            <input type="range" min={1} max={12} value={form.hours_per_day}
              onChange={e => setForm(f => ({ ...f, hours_per_day: e.target.value }))}
              className="w-full mt-2 accent-purple-500" />
            <div className="flex justify-between text-xs text-slate-600 mt-0.5"><span>1h</span><span>12h</span></div>
          </div>
          <div>
            <label className="section-title">Current Level</label>
            <div className="flex gap-2 mt-1">
              {LEVELS.map(l => (
                <button key={l} onClick={() => setForm(f => ({ ...f, current_level: l }))}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-all"
                  style={{
                    background: form.current_level===l ? '#a78bfa20' : 'transparent',
                    borderColor: form.current_level===l ? '#a78bfa60' : '#1e2d4a',
                    color: form.current_level===l ? '#a78bfa' : '#64748b',
                  }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={generate} disabled={loading || !form.subject.trim()} className="btn-primary w-full"
          style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)' }}>
          {loading ? <><Spinner /> Crafting your plan...</> : '📅 Generate Study Plan'}
        </button>
      </div>

      {/* Plan output */}
      <AnimatePresence>
        {plan && (
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
            <div className="grid grid-cols-3 gap-5">
              {/* 7-day schedule */}
              <div className="col-span-2">
                <p className="section-title">7-Day Schedule</p>
                <div className="space-y-3">
                  {plan.dailyPlan?.map((day, i) => {
                    const meta = TYPE_META[day.type] || TYPE_META.learn
                    const done = checked[i]
                    return (
                      <motion.div key={i} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.04 }}
                        className="card p-4 flex gap-3 items-start transition-all"
                        style={{ opacity: done ? 0.55 : 1 }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: meta.color+'18', border: `1px solid ${meta.color}30` }}>
                          {meta.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-slate-200">Day {day.day}: {day.topic}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium" style={{ color: meta.color }}>{day.duration}</span>
                              <span className="badge text-xs" style={{ background: meta.color+'18', color: meta.color, borderColor: meta.color+'30' }}>{meta.label}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {day.tasks?.map((t, ti) => (
                              <span key={ti} className="text-xs text-slate-500 bg-dark-900 px-2 py-0.5 rounded-md border border-dark-600">{t}</span>
                            ))}
                          </div>
                        </div>
                        <input type="checkbox" checked={!!done} onChange={() => setChecked(c => ({ ...c, [i]: !c[i] }))}
                          className="mt-1 accent-purple-500 flex-shrink-0" />
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Sidebar: goals + tips */}
              <div className="space-y-4">
                <div>
                  <p className="section-title">Weekly Goals</p>
                  <div className="card p-4 space-y-2.5">
                    {plan.weeklyGoals?.map((g, i) => (
                      <div key={i} className="flex gap-2 text-xs">
                        <span style={{ color: '#a78bfa' }}>◆</span>
                        <span className="text-slate-400 leading-relaxed">{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="section-title">Study Tips</p>
                  <div className="card p-4 space-y-2.5">
                    {plan.tips?.map((t, i) => (
                      <div key={i} className="flex gap-2 text-xs">
                        <span>💡</span>
                        <span className="text-slate-400 leading-relaxed">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Progress */}
                <div className="card p-4">
                  <p className="section-title">Progress</p>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {Object.values(checked).filter(Boolean).length}/{plan.dailyPlan?.length || 7}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Days completed</div>
                    <div className="mt-3 h-2 bg-dark-900 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ background:'linear-gradient(90deg,#a78bfa,#7c3aed)', width: `${Math.round(Object.values(checked).filter(Boolean).length/(plan.dailyPlan?.length||7)*100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Spinner() {
  return <div style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
}
