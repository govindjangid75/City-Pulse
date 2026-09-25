import React, { useState } from 'react'
import { X, Camera, Video, RefreshCw, Maximize2, Shield, Radio, Eye, Download, Compass } from 'lucide-react'
import { SECTOR_VISUALS } from '../../data/visualData'

export default function SectorCameraModal({ isOpen, onClose, sectorId = 'zone-3' }) {
  const visual = SECTOR_VISUALS[sectorId] || SECTOR_VISUALS['zone-3']
  const [selectedCamIndex, setSelectedCamIndex] = useState(0)
  const [isLiveStreaming, setIsLiveStreaming] = useState(true)

  if (!isOpen) return null

  const cameras = [
    {
      id: 'CAM-01',
      title: 'Arterial Underpass & Drainage Monitoring Cam',
      location: `${visual.name} • South Ramp 4`,
      status: 'LIVE 1080p 60fps',
      image: visual.image,
      metrics: 'Water Level: 1.2m | Flow Rate: Normal | Visibility: 800m'
    },
    {
      id: 'CAM-02',
      title: 'Metro Interchange & Transit Crossing PTZ',
      location: `${visual.name} • Gate 2 Overpass`,
      status: 'LIVE 1080p 30fps',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
      metrics: 'Traffic Density: 74% | Avg Speed: 22 km/h'
    },
    {
      id: 'CAM-03',
      title: 'Civic Plaza & Riverfront Promenade Optical Array',
      location: `${visual.name} • North Pier Gate`,
      status: 'LIVE 4K UltraHD',
      image: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
      metrics: 'Pedestrian Density: Moderate | Air Quality: AQI 84'
    }
  ]

  const currentCam = cameras[selectedCamIndex]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-violet-500/40 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col justify-between text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">{visual.name} Camera Stream</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  CCTV LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{visual.district} • {visual.coords}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Display */}
        <div className="my-4 space-y-3">
          {/* Main Camera Viewport */}
          <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
            <img
              src={currentCam.image}
              alt={currentCam.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

            {/* Top Video HUD */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span className="font-bold text-white">{currentCam.id}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">{currentCam.location}</span>
              </div>
              <div className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px] text-emerald-400 font-bold">
                {currentCam.status}
              </div>
            </div>

            {/* Optical Grid Lines */}
            <div className="absolute inset-0 pointer-events-none border border-white/10 m-6 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              </div>
            </div>

            {/* Bottom HUD */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-black/70 backdrop-blur-md p-2 rounded-xl border border-white/10">
              <span>{currentCam.metrics}</span>
              <span className="text-emerald-400 font-bold">Latency: 42ms</span>
            </div>
          </div>

          {/* Camera Switcher Thumbnails */}
          <div className="grid grid-cols-3 gap-2">
            {cameras.map((cam, idx) => (
              <button
                key={cam.id}
                onClick={() => setSelectedCamIndex(idx)}
                className={`p-2 rounded-xl border text-left transition flex items-center gap-2 ${
                  selectedCamIndex === idx
                    ? 'bg-violet-950/60 border-violet-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                  <img src={cam.image} alt={cam.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs truncate text-white">{cam.id}</div>
                  <div className="text-[10px] text-slate-400 truncate">{cam.title.split(' ')[0]}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Metropolitan CCTV & IoT Vision Gateway</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
          >
            Close Stream
          </button>
        </div>
      </div>
    </div>
  )
}
