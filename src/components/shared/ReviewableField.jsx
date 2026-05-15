import { useState } from 'react'

// Wraps any AI-generated field with physician review controls
// Status: pending (yellow) | approved (green) | overridden (blue)
export default function ReviewableField({ label, value, fieldKey, reviewHook }) {
  const { approve, override, resetField, getFieldStatus } = reviewHook
  const { status, newValue, reviewedAt } = getFieldStatus(fieldKey)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState('')

  const displayValue = status === 'overridden' ? newValue : value
  const timeStr = reviewedAt ? new Date(reviewedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''

  function handleOverride() {
    setEditValue(value)
    setEditing(true)
  }

  function submitOverride() {
    if (editValue.trim()) {
      override(fieldKey, editValue.trim())
      setEditing(false)
    }
  }

  return (
    <div className={`rounded-lg border px-3 py-2.5 ${
      status === 'approved' ? 'border-green-200 bg-green-50' :
      status === 'overridden' ? 'border-blue-200 bg-blue-50' :
      'border-yellow-200 bg-yellow-50'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">{label}</p>

          {editing ? (
            <div className="flex gap-2 mt-1">
              <input
                autoFocus
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                className="flex-1 text-sm border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              />
              <button onClick={submitOverride} className="text-xs bg-blue-600 text-white px-3 py-1 rounded font-medium hover:bg-blue-500">
                Save
              </button>
              <button onClick={() => setEditing(false)} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1">
                Cancel
              </button>
            </div>
          ) : (
            <p className={`text-sm font-medium ${
              status === 'approved' ? 'text-green-800' :
              status === 'overridden' ? 'text-blue-800' :
              'text-gray-800'
            }`}>
              {displayValue}
            </p>
          )}

          {status === 'overridden' && (
            <p className="text-xs text-blue-500 mt-0.5">
              AI said: <span className="line-through text-gray-400">{value}</span>
            </p>
          )}
        </div>

        {/* Status badge + actions */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {status === 'pending' && !editing && (
            <span className="text-xs bg-yellow-200 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
              Pending Review
            </span>
          )}
          {status === 'approved' && (
            <span className="text-xs bg-green-200 text-green-700 px-2 py-0.5 rounded-full font-medium">
              ✓ Approved {timeStr}
            </span>
          )}
          {status === 'overridden' && (
            <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              ✎ Overridden {timeStr}
            </span>
          )}

          {!editing && (
            <div className="flex gap-1">
              {status === 'pending' && (
                <>
                  <button
                    onClick={() => approve(fieldKey)}
                    className="text-xs bg-green-600 hover:bg-green-500 text-white px-2 py-0.5 rounded font-medium transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleOverride}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded font-medium transition-colors"
                  >
                    Override
                  </button>
                </>
              )}
              {(status === 'approved' || status === 'overridden') && (
                <button
                  onClick={() => resetField(fieldKey)}
                  className="text-xs text-gray-400 hover:text-gray-600 px-2 py-0.5 rounded border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
