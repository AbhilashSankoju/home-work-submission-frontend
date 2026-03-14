import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { User, Mail, Lock, ArrowRight, GraduationCap, Users, Eye, EyeOff, Layers } from 'lucide-react'
import { useAuth }  from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/Button'

export default function Register() {
  const navigate    = useNavigate()
  const [params]    = useSearchParams()
  const { register } = useAuth()
  const { toast }   = useToast()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: params.get('role') || 'STUDENT' })
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)
  const [error,   setError]   = useState('')

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const data = await register(form)
      toast(`Welcome to Academe, ${data.name}!`, 'success')
      navigate(data.role === 'TEACHER' ? '/teacher/dashboard' : '/student/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.'
      setError(msg); toast(msg, 'error')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdf9f3', padding: '2rem', fontFamily: 'Lato, sans-serif' }}
      className="dot-bg">
      <div style={{ width: '100%', maxWidth: 480, animation: 'slideUp 0.45s cubic-bezier(0.22,1,0.36,1)' }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '0.875rem', background: 'linear-gradient(135deg, #2d9068, #1a6b4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(26,107,74,0.3)' }}>
            <Layers style={{ width: 20, height: 20, color: '#fff' }} />
          </div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.5rem', color: '#1a2332', letterSpacing: '-0.03em' }}>Academe</span>
        </div>

        <div className="card" style={{ padding: '2.25rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
          {/* Top stripe */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #1a6b4a, #2d9068, #c9991a)', borderRadius: '1.25rem 1.25rem 0 0' }} />

          <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Create your account</h1>
          <p style={{ color: '#8a9ab0', fontSize: '0.875rem', marginBottom: '1.75rem' }}>Join thousands of educators and students</p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            {error && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: '#fff1f2', border: '1px solid rgba(244,63,94,0.2)', color: '#9f1239', fontSize: '0.875rem', borderLeft: '4px solid #e11d48' }}>
                {error}
              </div>
            )}

            {/* Role toggle */}
            <div>
              <label className="field-label">I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                {[
                  { val: 'STUDENT', label: 'Student', Icon: Users,         desc: 'Submit & track work' },
                  { val: 'TEACHER', label: 'Teacher', Icon: GraduationCap, desc: 'Create & grade' },
                ].map(({ val, label, Icon, desc }) => (
                  <button type="button" key={val} onClick={() => setForm(f => ({ ...f, role: val }))}
                    style={{
                      padding: '0.875rem', borderRadius: '0.875rem', cursor: 'pointer',
                      border: form.role === val ? '2px solid #1a6b4a' : '1.5px solid #e8e0d5',
                      background: form.role === val ? 'linear-gradient(135deg, #f0f9f4, #d9f0e4)' : '#fff',
                      textAlign: 'left', transition: 'all 0.18s',
                      boxShadow: form.role === val ? '0 0 0 3px rgba(26,107,74,0.1)' : 'none',
                    }}>
                    <Icon style={{ width: 18, height: 18, color: form.role === val ? '#1a6b4a' : '#8a9ab0', marginBottom: '0.375rem' }} />
                    <p style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.875rem', color: form.role === val ? '#155a3d' : '#4a5568' }}>{label}</p>
                    <p style={{ fontFamily: 'Lato', fontSize: '0.75rem', color: form.role === val ? '#4da882' : '#94a3b8', marginTop: 2 }}>{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="hr" />

            {[
              { name: 'name',     type: 'text',     placeholder: 'Jane Smith',     Icon: User,  label: 'Full name' },
              { name: 'email',    type: 'email',    placeholder: 'you@school.edu', Icon: Mail,  label: 'Email address' },
            ].map(({ name, type, placeholder, Icon, label }) => (
              <div key={name}>
                <label className="field-label">{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#8a9ab0', pointerEvents: 'none' }} />
                  <input name={name} type={type} value={form[name]} onChange={handle}
                    placeholder={placeholder} className="field" style={{ paddingLeft: '2.75rem' }} required />
                </div>
              </div>
            ))}

            <div>
              <label className="field-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#8a9ab0', pointerEvents: 'none' }} />
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handle}
                  placeholder="Min. 6 characters" className="field" style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }} required minLength={6} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a9ab0', padding: 4 }}>
                  {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem', gap: '0.5rem' }}>
              Create account <ArrowRight style={{ width: 16, height: 16 }} />
            </Button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#8a9ab0' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#1a6b4a', textDecoration: 'none' }}>Sign in →</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <Link to="/" style={{ fontSize: '0.82rem', color: '#c8bfb0', textDecoration: 'none' }}>← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
