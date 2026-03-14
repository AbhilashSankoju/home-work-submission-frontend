import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react'

const Ctx = createContext(null)

const cfg = {
  success: { Icon: CheckCircle2, accent: '#1a6b4a', bg: '#f0f9f4', border: 'rgba(26,107,74,0.2)', text: '#155a3d' },
  error:   { Icon: XCircle,      accent: '#e11d48', bg: '#fff1f2', border: 'rgba(225,29,72,0.2)',  text: '#9f1239' },
  warning: { Icon: AlertTriangle,accent: '#c9991a', bg: '#fffbeb', border: 'rgba(201,153,26,0.25)',text: '#7c5a0e' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const ref = useRef(0)

  const toast = useCallback((message, type = 'success', ms = 4000) => {
    const id = ++ref.current
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), ms)
  }, [])

  const dismiss = id => setToasts(p => p.filter(t => t.id !== id))

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, width: 340 }}>
        {toasts.map(t => {
          const { Icon, accent, bg, border, text } = cfg[t.type] || cfg.success
          return (
            <div key={t.id} className="toast-in"
              style={{ background: bg, border: `1px solid ${border}`, borderLeft: `4px solid ${accent}`, borderRadius: '0.875rem', padding: '0.875rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', boxShadow: '0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)' }}>
              <Icon style={{ color: accent, width: 18, height: 18, flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontFamily: 'Lato', fontSize: '0.875rem', color: text, flex: 1, lineHeight: 1.5 }}>{t.message}</p>
              <button onClick={() => dismiss(t.id)} style={{ color: accent, opacity: 0.6, cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}>
                <X style={{ width: 15, height: 15 }} />
              </button>
            </div>
          )
        })}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => { const c = useContext(Ctx); if (!c) throw new Error('No ToastProvider'); return c }
