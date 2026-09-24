import React from 'react'
import { AlertTriangle, Info, ArrowRight } from 'lucide-react'

export default function AlertBanner({ zones, onSelectZone }) {
  const alertZones = (zones || []).filter(z => z.status === 'alert')
  const elevatedZones = (zones || []).filter(z => z.status === 'elevated')

  if (alertZones.length === 0 && elevatedZones.length === 0) {
    return (
      <div className="bg-emerald-950/20 border-b border-emerald-500/20 px-4 sm:px-6 py-2 text-xs text-emerald-300 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-emerald-400">All Sectors Calm:</span>
            <span className="text-slate-300">All city zones operating within baseline parameters. Feeds reporting normally.</span>
          </div>
          <span className="hidden md:inline font-mono text-[11px] text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            0 Anomaly Flags
          </span>
        </div>
      </div>
    )
  }

  if (alertZones.length > 0) {
    return (
      <div className="bg-gradient-to-r from-red-950/40 via-red-900/30 to-red-950/40 border-b border-red-500/40 px-4 sm:px-6 py-2.5 text-xs text-red-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded bg-red-500/20 border border-red-500/40">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-red-400 tracking-wide uppercase mr-2">High Civic Alert:</span>
              <span className="text-slate-200">
                Co-occurring cross-feed anomalies detected in{' '}
                <strong className="text-white font-semibold">
                  {alertZones.map(z => z.zone.replace('-', ' ').toUpperCase()).join(', ')}
                </strong>
                .
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline text-[11px] font-mono text-red-300/80 bg-red-950/80 px-2.5 py-1 rounded border border-red-500/30">
              Epistemic Honesty: Possible Links Only
            </span>
            {alertZones.length > 0 && (
              <button
                onClick={() => onSelectZone(alertZones[0])}
                className="flex items-center gap-1 text-[11px] font-medium bg-red-500/20 hover:bg-red-500/30 text-red-300 px-2.5 py-1 rounded border border-red-500/40 transition"
              >
                Inspect {alertZones[0].zone} <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-amber-950/30 border-b border-amber-500/30 px-4 sm:px-6 py-2 text-xs text-amber-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-amber-400 uppercase">Elevated Pulse:</span>
          <span className="text-slate-200">
            Moderate activity or isolated delay reported in {elevatedZones.map(z => z.zone.replace('-', ' ')).join(', ')}.
          </span>
        </div>
        <span className="text-[11px] font-mono text-amber-400/80 hidden sm:inline">
          Monitoring {elevatedZones.length} sector(s)
        </span>
      </div>
    </div>
  )
}
