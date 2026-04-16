# Outlynk — Product Requirements Document (PRD)

**Version:** 1.0 (MVP)
**Date:** April 2026
**Status:** Draft

---

## 1. Overview

### 1.1 Product Summary
Outlynk is a B2B2C healthcare platform that digitally connects patients, doctors, and diagnostic/radiology centres in India. It eliminates the need for patients to physically collect and carry reports by enabling direct report sharing between diagnostic centres and doctors, with full visibility for the patient.

### 1.2 Goals
- Reduce unnecessary physical trips for patients during the diagnostic-to-consultation cycle
- Give doctors remote access to diagnostic reports before deciding on the type of follow-up
- Create a persistent, accessible medical record for every patient
- Enable digital prescriptions tied to verified consultations

### 1.3 Success Metrics (MVP)
| Metric | Target (3 months post-launch) |
|---|---|
| Registered patients | 500 |
| Registered doctors | 50 |
| Registered diagnostic centres | 20 |
| Test orders placed | 300 |
| Reports uploaded via platform | 250 |
| Virtual consultations conducted | 100 |

---

## 2. User Roles & Personas

### 2.1 Patient
- **Profile:** Adult Indian patient, urban/semi-urban, comfortable with smartphones
- **Goal:** Get diagnosed efficiently without multiple hospital/clinic visits
- **Pain point:** Carrying physical reports, repeated travel, no central medical record

### 2.2 Doctor
- **Profile:** MBBS/specialist, practicing in clinic or hospital, sees 20–50 patients/day
- **Goal:** Review reports remotely, reduce unnecessary in-person follow-ups, maintain patient records
- **Pain point:** Patients arrive without reports, no digital history, follow-ups hard to track

### 2.3 Diagnostic / Radiology Centre
- **Profile:** Independent lab or radiology centre, processes 30–200 tests/day
- **Goal:** Deliver reports digitally, reduce patient walk-ins for report collection
- **Pain point:** Manual report delivery, no integration with referring doctors

---

## 3. Functional Requirements

### 3.1 Authentication & Onboarding

#### Patient
- FR-P-001: Patient can register using mobile number (OTP-based)
- FR-P-002: Patient completes profile: name, DOB, gender, blood group, emergency contact
- FR-P-003: Patient can log in and manage their profile

#### Doctor
- FR-D-001: Doctor registers with mobile number + email
- FR-D-002: Doctor submits: MCI registration number, specialisation, clinic/hospital name, years of experience
- FR-D-003: Doctor account is manually verified before activation (MVP: admin review)
- FR-D-004: Doctor can log in and manage their profile

#### Diagnostic Centre
- FR-DC-001: Diagnostic centre registers with mobile number + email
- FR-DC-002: Centre submits: name, address, NABL/accreditation details, contact person
- FR-DC-003: Centre account is manually verified before activation
- FR-DC-004: Centre can log in and manage their profile

---

### 3.2 Patient–Doctor Linking

- FR-L-001: Doctor can search for a patient by mobile number or patient ID
- FR-L-002: Patient receives a notification/request when a doctor links them
- FR-L-003: Patient approves the link; doctor can now view their health profile and history
- FR-L-004: Patient can see all doctors they are linked with and revoke access

---

### 3.3 Test Order Management

- FR-TO-001: Doctor can create a digital test order for a linked patient
- FR-TO-002: Test order includes: patient details, ordered tests (e.g. CBC, X-Ray Chest), clinical notes, referring doctor name
- FR-TO-003: Patient receives a notification with the test order
- FR-TO-004: Patient can view the test order and present it at any linked diagnostic centre (via QR code or order ID)
- FR-TO-005: Diagnostic centre searches for and acknowledges the order before processing
- FR-TO-006: Order status lifecycle: `Ordered → Acknowledged → Processing → Report Uploaded`

---

### 3.4 Report Management

- FR-R-001: Diagnostic centre uploads reports against an acknowledged test order
- FR-R-002: Supported upload formats: PDF, JPEG, PNG (DICOM support in post-MVP)
- FR-R-003: Upon upload, reports are automatically shared with:
  - The ordering doctor (notification + platform access)
  - The patient (notification + platform access)
- FR-R-004: Doctor can view reports within the platform (PDF viewer / image viewer)
- FR-R-005: Patient can view and download their reports at any time
- FR-R-006: Reports are permanently linked to the patient's medical history

---

### 3.5 Consultation Management

- FR-C-001: After reviewing reports, doctor updates the consultation type:
  - `Virtual` — consultation conducted via in-app video/audio or chat
  - `Physical` — patient needs to visit in person
- FR-C-002: For virtual consultations, doctor can initiate or schedule a call from within the platform
- FR-C-003: Doctor records post-consultation notes:
  - Examination findings
  - Diagnosis (free text + ICD-10 code, optional for MVP)
  - Recommended next steps
- FR-C-004: Consultation record is saved and linked to the patient's history

---

### 3.6 Prescription Management

- FR-RX-001: Doctor can create a digital prescription after a consultation
- FR-RX-002: Prescription includes:
  - Date, Doctor name, registration number, clinic name
  - Patient name, age, gender
  - Diagnosis
  - Medicines: name, dosage, frequency, duration
  - Additional instructions / advice
- FR-RX-003: Patient receives a notification and can view/download the prescription
- FR-RX-004: Prescription is linked to the specific consultation and stored in medical history

---

### 3.7 Medical History

- FR-MH-001: Patient has a unified timeline view of all:
  - Test orders
  - Diagnostic reports
  - Consultations
  - Diagnoses
  - Prescriptions
- FR-MH-002: Doctor can view a patient's full history (for linked patients only)
- FR-MH-003: History is sorted chronologically (most recent first)
- FR-MH-004: Patient can filter history by: date range, type (report / consultation / prescription)

---

### 3.8 Notifications

- FR-N-001: Push notifications for:
  - Patient: doctor linked, test order received, report ready, consultation scheduled, prescription issued
  - Doctor: report uploaded, patient accepted link
  - Diagnostic centre: new test order received
- FR-N-002: In-app notification centre for all users

---

## 4. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Security | All health data encrypted at rest and in transit (TLS 1.2+, AES-256) |
| Privacy | Patient data access gated by explicit linking/consent |
| Availability | 99.5% uptime for core flows (report upload, report view) |
| Performance | Report upload < 30s for files up to 20MB; report view load < 3s |
| Scalability | Architecture must support horizontal scaling from Day 1 |
| Compliance | DPDP Act 2023 (India) compliance; data residency in India |
| File Storage | Medical reports stored securely, never publicly accessible (signed URLs only) |

---

## 5. Data Models

### 5.1 User
```
User {
  id, role (patient | doctor | diagnostic_centre),
  name, mobile, email, password_hash,
  is_verified, created_at, updated_at
}
```

### 5.2 Patient Profile
```
PatientProfile {
  id, user_id, dob, gender, blood_group,
  emergency_contact_name, emergency_contact_mobile
}
```

### 5.3 Doctor Profile
```
DoctorProfile {
  id, user_id, mci_number, specialisation,
  clinic_name, clinic_address, years_of_experience,
  verification_status (pending | verified | rejected)
}
```

### 5.4 Diagnostic Centre Profile
```
DiagnosticCentreProfile {
  id, user_id, centre_name, address, city, pincode,
  accreditation_number, contact_person,
  verification_status (pending | verified | rejected)
}
```

### 5.5 Doctor–Patient Link
```
DoctorPatientLink {
  id, doctor_id, patient_id,
  status (pending | active | revoked),
  linked_at
}
```

### 5.6 Test Order
```
TestOrder {
  id, doctor_id, patient_id, diagnostic_centre_id (nullable),
  tests_ordered (array of strings), clinical_notes,
  status (ordered | acknowledged | processing | completed),
  order_reference (unique short code for QR),
  created_at, updated_at
}
```

### 5.7 Report
```
Report {
  id, test_order_id, patient_id, uploaded_by (diagnostic_centre_id),
  file_url (signed), file_type (pdf | image), file_name,
  report_name, uploaded_at
}
```

### 5.8 Consultation
```
Consultation {
  id, doctor_id, patient_id, test_order_id (nullable),
  consultation_type (virtual | physical),
  status (scheduled | completed | cancelled),
  examination_findings, diagnosis, next_steps,
  scheduled_at, completed_at
}
```

### 5.9 Prescription
```
Prescription {
  id, consultation_id, doctor_id, patient_id,
  diagnosis,
  medicines: [{ name, dosage, frequency, duration, instructions }],
  additional_notes,
  issued_at
}
```

---

## 6. API Design (High-Level)

### Auth
```
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Patient
```
GET    /api/patients/profile
PUT    /api/patients/profile
GET    /api/patients/history
GET    /api/patients/doctors           (linked doctors)
DELETE /api/patients/doctors/:doctorId (revoke access)
```

### Doctor
```
GET    /api/doctors/profile
PUT    /api/doctors/profile
GET    /api/doctors/patients           (linked patients)
POST   /api/doctors/patients/link      (search + send link request)
GET    /api/doctors/patients/:id/history
```

### Test Orders
```
POST   /api/orders                     (doctor creates order)
GET    /api/orders/:id
GET    /api/orders                     (list by role)
PATCH  /api/orders/:id/status          (centre updates status)
```

### Reports
```
POST   /api/reports                    (diagnostic centre uploads)
GET    /api/reports/:id
GET    /api/reports/order/:orderId
GET    /api/reports/patient/:patientId
```

### Consultations
```
POST   /api/consultations
GET    /api/consultations/:id
PATCH  /api/consultations/:id          (update findings, diagnosis)
GET    /api/consultations/patient/:id
```

### Prescriptions
```
POST   /api/prescriptions
GET    /api/prescriptions/:id
GET    /api/prescriptions/patient/:id
```

### Notifications
```
GET    /api/notifications
PATCH  /api/notifications/:id/read
```

---

## 7. MVP Milestones

### Phase 1 — Foundation (Weeks 1–3)
- Project setup (backend, mobile app, database)
- Authentication: OTP-based login, role-based registration
- Patient and Doctor profile setup
- Doctor–Patient linking flow

### Phase 2 — Core Flow (Weeks 4–6)
- Test order creation and management
- Diagnostic centre report upload
- Report auto-sharing with doctor and patient
- Report viewer in app

### Phase 3 — Consultation & Prescription (Weeks 7–9)
- Consultation type decision by doctor
- Virtual consultation (basic in-app call)
- Examination findings + diagnosis recording
- Digital prescription creation and delivery

### Phase 4 — History & Notifications (Weeks 10–11)
- Unified medical history timeline
- Push notifications (FCM)
- In-app notification centre

### Phase 5 — QA & Launch Prep (Week 12)
- End-to-end testing across all 3 user roles
- Security audit
- Beta release to closed group

---

## 8. Out of Scope (MVP)

- Insurance / TPA integration
- Pharmacy integration
- Appointment booking with diagnostic centres
- DICOM viewer (radiology images)
- AI-assisted report interpretation
- Admin dashboard
- Multi-language support (Hindi, regional)
- Web app (mobile-first for MVP)

---

## 9. Open Questions

1. How will doctor verification be handled at scale — manual review or third-party MCI API?
2. Should patients be able to share reports with doctors they are NOT linked with (e.g., second opinion)?
3. What is the monetisation model — SaaS fee on diagnostic centres, per-consultation fee, or subscription?
4. Are there existing diagnostic centre partners for the beta launch?
5. ABDM (Ayushman Bharat Digital Mission) integration — required for future? Any compliance dependency now?

---

*Document owner: Outlynk Product Team*
*Next review: After Phase 1 completion*
