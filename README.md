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

## Production Roadmap

The current system is a proof-of-concept. Below is what would be required to make it clinically safe and production-ready.

---

### 1. RAG — Grounding AI in Verified Clinical Guidelines

**Problem today:** Claude infers diagnoses and red flags from training data alone. There is no auditable source — it cannot say "SpO2 < 92% is a red flag per WHO Pulse Oximetry Guidelines 2011."

**Solution:** Retrieval Augmented Generation (RAG)

```
Clinical Guidelines (NICE, WHO, UpToDate PDFs)
        ↓
Chunked + embedded into a vector database (e.g. Pinecone, pgvector)
        ↓
At inference time: retrieve the top-3 relevant guideline chunks for the patient's department/symptoms
        ↓
Inject retrieved chunks into Claude's prompt as context
        ↓
Claude now cites a specific guideline when classifying red flags or suggesting treatment
```

**What changes in the prompt:**
```
Context from NICE Guidelines (CG101 - Chronic heart failure):
"Refer urgently if new-onset chest pain with ST changes..."

Given this context and the patient record below, classify red flags...
```

**Result:** Every red flag and treatment recommendation is traceable to a specific guideline version. Auditable. Defensible in a clinical setting.

---

### 2. ICD-10 Validation Layer

**Problem today:** Claude returns an ICD-10 code like `I20.0` — but there is no programmatic check that this code is valid, current, or correctly mapped to the diagnosis.

**Solution:** Post-processing validation step in the pipeline

```python
import requests

def validate_icd10(code: str, diagnosis: str) -> dict:
    # Query the official NLM ICD-10-CM API
    url = f"https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms={code}"
    response = requests.get(url).json()
    
    valid_codes = response[3]  # list of [code, description] pairs
    matched = next((c for c in valid_codes if c[0] == code), None)
    
    return {
        "valid": matched is not None,
        "official_description": matched[1] if matched else None,
        "mismatch": matched and diagnosis.lower() not in matched[1].lower()
    }
```

If `valid: false` or `mismatch: true` — flag the field in the UI as "ICD-10 unverified" and block it from downstream billing systems until a coder reviews it.

---

### 3. Confidence Threshold Alerts in the UI

**Problem today:** `confidence_score` is displayed as a number but low-confidence fields look identical to high-confidence ones. A clinician has no visual cue that a diagnosis with 58% confidence needs more scrutiny than one with 92%.

**Solution (already partially implemented — needs field-level extension):**

Current behaviour: confidence score shown as a single number in the AI Rationale card.

Enhanced behaviour:
- If `confidence_score < 70` → show a yellow `⚠ Requires Review` banner on the profile page
- If `confidence_score < 50` → show a red `⛔ Low Confidence — Do Not Act Without Physician Sign-off` banner
- In the worklist, add a "?" icon on low-confidence rows

```jsx
// In ProfileHeader.jsx
{patient.confidence_score < 70 && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-yellow-800 text-sm">
    ⚠ AI confidence {patient.confidence_score}% — key fields require physician verification before acting
  </div>
)}
```

---

### 4. Physician Sign-off Workflow

**Problem today:** AI output goes directly to the UI with no validation step. A wrong diagnosis displays with the same visual weight as a correct one.

**Solution:** Two-state field system

Every AI-generated field gets a status: `pending_review` | `approved` | `overridden`

```
AI generates diagnosis → status: pending_review (shown in yellow)
        ↓
Physician reviews in dashboard
        ↓
Clicks "Approve" → status: approved (shown in green, locked)
     or
Clicks "Override" → types correct value → status: overridden (shown in blue, shows both AI and physician value)
```

**Database schema addition:**
```sql
CREATE TABLE field_reviews (
  patient_id     VARCHAR,
  field_name     VARCHAR,       -- 'primary_diagnosis', 'icd10_code', etc.
  ai_value       TEXT,
  reviewed_value TEXT,
  status         ENUM('pending', 'approved', 'overridden'),
  reviewed_by    VARCHAR,       -- physician user ID
  reviewed_at    TIMESTAMP
);
```

This creates a feedback loop — overridden fields can be used to fine-tune the model over time.

---

### 5. Audit Trail

**Problem today:** There is no record of what the AI output was, which model version produced it, or what input data it used. If a patient outcome is poor and the admission decision was influenced by the AI, there is no way to investigate.

**Solution:** Immutable inference log

```python
# In process_patients.py — after every successful API call
def log_inference(patient_id, input_data, output_data, model, duration_ms):
    audit_record = {
        "inference_id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat(),
        "model": model,                          # "claude-haiku-4-5-20251001"
        "model_version_hash": get_model_hash(),  # locks to exact model snapshot
        "patient_id": patient_id,
        "input_hash": hashlib.sha256(           # hash of input — proves input wasn't altered
            json.dumps(input_data).encode()
        ).hexdigest(),
        "output": output_data,
        "duration_ms": duration_ms,
        "prompt_version": PROMPT_VERSION,        # version your prompt_template.py
    }
    # Write to append-only log (S3, CloudWatch, or PostgreSQL with no UPDATE/DELETE permissions)
    append_to_audit_log(audit_record)
```

**What this enables:**
- Reproduce any past inference exactly
- Compare outputs if model is upgraded
- Legal defensibility — "here is exactly what the AI said, at this time, on this input"
- Detect model drift over time (same input, different output after model update)

---

### Production Architecture (Full)

```
Excel / HIS Integration
        ↓
FastAPI Backend
        ↓
RAG Pipeline (pgvector + clinical guidelines)
        ↓
Claude API (with grounded context)
        ↓
ICD-10 Validation Layer (NLM API)
        ↓
PostgreSQL (patients + field_reviews + audit_log)
        ↓
React Frontend
    ├── Worklist (with confidence indicators)
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
