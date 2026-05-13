import { formatCurrency, formatLOS } from '../../utils/formatters'

export default function OperationalCard({ patient }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        🏥 Operational Details
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xl font-bold text-green-700">{formatCurrency(patient.expected_revenue)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Expected Revenue</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xl font-bold text-blue-700">{formatLOS(patient.estimated_los_days)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Estimated LOS</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm font-semibold text-gray-800">{patient.bed_type_required}</p>
          <p className="text-xs text-gray-500 mt-0.5">Bed Type Required</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm font-semibold text-gray-800">{patient.admission_type}</p>
          <p className="text-xs text-gray-500 mt-0.5">Admission Type</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 col-span-2">
          <p className="text-sm font-semibold text-gray-800">{patient.inferred_procedure_name || patient.procedure_name}</p>
          <p className="text-xs text-gray-500 mt-0.5">Procedure (AI Inferred)</p>
        </div>
      </div>
    </div>
  )
}
