export default function AIRationaleCard({ patient }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-indigo-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">🤖</span>
          <h3 className="font-semibold text-indigo-800 text-sm">AI Rationale</h3>
        </div>
        <span className="text-xs text-indigo-500 font-medium bg-indigo-100 px-2 py-0.5 rounded-full">
          Claude Haiku
        </span>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-sm text-indigo-900 leading-relaxed">{patient.ai_rationale}</p>

        <div className="pt-3 border-t border-indigo-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-500 font-medium">Confidence</span>
            <span className="text-indigo-700 font-bold">{patient.confidence_score}%</span>
          </div>
          <div className="w-full bg-indigo-100 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-indigo-500 transition-all"
              style={{ width: `${patient.confidence_score}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-indigo-400 italic">
          AI outputs are decision-support only — not for direct clinical action without physician review.
        </p>
      </div>
    </div>
  )
}
