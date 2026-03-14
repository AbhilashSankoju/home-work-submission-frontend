import { useEffect, useState } from 'react'
import { UploadCloud, Award, Star, MessageSquare, ChevronRight } from 'lucide-react'
import { submissionService } from '../../services/submissionService'
import { useAuth }    from '../../context/AuthContext'
import EmptyState     from '../../components/EmptyState'
import Spinner        from '../../components/Spinner'
import Modal          from '../../components/Modal'

export default function MySubmissions() {
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading]         = useState(true)
  const [detail,  setDetail]          = useState(null)

  useEffect(() => {
    submissionService.getByStudent(user.id).then(setSubmissions).finally(() => setLoading(false))
  }, [user.id])

  const graded   = submissions.filter(s => s.status === 'GRADED').length
  const gradeArr = submissions.filter(s => s.grade != null)
  const avg      = gradeArr.length ? (gradeArr.reduce((a, s) => a + s.grade, 0) / gradeArr.length).toFixed(1) : null
  const getColor = g => g >= 80 ? '#1a6b4a' : g >= 60 ? '#c9991a' : '#e11d48'
  const getBg    = g => g >= 80 ? 'linear-gradient(135deg,#f0f9f4,#d9f0e4)' : g >= 60 ? 'linear-gradient(135deg,#fffbeb,#fef3c7)' : 'linear-gradient(135deg,#fff1f2,#fecdd3)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
      <div>
        <h1 className="pg-title">My Submissions</h1>
        <p style={{ fontFamily: 'Lato', color: '#8a9ab0', fontSize: '0.875rem', marginTop: 4 }}>All your homework submissions and grades in one place.</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {[
          { label: 'Total Submitted', value: submissions.length, Icon: UploadCloud, bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.18)', color: '#0369a1' },
          { label: 'Graded',          value: graded,             Icon: Award,       bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.18)', color: '#5b21b6' },
          { label: 'Average Grade',   value: avg ? `${avg}%` : '—', Icon: Star,    bg: 'rgba(201,153,26,0.08)', border: 'rgba(201,153,26,0.18)', color: '#7c5a0e' },
        ].map((s, i) => (
          <div key={s.label} className="card"
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', animation: `slideUp 0.45s ${i*70}ms both` }}>
            <div style={{ width: 44, height: 44, borderRadius: '0.875rem', background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.Icon style={{ width: 20, height: 20, color: s.color }} />
            </div>
            <div>
              <p style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.6rem', color: '#1a2332', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontFamily: 'Lato', fontSize: '0.8rem', color: '#8a9ab0', marginTop: 4 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.125rem 1.5rem', borderBottom: '1px solid #e8e0d5', background: '#fdf9f3' }}>
          <h2 className="sec-title">Submission History</h2>
        </div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size="lg" /></div>
        ) : submissions.length === 0 ? (
          <div style={{ padding: '1rem' }}><EmptyState title="No submissions yet" description="Your homework submissions and grades will appear here after you upload them." /></div>
        ) : (
          <div>
            {submissions.map((s, i) => (
              <div key={s.id} onClick={() => setDetail(s)}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', borderBottom: i < submissions.length - 1 ? '1px solid #e8e0d5' : 'none', cursor: 'pointer', transition: 'background 0.14s', animation: `slideRight 0.4s ${i*40}ms both` }}
                onMouseEnter={e => e.currentTarget.style.background = '#fdf9f3'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {/* Grade ring */}
                <div style={{ width: 44, height: 44, borderRadius: '0.875rem', background: s.grade != null ? getBg(s.grade) : '#fdf9f3', border: `1px solid ${s.grade != null ? (s.grade >= 80 ? 'rgba(26,107,74,0.2)' : s.grade >= 60 ? 'rgba(201,153,26,0.2)' : 'rgba(225,29,72,0.2)') : '#e8e0d5'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {s.grade != null ? (
                    <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '0.85rem', color: getColor(s.grade), lineHeight: 1 }}>{s.grade}</span>
                  ) : (
                    <UploadCloud style={{ width: 17, height: 17, color: '#94a3b8' }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.9rem', color: '#1a2332', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.assignmentTitle}</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: '#8a9ab0', marginTop: 3 }}>{new Date(s.submittedAt).toLocaleString()}</p>
                </div>
                {s.feedback && <MessageSquare style={{ width: 15, height: 15, color: '#1a6b4a', flexShrink: 0 }} />}
                <span className={`badge ${s.status === 'GRADED' ? 'badge-forest' : 'badge-gold'}`}>
                  {s.status === 'GRADED' ? 'Graded' : 'Pending'}
                </span>
                <ChevronRight style={{ width: 15, height: 15, color: '#c8bfb0', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Submission Details" subtitle={detail?.assignmentTitle}>
        {detail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[['Assignment', detail.assignmentTitle], ['Submitted', new Date(detail.submittedAt).toLocaleString()],
                ['Status', detail.status], ['Grade', detail.grade != null ? `${detail.grade} / 100` : 'Not yet graded']].map(([k,v]) => (
                <div key={k} style={{ padding: '0.875rem', borderRadius: '0.875rem', background: '#fdf9f3', border: '1px solid #e8e0d5' }}>
                  <p style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.68rem', color: '#8a9ab0', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{k}</p>
                  <p style={{ fontFamily: 'Lato', fontWeight: 700, fontSize: '0.875rem', color: '#1a2332' }}>{v}</p>
                </div>
              ))}
            </div>
            {detail.grade != null && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.78rem', color: '#4a5568' }}>Grade progress</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', fontWeight: 700, color: getColor(detail.grade) }}>{detail.grade}%</span>
                </div>
                <div className="prog-track" style={{ height: 10 }}>
                  <div className="prog-fill" style={{ width: `${detail.grade}%`, background: `linear-gradient(90deg, ${getColor(detail.grade)}cc, ${getColor(detail.grade)})` }} />
                </div>
              </div>
            )}
            {detail.feedback ? (
              <div style={{ padding: '1rem', borderRadius: '0.875rem', background: 'linear-gradient(135deg,#f0f9f4,#d9f0e4)', border: '1px solid rgba(26,107,74,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.625rem' }}>
                  <MessageSquare style={{ width: 14, height: 14, color: '#1a6b4a' }} />
                  <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.72rem', color: '#1a6b4a', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Teacher Feedback</span>
                </div>
                <p style={{ fontFamily: 'Lato', fontSize: '0.875rem', color: '#1a2332', lineHeight: 1.65 }}>{detail.feedback}</p>
              </div>
            ) : (
              <p style={{ fontFamily: 'Lato', fontSize: '0.875rem', color: '#8a9ab0', textAlign: 'center', padding: '1rem' }}>Feedback will appear here after grading.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
