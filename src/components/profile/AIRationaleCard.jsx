export default function AIRationaleCard({ patient }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-5">
      <h3 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
        🤖 AI Rationale
      </h3>

      <p className="text-sm text-indigo-900 leading-relaxed mb-4">{patient.ai_rationale}</p>

      <div className="flex items-center justify-between pt-3 border-t border-indigo-100">
        <div className="flex items-center gap-2">
          <div className="w-full bg-indigo-100 rounded-full h-2 w-24">
            <div
              className="h-2 rounded-full bg-indigo-500"
              style={{ width: `${patient.confidence_score}%` }}
            />
          </div>
          <span className="text-xs text-indigo-700 font-medium">{patient.confidence_score}% confidence</span>
        </div>
        <span className="text-xs text-indigo-500 font-medium bg-indigo-100 px-2 py-0.5 rounded-full">
          Claude Haiku · v1
        </span>
      </div>
    </div>
  )
}
