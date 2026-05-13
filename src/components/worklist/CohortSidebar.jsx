import { RISK_CONFIG } from '../../utils/riskColors'

const RISK_ORDER = ['Critical', 'High', 'Medium', 'Low']

export default function CohortSidebar({ patients, selected, onSelect }) {
  const byRisk = RISK_ORDER.map(cat => ({
    cat,
    list: patients.filter(p => p.risk_category === cat),
    config: RISK_CONFIG[cat],
  }))

  return (
    <aside className="w-64 flex-shrink-0 hidden xl:block">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Risk Cohorts</h3>
      <div className="space-y-4">
        {byRisk.map(({ cat, list, config }) => (
          <div key={cat}>
            <div className={`flex items-center justify-between px-3 py-1.5 rounded-lg ${config.bg} mb-1`}>
              <span className={`text-xs font-semibold ${config.text}`}>{cat}</span>
              <span className={`text-xs font-bold ${config.text}`}>{list.length}</span>
            </div>
            <div className="space-y-0.5">
              {list.map(p => (
                <button
                  key={p.patient_id}
                  onClick={() => onSelect(p.patient_id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    selected === p.patient_id
                      ? `${config.bg} ${config.text} font-semibold`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <p className="truncate font-medium">{p.patient_name}</p>
                  <p className="truncate text-gray-400">{p.department}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
