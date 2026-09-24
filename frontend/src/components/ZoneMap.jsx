import React, { useState } from 'react'
import { MapPin, CloudRain, Train, AlertCircle, Sparkles, Navigation, Layers } from 'lucide-react'

const ZONE_METADATA = {
  'zone-1': {
    name: 'North Uptown & Harbor',
    district: 'Residential & Marina',
    code: 'SEC-01',
    coords: '40.7589° N, 73.9851° W'
  },
  'zone-2': {
    name: 'West Park Corridor',
    district: 'Arterial Transit & Commercial',
    code: 'SEC-02',
    coords: '40.7505° N, 73.9934° W'
  },
  'zone-3': {
    name: 'Downtown Civic Core',
    district: '5th & Main Underpass / Hub',
    code: 'SEC-03',
    coords: '40.7418° N, 73.9893° W'
  },
  'zone-4': {
    name: 'East River Industrial',
    district: 'Logistics & Waterfront',
    code: 'SEC-04',
    coords: '40.7350° N, 73.9780° W'
  }
}

export default function ZoneMap({ zones, onSelectZone, selectedZoneId }) {
  const [hoveredZone, setHoveredZone] = useState(null)

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
      {/* Background Grid Pattern & Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-wide">Metropolitan Spatial Pulse Map</h2>
          </div>
          <p className="text-xs text-slate-400">Live multi-sector civic telemetry & co-occurrence topology</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Calm
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Elevated
          </span>
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span> Alert
          </span>
        </div>
      </div>

      {/* 2x2 Sector Visual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        {['zone-1', 'zone-2', 'zone-3', 'zone-4'].map(zoneId => {
          const zoneData = (zones || []).find(z => z.zone === zoneId)
          const meta = ZONE_METADATA[zoneId] || { name: zoneId, district: 'City Sector', code: zoneId }
          const status = zoneData ? zoneData.status : 'calm'
          const eventCount = zoneData ? zoneData.active_event_count : 0
          const correlations = zoneData ? zoneData.correlations || [] : []
          const isSelected = selectedZoneId === zoneId

          // Status-specific classes
          const theme = 
            status === 'alert' ? {
              border: isSelected ? 'border-red-500 ring-2 ring-red-500/50' : 'border-red-500/50 hover:border-red-400',
              bg: 'bg-gradient-to-br from-red-950/30 via-slate-900/90 to-red-950/20',
              badge: 'bg-red-500/20 text-red-300 border-red-500/40',
              glow: 'pulse-glow-alert',
              dot: 'bg-red-500'
            } : status === 'elevated' ? {
              border: isSelected ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-amber-500/50 hover:border-amber-400',
              bg: 'bg-gradient-to-br from-amber-950/25 via-slate-900/90 to-amber-950/15',
              badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
              glow: 'pulse-glow-elevated',
              dot: 'bg-amber-500'
            } : {
              border: isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/50' : 'border-slate-800 hover:border-emerald-500/40',
              bg: 'bg-gradient-to-br from-slate-900/80 to-slate-950/80',
              badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
              glow: '',
              dot: 'bg-emerald-400'
            }

          return (
            <div
              key={zoneId}
              onClick={() => zoneData && onSelectZone(zoneData)}
              onMouseEnter={() => setHoveredZone(zoneId)}
              onMouseLeave={() => setHoveredZone(null)}
              className={`rounded-xl border p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[145px] relative overflow-hidden group ${theme.bg} ${theme.border} ${theme.glow}`}
            >
              {/* Radar pulse animation for alert zones */}
              {status === 'alert' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-xl pointer-events-none animate-pulse" />
              )}

              {/* Sector Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-slate-500 font-bold">{meta.code}</span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="font-bold text-sm text-slate-100 group-hover:text-white transition">
                      {meta.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{meta.district}</p>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1 ${theme.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${theme.dot} ${status === 'alert' ? 'animate-ping' : ''}`} />
                  {status}
                </span>
              </div>

              {/* Zone Summary Line */}
              <div className="my-2.5">
                <p className="text-xs text-slate-300 leading-snug line-clamp-2">
                  {zoneData ? zoneData.summary : 'Awaiting sensor stream...'}
                </p>
              </div>

              {/* Footer Metrics & Correlation Indicator */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono">{eventCount} events (30m)</span>
                  {correlations.length > 0 && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded text-[10px] font-mono flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      {correlations.length} link{correlations.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <span className="text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform">
                  Inspect →
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Map Subtext */}
      <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-slate-500" />
          <span>Coordinates mapped across 4 spatial assessment polygons</span>
        </div>
        <span className="font-mono text-slate-400">Window: Rolling 30 Min</span>
      </div>
    </div>
  )
}
