import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Download, Star, FileText, Users, CheckCircle2 } from 'lucide-react'
import { assignmentService } from '../../services/assignmentService'
import { submissionService }  from '../../services/submissionService'
import { useToast }  from '../../context/ToastContext'
import Button        from '../../components/Button'
import Modal         from '../../components/Modal'
import Spinner       from '../../components/Spinner'
import EmptyState    from '../../components/EmptyState'

function GradeModal({ sub, onClose, onGraded }) {
  const { toast } = useToast()
  const [grade,    setGrade]    = useState(sub?.grade ?? '')
  const [feedback, setFeedback] = useState(sub?.feedback ?? '')
  const [loading,  setLoading]  = useState(false)
  const pct = !isNaN(grade) && grade !== '' ? Math.min(100, Math.max(0, Number(grade))) : 0

  const submit = async e => {
    e.preventDefault()
    if (grade === '' || isNaN(grade) || grade < 0 || grade > 100) { toast('Grade must be 0–100.', 'error'); return }
    setLoading(true)
    try {
      await submissionService.grade(sub.id, { grade: parseFloat(grade), feedback })
      toast('Graded successfully!', 'success'); onGraded(); onClose()
    } catch { toast('Failed to submit grade.', 'error') }
    finally   { setLoading(false) }
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
        {[['Student', sub?.studentName], ['Assignment', sub?.assignmentTitle], ['Submitted', new Date(sub?.submittedAt).toLocaleDateString()]].map(([k,v]) => (
          <div key={k} style={{ padding: '0.75rem', borderRadius: '0.75rem', background: '#fdf9f3', border: '1px solid #e8e0d5' }}>
            <p style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.68rem', color: '#8a9ab0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</p>
            <p style={{ fontFamily: 'Lato', fontWeight: 700, fontSize: '0.82rem', color: '#1a2332', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</p>
          </div>
        ))}
      </div>

      <div>
        <label className="field-label">Grade (0–100) <span style={{ color: '#e11d48' }}>*</span></label>
        <input type="number" min={0} max={100} step={0.5} value={grade} onChange={e => setGrade(e.target.value)}
          placeholder="e.g. 88" className="field" required />
        {grade !== '' && !isNaN(grade) && (
          <div style={{ marginTop: '0.625rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: 'Lato', fontSize: '0.75rem', color: '#8a9ab0' }}>Grade progress</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '0.78rem', color: pct >= 70 ? '#1a6b4a' : pct >= 50 ? '#c9991a' : '#e11d48' }}>{pct}%</span>
            </div>
            <div className="prog-track">
              <div className="prog-fill" style={{ width: `${pct}%`, background: pct >= 70 ? 'linear-gradient(90deg,#2d9068,#1a6b4a)' : pct >= 50 ? 'linear-gradient(90deg,#e8b730,#c9991a)' : 'linear-gradient(90deg,#fb7185,#e11d48)' }} />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="field-label">Feedback</label>
        <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
          placeholder="Write constructive feedback for the student..."
          className="field" style={{ minHeight: 100, resize: 'vertical' }} rows={4} />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
        <Button type="submit" loading={loading} style={{ flex: 1, justifyContent: 'center' }}>Submit Grade</Button>
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  )
}

export default function ViewSubmissions() {
  const { toast } = useToast()
  const [assignments, setAssignments] = useState([])
  const [selected,    setSelected]    = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loadingA,    setLoadingA]    = useState(true)
  const [loadingS,    setLoadingS]    = useState(false)
  const [gradeTarget, setGradeTarget] = useState(null)
  const now = new Date()

  useEffect(() => { assignmentService.getMine().then(setAssignments).finally(() => setLoadingA(false)) }, [])

  const loadSubs = async a => {
    if (selected?.id === a.id) { setSelected(null); setSubmissions([]); return }
    setSelected(a); setLoadingS(true)
    try { setSubmissions(await submissionService.getByAssignment(a.id)) }
    catch { toast('Failed to load submissions.', 'error') }
    finally { setLoadingS(false) }
  }

  const downloadFile = async sub => {
    try {
      const blob = await submissionService.viewFile(sub.id)
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href = url; a.download = sub.filePath?.split('/').pop() || `submission_${sub.id}`
      a.click(); URL.revokeObjectURL(url)
      toast('File downloaded!', 'success')
    } catch { toast('Download failed.', 'error') }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
      <div>
        <h1 className="pg-title">Review Submissions</h1>
        <p style={{ fontFamily: 'Lato', color: '#8a9ab0', fontSize: '0.875rem', marginTop: 4 }}>Expand an assignment to view, download, and grade submissions.</p>
      </div>

      {loadingA ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><Spinner size="lg" /></div>
      ) : assignments.length === 0 ? (
        <div className="card"><EmptyState title="No assignments yet" description="Create assignments first to see submissions here." /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {assignments.map((a, i) => {
            const isOpen   = selected?.id === a.id
            const isPast   = new Date(a.deadline) < now
            const gradedPct = isOpen && submissions.length > 0
              ? Math.round(submissions.filter(s => s.status === 'GRADED').length / submissions.length * 100) : 0
            return (
              <div key={a.id} className="card"
                style={{ padding: 0, overflow: 'hidden', animation: `slideUp 0.45s ${i*60}ms both`, borderColor: isOpen ? 'rgba(26,107,74,0.25)' : undefined }}>
                {/* Assignment header */}
                <div onClick={() => loadSubs(a)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fdf9f3'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ width: 42, height: 42, borderRadius: '0.875rem', background: 'linear-gradient(135deg, #f0f9f4, #d9f0e4)', border: '1px solid rgba(26,107,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText style={{ width: 19, height: 19, color: '#1a6b4a' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.95rem', color: '#1a2332' }}>{a.title}</p>
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: '#8a9ab0', marginTop: 3 }}>
                      Due: {new Date(a.deadline).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {isOpen && submissions.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Users style={{ width: 13, height: 13, color: '#8a9ab0' }} />
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: '#8a9ab0' }}>{submissions.length}</span>
                      </div>
                    )}
                    <span className={`badge ${isPast ? 'badge-slate' : 'badge-forest'}`}>{isPast ? 'Closed' : 'Open'}</span>
                    <div style={{ width: 28, height: 28, borderRadius: '0.625rem', background: '#fdf9f3', border: '1px solid #e8e0d5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a9ab0' }}>
                      {isOpen ? <ChevronUp style={{ width: 14, height: 14 }} /> : <ChevronDown style={{ width: 14, height: 14 }} />}
                    </div>
                  </div>
                </div>

                {/* Submissions */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid #e8e0d5', padding: '1.25rem 1.5rem', animation: 'slideUp 0.3s ease' }}>
                    {loadingS ? (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Spinner /></div>
                    ) : submissions.length === 0 ? (
                      <EmptyState title="No submissions yet" description="Students haven't submitted for this assignment." />
                    ) : (
                      <>
                        {/* Grading progress */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.78rem', color: '#4a5568' }}>{submissions.filter(s => s.status === 'GRADED').length} of {submissions.length} graded</span>
                          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: '#1a6b4a', fontWeight: 600 }}>{gradedPct}%</span>
                        </div>
                        <div className="prog-track" style={{ marginBottom: '1.25rem' }}>
                          <div className="prog-fill" style={{ width: `${gradedPct}%` }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                          {submissions.map(sub => (
                            <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1rem', borderRadius: '0.875rem', background: '#fdf9f3', border: '1px solid #e8e0d5', transition: 'all 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f0f9f4'}
                              onMouseLeave={e => e.currentTarget.style.background = '#fdf9f3'}>
                              <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.78rem', flexShrink: 0 }}>
                                {sub.studentName?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.875rem', color: '#1a2332' }}>{sub.studentName}</p>
                                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#8a9ab0', marginTop: 2 }}>{new Date(sub.submittedAt).toLocaleDateString()}</p>
                              </div>
                              {sub.grade != null && (
                                <div style={{ textAlign: 'right', marginRight: 4 }}>
                                  <p style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.1rem', color: sub.grade >= 70 ? '#1a6b4a' : sub.grade >= 50 ? '#c9991a' : '#e11d48' }}>{sub.grade}</p>
                                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: '#8a9ab0' }}>/100</p>
                                </div>
                              )}
                              <span className={`badge ${sub.status === 'GRADED' ? 'badge-forest' : 'badge-gold'}`}>
                                {sub.status === 'GRADED' ? 'Graded' : 'Pending'}
                              </span>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Button size="sm" variant="secondary" icon={<Download style={{ width: 13, height: 13 }} />} onClick={() => downloadFile(sub)}>File</Button>
                                <Button size="sm" icon={<Star style={{ width: 13, height: 13 }} />} onClick={() => setGradeTarget(sub)}>Grade</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Modal open={!!gradeTarget} onClose={() => setGradeTarget(null)} title="Grade Submission" subtitle={`Reviewing submission by ${gradeTarget?.studentName}`}>
        {gradeTarget && <GradeModal sub={gradeTarget} onClose={() => setGradeTarget(null)}
          onGraded={async () => { if (selected) setSubmissions(await submissionService.getByAssignment(selected.id)) }} />}
      </Modal>
    </div>
  )
}
