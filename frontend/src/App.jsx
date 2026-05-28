import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

import Login        from './pages/Login'
import Register     from './pages/Register'
import Layout       from './components/Layout'
import Dashboard    from './pages/Dashboard'
import Chatbot      from './pages/Chatbot'
import PDFSummarizer from './pages/PDFSummarizer'
import QuizGenerator from './pages/QuizGenerator'
import InterviewPrep from './pages/InterviewPrep'
import MindMap       from './pages/MindMap'
import StudyPlanner  from './pages/StudyPlanner'
import VoiceAssistant from './pages/VoiceAssistant'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-dark-900">
      <div className="text-center">
        <div className="text-5xl mb-4">🧞</div>
        <div className="text-indigo-400 text-sm animate-pulse">Loading EduGenie...</div>
      </div>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1a2035', color: '#e2e8f0', border: '1px solid #1e2d4a' },
            success: { iconTheme: { primary: '#10b981', secondary: '#0a0b14' } },
            error:   { iconTheme: { primary: '#f43f5e', secondary: '#0a0b14' } },
          }}
        />
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index                element={<Dashboard />} />
            <Route path="chatbot"       element={<Chatbot />} />
            <Route path="pdf"           element={<PDFSummarizer />} />
            <Route path="quiz"          element={<QuizGenerator />} />
            <Route path="interview"     element={<InterviewPrep />} />
            <Route path="mindmap"       element={<MindMap />} />
            <Route path="planner"       element={<StudyPlanner />} />
            <Route path="voice"         element={<VoiceAssistant />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
