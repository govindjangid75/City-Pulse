import React, { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import AlertBanner from './components/AlertBanner'
import SectorLiveLensBento from './components/bento/SectorLiveLensBento'
import SchedulingScrubberBento from './components/bento/SchedulingScrubberBento'
import CivicHealthWalletBento from './components/bento/CivicHealthWalletBento'
import CitizenInboxBento from './components/bento/CitizenInboxBento'
import MultiSignalFlowBento from './components/bento/MultiSignalFlowBento'
import MobileNotificationBento from './components/bento/MobileNotificationBento'
import InteractiveMapBentoCard from './components/bento/InteractiveMapBentoCard'
import WeatherRadarBentoCard from './components/bento/WeatherRadarBentoCard'
import TransitMobilityBentoCard from './components/bento/TransitMobilityBentoCard'
import CommandDispatchBentoCard from './components/bento/CommandDispatchBentoCard'
import FeedHealthBentoCard from './components/bento/FeedHealthBentoCard'
import CitizenReportModal from './components/bento/CitizenReportModal'
import EvidenceDrawerModal from './components/bento/EvidenceDrawerModal'
import SectorCameraModal from './components/bento/SectorCameraModal'
import CivicHealthMethodologyModal from './components/bento/CivicHealthMethodologyModal'
import ZoneDetailModal from './components/ZoneDetailModal'
import SimulationPanel from './components/SimulationPanel'
import AuthModal from './components/AuthModal'
import AuthPage from './components/AuthPage'
import HomePage from './components/HomePage'
import AdminPortal from './components/AdminPortal'
import AllIndiaAlertsHub from './components/AllIndiaAlertsHub'
import SubscriptionModal from './components/SubscriptionModal'
import BusinessIntelligenceView from './components/BusinessIntelligenceView'
import { getActiveSubscription } from './data/subscriptionPlans'

import { 
  fetchAllZones, fetchSystemHealth, toggleFeedStatus, 
  resetSimulationDatabase, fetchHistoryTimeline 
} from './services/api'
import { createPulseWebSocket } from './services/websocket'
import { subscribeToRealtimeEvents } from './services/supabase'
import { Sparkles, Clock, AlertTriangle, ShieldCheck, Layers, Activity, Compass, HeartPulse } from 'lucide-react'

export default function App() {
  const [zones, setZones] = useState([])
  const [selectedZone, setSelectedZone] = useState(null)
  const [evidenceZone, setEvidenceZone] = useState(null)
  const [cameraSectorId, setCameraSectorId] = useState(null)
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false)
  const [feedHealth, setFeedHealth] = useState({ weather: 'ok', transit: 'ok', '311': 'ok' })
  const [wsStatus, setWsStatus] = useState('connecting')
  const [windowMinutes, setWindowMinutes] = useState(30)
  
  // Navigation View Tab: 'home' | 'citizen' | 'command' | 'replay'
  const [activeTab, setActiveTab] = useState('home')

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
  const [replayTimestamp, setReplayTimestamp] = useState(null)
  const [isPlayingReplay, setIsPlayingReplay] = useState(false)
  const [timeline, setTimeline] = useState([])

  // Live Geolocation State from Sign Up / Login
  const [userLiveLocation, setUserLiveLocation] = useState(null)
  const [showLocationWelcome, setShowLocationWelcome] = useState(false)

  // Modals & Panels State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)
  const [isCitizenReportOpen, setIsCitizenReportOpen] = useState(false)
  const [reportSectorId, setReportSectorId] = useState('zone-3')
  const [activeSubscription, setActiveSubscriptionState] = useState(() => getActiveSubscription())
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date())

  // Load Zones function
  const loadData = async (asOf = null) => {
    try {
      const effectiveAsOf = activeTab === 'replay' ? (asOf || replayTimestamp) : null
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
        if (activeTab !== 'replay') {
          loadData()
        }
      },
      (status) => {
        setWsStatus(status)
      }
    )

    const interval = setInterval(() => {
      if (activeTab !== 'replay') {
        loadData()
      }
    }, 15000)

    const realtimeChannel = subscribeToRealtimeEvents(() => {
      if (activeTab !== 'replay') {
        loadData()
      }
    })

    return () => {
      ws.close()
      clearInterval(interval)
      if (realtimeChannel) realtimeChannel.unsubscribe()
    }
  }, [activeTab, windowMinutes])

  // Replay timeline fetch
  useEffect(() => {
    if (activeTab === 'replay') {
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
  }, [activeTab])

  // Replay step animation timer
  useEffect(() => {
    if (activeTab !== 'replay' || !isPlayingReplay || timeline.length === 0) return

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
  }, [activeTab, isPlayingReplay, timeline])

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

  const scrollToMapSection = () => {
    const el = document.getElementById('indian-map-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleAuthSuccess = (user, token, locationData) => {
    setCurrentUser(user)
    setShowFullAuthPage(false)
    if (locationData) {
      setUserLiveLocation(locationData)
      setShowLocationWelcome(true)
      setTimeout(() => setShowLocationWelcome(false), 6000)
    }
  }

  const degradedFeeds = Object.entries(feedHealth).filter(([_, status]) => status !== 'ok')

  // Show Sign Up / Login onboarding page only if explicitly triggered from Navbar
  if (showFullAuthPage) {
    return (
      <AuthPage 
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
        onCancel={() => setShowFullAuthPage(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar 
        wsStatus={wsStatus}
        replayMode={activeTab === 'replay'}
        onToggleReplay={() => setActiveTab(activeTab === 'replay' ? 'citizen' : 'replay')}
        onResetDatabase={handleResetDatabase}
        onRefresh={() => loadData()}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthMode(mode)
          setShowFullAuthPage(true)
        }}
        onSignOut={() => {
          localStorage.removeItem('citypulse_token')
          localStorage.removeItem('citypulse_user')
          setCurrentUser(null)
          setUserLiveLocation(null)
        }}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        activeSubscription={activeSubscription}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
      />

      {/* Auto-Detected Live GPS Welcome Banner */}
      {showLocationWelcome && userLiveLocation && (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-4 sm:px-6 py-2.5 shadow-md animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-extrabold tracking-tight">
                📍 Live GPS Location Locked: {userLiveLocation.lat.toFixed(4)}° N, {userLiveLocation.lng.toFixed(4)}° E
              </span>
              <span className="opacity-90 hidden sm:inline">
                • Nearest Indian Sector: <strong>{userLiveLocation.nearestSector?.name}</strong> ({userLiveLocation.distanceKm} km away)
              </span>
            </div>
            <button
              onClick={scrollToMapSection}
              className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] transition"
            >
              View on Map ↓
            </button>
          </div>
        </div>
      )}

      {/* User Welcome Strip */}
      {currentUser && (
        <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-2 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-600">
                Welcome, <strong className="text-slate-900 font-bold">{currentUser.full_name}</strong>
                {currentUser.role === 'responder' && ' • Emergency Responder Priority Active'}
                {currentUser.role === 'analyst' && ' • Municipal Cross-Feed Intelligence Active'}
                {currentUser.role === 'citizen' && ' • Hyperlocal Resident Watch Active'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {userLiveLocation && (
                <span className="text-blue-800 font-mono text-[11px] hidden sm:inline bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
                  📍 GPS: {userLiveLocation.lat.toFixed(2)}°, {userLiveLocation.lng.toFixed(2)}°
                </span>
              )}
              {currentUser.primary_zone && (
                <span className="text-emerald-800 font-mono text-[11px] hidden sm:inline bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                  Zone: {currentUser.primary_zone.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Alert Ticker */}
      <AlertBanner 
        zones={zones} 
        onSelectZone={(z) => setSelectedZone(z)} 
      />

      {/* Graceful Degradation Notice */}
      {degradedFeeds.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2 text-xs text-amber-900">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>
                <strong>Feed Notice:</strong> {degradedFeeds.map(([k, v]) => `${k.toUpperCase()} is ${v}`).join(' • ')}.
                Synthesizing multi-signal pulse gracefully without interruption.
              </span>
            </div>
            <span className="font-mono text-[10px] bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 font-bold text-amber-800 hidden sm:inline">
              Graceful Degradation
            </span>
          </div>
        </div>
      )}

      {/* Main Bento Grid Canvas */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* ========================================================= */}
        {/* TAB 0: HOME PAGE (Hero Showcase, Quick Jump, Features)    */}
        {/* ========================================================= */}
        {activeTab === 'home' && (
          <HomePage 
            onNavigateToDashboard={() => setActiveTab('citizen')}
            onNavigateToAlerts={() => setActiveTab('alerts')}
            onNavigateToBusiness={() => setActiveTab('business')}
            onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
            onNavigateToAdmin={() => setActiveTab('admin')}
            onNavigateToMap={() => {
              setActiveTab('citizen')
              setTimeout(scrollToMapSection, 150)
            }}
            onNavigateToCommand={() => setActiveTab('command')}
            onNavigateToReplay={() => setActiveTab('replay')}
            onOpenCitizenReport={() => setIsCitizenReportOpen(true)}
            onSelectCity={(cityId, stateName) => {
              setActiveTab('citizen')
              setTimeout(scrollToMapSection, 150)
            }}
            zones={zones}
          />
        )}

        {/* ========================================================= */}
        {/* TAB 0.5: PAN-INDIA REAL-TIME MULTI-DOMAIN ALERTS HUB      */}
        {/* ========================================================= */}
        {activeTab === 'alerts' && (
          <AllIndiaAlertsHub 
            onSelectCityOnMap={() => {
              setActiveTab('citizen')
              setTimeout(scrollToMapSection, 150)
            }}
            onNavigateToMap={() => {
              setActiveTab('citizen')
              setTimeout(scrollToMapSection, 150)
            }}
          />
        )}

        {/* ========================================================= */}
        {/* TAB 0.8: COMMERCIAL LOGISTICS & BUSINESS PRO INTEL        */}
        {/* ========================================================= */}
        {activeTab === 'business' && (
          <BusinessIntelligenceView 
            currentTier={activeSubscription?.id || 'business_pro'}
            onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
            onNavigateToMap={() => {
              setActiveTab('citizen')
              setTimeout(scrollToMapSection, 150)
            }}
          />
        )}

        {/* ========================================================= */}
        {/* TAB 1: CITIZEN BENTO EXPERIENCE (Live Dashboard)          */}
        {/* ========================================================= */}
        {activeTab === 'citizen' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Bento Row 1: Sector Lens (5 cols) + Timeline Scrubber (7 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5">
                <SectorLiveLensBento 
                  zones={zones} 
                  onSelectZone={(z) => setSelectedZone(z)}
                  selectedZoneId={selectedZone?.zone}
                  onOpenSectorCamera={(secId) => setCameraSectorId(secId)}
                  onOpenReportModal={(secId) => {
                    setReportSectorId(secId || 'zone-3')
                    setIsCitizenReportOpen(true)
                  }}
                  onScrollToMap={scrollToMapSection}
                  onTriggerGps={scrollToMapSection}
                />
              </div>
              <div className="lg:col-span-7">
                <SchedulingScrubberBento 
                  timeline={timeline}
                  currentTimestamp={replayTimestamp}
                  isPlaying={isPlayingReplay}
                  onTogglePlay={() => setIsPlayingReplay(!isPlayingReplay)}
                  onSelectTimestamp={handleSelectScrubTimestamp}
                  onScenarioTriggered={() => loadData()}
                />
              </div>
            </div>

            {/* Bento Row 2: 3-Pillar Pulse Trio (Health Wallet + Citizen Inbox + Mobile Alert) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <CivicHealthWalletBento 
                zones={zones} 
                onOpenDiagnostics={() => setIsMethodologyOpen(true)}
              />
              <CitizenInboxBento 
                onOpenReportModal={() => setIsCitizenReportOpen(true)}
                onSelectReport={(rep) => {
                  const matchedZone = zones.find(z => z.zone === rep.zone)
                  if (matchedZone) setSelectedZone(matchedZone)
                }}
              />
              <MobileNotificationBento 
                zones={zones} 
                onOpenCommandCenter={() => setActiveTab('command')}
              />
            </div>

            {/* Bento Row 3: Multi-Signal Fusion Full-Width Matrix */}
            <div>
              <MultiSignalFlowBento 
                zones={zones} 
                onOpenEvidence={(z) => setEvidenceZone(z)}
              />
            </div>

            {/* Bento Row 4: Full-Width Indian Spatial Map & Real-Time Telemetry Hub */}
            <div id="indian-map-section" className="scroll-mt-20">
              <InteractiveMapBentoCard 
                zones={zones}
                onSelectZone={(z) => setSelectedZone(z)}
                selectedZoneId={selectedZone?.zone}
                initialUserLocation={userLiveLocation}
                onOpenAlertsView={() => setActiveTab('alerts')}
              />
            </div>

            {/* Bento Row 5: Transit Pulse & Weather Doppler Duo */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8">
                <TransitMobilityBentoCard zones={zones} />
              </div>
              <div className="lg:col-span-4">
                <WeatherRadarBentoCard zones={zones} />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1.5: ADMIN 311 PORTAL & 24-HOUR SLA GOVERNANCE        */}
        {/* ========================================================= */}
        {activeTab === 'admin' && (
          <AdminPortal 
            zones={zones} 
            onRefreshData={() => loadData()} 
          />
        )}

        {/* ========================================================= */}
        {/* TAB 2: OFFICIAL COMMAND CENTER                            */}
        {/* ========================================================= */}
        {activeTab === 'command' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-6">
                <CommandDispatchBentoCard zones={zones} />
              </div>
              <div className="lg:col-span-6">
                <MultiSignalFlowBento 
                  zones={zones} 
                  onOpenEvidence={(z) => setEvidenceZone(z)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8">
                <InteractiveMapBentoCard 
                  zones={zones}
                  onSelectZone={(z) => setSelectedZone(z)}
                  selectedZoneId={selectedZone?.zone}
                  initialUserLocation={userLiveLocation}
                />
              </div>
              <div className="lg:col-span-4">
                <FeedHealthBentoCard 
                  health={feedHealth} 
                  onToggleFeedHealth={handleToggleFeedHealth}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: HISTORICAL REPLAY STUDIO                          */}
        {/* ========================================================= */}
        {activeTab === 'replay' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <SchedulingScrubberBento 
              timeline={timeline}
              currentTimestamp={replayTimestamp}
              isPlaying={isPlayingReplay}
              onTogglePlay={() => setIsPlayingReplay(!isPlayingReplay)}
              onSelectTimestamp={handleSelectScrubTimestamp}
              onScenarioTriggered={() => loadData()}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8">
                <InteractiveMapBentoCard 
                  zones={zones}
                  onSelectZone={(z) => setSelectedZone(z)}
                  selectedZoneId={selectedZone?.zone}
                  initialUserLocation={userLiveLocation}
                />
              </div>
              <div className="lg:col-span-4">
                <SectorLiveLensBento 
                  zones={zones} 
                  onSelectZone={(z) => setSelectedZone(z)}
                  selectedZoneId={selectedZone?.zone}
                  onOpenSectorCamera={(secId) => setCameraSectorId(secId)}
                  onScrollToMap={scrollToMapSection}
                  onTriggerGps={scrollToMapSection}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-5 px-6 text-xs text-slate-500 shadow-sm mt-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">CityPulse</span>
            <span>— AmiHacks Track B: The Live Civic Health Dashboard</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="text-slate-600">Constraint: "Possible Link" (No Unchecked Causation)</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">Bento Grid UI v2.5</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Sector Camera Stream Modal */}
      <SectorCameraModal 
        isOpen={Boolean(cameraSectorId)}
        sectorId={cameraSectorId || 'zone-3'}
        onClose={() => setCameraSectorId(null)}
      />

      {/* 2. Civic Health Methodology Modal */}
      <CivicHealthMethodologyModal 
        isOpen={isMethodologyOpen}
        zones={zones}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* 3. Citizen Photo Report Modal */}
      <CitizenReportModal 
        isOpen={isCitizenReportOpen}
        initialSectorId={reportSectorId}
        onClose={() => setIsCitizenReportOpen(false)}
        onEventSubmitted={() => loadData()}
      />

      {/* 4. Evidence Audit Drawer Modal */}
      <EvidenceDrawerModal 
        zone={evidenceZone}
        isOpen={Boolean(evidenceZone)}
        onClose={() => setEvidenceZone(null)}
        asOf={activeTab === 'replay' ? replayTimestamp : null}
      />

      {/* 5. Sector Detail Diagnostics Modal */}
      {selectedZone && (
        <ZoneDetailModal 
          zone={selectedZone} 
          asOf={activeTab === 'replay' ? replayTimestamp : null}
          onClose={() => setSelectedZone(null)} 
        />
      )}

      {/* 6. Demo Scenarios Drawer */}
      {isSimulatorOpen && (
        <SimulationPanel 
          onClose={() => setIsSimulatorOpen(false)}
          onEventInjected={() => loadData()}
        />
      )}

      {/* 7. User Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={(user, token) => {
          setCurrentUser(user)
          setIsAuthModalOpen(false)
        }}
      />

      {/* 8. Commercial & Resident Tiered Subscriptions Modal */}
      <SubscriptionModal 
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        activeTier={activeSubscription?.id || 'free'}
        onSubscriptionUpdated={(updated) => setActiveSubscriptionState(updated)}
        onNavigateToBusinessView={() => {
          setIsSubscriptionModalOpen(false)
          setActiveTab('business')
        }}
      />
    </div>
  )
}
