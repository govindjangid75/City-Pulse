import React from 'react'

export default function FeedHealthIndicator({ health }) {
  const feeds = [
    { key: 'weather', name: 'Weather Advisories', cadence: 'Hourly' },
    { key: 'transit', name: 'Transit Alerts', cadence: '5 mins' },
    { key: '311', name: '311 Incident Feed', cadence: 'Event-driven' }
  ]

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div>
        <h3 className="text-base font-semibold text-white">Feed Ingestion Health</h3>
        <p className="text-xs text-slate-400">Degradation resilience & source telemetry</p>
      </div>

      <div className="space-y-3">
        {feeds.map(feed => {
          const status = health[feed.key] || 'ok'
          return (
            <div key={feed.key} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800/80">
              <div>
                <p className="text-xs font-medium text-slate-200">{feed.name}</p>
                <p className="text-[10px] text-slate-500">Cadence: {feed.cadence}</p>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded capitalize ${
                status === 'ok' ? 'bg-emerald-500/20 text-emerald-400' :
                status === 'delayed' ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {status}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
