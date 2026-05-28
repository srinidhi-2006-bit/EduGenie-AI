import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/',          icon: '🏠', label: 'Dashboard',       color: '#6366f1' },
  { to: '/chatbot',   icon: '🤖', label: 'AI Chatbot',      color: '#8b5cf6' },
  { to: '/pdf',       icon: '📄', label: 'PDF Summarizer',  color: '#14b8a6' },
  { to: '/quiz',      icon: '🎯', label: 'Quiz Generator',  color: '#f59e0b' },
  { to: '/interview', icon: '💼', label: 'Interview Prep',  color: '#f43f5e' },
  { to: '/mindmap',   icon: '🧠', label: 'Mind Map',        color: '#10b981' },
  { to: '/planner',   icon: '📅', label: 'Study Planner',   color: '#a78bfa' },
  { to: '/voice',     icon: '🎙️', label: 'Voice Assistant', color: '#fb923c' },
]

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  const activeLabel = NAV.find(n => n.to === location.pathname)?.label || 'EduGenie AI'
  const activeColor = NAV.find(n => n.to === location.pathname)?.color || '#6366f1'

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex flex-col bg-dark-800 border-r border-dark-600 flex-shrink-0 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-dark-600">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
            🧞
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                <div className="text-sm font-bold text-slate-100 leading-tight">EduGenie AI</div>
                <div className="text-xs text-slate-500">Learning Assistant</div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="ml-auto text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-dark-700 flex-shrink-0"
          >
            {collapsed ? '▷' : '◁'}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {NAV.map(({ to, icon, label, color }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group
                 ${isActive
                   ? 'bg-opacity-20 border border-opacity-30'
                   : 'hover:bg-dark-700 border border-transparent'}`
              }
              style={({ isActive }) => isActive ? { background: color + '18', borderColor: color + '40' } : {}}
            >
              {({ isActive }) => (
                <>
                  <span className="text-lg w-6 text-center flex-shrink-0">{icon}</span>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        className="text-sm font-medium truncate"
                        style={{ color: isActive ? color : '#94a3b8' }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-dark-600 p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm flex-shrink-0">
              🎓
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Student'}</div>
                  <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button onClick={logout} className="text-slate-500 hover:text-red-400 transition-colors text-xs p-1 flex-shrink-0" title="Logout">
                ⏻
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-dark-800/80 backdrop-blur border-b border-dark-600 px-6 py-3 flex items-center gap-3 flex-shrink-0">
          <span className="text-xl">{NAV.find(n => n.to === location.pathname)?.icon || '🧞'}</span>
          <div>
            <h1 className="text-sm font-bold text-slate-100">{activeLabel}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="badge text-xs" style={{ background: '#10b98120', color: '#10b981', borderColor: '#10b98140' }}>
              ● Live AI
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
