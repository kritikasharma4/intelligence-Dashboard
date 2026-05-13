export default function ClinicalTimeline({ timeline }) {
  if (!timeline?.length) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        📅 Clinical Timeline
      </h3>

      <div className="relative pl-6">
        <div className="absolute left-2 top-0 bottom-0 w-px bg-blue-100" />
        <div className="space-y-4">
          {timeline.map((entry, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow" />
              <div className="bg-blue-50 rounded-lg px-3 py-2.5">
                <p className="text-xs font-semibold text-blue-500 mb-0.5">Day {entry.day}</p>
                <p className="text-sm text-gray-700">{entry.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
