import React, { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import AlertBanner from './components/AlertBanner'
import ZoneMap from './components/ZoneMap'
import ZoneCard from './components/ZoneCard'
import ZoneDetailModal from './components/ZoneDetailModal'
import FeedHealthIndicator from './components/FeedHealthIndicator'
import HistoricalReplayBar from './components/HistoricalReplayBar'
import SimulationPanel from './components/SimulationPanel'
import AuthModal from './components/AuthModal'
import AuthPage from './components/AuthPage'
import { 
  fetchAllZones, fetchSystemHealth, toggleFeedStatus, 
  resetSimulationDatabase, fetchHistoryTimeline 
} from './services/api'
import { createPulseWebSocket } from './services/websocket'
import { AlertTriangle, Clock, RefreshCw, Layers, ShieldCheck } from 'lucide-react'

export default function App() {
  const [zones, setZones] = useState([])
  const [selectedZone, setSelectedZone] = useState(null)
  const [feedHealth, setFeedHealth] = useState({ weather: 'ok', transit: 'ok', '311': 'ok' })
  const [wsStatus, setWsStatus] = useState('connecting')
  const [windowMinutes, setWindowMinutes] = useState(30)
  
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('citypulse_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [showFullAuthPage, setShowFullAuthPage] = useState(false)

  // Historical Replay State
  const [replayMode, setReplayMode] = useState(false)
  const [replayTimestamp, setReplayTimestamp] = useState(null)
  const [isPlayingReplay, setIsPlayingReplay] = useState(false)
  const [timeline, setTimeline] = useState([])

  // Simulator Drawer State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date())

  // Load Zones function
  const loadData = async (asOf = null) => {
    try {
      const effectiveAsOf = replayMode ? (asOf || replayTimestamp) : null
      const [zonesData, healthData] = await Promise.all([
        fetchAllZones(windowMinutes, effectiveAsOf),
        fetchSystemHealth()
      ])
      setZones(zonesData || [])
      if (healthData && healthData.feeds) {
        setFeedHealth(healthData.feeds)
      }
      setLastRefreshedAt(new Date())
    } catch (err) {
      console.error('Error fetching CityPulse data', err)
    }
  }

  // Initial load and WebSocket connection
  useEffect(() => {
    loadData()

    const ws = createPulseWebSocket(
      (msg) => {
        // Handle incoming real-time messages
        if (!replayMode) {
          loadData()
        }
      },
      (status) => {
        setWsStatus(status)
      }
    )

    // Polling backup interval every 15 seconds
    const interval = setInterval(() => {
      if (!replayMode) {
        loadData()
      }
    }, 15000)

    return () => {
      ws.close()
      clearInterval(interval)
    }
  }, [replayMode, windowMinutes])

  // Replay timeline fetch
  useEffect(() => {
    if (replayMode) {
      fetchHistoryTimeline()
        .then(data => {
          if (data && data.length > 0) {
            setTimeline(data)
            if (!replayTimestamp) {
              setReplayTimestamp(data[data.length - 1])
              loadData(data[data.length - 1])
            }
          }
        })
        .catch(err => console.error(err))
    } else {
      setReplayTimestamp(null)
      setIsPlayingReplay(false)
      loadData()
    }
  }, [replayMode])

  // Replay step animation timer
  useEffect(() => {
    if (!replayMode || !isPlayingReplay || timeline.length === 0) return

    const timer = setInterval(() => {
      setReplayTimestamp(current => {
        const idx = timeline.findIndex(t => t === current)
        if (idx < 0 || idx >= timeline.length - 1) {
          setIsPlayingReplay(false)
          return timeline[timeline.length - 1]
        }
        const nextTs = timeline[idx + 1]
        loadData(nextTs)
        return nextTs
      })
    }, 2000)

    return () => clearInterval(timer)
  }, [replayMode, isPlayingReplay, timeline])

  const handleSelectScrubTimestamp = (ts) => {
    setReplayTimestamp(ts)
    loadData(ts)
  }

  const handleToggleFeedHealth = async (feed, status) => {
    try {
      await toggleFeedStatus(feed, status)
      await loadData()
    } catch (err) {
      console.error('Failed to toggle feed health', err)
    }
  }

  const handleResetDatabase = async () => {
    try {
      await resetSimulationDatabase()
      await loadData()
    } catch (err) {
      console.error('Failed to reset DB', err)
    }
  }

  // Check if any feed is degraded
  const degradedFeeds = Object.entries(feedHealth).filter(([_, status]) => status !== 'ok')

  // Full-page authentication view
  if (showFullAuthPage) {
    return (
      <AuthPage 
        initialMode={authMode}
        onBackToDashboard={() => setShowFullAuthPage(false)}
        onAuthSuccess={(user, token) => {
          setCurrentUser(user)
          setShowFullAuthPage(false)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar 
        wsStatus={wsStatus}
        replayMode={replayMode}
        onToggleReplay={() => setReplayMode(!replayMode)}
        onResetDatabase={handleResetDatabase}
        onRefresh={() => loadData()}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthMode(mode)
          setIsAuthModalOpen(true)
        }}
        onSignOut={() => {
          localStorage.removeItem('citypulse_token')
          localStorage.removeItem('citypulse_user')
          setCurrentUser(null)
        }}
      />

      {/* Personalized Welcome Banner if User is Authenticated */}
      {currentUser && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border-b border-slate-800/80 px-4 sm:px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">
                Welcome back, <strong className="text-white font-semibold">{currentUser.full_name}</strong>
                {currentUser.role === 'responder' && ' • First Responder Priority Dispatch Feed Active'}
                {currentUser.role === 'analyst' && ' • Municipal Cross-Feed Intelligence Active'}
                {currentUser.role === 'citizen' && ' • Hyperlocal Resident Watch Active'}
              </span>
            </div>
            {currentUser.primary_zone && (
              <span className="text-emerald-400 font-mono text-[11px] hidden sm:inline bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Primary Monitored Sector: {currentUser.primary_zone.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Alert Header */}
      <AlertBanner 
        zones={zones} 
        onSelectZone={(z) => setSelectedZone(z)} 
      />

      {/* Graceful Degradation Notification if any feed is delayed/missing */}
      {degradedFeeds.length > 0 && (
        <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 sm:px-6 py-2 text-xs text-amber-300 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>
                <strong>Feed Latency Notice:</strong>{' '}
                {degradedFeeds.map(([k, v]) => `${k.toUpperCase()} is currently ${v}`).join(' • ')}.
                Dashboard synthesizing pulse from remaining live feeds without interruption.
              </span>
            </div>
            <span className="font-mono text-[11px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-200 border border-amber-500/30 hidden sm:inline">
              Graceful Degradation Active
            </span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* Historical Replay Mode Bar */}
        {replayMode && (
          <HistoricalReplayBar 
            currentTimestamp={replayTimestamp}
            onSelectTimestamp={handleSelectScrubTimestamp}
            isPlaying={isPlayingReplay}
            onTogglePlay={() => setIsPlayingReplay(!isPlayingReplay)}
            onResetToLive={() => {
              if (timeline.length > 0) {
                handleSelectScrubTimestamp(timeline[timeline.length - 1])
              }
            }}
          />
        )}

        {/* Hero Section: Spatial Map & Ingestion Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ZoneMap 
              zones={zones} 
              onSelectZone={(z) => setSelectedZone(z)}
              selectedZoneId={selectedZone ? selectedZone.zone : null}
            />
          </div>
          <div>
            <FeedHealthIndicator 
              health={feedHealth} 
              onToggleFeedHealth={handleToggleFeedHealth}
            />
          </div>
        </div>

        {/* Section Divider */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Glanceable Sector Pulse Overview
            </h2>
            <p className="text-xs text-slate-400">
              Plain-language summaries grounded in active 30-minute multi-feed window
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Updated: {lastRefreshedAt.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* 4-Zone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map(zone => (
            <ZoneCard 
              key={zone.zone} 
              zone={zone} 
              onClick={() => setSelectedZone(zone)} 
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">CityPulse</span>
            <span>— AmiHacks Track B (Industry / Open Innovation)</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>Constraint: "Possible Link" (No Unchecked Causation)</span>
            <span>•</span>
            <span className="text-emerald-400">Production Ready</span>
          </div>
        </div>
      </footer>

      {/* Zone Detail Modal */}
      {selectedZone && (
        <ZoneDetailModal 
          zone={selectedZone} 
          asOf={replayMode ? replayTimestamp : null}
          onClose={() => setSelectedZone(null)} 
        />
      )}

      {/* Demo Simulator Drawer / Modal */}
      {isSimulatorOpen && (
        <SimulationPanel 
          onClose={() => setIsSimulatorOpen(false)}
          onEventInjected={() => loadData()}
        />
      )}

      {/* Auth Modal (Sign In & Sign Up) */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={(user, token) => {
          setCurrentUser(user)
          setIsAuthModalOpen(false)
        }}
      />
    </div>
  )
}
