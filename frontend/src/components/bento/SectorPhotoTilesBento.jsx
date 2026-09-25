import React from 'react'
import { SECTOR_VISUALS } from '../../data/visualData'
import { ArrowUpRight, AlertTriangle, ShieldCheck, Sparkles, MapPin, Droplets, Wind } from 'lucide-react'

export default function SectorPhotoTilesBento({ zones = [], onSelectZone }) {
  const sectorList = ['zone-1', 'zone-2', 'zone-3', 'zone-4']

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {sectorList.map(zoneId => {
        const visual = SECTOR_VISUALS[zoneId] || {}
        const zoneData = zones.find(z => z.zone === zoneId)
        const status = zoneData?.status || 'calm'
        const eventCount = zoneData?.active_event_count || 0
        const correlations = zoneData?.correlations || []

        const statusStyle = 
          status === 'alert' ? {
            badge: 'bg-rose-500/90 text-white shadow-lg shadow-rose-500/40',
            dot: 'bg-white',
            border: 'border-rose-500/50 hover:border-rose-400 ring-1 ring-rose-500/30',
            glow: 'pulse-glow-alert',
            icon: AlertTriangle,
            label: 'ALERT'
          } : status === 'elevated' ? {
            badge: 'bg-amber-500/90 text-slate-950 font-bold shadow-lg shadow-amber-500/30',
            dot: 'bg-slate-950',
            border: 'border-amber-500/50 hover:border-amber-400 ring-1 ring-amber-500/30',
            glow: 'pulse-glow-elevated',
            icon: Sparkles,
            label: 'ELEVATED'
          } : {
            badge: 'bg-emerald-500/90 text-slate-950 font-bold shadow-lg shadow-emerald-500/30',
            dot: 'bg-slate-950',
            border: 'border-slate-800 hover:border-emerald-500/50',
            glow: 'pulse-glow-calm',
            icon: ShieldCheck,
            label: 'CALM'
          }

        const StatusIcon = statusStyle.icon

        return (
          <div
            key={zoneId}
            onClick={() => zoneData && onSelectZone(zoneData)}
            className={`bento-card group cursor-pointer relative h-64 flex flex-col justify-between p-4 ${statusStyle.border} ${statusStyle.glow} transition-all duration-300 hover:scale-[1.02]`}
          >
            {/* Background Photographic Image with Gradient Overlays */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={visual.thumb || visual.image}
                alt={visual.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/40" />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
            </div>

            {/* Top Bar: Sector Code & Live Status Badge */}
            <div className="relative z-10 flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-200">
                <span className="font-bold text-white">{visual.code}</span>
                <span className="text-slate-400">•</span>
                <span className="truncate max-w-[90px]">{visual.tags?.[0]}</span>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md uppercase tracking-wider ${statusStyle.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} ${status === 'alert' ? 'animate-ping' : ''}`} />
                {statusStyle.label}
              </span>
            </div>

            {/* Bottom Content Area: Visual Hierarchy & Action */}
            <div className="relative z-10 space-y-2">
              <div>
                <h4 className="font-extrabold text-base text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                  <span>{visual.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h4>
                <p className="text-[11px] text-slate-300 line-clamp-1 font-medium mt-0.5">
                  {visual.district}
                </p>
              </div>

              {/* Multi-Signal Glance Pill */}
              <div className="p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-[11px] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-300 truncate">
                  <StatusIcon className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span className="truncate">
                    {correlations.length > 0
                      ? `${correlations.length} Signal Link Detected`
                      : `${eventCount} Active Events (30m)`}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-bold shrink-0">
                  {visual.population}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
