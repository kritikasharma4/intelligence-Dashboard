import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  { label: 'Parsing Excel records', duration: 800 },
  { label: 'Extracting clinical notes', duration: 900 },
  { label: 'Running AI risk classification', duration: 1200 },
  { label: 'Inferring ICD-10 codes', duration: 700 },
  { label: 'Scoring comorbidities & red flags', duration: 800 },
  { label: 'Estimating revenue & LOS', duration: 600 },
  { label: 'Finalising patient profiles', duration: 500 },
]

export default function UploadPage() {
  const [phase, setPhase] = useState('idle')
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState('')
  const [stepIdx, setStepIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()
  const fileRef = useRef()

  function handleFile(file) {
    if (!file) return
    setFileName(file.name)
    setPhase('uploading')

    let p = 0
    const uploadTimer = setInterval(() => {
      p += 8
      setProgress(Math.min(p, 100))
      if (p >= 100) {
        clearInterval(uploadTimer)
        setProgress(0)
        setPhase('processing')
        runSteps(0)
      }
    }, 96)
  }

  function runSteps(idx) {
    if (idx >= STEPS.length) {
      setPhase('done')
      return
    }
    setStepIdx(idx)
    const totalMs = STEPS.slice(0, idx + 1).reduce((s, st) => s + st.duration, 0)
    const totalAll = STEPS.reduce((s, st) => s + st.duration, 0)
    setTimeout(() => {
      setProgress(Math.round((totalMs / totalAll) * 100))
      setTimeout(() => runSteps(idx + 1), STEPS[idx].duration)
    }, 80)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-300 text-sm font-medium">AI-Powered Clinical Intelligence</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admission Intelligence</h1>
          <p className="text-slate-400">Upload patient data to generate AI-driven admission insights</p>
        </div>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl">

          {phase === 'idle' && (
            <>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
                onClick={() => fileRef.current.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                  dragOver ? 'border-blue-400 bg-blue-500/10' : 'border-white/20 hover:border-blue-400/60 hover:bg-white/5'
                }`}
              >
                <div className="text-5xl mb-3">📋</div>
                <p className="text-white font-semibold mb-1">Drop your Excel file here</p>
                <p className="text-slate-400 text-sm">or click to browse · .xlsx / .xls</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={e => handleFile(e.target.files[0])}
                />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {['Risk Scoring', 'ICD-10 Codes', 'Revenue Est.'].map(label => (
                  <div key={label} className="bg-white/5 rounded-lg p-3">
                    <p className="text-slate-300 text-xs">{label}</p>
                    <p className="text-blue-400 text-xs mt-0.5">AI-generated</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleFile({ name: 'ipd_data_May_12.xlsx' })}
                className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors text-sm"
              >
                ✨ Load Demo Dataset
              </button>
            </>
          )}

          {phase === 'uploading' && (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📤</div>
              <p className="text-white font-semibold mb-1">{fileName}</p>
              <p className="text-slate-400 text-sm mb-5">Uploading file…</p>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-slate-400 text-xs mt-2">{progress}%</p>
            </div>
          )}

          {phase === 'processing' && (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm">AI Processing</p>
                  <p className="text-blue-300 text-xs">{STEPS[stepIdx]?.label}…</p>
                </div>
              </div>

              <div className="w-full bg-white/10 rounded-full h-1.5 mb-5">
                <div
                  className="h-1.5 rounded-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="space-y-2">
                {STEPS.map((step, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                      i < stepIdx ? 'bg-green-500 text-white' :
                      i === stepIdx ? 'bg-blue-500 text-white animate-pulse' :
                      'bg-white/10 text-slate-500'
                    }`}>
                      {i < stepIdx ? '✓' : i + 1}
                    </span>
                    <span className={`text-sm ${
                      i < stepIdx ? 'text-green-400' :
                      i === stepIdx ? 'text-white' : 'text-slate-500'
                    }`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === 'done' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Analysis Complete</h3>
              <p className="text-slate-400 text-sm mb-6">20 patients processed · AI insights ready</p>
              <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                <div className="bg-red-500/20 rounded-lg p-2">
                  <p className="text-red-400 font-bold text-xl">6</p>
                  <p className="text-slate-400 text-xs">Critical</p>
                </div>
                <div className="bg-orange-500/20 rounded-lg p-2">
                  <p className="text-orange-400 font-bold text-xl">9</p>
                  <p className="text-slate-400 text-xs">High Risk</p>
                </div>
                <div className="bg-green-500/20 rounded-lg p-2">
                  <p className="text-green-400 font-bold text-xl">5</p>
                  <p className="text-slate-400 text-xs">Stable</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/worklist')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
              >
                View Admission Dashboard →
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Docstribe AI · Admission Intelligence Platform
        </p>
      </div>
    </div>
  )
}
