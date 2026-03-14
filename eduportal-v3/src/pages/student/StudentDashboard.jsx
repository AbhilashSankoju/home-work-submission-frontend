import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, UploadCloud, Award, Star, ArrowRight, Clock } from 'lucide-react'
import { assignmentService } from '../../services/assignmentService'
import { submissionService }  from '../../services/submissionService'
import { useAuth }    from '../../context/AuthContext'
import StatCard       from '../../components/StatCard'
import EmptyState     from '../../components/EmptyState'
import Spinner        from '../../components/Spinner'
import Button         from '../../components/Button'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([assignmentService.getAll(), submissionService.getByStudent(user.id)])
      .then(([asgn, subs]) => { setAssignments(asgn); setSubmissions(subs) })
      .finally(() => setLoading(false))
  }, [user.id])

  const now           = new Date()
  const graded        = submissions.filter(s => s.status === 'GRADED').length
  const submittedIds  = new Set(submissions.map(s => s.assignmentId))
  const pending       = assignments.filter(a => !submittedIds.has(a.id) && new Date(a.deadline) > now)
  const gradedSubs    = submissions.filter(s => s.grade != null)
  const avgGrade      = gradedSubs.length ? (gradedSubs.reduce((a, s) => a + s.grade, 0) / gradedSubs.length).toFixed(1) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="pg-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={{ fontFamily: 'Lato', color: '#8a9ab0', fontSize: '0.9rem', marginTop: 4 }}>Track your assignments and academic progress here.</p>
        </div>
        <Link to="/student/upload">
          <Button icon={<UploadCloud style={{ width: 16, height: 16 }} />}>Submit Homework</Button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: '1rem' }}>
        <StatCard label="Available Assignments" value={assignments.length} icon={<BookOpen style={{ width: 18, height: 18 }} />} iconClass="si-forest" delay={0} />
        <StatCard label="Submitted"             value={submissions.length} icon={<UploadCloud style={{ width: 18, height: 18 }} />} iconClass="si-sky" delay={80} />
        <StatCard label="Graded"                value={graded}             icon={<Award style={{ width: 18, height: 18 }} />} iconClass="si-violet" delay={160} />
        <StatCard label="Average Grade"         value={avgGrade ? `${avgGrade}%` : '—'} icon={<Star style={{ width: 18, height: 18 }} />} iconClass="si-gold" delay={240} />
      </div>

      {/* Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Pending */}
        <div className="card" style={{ animation: 'slideUp 0.5s 0.2s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 className="sec-title">Pending Assignments</h2>
            <Link to="/student/assignments" style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.78rem', color: '#1a6b4a', textDecoration: 'none' }}>
              All <ArrowRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>
          {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Spinner /></div>
          : pending.length === 0 ? (
            <EmptyState title="All caught up! 🎉" description="You've submitted all available assignments." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {pending.slice(0,4).map((a, i) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', borderRadius: '0.875rem', background: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '1px solid rgba(201,153,26,0.2)', animation: `slideRight 0.4s ${i*60}ms both` }}>
                  <Clock style={{ width: 16, height: 16, color: '#c9991a', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.85rem', color: '#1a2332', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#8a9ab0', marginTop: 2 }}>Due {new Date(a.deadline).toLocaleDateString()}</p>
                  </div>
                  <Link to={`/student/upload?assignmentId=${a.id}`}>
                    <Button size="sm" icon={<UploadCloud style={{ width: 13, height: 13 }} />}>Submit</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent grades */}
        <div className="card" style={{ animation: 'slideUp 0.5s 0.3s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 className="sec-title">Recent Grades</h2>
            <Link to="/student/submissions" style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.78rem', color: '#1a6b4a', textDecoration: 'none' }}>
              All <ArrowRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>
          {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Spinner /></div>
          : gradedSubs.length === 0 ? (
            <EmptyState title="No grades yet" description="Your graded assignments will appear here." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {gradedSubs.slice(0,4).map((s, i) => {
                const g = s.grade
                const color = g >= 80 ? '#1a6b4a' : g >= 60 ? '#c9991a' : '#e11d48'
                const bg    = g >= 80 ? 'linear-gradient(135deg,#f0f9f4,#d9f0e4)' : g >= 60 ? 'linear-gradient(135deg,#fffbeb,#fef3c7)' : 'linear-gradient(135deg,#fff1f2,#fecdd3)'
                const border= g >= 80 ? 'rgba(26,107,74,0.2)' : g >= 60 ? 'rgba(201,153,26,0.2)' : 'rgba(225,29,72,0.2)'
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', borderRadius: '0.875rem', background: bg, border: `1px solid ${border}`, animation: `slideRight 0.4s ${i*60}ms both` }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.85rem', color: '#1a2332', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.assignmentTitle}</p>
                      <p style={{ fontFamily: 'Lato', fontSize: '0.75rem', color: '#8a9ab0', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.feedback || 'No feedback'}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.3rem', color, lineHeight: 1 }}>{g}</p>
                      <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: '#8a9ab0' }}>/100</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
