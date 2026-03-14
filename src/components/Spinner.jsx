export default function Spinner({ size = 'md', color = 'forest' }) {
  const sz = { sm: 16, md: 22, lg: 36 }[size]
  const c  = color === 'white' ? '#fff' : '#1a6b4a'
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      style={{ animation: 'spin 0.75s linear infinite', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" stroke={c} strokeWidth="2.5" strokeOpacity="0.15" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
