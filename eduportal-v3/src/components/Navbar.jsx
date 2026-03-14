import { useEffect, useRef, useState } from 'react'
import { LogOut, Bell, Search, BookOpen, FileCheck, UploadCloud, LayoutDashboard, X, Command } from 'lucide-react'
import { useAuth }   from '../context/AuthContext'
import { useSearch } from '../context/SearchContext'

const teacherLinks = [
  { label: 'Dashboard',          path: '/teacher/dashboard',         icon: LayoutDashboard, desc: 'Overview & analytics' },
  { label: 'Create Assignment',   path: '/teacher/create-assignment', icon: BookOpen,        desc: 'Publish new homework' },
  { label: 'Review Submissions',  path: '/teacher/submissions',       icon: FileCheck,       desc: 'Grade student work' },
]
const studentLinks = [
  { label: 'Dashboard',      path: '/student/dashboard',   icon: LayoutDashboard, desc: 'Your overview' },
  { label: 'Assignments',    path: '/student/assignments',  icon: BookOpen,        desc: 'Browse all assignments' },
  { label: 'Submit Work',    path: '/student/upload',       icon: UploadCloud,     desc: 'Upload homework file' },
  { label: 'My Submissions', path: '/student/submissions',  icon: FileCheck,       desc: 'Track grades & feedback' },
]

export default function Navbar({ onMenuToggle }) {
  const { user, logout, isTeacher } = useAuth()
  const { query, search, results, goTo } = useSearch()

  const [open,   setOpen]   = useState(false)
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const boxRef   = useRef(null)
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()

  const quickLinks  = isTeacher ? teacherLinks : studentLinks
  const showResults = query.trim().length > 0 ? results : quickLinks

  // Ctrl+K shortcut
  useEffect(() => {
    const h = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); inputRef.current?.focus(); setOpen(true) }
      if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur() }
    }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [])

  // Close on outside click
  useEffect(() => {
    const h = e => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleKey = e => {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, showResults.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
    if (e.key === 'Enter' && showResults[active]) { goTo(showResults[active].path); setActive(0) }
  }

  return (
    <header style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', background: '#fff', borderBottom: '1px solid #e8e0d5', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 1px 4px rgba(26,107,74,0.05)', flexShrink: 0 }}>

      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flex: 1, minWidth: 0 }}>
        <button onClick={onMenuToggle}
          style={{ display: 'none', width: 34, height: 34, border: '1.5px solid #e8e0d5', borderRadius: '0.625rem', background: 'transparent', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', color: '#8a9ab0', flexShrink: 0 }}
          ref={el => { if (el) { const mq = window.matchMedia('(max-width:1023px)'); const t = () => el.style.display = mq.matches ? 'flex' : 'none'; t(); mq.addEventListener('change', t) } }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>

        {/* Search */}
        <div ref={boxRef} style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: open ? '#1a6b4a' : '#8a9ab0', pointerEvents: 'none', transition: 'color 0.18s', zIndex: 1 }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => { search(e.target.value); setOpen(true); setActive(0) }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKey}
              placeholder="Search pages… (Ctrl+K)"
              style={{ width: '100%', padding: '0.5rem 2.75rem 0.5rem 2.4rem', borderRadius: open ? '0.75rem 0.75rem 0 0' : '0.75rem', border: `1.5px solid ${open ? '#1a6b4a' : '#e8e0d5'}`, background: open ? '#fff' : '#fdf9f3', fontFamily: 'Lato', fontSize: '0.875rem', color: '#1a2332', outline: 'none', transition: 'all 0.2s', boxShadow: open ? '0 0 0 3px rgba(26,107,74,0.1)' : 'none' }}
            />
            {query ? (
              <button onClick={() => { search(''); setOpen(false) }} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a9ab0', display: 'flex', padding: 2 }}>
                <X style={{ width: 14, height: 14 }} />
              </button>
            ) : (
              <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 2, background: '#f0ece6', border: '1px solid #e8e0d5', borderRadius: 4, padding: '1px 5px', pointerEvents: 'none' }}>
                <Command style={{ width: 10, height: 10, color: '#8a9ab0' }} />
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: '#8a9ab0' }}>K</span>
              </div>
            )}
          </div>

          {/* Dropdown */}
          {open && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1.5px solid #1a6b4a', borderTop: '1px solid #e8e0d5', borderRadius: '0 0 0.875rem 0.875rem', boxShadow: '0 12px 32px rgba(26,107,74,0.14)', overflow: 'hidden', zIndex: 200 }}>
              <div style={{ padding: '0.5rem 1rem 0.25rem', fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.65rem', color: '#8a9ab0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {query.trim() ? `Results for "${query}"` : 'Quick Navigation'}
              </div>
              {showResults.length === 0 ? (
                <div style={{ padding: '1.25rem', textAlign: 'center', fontFamily: 'Lato', fontSize: '0.875rem', color: '#8a9ab0' }}>
                  No results for "<strong style={{ color: '#4a5568' }}>{query}</strong>"
                </div>
              ) : showResults.map((item, i) => {
                const Icon = item.icon || Search
                const isActive = active === i
                return (
                  <div key={item.path}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => { goTo(item.path); setActive(0) }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem', cursor: 'pointer', background: isActive ? 'rgba(26,107,74,0.06)' : 'transparent', borderLeft: `3px solid ${isActive ? '#1a6b4a' : 'transparent'}`, transition: 'all 0.12s' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '0.625rem', background: isActive ? 'rgba(26,107,74,0.1)' : '#fdf9f3', border: '1px solid #e8e0d5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.12s' }}>
                      <Icon style={{ width: 14, height: 14, color: isActive ? '#1a6b4a' : '#8a9ab0' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.875rem', color: isActive ? '#1a2332' : '#4a5568' }}>{item.label}</p>
                      {item.desc && <p style={{ fontFamily: 'Lato', fontSize: '0.75rem', color: '#8a9ab0', marginTop: 1 }}>{item.desc}</p>}
                    </div>
                    {isActive && <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: '#1a6b4a', background: 'rgba(26,107,74,0.08)', padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>↵</span>}
                  </div>
                )
              })}
              <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid #e8e0d5', display: 'flex', gap: '1rem' }}>
                {[['↑↓','Navigate'],['↵','Open'],['Esc','Close']].map(([k,l]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <kbd style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', background: '#f0ece6', border: '1px solid #e8e0d5', borderRadius: 3, padding: '1px 5px', color: '#8a9ab0' }}>{k}</kbd>
                    <span style={{ fontFamily: 'Lato', fontSize: '0.7rem', color: '#8a9ab0' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginLeft: '1rem' }}>
        <button style={{ position: 'relative', width: 36, height: 36, border: '1.5px solid #e8e0d5', borderRadius: '0.625rem', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a9ab0', transition: 'all 0.18s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f5ede0'; e.currentTarget.style.borderColor = '#d4c9b8' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e8e0d5' }}>
          <Bell style={{ width: 16, height: 16 }} />
          <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: '#c9991a', border: '2px solid #fff' }} />
        </button>
        <div style={{ width: 1, height: 28, background: '#e8e0d5', margin: '0 0.25rem' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ display: 'none' }}
            ref={el => { if (el) { const mq = window.matchMedia('(min-width:640px)'); const t = () => el.style.display = mq.matches ? 'block' : 'none'; t(); mq.addEventListener('change', t) } }}>
            <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.85rem', color: '#1a2332', lineHeight: 1.2 }}>{user?.name}</p>
            <p style={{ fontFamily: 'Lato', fontSize: '0.72rem', color: '#8a9ab0', textTransform: 'capitalize' }}>{user?.role?.toLowerCase()}</p>
          </div>
          <div className="avatar" style={{ width: 34, height: 34, fontSize: '0.78rem', cursor: 'default' }}>{initials}</div>
          <button onClick={logout} title="Sign out"
            style={{ width: 32, height: 32, border: '1.5px solid #e8e0d5', borderRadius: '0.625rem', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a9ab0', transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff1f2'; e.currentTarget.style.borderColor = '#fecdd3'; e.currentTarget.style.color = '#e11d48' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e8e0d5'; e.currentTarget.style.color = '#8a9ab0' }}>
            <LogOut style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>
    </header>
  )
}
