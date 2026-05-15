import { useParams } from 'react-router-dom'
import { usePatientById } from '../hooks/usePatientById'
import ProfileHeader from '../components/profile/ProfileHeader'
import ClinicalSummaryCard from '../components/profile/ClinicalSummaryCard'
import RedFlagsCard from '../components/profile/RedFlagsCard'
import ClinicalTimeline from '../components/profile/ClinicalTimeline'
import TreatmentCard from '../components/profile/TreatmentCard'
import RiskCard from '../components/profile/RiskCard'
import OperationalCard from '../components/profile/OperationalCard'
import AIRationaleCard from '../components/profile/AIRationaleCard'
import PhysicianReviewCard from '../components/profile/PhysicianReviewCard'

export default function PatientProfilePage() {
  const { id } = useParams()
  const { patient, notFound } = usePatientById(id)

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Patient Not Found</h2>
          <p className="text-gray-400 text-sm">ID: {id}</p>
        </div>
      </div>
    )
  }

  if (!patient) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader patient={patient} />

      <div className="max-w-screen-xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left column — 2/3 width */}
        <div className="lg:col-span-2 space-y-5">
          <ClinicalSummaryCard patient={patient} />
          <RedFlagsCard redFlags={patient.red_flags} progression={patient.progression} />
          <ClinicalTimeline timeline={patient.clinical_timeline} />
          <TreatmentCard patient={patient} />
        </div>

        {/* Right column — 1/3 width */}
        <div className="space-y-5">
          <RiskCard patient={patient} />
          <OperationalCard patient={patient} />
          <PhysicianReviewCard patient={patient} />
          <AIRationaleCard patient={patient} />
        </div>

      </div>

      <div className="text-center text-gray-400 text-xs pb-6">
        AI-generated clinical insights · Docstribe Admission Intelligence
      </div>
    </div>
  )
}
