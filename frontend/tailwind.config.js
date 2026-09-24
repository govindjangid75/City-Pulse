/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#060a12',
          900: '#0c1322',
          850: '#111a2e',
          800: '#1b2742',
          750: '#233252',
          700: '#33446b',
        },
        civic: {
          calm: '#10b981',
          calmGlow: 'rgba(16, 185, 129, 0.25)',
          elevated: '#f59e0b',
          elevatedGlow: 'rgba(245, 158, 11, 0.25)',
          alert: '#ef4444',
          alertGlow: 'rgba(239, 68, 68, 0.35)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar 4s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
