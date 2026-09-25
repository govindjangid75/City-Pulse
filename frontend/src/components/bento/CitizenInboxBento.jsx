import React, { useState } from 'react'
import { CITIZEN_PHOTO_FEED } from '../../data/visualData'
import { MessageSquare, Camera, Plus, ThumbsUp, CheckCircle, MapPin, Flame, ShieldAlert, Sparkles } from 'lucide-react'
import { getPriorityFromUpvotes } from '../../services/aiValidation'

export default function CitizenInboxBento({ onOpenReportModal, onSelectReport }) {
  const [upvotesState, setUpvotesState] = useState({})
  const [justUpvotedId, setJustUpvotedId] = useState(null)

  const handleUpvote = (e, item) => {
    e.stopPropagation()
    setUpvotesState(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || item.upvotes || 0) + 1
    }))
    setJustUpvotedId(item.id)
    setTimeout(() => {
      setJustUpvotedId(null)
    }, 2000)
  }

  const topReports = CITIZEN_PHOTO_FEED.slice(0, 2)

  return (
    <div className="bento-card bento-butter p-6 flex flex-col justify-between h-full relative group">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
            <h3 className="font-extrabold text-lg text-amber-950 tracking-tight">Citizen Inbox</h3>
          </div>
          <button
            onClick={onOpenReportModal}
            className="p-1.5 px-2.5 rounded-xl bg-gradient-to-r from-amber-200 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-amber-950 transition flex items-center gap-1.5 text-[11px] font-bold shadow-sm"
            title="Submit Verified Photo Report"
          >
            <Camera className="w-3.5 h-3.5 text-amber-900" />
            <span>+ Report</span>
          </button>
        </div>
        <p className="text-xs text-amber-900/80 font-medium mb-3">
          Geotagged photographic feed • Upvote to escalate municipal priority
        </p>

        {/* Floating Message Bubbles List (Givingli Inbox Style) */}
        <div className="space-y-2.5 my-1">
          {topReports.map((item) => {
            const currentUpvotes = upvotesState[item.id] !== undefined ? upvotesState[item.id] : item.upvotes
            const priority = getPriorityFromUpvotes(currentUpvotes)
            const isJustUpvoted = justUpvotedId === item.id

            return (
              <div
                key={item.id}
                onClick={() => onSelectReport && onSelectReport(item)}
                className="floating-widget p-2.5 flex items-center gap-2.5 cursor-pointer bg-white border border-amber-200/80 hover:border-amber-400 shadow-sm transition group/item"
              >
                {/* Photo Thumbnail */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                  <img src={item.photo} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Text Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-xs text-slate-900 truncate group-hover/item:text-amber-900 transition">
                      {item.title}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">{item.timeAgo}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[10px] text-slate-500 font-medium truncate">
                        {item.zoneName.split(' ')[0]}
                      </span>
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded ${priority.badgeColor}`}>
                        {priority.label.split(' ')[1] || priority.label}
                      </span>
                    </div>

                    {/* Upvote Action Button */}
                    <button
                      type="button"
                      onClick={(e) => handleUpvote(e, item)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition flex items-center gap-1 shrink-0 ${
                        isJustUpvoted
                          ? 'bg-emerald-600 text-white scale-105'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300/80'
                      }`}
                      title="Upvote this complaint to raise municipal priority"
                    >
                      <ThumbsUp className="w-2.5 h-2.5" />
                      <span>{currentUpvotes}</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Subtext */}
      <div className="pt-3 border-t border-amber-200/80 flex items-center justify-between text-[11px] text-amber-950/80 font-medium">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-700" />
          <span>50+ Upvotes = Critical Dispatch</span>
        </span>
        <span className="font-mono font-bold text-amber-900">AI Screened</span>
      </div>
    </div>
  )
}
