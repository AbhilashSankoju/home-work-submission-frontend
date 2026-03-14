import { FolderSearch } from 'lucide-react'

export default function EmptyState({ title = 'Nothing here yet', description = '', action, icon }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ width: 64, height: 64, borderRadius: '1.25rem', background: 'linear-gradient(135deg, #f0f9f4, #d9f0e4)', border: '1px solid rgba(26,107,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
        {icon || <FolderSearch style={{ width: 28, height: 28, color: '#4da882' }} />}
      </div>
      <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1rem', color: '#334155', marginBottom: 6 }}>{title}</h3>
      {description && <p style={{ fontFamily: 'Lato', fontSize: '0.875rem', color: '#8a9ab0', maxWidth: 280, lineHeight: 1.6, marginBottom: action ? '1.25rem' : 0 }}>{description}</p>}
      {action}
    </div>
  )
}
