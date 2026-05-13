export default function TreatmentCard({ patient }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        💊 Treatment Plan
      </h3>

      <div className="space-y-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <p className="text-xs font-semibold text-green-600 uppercase mb-1">Recommended Treatment</p>
          <p className="text-sm text-gray-800">{patient.best_treatment}</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Secondary / Supportive</p>
          <p className="text-sm text-gray-700">{patient.secondary_treatment}</p>
        </div>

        {patient.deferred_time && (
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
            <p className="text-xs font-semibold text-yellow-600 uppercase mb-0.5">Deferred Care</p>
            <p className="text-sm text-gray-700">{patient.deferred_time}</p>
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center min-w-[80px]">
            <p className="text-sm font-bold text-gray-800">{patient.bed_type_required}</p>
            <p className="text-xs text-gray-400 mt-0.5">Bed Required</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center min-w-[80px]">
            <p className={`text-sm font-bold ${
              patient.readmission_risk === 'High' ? 'text-red-600' :
              patient.readmission_risk === 'Medium' ? 'text-yellow-600' : 'text-green-600'
            }`}>{patient.readmission_risk}</p>
            <p className="text-xs text-gray-400 mt-0.5">Readmission Risk</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center min-w-[80px]">
            <p className={`text-sm font-bold ${
              patient.dropout_risk === 'High' ? 'text-red-600' :
              patient.dropout_risk === 'Medium' ? 'text-yellow-600' : 'text-green-600'
            }`}>{patient.dropout_risk}</p>
            <p className="text-xs text-gray-400 mt-0.5">Dropout Risk</p>
          </div>
        </div>
      </div>
    </div>
  )
}
