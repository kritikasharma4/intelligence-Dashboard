import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatients } from '../hooks/usePatients'
import StatsStrip from '../components/worklist/StatsStrip'
import WorklistHeader from '../components/worklist/WorklistHeader'
import PatientRow from '../components/worklist/PatientRow'
import CohortSidebar from '../components/worklist/CohortSidebar'
import CohortView from '../components/worklist/CohortView'
import ActionBanner from '../components/worklist/ActionBanner'

export default function WorklistPage() {
  const {
    patients, filtered, stats,
    search, setSearch,
    riskFilter, setRiskFilter,
    deptFilter, setDeptFilter,
    admissionFilter, setAdmissionFilter,
    departments,
  } = usePatients()

  const [selectedId, setSelectedId] = useState(null)
  const [viewMode, setViewMode] = useState('table') // 'table' | 'cohort'
  const navigate = useNavigate()

  function handleSidebarSelect(id) {
    setSelectedId(id)
    navigate(`/patient/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50/80 flex flex-col">
      <WorklistHeader
        search={search} setSearch={setSearch}
        riskFilter={riskFilter} setRiskFilter={setRiskFilter}
        deptFilter={deptFilter} setDeptFilter={setDeptFilter}
        admissionFilter={admissionFilter} setAdmissionFilter={setAdmissionFilter}
        departments={departments}
        filteredCount={filtered.length}
        totalCount={stats.total}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="flex flex-1 gap-5 p-5 max-w-screen-2xl mx-auto w-full">
        {viewMode === 'table' && (
          <CohortSidebar
            patients={filtered}
            selected={selectedId}
            onSelect={handleSidebarSelect}
          />
        )}

        <main className="flex-1 min-w-0">
          <StatsStrip stats={stats} patients={patients} />

          <ActionBanner patients={filtered} onFilter={setRiskFilter} activeRiskFilter={riskFilter} />

          {viewMode === 'table' ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-5xl mb-4">🔍</p>
                  <p className="font-semibold text-gray-600 text-base">No patients match these filters</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search or clearing a filter</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Dept / Cohort</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Diagnosis</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Risk</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Admission / Conv.</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Bed</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden xl:table-cell text-right">Revenue / LOS</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Flags</th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map(patient => (
                      <PatientRow key={patient.patient_id} patient={patient} />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <CohortView patients={filtered} />
          )}

          <p className="text-center text-gray-400 text-xs mt-4">
            AI-generated insights · Docstribe Admission Intelligence · {filtered.length} patients shown
          </p>
        </main>
      </div>
    </div>
  )
}
