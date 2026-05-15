export default function ClinicalTimeline({ timeline }) {
  if (!timeline?.length) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">📅</span>
          <h3 className="font-semibold text-gray-800 text-sm">Clinical Timeline</h3>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{timeline.length} events</span>
      </div>

      <div className="p-5">
        <div className="relative pl-8">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-blue-400 via-blue-200 to-transparent" />
          <div className="space-y-4">
            {timeline.map((entry, i) => (
              <div key={i} className="relative group">
                <div className="absolute -left-5 top-2.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white shadow-sm ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all" />
                <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Day {entry.day}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-snug">{entry.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
