import pandas as pd
import anthropic
import json
import time
import os
import sys
from prompt_template import SYSTEM_PROMPT, build_patient_prompt

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
INPUT_FILE = "ipd_data_May_12_new_1.xlsx"
OUTPUT_FILE = "output/patients.json"
MAX_PATIENTS = 20

def load_excel(filepath: str) -> list:
    df = pd.read_excel(filepath)
    df = df.fillna("")
    df.columns = [c.strip() for c in df.columns]
    return df.to_dict(orient="records")

def select_representative_sample(patients: list, n: int = 20) -> list:
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

def call_claude(client, patient: dict) -> dict:
    prompt = build_patient_prompt(patient)
    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=2048,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        text = response.content[0].text.strip()
        # Extract JSON if wrapped in markdown code blocks
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        result = json.loads(text)
        result["patient_id"] = str(patient.get("Patient_ID", result.get("patient_id", "")))
        return result
    except Exception as e:
        print(f"  Error for {patient.get('Patient_ID')}: {e}")
        return {
            "patient_id": str(patient.get("Patient_ID", "")),
            "patient_name": str(patient.get("Patient_Name", "")),
            "department": str(patient.get("Department", "")),
            "doctor_name": str(patient.get("Doctor_Name", "")),
            "visit_date": str(patient.get("Visit_Date", "")),
            "customer_type": str(patient.get("Customer_Type", "")),
            "error": str(e),
            "risk_category": "Low",
            "risk_score": 1,
            "admission_type": "Elective",
            "case_type": "Medication Management",
            "primary_diagnosis": "Unable to process",
            "icd10_code": None,
            "red_flags": [],
            "comorbidities": [],
            "possible_symptoms": [],
            "bed_type_required": "General",
            "expected_revenue": None,
            "estimated_los_days": None,
            "confidence_score": 0,
            "data_completeness": "Low",
        }

def main():
    if not ANTHROPIC_API_KEY:
        print("ERROR: ANTHROPIC_API_KEY environment variable not set")
        print("Run: ANTHROPIC_API_KEY=your_key python3 process_patients.py")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    print(f"Loading Excel: {INPUT_FILE}")
    all_patients = load_excel(INPUT_FILE)
    print(f"Total patients in Excel: {len(all_patients)}")

    sample = select_representative_sample(all_patients, MAX_PATIENTS)
    print(f"Selected {len(sample)} representative patients across departments")

    os.makedirs("output", exist_ok=True)
    results = []
    for idx, patient in enumerate(sample):
        pid = patient.get("Patient_ID", f"row_{idx}")
        print(f"[{idx+1}/{len(sample)}] Processing {pid} ({patient.get('Department', 'Unknown')})...")
        result = call_claude(client, patient)
        results.append(result)

        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        time.sleep(2)

    print(f"\nDone! Saved {len(results)} patients to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
