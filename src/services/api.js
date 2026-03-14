import axios from 'axios'

const api = axios.create({
  baseURL: 'https://home-work-submission-backend-2.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
})

// Attach JWT to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('hp_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle auth errors globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hp_token')
      localStorage.removeItem('hp_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
