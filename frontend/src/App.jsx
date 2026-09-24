import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import AlertBanner from './components/AlertBanner'
import ZoneMap from './components/ZoneMap'
import ZoneCard from './components/ZoneCard'
import ZoneDetailModal from './components/ZoneDetailModal'
import FeedHealthIndicator from './components/FeedHealthIndicator'

export default function App() {
  const [zones, setZones] = useState([])
  const [selectedZone, setSelectedZone] = useState(null)
  const [feedHealth, setFeedHealth] = useState({ weather: 'ok', transit: 'ok', '311': 'ok' })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <AlertBanner zones={zones} />
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6">
        {/* Civic Health Overview & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ZoneMap zones={zones} onSelectZone={setSelectedZone} />
          </div>
          <div>
            <FeedHealthIndicator health={feedHealth} />
          </div>
        </div>

        {/* Glanceable Zone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map(zone => (
            <ZoneCard key={zone.zone} zone={zone} onClick={() => setSelectedZone(zone)} />
          ))}
        </div>
      </main>

      {selectedZone && (
        <ZoneDetailModal zone={selectedZone} onClose={() => setSelectedZone(null)} />
      )}
    </div>
  )
}
