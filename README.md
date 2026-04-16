# Outlynk

> Connecting patients, doctors, and diagnostic centres — seamlessly.

---

## Problem Statement

In India, the diagnostic and consultation process is highly fragmented. A typical patient journey looks like this:

1. Visit a doctor for a complaint
2. Get a prescription for diagnostic tests
3. Travel to a diagnostic/radiology centre
4. Wait for reports to be ready
5. Collect physical/digital reports manually
6. Travel back to the doctor for a follow-up consultation
7. Doctor reviews reports during the visit

This forces patients to make **multiple physical trips**, leads to **delayed diagnoses**, and results in **no continuity of medical records** across visits or providers.

---

## Solution

**Outlynk** is a healthcare platform that digitally connects **patients**, **doctors**, and **diagnostic/radiology centres** on a single unified platform.

When a doctor orders tests, the diagnostic centre uploads the completed reports directly to Outlynk — making them instantly accessible to both the doctor and the patient. The doctor can review reports remotely, determine the appropriate next step (virtual or physical consultation), record examination findings, provide a diagnosis, and issue a prescription — all within the platform. Every interaction is stored as part of the patient's longitudinal medical history.

---

## Key Features (MVP)

### For Patients
- Register and maintain a personal health profile
- Receive test orders from doctors digitally
- Get notified when diagnostic reports are ready and shared
- View reports on the platform (no need to collect physical copies)
- Attend virtual consultations with doctors
- Access full medical history: reports, diagnoses, prescriptions

### For Doctors
- Search and link with registered patients
- Issue digital test orders to diagnostic centres
- Get notified when reports are uploaded and ready for review
- Review diagnostic reports remotely (radiology images, lab results, etc.)
- Decide on next step: virtual or in-person follow-up consultation
- Record examination findings and clinical notes
- Record diagnosis and issue digital prescriptions
- View patient's complete medical history across visits

### For Diagnostic / Radiology Centres
- Receive test orders from doctors via the platform
- Upload completed reports (PDFs, images, structured data) directly to the patient's profile
- Reports are auto-shared with the ordering doctor and the patient upon upload
- Manage and track pending and completed orders

---

## User Roles

| Role | Description |
|---|---|
| Patient | End user who gets tested and consults with doctors |
| Doctor | Medical professional who orders tests, reviews reports, diagnoses, and prescribes |
| Diagnostic Centre | Lab or radiology centre that processes tests and uploads reports |
| Admin (future) | Platform administrator managing verifications and disputes |

---

## User Journey

### End-to-End Flow

```
Patient visits Doctor (physical/virtual)
        |
        v
Doctor issues Test Order via Outlynk
        |
        v
Patient visits Diagnostic Centre (with Outlynk order reference)
        |
        v
Diagnostic Centre processes tests & uploads reports to Outlynk
        |
        v
Reports auto-shared with:
  - Ordering Doctor (notification + access)
  - Patient (notification + access)
        |
        v
Doctor reviews reports remotely on Outlynk
        |
        v
Doctor decides next step:
  |                        |
Virtual Consultation    Physical Consultation
  (scheduled on          (patient visits
   Outlynk)               clinic/hospital)
        |
        v
Doctor records:
  - Examination findings
  - Diagnosis
  - Prescription
        |
        v
All data saved to Patient's Medical History on Outlynk
```

---

## Core Modules (MVP Scope)

### 1. Authentication & Onboarding
- Role-based registration: Patient / Doctor / Diagnostic Centre
- Doctor verification (registration number, specialisation)
- Diagnostic Centre verification (NABL/other credentials)
- Patient profile creation (basic health info, age, gender, blood group)

### 2. Test Order Management
- Doctor creates a digital test order linked to a patient
- Patient receives the order and can present it at a linked diagnostic centre
- Diagnostic centre receives and acknowledges the order

### 3. Report Management
- Diagnostic centre uploads reports against a test order
- Supported formats: PDF, DICOM (radiology), JPEG/PNG, structured lab data
- Auto-notification to doctor and patient upon upload
- Report viewer within the app

### 4. Consultation Management
- Doctor reviews reports and sets consultation type (virtual / physical)
- Virtual consultation: in-app video/audio call or chat
- Doctor records clinical notes, examination findings, and diagnosis post-consultation

### 5. Prescription Management
- Doctor issues digital prescriptions post-consultation
- Prescription linked to the specific visit and diagnosis
- Patient can view and download prescriptions

### 6. Medical History
- Full timeline view for each patient
- Includes: test orders, diagnostic reports, consultations, diagnoses, prescriptions
- Accessible to the patient and their treating doctors (with consent)

---

## Out of Scope for MVP

- Insurance / billing integration
- Pharmacy integration
- Appointment scheduling with diagnostic centres
- Admin panel
- AI-based report interpretation
- Multi-language support

---

## Target Market

- **Geography:** India (initial launch)
- **Primary users:** Urban and semi-urban patients dealing with fragmented diagnostic-to-consultation workflows
- **Healthcare providers:** Independent doctors, clinics, diagnostic chains, radiology centres

---

## Tech Stack (Proposed)

> To be finalised during technical planning.

| Layer | Options |
|---|---|
| Mobile App | React Native / Flutter |
| Backend | Node.js / Python (FastAPI) |
| Database | PostgreSQL |
| File Storage | AWS S3 / Google Cloud Storage |
| Auth | Firebase Auth / Auth0 |
| Video Consultation | Twilio / Daily.co / Agora |
| Notifications | Firebase Cloud Messaging |

---

## Getting Started

> Setup instructions will be added once the technical architecture is finalised.

---

## License

Proprietary — All rights reserved. Outlynk, 2026.
