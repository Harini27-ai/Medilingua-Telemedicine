const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || 'medilingua-secure-enterprise-secret-2026';
const roles = ['patient', 'doctor', 'admin', 'interpreter'];

// Pre-computed bcrypt hash for 'demo123'
const DEMO_PW_HASH = bcrypt.hashSync('demo123', 10);

const users = [
  {
    id: 1,
    name: 'Priya Sharma',
    mrn: 'MRN-TN-8821',
    username: 'patient_demo',
    password: DEMO_PW_HASH,
    phone: '+91 98765 43210',
    email: 'priya.sharma@patient.medilingua.in',
    dob: '1994-05-12',
    age: 32,
    location: 'Chennai, Tamil Nadu',
    language: 'Tamil',
    role: 'patient',
    primaryDiagnosis: 'Gastroesophageal Reflux Disease (GERD) & Acidity Cephalea',
    verified: true,
    createdAt: '2026-09-01T09:00:00.000Z'
  },
  {
    id: 2,
    name: 'Dr. Rajesh Sundaram',
    degrees: 'MBBS, MD (Internal Medicine), DM (Cardiology), FACC',
    regNo: 'MCI-TN-48201',
    username: 'doctor_demo',
    password: DEMO_PW_HASH,
    phone: '+91 98765 43211',
    email: 'dr.rajesh@apollo.medilingua.in',
    dob: '1980-08-20',
    age: 46,
    location: 'Apollo Hospitals, Greams Road, Chennai',
    language: 'English',
    role: 'doctor',
    specialty: 'Cardiology & Internal Medicine',
    experience: '18 Years',
    verified: true,
    createdAt: '2026-08-15T10:30:00.000Z'
  },
  {
    id: 3,
    name: 'Ananya Menon',
    cert: 'Certified Medical Interpreter (CMI #9042)',
    username: 'interpreter_demo',
    password: DEMO_PW_HASH,
    phone: '+91 98765 43212',
    email: 'ananya.interpreter@hub.medilingua.in',
    dob: '1995-11-03',
    age: 30,
    location: 'Kochi Medical Dispatch Command Hub',
    language: 'Malayalam',
    role: 'interpreter',
    languagesCovered: ['English', 'Tamil', 'Malayalam'],
    verified: true,
    createdAt: '2026-08-20T11:00:00.000Z'
  },
  {
    id: 4,
    name: 'Hospital Operations Administrator',
    dept: 'Department of Clinical Governance & Telehealth',
    username: 'admin_demo',
    password: DEMO_PW_HASH,
    phone: '+91 98765 43213',
    email: 'admin.ops@apollo.medilingua.in',
    dob: '1986-03-25',
    age: 40,
    location: 'Apollo Tele-OPD Operations Command Center',
    language: 'Hindi',
    role: 'admin',
    verified: true,
    createdAt: '2026-08-01T08:00:00.000Z'
  }
];

// Real Specialist Doctors Across Top Medical Institutes in India
const realDoctors = [
  {
    id: 101,
    name: 'Dr. Rajesh Sundaram',
    degrees: 'MBBS, MD (Internal Medicine), DM (Cardiology), FACC',
    regNo: 'MCI-TN-48201',
    specialty: 'Cardiology & Internal Medicine',
    hospital: 'Apollo Hospitals, Greams Road, Chennai',
    languages: ['English', 'Tamil'],
    rating: '4.9 / 5.0',
    reviews: 184,
    experience: '18 Years',
    fee: '₹700',
    initials: 'RS',
    availableToday: true,
    nextSlot: 'Today, 11:30 AM'
  },
  {
    id: 102,
    name: 'Dr. Kavitha Krishnan',
    degrees: 'MBBS, MD, DM (Neurology)',
    regNo: 'KMC-KA-39104',
    specialty: 'Neurology & Headache Clinic',
    hospital: 'Fortis Memorial Hospital, Bannerghatta Road, Bengaluru',
    languages: ['English', 'Tamil', 'Malayalam'],
    rating: '4.88 / 5.0',
    reviews: 142,
    experience: '14 Years',
    fee: '₹800',
    initials: 'KK',
    availableToday: true,
    nextSlot: 'Today, 02:15 PM'
  },
  {
    id: 103,
    name: 'Dr. Amit Verma',
    degrees: 'MBBS, MD (Medicine), DM (Endocrinology)',
    regNo: 'DMC-DL-55210',
    specialty: 'Diabetology & Endocrinology',
    hospital: 'Max Super Speciality Hospital, Saket, New Delhi',
    languages: ['English', 'Hindi'],
    rating: '4.85 / 5.0',
    reviews: 210,
    experience: '16 Years',
    fee: '₹650',
    initials: 'AV',
    availableToday: true,
    nextSlot: 'Today, 04:00 PM'
  },
  {
    id: 104,
    name: 'Dr. Sneha Reddy',
    degrees: 'MBBS, DCH, DNB (Pediatrics)',
    regNo: 'APMC-AP-62180',
    specialty: 'Pediatrics & Child Wellness',
    hospital: 'Rainbow Children\'s Hospital, Banjara Hills, Hyderabad',
    languages: ['English', 'Telugu', 'Hindi'],
    rating: '4.95 / 5.0',
    reviews: 260,
    experience: '11 Years',
    fee: '₹600',
    initials: 'SR',
    availableToday: true,
    nextSlot: 'Tomorrow, 10:00 AM'
  },
  {
    id: 105,
    name: 'Dr. Manoj Nair',
    degrees: 'MBBS, MD (Pulmonary Medicine), FCCP',
    regNo: 'TCMC-KL-28491',
    specialty: 'Pulmonology & Respiratory Care',
    hospital: 'Aster Medcity, Kochi, Kerala',
    languages: ['English', 'Malayalam', 'Tamil'],
    rating: '4.92 / 5.0',
    reviews: 175,
    experience: '17 Years',
    fee: '₹750',
    initials: 'MN',
    availableToday: false,
    nextSlot: 'Tomorrow, 11:30 AM'
  },
  {
    id: 106,
    name: 'Dr. Sunita Banerjee',
    degrees: 'MBBS, MS (Obstetrics & Gynecology), DGO',
    regNo: 'WBMC-WB-34820',
    specialty: 'Obstetrics & Women\'s Health',
    hospital: 'AMRI Hospitals, Salt Lake, Kolkata',
    languages: ['English', 'Bengali', 'Hindi'],
    rating: '4.89 / 5.0',
    reviews: 190,
    experience: '15 Years',
    fee: '₹700',
    initials: 'SB',
    availableToday: true,
    nextSlot: 'Today, 05:30 PM'
  },
  {
    id: 107,
    name: 'Dr. Vikramaditya Joshi',
    degrees: 'MBBS, MS (Orthopedics), MCh (Joint Replacement)',
    regNo: 'MMC-MH-71044',
    specialty: 'Orthopedics & Spine Specialist',
    hospital: 'Lilavati Hospital & Research Centre, Bandra, Mumbai',
    languages: ['English', 'Marathi', 'Hindi'],
    rating: '4.91 / 5.0',
    reviews: 160,
    experience: '19 Years',
    fee: '₹850',
    initials: 'VJ',
    availableToday: true,
    nextSlot: 'Tomorrow, 02:00 PM'
  },
  {
    id: 108,
    name: 'Dr. Ritu Saxena',
    degrees: 'MBBS, MD (Dermatology & Leprosy)',
    regNo: 'UPMS-UP-49302',
    specialty: 'Clinical Dermatology & Allergy',
    hospital: 'Medanta The Medicity, Gurugram, NCR',
    languages: ['English', 'Hindi'],
    rating: '4.87 / 5.0',
    reviews: 130,
    experience: '10 Years',
    fee: '₹600',
    initials: 'RS',
    availableToday: true,
    nextSlot: 'Today, 03:30 PM'
  }
];

let demoData = {
  appointments: [
    {
      id: 201,
      doctor: 'Dr. Rajesh Sundaram',
      specialty: 'Cardiology & Internal Medicine',
      patientName: 'Priya Sharma',
      mrn: 'MRN-TN-8821',
      date: '2026-09-28',
      time: '11:30 AM',
      status: 'Upcoming',
      type: 'Video Teleconsultation',
      roomCode: 'CLINIC-ROOM-782',
      language: 'Tamil ↔ English',
      interpreterRequired: true,
      interpreterName: 'Ananya Menon (Assigned)',
      symptoms: 'Substernal chest burning, post-prandial acidity, tension headache'
    },
    {
      id: 202,
      doctor: 'Dr. Kavitha Krishnan',
      specialty: 'Neurology',
      patientName: 'Priya Sharma',
      mrn: 'MRN-TN-8821',
      date: '2026-10-02',
      time: '03:00 PM',
      status: 'Scheduled',
      type: 'Follow-up Consultation',
      roomCode: 'CLINIC-ROOM-814',
      language: 'Tamil ↔ English',
      interpreterRequired: true,
      interpreterName: 'Pending Assignment',
      symptoms: 'Migraine follow-up review'
    },
    {
      id: 203,
      doctor: 'Dr. Amit Verma',
      specialty: 'Diabetology',
      patientName: 'Priya Sharma',
      mrn: 'MRN-TN-8821',
      date: '2026-09-14',
      time: '10:00 AM',
      status: 'Completed',
      type: 'Routine Review',
      roomCode: 'CLINIC-ROOM-551',
      language: 'English',
      interpreterRequired: false,
      symptoms: 'Quarterly fasting blood sugar evaluation'
    }
  ],

  'medical-records': [
    {
      id: 401,
      title: 'Electronic Prescription #RX-2026-8941',
      date: '2026-09-28',
      doctor: 'Dr. Rajesh Sundaram, MD',
      regNo: 'MCI-TN-48201',
      hospital: 'Apollo Telehealth Network, Chennai',
      diagnosis: 'Gastroesophageal Reflux Disease (ICD-10: K21.9) with Tension Cephalea',
      language: 'Tamil',
      medications: [
        {
          name: 'Tab. Pantoprazole 40mg (Pan 40)',
          dosage: '1 Tablet OD AC',
          timing: 'Morning 30 mins before breakfast (empty stomach)',
          duration: '14 Days',
          translatedTiming: 'காலை உணவுக்கு 30 நிமிடம் முன் 1 மாத்திரை (வெறும் வயிற்றில்)'
        },
        {
          name: 'Syr. Gelusil MPS (Aluminium & Magnesium Hydroxide)',
          dosage: '10 ml (2 teaspoons) TDS PC',
          timing: 'Post-prandial after lunch & dinner',
          duration: '7 Days',
          translatedTiming: 'மதிய உணவு மற்றும் இரவு உணவுக்குப் பின் 2 டீஸ்பூன் (10 மி.லி)'
        },
        {
          name: 'Tab. Paracetamol 650mg (Dolo 650)',
          dosage: '1 Tablet SOS',
          timing: 'Only when headache or mild fever occurs (Max 3/day)',
          duration: 'As needed',
          translatedTiming: 'காய்ச்சல் அல்லது கடுமையான தலைவலி ஏற்படும் போது மட்டும்'
        },
        {
          name: 'Tab. Telmisartan 40mg (Telma 40)',
          dosage: '1 Tablet OD',
          timing: 'Morning after breakfast for continuous BP maintenance',
          duration: '30 Days',
          translatedTiming: 'தினமும் காலை உணவுக்குப் பின் 1 மாத்திரை (ரத்த அழுத்தக் கட்டுப்பாடு)'
        }
      ],
      dietAdvice: 'Avoid heavy spicy dinners; maintain minimum 2-hour interval between meal and sleep.',
      translatedDiet: 'காரமான உணவுகளை தவிர்க்கவும்; இரவு உணவிற்கும் உறக்கத்திற்கும் 2 மணி நேர இடைவெளி தரவும்.'
    },
    {
      id: 402,
      title: 'Diagnostic Lab Evaluation: Comprehensive Metabolic & Glycemic Panel',
      date: '2026-09-20',
      lab: 'Apollo Diagnostic Tele-Laboratory',
      tests: [
        { name: 'Fasting Blood Sugar (FBS)', value: '94 mg/dL', reference: '70 - 99 mg/dL', status: 'Normal' },
        { name: 'Post-Prandial Glucose (PPBS)', value: '132 mg/dL', reference: '< 140 mg/dL', status: 'Normal' },
        { name: 'HbA1c (Glycated Hemoglobin)', value: '5.4 %', reference: '< 5.7 %', status: 'Optimal' },
        { name: 'Serum Creatinine', value: '0.82 mg/dL', reference: '0.60 - 1.10 mg/dL', status: 'Normal' },
        { name: 'Blood Urea Nitrogen (BUN)', value: '14 mg/dL', reference: '7 - 20 mg/dL', status: 'Normal' },
        { name: 'Total Cholesterol', value: '182 mg/dL', reference: '< 200 mg/dL', status: 'Normal' },
        { name: 'HDL Cholesterol (Good)', value: '52 mg/dL', reference: '> 50 mg/dL', status: 'Optimal' },
        { name: 'Serum Triglycerides', value: '130 mg/dL', reference: '< 150 mg/dL', status: 'Normal' },
        { name: 'Hemoglobin (Hb)', value: '13.4 g/dL', reference: '12.0 - 15.5 g/dL', status: 'Normal' }
      ]
    },
    {
      id: 403,
      title: 'Neurological Follow-Up Note & EEG Telemetry',
      date: '2026-08-15',
      doctor: 'Dr. Kavitha Krishnan, DM',
      hospital: 'Fortis Virtual Neuro Center, Bengaluru',
      diagnosis: 'Episodic Migraine without Aura (ICD-10: G43.0)',
      summary: 'Patient presented with unilateral throbbing headache with photophobia. Sleep hygiene, hydration, and prophylactic magnesium glycinate recommended.'
    }
  ],

  messages: [
    {
      id: 501,
      from: 'Clinical Care Coordinator',
      role: 'admin',
      time: '09:15 AM',
      text: 'Good morning Priya. Your video consultation with Dr. Rajesh Sundaram is scheduled for 11:30 AM today. A certified Tamil medical interpreter has been assigned.',
      translated: 'காலை வணக்கம் பிரியா. டாக்டர் ராஜேஷ் சுந்தரத்துடனான உங்கள் ஆலோசனை இன்று காலை 11:30 மணிக்கு திட்டமிடப்பட்டுள்ளது. சான்றளிக்கப்பட்ட தமிழ் மொழிபெயர்ப்பாளர் நியமிக்கப்பட்டுள்ளார்.'
    },
    {
      id: 502,
      from: 'Priya Sharma',
      role: 'patient',
      time: '09:30 AM',
      text: 'நன்றி. மருத்துவரிடம் பேசுவதற்கு முன்பு எனது சமீபத்திய ரத்த பரிசோதனை அறிக்கையை மீண்டும் பதிவேற்ற வேண்டுமா?',
      translated: 'Thank you. Do I need to re-upload my recent blood test report before speaking with the doctor?'
    },
    {
      id: 503,
      from: 'Dr. Rajesh Sundaram',
      role: 'doctor',
      time: '10:05 AM',
      text: 'Hello Priya, your diagnostic lab evaluation from Sep 20th is already synced in my clinical dashboard. Fasting glucose and HbA1c are optimal. See you at 11:30 AM.',
      translated: 'வணக்கம் பிரியா, செப்டம்பர் 20-ஆம் தேதியிட்ட உங்கள் ஆய்வக அறிக்கை ஏற்கனவே எனது பக்கத்தில் இணைந்துள்ளது. குளுக்கோஸ் மற்றும் எச்பிஏ1சி இயல்பாக உள்ளது. 11:30 மணிக்கு சந்திப்போம்.'
    },
    {
      id: 504,
      from: 'Ananya Menon (Interpreter)',
      role: 'interpreter',
      time: '10:15 AM',
      text: 'வணக்கம் பிரியா, நான் அனன்யா. இன்றைய ஆலோசனையில் உங்கள் கேள்விகளை மருத்துவருக்கு துல்லியமாக மொழிபெயர்க்க நான் உடன் இருப்பேன்.',
      translated: 'Hello Priya, I am Ananya. I will be present in today’s session to smoothly translate your questions to the doctor.'
    }
  ],

  requests: [
    {
      id: 601,
      patientName: 'Priya Sharma',
      doctorName: 'Dr. Rajesh Sundaram',
      sourceLang: 'Tamil',
      targetLang: 'English',
      urgency: 'Scheduled',
      status: 'Assigned',
      assignedTo: 'Ananya Menon, CMI',
      time: 'Today, 11:30 AM',
      notes: 'Cardiology teleconsultation language support'
    },
    {
      id: 602,
      patientName: 'Suresh Kumar',
      doctorName: 'Dr. Sneha Reddy',
      sourceLang: 'Telugu',
      targetLang: 'English',
      urgency: 'Urgent (OPD)',
      status: 'Pending Dispatch',
      assignedTo: 'Auto-matching certified interpreter...',
      time: 'Today, 12:15 PM',
      notes: 'Pediatric high fever inquiry'
    },
    {
      id: 603,
      patientName: 'Lakshmi Amma',
      doctorName: 'Dr. Amit Verma',
      sourceLang: 'Malayalam',
      targetLang: 'Hindi',
      urgency: 'Routine',
      status: 'Completed',
      assignedTo: 'Ananya Menon, CMI',
      time: 'Yesterday, 04:30 PM',
      notes: 'Prescription instruction translation in Malayalam'
    }
  ]
};

function token(u) {
  return jwt.sign({ id: u.id, role: u.role, username: u.username }, SECRET, { expiresIn: '8h' });
}

function safe(u) {
  const { password, ...x } = u;
  return x;
}

function auth(req, res, next) {
  try {
    const raw = req.headers.authorization || '';
    const p = jwt.verify(raw.replace('Bearer ', ''), SECRET);
    req.user = users.find(x => x.id === p.id);
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    next();
  } catch (e) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'MediLingua Telemedicine Enterprise API', version: '2.5' }));

// Send OTP Demo
app.post('/api/auth/send-otp', (req, res) => {
  if (!req.body.phone) return res.status(400).json({ message: 'Phone is required' });
  res.json({ message: 'OTP sent successfully. Demo OTP: 123456' });
});

// Full Registration
app.post('/api/auth/register', async (req, res) => {
  const { name, username, password, phone, email, dob, age, location, language, role = 'patient', regNo, cert } = req.body;
  if (!name || !username || !password || !phone || !email || !dob || !location || !language) {
    return res.status(400).json({ message: 'All required registration fields must be completed.' });
  }
  if (!roles.includes(role)) return res.status(400).json({ message: 'Invalid role selection.' });
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({ message: 'Username is already registered.' });
  }

  const mrn = role === 'patient' ? `MRN-IN-${Math.floor(1000 + Math.random() * 9000)}` : undefined;

  const u = {
    id: users.length + 1,
    name,
    username,
    mrn,
    regNo: regNo || (role === 'doctor' ? `NMC-IN-${Math.floor(10000 + Math.random() * 90000)}` : undefined),
    cert: cert || (role === 'interpreter' ? `CMI-IN-${Math.floor(1000 + Math.random() * 9000)}` : undefined),
    password: await bcrypt.hash(password, 10),
    phone,
    email,
    dob,
    age: parseInt(age) || 30,
    location,
    language,
    role,
    verified: true,
    createdAt: new Date().toISOString()
  };
  users.push(u);
  res.status(201).json({ message: 'Account registered successfully', token: token(u), user: safe(u) });
});

// Standard Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password, role } = req.body;
  const u = users.find(x => x.username.toLowerCase() === (username || '').toLowerCase() && (!role || x.role === role));
  if (!u || !(await bcrypt.compare(password, u.password))) {
    return res.status(401).json({ message: 'Invalid username, password, or role credential.' });
  }
  res.json({ token: token(u), user: safe(u) });
});

// 1-Click Demo Login Route
app.post('/api/auth/demo-login', (req, res) => {
  const { role = 'patient' } = req.body;
  const u = users.find(x => x.role === role) || users[0];
  res.json({
    message: `Logged in as demo ${role}`,
    token: token(u),
    user: safe(u)
  });
});

// Get user profile / current user list
app.get('/api/users', auth, (req, res) => res.json(users.map(safe)));

// Update Profile
app.put('/api/profile', auth, (req, res) => {
  const allowed = ['name', 'username', 'phone', 'email', 'dob', 'location', 'language'];
  for (const k of allowed) {
    if (req.body[k] !== undefined) req.user[k] = req.body[k];
  }
  if (req.body.dob) {
    const d = new Date(req.body.dob);
    const n = new Date();
    req.user.age = n.getFullYear() - d.getFullYear() - ((n.getMonth() + 1 < d.getMonth() + 1) || (n.getMonth() + 1 === d.getMonth() + 1 && n.getDate() < d.getDate()) ? 1 : 0);
  }
  res.json({ message: 'Profile updated successfully', user: safe(req.user) });
});

// Doctors list
app.get('/api/doctors', (req, res) => res.json(realDoctors));

// Get full demo bundle
app.get('/api/demo-data', (req, res) => {
  res.json({
    doctors: realDoctors,
    ...demoData
  });
});

app.get('/api/demo/:type', (req, res) => {
  const key = req.params.type;
  if (key === 'doctors' || key === 'find-doctors') return res.json(realDoctors);
  res.json(demoData[key] || [{ message: 'Demo module ready' }]);
});

// Dynamic booking demo endpoint
app.post('/api/demo/appointments', (req, res) => {
  const { doctor, date, time, language, symptoms, type = 'Video Teleconsultation' } = req.body;
  const newAppt = {
    id: Date.now(),
    doctor: doctor || 'Dr. Rajesh Sundaram',
    specialty: 'Cardiology & Internal Medicine',
    patientName: req.body.patientName || 'Priya Sharma',
    mrn: req.body.mrn || 'MRN-TN-8821',
    date: date || '2026-10-05',
    time: time || '02:00 PM',
    status: 'Scheduled',
    type,
    roomCode: `CLINIC-ROOM-${Math.floor(100 + Math.random() * 900)}`,
    language: language || 'Tamil ↔ English',
    interpreterRequired: true,
    interpreterName: 'Assigned on Call Join',
    symptoms: symptoms || 'General medical follow-up'
  };
  demoData.appointments.unshift(newAppt);
  res.json({ message: 'Appointment booked successfully', appointment: newAppt });
});

// Dynamic message post
app.post('/api/demo/messages', (req, res) => {
  const { from, role, text, translated } = req.body;
  const newMsg = {
    id: Date.now(),
    from: from || 'You',
    role: role || 'patient',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text,
    translated: translated || text
  };
  demoData.messages.push(newMsg);
  res.json({ message: 'Message sent', messageItem: newMsg });
});

// Serve static frontend build if present
const candidateDistPaths = [
  path.resolve(__dirname, '../frontend/dist'),
  path.resolve(__dirname, './dist'),
  path.resolve(__dirname, './public')
];

const frontendDistPath = candidateDistPaths.find(p => fs.existsSync(p));

if (frontendDistPath) {
  console.log(`[MediLingua] Production mode: Serving frontend assets from ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));

  // Catch-all route to serve React's index.html for client-side routing (compatible with Express 4 & 5)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(frontendDistPath, 'index.html'));
    }
    next();
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'MediLingua Telemedicine Backend API is running.',
      environment: process.env.NODE_ENV || 'development',
      health: '/api/health',
      notice: 'Frontend build not found at ../frontend/dist. Run "npm run build" in frontend directory to enable unified serving.'
    });
  });
}

const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`MediLingua Telehealth server running on http://${HOST}:${PORT}`);
  console.log(`Pre-seeded demo accounts ready:`);
  console.log(` - Patient: patient_demo / demo123 (Priya Sharma, MRN-TN-8821, Tamil)`);
  console.log(` - Doctor: doctor_demo / demo123 (Dr. Rajesh Sundaram, MCI-TN-48201, English)`);
  console.log(` - Interpreter: interpreter_demo / demo123 (Ananya Menon, CMI #9042, Malayalam/Tamil)`);
  console.log(` - Admin: admin_demo / demo123 (Hospital Ops Admin, Hindi)`);
});
