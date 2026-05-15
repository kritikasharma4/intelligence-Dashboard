import { formatCurrency } from '../../utils/formatters'

export default function StatsStrip({ stats, patients = [] }) {
  const surgical = patients.filter(p => p.priority_tags?.includes('surgical')).length
  const insuranceRevenue = patients.filter(p => p.customer_type === 'Insurance').reduce((s, p) => s + (p.expected_revenue || 0), 0)
  const cashRevenue = patients.filter(p => p.customer_type === 'Cash').reduce((s, p) => s + (p.expected_revenue || 0), 0)

  const topCards = [
    { label: 'Total Patients', value: stats.total, sub: 'in dataset', icon: '👥', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' },
    { label: 'Critical', value: stats.critical, sub: 'immediate action', icon: '🔴', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', highlight: stats.critical > 0 },
    { label: 'High Risk', value: stats.high, sub: 'urgent attention', icon: '🟠', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', highlight: stats.high > 0 },
    { label: 'Surgical Cases', value: surgical, sub: 'conversion opportunity', icon: '🔪', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
    { label: 'Avg LOS', value: `${stats.avgLOS}d`, sub: 'days per patient', icon: '📅', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
    { label: 'Est. Revenue', value: formatCurrency(stats.totalRevenue), sub: 'across cohort', icon: '💰', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  ]

  return (
    <div className="mb-5 space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {topCards.map(c => (
          <div key={c.label} className={`${c.bg} border ${c.border} rounded-xl p-4 flex flex-col gap-1 ${c.highlight ? 'ring-1 ring-offset-1 ' + c.border : ''}`}>
            <div className="flex items-center justify-between">
              <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
              <span className="text-lg">{c.icon}</span>
            </div>
            <p className="text-gray-700 text-xs font-semibold">{c.label}</p>
            <p className="text-gray-400 text-xs">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue segmentation strip */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-6 flex-wrap">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Revenue Breakdown</span>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          <span className="text-xs text-gray-500">Insurance</span>
          <span className="text-sm font-bold text-sky-700">{formatCurrency(insuranceRevenue)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          <span className="text-xs text-gray-500">Cash</span>
          <span className="text-sm font-bold text-slate-700">{formatCurrency(cashRevenue)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
          <span className="text-xs text-gray-500">Surgical pipeline</span>
          <span className="text-sm font-bold text-violet-700">
            {formatCurrency(patients.filter(p => p.priority_tags?.includes('surgical')).reduce((s, p) => s + (p.expected_revenue || 0), 0))}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-400">Emergency</span>
          <span className="text-sm font-bold text-red-600">
            {patients.filter(p => p.admission_type === 'Emergency').length} cases
          </span>
          <span className="text-gray-200 mx-1">|</span>
          <span className="text-xs text-gray-400">Elective</span>
          <span className="text-sm font-bold text-sky-600">
            {patients.filter(p => p.admission_type === 'Elective').length} cases
          </span>
        </div>
      </div>
    </div>
  )
}
