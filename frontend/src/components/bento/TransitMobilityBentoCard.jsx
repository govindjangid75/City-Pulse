import React from 'react'
import { TRANSIT_LINES_DATA } from '../../data/visualData'
import { Train, Gauge, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function TransitMobilityBentoCard({ zones = [] }) {
  const hasTransitIssue = zones.some(z => 
    (z.correlations && z.correlations.some(c => c.signals?.includes('transit'))) || 
    z.zone === 'zone-3' && z.status === 'alert'
  )

  const lines = TRANSIT_LINES_DATA.map(line => {
    if (line.id === 'line-m2' && hasTransitIssue) {
      return {
        ...line,
        status: 'Delay (+22m)',
        speed: '14 km/h',
        punctuality: '64%',
        issue: 'Water accumulation on track switch near Pragati Maidan / ITO tunnel'
      }
    }
    return line
  })

  return (
    <div className="bento-card bento-porcelain p-6 flex flex-col justify-between h-full relative group">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-600">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Delhi Metro & Transit Pulse</h3>
              <p className="text-[11px] text-slate-500 font-medium">DMRC & DTC real-time GTFS-RT telemetry</p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            3 Lines Active
          </span>
        </div>

        {/* Transit Lines List */}
        <div className="space-y-2.5 my-2">
          {lines.map((line) => {
            const isDelayed = line.status.includes('Delay')
            return (
              <div
                key={line.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isDelayed
                    ? 'bg-rose-50/70 border-rose-200'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Line Header */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: line.color }}
                    />
                    <span className="font-bold text-xs text-slate-900 truncate">{line.name}</span>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    isDelayed
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {line.status}
                  </span>
                </div>

                {/* Metric Strip */}
                <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-slate-400" /> Speed: <strong className="text-slate-800">{line.speed}</strong>
                  </span>
                  <span>Punctuality: <strong className={isDelayed ? 'text-rose-700' : 'text-emerald-700'}>{line.punctuality}</strong></span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>DMRC & DTC GTFS-RT Feed Stream</span>
        <span className="font-mono text-emerald-700 font-bold">86% Systemwide</span>
      </div>
    </div>
  )
}
