import React, { useState } from 'react'
import { CITIZEN_PHOTO_FEED } from '../../data/visualData'
import { Camera, ThumbsUp, MapPin, CheckCircle, Plus, AlertCircle, Eye } from 'lucide-react'

export default function CitizenPhotoFeedBentoCard({ onOpenReportModal, onSelectIncidentPhoto }) {
  const [feed, setFeed] = useState(CITIZEN_PHOTO_FEED)
  const [upvotedIds, setUpvotedIds] = useState(new Set())

  const handleUpvote = (id, e) => {
    e.stopPropagation()
    setUpvotedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        setFeed(items => items.map(item => item.id === id ? { ...item, upvotes: item.upvotes - 1 } : item))
      } else {
        next.add(id)
        setFeed(items => items.map(item => item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item))
      }
      return next
    })
  }

  return (
    <div className="bento-card p-5 bento-card-coral flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Background visual ambience */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-wide">Live Citizen Visual Reports</h3>
              <p className="text-[11px] text-slate-400 font-medium">Geotagged photographic civic intelligence stream</p>
            </div>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-rose-500/20 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Photo Report</span>
          </button>
        </div>

        {/* Scrollable Photo Card Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-2">
          {feed.slice(0, 3).map((report) => {
            const isUpvoted = upvotedIds.has(report.id)
            return (
              <div
                key={report.id}
                onClick={() => onSelectIncidentPhoto && onSelectIncidentPhoto(report)}
                className="group/card rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 p-3 cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-lg"
              >
                {/* Photo Thumbnail */}
                <div className="relative h-32 rounded-xl overflow-hidden mb-2">
                  <img
                    src={report.photo}
                    alt={report.title}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Geotag & Time Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[10px] font-mono text-slate-200">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>{report.zoneName.split(' ')[0]}</span>
                  </div>

                  <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-300">
                    {report.timeAgo}
                  </div>

                  {/* Category Pill on bottom of image */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-rose-500/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {report.category}
                  </div>
                </div>

                {/* Card Title & Content */}
                <div>
                  <h4 className="font-bold text-xs text-white group-hover/card:text-rose-300 transition-colors line-clamp-1">
                    {report.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {report.description}
                  </p>
                </div>

                {/* Card Footer with Upvote and Verification */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-mono">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified ({report.status})</span>
                  </div>

                  <button
                    onClick={(e) => handleUpvote(report.id, e)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-mono transition ${
                      isUpvoted
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{report.upvotes}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>311 Crowdsourced Visual Signal Pipeline</span>
        <span className="text-[11px] font-mono text-rose-400">Moderated & Geoverified</span>
      </div>
    </div>
  )
}
