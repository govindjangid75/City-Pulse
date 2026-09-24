import React from 'react'

export default function ZoneCard({ zone, onClick }) {
  const statusColor = 
    zone.status === 'alert' ? 'border-red-500/50 bg-red-950/20 text-red-400' :
    zone.status === 'elevated' ? 'border-amber-500/50 bg-amber-950/20 text-amber-400' :
    'border-emerald-500/40 bg-emerald-950/10 text-emerald-400'

  return (
    <div 
      onClick={onClick}
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white capitalize">{zone.zone.replace('-', ' ')}</h3>
          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-mono uppercase ${statusColor}`}>
            {zone.status}
          </span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {zone.summary}
        </p>
      </div>
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>{zone.active_event_count} events in 30m</span>
        <span className="text-emerald-400 hover:underline">View details →</span>
      </div>
    </div>
  )
}
