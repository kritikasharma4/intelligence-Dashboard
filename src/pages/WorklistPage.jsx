import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatients } from '../hooks/usePatients'
import StatsStrip from '../components/worklist/StatsStrip'
import WorklistHeader from '../components/worklist/WorklistHeader'
import PatientRow from '../components/worklist/PatientRow'
import CohortSidebar from '../components/worklist/CohortSidebar'

export default function WorklistPage() {
  const {
    filtered, stats,
    search, setSearch,
    riskFilter, setRiskFilter,
    deptFilter, setDeptFilter,
    admissionFilter, setAdmissionFilter,
    departments,
  } = usePatients()

  const [selectedId, setSelectedId] = useState(null)
  const navigate = useNavigate()

  function handleSidebarSelect(id) {
    setSelectedId(id)
    navigate(`/patient/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <WorklistHeader
        search={search} setSearch={setSearch}
        riskFilter={riskFilter} setRiskFilter={setRiskFilter}
        deptFilter={deptFilter} setDeptFilter={setDeptFilter}
        admissionFilter={admissionFilter} setAdmissionFilter={setAdmissionFilter}
        departments={departments}
        filteredCount={filtered.length}
        totalCount={stats.total}
      />

      <div className="flex flex-1 gap-6 p-6 max-w-screen-2xl mx-auto w-full">
        <CohortSidebar
          patients={filtered}
          selected={selectedId}
          onSelect={handleSidebarSelect}
        />

        <main className="flex-1 min-w-0">
          <StatsStrip stats={stats} />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-medium">No patients match these filters</p>
                <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Dept / Doctor</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Diagnosis</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Risk</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Admission</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Bed</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden xl:table-cell text-right">Revenue / LOS</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Flags</th>
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

          <p className="text-center text-gray-400 text-xs mt-4">
            AI-generated insights · Docstribe Admission Intelligence
          </p>
        </main>
      </div>
    </div>
  )
}
