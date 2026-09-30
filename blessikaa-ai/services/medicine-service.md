# BLESSIKAA MEDICINE SERVICE — SYSTEM SPECIFICATION

## 1. Executive Summary
- **Service Name**: Medicine & Rx Service
- **Core Principle**: *Simple on the surface, powerful underneath.*
- **Color Identity**: Blessikaa Purple Theme (`from-[#F9F7FD]` to `#1E1A3D`)
- **Roles Supported**:
  - `personal`: Individual patient cabinet & daily schedule
  - `caregiver`: Dependents, elderly parents & pet/veterinary profiles
  - `doctor`: Clinical practitioner dashboard, patient vitals & ICD-10 Rx builder
  - `pharmacist`: Dispensing queue, verification state machine & FEFO inventory
  - `clinic`: Multi-bed and care team coordination

## 2. Progressive Flow Architecture & Configurable Form Builder
- **Configurable Form Builder & Rule Engine (`AddMedicineSmartWizard`)**:
  - **Stage 0: Mode Selection & Presets**:
    - 🌱 **Simple Mode**: Everyday personal use (5–10 essential fields, 30–60s fast add, 1-tap reminders).
    - 👨‍👩‍👧 **Advanced Mode**: Caregivers, dependents, allergy alerts, storage rules & cabinet inventory.
    - 🩺 **Expert Mode**: Physicians, pharmacists, ICD-10 diagnostic coding, lab monitoring & regulatory schedules.
    - ⚙️ **Custom Mode**: User-tailored field selections and custom rule triggers.
    - **Presets**: Personal Care, Caregiver / Family, Physician / Rx, Pharmacist / OTC, Hospital / Clinic, Custom Preset.
  - **Stage 0.5: Form Field Customizer & Rule Engine**:
    - **10 Structured Categories**: Basic Info, Patient Care, Prescription, Dosage, Course, Safety, Monitoring, Inventory, Billing, Reminders.
    - **Visual Conditional Logic Rules**:
      - Injectables -> Automatically activates Route of Admin & Cold Storage (2-8°C).
      - Tapering Regimen -> Activates Step-Down Schedule Table.
      - Controlled Substance (Schedule H/X) -> Enforces Prescription Number & Doctor Speciality.
      - Therapeutic Drug Monitoring (IV/Biologics) -> Activates Lab Tests & Target Ranges.
    - **Autosave Draft Engine**: Automatic background draft persistence in `localStorage` with timestamp indicator and 1-tap restore prompt.
  - **Stage 1..5: Progressive Step Form**:
    - Step 1: Basic Medication Info & Assigned Profile (with dedicated Blue Family Member Picker Popup `BlueFamilyPickerPopup`).
    - Step 2: Dosage Schedule, Route, Admin Rules & Meal Timing.
    - Step 3: Treatment Duration, Prescriber, ICD-10 & Diagnosis.
    - Step 4: Storage Conditions, Lab Tests, TDM Range & Cabinet Stock.
    - Step 5: Audio & Push Reminders, Confirmation & 1-Tap Adherence Activation.

- **Dose Status Lifecycle Model**:
  - `SCHEDULED` -> `UPCOMING` -> `DUE` -> `TAKEN` / `LATE` / `MISSED` / `SKIPPED` / `SNOOZED` / `CANCELLED` / `HELD`.

- **Blue Family Picker Popup (`BlueFamilyPickerPopup`)**:
  - Standalone, high-contrast blue popup for assigning medications to dependents, parents, or pets without visual clutter.

- **8-Tab Deep Detail Modal (`MedicineDetailModal`)**:
  - `Overview`: Dose instructions, food timing, doctor info, 1-tap quick dose logger
  - `Schedule`: Specific times, next dose countdown, full duration tracker
  - `Safety`: Drug-drug interaction matrix, contraindications, food/alcohol warnings
  - `Monitoring`: Required lab biomarkers (e.g. eGFR, HbA1c, Liver enzymes)
  - `Documents`: Scanned Rx, discharge summaries, insurance receipts
  - `History`: Timestamped adherence & compliance streak records
  - `Cost`: Copay estimation, pharmacy pricing, auto-refill triggers
  - `Sharing`: Export PDF clinical audit, grant family caregiver permissions

## 3. Specialized Clinical Workspaces
- **Doctor Workspace**:
  - Active patient roster with vital tracking (BP, HR, Temp, Weight)
  - Known drug allergy red badge highlights
  - ICD-10 digital prescription generator with physician e-signature
- **Pharmacist Workspace**:
  - Electronic Rx dispensing queue with state transitions (`pending` -> `ready` -> `dispensed` -> `clarification`)
  - FEFO (First-Expiry-First-Out) batch stock control and expiry day alerts
- **Caregiver & Pet Manager**:
  - Profiles for Me, Mother, Father, Child, and Pet (Veterinary species & weight parameters)
