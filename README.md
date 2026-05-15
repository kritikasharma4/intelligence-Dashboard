# Docstribe AI — Admission Intelligence Dashboard

A clinical AI system that transforms raw hospital patient data into structured admission intelligence — risk scores, ICD-10 codes, red flags, treatment pathways, revenue estimates, and more.

**Live Demo:** https://docstribe-ai-liart.vercel.app  
**GitHub:** https://github.com/kritikasharma4/intelligence-Dashboard

---

## What It Does

Hospitals receive hundreds of patient records daily with unstructured clinical notes. This system uses Claude AI (Anthropic) to parse those notes and generate actionable admission intelligence for clinical and operational teams.

**Upload** an Excel file → **AI processes** each patient → **Dashboard** shows a prioritised worklist with deep clinical profiles.

---

## Key Features

### Upload Page
- Drag & drop Excel file upload with file validation
- Simulated AI processing with step-by-step progress animation (parsing → ICD-10 inference → risk scoring → revenue estimation)
- One-click demo dataset loader

### Admission Worklist
- All patients ranked by AI-assigned risk score
- **Two view modes:** List (table) and Cohort (grouped by disease cohort)
- Filter by: Risk category · Admission type · Department · Free-text search
- **Action banner:** urgent alert strip when critical/time-critical patients are present — hides once filtered
- **Stats strip:** total patients, critical count, high risk count, surgical cases, avg LOS, estimated revenue — with revenue breakdown by insurance/cash/surgical pipeline
- **Risk cohort sidebar** for quick navigation (visible at 1024px+)
- Each row shows: patient name, risk trend (↑↓→), priority tags, diagnosis, ICD-10, risk badge, admission type, admission likelihood %, bed type, revenue, red flag count

### Disease Cohort View
- Groups patients by disease cohort: Cardiac, Respiratory, Neurological, Surgical, Metabolic, Oncology, Renal/Urology, Gastro/Hepatology, Obstetrics, Haematology, Infectious Disease, General Medicine
- Each cohort shows: patient count, critical case count, total cohort revenue
- Cohorts sorted by highest risk score descending
- Patient cards inside each cohort show all key fields at a glance

### Patient Profile Page
Right column (action-first order):
- **Next Action Card** — urgency level (Critical/High/Medium/Low), recommended clinical action, admission likelihood %, risk score
- **Risk Analysis** — score bar (1–10), risk category badge, AI reasoning, data completeness, readmission risk, dropout risk
- **Physician Sign-off** — approve or override AI-generated fields (diagnosis, ICD-10, treatment, admission type, bed type); status persists in localStorage
- **Operational Details** — expected revenue, estimated LOS, bed type, inferred procedure
- **AI Rationale** — model reasoning with confidence score bar and clinical disclaimer

Left column (clinical detail):
- **Clinical Summary** — diagnosis, ICD-10 with verified/unverified badge, history, comorbidities, symptoms, case type
- **Red Flags** — AI-extracted clinical warning signals with disease progression narrative
- **Clinical Timeline** — day-by-day events from admission to discharge
- **Treatment Plan** — recommended + secondary treatment pathway, deferred care window

---

## AI Inference Fields

Each patient record is sent to **Claude Haiku** (claude-haiku-4-5-20251001) with a structured prompt. The model returns a JSON object:

| Field | How it's generated |
|-------|-------------------|
| `risk_score` (1–10) | Signal-weighted: vitals, acuity, comorbidities, red flags |
| `risk_category` | Critical / High / Medium / Low mapped from score |
| `primary_diagnosis` | Inferred from clinical note + department context |
| `icd10_code` | ICD-10-CM code mapped to inferred diagnosis |
| `icd10_verified` | True if confidence ≥ 70, False otherwise — triggers UI badge |
| `red_flags` | Specific clinical warning signals extracted from notes |
| `clinical_timeline` | Day-by-day care pathway for the diagnosis |
| `best_treatment` | Evidence-based first-line treatment |
| `secondary_treatment` | Alternative if primary pathway not feasible |
| `deferred_time` | Whether care can be safely delayed and by how long |
| `expected_revenue` | Estimated from procedure complexity + LOS + department |
| `estimated_los_days` | Evidence-based average for diagnosis + severity |
| `readmission_risk` | Based on chronicity, compliance signals, social factors |
| `dropout_risk` | Likelihood patient leaves before completing admission |
| `confidence_score` | Model self-assessed based on data completeness |
| `ai_rationale` | Plain-English explanation of all inferences made |

### Post-pipeline derived fields (rule-based, not Claude)

| Field | Derivation |
|-------|-----------|
| `admission_conversion_probability` | Rule-based index from Claude fields: admission_type (+30 Emergency, +15 Urgent) + dropout_risk (-25 High, -10 Medium, +5 Low) + Insurance (+10) + (risk_score−5)×2 + readmission_risk (+5 if High) + red_flag count (+3 each, capped at 12). Clamped [10, 98]. |
| `disease_cohort` | Mapped from department name |
| `priority_tags` | Derived from risk_category + admission_type + dropout_risk combination |
| `risk_trend` | Extracted from keywords in the `progression` text (worsening/improving/stable) |
| `next_action` | Mapped from risk_category + admission_type to a clinical action string + urgency level |

---

## ICD-10 Verification

Fields with `icd10_verified: false` are shown with a yellow "Unverified · Coder Review Required" badge in both the worklist and the patient profile. Verification is based on the model's `confidence_score` — scores below 70 are flagged. In production this would be replaced by a programmatic NLM ICD-10-CM API validation check.

---

## Physician Sign-off Workflow

Every AI-generated clinical field on the profile page has three states:

- **Pending** (yellow) — AI output, not yet reviewed
- **Approved** (green) — physician confirmed the value is correct
- **Overridden** (blue) — physician corrected the value; both AI original and physician value are shown

Reviews persist in `localStorage` keyed by patient ID and field name. In production these would sync to a `field_reviews` table in PostgreSQL with physician ID and timestamp for audit purposes.

---

## Confidence Threshold Alerts

| Score | UI Behaviour |
|-------|-------------|
| ≥ 70% | No alert — normal display |
| 50–69% | Yellow banner: "AI Confidence X% — key fields require physician verification" |
| < 50% | Red banner: "Low AI Confidence — do not act without physician sign-off" |
| < 70% | Worklist row shows "⚠ Low confidence" chip under patient name |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| AI Model | Claude Haiku (claude-haiku-4-5-20251001) |
| AI SDK | Anthropic Python SDK |
| Data Pipeline | Python 3 + pandas + openpyxl |
| State persistence | localStorage (physician reviews) |
| Deployment | Vercel (static SPA) |

---

## Architecture

```
Excel File (466 patient records)
        ↓
pipeline/process_patients.py
   ├── select_representative_sample() — round-robin across departments, 20 patients
   ├── call_claude() — one API call per patient, Claude Haiku
   └── compute_admission_conversion_probability() — rule-based from Claude fields
        ↓
pipeline/output/patients.json  (20 patients, ~40 fields each)
        ↓  copied to
src/data/patients.json
        ↓  bundled at build time by Vite
React SPA → Vercel (fully static, no backend required)
```

**Why no backend?**  
AI inference runs offline once (pre-computation pattern). The React app reads static JSON — instant load, zero infrastructure, works anywhere. This is appropriate for a proof-of-concept; production would require a FastAPI backend with a PostgreSQL database.

---

## Project Structure

```
DocstribeAI/
├── pipeline/
│   ├── process_patients.py        # AI pipeline: Excel → patients.json
│   ├── prompt_template.py         # Claude system prompt + patient prompt builder
│   └── output/patients.json       # Generated AI output (committed for demo)
├── src/
│   ├── data/patients.json         # Bundled for React
│   ├── pages/
│   │   ├── UploadPage.jsx         # Upload + processing animation
│   │   ├── WorklistPage.jsx       # Admission worklist (list + cohort views)
│   │   └── PatientProfilePage.jsx
│   ├── components/
│   │   ├── worklist/
│   │   │   ├── StatsStrip.jsx     # 6 KPI cards + revenue breakdown strip
│   │   │   ├── WorklistHeader.jsx # Search, filters, view toggle
│   │   │   ├── PatientRow.jsx     # Table row with tags, trend, conversion %
│   │   │   ├── CohortSidebar.jsx  # Left sidebar — risk-grouped patient list
│   │   │   ├── CohortView.jsx     # Disease cohort card grid view
│   │   │   └── ActionBanner.jsx   # Urgent alert banner for critical patients
│   │   ├── profile/
│   │   │   ├── ProfileHeader.jsx  # Name, risk badge, KPI chips, confidence banners
│   │   │   ├── NextActionCard.jsx # Urgency level, next action, admission likelihood
│   │   │   ├── ClinicalSummaryCard.jsx
│   │   │   ├── RedFlagsCard.jsx
│   │   │   ├── ClinicalTimeline.jsx
│   │   │   ├── TreatmentCard.jsx
│   │   │   ├── RiskCard.jsx
│   │   │   ├── OperationalCard.jsx
│   │   │   ├── PhysicianReviewCard.jsx  # Approve/override workflow
│   │   │   └── AIRationaleCard.jsx
│   │   └── shared/
│   │       ├── RiskBadge.jsx
│   │       ├── FilterChip.jsx
│   │       ├── ReviewableField.jsx  # Pending/approved/overridden field wrapper
│   │       └── LoadingSpinner.jsx
│   ├── hooks/
│   │   ├── usePatients.js           # Filter + search logic
│   │   ├── usePatientById.js        # Single patient lookup
│   │   └── usePhysicianReview.js    # localStorage review state per patient
│   └── utils/
│       ├── riskColors.js            # Risk category → Tailwind class mapping
│       └── formatters.js            # Currency, date, LOS formatters
├── docs/
│   ├── ai-inference-logic.md        # Full AI scoring methodology
│   ├── architecture-notes.md        # Design decisions + data flow
│   └── assumptions.md               # Scope, limitations, trade-offs
└── vercel.json                      # SPA routing rewrite rule
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
cp output/patients.json ../src/data/patients.json
```

---

## Production Roadmap

The current system is a proof-of-concept. Below is what would be required to make it clinically safe and production-ready.

### 1. RAG — Grounding AI in Verified Clinical Guidelines

**Problem today:** Claude infers red flags and treatments from training data alone. It cannot cite "SpO2 < 92% is a red flag per WHO Pulse Oximetry Guidelines 2011."

**Solution:** At inference time, retrieve the top-N relevant guideline chunks (NICE, WHO, UpToDate) from a vector database (pgvector/Pinecone) and inject them into the prompt. Every red flag and treatment recommendation becomes traceable to a specific guideline version.

### 2. ICD-10 Validation via NLM API

**Problem today:** No programmatic check that Claude's ICD-10 code is valid or correctly mapped.

**Solution:** Post-processing step calling the NLM ICD-10-CM API after each inference. Mismatches or invalid codes set `icd10_verified: false` and block downstream billing until a coder reviews.

### 3. Field-Level Confidence (not just overall score)

**Problem today:** A single `confidence_score` covers all fields equally. A diagnosis inferred from clear notes can share the same score as a revenue estimate that was mostly guessed.

**Solution:** Claude returns a confidence value per field, not per patient. The UI highlights individual uncertain fields rather than the whole record.

### 4. Admission Probability — ML Model

**Problem today:** `admission_conversion_probability` is a rule-based scoring index, not a trained probability. It cannot learn from outcomes.

**Solution:** Logistic regression or gradient boosted model trained on historical admission outcomes. Features: age, comorbidity count, department, admission type, LOS, insurance type, red flag severity, prior visit count. Model learns weights from data, not hardcoded rules.

### 5. Audit Trail

**Problem today:** No record of what the AI output was, which model version produced it, or what input it used.

**Solution:** Append-only inference log (S3 / CloudWatch / PostgreSQL with no UPDATE/DELETE) capturing: inference ID, timestamp, model version, input hash, full output, prompt version. Enables reproducibility, model drift detection, and legal defensibility.

### Production Architecture

```
Excel / HIS Integration
        ↓
FastAPI Backend
        ↓
RAG Pipeline (pgvector + clinical guidelines)
        ↓
Claude API (with grounded context)
        ↓
ICD-10 Validation (NLM API)
        ↓
PostgreSQL (patients + field_reviews + audit_log)
        ↓
React Frontend
    ├── Worklist (with confidence indicators, cohort view)
    ├── Patient Profile (with pending/approved field states)
    └── Physician Review Queue
        ↓
Audit Log (append-only, S3 or CloudWatch)
```

---

## Documentation

- [AI Inference Logic](docs/ai-inference-logic.md) — risk scoring methodology, prompt design, confidence scoring
- [Architecture Notes](docs/architecture-notes.md) — why this stack, data flow, component tree
- [Assumptions & Design Decisions](docs/assumptions.md) — scope boundaries, trade-offs, out-of-scope items
