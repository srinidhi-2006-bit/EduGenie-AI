import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 60000,
})

API.interceptors.request.use(config => {
  const token = localStorage.getItem('edugenie_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('edugenie_token')
      localStorage.removeItem('edugenie_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: d => API.post('/auth/register', d),
  login:    d => API.post('/auth/login', d),
  me:       ()=> API.get('/auth/me'),
}

export const chatAPI = {
  send:    d => API.post('/chat/send', d),
  history: ()=> API.get('/chat/history'),
  clear:   ()=> API.delete('/chat/history'),
}

export const pdfAPI = {
  upload:  fd => API.post('/pdf/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  history: ()=> API.get('/pdf/history'),
  delete:  id => API.delete(`/pdf/${id}`),
}

export const quizAPI = {
  generate: d => API.post('/quiz/generate', d),
  submit:   d => API.post('/quiz/submit', d),
  history:  ()=> API.get('/quiz/history'),
}

export const interviewAPI = {
  generate: d => API.post('/interview/generate', d),
  history:  ()=> API.get('/interview/history'),
}

export const mindmapAPI = {
  generate: d => API.post('/mindmap/generate', d),
  history:  ()=> API.get('/mindmap/history'),
}

export const plannerAPI = {
  generate: d => API.post('/planner/generate', d),
  history:  ()=> API.get('/planner/history'),
}

export const voiceAPI = {
  ask:     d => API.post('/voice/ask', d),
  history: ()=> API.get('/voice/history'),
}

export default API
