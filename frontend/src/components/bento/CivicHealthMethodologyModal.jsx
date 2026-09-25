import React from 'react'
import { X, HeartPulse, ShieldCheck, Activity, Layers, CheckCircle2, TrendingUp, Info } from 'lucide-react'

export default function CivicHealthMethodologyModal({ isOpen, onClose, zones = [] }) {
  if (!isOpen) return null

  const dimensions = [
    {
      name: 'Environmental Quality (25%)',
      desc: 'Monitors PM2.5, AQI particulate matter, rainfall rate, temperature delta, and flood basin water level sensors.',
      status: '84% Optimal',
      color: 'bg-cyan-500'
    },
    {
      name: 'Mobility & Transit Flow (25%)',
      desc: 'Ingests GTFS-RT subway train delays, arterial highway congestion percentage, and bus line punctuality.',
      status: '72% Moderate Flow',
      color: 'bg-emerald-500'
    },
    {
      name: 'Public Safety & Risk (20%)',
      desc: 'Correlates active emergency 311 calls, road hazard obstructions, and first responder on-scene response time.',
      status: '91% Secure',
      color: 'bg-indigo-500'
    },
    {
      name: 'Infrastructure & Power Grid (15%)',
      desc: 'Tracks substation transformer load, dark traffic signal outages, and water pump drainage status.',
      status: '88% Resilient',
      color: 'bg-amber-500'
    },
    {
      name: 'Municipal Services & Citizen Watch (15%)',
      desc: 'Verified citizen photographic incident reports, resolution verification, and civic trust index.',
      status: '95% Active Watch',
      color: 'bg-rose-500'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col justify-between text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Civic Health Index Methodology</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  TRANSPARENT FORMULA
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">AmiHacks Problem Statement 2 Composite Index Standard</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="my-4 space-y-4 overflow-y-auto pr-1">
          {/* Formula Callout */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
            <div className="text-xs font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              <span>Deterministic Composite Calculation</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              <code className="font-mono bg-black/40 px-2 py-1 rounded text-emerald-300">
                CivicHealth = 0.25(Env) + 0.25(Mobility) + 0.20(Safety) + 0.15(Grid) + 0.15(311)
              </code>
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              Computed over a rolling 30-minute spatial window across all active municipal sectors. Degrades gracefully if any upstream feed is delayed without reporting false drops.
            </p>
          </div>

          {/* 5 Dimensions List */}
          <div className="space-y-2.5">
            {dimensions.map(dim => (
              <div key={dim.name} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${dim.color}`} />
                    <h5 className="font-bold text-xs text-white">{dim.name}</h5>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{dim.desc}</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-200 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 shrink-0">
                  {dim.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Open Civic Intelligence Protocol</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
          >
            Close Methodology
          </button>
        </div>
      </div>
    </div>
  )
}
