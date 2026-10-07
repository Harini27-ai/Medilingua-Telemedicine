# MediLingua Telemedicine REST API Reference

Enterprise-grade telemedicine platform API providing authentication, multilingual doctor discovery, appointments, translation dispatch, and clinical record management.

- **Base URL (Local):** `http://localhost:5000`
- **Authentication Scheme:** Bearer Token (JWT in `Authorization: Bearer <token>`)

---

## 1. System & Health

### `GET /api/health`
Performs service heartbeat and diagnostics check.

**Response `200 OK`:**
```json
{
  "ok": true,
  "service": "MediLingua Telemedicine Enterprise API",
  "version": "2.5"
}
```

---

## 2. Authentication & User Management

### `POST /api/auth/login`
Authenticates a user with credentials.

**Request Body:**
```json
{
  "username": "patient_demo",
  "password": "demo123",
  "role": "patient"
}
```

**Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Priya Sharma",
    "mrn": "MRN-TN-8821",
    "username": "patient_demo",
    "email": "priya.sharma@patient.medilingua.in",
    "language": "Tamil",
    "role": "patient"
  }
}
```

### `POST /api/auth/demo-login`
Quick 1-click authentication for predefined clinical roles (`patient`, `doctor`, `interpreter`, `admin`).

**Request Body:**
```json
{
  "role": "doctor"
}
```

### `POST /api/auth/send-otp`
Sends an SMS / WhatsApp OTP verification code.

**Request Body:**
```json
{
  "phone": "+91 98765 43210"
}
```

### `POST /api/auth/register`
Creates a new clinical or patient profile with auto-generated MRN / registration numbers.

---

## 3. Clinical & Telehealth Services

### `GET /api/doctors`
Returns list of verified medical specialists, languages spoken, ratings, and consult fees.

**Response `200 OK`:**
```json
[
  {
    "id": 101,
    "name": "Dr. Rajesh Sundaram",
    "degrees": "MBBS, MD (Internal Medicine), DM (Cardiology), FACC",
    "regNo": "MCI-TN-48201",
    "specialty": "Cardiology & Internal Medicine",
    "hospital": "Apollo Hospitals, Greams Road, Chennai",
    "languages": ["English", "Tamil"],
    "rating": "4.94 / 5.0",
    "reviews": 312,
    "experience": "18 Years",
    "fee": "₹800",
    "availableToday": true
  }
]
```

### `GET /api/demo-data`
Retrieves pre-seeded appointments, medical prescriptions, translated chat logs, and interpreter dispatch queues.

### `POST /api/demo/appointments`
Schedules an upcoming teleconsultation appointment.

**Request Body:**
```json
{
  "doctor": "Dr. Rajesh Sundaram",
  "date": "2026-10-15",
  "time": "11:00 AM",
  "language": "Tamil ↔ English",
  "symptoms": "Occasional palpitations and chest tightness",
  "type": "Video Teleconsultation"
}
```

### `POST /api/demo/messages`
Sends a multilingual in-consultation message with auto-translation.

**Request Body:**
```json
{
  "from": "Priya Sharma",
  "role": "patient",
  "text": "வணக்கம் மருத்துவர், மருந்தின் நேரம் என்ன?",
  "translated": "Hello doctor, what is the timing for the medicine?"
}
```
