import { useMemo } from 'react'
import patientsData from '../data/patients.json'

export function usePatientById(id) {
  const patient = useMemo(
    () => patientsData.find(p => p.patient_id === id) || null,
    [id]
  )
  return { patient, loading: false, notFound: !patient }
}
