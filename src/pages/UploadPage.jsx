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

const FEATURES = [
  { icon: '🎯', label: 'Risk Scoring', desc: 'AI-weighted 1–10 score' },
  { icon: '🏷️', label: 'ICD-10 Codes', desc: 'Auto-mapped diagnoses' },
  { icon: '💰', label: 'Revenue Est.', desc: 'Per-patient projections' },
  { icon: '⚠️', label: 'Red Flags', desc: 'Critical signal detection' },
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
    if (idx >= STEPS.length) { setPhase('done'); return }
    setStepIdx(idx)
    const totalMs = STEPS.slice(0, idx + 1).reduce((s, st) => s + st.duration, 0)
    const totalAll = STEPS.reduce((s, st) => s + st.duration, 0)
    setTimeout(() => {
      setProgress(Math.round((totalMs / totalAll) * 100))
      setTimeout(() => runSteps(idx + 1), STEPS[idx].duration)
    }, 80)
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col">
      {/* Top nav bar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">D</div>
          <span className="text-white font-semibold text-sm">Docstribe AI</span>
        </div>
        <span className="text-slate-500 text-xs">Admission Intelligence Platform · v1.0</span>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">

          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-300 text-xs font-medium tracking-wide uppercase">Powered by Claude AI</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              Admission Intelligence
            </h1>
            <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed">
              Upload hospital patient data and get AI-driven clinical insights, risk scores, and admission recommendations instantly.
            </p>
          </div>

          {/* Main card */}
          <div className="bg-white/[0.04] backdrop-blur border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

            {phase === 'idle' && (
              <div className="p-8">
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
                  onClick={() => fileRef.current.click()}
                  className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? 'border-blue-400 bg-blue-500/10'
                      : 'border-white/15 hover:border-blue-400/50 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <p className="text-white font-semibold mb-1">Drop your Excel file here</p>
                  <p className="text-slate-500 text-sm">or click to browse &nbsp;·&nbsp; .xlsx / .xls supported</p>
                  <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={e => handleFile(e.target.files[0])} />
                </div>

                {/* Feature grid */}
                <div className="grid grid-cols-4 gap-3 mt-6">
                  {FEATURES.map(f => (
                    <div key={f.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
                      <span className="text-xl">{f.icon}</span>
                      <p className="text-white text-xs font-medium mt-1.5">{f.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{f.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-slate-600 text-xs">or</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                <button
                  onClick={() => handleFile({ name: 'ipd_data_May_12.xlsx' })}
                  className="mt-4 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold transition-colors text-sm tracking-wide"
                >
                  ✨ &nbsp;Load Demo Dataset
                </button>
              </div>
            )}

            {phase === 'uploading' && (
              <div className="p-8 text-center">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📤</span>
                </div>
                <p className="text-white font-semibold mb-1">{fileName}</p>
                <p className="text-slate-400 text-sm mb-6">Uploading to secure processing environment…</p>
                <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                  <div className="h-1.5 rounded-full bg-blue-500 transition-all duration-100" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-slate-500 text-xs">{progress}%</p>
              </div>
            )}

            {phase === 'processing' && (
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/10">
                  <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold">Claude AI Processing</p>
                    <p className="text-blue-300 text-sm">{STEPS[stepIdx]?.label}…</p>
                  </div>
                  <span className="ml-auto text-blue-400 font-bold text-lg">{progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1 mb-6">
                  <div className="h-1 rounded-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <div className="space-y-2.5">
                  {STEPS.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-semibold transition-all ${
                        i < stepIdx ? 'bg-green-500 text-white' :
                        i === stepIdx ? 'bg-blue-500 text-white' :
                        'bg-white/10 text-slate-600'
                      }`}>
                        {i < stepIdx ? '✓' : i + 1}
                      </span>
                      <span className={`text-sm transition-colors ${
                        i < stepIdx ? 'text-green-400' :
                        i === stepIdx ? 'text-white font-medium' : 'text-slate-600'
                      }`}>{step.label}</span>
                      {i === stepIdx && <span className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {phase === 'done' && (
              <div className="p-8 text-center">
                <div className="w-14 h-14 bg-green-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Analysis Complete</h3>
                <p className="text-slate-400 text-sm mb-6">20 patients processed · AI insights ready</p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { count: '6', label: 'Critical', color: 'bg-red-500/15 text-red-400 border-red-500/20' },
                    { count: '9', label: 'High Risk', color: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
                    { count: '5', label: 'Stable', color: 'bg-green-500/15 text-green-400 border-green-500/20' },
                  ].map(s => (
                    <div key={s.label} className={`border rounded-xl p-3 ${s.color}`}>
                      <p className="text-2xl font-bold">{s.count}</p>
                      <p className="text-xs mt-0.5 opacity-80">{s.label}</p>
                    </div>
                  ))}
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

          <p className="text-center text-slate-700 text-xs mt-6">
            Docstribe AI · Clinical data processed securely · Not for diagnostic use
          </p>
        </div>
      </div>
    </div>
  )
}
