import { useNavigate } from 'react-router-dom'
import RiskBadge from '../shared/RiskBadge'
import { formatDate, formatCurrency, formatLOS } from '../../utils/formatters'
import { getRiskConfig } from '../../utils/riskColors'

export default function ProfileHeader({ patient }) {
  const navigate = useNavigate()
  const config = getRiskConfig(patient.risk_category)
  const confidenceLow = patient.confidence_score < 70
  const confidenceCritical = patient.confidence_score < 50

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm">
      {/* Coloured risk accent bar */}
      <div className={`h-1 w-full ${config.bar}`} />

      <div className="px-6 py-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Left — identity */}
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate('/worklist')}
              className="mt-0.5 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all text-base flex-shrink-0"
            >
              ←
            </button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">{patient.patient_name}</h1>
                <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">{patient.patient_id}</span>
                <RiskBadge category={patient.risk_category} score={patient.risk_score} />
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-gray-500">
                <span className="font-medium text-gray-700">{patient.department}</span>
                <span className="text-gray-200">•</span>
                <span>{patient.doctor_name}</span>
                <span className="text-gray-200">•</span>
                <span>{formatDate(patient.visit_date)}</span>
                <span className="text-gray-200">•</span>
                <span className={`px-2 py-0.5 rounded-full font-semibold ${
                  patient.customer_type === 'Insurance'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {patient.customer_type}
                </span>
              </div>
            </div>
          </div>

          {/* Right — KPI chips */}
          <div className="flex gap-3">
            {[
              { label: 'Est. Revenue', value: formatCurrency(patient.expected_revenue), color: 'text-green-700' },
              { label: 'Est. LOS', value: formatLOS(patient.estimated_los_days), color: 'text-blue-700' },
              { label: 'AI Confidence', value: `${patient.confidence_score}%`, color: confidenceCritical ? 'text-red-600' : confidenceLow ? 'text-yellow-600' : 'text-gray-800' },
            ].map(k => (
              <div key={k.label} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-center min-w-[90px]">
                <p className={`text-lg font-bold ${k.color}`}>{k.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence banners */}
        {confidenceCritical && (
          <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-red-700 text-sm">
            <span>⛔</span>
            <span><strong>Low AI Confidence ({patient.confidence_score}%)</strong> — Clinical data is sparse. Do not act on AI fields without physician sign-off.</span>
          </div>
        )}
        {!confidenceCritical && confidenceLow && (
          <div className="mt-3 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-yellow-700 text-sm">
            <span>⚠️</span>
            <span><strong>AI Confidence {patient.confidence_score}%</strong> — Key fields require physician verification before acting.</span>
          </div>
        )}
      </div>
    </div>
  )
}
