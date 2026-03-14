import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, subtitle, children, size = 'md' }) {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    if (open) { document.addEventListener('keydown', h); document.body.style.overflow = 'hidden' }
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [open, onClose])
  if (!open) return null

  const maxW = { sm: 420, md: 560, lg: 720, xl: 880 }[size]
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}>
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,35,50,0.45)', backdropFilter: 'blur(6px)', animation: 'fadeIn 0.2s ease' }} />
      {/* Panel */}
      <div style={{ position: 'relative', width: '100%', maxWidth: maxW, background: '#fff', borderRadius: '1.5rem', boxShadow: '0 24px 80px rgba(0,0,0,0.18)', animation: 'scaleIn 0.3s cubic-bezier(0.22,1,0.36,1)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}>
        {/* Forest header stripe */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, #1a6b4a, #2d9068, #c9991a)' }} />
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '1.5rem 1.75rem 1.25rem', borderBottom: '1px solid #e8e0d5' }}>
          <div>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.15rem', color: '#1a2332', letterSpacing: '-0.01em' }}>{title}</h2>
            {subtitle && <p style={{ fontFamily: 'Lato', fontSize: '0.82rem', color: '#8a9ab0', marginTop: 3 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, border: '1px solid #e8e0d5', borderRadius: '0.625rem', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a9ab0', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f5ede0'; e.currentTarget.style.color = '#1a2332' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8a9ab0' }}>
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>
        <div style={{ padding: '1.5rem 1.75rem' }}>{children}</div>
      </div>
    </div>
  )
}
