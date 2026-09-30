# iKAA AI Knowledge Base — Service Specification: Pharmacy & Rx Management
**Service ID**: `pharmacy`  
**Parent Ecosystem**: iKAA (formerly Blessikaa)  
**Status**: `ACTIVE_PRODUCTION`  
**Engine**: Dual Simple & Professional Interface with Gemini OCR integration

---

## 1. Overview
The Pharmacy & Rx Management module empowers patients, caregivers, and medical specialists to seamlessly log, verify, track, and reorder prescription regimens.

### Core Dual Modes:
- **Simple Mode (Patient & Caregiver Friendly)**:
  - Streamlined input: Medicine name, Strength, Form, Dosage times, Course duration, Prescriber, Reminders, and basic stock.
  - Auto-suggest from generic and brand drug database.
  - 1-tap adherence logging with sound & haptic feedback.
- **Professional Mode (Clinicians, Pharmacists & Specialists)**:
  - ATC / NDC codes, DEA / Schedule category (Schedule II/IV/H/X).
  - Pharmacokinetics: Route (IV, IM, Oral, SC, Sublingual), Half-life, Titration schedule, TDM (Therapeutic Drug Monitoring) target range.
  - Batch number, Lot number, Expiry date, Cold-chain / Storage specs, Pharmacy dispensing verification, and ICD-10 diagnostic coding.

---

## 2. Dynamic Workflow State Machine
1. **Intake / Add Action**:
   - Option A: Manual smart input with instant database auto-suggest.
   - Option B: AI OCR Scan photo upload -> automated parsing into form fields.
2. **Safety Cross-Check**:
   - Dynamic Drug-Drug and Drug-Food interaction analysis.
   - Alerts for contraindications, black-box warnings, and meal timings.
3. **Daily Schedule & Logging**:
   - Categorization into Morning (08:00), Afternoon (14:00), Evening (20:00), and Night (22:00).
   - 1-Tap "Mark Taken" increments adherence streak, logs timestamp, and decrements physical cabinet stock.
4. **Refill & Expiry Triggers**:
   - Automated warnings when remaining pill count reaches reorder threshold.
   - 1-tap stock replenishment.

---

## 3. Tool Definition for iKAA AI Agent Companion
```json
{
  "tool_name": "log_medication_dose",
  "description": "Logs a scheduled or ad-hoc medication dose for the user and decrements inventory.",
  "parameters": {
    "medicine_id": { "type": "string", "required": true },
    "scheduled_time": { "type": "string", "required": true },
    "status": { "type": "string", "enum": ["taken", "skipped", "snoozed"], "required": true },
    "notes": { "type": "string", "required": false }
  },
  "permissions": ["health_records_write"],
  "confirmation_required": false
}
```
