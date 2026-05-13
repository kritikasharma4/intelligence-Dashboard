export default function FilterChip({ label, active, onClick, color }) {
  const activeClass = color
    ? `${color} text-white`
    : 'bg-blue-600 text-white'

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-all border ${
        active
          ? `${activeClass} border-transparent shadow-sm`
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-800'
      }`}
    >
      {label}
    </button>
  )
}
