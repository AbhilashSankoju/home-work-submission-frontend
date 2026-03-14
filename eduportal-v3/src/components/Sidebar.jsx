import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, PlusSquare, ClipboardCheck,
  BookOpen, UploadCloud, Award, GraduationCap, X, Layers
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const teacherNav = [
  { section: 'Overview' },
  { to: '/teacher/dashboard',         label: 'Dashboard',         Icon: LayoutDashboard },
  { section: 'Assignments' },
  { to: '/teacher/create-assignment', label: 'Create Assignment', Icon: PlusSquare      },
  { to: '/teacher/submissions',       label: 'Review Submissions',Icon: ClipboardCheck  },
]
const studentNav = [
  { section: 'Overview' },
  { to: '/student/dashboard',   label: 'Dashboard',      Icon: LayoutDashboard },
  { section: 'Coursework' },
  { to: '/student/assignments', label: 'Assignments',    Icon: BookOpen        },
  { to: '/student/upload',      label: 'Submit Work',    Icon: UploadCloud     },
  { to: '/student/submissions', label: 'My Submissions', Icon: Award           },
]

export default function Sidebar({ open, onClose }) {
  const { isTeacher, user } = useAuth()
  const nav = isTeacher ? teacherNav : studentNav

  return (
    <>
      {open && (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,35,50,0.4)', backdropFilter: 'blur(4px)', zIndex: 40 }}
          className="lg:hidden" />
      )}

      <aside style={{
        width: 248, flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: '#fff', borderRight: '1px solid #e8e0d5',
        height: '100%', transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
        position: 'fixed', top: 0, left: 0, zIndex: 50,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
      }}
        ref={el => {
          if (el) {
            const mq = window.matchMedia('(min-width:1024px)')
            const t = () => el.style.transform = mq.matches ? 'translateX(0)' : (open ? 'translateX(0)' : 'translateX(-100%)')
            t(); mq.addEventListener('change', t)
          }
        }}>

        {/* Brand */}
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem', borderBottom: '1px solid #e8e0d5', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '0.75rem', background: 'linear-gradient(135deg, #2d9068, #1a6b4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(26,107,74,0.3)' }}>
              <Layers style={{ width: 17, height: 17, color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1rem', color: '#1a2332', letterSpacing: '-0.02em', lineHeight: 1 }}>Academe</p>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: '#8a9ab0', marginTop: 1 }}>Education Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '0.3rem', color: '#8a9ab0' }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* User pill */}
        <div style={{ margin: '1rem 1rem 0', padding: '0.75rem', borderRadius: '0.875rem', background: 'linear-gradient(135deg, #f0f9f4, #d9f0e4)', border: '1px solid rgba(26,107,74,0.12)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.82rem', flexShrink: 0 }}>
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.82rem', color: '#1a2332', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              {isTeacher ? <GraduationCap style={{ width: 11, height: 11, color: '#1a6b4a' }} /> : <BookOpen style={{ width: 11, height: 11, color: '#1a6b4a' }} />}
              <span style={{ fontFamily: 'Lato', fontSize: '0.7rem', color: '#4da882', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.875rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          {nav.map((item, i) =>
            item.section ? (
              <p key={i} style={{ fontFamily: 'Outfit', fontSize: '0.65rem', fontWeight: 800, color: '#c8bfb0', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.875rem 0.875rem 0.4rem', marginTop: i > 0 ? '0.5rem' : 0 }}>
                {item.section}
              </p>
            ) : (
              <NavLink key={item.to} to={item.to} onClick={onClose}
                className={({ isActive }) => `slink ${isActive ? 'active' : ''}`}>
                <item.Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid #e8e0d5', flexShrink: 0 }}>
          <div style={{ borderRadius: '0.875rem', padding: '0.875rem', background: 'linear-gradient(135deg, #1a6b4a, #155a3d)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -16, top: -16, width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            <p style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.78rem', color: '#fff', position: 'relative' }}>Academe v3.0</p>
            <p style={{ fontFamily: 'Lato', fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', marginTop: 2, position: 'relative' }}>Spring Boot + React</p>
          </div>
        </div>
      </aside>
    </>
  )
}
