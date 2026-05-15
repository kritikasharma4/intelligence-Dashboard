import { usePhysicianReview } from '../../hooks/usePhysicianReview'
import ReviewableField from '../shared/ReviewableField'

export default function PhysicianReviewCard({ patient }) {
  const reviewHook = usePhysicianReview(patient.patient_id)
  const { reviews } = reviewHook

  const fields = [
    { key: 'primary_diagnosis', label: 'Primary Diagnosis', value: patient.primary_diagnosis },
    { key: 'icd10_code', label: 'ICD-10 Code', value: patient.icd10_code },
    { key: 'best_treatment', label: 'Recommended Treatment', value: patient.best_treatment },
    { key: 'admission_type', label: 'Admission Type', value: patient.admission_type },
    { key: 'bed_type_required', label: 'Bed Type Required', value: patient.bed_type_required },
  ]

  const approvedCount = Object.values(reviews).filter(r => r.status === 'approved').length
  const overriddenCount = Object.values(reviews).filter(r => r.status === 'overridden').length
  const pendingCount = fields.length - approvedCount - overriddenCount
  const allReviewed = pendingCount === 0

  return (
    <div className={`bg-white rounded-xl border p-5 ${allReviewed ? 'border-green-300' : 'border-yellow-300'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          👨‍⚕️ Physician Sign-off
        </h3>
        <div className="flex items-center gap-2 text-xs">
          {pendingCount > 0 && (
            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
              {pendingCount} pending
            </span>
          )}
          {approvedCount > 0 && (
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              {approvedCount} approved
            </span>
          )}
          {overriddenCount > 0 && (
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {overriddenCount} overridden
            </span>
          )}
        </div>
      </div>

      {allReviewed && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-green-700 text-sm font-medium">
          ✓ All fields reviewed — patient cleared for admission processing
        </div>
      )}

      <div className="space-y-2">
        {fields.map(f => (
          <ReviewableField
            key={f.key}
            label={f.label}
            value={f.value}
            fieldKey={f.key}
            reviewHook={reviewHook}
          />
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Reviews saved locally · In production: synced to PostgreSQL with physician ID + timestamp
      </p>
    </div>
  )
}
