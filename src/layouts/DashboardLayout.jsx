import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar  from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#fdf9f3' }}>
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* Main content — offset for desktop sidebar */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden', marginLeft: 0 }}
        ref={el => {
          if (el) {
            const mq = window.matchMedia('(min-width:1024px)')
            const t = () => el.style.marginLeft = mq.matches ? '248px' : '0'
            t(); mq.addEventListener('change', t)
          }
        }}>
        <Navbar onMenuToggle={() => setOpen(true)} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.75rem 2rem' }}
          className="dot-bg">
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
