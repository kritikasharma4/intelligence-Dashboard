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

  "expected_revenue": "string (e.g. Rs.80,000 - Rs.1,20,000 based on procedure and department)",
  "estimated_los_days": null,

  "best_treatment": "string - primary recommended pathway",
  "secondary_treatment": "string - alternative if primary not feasible",
  "deferred_time": "string (e.g. Can be safely delayed 2-3 weeks or Cannot be deferred)",

  "risk_category": "Critical | High | Medium | Low",
  "risk_score": 5,
  "risk_reasoning": "string - 1-2 sentences explaining the risk score",
  "readmission_risk": "High | Medium | Low",
  "dropout_risk": "High | Medium | Low",

  "bed_type_required": "ICU | HDU | General | Suite | Daycare Bay",

  "ai_rationale": "string - paragraph explaining key inferences made and why",
  "confidence_score": 75,
  "data_completeness": "High | Medium | Low (quality of input clinical note)"
}}
"""
