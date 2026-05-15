import { useState, useEffect } from 'react'

// Persists physician review decisions in localStorage
// In production this would be a POST to /api/reviews backed by PostgreSQL
export function usePhysicianReview(patientId) {
  const storageKey = `physician_review_${patientId}`

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(reviews))
  }, [reviews, storageKey])

  function approve(field) {
    setReviews(prev => ({
      ...prev,
      [field]: { status: 'approved', reviewedAt: new Date().toISOString() },
    }))
  }

  function override(field, newValue) {
    setReviews(prev => ({
      ...prev,
      [field]: { status: 'overridden', newValue, reviewedAt: new Date().toISOString() },
    }))
  }

  function resetField(field) {
    setReviews(prev => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function getFieldStatus(field) {
    return reviews[field] || { status: 'pending' }
  }

  return { reviews, approve, override, resetField, getFieldStatus }
}
