import { useNavigate } from 'react-router-dom'
import RiskBadge from '../shared/RiskBadge'
import { getRiskConfig } from '../../utils/riskColors'
import { formatCurrency, formatLOS, truncate } from '../../utils/formatters'

const TAG_CONFIG = {
  surgical:               { label: '🔪 Surgical', color: 'bg-purple-100 text-purple-700' },
  time_critical:          { label: '⏰ Time Critical', color: 'bg-red-100 text-red-700' },
  deteriorating:          { label: '📈 Deteriorating', color: 'bg-orange-100 text-orange-700' },
  high_value:             { label: '💰 High Value', color: 'bg-green-100 text-green-700' },
  dropout_risk:           { label: '⚠ Dropout Risk', color: 'bg-yellow-100 text-yellow-700' },
  conversion_opportunity: { label: '🎯 Convert', color: 'bg-blue-100 text-blue-700' },
}

const TREND_CONFIG = {
  worsening: { icon: '↑', color: 'text-red-500', title: 'Deteriorating' },
  improving: { icon: '↓', color: 'text-green-500', title: 'Improving' },
  stable:    { icon: '→', color: 'text-blue-400', title: 'Stable' },
}

export default function PatientRow({ patient }) {
  const navigate = useNavigate()
  const config = getRiskConfig(patient.risk_category)
  const trend = TREND_CONFIG[patient.risk_trend || 'stable']

  return (
    <tr
      onClick={() => navigate(`/patient/${patient.patient_id}`)}
      className={`cursor-pointer hover:bg-blue-50/40 transition-colors duration-100 border-l-[3px] ${config.border} group`}
    >
      {/* Patient */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">{patient.patient_name}</p>
          <span className={`text-xs font-bold ${trend.color}`} title={trend.title}>{trend.icon}</span>
        </div>
        <p className="text-xs text-gray-400 font-mono mt-0.5">{patient.patient_id}</p>
        {/* Priority tags */}
        {patient.priority_tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {patient.priority_tags.slice(0, 2).map(tag => {
              const tc = TAG_CONFIG[tag]
              return tc ? (
                <span key={tag} className={`text-xs px-1.5 py-px rounded font-semibold ${tc.color}`}>{tc.label}</span>
              ) : null
            })}
          </div>
        )}
        {patient.confidence_score < 70 && (
          <span className="text-xs text-yellow-600 font-medium block mt-0.5">⚠ Low confidence</span>
        )}
      </td>

      {/* Department + Doctor */}
      <td className="px-4 py-3.5 hidden md:table-cell">
        <p className="text-sm text-gray-700 font-medium">{patient.department}</p>
        <p className="text-xs text-gray-400 mt-0.5">{patient.doctor_name}</p>
        <p className="text-xs text-indigo-500 mt-0.5 font-medium">{patient.disease_cohort}</p>
      </td>

      {/* Diagnosis */}
      <td className="px-4 py-3.5">
        <p className="text-sm text-gray-800 font-medium leading-snug">{truncate(patient.primary_diagnosis, 48)}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-xs text-blue-500 font-mono">{patient.icd10_code}</p>
          {patient.icd10_verified === false && (
            <span className="text-xs bg-yellow-100 text-yellow-600 px-1.5 py-px rounded font-medium">unverified</span>
          )}
        </div>
      </td>

      {/* Risk */}
      <td className="px-4 py-3.5">
        <RiskBadge category={patient.risk_category} score={patient.risk_score} size="sm" />
      </td>

      {/* Admission Type */}
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
          patient.admission_type === 'Emergency' ? 'bg-red-100 text-red-700' :
          patient.admission_type === 'Urgent' ? 'bg-orange-100 text-orange-700' :
          'bg-sky-100 text-sky-700'
        }`}>
          {patient.admission_type}
        </span>
        <p className="text-xs text-green-600 font-semibold mt-1">{patient.admission_conversion_probability}% admission</p>
      </td>

      {/* Bed */}
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <p className="text-xs text-gray-600 font-medium">{patient.bed_type_required}</p>
      </td>

      {/* LOS + Revenue */}
      <td className="px-4 py-3.5 hidden xl:table-cell text-right">
        <p className="text-sm font-bold text-gray-800">{formatCurrency(patient.expected_revenue)}</p>
        <p className="text-xs text-gray-400 mt-0.5">{formatLOS(patient.estimated_los_days)}</p>
      </td>

      {/* Red flags */}
      <td className="px-4 py-3.5 text-center">
        {patient.red_flags?.length > 0 ? (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
            ⚠ {patient.red_flags.length}
          </span>
        ) : (
          <span className="text-gray-200 text-sm">—</span>
        )}
      </td>

      {/* Arrow */}
      <td className="px-3 py-3.5 text-gray-300 group-hover:text-blue-400 transition-colors text-base">›</td>
    </tr>
  )
}
