import React from 'react'
import { Activity, Clock, ShieldCheck, AlertTriangle, Wifi, ToggleLeft, ToggleRight } from 'lucide-react'

export default function FeedHealthBentoCard({ health = {}, onToggleFeedHealth }) {
  const feeds = [
    { key: 'weather', label: 'IMD Doppler Weather Feed', source: 'IMD / Open-Meteo API', ping: '120ms', status: health.weather || 'ok' },
    { key: 'transit', label: 'DMRC & DTC Transit Feed', source: 'DMRC GTFS-RT / TomTom', ping: '240ms', status: health.transit || 'ok' },
    { key: '311', label: 'MCD 311 Citizen Reports', source: 'MCD 311 Civic API', ping: '85ms', status: health['311'] || 'ok' }
  ]

  const handleToggle = (feedKey, currentStatus) => {
    const nextStatus = currentStatus === 'ok' ? 'delayed' : currentStatus === 'delayed' ? 'missing' : 'ok'
    if (onToggleFeedHealth) onToggleFeedHealth(feedKey, nextStatus)
  }

  return (
    <div className="bento-card p-5 bento-card-sage flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <Wifi className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-wide">Feed Telemetry & Resilience</h3>
              <p className="text-[11px] text-slate-400 font-medium">Graceful degradation health monitor</p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Active Fallback Ready
          </span>
        </div>

        {/* Feeds List */}
        <div className="space-y-2 my-2">
          {feeds.map((f) => {
            const isOk = f.status === 'ok'
            const isDelayed = f.status === 'delayed'
            const isMissing = f.status === 'missing'

            const statusTheme = isOk ? {
              badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
              text: 'LIVE (OK)',
              dot: 'bg-emerald-400'
            } : isDelayed ? {
              badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
              text: 'DELAYED (+5m)',
              dot: 'bg-amber-400 animate-pulse'
            } : {
              badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
              text: 'SYNTHETIC FALLBACK',
              dot: 'bg-rose-400'
            }

            return (
              <div
                key={f.key}
                className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2 transition hover:border-slate-700"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusTheme.dot}`} />
                    <h5 className="font-bold text-xs text-white truncate">{f.label}</h5>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                    <span>{f.source}</span>
                    <span>•</span>
                    <span>Latency: {f.ping}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${statusTheme.badge}`}>
                    {statusTheme.text}
                  </span>

                  {/* Interactive toggle switch to test degradation */}
                  <button
                    onClick={() => handleToggle(f.key, f.status)}
                    title={`Click to simulate ${f.key} feed degradation/recovery`}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono border border-slate-700 transition"
                  >
                    Cycle
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Zero System Halts During Upstream Outage</span>
        <span className="font-mono text-emerald-400">99.98% Ingestion Uptime</span>
      </div>
    </div>
  )
}
