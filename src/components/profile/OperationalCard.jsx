import { formatCurrency, formatLOS } from '../../utils/formatters'

export default function OperationalCard({ patient }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <span className="text-base">🏥</span>
        <h3 className="font-semibold text-gray-800 text-sm">Operational Details</h3>
      </div>

      <div className="p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-emerald-700">{formatCurrency(patient.expected_revenue)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Expected Revenue</p>
          </div>
          <div className="bg-sky-50 border border-sky-100 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-sky-700">{formatLOS(patient.estimated_los_days)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Estimated LOS</p>
          </div>
        </div>

        {[
          { label: 'Bed Type Required', value: patient.bed_type_required },
          { label: 'Admission Type', value: patient.admission_type },
          { label: 'Procedure (AI Inferred)', value: patient.inferred_procedure_name || patient.procedure_name },
        ].map(item => (
          <div key={item.label} className="flex items-start justify-between gap-3 py-2.5 border-b border-gray-50 last:border-0">
            <p className="text-xs text-gray-400 font-medium flex-shrink-0">{item.label}</p>
            <p className="text-sm text-gray-800 font-semibold text-right">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
