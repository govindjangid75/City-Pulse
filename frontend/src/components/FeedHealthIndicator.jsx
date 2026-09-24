import React, { useState } from 'react'
import { Activity, CloudRain, Train, PhoneCall, CheckCircle2, Clock, AlertOctagon, ShieldCheck, RefreshCw } from 'lucide-react'

export default function FeedHealthIndicator({ health, onToggleFeedHealth }) {
  const [loadingFeed, setLoadingFeed] = useState(null)

  const FEEDS = [
    {
      key: 'weather',
      name: 'Meteorological Feed',
      sourceName: 'National Weather / Radar',
      icon: CloudRain,
      cadence: 'Hourly / Alert-driven',
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10'
    },
    {
      key: 'transit',
      name: 'Transit Authority Feed',
      sourceName: 'Metro & Bus Telemetry',
      icon: Train,
      cadence: '5-min Polling Stream',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10'
    },
    {
      key: '311',
      name: '311 Incident Feed',
      sourceName: 'Citizen Reports & Municipal Ops',
      icon: PhoneCall,
      cadence: 'Event-driven Real-time',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ]

  const handleToggle = async (feedKey, nextStatus) => {
    setLoadingFeed(feedKey)
    try {
      if (onToggleFeedHealth) {
        await onToggleFeedHealth(feedKey, nextStatus)
      }
    } finally {
      setLoadingFeed(null)
    }
  }

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-wide">Feed Health & Resilience</h3>
          </div>
          <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
            Degradation Proof
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Autonomous multi-source telemetry. Killing one source degrades gracefully without crashing the UI.
        </p>
      </div>

      {/* Feed Cards */}
      <div className="space-y-2.5">
        {FEEDS.map(feed => {
          const feedTelemetry = health[feed.key] || {}
          const status = typeof feedTelemetry === 'string' ? feedTelemetry : (feedTelemetry.status || 'ok')
          const Icon = feed.icon
          const isLoading = loadingFeed === feed.key

          return (
            <div 
              key={feed.key} 
              className={`p-3 rounded-xl border transition-all ${
                status === 'missing'
                  ? 'bg-red-950/20 border-red-500/30'
                  : status === 'delayed'
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${feed.bgColor} border border-slate-800`}>
                    <Icon className={`w-4 h-4 ${feed.color}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-100">{feed.name}</h4>
                    <p className="text-[10px] text-slate-400">{feed.cadence}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1 ${
                    status === 'ok' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                    status === 'delayed' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                    'bg-red-500/15 text-red-400 border-red-500/30'
                  }`}>
                    {status === 'ok' && <CheckCircle2 className="w-2.5 h-2.5" />}
                    {status === 'delayed' && <Clock className="w-2.5 h-2.5" />}
                    {status === 'missing' && <AlertOctagon className="w-2.5 h-2.5" />}
                    {status}
                  </span>
                </div>
              </div>

              {/* Degradation Test Toggles */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-mono">Test failure:</span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={isLoading || status === 'ok'}
                    onClick={() => handleToggle(feed.key, 'ok')}
                    className={`px-1.5 py-0.5 rounded transition ${
                      status === 'ok' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    OK
                  </button>
                  <button
                    disabled={isLoading || status === 'delayed'}
                    onClick={() => handleToggle(feed.key, 'delayed')}
                    className={`px-1.5 py-0.5 rounded transition ${
                      status === 'delayed' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    Delay
                  </button>
                  <button
                    disabled={isLoading || status === 'missing'}
                    onClick={() => handleToggle(feed.key, 'missing')}
                    className={`px-1.5 py-0.5 rounded transition ${
                      status === 'missing' ? 'bg-red-500/20 text-red-300 font-bold' : 'hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    Drop
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Resilience Statement */}
      <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300/90 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Failsafe active: Remaining feeds synthesize uninterrupted if any single stream drops.</span>
      </div>
    </div>
  )
}
