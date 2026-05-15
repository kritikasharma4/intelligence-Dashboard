import { useNavigate } from 'react-router-dom'
import RiskBadge from '../shared/RiskBadge'
import { formatDate, formatCurrency, formatLOS } from '../../utils/formatters'

export default function ProfileHeader({ patient }) {
  const navigate = useNavigate()

  const confidenceLow = patient.confidence_score < 70
  const confidenceCritical = patient.confidence_score < 50

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/worklist')}
            className="text-gray-400 hover:text-gray-600 text-lg transition-colors"
          >
            ←
          </button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{patient.patient_name}</h1>
              <span className="text-sm text-gray-400 font-mono">{patient.patient_id}</span>
              <RiskBadge category={patient.risk_category} score={patient.risk_score} />
            </div>
            <div className="flex items-center gap-4 mt-1 flex-wrap">
              <span className="text-sm text-gray-600">{patient.department}</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-600">{patient.doctor_name}</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-600">{formatDate(patient.visit_date)}</span>
              <span className="text-gray-300">|</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                patient.customer_type === 'Insurance' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {patient.customer_type}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 text-center">
          <div className="bg-gray-50 rounded-xl px-4 py-2">
            <p className="text-lg font-bold text-gray-800">{formatCurrency(patient.expected_revenue)}</p>
            <p className="text-xs text-gray-400">Est. Revenue</p>
          </div>
          <div className="bg-gray-50 rounded-xl px-4 py-2">
            <p className="text-lg font-bold text-gray-800">{formatLOS(patient.estimated_los_days)}</p>
            <p className="text-xs text-gray-400">Est. LOS</p>
          </div>
          <div className="bg-gray-50 rounded-xl px-4 py-2">
            <p className="text-lg font-bold text-gray-800">{patient.confidence_score}%</p>
            <p className="text-xs text-gray-400">AI Confidence</p>
          </div>
        </div>
      </div>

      {confidenceCritical && (
        <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-red-800 text-sm">
          <span>⛔</span>
          <span><strong>Low AI Confidence ({patient.confidence_score}%)</strong> — Clinical data is sparse. Do not act on AI fields without physician sign-off.</span>
        </div>
      )}
      {!confidenceCritical && confidenceLow && (
        <div className="mt-3 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-yellow-800 text-sm">
          <span>⚠️</span>
          <span><strong>AI Confidence {patient.confidence_score}%</strong> — Key fields (diagnosis, ICD-10, treatment) require physician verification before acting.</span>
        </div>
      )}
    </div>
  )
}
