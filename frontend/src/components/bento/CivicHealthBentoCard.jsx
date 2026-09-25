import React from 'react'
import { Activity, ShieldCheck, AlertTriangle, Sparkles, TrendingUp, HeartPulse } from 'lucide-react'

export default function CivicHealthBentoCard({ zones = [] }) {
  // Calculate average civic health score based on active zones & alert statuses
  const totalZones = zones.length || 4
  const alertCount = zones.filter(z => z.status === 'alert').length
  const elevatedCount = zones.filter(z => z.status === 'elevated').length
  const calmCount = zones.filter(z => z.status === 'calm' || !z.status).length

  // Health Score Calculation: Calm = 95, Elevated = 70, Alert = 40
  const score = totalZones > 0
    ? Math.round((calmCount * 96 + elevatedCount * 70 + alertCount * 42) / totalZones)
    : 88

  const getScoreTheme = (s) => {
    if (s >= 85) return { 
      label: 'Optimal Vitality', 
      text: 'text-emerald-400', 
      bg: 'bg-emerald-500/15', 
      border: 'border-emerald-500/30',
      stroke: '#10b981',
      desc: 'City systems operating within normal thresholds.'
    }
    if (s >= 65) return { 
      label: 'Moderate Disruption', 
      text: 'text-amber-400', 
      bg: 'bg-amber-500/15', 
      border: 'border-amber-500/30',
      stroke: '#f59e0b',
      desc: 'Localized bottlenecks detected across 1-2 sectors.'
    }
    return { 
      label: 'Critical Alert', 
      text: 'text-rose-400', 
      bg: 'bg-rose-500/15', 
      border: 'border-rose-500/30',
      stroke: '#f43f5e',
      desc: 'Multiple cascading civic anomalies requiring coordination.'
    }
  }

  const theme = getScoreTheme(score)
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  // 5 Civic Pillars
  const pillars = [
    { name: 'Environment', score: alertCount > 0 ? 68 : 94, color: 'bg-cyan-500' },
    { name: 'Mobility', score: alertCount > 0 ? 54 : 91, color: 'bg-emerald-500' },
    { name: 'Public Safety', score: alertCount > 0 ? 62 : 96, color: 'bg-indigo-500' },
    { name: 'Infrastructure', score: alertCount > 0 ? 58 : 89, color: 'bg-amber-500' },
    { name: 'Municipal Services', score: alertCount > 0 ? 76 : 95, color: 'bg-rose-500' }
  ]

  return (
    <div className="bento-card p-5 bento-card-sage flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Visual background ambient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-wide">Civic Health Index</h3>
              <p className="text-[11px] text-slate-400 font-medium">Real-time composite telemetry</p>
            </div>
          </div>

          <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${theme.bg} ${theme.text} ${theme.border}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
            {theme.label}
          </span>
        </div>

        {/* Circular Radial Gauge & Score Display */}
        <div className="flex items-center justify-between gap-4 my-2 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#1e293b"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={theme.stroke}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white leading-none tracking-tight">{score}</span>
              <span className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">/ 100</span>
            </div>
          </div>

          {/* Quick status text & pulse waveform */}
          <div className="flex-1 min-w-0 pl-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-200 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multi-Source Synthetic Pulse</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
              {theme.desc}
            </p>
            {/* Animated Mini Pulse Wave */}
            <div className="flex items-center gap-1 mt-2.5 h-3">
              {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 30].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-emerald-400/70 rounded-full transition-all duration-300"
                  style={{
                    height: `${Math.max(4, (h * (score / 100)))}%`,
                    animation: `pulse 1.${i + 2}s infinite alternate ease-in-out`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5 Civic Pillars Progress Bars */}
      <div className="pt-2 space-y-1.5 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1">
          <span>Pillar Performance</span>
          <span className="font-mono text-emerald-400 text-[10px]">5 DOMAINS ACTIVE</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {pillars.map(p => (
            <div key={p.name} className="flex flex-col gap-1">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${p.color} rounded-full transition-all duration-700`}
                  style={{ width: `${p.score}%` }}
                />
              </div>
              <span className="text-[9px] text-slate-400 truncate text-center font-medium">
                {p.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
