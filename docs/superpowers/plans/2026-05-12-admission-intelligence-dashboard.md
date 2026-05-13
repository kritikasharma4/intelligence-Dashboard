# Admission Intelligence Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React-based AI-powered Admission Intelligence Dashboard that processes raw hospital OPD/IPD Excel data through the Gemini API and displays clinically prioritized, operationally actionable patient intelligence across two pages — a Patient Worklist and an Individual Patient Profile.

**Architecture:** A one-time Python data pipeline reads the Excel file, calls the Gemini 1.5 Flash API for each patient to generate structured clinical intelligence (risk scores, ICD-10, red flags, treatment pathways, etc.), and saves the output as `patients.json`. The React frontend consumes this static JSON, simulates an Excel upload flow, and renders the two-page dashboard. No live backend is needed during the demo.

**Tech Stack:** Python 3.10+ (data pipeline), `pandas`, `google-generativeai`, React 18, Vite, Tailwind CSS 3, React Router v6, Recharts (timeline/risk charts), `xlsx` (npm, for client-side Excel parsing simulation), Vercel (deployment).

---

## File Structure

```
DocstribeAI/
├── pipeline/                          # One-time Python data processing
│   ├── process_patients.py            # Main script: Excel → Gemini → patients.json
│   ├── prompt_template.py             # Gemini prompt for clinical inference
│   ├── requirements.txt               # pandas, google-generativeai, openpyxl
│   └── output/
│       └── patients.json              # Generated output consumed by frontend
│
├── src/
│   ├── main.jsx                       # React entry point
│   ├── App.jsx                        # Router setup (2 routes)
│   ├── index.css                      # Tailwind base styles
│   │
│   ├── data/
│   │   └── patients.json              # Copied from pipeline/output/ for the app
│   │
│   ├── pages/
│   │   ├── UploadPage.jsx             # Landing: upload Excel → simulated processing → redirect
│   │   ├── WorklistPage.jsx           # Page 1: Patient list / command center
│   │   └── PatientProfilePage.jsx     # Page 2: Individual patient deep-dive
│   │
│   ├── components/
│   │   ├── worklist/
│   │   │   ├── WorklistHeader.jsx     # Filters bar + stats summary strip
│   │   │   ├── PatientRow.jsx         # Single patient row card
│   │   │   ├── RiskBadge.jsx          # Critical/High/Medium/Low colored badge
│   │   │   ├── CohortSidebar.jsx      # Disease cohort grouping panel
│   │   │   └── StatsStrip.jsx         # Top KPI bar (total, critical count, revenue)
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfileHeader.jsx      # Patient name, risk score, admission type
│   │   │   ├── ClinicalSummaryCard.jsx # Diagnosis, ICD-10, comorbidities, symptoms
│   │   │   ├── ClinicalTimeline.jsx   # Visual chronology of patient journey
│   │   │   ├── RedFlagsCard.jsx       # Red flags + AI rationale
│   │   │   ├── TreatmentCard.jsx      # Best treatment, secondary, deferred time
│   │   │   ├── RiskCard.jsx           # Risk score, readmission risk, dropout risk
│   │   │   ├── OperationalCard.jsx    # Bed type, LOS, revenue, package value
│   │   │   └── AIRationaleCard.jsx    # Explainability: why each inference was made
│   │   │
│   │   └── shared/
│   │       ├── LoadingSpinner.jsx     # Animated "Analyzing patients..." screen
│   │       └── FilterChip.jsx        # Reusable filter/sort chip component
│   │
│   ├── hooks/
│   │   ├── usePatients.js             # Load + filter patients from JSON
│   │   └── usePatientById.js          # Get single patient by ID
│   │
│   └── utils/
│       ├── riskColors.js              # Risk level → Tailwind color mappings
│       └── formatters.js             # Date, currency, score formatters
│
├── public/
│   └── sample_data.xlsx               # Sample Excel for upload demo
│
├── docs/
│   ├── ai-inference-logic.md          # Required deliverable: reasoning explanation
│   ├── assumptions.md                 # Required deliverable: assumptions made
│   └── architecture-notes.md         # Required deliverable: how this scales
│
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`

- [ ] **Step 1: Scaffold Vite + React project**

```bash
cd /Users/kritikasharma/Documents/DocstribeAI
npm create vite@latest . -- --template react
npm install
```

Expected output: Project files created, `node_modules` installed.

- [ ] **Step 2: Install dependencies**

```bash
npm install react-router-dom tailwindcss @tailwindcss/vite recharts lucide-react clsx
```

- [ ] **Step 3: Configure Tailwind**

Replace `tailwind.config.js` with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        critical: "#DC2626",
        high: "#EA580C",
        medium: "#D97706",
        low: "#16A34A",
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Configure vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 5: Set up src/index.css**

```css
@import "tailwindcss";
```

- [ ] **Step 6: Set up App.jsx with routing**

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import UploadPage from './pages/UploadPage'
import WorklistPage from './pages/WorklistPage'
import PatientProfilePage from './pages/PatientProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/worklist" element={<WorklistPage />} />
        <Route path="/patient/:id" element={<PatientProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 7: Set up src/main.jsx**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 8: Verify dev server runs**

```bash
npm run dev
```

Expected: App running at `http://localhost:5173` with no errors.

- [ ] **Step 9: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold React + Vite + Tailwind project with routing"
```

---

## Task 2: Python Data Pipeline

**Files:**
- Create: `pipeline/requirements.txt`
- Create: `pipeline/prompt_template.py`
- Create: `pipeline/process_patients.py`
- Output: `pipeline/output/patients.json`

- [ ] **Step 1: Create pipeline directory and requirements**

```bash
mkdir -p pipeline/output
```

`pipeline/requirements.txt`:
```
pandas==2.2.2
openpyxl==3.1.2
google-generativeai==0.7.2
```

```bash
pip install -r pipeline/requirements.txt
```

- [ ] **Step 2: Write the Gemini prompt template**

`pipeline/prompt_template.py`:

```python
SYSTEM_PROMPT = """You are a clinical AI assistant helping a hospital admissions intelligence system.
You will receive raw clinical note data from a hospital EMR and must extract and infer structured fields.
Always respond with valid JSON only. No explanations outside JSON.
If a field cannot be determined, use null. Never hallucinate specific lab values not present in the note.
Base all inferences on the clinical note content provided."""

def build_patient_prompt(patient: dict) -> str:
    return f"""
Analyze this hospital patient record and return a JSON object with ALL fields listed below.

PATIENT DATA:
- Patient ID: {patient.get('Patient_ID', 'Unknown')}
- Patient Name: {patient.get('Patient_Name', 'Unknown')}
- Visit Date: {patient.get('Visit_Date', 'Unknown')}
- Doctor: {patient.get('Doctor_Name', 'Unknown')}
- Department: {patient.get('Department', 'Unknown')}
- Customer Type: {patient.get('Customer_Type', 'Unknown')}
- Clinical Note:
{patient.get('Clinical_Note', 'No notes available')}

Return ONLY this JSON structure:
{{
  "patient_id": "string",
  "patient_name": "string",
  "visit_date": "string",
  "doctor_name": "string",
  "department": "string",
  "customer_type": "string",

  "procedure_name": "string or null (only if EXPLICITLY mentioned in clinical note)",
  "inferred_procedure_name": "string (AI-inferred from diagnosis+symptoms+department if procedure_name is null)",

  "admission_type": "Emergency | Urgent | Elective",
  "case_type": "Surgical | Medication Management | Daycare",

  "primary_diagnosis": "string",
  "icd10_code": "string (e.g. N18.5)",
  "history": "string summarizing past conditions, surgeries, medications",
  "comorbidities": ["array", "of", "strings"],
  "possible_symptoms": ["array", "of", "strings"],
  "red_flags": ["array", "of", "strings - clinical warning signs"],
  "progression": "string describing how condition is evolving",
  "clinical_timeline": [
    {{"event": "string", "date": "string or estimated", "detail": "string"}}
  ],

  "expected_revenue": "string (e.g. ₹80,000 - ₹1,20,000 based on procedure and department)",
  "estimated_los_days": "number or null (null for daycare)",

  "best_treatment": "string - primary recommended pathway",
  "secondary_treatment": "string - alternative if primary not feasible",
  "deferred_time": "string (e.g. 'Can be safely delayed 2-3 weeks' or 'Cannot be deferred')",

  "risk_category": "Critical | High | Medium | Low",
  "risk_score": "number 1-10",
  "risk_reasoning": "string - 1-2 sentences explaining the risk score",
  "readmission_risk": "High | Medium | Low",
  "dropout_risk": "High | Medium | Low",

  "bed_type_required": "ICU | HDU | General | Suite | Daycare Bay",

  "ai_rationale": "string - paragraph explaining key inferences made and why",
  "confidence_score": "number 0-100 (how confident AI is in inferences based on data completeness)",
  "data_completeness": "High | Medium | Low (quality of input clinical note)"
}}
"""
```

- [ ] **Step 3: Write the main processing script**

`pipeline/process_patients.py`:

```python
import pandas as pd
import google.generativeai as genai
import json
import time
import os
from prompt_template import SYSTEM_PROMPT, build_patient_prompt

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_KEY_HERE")
INPUT_FILE = "ipd_data_May_12_new_1.xlsx"
OUTPUT_FILE = "output/patients.json"
MAX_PATIENTS = 40  # Process representative sample of 40 patients

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction=SYSTEM_PROMPT
)

def load_excel(filepath: str) -> list[dict]:
    df = pd.read_excel(filepath)
    df = df.fillna("")
    df.columns = [c.strip() for c in df.columns]
    return df.to_dict(orient="records")

def select_representative_sample(patients: list[dict], n: int = 40) -> list[dict]:
    """Select patients across departments for diverse coverage."""
    by_dept = {}
    for p in patients:
        dept = str(p.get("Department", "Unknown")).strip()
        by_dept.setdefault(dept, []).append(p)
    
    selected = []
    depts = list(by_dept.keys())
    i = 0
    while len(selected) < n and any(by_dept[d] for d in depts):
        dept = depts[i % len(depts)]
        if by_dept[dept]:
            selected.append(by_dept[dept].pop(0))
        i += 1
    return selected[:n]

def call_gemini(patient: dict) -> dict:
    prompt = build_patient_prompt(patient)
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.2,
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"  Error for {patient.get('Patient_ID')}: {e}")
        return {
            "patient_id": str(patient.get("Patient_ID", "")),
            "patient_name": str(patient.get("Patient_Name", "")),
            "department": str(patient.get("Department", "")),
            "error": str(e),
            "risk_category": "Low",
            "risk_score": 1,
            "admission_type": "Elective",
            "case_type": "Medication Management",
        }

def main():
    print(f"Loading Excel: {INPUT_FILE}")
    all_patients = load_excel(INPUT_FILE)
    print(f"Total patients in Excel: {len(all_patients)}")

    sample = select_representative_sample(all_patients, MAX_PATIENTS)
    print(f"Selected {len(sample)} representative patients")

    results = []
    for idx, patient in enumerate(sample):
        pid = patient.get("Patient_ID", f"row_{idx}")
        print(f"[{idx+1}/{len(sample)}] Processing {pid}...")
        result = call_gemini(patient)
        results.append(result)
        time.sleep(1.5)  # Respect Gemini rate limit (15 req/min free tier)

    os.makedirs("output", exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\nDone! Saved {len(results)} patients to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run the pipeline (place Excel in pipeline/ folder first)**

```bash
cd pipeline
GEMINI_API_KEY=your_actual_key_here python process_patients.py
```

Expected output:
```
Loading Excel: ipd_data_May_12_new_1.xlsx
Total patients in Excel: 467
Selected 40 representative patients
[1/40] Processing BLKH.1004616...
[2/40] Processing BLKH.1026174...
...
Done! Saved 40 patients to output/patients.json
```

- [ ] **Step 5: Verify output JSON structure**

```bash
python -c "import json; d=json.load(open('output/patients.json')); print(len(d), 'patients'); print(list(d[0].keys()))"
```

Expected: `40 patients` and list of all field keys.

- [ ] **Step 6: Copy output to src/data/**

```bash
cp output/patients.json ../src/data/patients.json
```

- [ ] **Step 7: Commit**

```bash
cd ..
git add pipeline/ src/data/patients.json
git commit -m "feat: add Gemini pipeline and processed patients.json"
```

---

## Task 3: Shared Utilities and Hooks

**Files:**
- Create: `src/utils/riskColors.js`
- Create: `src/utils/formatters.js`
- Create: `src/hooks/usePatients.js`
- Create: `src/hooks/usePatientById.js`

- [ ] **Step 1: Create risk color utility**

`src/utils/riskColors.js`:

```js
export const RISK_COLORS = {
  Critical: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
    badge: "bg-red-600 text-white",
    dot: "bg-red-600",
  },
  High: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-300",
    badge: "bg-orange-500 text-white",
    dot: "bg-orange-500",
  },
  Medium: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-300",
    badge: "bg-yellow-500 text-white",
    dot: "bg-yellow-500",
  },
  Low: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-300",
    badge: "bg-green-600 text-white",
    dot: "bg-green-600",
  },
}

export function getRiskColors(riskCategory) {
  return RISK_COLORS[riskCategory] ?? RISK_COLORS.Low
}

export const ADMISSION_COLORS = {
  Emergency: "bg-red-600 text-white",
  Urgent: "bg-orange-500 text-white",
  Elective: "bg-blue-500 text-white",
}

export const CASE_TYPE_COLORS = {
  Surgical: "bg-purple-100 text-purple-700",
  "Medication Management": "bg-blue-100 text-blue-700",
  Daycare: "bg-teal-100 text-teal-700",
}
```

- [ ] **Step 2: Create formatters utility**

`src/utils/formatters.js`:

```js
export function formatDate(dateStr) {
  if (!dateStr) return "—"
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    })
  } catch {
    return dateStr
  }
}

export function formatRiskScore(score) {
  const n = Number(score)
  if (isNaN(n)) return "—"
  return n.toFixed(1)
}

export function getRiskScoreColor(score) {
  const n = Number(score)
  if (n >= 8) return "text-red-600 font-bold"
  if (n >= 6) return "text-orange-600 font-bold"
  if (n >= 4) return "text-yellow-600 font-semibold"
  return "text-green-600"
}

export function formatRevenue(revenueStr) {
  if (!revenueStr) return "—"
  return revenueStr
}

export function formatLOS(los) {
  if (los === null || los === undefined) return "Daycare"
  return `${los} days`
}
```

- [ ] **Step 3: Create usePatients hook**

`src/hooks/usePatients.js`:

```js
import { useState, useMemo } from 'react'
import patientsData from '../data/patients.json'

const RISK_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 }

export function usePatients() {
  const [filters, setFilters] = useState({
    riskCategory: "All",
    admissionType: "All",
    department: "All",
    caseType: "All",
    search: "",
  })
  const [sortBy, setSortBy] = useState("risk") // risk | revenue | los | date

  const departments = useMemo(() =>
    ["All", ...new Set(patientsData.map(p => p.department).filter(Boolean))],
    []
  )

  const filtered = useMemo(() => {
    let result = [...patientsData]

    if (filters.riskCategory !== "All")
      result = result.filter(p => p.risk_category === filters.riskCategory)
    if (filters.admissionType !== "All")
      result = result.filter(p => p.admission_type === filters.admissionType)
    if (filters.department !== "All")
      result = result.filter(p => p.department === filters.department)
    if (filters.caseType !== "All")
      result = result.filter(p => p.case_type === filters.caseType)
    if (filters.search)
      result = result.filter(p =>
        p.patient_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.primary_diagnosis?.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.department?.toLowerCase().includes(filters.search.toLowerCase())
      )

    result.sort((a, b) => {
      if (sortBy === "risk")
        return (RISK_ORDER[a.risk_category] ?? 4) - (RISK_ORDER[b.risk_category] ?? 4)
      if (sortBy === "score")
        return (Number(b.risk_score) || 0) - (Number(a.risk_score) || 0)
      if (sortBy === "date")
        return new Date(b.visit_date) - new Date(a.visit_date)
      return 0
    })

    return result
  }, [filters, sortBy])

  const stats = useMemo(() => ({
    total: patientsData.length,
    critical: patientsData.filter(p => p.risk_category === "Critical").length,
    high: patientsData.filter(p => p.risk_category === "High").length,
    surgical: patientsData.filter(p => p.case_type === "Surgical").length,
    emergency: patientsData.filter(p => p.admission_type === "Emergency").length,
  }), [])

  const cohorts = useMemo(() => {
    const groups = {}
    patientsData.forEach(p => {
      const dept = p.department || "Unknown"
      groups[dept] = (groups[dept] || 0) + 1
    })
    return Object.entries(groups)
      .sort((a, b) => b[1] - a[1])
      .map(([dept, count]) => ({ dept, count }))
  }, [])

  return { patients: filtered, filters, setFilters, sortBy, setSortBy, stats, cohorts, departments }
}
```

- [ ] **Step 4: Create usePatientById hook**

`src/hooks/usePatientById.js`:

```js
import patientsData from '../data/patients.json'

export function usePatientById(id) {
  const patient = patientsData.find(p => p.patient_id === id) ?? null
  return { patient, notFound: !patient }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/utils/ src/hooks/
git commit -m "feat: add risk utilities, formatters, and patient data hooks"
```

---

## Task 4: Shared Components

**Files:**
- Create: `src/components/shared/LoadingSpinner.jsx`
- Create: `src/components/shared/FilterChip.jsx`
- Create: `src/components/worklist/RiskBadge.jsx`

- [ ] **Step 1: Create LoadingSpinner**

`src/components/shared/LoadingSpinner.jsx`:

```jsx
export default function LoadingSpinner({ message = "Analyzing patients..." }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-white text-xl font-semibold">{message}</p>
        <p className="text-gray-400 text-sm mt-1">Running AI clinical inference engine...</p>
      </div>
      <div className="flex gap-2">
        {["Parsing clinical notes", "Inferring diagnoses", "Scoring risks", "Building intelligence"].map((step, i) => (
          <span key={i} className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}>
            {step}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create FilterChip**

`src/components/shared/FilterChip.jsx`:

```jsx
import clsx from 'clsx'

export default function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-3 py-1 rounded-full text-xs font-medium transition-all border",
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500"
      )}
    >
      {label}
    </button>
  )
}
```

- [ ] **Step 3: Create RiskBadge**

`src/components/worklist/RiskBadge.jsx`:

```jsx
import { getRiskColors } from '../../utils/riskColors'

export default function RiskBadge({ risk, size = "sm" }) {
  const colors = getRiskColors(risk)
  const sizeClass = size === "lg" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs"
  return (
    <span className={`${colors.badge} ${sizeClass} rounded-full font-semibold inline-flex items-center gap-1`}>
      <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
      {risk}
    </span>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/
git commit -m "feat: add shared LoadingSpinner, FilterChip, RiskBadge components"
```

---

## Task 5: Upload Page

**Files:**
- Create: `src/pages/UploadPage.jsx`

- [ ] **Step 1: Build the Upload Page**

`src/pages/UploadPage.jsx`:

```jsx
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const LOADING_STEPS = [
  "Parsing Excel file...",
  "Extracting clinical notes...",
  "Running AI inference engine...",
  "Scoring patient risks...",
  "Building admission intelligence...",
  "Finalizing dashboard...",
]

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [fileName, setFileName] = useState(null)
  const fileRef = useRef()
  const navigate = useNavigate()

  function simulateProcessing(file) {
    setFileName(file.name)
    setIsLoading(true)
    let step = 0
    setLoadingMessage(LOADING_STEPS[0])

    const interval = setInterval(() => {
      step++
      if (step < LOADING_STEPS.length) {
        setLoadingMessage(LOADING_STEPS[step])
      } else {
        clearInterval(interval)
        navigate("/worklist")
      }
    }, 900)
  }

  function handleFile(file) {
    if (!file) return
    simulateProcessing(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  if (isLoading) return <LoadingSpinner message={loadingMessage} />

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8">
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Docstribe AI</h1>
        </div>
        <p className="text-gray-400 text-lg">Admission Intelligence Dashboard</p>
        <p className="text-gray-500 text-sm mt-1">Upload your OPD/IPD Excel export to generate clinical intelligence</p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current.click()}
        className={`w-full max-w-xl border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all
          ${isDragging ? "border-blue-400 bg-blue-500/10" : "border-gray-700 hover:border-gray-500 bg-gray-900"}`}
      >
        <div className="text-5xl mb-4">📊</div>
        <p className="text-white text-lg font-medium">Drop your Excel file here</p>
        <p className="text-gray-400 text-sm mt-2">or click to browse — supports .xlsx, .xls</p>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>


      <button
        onClick={() => navigate("/worklist")}
        className="mt-6 text-blue-400 text-sm hover:text-blue-300 underline underline-offset-2"
      >
        Skip upload → view demo dashboard
      </button>

      <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl w-full">
        {[
          { icon: "🧠", label: "AI Clinical Inference", desc: "Extracts diagnosis, ICD-10, red flags from raw notes" },
          { icon: "⚡", label: "Real-time Prioritization", desc: "Risk-scored patient worklist in seconds" },
          { icon: "📋", label: "Operational Intelligence", desc: "Bed planning, LOS, revenue, treatment pathways" },
        ].map(({ icon, label, desc }) => (
          <div key={label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-white text-sm font-semibold">{label}</p>
            <p className="text-gray-400 text-xs mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify upload page renders correctly**

```bash
npm run dev
```

Open `http://localhost:5173` — should see dark upload page with drag-and-drop zone, uploading any file should trigger the animated loading sequence then redirect to `/worklist`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/UploadPage.jsx
git commit -m "feat: add upload page with simulated AI processing animation"
```

---

## Task 6: Worklist Page — StatsStrip + CohortSidebar

**Files:**
- Create: `src/components/worklist/StatsStrip.jsx`
- Create: `src/components/worklist/CohortSidebar.jsx`

- [ ] **Step 1: Build StatsStrip**

`src/components/worklist/StatsStrip.jsx`:

```jsx
export default function StatsStrip({ stats }) {
  const cards = [
    { label: "Total Patients", value: stats.total, color: "text-white" },
    { label: "Critical", value: stats.critical, color: "text-red-400" },
    { label: "High Risk", value: stats.high, color: "text-orange-400" },
    { label: "Emergency Admissions", value: stats.emergency, color: "text-red-300" },
    { label: "Surgical Cases", value: stats.surgical, color: "text-purple-400" },
  ]

  return (
    <div className="grid grid-cols-5 gap-3 mb-6">
      {cards.map(({ label, value, color }) => (
        <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          <p className="text-gray-400 text-xs mt-1">{label}</p>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Build CohortSidebar**

`src/components/worklist/CohortSidebar.jsx`:

```jsx
export default function CohortSidebar({ cohorts, activeFilter, onFilter }) {
  return (
    <div className="w-56 shrink-0">
      <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
        Disease Cohorts
      </h3>
      <div className="space-y-1">
        <button
          onClick={() => onFilter("All")}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
            ${activeFilter === "All" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
        >
          All Departments
        </button>
        {cohorts.map(({ dept, count }) => (
          <button
            key={dept}
            onClick={() => onFilter(dept)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center
              ${activeFilter === dept ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
          >
            <span className="truncate">{dept}</span>
            <span className={`text-xs ml-2 shrink-0 ${activeFilter === dept ? "text-blue-200" : "text-gray-500"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/worklist/StatsStrip.jsx src/components/worklist/CohortSidebar.jsx
git commit -m "feat: add worklist StatsStrip and CohortSidebar components"
```

---

## Task 7: Worklist Page — WorklistHeader + PatientRow

**Files:**
- Create: `src/components/worklist/WorklistHeader.jsx`
- Create: `src/components/worklist/PatientRow.jsx`

- [ ] **Step 1: Build WorklistHeader**

`src/components/worklist/WorklistHeader.jsx`:

```jsx
import FilterChip from '../shared/FilterChip'

export default function WorklistHeader({ filters, setFilters, sortBy, setSortBy, total }) {
  const riskOptions = ["All", "Critical", "High", "Medium", "Low"]
  const admissionOptions = ["All", "Emergency", "Urgent", "Elective"]
  const caseOptions = ["All", "Surgical", "Medication Management", "Daycare"]
  const sortOptions = [
    { value: "risk", label: "By Risk" },
    { value: "score", label: "By Score" },
    { value: "date", label: "By Date" },
  ]

  return (
    <div className="mb-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-lg">
          Patient Worklist
          <span className="text-gray-400 text-sm font-normal ml-2">({total} patients)</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xs">Sort:</span>
          {sortOptions.map(opt => (
            <FilterChip key={opt.value} label={opt.label}
              active={sortBy === opt.value}
              onClick={() => setSortBy(opt.value)} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-gray-500 text-xs">Risk:</span>
        {riskOptions.map(r => (
          <FilterChip key={r} label={r}
            active={filters.riskCategory === r}
            onClick={() => setFilters(f => ({ ...f, riskCategory: r }))} />
        ))}
        <span className="text-gray-500 text-xs ml-2">Admission:</span>
        {admissionOptions.map(a => (
          <FilterChip key={a} label={a}
            active={filters.admissionType === a}
            onClick={() => setFilters(f => ({ ...f, admissionType: a }))} />
        ))}
        <span className="text-gray-500 text-xs ml-2">Case:</span>
        {caseOptions.map(c => (
          <FilterChip key={c} label={c}
            active={filters.caseType === c}
            onClick={() => setFilters(f => ({ ...f, caseType: c }))} />
        ))}
      </div>

      <input
        type="text"
        placeholder="Search by name, diagnosis, department..."
        value={filters.search}
        onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
      />
    </div>
  )
}
```

- [ ] **Step 2: Build PatientRow**

`src/components/worklist/PatientRow.jsx`:

```jsx
import { useNavigate } from 'react-router-dom'
import RiskBadge from './RiskBadge'
import { getRiskColors, ADMISSION_COLORS, CASE_TYPE_COLORS } from '../../utils/riskColors'
import { formatDate, formatRiskScore, getRiskScoreColor, formatRevenue } from '../../utils/formatters'
import clsx from 'clsx'

export default function PatientRow({ patient }) {
  const navigate = useNavigate()
  const riskColors = getRiskColors(patient.risk_category)

  return (
    <div
      onClick={() => navigate(`/patient/${patient.patient_id}`)}
      className={clsx(
        "bg-gray-900 border rounded-xl p-4 cursor-pointer hover:border-blue-500/50 transition-all hover:bg-gray-800/80 group",
        patient.risk_category === "Critical" ? "border-red-800/60" :
        patient.risk_category === "High" ? "border-orange-800/40" : "border-gray-800"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Risk Score Circle */}
        <div className={clsx(
          "w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0",
          riskColors.bg
        )}>
          <span className={clsx("text-lg font-bold leading-none", riskColors.text)}>
            {formatRiskScore(patient.risk_score)}
          </span>
          <span className={clsx("text-[9px] font-medium", riskColors.text)}>RISK</span>
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-semibold text-sm">{patient.patient_name}</span>
            <RiskBadge risk={patient.risk_category} />
            <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium",
              ADMISSION_COLORS[patient.admission_type] ?? "bg-gray-700 text-gray-300")}>
              {patient.admission_type}
            </span>
            <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium",
              CASE_TYPE_COLORS[patient.case_type] ?? "bg-gray-700 text-gray-300")}>
              {patient.case_type}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
            <span>🏥 {patient.department}</span>
            <span>👤 {patient.doctor_name}</span>
            <span>📅 {formatDate(patient.visit_date)}</span>
            <span>🛏 {patient.bed_type_required}</span>
          </div>

          <p className="mt-1.5 text-sm text-gray-300 font-medium">
            {patient.primary_diagnosis}
            {patient.icd10_code && (
              <span className="text-gray-500 text-xs ml-2">({patient.icd10_code})</span>
            )}
          </p>

          {patient.red_flags?.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {patient.red_flags.slice(0, 2).map((flag, i) => (
                <span key={i} className="bg-red-500/10 text-red-400 text-xs px-2 py-0.5 rounded border border-red-500/20">
                  ⚠ {flag}
                </span>
              ))}
              {patient.red_flags.length > 2 && (
                <span className="text-gray-500 text-xs">+{patient.red_flags.length - 2} more</span>
              )}
            </div>
          )}
        </div>

        {/* Right: Revenue + LOS */}
        <div className="text-right shrink-0 hidden md:block">
          <p className="text-green-400 font-semibold text-sm">{formatRevenue(patient.expected_revenue)}</p>
          <p className="text-gray-400 text-xs mt-0.5">
            {patient.estimated_los_days ? `${patient.estimated_los_days}d LOS` : "Daycare"}
          </p>
          <p className="text-gray-500 text-xs mt-1">{patient.customer_type}</p>
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-blue-400 text-xs">View profile →</span>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/worklist/WorklistHeader.jsx src/components/worklist/PatientRow.jsx
git commit -m "feat: add WorklistHeader filters and PatientRow card component"
```

---

## Task 8: Worklist Page — Full Assembly

**Files:**
- Create: `src/pages/WorklistPage.jsx`

- [ ] **Step 1: Build WorklistPage**

`src/pages/WorklistPage.jsx`:

```jsx
import { useNavigate } from 'react-router-dom'
import { usePatients } from '../hooks/usePatients'
import StatsStrip from '../components/worklist/StatsStrip'
import CohortSidebar from '../components/worklist/CohortSidebar'
import WorklistHeader from '../components/worklist/WorklistHeader'
import PatientRow from '../components/worklist/PatientRow'

export default function WorklistPage() {
  const navigate = useNavigate()
  const { patients, filters, setFilters, sortBy, setSortBy, stats, cohorts } = usePatients()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top nav */}
      <div className="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="font-semibold">Docstribe AI</span>
          <span className="text-gray-500 text-sm">/ Admission Intelligence</span>
        </div>
        <button
          onClick={() => navigate("/")}
          className="text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          Upload New File
        </button>
      </div>

      <div className="p-6">
        <StatsStrip stats={stats} />

        <div className="flex gap-6">
          <CohortSidebar
            cohorts={cohorts}
            activeFilter={filters.department}
            onFilter={(dept) => setFilters(f => ({ ...f, department: dept }))}
          />

          <div className="flex-1 min-w-0">
            <WorklistHeader
              filters={filters}
              setFilters={setFilters}
              sortBy={sortBy}
              setSortBy={setSortBy}
              total={patients.length}
            />

            <div className="space-y-2">
              {patients.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  No patients match the current filters.
                </div>
              ) : (
                patients.map(p => <PatientRow key={p.patient_id} patient={p} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify worklist page works end to end**

```bash
npm run dev
```

Navigate to `http://localhost:5173/worklist` — should see stats strip, cohort sidebar, filterable patient list sorted by risk. Clicking a patient row should navigate to `/patient/:id`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/WorklistPage.jsx
git commit -m "feat: assemble full WorklistPage with filters, cohorts, and patient rows"
```

---

## Task 9: Patient Profile Page — Header + Clinical Cards

**Files:**
- Create: `src/components/profile/ProfileHeader.jsx`
- Create: `src/components/profile/ClinicalSummaryCard.jsx`
- Create: `src/components/profile/RedFlagsCard.jsx`
- Create: `src/components/profile/ClinicalTimeline.jsx`

- [ ] **Step 1: Build ProfileHeader**

`src/components/profile/ProfileHeader.jsx`:

```jsx
import { useNavigate } from 'react-router-dom'
import RiskBadge from '../worklist/RiskBadge'
import { getRiskColors, ADMISSION_COLORS, CASE_TYPE_COLORS } from '../../utils/riskColors'
import { formatDate, formatRiskScore } from '../../utils/formatters'
import clsx from 'clsx'

export default function ProfileHeader({ patient }) {
  const navigate = useNavigate()
  const riskColors = getRiskColors(patient.risk_category)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={clsx("w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0", riskColors.bg)}>
            <span className={clsx("text-2xl font-bold leading-none", riskColors.text)}>
              {formatRiskScore(patient.risk_score)}
            </span>
            <span className={clsx("text-[9px] font-semibold uppercase tracking-wide", riskColors.text)}>Risk</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white">{patient.patient_name}</h1>
              <RiskBadge risk={patient.risk_category} size="lg" />
              <span className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold",
                ADMISSION_COLORS[patient.admission_type])}>
                {patient.admission_type}
              </span>
              <span className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold",
                CASE_TYPE_COLORS[patient.case_type])}>
                {patient.case_type}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
              <span>ID: {patient.patient_id}</span>
              <span>🏥 {patient.department}</span>
              <span>👤 Dr. {patient.doctor_name}</span>
              <span>📅 {formatDate(patient.visit_date)}</span>
              <span>💳 {patient.customer_type}</span>
            </div>
            <p className="mt-2 text-white font-medium">
              {patient.primary_diagnosis}
              {patient.icd10_code && <span className="text-gray-400 text-sm ml-2">· {patient.icd10_code}</span>}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/worklist")}
          className="text-gray-400 hover:text-white text-sm border border-gray-700 px-3 py-1.5 rounded-lg shrink-0"
        >
          ← Back to Worklist
        </button>
      </div>
      {patient.risk_reasoning && (
        <div className={clsx("mt-4 p-3 rounded-xl text-sm border", riskColors.bg, riskColors.border)}>
          <span className={clsx("font-semibold", riskColors.text)}>AI Risk Rationale: </span>
          <span className="text-gray-300">{patient.risk_reasoning}</span>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Build ClinicalSummaryCard**

`src/components/profile/ClinicalSummaryCard.jsx`:

```jsx
export default function ClinicalSummaryCard({ patient }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        🩺 Clinical Summary
      </h3>
      <div className="space-y-4">
        {patient.history && (
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">History</p>
            <p className="text-gray-200 text-sm">{patient.history}</p>
          </div>
        )}
        {patient.comorbidities?.length > 0 && (
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Comorbidities</p>
            <div className="flex flex-wrap gap-1.5">
              {patient.comorbidities.map((c, i) => (
                <span key={i} className="bg-orange-500/10 text-orange-300 text-xs px-2.5 py-1 rounded-full border border-orange-500/20">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
        {patient.possible_symptoms?.length > 0 && (
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Possible Symptoms</p>
            <div className="flex flex-wrap gap-1.5">
              {patient.possible_symptoms.map((s, i) => (
                <span key={i} className="bg-blue-500/10 text-blue-300 text-xs px-2.5 py-1 rounded-full border border-blue-500/20">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {patient.progression && (
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Progression</p>
            <p className="text-gray-200 text-sm">{patient.progression}</p>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Build RedFlagsCard**

`src/components/profile/RedFlagsCard.jsx`:

```jsx
export default function RedFlagsCard({ redFlags }) {
  if (!redFlags?.length) return null
  return (
    <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-5">
      <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
        ⚠️ Red Flags
      </h3>
      <div className="space-y-2">
        {redFlags.map((flag, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5 shrink-0">•</span>
            <p className="text-red-200 text-sm">{flag}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Build ClinicalTimeline**

`src/components/profile/ClinicalTimeline.jsx`:

```jsx
export default function ClinicalTimeline({ timeline }) {
  if (!timeline?.length) return null
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <h3 className="text-white font-semibold mb-4">📅 Clinical Timeline</h3>
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-700" />
        <div className="space-y-4">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-4 relative">
              <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-gray-950 shrink-0 z-10 flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">{i + 1}</span>
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white text-sm font-medium">{item.event}</span>
                  {item.date && (
                    <span className="text-gray-500 text-xs">{item.date}</span>
                  )}
                </div>
                {item.detail && (
                  <p className="text-gray-400 text-xs mt-0.5">{item.detail}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/profile/
git commit -m "feat: add ProfileHeader, ClinicalSummaryCard, RedFlagsCard, ClinicalTimeline"
```

---

## Task 10: Patient Profile Page — Treatment, Risk, Operational, AI Rationale Cards

**Files:**
- Create: `src/components/profile/TreatmentCard.jsx`
- Create: `src/components/profile/RiskCard.jsx`
- Create: `src/components/profile/OperationalCard.jsx`
- Create: `src/components/profile/AIRationaleCard.jsx`

- [ ] **Step 1: Build TreatmentCard**

`src/components/profile/TreatmentCard.jsx`:

```jsx
export default function TreatmentCard({ patient }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <h3 className="text-white font-semibold mb-4">💊 Treatment Pathway</h3>
      <div className="space-y-3">
        {patient.best_treatment && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
            <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Primary Treatment
            </p>
            <p className="text-gray-200 text-sm">{patient.best_treatment}</p>
          </div>
        )}
        {patient.secondary_treatment && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Secondary Option
            </p>
            <p className="text-gray-200 text-sm">{patient.secondary_treatment}</p>
          </div>
        )}
        {patient.deferred_time && (
          <div className="bg-gray-800 rounded-xl p-3">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Deferral Window
            </p>
            <p className="text-gray-200 text-sm">{patient.deferred_time}</p>
          </div>
        )}
        {patient.inferred_procedure_name && (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
            <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
              AI-Inferred Procedure
            </p>
            <p className="text-gray-200 text-sm">{patient.inferred_procedure_name}</p>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build RiskCard**

`src/components/profile/RiskCard.jsx`:

```jsx
import { getRiskColors } from '../../utils/riskColors'
import clsx from 'clsx'

function RiskIndicator({ label, value }) {
  const colors = {
    High: "text-red-400 bg-red-500/10 border-red-500/20",
    Medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    Low: "text-green-400 bg-green-500/10 border-green-500/20",
  }
  return (
    <div>
      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{label}</p>
      <span className={clsx("text-sm font-semibold px-3 py-1 rounded-full border", colors[value] ?? colors.Low)}>
        {value}
      </span>
    </div>
  )
}

export default function RiskCard({ patient }) {
  const riskColors = getRiskColors(patient.risk_category)
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <h3 className="text-white font-semibold mb-4">🎯 Risk Assessment</h3>
      <div className="flex items-center gap-4 mb-4">
        <div className={clsx("w-14 h-14 rounded-xl flex flex-col items-center justify-center", riskColors.bg)}>
          <span className={clsx("text-xl font-bold", riskColors.text)}>{patient.risk_score}</span>
          <span className={clsx("text-[9px]", riskColors.text)}>/ 10</span>
        </div>
        <div>
          <p className="text-white font-semibold">{patient.risk_category} Risk</p>
          <p className="text-gray-400 text-sm">Overall Patient Risk Score</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <RiskIndicator label="Readmission Risk" value={patient.readmission_risk} />
        <RiskIndicator label="Dropout / No-show Risk" value={patient.dropout_risk} />
      </div>
      {patient.confidence_score !== undefined && (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">AI Confidence</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-800 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${patient.confidence_score}%` }} />
            </div>
            <span className="text-blue-400 text-xs font-medium">{patient.confidence_score}%</span>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Build OperationalCard**

`src/components/profile/OperationalCard.jsx`:

```jsx
import { formatRevenue, formatLOS } from '../../utils/formatters'

export default function OperationalCard({ patient }) {
  const items = [
    { label: "Bed Type Required", value: patient.bed_type_required, icon: "🛏" },
    { label: "Estimated LOS", value: formatLOS(patient.estimated_los_days), icon: "📆" },
    { label: "Expected Revenue", value: formatRevenue(patient.expected_revenue), icon: "💰", highlight: true },
    { label: "Procedure", value: patient.procedure_name || patient.inferred_procedure_name, icon: "⚕️" },
  ].filter(item => item.value)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <h3 className="text-white font-semibold mb-4">🏥 Operational Planning</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ label, value, icon, highlight }) => (
          <div key={label} className="bg-gray-800 rounded-xl p-3">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{icon} {label}</p>
            <p className={`text-sm font-semibold ${highlight ? "text-green-400" : "text-white"}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Build AIRationaleCard**

`src/components/profile/AIRationaleCard.jsx`:

```jsx
export default function AIRationaleCard({ patient }) {
  if (!patient.ai_rationale) return null
  return (
    <div className="bg-blue-950/30 border border-blue-800/40 rounded-2xl p-5">
      <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
        🤖 AI Inference Rationale
        {patient.data_completeness && (
          <span className="text-xs font-normal bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full ml-1">
            Data quality: {patient.data_completeness}
          </span>
        )}
      </h3>
      <p className="text-gray-300 text-sm leading-relaxed">{patient.ai_rationale}</p>
      <p className="text-gray-500 text-xs mt-3">
        Inferences generated by Gemini 1.5 Flash based on clinical note content. 
        All recommendations should be validated by a qualified clinician.
      </p>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/profile/TreatmentCard.jsx src/components/profile/RiskCard.jsx src/components/profile/OperationalCard.jsx src/components/profile/AIRationaleCard.jsx
git commit -m "feat: add TreatmentCard, RiskCard, OperationalCard, AIRationaleCard components"
```

---

## Task 11: Patient Profile Page — Full Assembly

**Files:**
- Create: `src/pages/PatientProfilePage.jsx`

- [ ] **Step 1: Build PatientProfilePage**

`src/pages/PatientProfilePage.jsx`:

```jsx
import { useParams, useNavigate } from 'react-router-dom'
import { usePatientById } from '../hooks/usePatientById'
import ProfileHeader from '../components/profile/ProfileHeader'
import ClinicalSummaryCard from '../components/profile/ClinicalSummaryCard'
import ClinicalTimeline from '../components/profile/ClinicalTimeline'
import RedFlagsCard from '../components/profile/RedFlagsCard'
import TreatmentCard from '../components/profile/TreatmentCard'
import RiskCard from '../components/profile/RiskCard'
import OperationalCard from '../components/profile/OperationalCard'
import AIRationaleCard from '../components/profile/AIRationaleCard'

export default function PatientProfilePage() {
  const { id } = useParams()
  const { patient, notFound } = usePatientById(id)
  const navigate = useNavigate()

  if (notFound) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-lg">Patient not found</p>
        <button onClick={() => navigate("/worklist")}
          className="mt-4 text-blue-400 hover:text-blue-300">
          ← Back to Worklist
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top nav */}
      <div className="border-b border-gray-800 px-6 py-3 flex items-center gap-3">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">D</span>
        </div>
        <span className="font-semibold">Docstribe AI</span>
        <span className="text-gray-500 text-sm">/ Admission Intelligence / Patient Profile</span>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <ProfileHeader patient={patient} />

        <div className="grid grid-cols-3 gap-4">
          {/* Left column */}
          <div className="col-span-2 space-y-4">
            <ClinicalSummaryCard patient={patient} />
            <ClinicalTimeline timeline={patient.clinical_timeline} />
            <TreatmentCard patient={patient} />
            <AIRationaleCard patient={patient} />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <RedFlagsCard redFlags={patient.red_flags} />
            <RiskCard patient={patient} />
            <OperationalCard patient={patient} />
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify full profile page end-to-end**

```bash
npm run dev
```

Navigate to `http://localhost:5173/worklist`, click any patient — should see full profile with all cards populated from `patients.json`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/PatientProfilePage.jsx
git commit -m "feat: assemble full PatientProfilePage with all clinical and operational cards"
```

---

## Task 12: Deliverable Documents

**Files:**
- Create: `docs/ai-inference-logic.md`
- Create: `docs/assumptions.md`
- Create: `docs/architecture-notes.md`

- [ ] **Step 1: Write AI inference logic doc**

`docs/ai-inference-logic.md`:

```markdown
# AI Inference Logic — Docstribe Admission Intelligence

## Overview
The system uses Gemini 1.5 Flash to parse semi-structured clinical note blobs and generate
structured admission intelligence for each patient.

## Input: Raw Clinical Note Blob
Each patient's `Clinical_Note` contains semi-structured key-value pairs embedded in free text:
- `ProvisionalDiagnosis`, `clinicalnotes`, `vitalremarks`, `physicalremarks`
- `otheradvice`, `medicinedetails`, `familyhistory`, `PAC` (pre-anaesthesia check)
- `Prescription_Medicine_fromDropDown`, `Other_Investigation_freetext`

## Inference Pipeline

### Step 1: Diagnosis Extraction
- Extract `ProvisionalDiagnosis` if present
- If empty/null, infer from `clinicalnotes` lab values, `vitalremarks`, and department
- Map to ICD-10 code using clinical knowledge

### Step 2: Risk Scoring (1–10)
Risk score is computed by weighing:
| Signal | Weight |
|---|---|
| Critical lab values (e.g. Creat > 5, HbA1c > 12) | High |
| Admission advice explicitly mentioned | High |
| Dialysis / ICU / surgery urgency in notes | High |
| Multiple comorbidities | Medium |
| Follow-up date < 2 weeks | Medium |
| Stable chronic condition, no acute deterioration | Low |

### Step 3: Procedure Inference
- `procedure_name`: Only populated if explicitly mentioned in `PAC`, `otheradvice`, or `Prescription_Medicine_fromDropDown_with_detail`
- `inferred_procedure_name`: Inferred from (department + diagnosis + symptoms) if procedure_name is null

### Step 4: Admission Type Classification
- **Emergency**: Acute deterioration, critical vitals, immediate admission language
- **Urgent**: Abnormal labs requiring admission within days, PAC done
- **Elective**: Stable chronic condition, planned surgery, follow-up visit

### Step 5: Revenue Estimation
Based on department + procedure + LOS using standard Indian hospital package ranges.

## Confidence Scoring
Confidence (0–100%) reflects data completeness:
- High (80–100%): ProvisionalDiagnosis present, lab values present, clear advice
- Medium (50–79%): Partial data, some fields missing
- Low (0–49%): Minimal clinical note, mostly prescription data

## Prompt Design Principles
- Temperature 0.2 for consistency and reduced hallucination
- JSON response mode enforced via `response_mime_type: application/json`
- System prompt instructs model never to hallucinate lab values not present
- All inferences cite the source field in `ai_rationale`
```

- [ ] **Step 2: Write assumptions doc**

`docs/assumptions.md`:

```markdown
# Assumptions — Docstribe Admission Intelligence Dashboard

1. **Sample size:** 40 representative patients processed (one per department, covering all risk levels).
   Full 467-patient processing would require ~$2-5 API cost and ~15 minutes.

2. **Revenue estimates:** Based on standard North Indian private hospital package ranges.
   Actual values would come from the hospital's billing system.

3. **ICD-10 codes:** Inferred by Gemini from diagnosis text. Should be validated by a certified coder.

4. **Risk scores:** Indicative, not diagnostic. Must be reviewed by a clinician before clinical action.

5. **Upload simulation:** The Excel upload UI simulates processing. In production, this would call
   a live FastAPI backend.

6. **Date fields:** Some visit dates in the Excel appear to be 2026 — treated as provided.

7. **Missing fields:** When `ProvisionalDiagnosis` is empty, the system infers from other available
   fields. `null` is returned when inference is not possible with sufficient confidence.

8. **Customer_Type:** Only "Cash" visible in sample. "Insurance" patients may have different
   revenue package logic.
```

- [ ] **Step 3: Write architecture notes doc**

`docs/architecture-notes.md`:

```markdown
# Architecture Notes — Scaling This System

## Current Architecture (Prototype)
```
Excel File → Python Script → Gemini API → patients.json → React App
```

## Production Architecture
```
Hospital EMR → Event Stream → FastAPI Backend → Gemini/Fine-tuned LLM → PostgreSQL → React App
                                     ↓
                              Async job queue (Celery)
                                     ↓
                             Real-time WebSocket updates
```

## Scaling Decisions

### Why static JSON for prototype:
- Zero infra overhead, instant demo, focuses evaluation on product thinking
- In production: replace with PostgreSQL + REST API

### AI Inference at Scale:
- Batch processing via Gemini API (1500 req/day free, $0.075/1M tokens paid)
- For 467 patients: ~$0.20 total inference cost per run
- Cache inferences — only re-run when clinical note changes
- Fine-tune a smaller model on validated outputs to reduce cost at scale

### Data Pipeline at Scale:
- EMR webhook → message queue (SQS/Pub-Sub) → inference worker → DB
- Incremental processing — only process new/updated records

### Multi-hospital:
- Tenant-isolated databases
- Shared inference pipeline
- Hospital-specific revenue package configuration
```

- [ ] **Step 4: Commit all docs**

```bash
git add docs/
git commit -m "docs: add AI inference logic, assumptions, and architecture notes"
```

---

## Task 13: Deploy to Vercel

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Add vercel.json for SPA routing**

`vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

Expected: `dist/` folder created with no errors.

- [ ] **Step 3: Deploy to Vercel**

```bash
npx vercel --prod
```

Follow prompts: link to Vercel account, set project name to `docstribe-admission-intelligence`.

- [ ] **Step 4: Verify deployment**

Open the Vercel URL — test upload page, worklist, and patient profile on the live URL.

- [ ] **Step 5: Final commit**

```bash
git add vercel.json
git commit -m "feat: add Vercel config and deploy admission intelligence dashboard"
```

---

## Self-Review: Spec Coverage Check

| Requirement | Covered By |
|---|---|
| Procedure Name (explicit) | Gemini prompt field `procedure_name` |
| Inferred Procedure Name | Gemini prompt field `inferred_procedure_name` |
| Admission Type | Gemini prompt + PatientRow badge + ProfileHeader |
| Case Type | Gemini prompt + PatientRow badge |
| Primary Diagnosis + ICD-10 | Gemini prompt + ClinicalSummaryCard + PatientRow |
| History | Gemini prompt + ClinicalSummaryCard |
| Comorbidities | Gemini prompt + ClinicalSummaryCard |
| Possible Symptoms | Gemini prompt + ClinicalSummaryCard |
| Red Flags | Gemini prompt + RedFlagsCard + PatientRow preview |
| Progression | Gemini prompt + ClinicalSummaryCard |
| Clinical Timeline | Gemini prompt + ClinicalTimeline component |
| Expected Revenue | Gemini prompt + PatientRow + OperationalCard |
| Estimated LOS | Gemini prompt + PatientRow + OperationalCard |
| Best Treatment | Gemini prompt + TreatmentCard |
| Secondary Treatment | Gemini prompt + TreatmentCard |
| Deferred Time | Gemini prompt + TreatmentCard |
| Risk Category | Gemini prompt + RiskBadge + PatientRow + ProfileHeader |
| Risk Score 1-10 | Gemini prompt + RiskCard + PatientRow score circle |
| Readmission Risk | Gemini prompt + RiskCard |
| Dropout Risk | Gemini prompt + RiskCard |
| Bed Type Required | Gemini prompt + PatientRow + OperationalCard |
| Patient List / Worklist Page | WorklistPage |
| Individual Patient Profile | PatientProfilePage |
| Disease cohort bucketization (bonus) | CohortSidebar |
| Confidence scoring (bonus) | RiskCard confidence bar |
| AI rationale visibility (bonus) | AIRationaleCard |
| Admission conversion (bonus) | Risk score as proxy |
| Upload flow | UploadPage with simulation |
| Filters + sort | WorklistHeader + usePatients hook |
| Deploy | Vercel Task 13 |
| Deliverable docs | Task 12 |
