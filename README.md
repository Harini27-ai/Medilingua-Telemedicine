# MediLingua – Multilingual Telemedicine Access Platform

A production-grade full-stack telemedicine platform designed to eliminate language barriers in healthcare across India by uniting patients, specialist doctors, and certified medical interpreters through live speech translation, HD virtual consults, and localized medical records.

---

## 🌟 Key Platform Features

### 1. Dedicated Sign In & Sign Up / Registration
- **Direct Navigation Options**: "Sign In" and "Sign Up / Register" buttons are clearly accessible from the top header navigation and throughout the platform.
- **Dedicated Registration Form (`/register`)**:
  - Role switcher tabs: `Patient (Citizen)`, `Physician (Doctor)`, `Medical Interpreter`, `Hospital Administrator`.
  - Comprehensive clinical registration fields: Full Legal Name, Username, Email Address, Mobile Number with interactive Phone OTP verification (`123456`), Password & Confirm Password, Date of Birth with live auto-calculated age, City & State, and Primary Registered Language (Tamil, Telugu, Hindi, Malayalam, English, Bengali, Marathi).
  - Role-specific professional credentials: MCI/NMC Registration Number for physicians, CMI/CCHI accreditation for interpreters.
  - Automatic JWT token generation, persistent session creation, and direct onboarding to the role-specific dashboard.
- **Hospital Portal Sign In (`/login`)**:
  - Direct 1-click toggle between "Sign In" and "Create Account (Sign Up)".
  - 1-Click Sandbox Test accounts for instant evaluation without typing credentials.

### 2. Soothing, Subtle Healthcare UI/UX Palette
- **Subtle Medical Tint (`--bg-canvas: #f0f4f9`)**: Soft, serene medical canvas background that reduces ocular fatigue, paired with crisp white cards (`#ffffff`), subtle borders (`#dbe3ed`), and deep navy headers (`#0a1120`).
- **Clinical Precision**: Replaces generic AI templates with authoritative hospital-grade typography, patient Medical Record Numbers (MRN), ICD-10 diagnostic codes (`K21.9`), and doctor MCI registration badges.
- **Left-Side Navigation Menus**: Menus are arranged vertically one by one on the left side in both the interactive demo console and the dashboard.

### 3. Real Clinical Datasets Across India
- **8 Specialist Doctors Across Premier Indian Institutes**:
  - *Dr. Rajesh Sundaram, MD, DM, FACC* - Cardiology (Apollo Hospitals, Chennai)
  - *Dr. Kavitha Krishnan, MD, DM* - Neurology (Fortis Hospital, Bengaluru)
  - *Dr. Amit Verma, MD, DM* - Endocrinology (Max Super Speciality, New Delhi)
  - *Dr. Sneha Reddy, DCH, DNB* - Pediatrics (Rainbow Children's Hospital, Hyderabad)
  - *Dr. Manoj Nair, MD, FCCP* - Pulmonology (Aster Medcity, Kochi)
  - *Dr. Sunita Banerjee, MS, DGO* - Obstetrics & Gynecology (AMRI Hospitals, Kolkata)
  - *Dr. Vikramaditya Joshi, MS, MCh* - Orthopedics (Lilavati Hospital, Mumbai)
  - *Dr. Ritu Saxena, MD* - Dermatology (Medanta The Medicity, Gurugram)
- **Authentic Diagnostic Laboratory Panels (Apollo Diagnostics / Dr. Lal PathLabs)**:
  - Comprehensive Metabolic & Glycemic Panel (FBS, PPBS, HbA1c, eAG)
  - Complete Blood Count (CBC) with Platelets, WBC, RBC, Hemoglobin, ESR
  - Lipid Profile (Total Cholesterol, HDL, LDL, Triglycerides)
  - Renal & Electrolyte Panel (Creatinine, BUN, eGFR, Sodium, Potassium)
- **Real Indian Pharmaceutical Prescriptions (E-Rx)**:
  - Genuine formulations (*Tab. Pantoprazole 40mg (Pan 40)*, *Syr. Gelusil MPS*, *Tab. Paracetamol 650mg (Dolo 650)*, *Tab. Telmisartan 40mg (Telma 40)*).
  - Exact dosage and timing instructions translated into **Tamil (தமிழ்)**, **Telugu (తెలుగు)**, **Hindi (हिन्दी)**, and **Malayalam (മലയാളം)**.
- **DISHA & HIPAA Audit Logs**:
  - Real cryptographic SHA-256 integrity hashes, ISO event timestamps, and actor verification records.

---

## 🚀 Pre-Seeded Demo Accounts

| Role | Username | Password | Persona Details |
|---|---|---|---|
| **Patient** | `patient_demo` | `demo123` | Priya Sharma (MRN-TN-8821, Tamil, Chennai) |
| **Doctor** | `doctor_demo` | `demo123` | Dr. Rajesh Sundaram, MD (MCI-TN-48201, Apollo Chennai) |
| **Interpreter** | `interpreter_demo` | `demo123` | Ananya Menon, CMI (CMI #9042, Malayalam/Tamil) |
| **Administrator** | `admin_demo` | `demo123` | Central Hospital Operations Admin (Hindi / English) |

> **Quick OTP**: For registration or verification flows, use demo OTP: `123456`.

---

## 🏃 Quick Start

### 1. Backend Server
```bash
cd backend
npm install
npm start
```
*API running at: `http://localhost:5000`*

### 2. Frontend Application
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
*Web App running at: `http://localhost:5173`*
