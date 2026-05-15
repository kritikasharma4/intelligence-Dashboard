export default function ActionBanner({ patients, onFilter, activeRiskFilter }) {
  const critical = patients.filter(p => p.risk_category === 'Critical')
  const timeCritical = patients.filter(p => p.priority_tags?.includes('time_critical'))
  const deteriorating = patients.filter(p => p.priority_tags?.includes('deteriorating'))
  const highValue = patients.filter(p => p.priority_tags?.includes('high_value'))

  // Hide banner once user has already filtered to critical
  if (critical.length === 0 && timeCritical.length === 0) return null
  if (activeRiskFilter === 'Critical') return null

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-xl p-4 mb-5 text-white shadow-lg">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-pulse">🚨</span>
          <div>
            <p className="font-bold text-base">Immediate Attention Required</p>
            <p className="text-red-100 text-sm">
              {critical.length} Critical · {timeCritical.length} Time-Critical · {deteriorating.length} Deteriorating
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {critical.length > 0 && (
            <button
              onClick={() => onFilter('Critical')}
              className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-white/30"
            >
              View {critical.length} Critical →
            </button>
          )}
          {highValue.length > 0 && (
            <button
              onClick={() => onFilter('High')}
              className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-white/30"
            >
              💰 {highValue.length} High-Value Cases
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
