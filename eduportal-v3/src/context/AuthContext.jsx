import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('hp_token'))
  const [loading, setLoading] = useState(true)

  // Hydrate user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('hp_user')
    if (stored && token) {
      try { setUser(JSON.parse(stored)) } catch { logout() }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await authService.login({ email, password })
    setToken(data.token)
    setUser({ id: data.id, name: data.name, email: data.email, role: data.role })
    localStorage.setItem('hp_token', data.token)
    localStorage.setItem('hp_user', JSON.stringify({ id: data.id, name: data.name, email: data.email, role: data.role }))
    return data
  }, [])

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload)
    setToken(data.token)
    setUser({ id: data.id, name: data.name, email: data.email, role: data.role })
    localStorage.setItem('hp_token', data.token)
    localStorage.setItem('hp_user', JSON.stringify({ id: data.id, name: data.name, email: data.email, role: data.role }))
    return data
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('hp_token')
    localStorage.removeItem('hp_user')
  }, [])

  const isTeacher = user?.role === 'TEACHER'
  const isStudent = user?.role === 'STUDENT'

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isTeacher, isStudent }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
