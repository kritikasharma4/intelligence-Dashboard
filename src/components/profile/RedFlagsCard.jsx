export default function RedFlagsCard({ redFlags, progression }) {
  if (!redFlags?.length && !progression) return null

  return (
    <div className="bg-white rounded-xl border border-red-200 p-5">
      <h3 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
        ⚠️ Red Flags & Progression
      </h3>

      {redFlags?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Clinical Red Flags</p>
          <div className="space-y-2">
            {redFlags.map((flag, i) => (
              <div key={i} className="flex items-start gap-2 bg-red-50 rounded-lg px-3 py-2">
                <span className="text-red-500 mt-0.5 flex-shrink-0">●</span>
                <p className="text-sm text-red-700">{flag}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {progression && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Progression</p>
          <p className="text-sm text-gray-700 leading-relaxed bg-orange-50 rounded-lg p-3 border border-orange-100">
            {progression}
          </p>
        </div>
      )}
    </div>
  )
}
