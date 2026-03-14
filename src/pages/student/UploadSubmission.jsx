import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock, BookOpen } from 'lucide-react'
import { assignmentService } from '../../services/assignmentService'
import { submissionService }  from '../../services/submissionService'
import { useToast }   from '../../context/ToastContext'
import FileUpload     from '../../components/FileUpload'
import Button         from '../../components/Button'
import Spinner        from '../../components/Spinner'

export default function UploadSubmission() {
  const navigate  = useNavigate()
  const { toast } = useToast()
  const [params]  = useSearchParams()
  const [assignments, setAssignments] = useState([])
  const [selectedId,  setSelectedId]  = useState(params.get('assignmentId') || '')
  const [file,        setFile]        = useState(null)
  const [progress,    setProgress]    = useState(0)
  const [uploading,   setUploading]   = useState(false)
  const [done,        setDone]        = useState(false)
  const [loadingA,    setLoadingA]    = useState(true)
  const [error,       setError]       = useState('')

  useEffect(() => {
    assignmentService.getAll()
      .then(d => setAssignments(d.filter(a => new Date(a.deadline) > new Date())))
      .finally(() => setLoadingA(false))
  }, [])

  const selected = assignments.find(a => String(a.id) === String(selectedId))

  const submit = async e => {
    e.preventDefault()
    if (!selectedId) { toast('Please select an assignment.', 'error'); return }
    if (!file)       { toast('Please choose a file to upload.', 'error'); return }
    setError(''); setUploading(true); setProgress(0)
    try {
      await submissionService.upload(selectedId, file, pct => setProgress(pct))
      setDone(true); toast('Homework submitted successfully!', 'success')
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed. Please try again.'
      setError(msg); toast(msg, 'error'); setProgress(0)
    } finally { setUploading(false) }
  }

  if (done) return (
    <div style={{ maxWidth: 480, margin: '5rem auto', textAlign: 'center', animation: 'bounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>
      <div style={{ width: 96, height: 96, borderRadius: '2rem', background: 'linear-gradient(135deg,#f0f9f4,#d9f0e4)', border: '2px solid rgba(26,107,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 0 8px rgba(26,107,74,0.06), 0 8px 32px rgba(26,107,74,0.15)', animation: 'pulseRing 2s infinite' }}>
        <CheckCircle2 style={{ width: 44, height: 44, color: '#1a6b4a' }} />
      </div>
      <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', letterSpacing: '-0.03em', color: '#1a2332', marginBottom: '0.75rem' }}>Submitted!</h2>
      <p style={{ fontFamily: 'Lato', color: '#64748b', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.95rem' }}>
        Your homework has been submitted successfully. You'll be notified once your teacher reviews it.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <Button onClick={() => navigate('/student/submissions')}>View My Submissions</Button>
        <Button variant="secondary" onClick={() => { setDone(false); setFile(null); setSelectedId('') }}>Submit Another</Button>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.75rem' }}>
        <button onClick={() => navigate(-1)} style={{ width: 38, height: 38, borderRadius: '0.75rem', border: '1.5px solid #e8e0d5', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a9ab0', transition: 'all 0.18s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#d4c9b8'; e.currentTarget.style.color = '#1a2332' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e0d5'; e.currentTarget.style.color = '#8a9ab0' }}>
          <ArrowLeft style={{ width: 16, height: 16 }} />
        </button>
        <div>
          <h1 className="pg-title">Submit Homework</h1>
          <p style={{ fontFamily: 'Lato', color: '#8a9ab0', fontSize: '0.875rem', marginTop: 3 }}>Upload your completed assignment</p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,#1a6b4a,#2d9068,#c9991a)', borderRadius: '1.25rem 1.25rem 0 0' }} />

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.375rem' }}>
          {error && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: '#fff1f2', border: '1px solid rgba(244,63,94,0.2)', color: '#9f1239', fontSize: '0.875rem', borderLeft: '4px solid #e11d48' }}>
              {error}
            </div>
          )}

          {/* Assignment selector */}
          <div>
            <label className="field-label">Select Assignment <span style={{ color: '#e11d48' }}>*</span></label>
            {loadingA ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8a9ab0', fontSize: '0.875rem', fontFamily: 'Lato', padding: '0.5rem 0' }}>
                <Spinner size="sm" /> Loading assignments…
              </div>
            ) : assignments.length === 0 ? (
              <p style={{ fontFamily: 'Lato', color: '#8a9ab0', fontSize: '0.875rem' }}>No open assignments available.</p>
            ) : (
              <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="field" required>
                <option value="">— Choose an assignment —</option>
                {assignments.map(a => (
                  <option key={a.id} value={a.id}>{a.title} — Due {new Date(a.deadline).toLocaleDateString()}</option>
                ))}
              </select>
            )}
          </div>

          {/* Assignment detail card */}
          {selected && (
            <div style={{ padding: '1rem 1.125rem', borderRadius: '0.875rem', background: 'linear-gradient(135deg,#f0f9f4,#e8f5ee)', border: '1px solid rgba(26,107,74,0.15)', animation: 'scaleIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <BookOpen style={{ width: 14, height: 14, color: '#1a6b4a' }} />
                <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.72rem', color: '#1a6b4a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Assignment Details</span>
              </div>
              <p style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.95rem', color: '#1a2332', marginBottom: selected.description ? '0.375rem' : 0 }}>{selected.title}</p>
              {selected.description && <p style={{ fontFamily: 'Lato', fontSize: '0.85rem', color: '#4a5568', lineHeight: 1.6, marginBottom: '0.625rem' }}>{selected.description}</p>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: '#8a9ab0' }}>
                <Clock style={{ width: 12, height: 12 }} />
                Deadline: {new Date(selected.deadline).toLocaleString()}
              </div>
            </div>
          )}

          {/* File upload */}
          <div>
            <label className="field-label">Upload File <span style={{ color: '#e11d48' }}>*</span></label>
            <FileUpload onFile={setFile} />
          </div>

          {/* Progress bar */}
          {uploading && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.78rem', color: '#4a5568' }}>Uploading your file…</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', fontWeight: 700, color: '#1a6b4a' }}>{progress}%</span>
              </div>
              <div className="prog-track" style={{ height: 10 }}>
                <div className="prog-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
            <Button type="submit" loading={uploading} style={{ flex: 1, justifyContent: 'center' }}>
              {uploading ? 'Uploading…' : 'Submit Homework'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
