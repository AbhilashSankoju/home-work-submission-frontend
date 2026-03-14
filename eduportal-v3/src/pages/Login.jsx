import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Layers, Eye, EyeOff } from 'lucide-react'
import { useAuth }  from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/Button'

export default function Login() {
  const navigate  = useNavigate()
  const { login } = useAuth()
  const { toast } = useToast()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)
  const [error,   setError]   = useState('')

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const data = await login(form.email, form.password)
      toast(`Welcome back, ${data.name}!`, 'success')
      navigate(data.role === 'TEACHER' ? '/teacher/dashboard' : '/student/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.'
      setError(msg); toast(msg, 'error')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fdf9f3', fontFamily: 'Lato, sans-serif' }}
      className="dot-bg">
      {/* Left panel */}
      <div style={{ flex: '0 0 420px', background: 'linear-gradient(160deg, #1a6b4a 0%, #0e3824 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}
        className="hidden lg:flex">
        <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -80, right: -80 }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(201,153,26,0.1)', bottom: 60, left: -60 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', position: 'relative' }}>
          <div style={{ width: 38, height: 38, borderRadius: '0.875rem', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Layers style={{ width: 19, height: 19, color: '#fff' }} />
          </div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.3rem', color: '#fff', letterSpacing: '-0.02em' }}>Academe</span>
        </div>

        <div style={{ position: 'relative' }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
            The classroom<br />reimagined.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Academe connects teachers and students through a seamless homework submission and grading experience.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Smart assignment management', 'Instant grading & feedback', 'Role-based secure access'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(201,153,26,0.3)', border: '1px solid rgba(201,153,26,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9991a' }} />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', position: 'relative' }}>© {new Date().getFullYear()} Academe Education Portal</p>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 400, animation: 'slideUp 0.45s cubic-bezier(0.22,1,0.36,1)' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.025em', marginBottom: '0.375rem' }}>Sign in</h1>
            <p style={{ color: '#8a9ab0', fontSize: '0.9rem' }}>Enter your credentials to access your portal</p>
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            {error && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: '#fff1f2', border: '1px solid rgba(244,63,94,0.2)', color: '#9f1239', fontSize: '0.875rem', fontWeight: 500, borderLeft: '4px solid #e11d48' }}>
                {error}
              </div>
            )}

            <div>
              <label className="field-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#8a9ab0', pointerEvents: 'none' }} />
                <input name="email" type="email" value={form.email} onChange={handle}
                  placeholder="you@school.edu" className="field" style={{ paddingLeft: '2.75rem' }} required />
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#8a9ab0', pointerEvents: 'none' }} />
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handle}
                  placeholder="••••••••" className="field" style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a9ab0', padding: 4 }}>
                  {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full" style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem', gap: '0.5rem' }}>
              Sign in <ArrowRight style={{ width: 16, height: 16 }} />
            </Button>
          </form>

          <div style={{ marginTop: '1.75rem', paddingTop: '1.75rem', borderTop: '1px solid #e8e0d5', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#8a9ab0' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#1a6b4a', textDecoration: 'none' }}>
                Create one free →
              </Link>
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              <Link to="/" style={{ fontSize: '0.82rem', color: '#c8bfb0', textDecoration: 'none' }}>← Back to home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
