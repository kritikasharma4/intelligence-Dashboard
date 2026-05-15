export default function TreatmentCard({ patient }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <span className="text-base">💊</span>
        <h3 className="font-semibold text-gray-800 text-sm">Treatment Plan</h3>
      </div>

      <div className="p-5 space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <p className="text-xs font-bold text-green-700 uppercase tracking-wide">Recommended Treatment</p>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed">{patient.best_treatment}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 bg-blue-400 rounded-full" />
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Secondary / Supportive</p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{patient.secondary_treatment}</p>
        </div>

        {patient.deferred_time && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3.5">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 bg-yellow-400 rounded-full" />
              <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide">Deferred Care</p>
            </div>
            <p className="text-sm text-gray-700">{patient.deferred_time}</p>
          </div>
        )}
      </div>
    </div>
  )
}
