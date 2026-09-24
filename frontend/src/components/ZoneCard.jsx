import React from 'react'
import { Sparkles, ArrowRight, ShieldCheck, AlertTriangle, Info, Clock } from 'lucide-react'

const ZONE_SUBTITLES = {
  'zone-1': 'North Uptown / Harbor',
  'zone-2': 'West Park Transit Corridor',
  'zone-3': 'Downtown Core (5th & Main)',
  'zone-4': 'East River Industrial'
}

export default function ZoneCard({ zone, onClick }) {
  const status = zone.status || 'calm'
  const subtitle = ZONE_SUBTITLES[zone.zone] || 'City Sector'
  const correlations = zone.correlations || []
  const eventCount = zone.active_event_count || 0

  const theme = 
    status === 'alert' ? {
      border: 'border-red-500/50 hover:border-red-400',
      bg: 'bg-gradient-to-b from-red-950/20 via-slate-900 to-slate-900',
      badge: 'bg-red-500/20 text-red-300 border-red-500/40',
      dot: 'bg-red-400',
      glow: 'pulse-glow-alert',
      icon: AlertTriangle,
      iconColor: 'text-red-400'
    } : status === 'elevated' ? {
      border: 'border-amber-500/50 hover:border-amber-400',
      bg: 'bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-900',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      dot: 'bg-amber-400',
      glow: 'pulse-glow-elevated',
      icon: Info,
      iconColor: 'text-amber-400'
    } : {
      border: 'border-slate-800 hover:border-emerald-500/40',
      bg: 'bg-slate-900/90',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-400',
      glow: '',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400'
    }

  const StatusIcon = theme.icon

  return (
    <div 
      onClick={onClick}
      className={`glass-card-hover rounded-2xl border p-5 cursor-pointer flex flex-col justify-between relative overflow-hidden group shadow-lg ${theme.bg} ${theme.border} ${theme.glow}`}
    >
      <div>
        {/* Top Bar */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-base text-white capitalize group-hover:text-emerald-300 transition-colors">
              {zone.zone.replace('-', ' ')}
            </h3>
            <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
          </div>

          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1.5 ${theme.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${theme.dot} ${status === 'alert' ? 'animate-ping' : ''}`} />
            {status}
          </span>
        </div>

        {/* Narrative Synthesis */}
        <div className="my-3 min-h-[58px]">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
            {zone.summary}
          </p>
        </div>
      </div>

      <div>
        {/* Correlation & Anomaly Badges */}
        {correlations.length > 0 ? (
          <div className="mb-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-200 flex items-center justify-between">
              <span className="flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {correlations.length} multi-feed correlation{correlations.length > 1 ? 's' : ''}
              </span>
              <span className="text-[10px] font-mono bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300">
                Possible Link
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Normal operational baseline</span>
            </div>
          </div>
        )}

        {/* Card Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            {eventCount} active events (30m)
          </span>
          <span className="text-emerald-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Diagnostics <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  )
}
