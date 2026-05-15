import { formatCurrency } from '../../utils/formatters'

export default function StatsStrip({ stats }) {
  const cards = [
    { label: 'Total Patients', value: stats.total, sub: 'in dataset', icon: '👥', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Critical', value: stats.critical, sub: 'immediate action', icon: '🔴', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
    { label: 'High Risk', value: stats.high, sub: 'urgent attention', icon: '🟠', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
    { label: 'Medium', value: stats.medium, sub: 'monitor closely', icon: '🟡', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
    { label: 'Avg LOS', value: `${stats.avgLOS}d`, sub: 'days per patient', icon: '📅', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { label: 'Est. Revenue', value: formatCurrency(stats.totalRevenue), sub: 'across cohort', icon: '💰', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-100' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
      {cards.map(c => (
        <div key={c.label} className={`${c.bg} border ${c.border} rounded-xl p-4 flex flex-col gap-1`}>
          <div className="flex items-center justify-between">
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            <span className="text-lg">{c.icon}</span>
          </div>
          <p className="text-gray-700 text-xs font-semibold">{c.label}</p>
          <p className="text-gray-400 text-xs">{c.sub}</p>
        </div>
      ))}
    </div>
  )
}
