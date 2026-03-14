// StatCard.jsx
export default function StatCard({ label, value, icon, iconClass = 'si-forest', change, delay = 0 }) {
  return (
    <div className="card card-hover" style={{ animation: `slideUp 0.5s ${delay}ms both` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className={`stat-icon ${iconClass}`}>{icon}</div>
        {change && (
          <span style={{ fontSize: '0.72rem', fontFamily: 'Outfit', fontWeight: 700, color: '#1a6b4a', background: 'rgba(26,107,74,0.08)', border: '1px solid rgba(26,107,74,0.15)', padding: '0.15rem 0.5rem', borderRadius: 99 }}>
            {change}
          </span>
        )}
      </div>
      <div style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 900, color: '#1a2332', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value ?? '—'}
      </div>
      <div style={{ fontFamily: 'Lato', fontSize: '0.85rem', color: '#8a9ab0', marginTop: '0.4rem', fontWeight: 400 }}>{label}</div>
    </div>
  )
}
