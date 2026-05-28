import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { mindmapAPI } from '../api/client'

function drawMindMap(canvas, mapData) {
  const W = canvas.width  = canvas.offsetWidth  || 800
  const H = canvas.height = canvas.offsetHeight || 500
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, W, H)

  // Background
  ctx.fillStyle = '#0a0b14'
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2, cy = H / 2
  const branches = mapData.branches || []
  const angleStep = (2 * Math.PI) / branches.length
  const branchR = Math.min(W, H) * 0.27
  const nodeR   = Math.min(W, H) * 0.13

  const drawRRect = (x, y, w, h, r, fill, stroke, lw = 1.5) => {
    ctx.beginPath()
    ctx.roundRect(x - w/2, y - h/2, w, h, r)
    ctx.fillStyle = fill; ctx.fill()
    ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke()
  }

  // Center node
  const grad = ctx.createLinearGradient(cx-65, cy-22, cx+65, cy+22)
  grad.addColorStop(0, '#6366f150'); grad.addColorStop(1, '#8b5cf640')
  drawRRect(cx, cy, 130, 44, 12, grad, '#6366f180', 2)
  ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 13px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  const cText = (mapData.center || 'TOPIC').slice(0, 16)
  ctx.fillText(cText, cx, cy)

  branches.forEach((branch, bi) => {
    const angle = bi * angleStep - Math.PI / 2
    const bx = cx + branchR * Math.cos(angle)
    const by = cy + branchR * Math.sin(angle)

    // Line: center → branch
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by)
    ctx.strokeStyle = branch.color + '70'; ctx.lineWidth = 2
    ctx.setLineDash([6, 3]); ctx.stroke(); ctx.setLineDash([])

    // Branch node
    drawRRect(bx, by, 120, 38, 10, branch.color + '28', branch.color + '80', 1.5)
    ctx.fillStyle = branch.color; ctx.font = 'bold 11px Inter, sans-serif'
    ctx.fillText((branch.title || '').slice(0, 16), bx, by)

    // Leaf nodes
    const nodes = branch.nodes || []
    nodes.forEach((node, ni) => {
      const spread = (ni - (nodes.length - 1) / 2) * 0.45
      const nodeAngle = angle + spread
      const nx = bx + nodeR * Math.cos(nodeAngle)
      const ny = by + nodeR * Math.sin(nodeAngle)

      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(nx, ny)
      ctx.strokeStyle = branch.color + '35'; ctx.lineWidth = 1
      ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([])

      drawRRect(nx, ny, 94, 26, 7, '#1a2035', '#1e2d4a', 1)
      ctx.fillStyle = '#94a3b8'; ctx.font = '10px Inter, sans-serif'
      const short = node.length > 13 ? node.slice(0, 12) + '…' : node
      ctx.fillText(short, nx, ny)
    })
  })
}

export default function MindMap() {
  const [topic, setTopic]   = useState('')
  const [loading, setLoad]  = useState(false)
  const [mapData, setMapData] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!mapData || !canvasRef.current) return
    drawMindMap(canvasRef.current, mapData)
  }, [mapData])

  // Re-draw on window resize
  useEffect(() => {
    if (!mapData) return
    const onResize = () => { if (canvasRef.current) drawMindMap(canvasRef.current, mapData) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [mapData])

  const generate = async () => {
    if (!topic.trim()) return toast.error('Enter a topic first')
    setLoad(true); setMapData(null)
    try {
      const { data } = await mindmapAPI.generate({ topic })
      setMapData(data)
      toast.success('Mind map generated!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to generate mind map')
    }
    setLoad(false)
  }

  const download = () => {
    if (!canvasRef.current) return
    const a = document.createElement('a')
    a.download = `mindmap-${topic.replace(/\s+/g,'-')}.png`
    a.href = canvasRef.current.toDataURL()
    a.click()
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100">🧠 Mind Map Generator</h2>
        <p className="text-slate-500 text-sm mt-1">Visualize concepts, topics, and their relationships</p>
      </div>

      <div className="flex gap-3 mb-6">
        <input value={topic} onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key==='Enter' && generate()}
          placeholder="Enter any topic (e.g. Machine Learning, Cell Biology, French Revolution, React.js...)"
          className="input flex-1" />
        <button onClick={generate} disabled={loading || !topic.trim()} className="btn-primary px-6"
          style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
          {loading ? <><Spinner /> Mapping...</> : '🧠 Generate'}
        </button>
        {mapData && (
          <button onClick={download} className="btn-ghost px-4 text-sm">⬇ PNG</button>
        )}
      </div>

      {mapData ? (
        <motion.div initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }}
          className="card overflow-hidden" style={{ borderColor: '#10b98130' }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: 520, display: 'block' }} />
          {/* Legend */}
          <div className="px-5 py-3 border-t border-dark-600 flex flex-wrap gap-3">
            {mapData.branches?.map(b => (
              <div key={b.title} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: b.color }} />
                <span className="text-xs text-slate-500">{b.title}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="card p-16 text-center">
          <div className="text-6xl mb-4 opacity-40">🧠</div>
          <p className="text-slate-500 text-sm font-medium">Enter a topic to generate a visual mind map</p>
          <p className="text-slate-600 text-xs mt-2">Works great with subjects, concepts, events, scientific theories...</p>
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {['Machine Learning','Photosynthesis','World War II','Python','Quantum Physics','French Revolution'].map(t => (
              <button key={t} onClick={() => setTopic(t)}
                className="text-xs px-3 py-1.5 rounded-full bg-dark-700 border border-dark-600 text-slate-400 hover:text-green-400 hover:border-green-500/30 transition-all">
                {t}
              </button>
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
