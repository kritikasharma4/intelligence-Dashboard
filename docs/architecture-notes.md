# Architecture Notes

## Why No Backend / Database?

This is an intentional design decision, not a limitation:

1. **Assignment scope**: The task is to demonstrate AI-powered admission intelligence and clinical UI — not backend engineering
2. **Pre-computation pattern**: AI inference is expensive and slow (2–5s per patient). Running it at request time would make the UI feel broken. Running it offline once and serving static JSON is the correct production pattern for batch analytics
3. **Evaluator experience**: Static JSON means zero infrastructure to run — open the URL, it works instantly
4. **Cost**: No database = no hosting costs = easier to demo for free

## Data Flow

```
Excel File (466 rows)
    ↓
pipeline/process_patients.py
    ↓ (reads Excel, calls Claude Haiku per patient)
pipeline/output/patients.json  (20 representative patients)
    ↓ (copied to)
src/data/patients.json
    ↓ (bundled into React app at build time)
React SPA (static, deployed to Vercel)
    ↓
Browser reads JSON → no API calls at runtime
```

## Component Architecture

```
App.jsx
├── / → UploadPage (simulated upload + AI processing animation)
├── /worklist → WorklistPage
│   ├── WorklistHeader (search + filters)
│   ├── StatsStrip (summary cards)
│   ├── CohortSidebar (grouped by risk category)
│   └── PatientRow (table rows, clickable)
└── /patient/:id → PatientProfilePage
    ├── ProfileHeader (name, risk badge, revenue, LOS)
    ├── ClinicalSummaryCard (diagnosis, history, symptoms, comorbidities)
    ├── RedFlagsCard (red flags + progression)
    ├── ClinicalTimeline (day-by-day events)
    ├── TreatmentCard (best/secondary treatment, readmission/dropout risk)
    ├── RiskCard (score bar, reasoning)
    ├── OperationalCard (revenue, LOS, bed type)
    └── AIRationaleCard (model rationale + confidence)
```

## State Management

No Redux/Zustand — React `useState` + `useMemo` in custom hooks is sufficient:
- `usePatients()` — filter/search logic over static JSON
- `usePatientById(id)` — single patient lookup

## Styling

Tailwind CSS v4 (via `@tailwindcss/vite` plugin). No custom CSS files — all styling via utility classes. Custom risk colors defined in `src/utils/riskColors.js` as Tailwind class strings (not arbitrary values) to ensure correct purging.

## Deployment

Vercel static site deployment:
- `npm run build` → `dist/` folder
- Vercel auto-detects Vite, sets correct build settings
- SPA routing handled by `vercel.json` rewrite rule
