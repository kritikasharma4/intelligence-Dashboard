export default function RedFlagsCard({ redFlags, progression }) {
  if (!redFlags?.length && !progression) return null

  return (
    <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-red-100 bg-red-50/50 flex items-center gap-2">
        <span className="text-base">⚠️</span>
        <h3 className="font-semibold text-red-700 text-sm">Red Flags & Progression</h3>
        {redFlags?.length > 0 && (
          <span className="ml-auto text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
            {redFlags.length} flag{redFlags.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="p-5 space-y-4">
        {redFlags?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Clinical Red Flags</p>
            <div className="space-y-2">
              {redFlags.map((flag, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
                  <span className="text-red-400 mt-0.5 flex-shrink-0 text-xs">▲</span>
                  <p className="text-sm text-red-700 font-medium">{flag}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {progression && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Disease Progression</p>
            <p className="text-sm text-gray-700 leading-relaxed bg-orange-50 border border-orange-100 rounded-lg p-3.5">
              {progression}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
