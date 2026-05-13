import { formatCurrency } from '../../utils/formatters'

export default function StatsStrip({ stats }) {
  const cards = [
    { label: 'Total Patients', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Critical', value: stats.critical, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'High Risk', value: stats.high, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Medium', value: stats.medium, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Avg LOS', value: `${stats.avgLOS}d`, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Est. Revenue', value: formatCurrency(stats.totalRevenue), color: 'text-green-700', bg: 'bg-green-50' },
  ]

  return (
    <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {cards.map(c => (
        <div key={c.label} className={`${c.bg} rounded-xl p-4`}>
          <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
          <p className="text-gray-500 text-xs mt-0.5">{c.label}</p>
        </div>
      ))}
    </div>
  )
}
