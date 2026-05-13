import { useState, useEffect, useMemo } from 'react'
import patientsData from '../data/patients.json'

export function usePatients() {
  const [patients] = useState(patientsData)
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('All')
  const [deptFilter, setDeptFilter] = useState('All')
  const [admissionFilter, setAdmissionFilter] = useState('All')

  const departments = useMemo(() => {
    const depts = [...new Set(patients.map(p => p.department))].sort()
    return ['All', ...depts]
  }, [patients])

  const filtered = useMemo(() => {
    return patients.filter(p => {
      const matchSearch =
        !search ||
        p.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.patient_id?.toLowerCase().includes(search.toLowerCase()) ||
        p.primary_diagnosis?.toLowerCase().includes(search.toLowerCase()) ||
        p.department?.toLowerCase().includes(search.toLowerCase())

      const matchRisk = riskFilter === 'All' || p.risk_category === riskFilter
      const matchDept = deptFilter === 'All' || p.department === deptFilter
      const matchAdmission = admissionFilter === 'All' || p.admission_type === admissionFilter

      return matchSearch && matchRisk && matchDept && matchAdmission
    })
  }, [patients, search, riskFilter, deptFilter, admissionFilter])

  const stats = useMemo(() => {
    const critical = patients.filter(p => p.risk_category === 'Critical').length
    const high = patients.filter(p => p.risk_category === 'High').length
    const medium = patients.filter(p => p.risk_category === 'Medium').length
    const low = patients.filter(p => p.risk_category === 'Low').length
    const totalRevenue = patients.reduce((sum, p) => sum + (p.expected_revenue || 0), 0)
    const avgLOS = Math.round(
      patients.reduce((sum, p) => sum + (p.estimated_los_days || 0), 0) / patients.length
    )
    return { critical, high, medium, low, totalRevenue, avgLOS, total: patients.length }
  }, [patients])

  return {
    patients,
    filtered,
    search,
    setSearch,
    riskFilter,
    setRiskFilter,
    deptFilter,
    setDeptFilter,
    admissionFilter,
    setAdmissionFilter,
    departments,
    stats,
  }
}
