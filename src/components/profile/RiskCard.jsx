import { getRiskConfig, getRiskScoreColor } from '../../utils/riskColors'

export default function RiskCard({ patient }) {
  const config = getRiskConfig(patient.risk_category)
  const scoreWidth = `${(patient.risk_score / 10) * 100}%`

  return (
    <div className={`bg-white rounded-xl border p-5 ${config.border}`}>
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        📊 Risk Analysis
      </h3>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Risk Score</span>
          <span className={`text-2xl font-bold ${getRiskScoreColor(patient.risk_score)}`}>
            {patient.risk_score}<span className="text-sm text-gray-400">/10</span>
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${config.bar} transition-all`}
            style={{ width: scoreWidth }}
          />
        </div>
      </div>

      <div className={`${config.bg} rounded-lg p-3 mb-3`}>
        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">AI Reasoning</p>
        <p className={`text-sm ${config.text} leading-relaxed`}>{patient.risk_reasoning}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${config.badge}`}>
          {patient.risk_category} Risk
        </span>
        <span className="text-xs text-gray-400">
          Data: <span className={`font-medium ${
            patient.data_completeness === 'High' ? 'text-green-600' :
            patient.data_completeness === 'Medium' ? 'text-yellow-600' : 'text-red-600'
          }`}>{patient.data_completeness}</span>
        </span>
      </div>
    </div>
  )
}
