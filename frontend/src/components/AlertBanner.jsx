import React from 'react'

export default function AlertBanner({ zones }) {
  const alertZones = (zones || []).filter(z => z.status === 'alert')
  if (alertZones.length === 0) return null

  return (
    <div className="bg-red-500/10 border-b border-red-500/30 px-6 py-2.5 text-sm text-red-300 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-red-400">ALERT:</span>
        <span>High-activity anomalies detected in {alertZones.map(z => z.zone).join(', ')}. Review active correlations below.</span>
      </div>
      <span className="text-xs text-red-400/80 font-mono">Possible links active</span>
    </div>
  )
}
