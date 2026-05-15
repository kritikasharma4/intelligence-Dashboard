import { getRiskConfig, getRiskScoreColor } from '../../utils/riskColors'

export default function RiskCard({ patient }) {
  const config = getRiskConfig(patient.risk_category)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <span className="text-base">📊</span>
        <h3 className="font-semibold text-gray-800 text-sm">Risk Analysis</h3>
      </div>

      <div className="p-5 space-y-4">
        {/* Score */}
        <div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Risk Score</span>
            <span className={`text-3xl font-black ${getRiskScoreColor(patient.risk_score)}`}>
              {patient.risk_score}
              <span className="text-sm text-gray-400 font-normal">/10</span>
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${config.bar} transition-all`}
              style={{ width: `${(patient.risk_score / 10) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-300">Low</span>
            <span className="text-xs text-gray-300">Critical</span>
          </div>
        </div>

        {/* Category badge */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${config.badge}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
            {patient.risk_category} Risk
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium border ${
            patient.data_completeness === 'High' ? 'bg-green-50 text-green-700 border-green-100' :
            patient.data_completeness === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
            'bg-red-50 text-red-600 border-red-100'
          }`}>
            Data: {patient.data_completeness}
          </span>
        </div>

        {/* Reasoning */}
        <div className={`${config.bg} border ${config.border} rounded-lg p-3.5`}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">AI Reasoning</p>
          <p className={`text-sm ${config.text} leading-relaxed`}>{patient.risk_reasoning}</p>
        </div>

        {/* Readmission + dropout */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Readmission Risk', value: patient.readmission_risk },
            { label: 'Dropout Risk', value: patient.dropout_risk },
          ].map(r => (
            <div key={r.label} className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
              <p className={`text-sm font-bold ${
                r.value === 'High' ? 'text-red-600' :
                r.value === 'Medium' ? 'text-yellow-600' : 'text-green-600'
              }`}>{r.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{r.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
