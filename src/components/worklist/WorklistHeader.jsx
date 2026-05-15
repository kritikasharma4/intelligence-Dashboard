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
  viewMode,
  setViewMode,
}) {
  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">D</div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-none">Admission Worklist</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Showing <span className="font-semibold text-gray-600">{filteredCount}</span> of <span className="font-semibold text-gray-600">{totalCount}</span> patients · AI-prioritised
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
            >
              ☰ List
            </button>
            <button
              onClick={() => setViewMode('cohort')}
              className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all ${viewMode === 'cohort' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
            >
              ⬡ Cohorts
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400 font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="px-6 py-3 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search name, ID, diagnosis…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="h-5 w-px bg-gray-200" />

        {/* Risk filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 font-medium mr-1">Risk</span>
          {RISK_FILTERS.map(f => (
            <FilterChip
              key={f.label}
              label={f.label}
              active={riskFilter === f.label}
              onClick={() => setRiskFilter(riskFilter === f.label && f.label !== 'All' ? 'All' : f.label)}
              color={f.color}
            />
          ))}
        </div>

        <div className="h-5 w-px bg-gray-200" />

        {/* Admission filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 font-medium mr-1">Admission</span>
          {ADMISSION_FILTERS.map(f => (
            <FilterChip
              key={f}
              label={f}
              active={admissionFilter === f}
              onClick={() => setAdmissionFilter(admissionFilter === f && f !== 'All' ? 'All' : f)}
            />
          ))}
        </div>

        <div className="h-5 w-px bg-gray-200" />

        {/* Department */}
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value === deptFilter && e.target.value !== 'All' ? 'All' : e.target.value)}
          className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
        >
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
    </div>
  )
}
