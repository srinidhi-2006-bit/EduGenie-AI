import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate     = useNavigate()

  const handle = async e => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6)       return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created! Welcome to EduGenie 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-teal-600/8 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl mb-4 shadow-lg">
            🧞
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Join EduGenie AI</h1>
          <p className="text-slate-500 text-sm mt-1">Start your AI-powered learning journey</p>
        </div>

        <div className="card p-8">
          <h2 className="text-lg font-semibold text-slate-200 mb-6">Create your account</h2>
          <form onSubmit={handle} className="space-y-4">
            {[
              { key: 'name',     label: 'Full Name',        type: 'text',     ph: 'Riya Sharma' },
              { key: 'email',    label: 'Email',            type: 'email',    ph: 'you@example.com' },
              { key: 'password', label: 'Password',         type: 'password', ph: '••••••••' },
              { key: 'confirm',  label: 'Confirm Password', type: 'password', ph: '••••••••' },
            ].map(({ key, label, type, ph }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                <input
                  type={type} required value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={ph} className="input"
                />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? <Spinner /> : '✨ Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
            {['🤖 AI Chatbot','📄 PDF Summarizer','🎯 Quiz Generator','🧠 Mind Maps'].map(f => (
              <span key={f}>{f}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Spinner() {
  return <div style={{ width:18,height:18,border:'2px solid rgba(255,255,255,0.2)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
}
