import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Calendar, UploadCloud, CheckCircle2, Search } from 'lucide-react'
import { assignmentService } from '../../services/assignmentService'
import { submissionService }  from '../../services/submissionService'
import { useAuth }    from '../../context/AuthContext'
import { useSearch }  from '../../context/SearchContext'
import EmptyState     from '../../components/EmptyState'
import Spinner        from '../../components/Spinner'
import Button         from '../../components/Button'

export default function Assignments() {
  const { user } = useAuth()
  const { registerData } = useSearch()
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('all')

  useEffect(() => {
    Promise.all([assignmentService.getAll(), submissionService.getByStudent(user.id)])
      .then(([asgn, subs]) => {
        setAssignments(asgn)
        setSubmissions(subs)
        // Register for global search
        registerData(asgn.map(a => ({
          label: a.title,
          path:  '/student/assignments',
          desc:  `Due ${new Date(a.deadline).toLocaleDateString()}`,
          icon:  BookOpen,
        })))
      })
      .finally(() => setLoading(false))
  }, [user.id])

  // FIXED: coerce both sides to String to avoid Number vs String key mismatch
  const subMap = Object.fromEntries(submissions.map(s => [String(s.assignmentId), s]))
  const now = new Date()

  const filtered = assignments.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                        (a.description || '').toLowerCase().includes(search.toLowerCase())
    const sub    = subMap[String(a.id)]
    const isPast = new Date(a.deadline) < now

    if (filter === 'pending')   return matchSearch && !sub && !isPast
    if (filter === 'submitted') return matchSearch && sub?.status === 'SUBMITTED'
    if (filter === 'graded')    return matchSearch && sub?.status === 'GRADED'
    if (filter === 'closed')    return matchSearch && isPast
    return matchSearch // 'all'
  })

  const counts = {
    all:       assignments.length,
    pending:   assignments.filter(a => !subMap[String(a.id)] && new Date(a.deadline) > now).length,
    submitted: submissions.filter(s => s.status === 'SUBMITTED').length,
    graded:    submissions.filter(s => s.status === 'GRADED').length,
    closed:    assignments.filter(a => new Date(a.deadline) < now).length,
  }

  const tabs = [
    { key: 'all',       label: 'All' },
    { key: 'pending',   label: 'Pending' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'graded',    label: 'Graded' },
    { key: 'closed',    label: 'Closed' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="pg-title">Assignments</h1>
          <p style={{ fontFamily: 'Lato', color: '#8a9ab0', fontSize: '0.875rem', marginTop: 4 }}>{assignments.length} total assignment{assignments.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#8a9ab0', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assignments…"
            className="field" style={{ paddingLeft: '2.4rem', width: 240 }} />
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.375rem', background: '#fff', border: '1px solid #e8e0d5', borderRadius: '0.875rem', padding: '0.3rem', width: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            style={{
              padding: '0.45rem 0.875rem', borderRadius: '0.625rem', border: 'none', cursor: 'pointer',
              fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.82rem', transition: 'all 0.18s',
              background: filter === t.key ? 'linear-gradient(135deg,#2d9068,#1a6b4a)' : 'transparent',
              color:      filter === t.key ? '#fff' : '#8a9ab0',
              boxShadow:  filter === t.key ? '0 2px 8px rgba(26,107,74,0.25)' : 'none',
            }}>
            {t.label}
            {counts[t.key] > 0 && (
              <span style={{ marginLeft: 6, padding: '0.05rem 0.4rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 800, background: filter === t.key ? 'rgba(255,255,255,0.2)' : 'rgba(26,107,74,0.08)', color: filter === t.key ? '#fff' : '#1a6b4a' }}>
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? 'No matches found' : `No ${filter === 'all' ? '' : filter} assignments`}
          description={search ? 'Try a different search term.' : 'Nothing in this category yet.'}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filtered.map((a, i) => {
            const sub    = subMap[String(a.id)]
            const isPast = new Date(a.deadline) < now
            const isGraded = sub?.status === 'GRADED'
            return (
              <div key={a.id} className={`card ${!sub && !isPast ? 'card-hover' : ''}`}
                style={{ display: 'flex', flexDirection: 'column', animation: `slideUp 0.5s ${i*55}ms both` }}>
                {/* Top badges */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '0.875rem', background: 'linear-gradient(135deg,#f0f9f4,#d9f0e4)', border: '1px solid rgba(26,107,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen style={{ width: 19, height: 19, color: '#1a6b4a' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {sub && <span className={`badge ${isGraded ? 'badge-forest' : 'badge-sky'}`}>{isGraded ? 'Graded' : 'Submitted'}</span>}
                    <span className={`badge ${isPast ? 'badge-slate' : 'badge-gold'}`}>{isPast ? 'Closed' : 'Open'}</span>
                  </div>
                </div>

                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.95rem', color: '#1a2332', marginBottom: '0.5rem', lineHeight: 1.3 }}>{a.title}</h3>
                {a.description && (
                  <p style={{ fontFamily: 'Lato', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, marginBottom: '0.875rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {a.description}
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1rem', fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: '#94a3b8' }}>
                  <Calendar style={{ width: 13, height: 13 }} />
                  {new Date(a.deadline).toLocaleString()}
                </div>

                {/* Grade bar */}
                {sub?.grade != null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.875rem', background: 'linear-gradient(135deg,#f0f9f4,#d9f0e4)', border: '1px solid rgba(26,107,74,0.18)', borderRadius: '0.75rem', marginBottom: '0.875rem' }}>
                    <CheckCircle2 style={{ width: 15, height: 15, color: '#1a6b4a', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.85rem', color: '#155a3d' }}>Grade: {sub.grade}/100</span>
                    <div className="prog-track" style={{ flex: 1, height: 5 }}>
                      <div className="prog-fill" style={{ width: `${sub.grade}%` }} />
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div style={{ marginTop: 'auto' }}>
                  {sub ? (
                    <p style={{ fontFamily: 'Lato', fontSize: '0.8rem', color: '#8a9ab0', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 style={{ width: 14, height: 14, color: '#1a6b4a' }} />
                      Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                    </p>
                  ) : isPast ? (
                    <p style={{ fontFamily: 'Lato', fontSize: '0.8rem', color: '#e11d48', fontWeight: 700 }}>Deadline has passed</p>
                  ) : (
                    <Link to={`/student/upload?assignmentId=${a.id}`}>
                      <Button style={{ width: '100%', justifyContent: 'center' }} icon={<UploadCloud style={{ width: 15, height: 15 }} />}>
                        Submit Homework
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
