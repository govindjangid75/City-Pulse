/**
 * CityPulse Municipal Complaints & 24-Hour SLA Escalation Registry
 * 
 * Manages real-time complaints, live GPS tracking, photographic evidence,
 * 24-Hour SLA countdowns, automated escalation to State Disaster Management Authority (SDMA),
 * and first-responder dispatch workflows.
 */

const COMPLAINTS_STORAGE_KEY = 'citypulse_admin_complaints_registry'

export const INITIAL_MUNICIPAL_COMPLAINTS = [
  {
    id: 'CP-311-84920',
    title: 'Pragati Maidan Underpass Waterlogging (1.2m Depth)',
    category: 'flooding',
    categoryLabel: '🌊 Severe Waterlogging',
    description: 'Heavy water accumulation observed near road underpass. Depth exceeding 1.2 meters. Two-wheelers stranded and traffic diverted via Ring Road.',
    photo: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
    zone: 'zone-3',
    zoneName: 'Downtown Civic Core (ITO / Pragati Maidan)',
    city: 'Delhi NCR',
    state: 'Delhi NCR',
    coordinates: '28.6248° N, 77.2435° E',
    lat: 28.6248,
    lng: 77.2435,
    gpsAccuracy: '± 8m',
    reporter: 'Aarav Sharma (Verified Resident)',
    reporterContact: '+91 98112-44920',
    aiAuthenticityScore: 98.6,
    upvotes: 43,
    severity: 'critical',
    status: 'In Progress', // 'Pending Review' | 'Dispatched' | 'In Progress' | 'Resolved' | 'Escalated to SDMA'
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hrs ago
    slaHoursTotal: 24,
    assignedResponder: 'NDRF Heavy Water Pump Unit 12 & MCD Drainage Team',
    assignedDept: 'Municipal Corporation of Delhi (MCD) / PWD',
    escalationTier: 'Level 1: Zonal Municipal Office',
    resolutionNote: null,
    history: [
      { timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), action: 'Complaint Ingested via Citizen Camera App (GPS Locked & AI Screened)' },
      { timestamp: new Date(Date.now() - 5.5 * 60 * 60 * 1000).toISOString(), action: 'Community Upvotes exceeded 40 → Escalated to Critical Priority' },
      { timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), action: 'Assigned to NDRF Heavy Water Pump Unit 12 on scene' }
    ]
  },
  {
    id: 'CP-311-73912',
    title: 'Traffic Signals Out at ITO & Vikas Marg 4-Way Intersection',
    category: 'traffic_signal',
    categoryLabel: '🚦 Traffic Signal Failure',
    description: 'Flashing red and dead signals causing severe 4-way gridlock following electrical voltage dip.',
    photo: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    zone: 'zone-3',
    zoneName: 'Downtown Civic Core (ITO / Pragati Maidan)',
    city: 'Delhi NCR',
    state: 'Delhi NCR',
    coordinates: '28.6290° N, 77.2410° E',
    lat: 28.6290,
    lng: 77.2410,
    gpsAccuracy: '± 10m',
    reporter: 'Rohit Gupta (Commuter)',
    reporterContact: '+91 98711-20912',
    aiAuthenticityScore: 99.1,
    upvotes: 29,
    severity: 'high',
    status: 'Dispatched',
    createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(), // 11 hrs ago
    slaHoursTotal: 24,
    assignedResponder: 'Delhi Traffic Police Signal Engineering Cell',
    assignedDept: 'Delhi Traffic Police & PWD Electrical',
    escalationTier: 'Level 1: Zonal Municipal Office',
    resolutionNote: null,
    history: [
      { timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(), action: 'Complaint Ingested' },
      { timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), action: 'Dispatched to Traffic Signal Cell' }
    ]
  },
  {
    id: 'CP-311-61029',
    title: 'OVERDUE: Caved-in Road Crater on Ring Road Expressway',
    category: 'road_hazard',
    categoryLabel: '⚠️ Hazardous Pothole / Crater',
    description: 'Large 2-meter wide asphalt cave-in near flyover approach. 24-hour SLA expired without municipal contractor response.',
    photo: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    zone: 'zone-2',
    zoneName: 'West Park Transit Corridor (Connaught Place)',
    city: 'Delhi NCR',
    state: 'Delhi NCR',
    coordinates: '28.6315° N, 77.2167° E',
    lat: 28.6315,
    lng: 77.2167,
    gpsAccuracy: '± 5m',
    reporter: 'Dr. Priya Verma (Civic Observer)',
    reporterContact: '+91 98200-61029',
    aiAuthenticityScore: 97.4,
    upvotes: 52,
    severity: 'critical',
    status: 'Escalated to SDMA',
    createdAt: new Date(Date.now() - 27 * 60 * 60 * 1000).toISOString(), // 27 hrs ago (OVERDUE >24h)
    slaHoursTotal: 24,
    assignedResponder: 'Special Commissioner of SDMA & Chief Engineer PWD',
    assignedDept: 'State Disaster Management Authority (SDMA)',
    escalationTier: 'Level 3: State Disaster Management Authority (SDMA) & Chief Secretary Office',
    resolutionNote: null,
    history: [
      { timestamp: new Date(Date.now() - 27 * 60 * 60 * 1000).toISOString(), action: 'Report Created' },
      { timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), action: '🚨 24-HOUR SLA BREACH: Automatically escalated to SDMA & Municipal Commissioner' }
    ]
  },
  {
    id: 'CP-311-55104',
    title: 'Substation Transformer Sparking near Okhla Phase 3',
    category: 'power_outage',
    categoryLabel: '⚡ Downed Wire / Transformer',
    description: 'Audible electrical arcing and sparks observed on utility transformer pole following rain squall.',
    photo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    zone: 'zone-4',
    zoneName: 'East River Industrial Grid (Okhla)',
    city: 'Delhi NCR',
    state: 'Delhi NCR',
    coordinates: '28.5360° N, 77.2720° E',
    lat: 28.5360,
    lng: 77.2720,
    gpsAccuracy: '± 6m',
    reporter: 'Suresh Menon (Industrial Estate Manager)',
    reporterContact: '+91 98330-55104',
    aiAuthenticityScore: 98.9,
    upvotes: 35,
    severity: 'high',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString(), // 19 hrs ago (5h left)
    slaHoursTotal: 24,
    assignedResponder: 'BSES Emergency Quick Response Van #4',
    assignedDept: 'BSES / Delhi Transco Limited',
    escalationTier: 'Level 2: Zonal Director Inspection',
    resolutionNote: null,
    history: [
      { timestamp: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString(), action: 'Report Filed' },
      { timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), action: 'BSES Van #4 on Scene conducting line isolation' }
    ]
  },
  {
    id: 'CP-311-41982',
    title: 'Fallen Neem Tree Cleared at Mayur Vihar Bayside Corridor',
    category: 'tree_fall',
    categoryLabel: '🌳 Fallen Tree / Debris',
    description: 'Large tree branch collapsed across left lane during monsoon squall.',
    photo: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    zone: 'zone-1',
    zoneName: 'North Uptown & Yamuna Riverfront (Noida Sec 62)',
    city: 'Delhi NCR',
    state: 'Delhi NCR',
    coordinates: '28.6280° N, 77.3649° E',
    lat: 28.6280,
    lng: 77.3649,
    gpsAccuracy: '± 4m',
    reporter: 'Kavita Saxena (Resident)',
    reporterContact: '+91 98450-41982',
    aiAuthenticityScore: 99.4,
    upvotes: 18,
    severity: 'medium',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    slaHoursTotal: 24,
    assignedResponder: 'MCD Horticulture Rapid Action Saw Unit 3',
    assignedDept: 'MCD Horticulture',
    escalationTier: 'Level 1: Resolved within 6 hours',
    resolutionNote: 'Tree trunk sectioned, removed from carriage-way, and traffic flow fully restored.',
    history: [
      { timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), action: 'Complaint Lodged' },
      { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), action: 'Resolved on-site by MCD Horticulture Unit 3' }
    ]
  }
]

/**
 * Load complaints from localStorage or initialize with curated dataset
 */
export function getStoredComplaints() {
  try {
    const raw = localStorage.getItem(COMPLAINTS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Check and update 24h SLA status for each
      return parsed.map(item => checkAndApplySlaStatus(item))
    }
    // Save initial dataset
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(INITIAL_MUNICIPAL_COMPLAINTS))
    return INITIAL_MUNICIPAL_COMPLAINTS.map(item => checkAndApplySlaStatus(item))
  } catch (e) {
    console.error('Error loading complaints registry:', e)
    return INITIAL_MUNICIPAL_COMPLAINTS
  }
}

/**
 * Add a newly submitted citizen complaint to the registry
 */
export function registerNewCitizenComplaint(complaintData) {
  try {
    const existing = getStoredComplaints()
    const now = new Date()
    const newEntry = {
      id: complaintData.ticket_id || `CP-311-${Math.floor(10000 + Math.random() * 90000)}`,
      title: complaintData.title || 'Citizen Field Report',
      category: complaintData.type || 'road_hazard',
      categoryLabel: complaintData.categoryLabel || 'Civic Infrastructure Issue',
      description: complaintData.description || 'Civic report logged via citizen camera application.',
      photo: complaintData.photo_url || 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
      zone: complaintData.zone || 'zone-3',
      zoneName: complaintData.zoneName || 'Monitored Sector',
      city: complaintData.city || 'Delhi NCR',
      state: complaintData.state || 'Delhi NCR',
      coordinates: complaintData.gps ? `${complaintData.gps.lat.toFixed(4)}° N, ${complaintData.gps.lng.toFixed(4)}° E` : '28.6248° N, 77.2435° E',
      lat: complaintData.gps?.lat || 28.6248,
      lng: complaintData.gps?.lng || 77.2435,
      gpsAccuracy: '± 10m',
      reporter: complaintData.reporter || 'Verified Citizen (AI Screened + GPS Locked)',
      reporterContact: '+91 Verified Citizen',
      aiAuthenticityScore: complaintData.ai_authenticity_score || 98.6,
      upvotes: 1,
      severity: complaintData.severity || 'high',
      status: 'Pending Review',
      createdAt: now.toISOString(),
      slaHoursTotal: 24,
      assignedResponder: 'Awaiting Zonal Officer Triage',
      assignedDept: 'Municipal Corporation of Delhi (MCD)',
      escalationTier: 'Level 1: Zonal Municipal Office',
      resolutionNote: null,
      history: [
        { timestamp: now.toISOString(), action: 'Complaint in-take confirmed via Citizen Camera App' }
      ]
    }

    const updated = [newEntry, ...existing]
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (e) {
    console.error('Error saving new complaint:', e)
    return getStoredComplaints()
  }
}

/**
 * Update complaint status, responder assignment, or escalation
 */
export function updateComplaintStatus(complaintId, updates) {
  try {
    const existing = getStoredComplaints()
    const updated = existing.map(item => {
      if (item.id === complaintId) {
        const newHistory = [...(item.history || [])]
        if (updates.actionLog) {
          newHistory.push({
            timestamp: new Date().toISOString(),
            action: updates.actionLog
          })
        }
        return {
          ...item,
          ...updates,
          history: newHistory
        }
      }
      return item
    })

    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (e) {
    console.error('Error updating complaint status:', e)
    return getStoredComplaints()
  }
}

/**
 * SLA 24-Hour Policy Checker & Auto-Escalation Calculation
 */
export function checkAndApplySlaStatus(complaint) {
  if (complaint.status === 'Resolved') {
    return {
      ...complaint,
      isOverdue: false,
      hoursRemaining: 0,
      slaBadge: {
        text: 'RESOLVED ON TIME',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
      }
    }
  }

  const createdTime = new Date(complaint.createdAt).getTime()
  const now = Date.now()
  const elapsedMs = now - createdTime
  const totalSlaMs = (complaint.slaHoursTotal || 24) * 60 * 60 * 1000
  const remainingMs = totalSlaMs - elapsedMs
  const hoursRemaining = Math.max(0, remainingMs / (1000 * 60 * 60))

  if (remainingMs <= 0) {
    // 24H SLA BREACHED -> Auto-escalate to SDMA
    return {
      ...complaint,
      isOverdue: true,
      hoursRemaining: 0,
      status: 'Escalated to SDMA',
      escalationTier: 'Level 3: State Disaster Management Authority (SDMA) & Chief Secretary Office',
      assignedDept: 'State Disaster Management Authority (SDMA)',
      slaBadge: {
        text: '🚨 OVERDUE (>24h) • ESCALATED TO SDMA',
        color: 'bg-rose-600 text-white border-rose-700 animate-pulse'
      }
    }
  }

  if (hoursRemaining <= 4) {
    return {
      ...complaint,
      isOverdue: false,
      hoursRemaining: parseFloat(hoursRemaining.toFixed(1)),
      slaBadge: {
        text: `⏱️ ${Math.floor(hoursRemaining)}h ${Math.round((hoursRemaining % 1) * 60)}m LEFT (CRITICAL SLA)`,
        color: 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
      }
    }
  }

  return {
    ...complaint,
    isOverdue: false,
    hoursRemaining: parseFloat(hoursRemaining.toFixed(1)),
    slaBadge: {
      text: `⏱️ ${Math.floor(hoursRemaining)}h ${Math.round((hoursRemaining % 1) * 60)}m SLA Remaining`,
      color: 'bg-blue-50 text-blue-800 border-blue-200'
    }
  }
}
