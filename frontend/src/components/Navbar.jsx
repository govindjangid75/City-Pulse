import React from 'react'
import { Activity, Radio, RefreshCw, Play, RotateCcw, ShieldAlert, Cpu } from 'lucide-react'

export default function Navbar({ 
  wsStatus, 
  replayMode, 
  onToggleReplay, 
  onResetDatabase, 
  onRefresh, 
  alertCount,
  onOpenSimulator
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-emerald-500/30">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                CityPulse
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Live Civic Health
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Multi-Feed Civic Anomaly & Correlation Fusion Engine
            </p>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* WebSocket Live Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${
              wsStatus === 'connected' ? 'bg-emerald-400 animate-pulse' :
              wsStatus === 'connecting' ? 'bg-amber-400 animate-bounce' : 'bg-red-400'
            }`} />
            <span className="text-slate-300 text-[11px] hidden sm:inline">
              {wsStatus === 'connected' ? 'Live Stream Active' : 'Connecting...'}
            </span>
          </div>

          {/* Time Scrubber Replay Mode Toggle */}
          <button
            onClick={onToggleReplay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              replayMode
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-sm shadow-indigo-500/20'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${replayMode ? 'text-indigo-400 fill-indigo-400' : ''}`} />
            <span>{replayMode ? 'Exit Replay' : 'Time Scrubber'}</span>
          </button>

          {/* Simulator & Crisis Presets */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-emerald-600/30 to-indigo-600/30 hover:from-emerald-600/50 hover:to-indigo-600/50 text-slate-100 border border-emerald-500/40 transition shadow-sm"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Demo Scenarios</span>
          </button>

          {/* Manual Refresh */}
          <button
            onClick={onRefresh}
            title="Refresh Data"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Reset Baseline */}
          <button
            onClick={onResetDatabase}
            title="Reset DB to Baseline Seed"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
