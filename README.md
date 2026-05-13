# Docstribe AI — Admission Intelligence Dashboard

A clinical AI system that transforms raw hospital patient data into structured admission intelligence — risk scores, ICD-10 codes, red flags, treatment pathways, revenue estimates, and more.

**Live Demo:** https://docstribe-ai-liart.vercel.app

---

## What It Does

Hospitals receive hundreds of patient records daily with unstructured clinical notes. This system uses Claude AI (Anthropic) to parse those notes and generate actionable admission intelligence for clinical and operational teams.

**Upload** an Excel file → **AI processes** each patient → **Dashboard** shows prioritised worklist with deep clinical profiles.

---

## Key Features

### Upload Page
- Drag & drop Excel file upload
- Simulated AI processing with step-by-step progress (parsing → ICD-10 inference → risk scoring → revenue estimation)
- One-click demo dataset loader

### Admission Worklist
- All patients ranked by AI-assigned risk score
- Filter by: Risk category (Critical / High / Medium / Low), Admission type (Emergency / Urgent / Elective), Department
- Live search across name, ID, diagnosis, department
- Stats strip: total patients, critical count, avg LOS, estimated revenue
- Risk cohort sidebar for quick navigation
- Each row shows: diagnosis, ICD-10 code, risk badge, bed type, revenue, red flag count

### Patient Profile Page
- **Clinical Summary** — diagnosis, ICD-10, history, comorbidities, symptoms, case type
- **Red Flags** — AI-extracted clinical warning signals with progression narrative
- **Clinical Timeline** — day-by-day treatment plan from admission to discharge
- **Treatment Plan** — recommended + secondary treatment, readmission/dropout risk
- **Risk Analysis** — score bar (1–10), AI reasoning, data completeness
- **Operational Details** — revenue, LOS, bed type, inferred procedure name
- **AI Rationale** — model's reasoning with confidence score

---

## AI Inference Logic

Each patient record is sent to **Claude Haiku** with a structured prompt. The model returns a JSON object containing:

| Field | How it's generated |
|-------|-------------------|
| `risk_score` (1–10) | Signal-weighted: vitals, labs, acuity, comorbidities, age |
| `risk_category` | Critical / High / Medium / Low mapped from score |
| `primary_diagnosis` | Inferred from clinical note + department context |
| `icd10_code` | ICD-10-CM code mapped to inferred diagnosis |
| `red_flags` | Specific clinical signals extracted from notes |
| `clinical_timeline` | Day-by-day care pathway for the diagnosis |
| `best_treatment` | Evidence-based first-line treatment |
| `expected_revenue` | Estimated from procedure complexity + LOS |
| `estimated_los_days` | Evidence-based average for diagnosis + severity |
| `readmission_risk` | Based on chronicity, compliance signals, social factors |
| `confidence_score` | Model self-assessed based on data completeness |

See [docs/ai-inference-logic.md](docs/ai-inference-logic.md) for full details.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| AI Model | Claude Haiku (claude-haiku-4-5-20251001) |
| AI SDK | Anthropic Python SDK |
| Data Pipeline | Python + pandas |
| Deployment | Vercel |

---

## Architecture

```
Excel File (466 patient records)
        ↓
pipeline/process_patients.py
        ↓  Claude Haiku API — one call per patient
pipeline/output/patients.json  (20 representative patients)
        ↓  copied to
src/data/patients.json
        ↓  bundled at build time
React SPA → Vercel (static, no backend needed)
```

**Why no backend/database?**
AI inference runs offline once (pre-computation pattern). The React app reads static JSON — instant load, zero infrastructure, works anywhere. See [docs/architecture-notes.md](docs/architecture-notes.md).

---

## Project Structure

```
DocstribeAI/
├── pipeline/
│   ├── process_patients.py       # AI pipeline: Excel → patients.json
│   ├── prompt_template.py        # Claude system prompt + patient prompt builder
│   └── output/patients.json      # Generated AI output
├── src/
│   ├── data/patients.json        # Bundled for React
│   ├── pages/
│   │   ├── UploadPage.jsx        # Upload + processing animation
│   │   ├── WorklistPage.jsx      # Admission worklist
│   │   └── PatientProfilePage.jsx
│   ├── components/
│   │   ├── worklist/             # StatsStrip, WorklistHeader, PatientRow, CohortSidebar
│   │   ├── profile/              # ProfileHeader, ClinicalSummaryCard, RedFlagsCard,
│   │   │                         # ClinicalTimeline, TreatmentCard, RiskCard,
│   │   │                         # OperationalCard, AIRationaleCard
│   │   └── shared/               # RiskBadge, FilterChip, LoadingSpinner
│   ├── hooks/
│   │   ├── usePatients.js        # Filter + search logic
│   │   └── usePatientById.js     # Single patient lookup
│   └── utils/
│       ├── riskColors.js         # Risk category → Tailwind class mapping
│       └── formatters.js         # Currency, date, LOS formatters
├── docs/
│   ├── ai-inference-logic.md     # Full AI scoring methodology
│   ├── architecture-notes.md     # Design decisions + data flow
│   └── assumptions.md            # Scope, limitations, trade-offs
└── vercel.json                   # SPA routing config
```

---

## Run Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173
```

To regenerate patient data with the AI pipeline:
```bash
cd pipeline
pip3 install anthropic pandas openpyxl
ANTHROPIC_API_KEY=your_key python3 process_patients.py
```

---

## Documentation

- [AI Inference Logic](docs/ai-inference-logic.md) — risk scoring methodology, prompt design, confidence scoring
- [Architecture Notes](docs/architecture-notes.md) — why this stack, data flow, component tree
- [Assumptions & Design Decisions](docs/assumptions.md) — scope boundaries, trade-offs, out-of-scope items
