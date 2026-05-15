import { useNavigate } from 'react-router-dom'
import RiskBadge from '../shared/RiskBadge'
import { formatCurrency } from '../../utils/formatters'
import { getRiskConfig } from '../../utils/riskColors'

const COHORT_ICONS = {
  'Cardiac': '❤️',
  'Respiratory': '🫁',
  'Neurological': '🧠',
  'Surgical': '🔪',
  'Metabolic': '🧪',
  'Oncology': '🎗️',
  'Renal/Urology': '🫘',
  'Gastro/Hepatology': '🩺',
  'Obstetrics': '🤱',
  'Haematology': '🩸',
  'Infectious Disease': '🦠',
  'General Medicine': '💊',
}

const TAG_CONFIG = {
  surgical:               { label: 'Surgical', color: 'bg-purple-100 text-purple-700' },
  time_critical:          { label: 'Time Critical', color: 'bg-red-100 text-red-700' },
  deteriorating:          { label: 'Deteriorating', color: 'bg-orange-100 text-orange-700' },
  high_value:             { label: 'High Value', color: 'bg-green-100 text-green-700' },
  dropout_risk:           { label: 'Dropout Risk', color: 'bg-yellow-100 text-yellow-700' },
  conversion_opportunity: { label: 'Convert', color: 'bg-blue-100 text-blue-700' },
}

function PatientCard({ patient }) {
  const navigate = useNavigate()
  const config = getRiskConfig(patient.risk_category)

  return (
    <div
      onClick={() => navigate(`/patient/${patient.patient_id}`)}
      className={`bg-white border-l-4 ${config.border} rounded-lg p-3 cursor-pointer hover:shadow-md hover:translate-y-[-1px] transition-all duration-150 border border-l-4 border-gray-100`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">{patient.patient_name}</p>
          <p className="text-xs text-gray-400 font-mono">{patient.patient_id}</p>
        </div>
        <RiskBadge category={patient.risk_category} score={patient.risk_score} size="sm" />
      </div>

      <p className="text-xs text-gray-700 font-medium leading-snug mb-2">{patient.primary_diagnosis}</p>

      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
          patient.admission_type === 'Emergency' ? 'bg-red-100 text-red-700' :
          patient.admission_type === 'Urgent' ? 'bg-orange-100 text-orange-700' :
          'bg-sky-100 text-sky-700'
        }`}>{patient.admission_type}</span>
        <span className="text-xs text-gray-500 font-medium">{formatCurrency(patient.expected_revenue)}</span>
      </div>

      {/* Priority tags */}
      {patient.priority_tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {patient.priority_tags.map(tag => {
            const tc = TAG_CONFIG[tag]
            return tc ? (
              <span key={tag} className={`text-xs px-1.5 py-0.5 rounded font-medium ${tc.color}`}>{tc.label}</span>
            ) : null
          })}
        </div>
      )}

      <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">{patient.department}</span>
        <span className="text-xs font-semibold text-blue-600">{patient.admission_conversion_probability}% admission</span>
      </div>
    </div>
  )
}

export default function CohortView({ patients }) {
  // Group by disease cohort
  const cohorts = {}
  patients.forEach(p => {
    const c = p.disease_cohort || 'General Medicine'
    if (!cohorts[c]) cohorts[c] = []
    cohorts[c].push(p)
  })

  // Sort cohorts by max risk score descending
  const sortedCohorts = Object.entries(cohorts).sort(([, a], [, b]) => {
    const maxA = Math.max(...a.map(p => p.risk_score))
    const maxB = Math.max(...b.map(p => p.risk_score))
    return maxB - maxA
  })

  if (patients.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🔍</p>
        <p className="font-semibold text-gray-600">No patients match these filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sortedCohorts.map(([cohort, cohortPatients]) => {
        const criticalCount = cohortPatients.filter(p => p.risk_category === 'Critical').length
        const totalRevenue = cohortPatients.reduce((s, p) => s + (p.expected_revenue || 0), 0)

        return (
          <div key={cohort} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Cohort header */}
            <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{COHORT_ICONS[cohort] || '🏥'}</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{cohort}</h3>
                  <p className="text-xs text-gray-400">{cohortPatients.length} patient{cohortPatients.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                {criticalCount > 0 && (
                  <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                    {criticalCount} Critical
                  </span>
                )}
                <div>
                  <p className="text-sm font-bold text-green-700">{formatCurrency(totalRevenue)}</p>
                  <p className="text-xs text-gray-400">est. revenue</p>
                </div>
              </div>
            </div>

            {/* Patient cards grid */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {cohortPatients
                .sort((a, b) => b.risk_score - a.risk_score)
                .map(p => <PatientCard key={p.patient_id} patient={p} />)
              }
            </div>
          </div>
        )
      })}
    </div>
  )
}
