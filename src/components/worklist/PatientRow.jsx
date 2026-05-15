import { useNavigate } from 'react-router-dom'
import RiskBadge from '../shared/RiskBadge'
import { getRiskConfig } from '../../utils/riskColors'
import { formatCurrency, formatDate, formatLOS, truncate } from '../../utils/formatters'

export default function PatientRow({ patient }) {
  const navigate = useNavigate()
  const config = getRiskConfig(patient.risk_category)

  return (
    <tr
      onClick={() => navigate(`/patient/${patient.patient_id}`)}
      className={`cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${config.border}`}
    >
      {/* Patient */}
      <td className="px-4 py-3">
        <p className="font-semibold text-gray-900 text-sm">{patient.patient_name}</p>
        <p className="text-xs text-gray-400">{patient.patient_id}</p>
        {patient.confidence_score < 70 && (
          <span className="text-xs text-yellow-600 font-medium">⚠ Low confidence</span>
        )}
      </td>

      {/* Department + Doctor */}
      <td className="px-4 py-3 hidden md:table-cell">
        <p className="text-sm text-gray-700">{patient.department}</p>
        <p className="text-xs text-gray-400">{patient.doctor_name}</p>
      </td>

      {/* Diagnosis */}
      <td className="px-4 py-3">
        <p className="text-sm text-gray-800 font-medium">{truncate(patient.primary_diagnosis, 50)}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-xs text-gray-400 font-mono">{patient.icd10_code}</p>
          {patient.icd10_verified === false && (
            <span className="text-xs bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded font-medium">unverified</span>
          )}
        </div>
      </td>

      {/* Risk */}
      <td className="px-4 py-3">
        <RiskBadge category={patient.risk_category} score={patient.risk_score} size="sm" />
      </td>

      {/* Admission Type */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          patient.admission_type === 'Emergency' ? 'bg-red-100 text-red-700' :
          patient.admission_type === 'Urgent' ? 'bg-orange-100 text-orange-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {patient.admission_type}
        </span>
      </td>

      {/* Bed */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <p className="text-xs text-gray-600">{patient.bed_type_required}</p>
      </td>

      {/* LOS + Revenue */}
      <td className="px-4 py-3 hidden xl:table-cell text-right">
        <p className="text-sm font-semibold text-gray-800">{formatCurrency(patient.expected_revenue)}</p>
        <p className="text-xs text-gray-400">{formatLOS(patient.estimated_los_days)}</p>
      </td>

      {/* Red flags count */}
      <td className="px-4 py-3 text-center">
        {patient.red_flags?.length > 0 ? (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
            ⚠ {patient.red_flags.length}
          </span>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>

      {/* Arrow */}
      <td className="px-3 py-3 text-gray-400 text-sm">›</td>
    </tr>
  )
}
