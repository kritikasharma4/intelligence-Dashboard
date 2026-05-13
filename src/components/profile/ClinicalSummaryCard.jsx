export default function ClinicalSummaryCard({ patient }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        🩺 Clinical Summary
      </h3>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Primary Diagnosis</p>
          <p className="text-gray-900 font-semibold">{patient.primary_diagnosis}</p>
          <p className="text-xs text-blue-600 font-mono mt-0.5">{patient.icd10_code}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">History</p>
          <p className="text-gray-700 text-sm leading-relaxed">{patient.history}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Comorbidities</p>
            <div className="flex flex-wrap gap-1.5">
              {patient.comorbidities?.length > 0 ? patient.comorbidities.map((c, i) => (
                <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{c}</span>
              )) : <span className="text-xs text-gray-400">None documented</span>}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Possible Symptoms</p>
            <div className="flex flex-wrap gap-1.5">
              {patient.possible_symptoms?.map((s, i) => (
                <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Case Type</p>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
            {patient.case_type}
          </span>
          <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
            {patient.admission_type} Admission
          </span>
        </div>
      </div>
    </div>
  )
}
