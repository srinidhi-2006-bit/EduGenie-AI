import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { voiceAPI } from '../api/client'

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse]     = useState('')
  const [loading, setLoading]       = useState(false)
  const [history, setHistory]       = useState([])
  const recRef = useRef(null)

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  const supported = !!SR

  const startListen = () => {
    if (!SR) return toast.error('Speech recognition not supported. Use Chrome.')
    const rec = new SR()
    recRef.current = rec
    rec.continuous = false; rec.interimResults = false; rec.lang = 'en-US'
    rec.onresult = e => {
      const text = e.results[0][0].transcript
      setTranscript(text); setListening(false); askAI(text)
    }
    rec.onerror = () => { setListening(false); toast.error('Microphone error') }
    rec.onend = () => setListening(false)
    rec.start(); setListening(true)
  }

  const stopListen = () => { recRef.current?.stop(); setListening(false) }

  const speak = text => {
    window.speechSynthesis?.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.95; u.pitch = 1.05
    window.speechSynthesis?.speak(u)
  }

  const askAI = async text => {
    if (!text.trim()) return
    setLoading(true); setResponse('')
    try {
      const { data } = await voiceAPI.ask({ transcript: text })
      setResponse(data.reply)
      setHistory(h => [{ q: text, a: data.reply, time: new Date().toLocaleTimeString() }, ...h.slice(0, 9)])
      speak(data.reply)
      toast.success('Response ready!')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to get response'
      toast.error(msg); setResponse('⚠️ Could not get a response. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100">🎙️ Voice Assistant</h2>
        <p className="text-slate-500 text-sm mt-1">Speak or type questions — get AI answers read aloud</p>
      </div>

      {/* Mic + status */}
      <div className="card p-10 text-center mb-6 relative overflow-hidden"
        style={{ background: listening ? 'linear-gradient(135deg,#f43f5e08,#0a0b14)' : undefined }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <div className="relative inline-block mb-5">
            {listening && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                className="absolute inset-0 rounded-full"
                style={{ background: '#f43f5e20', transform: 'scale(1.5)' }}
              />
            )}
            <button
              onClick={listening ? stopListen : startListen}
              className="relative w-24 h-24 rounded-full border-2 flex items-center justify-center text-4xl transition-all duration-200"
              style={{
                background: listening
                  ? 'linear-gradient(135deg,#f43f5e,#e11d48)'
                  : 'linear-gradient(135deg,#fb923c,#ea580c)',
                borderColor: listening ? '#f43f5e80' : '#fb923c80',
                boxShadow: `0 0 30px ${listening ? '#f43f5e' : '#fb923c'}25`,
              }}>
              {listening ? '⏹' : '🎙️'}
            </button>
          </div>
          <p className="text-slate-300 font-medium text-sm">
            {loading ? '⚙️ Processing your question...' : listening ? '🔴 Listening... speak now' : '🎙️ Tap to speak'}
          </p>
          {!supported && (
            <p className="text-rose-400 text-xs mt-2">⚠️ Speech recognition requires Chrome or Edge</p>
          )}
        </div>
      </div>

      {/* Text input fallback */}
      <div className="card p-5 mb-5">
        <label className="section-title">Or type your question</label>
        <div className="flex gap-3">
          <textarea
            value={transcript} onChange={e => setTranscript(e.target.value)}
            placeholder="Type your question here..."
            className="input flex-1 resize-none" rows={2}
            onKeyDown={e => e.key==='Enter' && !e.shiftKey && (e.preventDefault(), askAI(transcript))}
          />
          <button onClick={() => askAI(transcript)} disabled={loading || !transcript.trim()} className="btn-primary px-5 self-start"
            style={{ background: 'linear-gradient(135deg,#fb923c,#ea580c)' }}>
            {loading ? <Spinner /> : 'Ask ↗'}
          </button>
        </div>
      </div>

      {/* Current response */}
      <AnimatePresence>
        {response && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="card p-5 mb-5"
            style={{ borderColor: '#fb923c30', background: 'linear-gradient(135deg,#fb923c08,#0a0b14)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="section-title text-orange-400 mb-0">EduGenie Response</p>
              <button onClick={() => speak(response)} className="text-xs px-3 py-1 rounded-lg border transition-all"
                style={{ borderColor:'#fb923c40', color:'#fb923c', background:'#fb923c15' }}>
                🔊 Replay
              </button>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{response}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      {history.length > 0 && (
        <div>
          <p className="section-title">Conversation History</p>
          <div className="space-y-2">
            {history.map((item, i) => (
              <motion.div key={i} initial={{ opacity:0 }} animate={{ opacity:1 }}
                className="card p-4 text-sm">
                <div className="flex items-start gap-2 mb-1.5">
                  <span className="text-orange-400">🎓</span>
                  <span className="text-slate-300 font-medium flex-1">{item.q}</span>
                  <span className="text-slate-600 text-xs flex-shrink-0">{item.time}</span>
                </div>
                <div className="flex gap-2 ml-5">
                  <span className="text-orange-400">🤖</span>
                  <span className="text-slate-500 leading-relaxed line-clamp-2">{item.a}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Spinner() {
  return <div style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
}
