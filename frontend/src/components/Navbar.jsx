import React from 'react'

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          CityPulse <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">LIVE CIVIC HEALTH</span>
        </h1>
      </div>
      <div className="text-sm text-slate-400">
        Track B — AmiHacks 2026
      </div>
    </header>
  )
}
