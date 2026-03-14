import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle2, UploadCloud, Star, ArrowRight, GraduationCap, Users, Shield, BarChart3, Zap, Layers } from 'lucide-react'

const features = [
  { Icon: BookOpen,    title: 'Structured Assignments',  desc: 'Teachers craft detailed assignments with descriptions, deadlines, and rich context in seconds.',         col: '#1a6b4a' },
  { Icon: UploadCloud, title: 'Seamless File Uploads',   desc: 'Students submit PDF, DOC, and DOCX files via drag-and-drop with live upload progress tracking.',          col: '#0369a1' },
  { Icon: Star,        title: 'Precision Grading',       desc: 'Review, score, and deliver detailed written feedback per submission — all from one powerful panel.',       col: '#c9991a' },
  { Icon: Shield,      title: 'Role-Based Security',     desc: 'JWT-protected endpoints with strict TEACHER and STUDENT role enforcement at every layer.',                 col: '#7c3aed' },
  { Icon: CheckCircle2,title: 'Live Status Tracking',    desc: 'Submission status transitions from SUBMITTED → GRADED automatically — no manual updates needed.',         col: '#0e7490' },
  { Icon: BarChart3,   title: 'Smart Analytics',         desc: 'Visual dashboards give teachers instant insight into class submission rates, averages, and trends.',       col: '#b45309' },
]

const stats = [['98%', 'On-time delivery'], ['< 200ms', 'API response'], ['JWT', 'Auth standard'], ['2 roles', 'Teacher & Student']]

export default function Landing() {
  return (
    <div style={{ minWidth: '100vw', background: '#fdf9f3', color: '#1a2332', fontFamily: 'Lato, sans-serif' }}>

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(253,249,243,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e8e0d5', padding: '0 2.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(26,107,74,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '0.75rem', background: 'linear-gradient(135deg, #2d9068, #1a6b4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(26,107,74,0.3)' }}>
            <Layers style={{ width: 18, height: 18, color: '#fff' }} />
          </div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.25rem', color: '#1a2332', letterSpacing: '-0.03em' }}>Academe</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/login" className="btn btn-secondary btn-sm">Sign in</Link>
          <Link to="/register" className="btn btn-primary btn-sm" style={{ gap: '0.375rem' }}>
            Get started <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '7rem 2.5rem 5rem', textAlign: 'center', position: 'relative' }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,107,74,0.08) 0%, transparent 70%)', top: 40, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(26,107,74,0.08)', border: '1px solid rgba(26,107,74,0.18)', borderRadius: 99, padding: '0.35rem 1rem 0.35rem 0.5rem', marginBottom: '2rem' }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #2d9068, #1a6b4a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap style={{ width: 12, height: 12, color: '#fff' }} />
          </div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.78rem', color: '#1a6b4a', letterSpacing: '0.02em' }}>The smarter classroom platform</span>
        </div>

        <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '1.5rem', position: 'relative' }}>
          Homework. Graded.<br />
          <span className="grad-text">Effortlessly.</span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#64748b', maxWidth: 600, margin: '0 auto 3rem', lineHeight: 1.7 }}>
          Academe is the professional-grade homework portal for teachers who demand precision
          and students who deserve clarity — built on Spring Boot + React.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
          <Link to="/register?role=TEACHER" className="btn btn-primary btn-xl" style={{ gap: '0.625rem' }}>
            <GraduationCap style={{ width: 20, height: 20 }} /> Start as Teacher
          </Link>
          <Link to="/register?role=STUDENT" className="btn btn-secondary btn-xl" style={{ gap: '0.625rem' }}>
            <Users style={{ width: 20, height: 20 }} /> Join as Student
          </Link>
        </div>

        {/* Stats strip */}
        <div style={{ display: 'inline-flex', gap: 0, background: '#fff', border: '1px solid #e8e0d5', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          {stats.map(([val, label], i) => (
            <div key={label} style={{ padding: '1rem 2rem', borderRight: i < stats.length - 1 ? '1px solid #e8e0d5' : 'none', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.5rem', color: '#1a6b4a', letterSpacing: '-0.02em' }}>{val}</p>
              <p style={{ fontFamily: 'Lato', fontSize: '0.78rem', color: '#8a9ab0', marginTop: 2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 2.5rem 6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2.5rem', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Everything, in one place</h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: 480, margin: '0 auto' }}>All the tools modern classrooms need — nothing they don't.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {features.map((f, i) => (
            <div key={f.title} className="card card-hover"
              style={{ animation: `slideUp 0.5s ${i * 70}ms both` }}>
              <div style={{ width: 48, height: 48, borderRadius: '0.875rem', background: `${f.col}12`, border: `1px solid ${f.col}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <f.Icon style={{ width: 22, height: 22, color: f.col }} />
              </div>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '0 2.5rem 6rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', background: 'linear-gradient(135deg, #1a6b4a 0%, #155a3d 100%)', borderRadius: '2rem', padding: '4rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 16px 48px rgba(26,107,74,0.3)' }}>
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: -80, right: -80 }} />
          <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(201,153,26,0.1)', bottom: -60, left: -40 }} />
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2.25rem', color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.75rem', position: 'relative' }}>Ready to transform your classroom?</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', marginBottom: '2rem', position: 'relative' }}>Join thousands of educators and students on Academe.</p>
          <Link to="/register" className="btn btn-gold btn-lg" style={{ position: 'relative', gap: '0.5rem' }}>
            Create free account <ArrowRight style={{ width: 18, height: 18 }} />
          </Link>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #e8e0d5', padding: '1.5rem', textAlign: 'center', fontFamily: 'Lato', fontSize: '0.82rem', color: '#8a9ab0' }}>
        © {new Date().getFullYear()} Academe — Built with Spring Boot + React · All rights reserved
      </footer>
    </div>
  )
}
