import React, { useState } from 'react'
import { SECTOR_VISUALS } from '../../data/visualData'
import { Camera, Layers, MapPin, Eye, Sparkles, ArrowUpRight, Compass, Video } from 'lucide-react'

export default function SectorLiveLensBento({ 
  zones = [], 
  onSelectZone, 
  selectedZoneId,
  onOpenSectorCamera,
  onOpenReportModal,
  onScrollToMap,
  onTriggerGps
}) {
  const [activeSectorId, setActiveSectorId] = useState('zone-3')
  const visual = SECTOR_VISUALS[activeSectorId] || SECTOR_VISUALS['zone-3']
  const secondaryVisual = activeSectorId === 'zone-3' ? SECTOR_VISUALS['zone-1'] : SECTOR_VISUALS['zone-3']
  const zoneData = zones.find(z => z.zone === activeSectorId)
  const status = zoneData?.status || 'calm'

  const sectorOptions = [
    { id: 'zone-1', label: 'Noida Sec 62' },
    { id: 'zone-2', label: 'Connaught Pl' },
    { id: 'zone-3', label: 'ITO / Pragati' },
    { id: 'zone-4', label: 'Okhla Grid' }
  ]

  const handleSelect = (id) => {
    setActiveSectorId(id)
    const z = zones.find(item => item.zone === id)
    if (z && onSelectZone) onSelectZone(z)
  }

  const handleInspect = () => {
    if (zoneData && onSelectZone) {
      onSelectZone(zoneData)
    } else {
      const z = zones.find(item => item.zone === activeSectorId) || { zone: activeSectorId, summary: 'Normal operational telemetry.' }
      if (onSelectZone) onSelectZone(z)
    }
  }

  const handleCamera = () => {
    if (onOpenSectorCamera) {
      onOpenSectorCamera(activeSectorId)
    }
  }

  const handleLayers = () => {
    if (onScrollToMap) {
      onScrollToMap()
    } else {
      const mapEl = document.getElementById('interactive-map-section')
      if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleGps = () => {
    if (onTriggerGps) {
      onTriggerGps()
    } else {
      const mapEl = document.getElementById('interactive-map-section')
      if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="bento-card bento-lavender p-6 flex flex-col justify-between h-full relative group overflow-hidden">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-pulse" />
            <h3 className="font-extrabold text-lg text-violet-950 tracking-tight">Sector Live Lens</h3>
          </div>
          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-violet-200/80 text-violet-900 border border-violet-300/80">
            {visual.code}
          </span>
        </div>
        <p className="text-xs text-violet-800/80 font-medium mb-3">
          Real-time photographic telemetry & camera feeds
        </p>

        {/* Sector Quick Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-violet-200/60 rounded-2xl mb-3">
          {sectorOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center truncate ${
                activeSectorId === opt.id
                  ? 'bg-white text-violet-950 shadow-sm shadow-violet-900/10'
                  : 'text-violet-800/70 hover:text-violet-950'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Floating Layered Photo Cards (Givingli / Bento Style) */}
        <div className="relative h-56 my-2 flex items-center justify-center overflow-hidden">
          {/* Background Tilted Photo Card */}
          <div 
            onClick={() => handleSelect(secondaryVisual.id)}
            className="absolute w-40 h-48 rounded-2xl overflow-hidden shadow-md border-2 border-white transform translate-x-6 -rotate-6 cursor-pointer opacity-80 hover:opacity-100 hover:rotate-0 transition-all duration-500"
          >
            <img 
              src={secondaryVisual.image} 
              alt={secondaryVisual.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-white">
              <div className="font-bold text-[11px] leading-tight truncate">{secondaryVisual.name}</div>
              <div className="text-[9px] text-slate-300 font-mono">{secondaryVisual.code}</div>
            </div>
          </div>

          {/* Foreground Main Photo Card */}
          <div 
            onClick={handleInspect}
            className="relative w-44 h-52 rounded-2xl overflow-hidden shadow-xl border-4 border-white cursor-pointer hover:scale-105 transition-all duration-500 z-10"
          >
            <img 
              src={visual.image} 
              alt={visual.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            {/* Top Live Badge */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-mono">
              <span className={`w-2 h-2 rounded-full ${status === 'alert' ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`} />
              <span className="font-bold uppercase">{status}</span>
            </div>

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <h4 className="font-extrabold text-sm leading-snug drop-shadow-md flex items-center justify-between">
                <span>{visual.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
              </h4>
              <p className="text-[10px] text-slate-200 line-clamp-1 mt-0.5 font-medium">
                {visual.district}
              </p>
            </div>
          </div>
        </div>

        {/* Fully Interactive Floating Toolbar Widget */}
        <div className="floating-widget p-1.5 mt-3 flex items-center justify-around text-slate-600 bg-white shadow-sm">
          <button 
            onClick={handleInspect}
            className="p-2 flex-1 rounded-xl hover:bg-violet-100 text-violet-800 hover:text-violet-950 transition flex flex-col items-center gap-0.5 active:scale-95"
            title="Inspect Sector Diagnostics"
          >
            <Eye className="w-4 h-4" />
            <span className="text-[10px] font-bold font-mono">Inspect</span>
          </button>
          <div className="w-[1px] h-6 bg-slate-200" />
          <button 
            onClick={handleCamera}
            className="p-2 flex-1 rounded-xl hover:bg-violet-100 text-violet-800 hover:text-violet-950 transition flex flex-col items-center gap-0.5 active:scale-95"
            title="Open Live CCTV Stream"
          >
            <Video className="w-4 h-4 text-violet-700" />
            <span className="text-[10px] font-bold font-mono">CCTV</span>
          </button>
          <div className="w-[1px] h-6 bg-slate-200" />
          <button 
            onClick={() => onOpenReportModal && onOpenReportModal(activeSectorId)}
            className="p-2 flex-1 rounded-xl bg-gradient-to-r from-rose-50 to-amber-50 hover:from-rose-100 hover:to-amber-100 text-rose-700 transition flex flex-col items-center gap-0.5 active:scale-95 border border-rose-200/60"
            title="Take Live Camera Photo & Submit Complaint"
          >
            <Camera className="w-4 h-4 text-rose-600 animate-pulse" />
            <span className="text-[10px] font-bold font-mono text-rose-900">Snap Photo</span>
          </button>
          <div className="w-[1px] h-6 bg-slate-200" />
          <button 
            onClick={handleLayers}
            className="p-2 flex-1 rounded-xl hover:bg-violet-100 text-violet-800 hover:text-violet-950 transition flex flex-col items-center gap-0.5 active:scale-95"
            title="View Layer Map"
          >
            <Layers className="w-4 h-4 text-violet-700" />
            <span className="text-[10px] font-mono font-bold">Map</span>
          </button>
        </div>
      </div>

      {/* Bottom Subtext */}
      <div className="pt-3 border-t border-violet-200/80 flex items-center justify-between text-[11px] text-violet-900/80 font-medium">
        <span>Curated High-Res Civic Imagery</span>
        <span className="font-mono font-bold">Pop: {visual.population}</span>
      </div>
    </div>
  )
}
