import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, AlignLeft, Calendar, Eye } from 'lucide-react'
import { assignmentService } from '../../services/assignmentService'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/Button'

export default function CreateAssignment() {
  const navigate  = useNavigate()
  const { toast } = useToast()
  const [form, setForm]       = useState({ title: '', description: '', deadline: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [preview, setPreview] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const minDate = () => { const d = new Date(); d.setMinutes(d.getMinutes() + 10); return d.toISOString().slice(0,16) }

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await assignmentService.create({ ...form, deadline: new Date(form.deadline).toISOString().replace('Z','') })
      toast('Assignment published successfully!', 'success')
      navigate('/teacher/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create assignment.'
      setError(msg); toast(msg, 'error')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.75rem' }}>
        <button onClick={() => navigate(-1)} style={{ width: 38, height: 38, borderRadius: '0.75rem', border: '1.5px solid #e8e0d5', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a9ab0', transition: 'all 0.18s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#d4c9b8'; e.currentTarget.style.color = '#1a2332' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e0d5'; e.currentTarget.style.color = '#8a9ab0' }}>
          <ArrowLeft style={{ width: 16, height: 16 }} />
        </button>
        <div>
          <h1 className="pg-title">Create Assignment</h1>
          <p style={{ fontFamily: 'Lato', color: '#8a9ab0', fontSize: '0.875rem', marginTop: 3 }}>Publish a new homework task for your students</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: preview && form.title ? '1fr 1fr' : '1fr', gap: '1.25rem' }}>
        {/* Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #1a6b4a, #2d9068, #c9991a)', borderRadius: '1.25rem 1.25rem 0 0' }} />
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: '#fff1f2', border: '1px solid rgba(244,63,94,0.2)', color: '#9f1239', fontSize: '0.875rem', borderLeft: '4px solid #e11d48' }}>
                {error}
              </div>
            )}

            <div>
              <label className="field-label">Title <span style={{ color: '#e11d48' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <BookOpen style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#8a9ab0', pointerEvents: 'none' }} />
                <input name="title" value={form.title} onChange={handle}
                  placeholder="e.g. Chapter 5 — Quadratic Equations"
                  className="field" style={{ paddingLeft: '2.75rem' }} required maxLength={120} />
              </div>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: '#8a9ab0', marginTop: 6 }}>{form.title.length}/120</p>
            </div>

            <div>
              <label className="field-label">Description</label>
              <div style={{ position: 'relative' }}>
                <AlignLeft style={{ position: 'absolute', left: 14, top: 14, width: 16, height: 16, color: '#8a9ab0', pointerEvents: 'none' }} />
                <textarea name="description" value={form.description} onChange={handle}
                  placeholder="Detailed instructions, pages to cover, submission format..."
                  className="field" style={{ paddingLeft: '2.75rem', minHeight: 120, resize: 'vertical' }} rows={5} />
              </div>
            </div>

            <div>
              <label className="field-label">Deadline <span style={{ color: '#e11d48' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <Calendar style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#8a9ab0', pointerEvents: 'none' }} />
                <input name="deadline" type="datetime-local" value={form.deadline} onChange={handle}
                  min={minDate()} className="field" style={{ paddingLeft: '2.75rem', colorScheme: 'light' }} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
              <Button type="submit" loading={loading} style={{ flex: 1, justifyContent: 'center' }}>
                Publish Assignment
              </Button>
              {form.title && (
                <button type="button" onClick={() => setPreview(!preview)}
                  className="btn btn-secondary" style={{ gap: '0.4rem', flexShrink: 0 }}>
                  <Eye style={{ width: 15, height: 15 }} /> {preview ? 'Hide' : 'Preview'}
                </button>
              )}
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </form>
        </div>

        {/* Preview card */}
        {preview && form.title && (
          <div style={{ animation: 'scaleIn 0.3s ease' }}>
            <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.78rem', color: '#8a9ab0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>Student Preview</p>
            <div className="card card-forest" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '0.75rem', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen style={{ width: 18, height: 18, color: '#fff' }} />
                </div>
                <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assignment</span>
              </div>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.1rem', color: '#fff', marginBottom: '0.625rem' }}>{form.title}</h3>
              {form.description && <p style={{ fontFamily: 'Lato', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, marginBottom: '1rem' }}>{form.description}</p>}
              {form.deadline && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 0.875rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.625rem', width: 'fit-content' }}>
                  <Calendar style={{ width: 14, height: 14, color: '#c9991a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)' }}>
                    {new Date(form.deadline).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
