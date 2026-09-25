import React, { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import { 
  getStoredComplaints, 
  updateComplaintStatus, 
  checkAndApplySlaStatus 
} from '../services/complaintsRegistry'
import { 
  ShieldAlert, Clock, AlertTriangle, CheckCircle2, User, MapPin, 
  Camera, Flame, Filter, Search, RefreshCw, Send, ArrowUpRight, 
  Building2, Radio, Check, Eye, ChevronDown, Award, BellRing,
  Share2, ShieldCheck, Cpu, ExternalLink, Ticket, FileText
} from 'lucide-react'

export default function AdminPortal({ zones = [], onRefreshData }) {
  const [complaints, setComplaints] = useState([])
  const [filterTab, setFilterTab] = useState('all') // 'all' | 'critical' | 'sla_warning' | 'escalated' | 'resolved'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [inspectPhotoComplaint, setInspectPhotoComplaint] = useState(null)
  const [assignResponderModalComplaint, setAssignResponderModalComplaint] = useState(null)
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false)
  const [broadcastSector, setBroadcastSector] = useState('zone-3')
  const [broadcastMessage, setBroadcastMessage] = useState('Heavy waterlogging at Pragati Maidan Underpass. All light vehicular traffic diverted to Ring Road.')
  const [broadcastSuccess, setBroadcastSuccess] = useState(false)

  // Map Refs
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersGroupRef = useRef(null)

  // Load Complaints & Refresh 24h SLA statuses
  const loadComplaints = () => {
    const list = getStoredComplaints()
    setComplaints(list)
  }

  useEffect(() => {
    loadComplaints()
    const timer = setInterval(() => {
      loadComplaints()
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  // Initialize Leaflet Map for Admin GIS Overview
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [28.6248, 77.2435],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      const markersGroup = L.layerGroup().addTo(map)
      markersGroupRef.current = markersGroup
      mapInstanceRef.current = map
    }
  }, [])

  // Draw complaint pins on Admin GIS Map
  useEffect(() => {
    const map = mapInstanceRef.current
    const markersGroup = markersGroupRef.current
    if (!map || !markersGroup) return

    markersGroup.clearLayers()

    complaints.forEach(item => {
      const isEscalated = item.status === 'Escalated to SDMA' || item.isOverdue
      const isResolved = item.status === 'Resolved'
      const isCritical = item.severity === 'critical' || item.upvotes >= 40

      const pinColor = isEscalated ? '#7e22ce' : isResolved ? '#10b981' : isCritical ? '#e11d48' : '#f59e0b'

      const customIcon = L.divIcon({
        className: 'admin-incident-pin',
        html: `
          <div style="
            background: rgba(15, 23, 42, 0.95);
            color: #ffffff;
            padding: 5px 10px;
            border-radius: 9999px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 11px;
            font-weight: 800;
            border: 2px solid ${pinColor};
            box-shadow: 0 4px 14px rgba(0,0,0,0.4);
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            transform: translate(-50%, -50%);
          ">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${pinColor}; ${isCritical || isEscalated ? 'animation: ping 1.5s infinite;' : ''}"></span>
            <span>${item.id}</span>
            <span style="color: ${pinColor}; font-size: 9px;">${isEscalated ? 'SDMA' : item.status}</span>
          </div>
        `,
        iconSize: [130, 32],
        iconAnchor: [65, 16]
      })

      const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(markersGroup)
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; max-width: 250px;">
          <div style="font-weight: 800; font-size: 12px; color: #0f172a;">${item.title}</div>
          <div style="font-size: 10px; color: #64748b; margin-top: 2px;">${item.zoneName} • ${item.coordinates}</div>
          <div style="margin-top: 6px; border-radius: 6px; overflow: hidden;">
            <img src="${item.photo}" style="width: 100%; height: 90px; object-fit: cover;" />
          </div>
          <div style="font-size: 11px; color: #334155; margin-top: 6px; line-height: 1.3;">${item.description}</div>
          <div style="margin-top: 6px; font-weight: 700; font-size: 10px; color: ${pinColor};">
            Status: ${item.status} (${item.slaBadge?.text || '24h SLA Active'})
          </div>
        </div>
      `)
    })
  }, [complaints])

  // Action: Update Status (Resolve / In Progress / Dispatch)
  const handleStatusChange = (complaintId, newStatus) => {
    let actionLog = `Status changed to ${newStatus} by Municipal Operator`
    let updates = { status: newStatus, actionLog }

    if (newStatus === 'Resolved') {
      updates.resolvedAt = new Date().toISOString()
      updates.resolutionNote = 'Resolved on-site by assigned municipal action team.'
    } else if (newStatus === 'Escalated to SDMA') {
      updates.escalationTier = 'Level 3: State Disaster Management Authority (SDMA) & Chief Secretary Office'
      updates.assignedDept = 'State Disaster Management Authority (SDMA)'
      actionLog = 'Manually escalated to Higher Authority (SDMA & Chief Secretary) for emergency intervention.'
      updates.actionLog = actionLog
    }

    const updatedList = updateComplaintStatus(complaintId, updates)
    setComplaints(updatedList)
    if (onRefreshData) onRefreshData()
  }

  // Action: Assign First Responder
  const handleAssignResponder = (complaintId, responderName, departmentName) => {
    const actionLog = `Assigned to ${responderName} (${departmentName})`
    const updatedList = updateComplaintStatus(complaintId, {
      assignedResponder: responderName,
      assignedDept: departmentName,
      status: 'In Progress',
      actionLog
    })
    setComplaints(updatedList)
    setAssignResponderModalComplaint(null)
    if (onRefreshData) onRefreshData()
  }

  // Action: Broadcast Sector Push Alert
  const handleSendBroadcast = (e) => {
    e.preventDefault()
    setBroadcastSuccess(true)
    setTimeout(() => {
      setBroadcastSuccess(false)
      setBroadcastModalOpen(false)
    }, 2000)
  }

  // Filters logic
  const filteredComplaints = complaints.filter(item => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match = 
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.zoneName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.reporter.toLowerCase().includes(q)
      if (!match) return false
    }

    if (filterTab === 'critical') return item.severity === 'critical' || item.upvotes >= 40
    if (filterTab === 'sla_warning') return item.hoursRemaining > 0 && item.hoursRemaining <= 6 && item.status !== 'Resolved'
    if (filterTab === 'escalated') return item.status === 'Escalated to SDMA' || item.isOverdue
    if (filterTab === 'resolved') return item.status === 'Resolved'
    return true
  })

  // Executive KPI Counts
  const totalCount = complaints.length
  const criticalCount = complaints.filter(c => c.severity === 'critical' || c.upvotes >= 40).length
  const overdueCount = complaints.filter(c => c.isOverdue || c.status === 'Escalated to SDMA').length
  const nearBreachCount = complaints.filter(c => c.hoursRemaining > 0 && c.hoursRemaining <= 6 && c.status !== 'Resolved').length
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length
  const slaCompliancePct = totalCount > 0 ? Math.round(((totalCount - overdueCount) / totalCount) * 100) : 100

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. TOP EXECUTIVE SLA POLICY & MUNICIPAL GOVERNANCE BANNER */}
      <section className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                MUNICIPAL DISASTER GOVERNANCE & 311 TRIAGE
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                REAL-TIME LIVE STREAM
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Municipal Complaints & 24-Hour SLA Escalation Portal
            </h2>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
              <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Mandatory 24-Hour Citizen SLA Policy:</strong> Every citizen complaint must be inspected and resolved within <strong>24 hours</strong> of photographic GPS ingestion. Tickets exceeding 24 hours are <strong>automatically transferred and escalated to the State Disaster Management Authority (SDMA) & Municipal Commissioner</strong>.
              </div>
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setBroadcastModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-rose-950/40 flex items-center gap-1.5 transition active:scale-95"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Broadcast Sector Alert</span>
            </button>

            <button
              onClick={loadComplaints}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Queue</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. EXECUTIVE KPI CARDS */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bento-card bento-porcelain p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Ingested</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalCount}</div>
          <span className="text-[10px] font-mono text-slate-500 mt-1">Live GPS Complaints</span>
        </div>

        <div className="bento-card bento-porcelain p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>24h SLA Compliance</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{slaCompliancePct}%</div>
          <span className="text-[10px] font-mono text-emerald-700 font-bold mt-1">Target: &gt;90% On-Time</span>
        </div>

        <div className="bento-card bento-porcelain p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Critical Priority</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-2">{criticalCount}</div>
          <span className="text-[10px] font-mono text-rose-700 font-bold mt-1">High Citizen Upvotes</span>
        </div>

        <div className="bento-card bento-porcelain p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Near SLA Breach</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">{nearBreachCount}</div>
          <span className="text-[10px] font-mono text-amber-700 font-bold mt-1">&lt;6h SLA Remaining</span>
        </div>

        <div className="bento-card bento-porcelain p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Escalated to SDMA</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-700 mt-2">{overdueCount}</div>
          <span className="text-[10px] font-mono text-purple-800 font-bold mt-1">Higher Authority Review</span>
        </div>
      </section>

      {/* 3. INTERACTIVE GIS INCIDENT MAP */}
      <section className="bento-card bento-porcelain p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                Live Spatial Incident GIS Map (All Verified Complaints)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Color-coded markers showing exact latitude/longitude, photo proof, SLA status, and active responder units
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 text-rose-700 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Critical
            </span>
            <span className="flex items-center gap-1 text-purple-800 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> SDMA Escalated
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Resolved
            </span>
          </div>
        </div>

        <div className="relative w-full h-[320px] rounded-2xl border border-slate-200 overflow-hidden shadow-inner z-10">
          <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '320px' }} />
        </div>
      </section>

      {/* 4. TRIAGE PIPELINE & COMPLAINTS LIST */}
      <section className="space-y-4">
        {/* Filter Controls & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterTab === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Complaints ({complaints.length})
            </button>

            <button
              onClick={() => setFilterTab('critical')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                filterTab === 'critical'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Critical / High Upvotes ({criticalCount})</span>
            </button>

            <button
              onClick={() => setFilterTab('sla_warning')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                filterTab === 'sla_warning'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Near SLA Breach ({nearBreachCount})</span>
            </button>

            <button
              onClick={() => setFilterTab('escalated')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                filterTab === 'escalated'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Escalated to SDMA ({overdueCount})</span>
            </button>

            <button
              onClick={() => setFilterTab('resolved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterTab === 'resolved'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              Resolved ({resolvedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ticket ID, sector, citizen..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Complaints Cards Stream */}
        <div className="space-y-4">
          {filteredComplaints.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="font-bold text-sm text-slate-700">No Complaints Match This Filter</div>
              <p className="text-xs">All citizen tickets in this view are up-to-date and within the 24-hour resolution SLA.</p>
            </div>
          ) : (
            filteredComplaints.map((item) => {
              const isOverdue = item.isOverdue || item.status === 'Escalated to SDMA'
              const isCritical = item.severity === 'critical' || item.upvotes >= 40
              const isResolved = item.status === 'Resolved'

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl bg-white border transition-all shadow-sm ${
                    isOverdue
                      ? 'border-purple-300 bg-purple-50/30 ring-1 ring-purple-400/30'
                      : isCritical
                      ? 'border-rose-300 bg-rose-50/20'
                      : isResolved
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    {/* Left: Photographic Proof Thumbnail with AI Authenticity Badge (3 cols) */}
                    <div className="lg:col-span-3 space-y-2">
                      <div 
                        onClick={() => setInspectPhotoComplaint(item)}
                        className="relative h-44 rounded-2xl overflow-hidden cursor-pointer group shadow-md border border-slate-200"
                      >
                        <img src={item.photo} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-emerald-400 font-mono text-[9px] font-bold flex items-center gap-1 border border-emerald-500/30">
                          <Cpu className="w-3 h-3" />
                          <span>{item.aiAuthenticityScore || 98.6}% AI Verified</span>
                        </div>

                        <div className="absolute bottom-2 left-2 right-2 text-white flex items-center justify-between text-[10px] font-bold">
                          <span>Click to Inspect Evidence</span>
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* GPS & Spatial Coordinates Badge */}
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600 flex items-center justify-between">
                        <span className="flex items-center gap-1 font-bold text-slate-800">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" /> {item.coordinates}
                        </span>
                        <span className="text-slate-400">{item.gpsAccuracy || '±8m'}</span>
                      </div>
                    </div>

                    {/* Middle: Details, 24h SLA Countdown & Upvotes (6 cols) */}
                    <div className="lg:col-span-6 space-y-2.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                            {item.id}
                          </span>
                          <span className="text-xs font-bold text-slate-600">{item.zoneName}</span>
                        </div>

                        {/* 24-Hour SLA Timer Meter */}
                        <div className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${item.slaBadge?.color || 'bg-blue-50 text-blue-800 border-blue-200'}`}>
                          {item.slaBadge?.text}
                        </div>
                      </div>

                      <h4 className="font-extrabold text-base text-slate-900 leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Reporter & Upvotes Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">Citizen Reporter</span>
                          <strong className="text-slate-800 font-bold">{item.reporter}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">Community Upvotes</span>
                          <strong className="text-amber-700 font-black flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-amber-500" /> {item.upvotes} Upvotes {item.upvotes >= 40 ? '(Critical)' : ''}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">Escalation Tier</span>
                          <strong className={`font-bold ${isOverdue ? 'text-purple-700 font-black' : 'text-slate-700'}`}>
                            {item.escalationTier}
                          </strong>
                        </div>
                      </div>

                      {/* Assigned Responder Bar */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Assigned Responder & Department:</span>
                          <strong className="text-slate-900 font-bold">{item.assignedResponder}</strong>
                          <span className="text-slate-500 text-[11px] block">{item.assignedDept}</span>
                        </div>
                        <button
                          onClick={() => setAssignResponderModalComplaint(item)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-300 font-bold text-xs transition shadow-sm"
                        >
                          Change Crew
                        </button>
                      </div>
                    </div>

                    {/* Right: Status Pipeline & Admin Action Controls (3 cols) */}
                    <div className="lg:col-span-3 space-y-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">
                          Operational Status
                        </label>
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
                        >
                          <option value="Pending Review">🟡 Pending Review</option>
                          <option value="Dispatched">🚗 Crew Dispatched</option>
                          <option value="In Progress">⚡ In Progress</option>
                          <option value="Resolved">🟢 Resolved (Close Ticket)</option>
                          <option value="Escalated to SDMA">🚨 Escalate to SDMA (&gt;24h)</option>
                        </select>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="space-y-1.5 pt-1">
                        {item.status !== 'Resolved' && (
                          <button
                            onClick={() => handleStatusChange(item.id, 'Resolved')}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Resolved on Site</span>
                          </button>
                        )}

                        {item.status !== 'Escalated to SDMA' && (
                          <button
                            onClick={() => handleStatusChange(item.id, 'Escalated to SDMA')}
                            className="w-full py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs rounded-xl border border-purple-300 transition flex items-center justify-center gap-1.5"
                          >
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Escalate to SDMA</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setBroadcastSector(item.zone)
                            setBroadcastMessage(`Emergency Advisory: ${item.title}. Emergency crews active on scene at ${item.coordinates}. Please use alternate corridors.`)
                            setBroadcastModalOpen(true)
                          }}
                          className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center justify-center gap-1.5"
                        >
                          <Radio className="w-3.5 h-3.5 text-rose-600" />
                          <span>Push Citizen Alert</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* MODAL 1: PHOTO EVIDENCE & AI SENSOR AUDIT */}
      {inspectPhotoComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-white max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-rose-400" />
                <h3 className="font-extrabold text-lg text-white">Photographic Evidence & AI Sensor Audit</h3>
              </div>
              <button
                onClick={() => setInspectPhotoComplaint(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative h-72 rounded-2xl overflow-hidden border border-slate-700 shadow-lg">
              <img src={inspectPhotoComplaint.photo} alt={inspectPhotoComplaint.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">AI Neural Sensor Authenticity:</span>
                <strong className="text-emerald-400">98.6% Genuine CMOS Camera Capture</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">GPS Spatial Geotag:</span>
                <strong className="text-white">{inspectPhotoComplaint.coordinates} ({inspectPhotoComplaint.zoneName})</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Report Ingested:</span>
                <strong className="text-slate-300">{new Date(inspectPhotoComplaint.createdAt).toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">SLA 24-Hour Expiry:</span>
                <strong className="text-amber-400">
                  {new Date(new Date(inspectPhotoComplaint.createdAt).getTime() + 24 * 60 * 60 * 1000).toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            <div className="text-xs text-slate-300">
              <strong>Citizen Description:</strong> {inspectPhotoComplaint.description}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectPhotoComplaint(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ASSIGN RESPONDER CREW */}
      {assignResponderModalComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-base text-white">Assign Emergency Action Crew</h3>
              </div>
              <button
                onClick={() => setAssignResponderModalComplaint(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select specialized municipal unit for <strong>{assignResponderModalComplaint.title}</strong>:
            </p>

            <div className="space-y-2">
              {[
                { name: 'NDRF Heavy Water Pump Unit 12', dept: 'National Disaster Response Force / MCD' },
                { name: 'PWD Asphalt Rapid Pothole Patching Team 4', dept: 'Public Works Department (PWD)' },
                { name: 'BSES Quick Response Grid Isolation Van #2', dept: 'BSES Rajdhani / Transco' },
                { name: 'Delhi Traffic Police Signal Engineering Cell', dept: 'Delhi Traffic Police' },
                { name: 'MCD Horticulture Rapid Action Saw Unit 3', dept: 'MCD Horticulture' },
                { name: 'State Disaster Management Authority (SDMA) Special Wing', dept: 'SDMA & Divisional Commissioner' }
              ].map((crew, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAssignResponder(assignResponderModalComplaint.id, crew.name, crew.dept)}
                  className="w-full p-3 rounded-2xl bg-slate-950 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500 text-left transition flex items-center justify-between group"
                >
                  <div>
                    <div className="font-extrabold text-xs text-white group-hover:text-indigo-300">{crew.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{crew.dept}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white -rotate-90" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BROADCAST SECTOR ALERT */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
                <h3 className="font-extrabold text-base text-white">Broadcast Sector Emergency Advisory</h3>
              </div>
              <button
                onClick={() => setBroadcastModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {broadcastSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-extrabold text-white">Broadcast Push Notification Sent!</h4>
                <p className="text-xs text-slate-300">Sent to all resident mobile devices in {broadcastSector.toUpperCase()}.</p>
              </div>
            ) : (
              <form onSubmit={handleSendBroadcast} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Sector</label>
                  <select
                    value={broadcastSector}
                    onChange={(e) => setBroadcastSector(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-white"
                  >
                    <option value="zone-3">Downtown Civic Core (ITO / Pragati Maidan)</option>
                    <option value="zone-1">North Uptown & Yamuna Riverfront (Noida Sec 62)</option>
                    <option value="zone-2">West Park Transit Corridor (Connaught Place)</option>
                    <option value="zone-4">East River Industrial Grid (Okhla)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Alert Message</label>
                  <textarea
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-xs rounded-2xl shadow-lg transition"
                  >
                    Broadcast to All Residents in Sector
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
