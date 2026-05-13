# AI Inference Logic

## Overview

The Docstribe Admission Intelligence system uses Claude Haiku (claude-haiku-4-5-20251001) to transform raw hospital patient records into structured clinical intelligence.

## Input Data

Each patient record from the Excel file contains:
- `Patient_ID`, `Patient_Name`, `Department`, `Doctor_Name`
- `Visit_Date`, `Customer_Type`
- `Clinical_Notes` — unstructured free-text blob (the primary AI input)

## AI Processing Pipeline

### Step 1: Clinical Note Parsing
The model receives the raw clinical note and extracts:
- Chief complaint and presenting symptoms
- History of illness (onset, duration, progression)
- Comorbidities mentioned
- Examination findings embedded in text

### Step 2: Diagnosis + ICD-10 Inference
Using medical knowledge, the model:
- Infers the most likely primary diagnosis from symptoms + department context
- Maps to the correct ICD-10-CM code
- Infers the actual clinical procedure beyond the vague "OPD Consultation" label

### Step 3: Risk Scoring (1–10)

Risk score is a signal-weighted composite:

| Signal | Weight |
|--------|--------|
| Vital sign abnormalities (SpO2, BP, HR) | High |
| Lab value extremes (K+, pH, Hb, platelets) | High |
| Symptom acuity (acute onset, progression speed) | High |
| Number of comorbidities | Medium |
| Age + frailty | Medium |
| Admission type (Emergency vs Elective) | Medium |
| Data completeness | Low |

**Score interpretation:**
- 9–10: Critical — immediate life-threatening, requires ICU/CCU
- 7–8: High — urgent intervention needed within hours
- 5–6: Medium — significant but stable, admitted ward
- 1–4: Low — routine/elective, manageable outpatient or short stay

### Step 4: Red Flags Extraction
Model identifies specific clinical signals that escalate acuity:
- Objective measurements outside normal range
- Signs of end-organ dysfunction
- Time-critical windows (stroke thrombolysis, STEMI door-to-balloon)
- Pediatric/obstetric risk multipliers

### Step 5: Clinical Timeline Generation
The model constructs a day-by-day treatment timeline based on:
- Standard care pathways for the diagnosed condition
- Severity-adjusted interventions
- Expected milestones for the diagnosis

### Step 6: Operational Fields
- **Bed type**: matched to diagnosis severity and department
- **Expected revenue**: based on procedure complexity, LOS, and typical billing patterns
- **LOS estimate**: evidence-based average for the diagnosis and severity
- **Readmission/dropout risk**: based on diagnosis chronicity, social factors, compliance signals

## Prompt Design

The system prompt instructs the model to:
1. Act as a clinical triage AI assistant
2. Return structured JSON only (no free text)
3. Base all inferences on provided clinical data — never hallucinate
4. Flag low-confidence fields explicitly
5. Use ICD-10-CM coding standards

See `pipeline/prompt_template.py` for the full prompt.

## Confidence Scoring

`confidence_score` (0–100) reflects:
- Data completeness (all 7 fields populated vs sparse)
- Clinical note quality (detailed vs single-line)
- Diagnosis certainty (classic presentation vs atypical)
- Model self-assessed uncertainty

## Limitations

- AI inferences are probabilistic, not diagnostic
- Revenue estimates are approximations based on typical billing
- ICD-10 codes require physician validation before clinical use
- System trained on general medical knowledge, not institution-specific protocols
