/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f9f4', 100: '#d9f0e4', 200: '#b0dfc6', 300: '#7dc5a3',
          400: '#4da882', 500: '#2d9068', 600: '#1a6b4a', 700: '#155a3d',
          800: '#124830', 900: '#0e3824', 950: '#071d12',
        },
        gold: {
          50:  '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#c9991a', 600: '#a37812', 700: '#7c5a0e',
        },
        cream: { 50: '#fefdfb', 100: '#fdf9f3', 200: '#f8f2e8', 300: '#f0e8d5' },
        slate2: {
          50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
          400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
          800: '#1e293b', 900: '#0f172a',
        },
        rose2: { 50: '#fff1f2', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48' },
        sky2:  { 50: '#f0f9ff', 400: '#38bdf8', 500: '#0ea5e9' },
        amber2:{ 50: '#fffbeb', 400: '#fbbf24', 500: '#f59e0b' },
      },
      fontFamily: {
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
        body:    ['"Lato"',   'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'xs':      '0 1px 2px rgba(0,0,0,0.04)',
        'sm2':     '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'md2':     '0 4px 12px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)',
        'lg2':     '0 8px 24px rgba(0,0,0,0.09), 0 4px 8px rgba(0,0,0,0.06)',
        'xl2':     '0 16px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)',
        'card':    '0 2px 8px rgba(26,107,74,0.06), 0 1px 3px rgba(0,0,0,0.05)',
        'card-h':  '0 8px 28px rgba(26,107,74,0.12), 0 2px 6px rgba(0,0,0,0.07)',
        'forest':  '0 4px 16px rgba(26,107,74,0.25)',
        'forest-lg':'0 8px 32px rgba(26,107,74,0.35)',
        'gold':    '0 4px 16px rgba(201,153,26,0.25)',
        'inset':   'inset 0 2px 4px rgba(0,0,0,0.04)',
        'modal':   '0 24px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10)',
      },
      animation: {
        'fade-in':      'fadeIn 0.35s ease-out',
        'slide-up':     'slideUp 0.45s cubic-bezier(0.22,1,0.36,1)',
        'slide-right':  'slideRight 0.4s cubic-bezier(0.22,1,0.36,1)',
        'scale-in':     'scaleIn 0.3s cubic-bezier(0.22,1,0.36,1)',
        'bounce-in':    'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        'shimmer':      'shimmer 1.8s ease-in-out infinite',
        'pulse-ring':   'pulseRing 2s ease-in-out infinite',
        'float':        'float 5s ease-in-out infinite',
        'count-up':     'fadeIn 0.6s ease',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(18px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideRight:{ from: { opacity: 0, transform: 'translateX(-14px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        scaleIn:   { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
        bounceIn:  { from: { opacity: 0, transform: 'scale(0.8)' }, to: { opacity: 1, transform: 'scale(1)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseRing: { '0%,100%': { boxShadow: '0 0 0 0 rgba(26,107,74,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(26,107,74,0)' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
}
