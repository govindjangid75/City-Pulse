import React from 'react'
import { HeartPulse, Activity, Sparkles, ShieldCheck, Wifi, ArrowUpRight, Info } from 'lucide-react'

export default function CivicHealthWalletBento({ zones = [], onOpenDiagnostics }) {
  const totalZones = zones.length || 4
  const alertCount = zones.filter(z => z.status === 'alert').length
  const elevatedCount = zones.filter(z => z.status === 'elevated').length
  const calmCount = zones.filter(z => z.status === 'calm' || !z.status).length

  // Calculate composite score (0-100)
  const score = totalZones > 0
    ? Math.round((calmCount * 96 + elevatedCount * 70 + alertCount * 42) / totalZones)
    : 92

  const statusLabel = score >= 85 ? 'OPTIMAL VITALITY' : score >= 65 ? 'MODERATE CAUTION' : 'CRITICAL ALERT'
  const statusColor = score >= 85 ? 'text-emerald-400' : score >= 65 ? 'text-amber-400' : 'text-rose-400'

  return (
    <div className="bento-card bento-mint p-6 flex flex-col justify-between h-full relative group">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <h3 className="font-extrabold text-lg text-emerald-950 tracking-tight">Civic Vitality</h3>
          </div>
          <button
            onClick={onOpenDiagnostics}
            className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-200/80 hover:bg-emerald-300 text-emerald-900 border border-emerald-300 transition flex items-center gap-1"
          >
            <Info className="w-3 h-3" />
            <span>METHODOLOGY</span>
          </button>
        </div>
        <p className="text-xs text-emerald-900/80 font-medium mb-3">
          Integrated spatial-temporal health composite
        </p>

        {/* Floating Matte Black Smart Pass Card (Givingli Wallet Style) */}
        <div 
          onClick={onOpenDiagnostics}
          className="matte-smart-card p-4 relative overflow-hidden my-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl"
        >
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-2">
            <span className="flex items-center gap-1.5 font-bold tracking-wider text-slate-300">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-400" /> CITY HEALTH PASS
            </span>
            <Wifi className="w-3.5 h-3.5 text-slate-500 rotate-90" />
          </div>

          <div className="flex items-baseline justify-between mt-1 mb-2">
            <div>
              <div className="text-3xl font-black tracking-tight text-white">{score}%</div>
              <div className={`text-[10px] font-mono font-bold tracking-wider mt-0.5 ${statusColor}`}>
                {statusLabel}
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700 flex items-center gap-1">
              <span>Inspect</span>
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
            </span>
          </div>

          {/* Mini 5-Pillar Vitality Strip */}
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-5 gap-1 text-[9px] font-mono text-center text-slate-400">
            <div>
              <div className="h-1 bg-emerald-400 rounded-full mb-1" />
              <span>Env</span>
            </div>
            <div>
              <div className={`h-1 rounded-full mb-1 ${alertCount > 0 ? 'bg-rose-400' : 'bg-emerald-400'}`} />
              <span>Mob</span>
            </div>
            <div>
              <div className="h-1 bg-emerald-400 rounded-full mb-1" />
              <span>Safe</span>
            </div>
            <div>
              <div className="h-1 bg-emerald-400 rounded-full mb-1" />
              <span>Grid</span>
            </div>
            <div>
              <div className="h-1 bg-emerald-400 rounded-full mb-1" />
              <span>311</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtext */}
      <div className="pt-3 border-t border-emerald-200/80 flex items-center justify-between text-[11px] text-emerald-950/80 font-medium">
        <span>Click card to view calculation formula</span>
        <span className="font-mono font-bold text-emerald-900">100% Transparent</span>
      </div>
    </div>
  )
}
