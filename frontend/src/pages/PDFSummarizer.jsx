import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { pdfAPI } from '../api/client'

export default function PDFSummarizer() {
  const [file, setFile]       = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)
  const inputRef = useRef(null)

  const handleFile = f => {
    const allowed = ['.pdf', '.txt', '.md']
    const ext = '.' + f.name.split('.').pop().toLowerCase()
    if (!allowed.includes(ext)) return toast.error('Only .pdf, .txt, .md files supported')
    if (f.size > 10 * 1024 * 1024) return toast.error('File too large (max 10MB)')
    setFile(f)
    setResult(null)
  }

  const onDrop = e => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const analyze = async () => {
    if (!file) return toast.error('Please select a file first')
    setLoading(true); setResult(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const { data } = await pdfAPI.upload(fd)
      setResult(data)
      toast.success('Document analyzed successfully!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to analyze document')
    }
    setLoading(false)
  }

  const DIFF_COLOR = { Beginner: '#10b981', Intermediate: '#f59e0b', Advanced: '#f43f5e' }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100">📄 PDF Summarizer</h2>
        <p className="text-slate-500 text-sm mt-1">Upload a document and get AI-powered summaries, key points & practice questions</p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`card p-10 text-center cursor-pointer transition-all duration-200 mb-4
          ${dragging ? 'border-teal-500/60 bg-teal-500/5' : 'hover:border-slate-500/50 hover:bg-dark-700/30'}
          ${file ? 'border-teal-500/40' : 'border-dashed'}`}
      >
        <input ref={inputRef} type="file" accept=".pdf,.txt,.md" className="hidden" onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
        <div className="text-4xl mb-3">{file ? '📄' : '☁️'}</div>
        {file ? (
          <div>
            <p className="text-teal-400 font-semibold text-sm">{file.name}</p>
            <p className="text-slate-500 text-xs mt-1">{(file.size/1024).toFixed(1)} KB · Click to change</p>
          </div>
        ) : (
          <div>
            <p className="text-slate-300 font-medium text-sm">Drop your file here or click to browse</p>
            <p className="text-slate-500 text-xs mt-1">Supports PDF, TXT, MD · Max 10MB</p>
          </div>
        )}
      </div>

      <button onClick={analyze} disabled={loading || !file}
        className="btn-primary w-full mb-8"
        style={{ background: !file ? undefined : 'linear-gradient(135deg,#14b8a6,#0d9488)' }}>
        {loading ? <><Spinner /> Analyzing document...</> : '✨ Analyze & Summarize'}
      </button>

      {/* Results */}
      <AnimatePresence>
        {result && !result.error && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="space-y-4">
            {/* Meta badges */}
            <div className="flex flex-wrap gap-2">
              <span className="badge" style={{ background: (DIFF_COLOR[result.difficulty]||'#6366f1')+'20', color: DIFF_COLOR[result.difficulty]||'#6366f1', borderColor: (DIFF_COLOR[result.difficulty]||'#6366f1')+'40' }}>
                📊 {result.difficulty}
              </span>
              <span className="badge" style={{ background:'#f59e0b20',color:'#f59e0b',borderColor:'#f59e0b40' }}>
                ⏱ {result.estimated_read_time}
              </span>
              {result.topics?.map(t => (
                <span key={t} className="badge" style={{ background:'#8b5cf620',color:'#8b5cf6',borderColor:'#8b5cf640' }}>{t}</span>
              ))}
            </div>

            {/* Summary */}
            <div className="card p-5">
              <p className="section-title text-teal-500">📝 Summary</p>
              <p className="text-slate-300 text-sm leading-relaxed">{result.summary}</p>
            </div>

            {/* Key Points + Questions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-5">
                <p className="section-title text-yellow-500">⭐ Key Points</p>
                <ol className="space-y-2">
                  {result.key_points?.map((p, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-yellow-500 font-bold flex-shrink-0">{i+1}.</span>
                      <span className="text-slate-300 leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="card p-5">
                <p className="section-title text-rose-500">❓ Practice Questions</p>
                <ol className="space-y-2">
                  {result.important_questions?.map((q, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-rose-500 font-bold flex-shrink-0">Q{i+1}.</span>
                      <span className="text-slate-300 leading-relaxed">{q}</span>
                    </li>
                  ))}
                </ol>
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
