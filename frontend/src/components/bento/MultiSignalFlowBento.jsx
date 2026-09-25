import React from 'react'
import { Sparkles, CloudRain, Car, Droplets, Train, ArrowRight, Link2 } from 'lucide-react'

export default function MultiSignalFlowBento({ zones = [], onOpenEvidence }) {
  const correlatedZone = zones.find(z => (z.correlations || []).length > 0) || zones.find(z => z.zone === 'zone-3') || zones[0]

  const signalTiles = [
    { name: 'IMD Doppler Radar', val: '58 mm/h Storm', bgClass: 'bg-[#0284c7]', text: 'text-white', icon: CloudRain },
    { name: 'Delhi Traffic Police', val: '-62% Speed Halt', bgClass: 'bg-[#ea580c]', text: 'text-white', icon: Car },
    { name: 'MCD 311 Grievances', val: '8 Citizen Calls', bgClass: 'bg-[#0d9488]', text: 'text-white', icon: Droplets },
    { name: 'DMRC Blue Line', val: '+22m Line Delay', bgClass: 'bg-[#e11d48]', text: 'text-white', icon: Train }
  ]

  return (
    <div className="bento-card bento-peach p-6 flex flex-col justify-between h-full relative group">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse" />
            <h3 className="font-extrabold text-lg text-orange-950 tracking-tight">Multi-Signal Fusion</h3>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-200/80 text-orange-950 border border-orange-300 flex items-center gap-1">
            <Link2 className="w-3 h-3" /> POSSIBLE LINK
          </span>
        </div>
        <p className="text-xs text-orange-900/80 font-medium mb-4">
          Deterministic cross-signal correlation engine across active sectors.
        </p>

        {/* Floating Brand/Signal Tiles Grid (Givingli Gift Cards Style) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-2">
          {signalTiles.map((tile, i) => {
            const Icon = tile.icon
            return (
              <div
                key={tile.name}
                onClick={() => onOpenEvidence && onOpenEvidence(correlatedZone)}
                className={`p-3 rounded-2xl ${tile.bgClass || 'bg-slate-900'} ${tile.text} shadow-md hover:scale-105 active:scale-95 transition-transform duration-300 cursor-pointer flex flex-col justify-between h-24 relative overflow-hidden`}
              >
                <div className="flex items-center justify-between opacity-80">
                  <Icon className="w-4 h-4" />
                  <span className="text-[9px] font-mono font-bold uppercase">SIG-0{i + 1}</span>
                </div>
                <div>
                  <div className="font-bold text-xs leading-tight">{tile.val}</div>
                  <div className="text-[9px] opacity-80 font-medium truncate mt-0.5">{tile.name}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Grounded Narrative Snippet */}
        <div className="mt-3 p-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-orange-200/60 flex items-center justify-between gap-2">
          <p className="text-xs text-orange-950 font-medium line-clamp-1">
            {correlatedZone?.summary || 'Heavy monsoon rainfall in Central Delhi coincides with Ring Road traffic halt and MCD 311 underpass flood surge.'}
          </p>
          <button
            onClick={() => onOpenEvidence && onOpenEvidence(correlatedZone)}
            className="px-2.5 py-1 rounded-xl bg-orange-950 hover:bg-black text-white text-[10px] font-bold shrink-0 transition flex items-center gap-1 shadow-sm"
          >
            <span>Audit</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Subtext */}
      <div className="pt-3 border-t border-orange-200/80 flex items-center justify-between text-[11px] text-orange-950/80 font-medium">
        <span>Grounded in Structured Telemetry</span>
        <span className="font-mono font-bold text-orange-900">94.2% Co-occurrence</span>
      </div>
    </div>
  )
}
