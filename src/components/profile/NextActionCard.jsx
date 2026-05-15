export default function NextActionCard({ patient }) {
  const { next_action, admission_conversion_probability, risk_trend } = patient

  const urgencyStyle = {
    critical: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800', badge: 'bg-red-600 text-white', label: 'CRITICAL ACTION' },
    high:     { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', badge: 'bg-orange-500 text-white', label: 'HIGH PRIORITY' },
    medium:   { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', badge: 'bg-yellow-500 text-white', label: 'ACTION NEEDED' },
    low:      { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', badge: 'bg-blue-500 text-white', label: 'FOLLOW UP' },
  }

  const s = urgencyStyle[next_action?.urgency || 'low']

  const trendConfig = {
    worsening: { icon: '↑', color: 'text-red-600', label: 'Deteriorating', bg: 'bg-red-100' },
    improving: { icon: '↓', color: 'text-green-600', label: 'Improving', bg: 'bg-green-100' },
    stable:    { icon: '→', color: 'text-blue-600', label: 'Stable', bg: 'bg-blue-100' },
  }
  const trend = trendConfig[risk_trend || 'stable']

  const convColor = admission_conversion_probability >= 80 ? 'text-green-700' :
                    admission_conversion_probability >= 60 ? 'text-yellow-700' : 'text-red-600'
  const convBg = admission_conversion_probability >= 80 ? 'bg-green-50 border-green-100' :
                 admission_conversion_probability >= 60 ? 'bg-yellow-50 border-yellow-100' : 'bg-red-50 border-red-100'

  return (
    <div className={`rounded-xl border-2 ${s.border} ${s.bg} overflow-hidden`}>
      <div className="px-4 py-3 flex items-center justify-between">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.badge} tracking-wide`}>
          {next_action?.icon} {s.label}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend.bg} ${trend.color}`}>
            {trend.icon} {trend.label}
          </span>
        </div>
      </div>

      <div className="px-4 pb-4">
        <p className={`text-sm font-bold ${s.text} leading-snug mb-4`}>{next_action?.action}</p>

        <div className="grid grid-cols-2 gap-2">
          <div className={`border rounded-lg p-2.5 text-center ${convBg}`}>
            <p className={`text-xl font-black ${convColor}`}>{admission_conversion_probability}%</p>
            <p className="text-xs text-gray-500 mt-0.5">Admission Probability</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-2.5 text-center">
            <p className="text-xl font-black text-gray-800">{patient.risk_score}<span className="text-sm text-gray-400 font-normal">/10</span></p>
            <p className="text-xs text-gray-500 mt-0.5">Risk Score</p>
          </div>
        </div>
      </div>
    </div>
  )
}
