export const RISK_CONFIG = {
  Critical: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-300',
    dot: 'bg-red-600',
    badge: 'bg-red-600 text-white',
    bar: 'bg-red-600',
  },
  High: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-300',
    dot: 'bg-orange-500',
    badge: 'bg-orange-500 text-white',
    bar: 'bg-orange-500',
  },
  Medium: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-300',
    dot: 'bg-yellow-500',
    badge: 'bg-yellow-500 text-white',
    bar: 'bg-yellow-500',
  },
  Low: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-300',
    dot: 'bg-green-500',
    badge: 'bg-green-600 text-white',
    bar: 'bg-green-500',
  },
}

export function getRiskConfig(category) {
  return RISK_CONFIG[category] || RISK_CONFIG.Low
}

export function getRiskScoreColor(score) {
  if (score >= 9) return 'text-red-600'
  if (score >= 7) return 'text-orange-500'
  if (score >= 5) return 'text-yellow-600'
  return 'text-green-600'
}
