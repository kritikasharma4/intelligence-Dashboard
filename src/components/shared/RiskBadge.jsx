import { getRiskConfig } from '../../utils/riskColors'

export default function RiskBadge({ category, score, size = 'md' }) {
  const config = getRiskConfig(category)
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClass} ${config.badge}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
      {category}
      {score != null && <span className="opacity-80">· {score}</span>}
    </span>
  )
}
