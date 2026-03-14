import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ClipboardCheck, Clock, TrendingUp, PlusSquare, ArrowRight, AlertCircle } from 'lucide-react'
import { assignmentService } from '../../services/assignmentService'
import { submissionService }  from '../../services/submissionService'
import { useAuth }    from '../../context/AuthContext'
import { useSearch }  from '../../context/SearchContext'
import StatCard       from '../../components/StatCard'
import EmptyState     from '../../components/EmptyState'
import Spinner        from '../../components/Spinner'
import Button         from '../../components/Button'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const CustomTooltip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div style={{ background: '#fff', border: '1px solid #e8e0d5', borderRadius: '0.75rem', padding: '0.625rem 0.875rem', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontFamily: 'Lato' }}>
      <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.82rem', color: '#1a2332' }}>{label}</p>
      <p style={{ fontSize: '0.78rem', color: '#1a6b4a', marginTop: 2 }}>Submissions: {payload[0].value}</p>
    </div>
  ) : null

export default function TeacherDashboard() {
  const { user } = useAuth()
  const { registerData } = useSearch()
  const [assignments,    setAssignments]    = useState([])
  const [allSubmissions, setAllSubmissions] = useState([])
  const [loading,        setLoading]        = useState(true)
  const [loadingSubs,    setLoadingSubs]    = useState(false)
  const now = new Date()

  useEffect(() => {
    assignmentService.getMine().then(async asgn => {
      setAssignments(asgn)
      // Register pages for search
      registerData([
        { label: 'Dashboard',         path: '/teacher/dashboard',         desc: 'Overview & analytics',   icon: BookOpen },
        { label: 'Create Assignment', path: '/teacher/create-assignment', desc: 'Publish new homework',   icon: PlusSquare },
        { label: 'Review Submissions',path: '/teacher/submissions',       desc: 'Grade student work',     icon: ClipboardCheck },
        ...asgn.map(a => ({ label: a.title, path: '/teacher/submissions', desc: `Due ${new Date(a.deadline).toLocaleDateString()}`, icon: BookOpen })),
      ])

      // Fetch submissions for all assignments to compute pending count
      if (asgn.length > 0) {
        setLoadingSubs(true)
        try {
          const subsArrays = await Promise.all(asgn.map(a => submissionService.getByAssignment(a.id)))
          setAllSubmissions(subsArrays.flat())
        } catch { /* silently ignore */ }
        finally { setLoadingSubs(false) }
      }
    }).finally(() => setLoading(false))
  }, [])

  const active        = assignments.filter(a => new Date(a.deadline) > now).length
  const closed        = assignments.length - active
  const pendingReview = allSubmissions.filter(s => s.status === 'SUBMITTED').length

  // Chart: submissions per assignment
  const chartData = assignments.slice(0, 8).map(a => {
    const count = allSubmissions.filter(s => s.assignmentId === a.id).length
    return { name: a.title.length > 11 ? a.title.slice(0,11)+'…' : a.title, submissions: count }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="pg-title">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={{ fontFamily: 'Lato', color: '#8a9ab0', fontSize: '0.9rem', marginTop: 4 }}>Here's your classroom overview for today.</p>
        </div>
        <Link to="/teacher/create-assignment">
          <Button icon={<PlusSquare style={{ width: 16, height: 16 }} />}>New Assignment</Button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: '1rem' }}>
        <StatCard label="Total Assignments" value={loading ? '…' : assignments.length} icon={<BookOpen style={{ width: 18, height: 18 }} />} iconClass="si-forest" delay={0} />
        <StatCard label="Active Now"        value={loading ? '…' : active}             icon={<Clock style={{ width: 18, height: 18 }} />}         iconClass="si-sky"    delay={80} change={active > 0 ? 'Open' : undefined} />
        <StatCard label="Closed"            value={loading ? '…' : closed}             icon={<ClipboardCheck style={{ width: 18, height: 18 }} />} iconClass="si-gold"   delay={160} />
        <StatCard
          label="Pending Reviews"
          value={loading || loadingSubs ? '…' : pendingReview}
          icon={<AlertCircle style={{ width: 18, height: 18 }} />}
          iconClass="si-rose"
          delay={240}
          change={pendingReview > 0 ? `${pendingReview} to grade` : undefined}
        />
      </div>

      {/* Pending review alert */}
      {!loading && !loadingSubs && pendingReview > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.125rem', borderRadius: '0.875rem', background: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '1px solid rgba(201,153,26,0.25)', animation: 'slideUp 0.4s 0.3s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <AlertCircle style={{ width: 18, height: 18, color: '#c9991a', flexShrink: 0 }} />
            <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.875rem', color: '#7c5a0e' }}>
              You have <strong>{pendingReview}</strong> submission{pendingReview !== 1 ? 's' : ''} waiting to be graded.
            </p>
          </div>
          <Link to="/teacher/submissions">
            <Button size="sm" variant="gold" icon={<ArrowRight style={{ width: 13, height: 13 }} />}>
              Review now
            </Button>
          </Link>
        </div>
      )}

      {/* Chart + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>
        {/* Submission chart */}
        <div className="card" style={{ animation: 'slideUp 0.5s 0.2s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 className="sec-title">Submissions per Assignment</h2>
              <p style={{ fontFamily: 'Lato', fontSize: '0.8rem', color: '#8a9ab0', marginTop: 3 }}>
                Total: {allSubmissions.length} submission{allSubmissions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <TrendingUp style={{ width: 18, height: 18, color: '#1a6b4a' }} />
          </div>
          {loading || loadingSubs ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#8a9ab0', fontFamily: 'Lato', fontSize: '0.875rem' }}>
              <Spinner size="md" /> Loading data…
            </div>
          ) : assignments.length === 0 ? (
            <EmptyState title="No assignments yet" description="Create assignments to see submission activity here." />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" vertical={false} />
                <XAxis dataKey="name" tick={{ fontFamily: 'Lato', fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={24} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(26,107,74,0.04)', radius: 6 }} />
                <Bar dataKey="submissions" radius={[6,6,0,0]} fill="url(#barGreen)" />
                <defs>
                  <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2d9068" /><stop offset="100%" stopColor="#1a6b4a" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent assignments */}
        <div className="card" style={{ animation: 'slideUp 0.5s 0.3s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 className="sec-title">Recent Assignments</h2>
            <Link to="/teacher/submissions" style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.78rem', color: '#1a6b4a', textDecoration: 'none' }}>
              All <ArrowRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>
          {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Spinner /></div>
          : assignments.length === 0 ? (
            <EmptyState title="No assignments" action={<Link to="/teacher/create-assignment"><Button size="sm">Create one</Button></Link>} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {assignments.slice(0,5).map((a, i) => {
                const isActive  = new Date(a.deadline) > now
                const subCount  = allSubmissions.filter(s => s.assignmentId === a.id).length
                const pendCount = allSubmissions.filter(s => s.assignmentId === a.id && s.status === 'SUBMITTED').length
                return (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.875rem', background: '#fdf9f3', border: '1px solid #e8e0d5', cursor: 'pointer', transition: 'all 0.18s', animation: `slideRight 0.4s ${i*60}ms both` }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f0f9f4'; e.currentTarget.style.borderColor = 'rgba(26,107,74,0.2)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fdf9f3'; e.currentTarget.style.borderColor = '#e8e0d5' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '0.75rem', background: 'rgba(26,107,74,0.08)', border: '1px solid rgba(26,107,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BookOpen style={{ width: 16, height: 16, color: '#1a6b4a' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.82rem', color: '#1a2332', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
                      <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.68rem', color: '#8a9ab0', marginTop: 2 }}>
                        {subCount} sub{subCount !== 1 ? 's' : ''}{pendCount > 0 ? ` · ${pendCount} pending` : ''}
                      </p>
                    </div>
                    <span className={`badge ${isActive ? 'badge-forest' : 'badge-slate'}`}>{isActive ? 'Open' : 'Done'}</span>
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
