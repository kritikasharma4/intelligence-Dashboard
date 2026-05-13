import FilterChip from '../shared/FilterChip'

const RISK_FILTERS = [
  { label: 'All', color: '' },
  { label: 'Critical', color: 'bg-red-600' },
  { label: 'High', color: 'bg-orange-500' },
  { label: 'Medium', color: 'bg-yellow-500' },
  { label: 'Low', color: 'bg-green-600' },
]

const ADMISSION_FILTERS = ['All', 'Emergency', 'Urgent', 'Elective']

export default function WorklistHeader({
  search, setSearch,
  riskFilter, setRiskFilter,
  deptFilter, setDeptFilter,
  admissionFilter, setAdmissionFilter,
  departments,
  filteredCount,
  totalCount,
}) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admission Worklist</h1>
          <p className="text-sm text-gray-500">
            {filteredCount} of {totalCount} patients · AI-prioritised
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search by name, ID, diagnosis, department…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-400 font-medium">Risk:</span>
        {RISK_FILTERS.map(f => (
          <FilterChip
            key={f.label}
            label={f.label}
            active={riskFilter === f.label}
            onClick={() => setRiskFilter(riskFilter === f.label && f.label !== 'All' ? 'All' : f.label)}
            color={f.color}
          />
        ))}
        <span className="ml-2 text-xs text-gray-400 font-medium">Admission:</span>
        {ADMISSION_FILTERS.map(f => (
          <FilterChip
            key={f}
            label={f}
            active={admissionFilter === f}
            onClick={() => setAdmissionFilter(admissionFilter === f && f !== 'All' ? 'All' : f)}
          />
        ))}
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value === deptFilter && e.target.value !== 'All' ? 'All' : e.target.value)}
          className="ml-2 text-sm border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
