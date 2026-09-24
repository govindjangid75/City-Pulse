import React from 'react'

export default function ZoneMap({ zones, onSelectZone }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Metropolitan Pulse Map</h2>
          <p className="text-xs text-slate-400">Spatial visualization of live civic health across zones</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Calm</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Elevated</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Alert</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 h-64 bg-slate-950/60 rounded-lg p-4 border border-slate-800/80">
        {['zone-1', 'zone-2', 'zone-3', 'zone-4'].map(zoneId => {
          const zoneData = (zones || []).find(z => z.zone === zoneId)
          const status = zoneData ? zoneData.status : 'calm'
          return (
            <div
              key={zoneId}
              onClick={() => zoneData && onSelectZone(zoneData)}
              className={`rounded-lg border p-4 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                status === 'alert' 
                  ? 'bg-red-950/30 border-red-500/40 hover:border-red-500' 
                  : status === 'elevated'
                  ? 'bg-amber-950/30 border-amber-500/40 hover:border-amber-500'
                  : 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-200 capitalize">{zoneId.replace('-', ' ')}</span>
                <span className={`text-xs px-2 py-0.5 rounded font-mono uppercase ${
                  status === 'alert' ? 'bg-red-500/20 text-red-400' :
                  status === 'elevated' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {status}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                {zoneData ? zoneData.summary : 'Loading stream...'}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
