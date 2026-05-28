import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import toast from 'react-hot-toast'
import { chatAPI } from '../api/client'

const SUGGESTIONS = [
  'Explain quantum entanglement simply',
  'How do I solve quadratic equations?',
  'What is Big O notation in DSA?',
  'Explain the French Revolution',
  'How does DNA replication work?',
  'What is gradient descent in ML?',
]

function TypingDots() {
  return (
    <div className="flex gap-1 items-center py-1 px-1">
      {[0,1,2].map(i => (
        <div key={i} className="w-2 h-2 rounded-full bg-indigo-400"
          style={{ animation: `bounce-d 1.2s ${i*0.2}s ease-in-out infinite` }} />
      ))}
    </div>
  )
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey there! 👋 I'm **EduGenie**, your AI study companion.\n\nAsk me anything — math problems, coding doubts, history questions, science concepts — I'm here to help you understand and learn!" }
  ])
  const [input, setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const send = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    setMessages(m => [...m, { role: 'user', content: msg }])
    setLoading(true)
    try {
      const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }))
      const { data } = await chatAPI.send({ message: msg, history })
      setMessages(m => [...m, { role: 'assistant', content: data.reply }])
    } catch {
      toast.error('Failed to get response. Is the backend running?')
      setMessages(m => [...m, { role: 'assistant', content: '⚠️ Sorry, I couldn\'t reach the server. Please try again.' }])
    }
    setLoading(false)
    inputRef.current?.focus()
  }

  const clearHistory = async () => {
    try { await chatAPI.clear() } catch {}
    setMessages([{ role: 'assistant', content: "Hey there! 👋 I'm **EduGenie**, your AI study companion. How can I help you today?" }])
    toast.success('Chat cleared')
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 130px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-100">🤖 AI Study Chatbot</h2>
          <p className="text-slate-500 text-sm">Ask anything — doubts, coding help, explanations</p>
        </div>
        <button onClick={clearHistory} className="btn-ghost text-xs">🗑 Clear</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5
                ${msg.role === 'user' ? 'bg-indigo-500/20' : 'bg-purple-500/20'}`}>
                {msg.role === 'user' ? '🎓' : '🤖'}
              </div>
              <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-sm'
                  : 'card rounded-tl-sm text-slate-200'}`}>
                {msg.role === 'assistant'
                  ? <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-invert prose-sm max-w-none prose-pre:bg-dark-900 prose-pre:border prose-pre:border-dark-600">{msg.content}</ReactMarkdown>
                  : msg.content
                }
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
            <div className="card px-4 py-3 rounded-2xl rounded-tl-sm"><TypingDots /></div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions (first message only) */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 mb-3 flex-shrink-0">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)}
              className="text-xs px-3 py-1.5 rounded-full bg-dark-700 border border-dark-600 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/40 transition-all">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 flex-shrink-0">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
          placeholder="Ask anything..."
          className="input flex-1"
          disabled={loading}
        />
        <button onClick={() => send()} disabled={loading || !input.trim()} className="btn-primary px-5">
          {loading ? <Spinner /> : '↗ Send'}
        </button>
      </div>
    </div>
  )
}

function Spinner() {
  return <div style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
}
