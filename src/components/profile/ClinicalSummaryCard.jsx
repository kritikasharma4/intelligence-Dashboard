export default function ClinicalSummaryCard({ patient }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <span className="text-base">🩺</span>
        <h3 className="font-semibold text-gray-800 text-sm">Clinical Summary</h3>
      </div>

      <div className="p-5 space-y-5">
        {/* Diagnosis */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Primary Diagnosis</p>
          <p className="text-gray-900 font-bold text-base">{patient.primary_diagnosis}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded">{patient.icd10_code}</span>
            {patient.icd10_verified === true && (
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                ✓ ICD-10 Verified
              </span>
            )}
            {patient.icd10_verified === false && (
              <span
                className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium cursor-help"
                title={patient.icd10_verification_note}
              >
                ⚠ Unverified · Coder Review Required
              </span>
            )}
          </div>
        </div>

        {/* History */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Clinical History</p>
          <p className="text-gray-700 text-sm leading-relaxed">{patient.history}</p>
        </div>

        {/* Comorbidities + Symptoms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Comorbidities</p>
            <div className="flex flex-wrap gap-1.5">
              {patient.comorbidities?.length > 0
                ? patient.comorbidities.map((c, i) => (
                    <span key={i} className="text-xs bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-full">{c}</span>
                  ))
                : <span className="text-xs text-gray-400 italic">None documented</span>}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Presenting Symptoms</p>
            <div className="flex flex-wrap gap-1.5">
              {patient.possible_symptoms?.map((s, i) => (
                <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gray-100">
          <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full font-medium">{patient.case_type}</span>
          <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
            patient.admission_type === 'Emergency' ? 'bg-red-50 text-red-700 border-red-100' :
            patient.admission_type === 'Urgent' ? 'bg-orange-50 text-orange-700 border-orange-100' :
            'bg-sky-50 text-sky-700 border-sky-100'
          }`}>{patient.admission_type} Admission</span>
        </div>
      </div>
    </div>
  )
}
