# Assumptions & Design Decisions

## Data Assumptions

1. **Representative sample**: 20 patients selected via round-robin across all 35 departments ensures diverse coverage for demo purposes
2. **Clinical notes quality**: The Excel clinical notes vary from single-line to multi-paragraph. The AI prompt is designed to handle both
3. **Revenue estimates**: Based on approximate CGHS/insurance billing rates for India, not hospital-specific tariffs
4. **LOS estimates**: Based on published clinical guidelines for each diagnosis, adjusted for severity

## AI Assumptions

1. **Model choice**: Claude Haiku is fast and cost-efficient for structured extraction tasks. It performs well on clinical text without fine-tuning
2. **Temperature 0.2**: Low temperature ensures reproducible, factual outputs rather than creative variation
3. **ICD-10-CM**: Used US ICD-10-CM codes as they are the international standard. Hospital may use ICD-10 or local variants
4. **Confidence scores**: Self-reported by the model — treat as relative, not absolute

## UX Assumptions

1. **Single-page app**: Assumed evaluators will view on desktop/laptop; mobile is responsive but not the primary target
2. **Upload simulation**: The "Load Demo Dataset" button simulates the full AI processing flow. In production, the pipeline would run server-side
3. **No authentication**: Out of scope for this assignment; production would require role-based access

## Out of Scope

- Real-time data from HIS/EMR systems
- Physician sign-off workflow
- Bed management integration
- Insurance pre-authorization
- Multi-hospital tenancy
