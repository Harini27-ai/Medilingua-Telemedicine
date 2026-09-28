import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import {
  Video, Phone, MessageSquare, Calendar, FileText, Users, ShieldCheck,
  Globe, Activity, CheckCircle, Clock, Search, ArrowRight,
  LogOut, Stethoscope, Mic, MicOff, Camera, CameraOff,
  User, Check, AlertCircle, RefreshCw, Send, UserCog, UserPlus, LogIn,
  ClipboardList, Layers, FileCheck2
} from 'lucide-react';
import './styles.css';

const API = import.meta.env.VITE_API_URL || '/api';
const langs = ['English', 'Tamil', 'Telugu', 'Malayalam', 'Hindi', 'Bengali', 'Marathi'];
const roles = ['patient', 'doctor', 'admin', 'interpreter'];
const roleLabel = r => (r ? r.charAt(0).toUpperCase() + r.slice(1) : '');

// Real clinical demo profiles for 1-click evaluation
const DEMO_ACCOUNTS = {
  patient: {
    id: 1,
    name: 'Priya Sharma',
    mrn: 'MRN-TN-8821',
    username: 'patient_demo',
    phone: '+91 98765 43210',
    email: 'priya.sharma@patient.medilingua.in',
    dob: '1994-05-12',
    age: 32,
    location: 'Chennai, Tamil Nadu',
    language: 'Tamil',
    role: 'patient',
    primaryDiagnosis: 'Gastroesophageal Reflux Disease (GERD) & Acidity Cephalea'
  },
  doctor: {
    id: 2,
    name: 'Dr. Rajesh Sundaram',
    degrees: 'MBBS, MD (Internal Medicine), DM (Cardiology), FACC',
    regNo: 'MCI-TN-48201',
    username: 'doctor_demo',
    phone: '+91 98765 43211',
    email: 'dr.rajesh@apollo.medilingua.in',
    dob: '1980-08-20',
    age: 46,
    location: 'Apollo Hospitals, Greams Road, Chennai',
    language: 'English',
    role: 'doctor',
    specialty: 'Cardiology & Internal Medicine'
  },
  interpreter: {
    id: 3,
    name: 'Ananya Menon',
    cert: 'Certified Medical Interpreter (CMI #9042)',
    username: 'interpreter_demo',
    phone: '+91 98765 43212',
    email: 'ananya.interpreter@hub.medilingua.in',
    dob: '1995-11-03',
    age: 30,
    location: 'Kochi Medical Dispatch Command Hub',
    language: 'Malayalam',
    role: 'interpreter',
    languagesCovered: ['English', 'Tamil', 'Malayalam']
  },
  admin: {
    id: 4,
    name: 'Hospital Operations Administrator',
    dept: 'Department of Clinical Governance & Telehealth',
    username: 'admin_demo',
    phone: '+91 98765 43213',
    email: 'admin.ops@apollo.medilingua.in',
    dob: '1986-03-25',
    age: 40,
    location: 'Apollo Tele-OPD Operations Command Center',
    language: 'Hindi',
    role: 'admin'
  }
};

// Real Specialist Physicians Across Top Indian Medical Institutes
const INITIAL_DOCTORS = [
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
    nextSlot: 'Today, 04:00 PM'
  },
  {
    id: 104,
    name: 'Dr. Sneha Reddy',
    degrees: 'MBBS, DCH, DNB (Pediatrics)',
    regNo: 'APMC-AP-62180',
    specialty: 'Pediatrics & Neonatal Care',
    hospital: 'Rainbow Children\'s Hospital, Banjara Hills, Hyderabad',
    languages: ['English', 'Telugu', 'Hindi'],
    rating: '4.95 / 5.0',
    reviews: 260,
    experience: '11 Years',
    fee: '₹600',
    initials: 'SR',
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
    nextSlot: 'Today, 05:30 PM'
  },
  {
    id: 107,
    name: 'Dr. Vikramaditya Joshi',
    degrees: 'MBBS, MS (Orthopedics), MCh',
    regNo: 'MMC-MH-71044',
    specialty: 'Orthopedics & Spine Specialist',
    hospital: 'Lilavati Hospital & Research Centre, Bandra, Mumbai',
    languages: ['English', 'Marathi', 'Hindi'],
    rating: '4.91 / 5.0',
    reviews: 160,
    experience: '19 Years',
    fee: '₹850',
    initials: 'VJ',
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
    nextSlot: 'Today, 03:30 PM'
  }
];

const INITIAL_APPOINTMENTS = [
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
];

const INITIAL_MESSAGES = [
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
];

const INITIAL_RECORDS = [
  {
    id: 401,
    title: 'Electronic Prescription #RX-2026-8941',
    date: '2026-09-28',
    doctor: 'Dr. Rajesh Sundaram, MD',
    regNo: 'MCI-TN-48201',
    hospital: 'Apollo Hospitals, Greams Road, Chennai',
    diagnosis: 'Gastroesophageal Reflux Disease (ICD-10: K21.9) with Mild Cephalea',
    language: 'Tamil',
    medications: [
      {
        name: 'Tab. Pantoprazole 40mg (Pan 40)',
        dosage: '1 Tablet OD AC',
        timing: 'Morning 30 mins before food (empty stomach)',
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
        timing: 'Only if headache or mild fever occurs (Max 3 tabs/day)',
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
    lab: 'Apollo Diagnostic Tele-Laboratory, Chennai',
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
  }
];

const INITIAL_REQUESTS = [
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
];

// INSTITUTIONAL HEADER WITH VISIBLE SIGN IN & SIGN UP OPTIONS
function Header() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.clear();
    nav('/');
  };

  return (
    <>
      <div className="institutional-bar">
        <div className="institutional-bar-left">
          <span>GOVERNMENT OF INDIA HEALTHCARE TELEMEDICINE FRAMEWORK COMPLIANT</span>
          <span style={{ color: 'var(--slate-500)' }}>|</span>
          <span>DISHA & HIPAA STANDARDS VERIFIED</span>
        </div>
        <div className="institutional-bar-right">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="status-dot-green"></span> 24/7 Translation Grid: Active
          </span>
          <span style={{ color: 'var(--slate-500)' }}>|</span>
          <span>Toll-Free Tele-OPD: 1800-419-MED</span>
        </div>
      </div>

      <header className="clinical-nav">
        <div className="clinical-brand">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="clinical-logo-mark">ML</div>
            <div className="clinical-brand-text">
              <b>MediLingua</b>
              <span>National Telemedicine Access</span>
            </div>
          </Link>
        </div>

        <nav className="clinical-nav-links">
          <a href="/#demo-console">Interactive Demo Console</a>
          <a href="/#services">Clinical Services</a>
          <a href="/#directory">Physicians</a>
          <a href="/#governance">Governance & Standards</a>
        </nav>

        <div className="clinical-nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link to="/dashboard" className="btn small primary-navy">
                <User size={14} /> Open Portal ({user.name.split(' ')[0]})
              </Link>
              <button onClick={logout} className="btn small secondary-outline" title="Sign Out">
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn small secondary-outline">
                <LogIn size={14} /> Sign In
              </Link>
              <Link to="/register" className="btn small primary-navy">
                <UserPlus size={14} /> Sign Up / Register
              </Link>
            </>
          )}
        </div>
      </header>
    </>
  );
}

// HOME PAGE
function Home() {
  const nav = useNavigate();
  const [selectedLang, setSelectedLang] = useState('Tamil');
  const [activeConsoleMenu, setActiveConsoleMenu] = useState('patient');
  const [activeSpeaker, setActiveSpeaker] = useState('doctor');
  const [bookingModalDoc, setBookingModalDoc] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const launchDemo = async (role) => {
    try {
      const res = await fetch(API + '/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        const d = await res.json();
        localStorage.setItem('token', d.token);
        localStorage.setItem('user', JSON.stringify(d.user));
        nav('/dashboard');
        return;
      }
    } catch (e) {
      // Backend fallback
    }
    const acc = DEMO_ACCOUNTS[role];
    localStorage.setItem('token', 'local-demo-token-' + role);
    localStorage.setItem('user', JSON.stringify(acc));
    nav('/dashboard');
  };

  const previewPhrases = {
    Tamil: {
      patientText: 'எனக்கு கடந்த இரண்டு நாட்களாக கடுமையான நெஞ்சு எரிச்சலும் தலைவலியும் உள்ளது.',
      patientTrans: 'Patient reports: Severe heartburn and tension headache for the past two days.',
      docText: 'Dr. Rajesh: Does the burning sensation increase immediately post-meals or when lying flat?',
      docTrans: 'மருத்துவர்: உணவு உண்ட பின் அல்லது படுக்கும் போது நெஞ்சு எரிச்சல் அதிகரிக்கிறதா?'
    },
    Telugu: {
      patientText: 'నాకు గత రెండు రోజులుగా తీవ్రమైన ఛాతీ మంట మరియు తలనొప్పిగా ఉంది.',
      patientTrans: 'Patient reports: Severe chest burning and persistent headache for two days.',
      docText: 'Dr. Rajesh: We will examine for acid reflux and adjust your antacid dosage schedule.',
      docTrans: 'వైద్యుడు: మేము యాసిడ్ రిఫ్లక్స్ కోసం పరిశీలించి మీ మందుల మోతాదును సర్దుబాటు చేస్తాము.'
    },
    Hindi: {
      patientText: 'मुझे पिछले दो दिनों से सीने में तेज जलन और सिरदर्द महसूस हो रहा है।',
      patientTrans: 'Patient reports: Acute substernal burning and tension headache for 2 days.',
      docText: 'Dr. Rajesh: Avoid spicy dinners and take Pantoprazole 30 mins before breakfast.',
      docTrans: 'डॉक्टर: मसालेदार भोजन से बचें और नाश्ते से 30 मिनट पहले पैंटोप्राजोल लें।'
    },
    Malayalam: {
      patientText: 'എനിക്ക് കഴിഞ്ഞ രണ്ട് ദിവസമായി കഠിനമായ നെഞ്ചെരിച്ചിലും തലവേദനയും ഉണ്ട്.',
      patientTrans: 'Patient reports: Severe heartburn and headache persisting for the last 2 days.',
      docText: 'Dr. Rajesh: This indicates GERD. Let us prescribe an antacid and evaluate your ECG.',
      docTrans: 'ഡോക്ടർ: ഇത് ജിഇആർഡിയെ സൂചിപ്പിക്കുന്നു. ആൻ്റാസിഡ് കഴിച്ച് ഇസിജി പരിശോധിക്കാം.'
    }
  };

  const curPreview = previewPhrases[selectedLang] || previewPhrases.Tamil;

  return (
    <>
      <Header />

      {/* CLINICAL HERO SECTION WITH SUBTLE SOOTHING BACKGROUND */}
      <section className="clinical-hero">
        <div className="clinical-hero-inner">
          <div>
            <div className="clinical-hero-badge">
              <span className="status-dot-green"></span>
              National Clinical Telemedicine Access Platform · 5 Regional Languages
            </div>
            <h1 className="clinical-hero-title">
              Equitable Healthcare Access Across Regional Languages.
            </h1>
            <p className="clinical-hero-desc">
              MediLingua connects patients speaking regional mother tongues with specialist physicians and certified medical interpreters through real-time medical translation, encrypted teleconsultations, and localized EHR records.
            </p>
            <div className="clinical-hero-actions">
              <Link to="/register" className="btn primary-navy">
                <UserPlus size={15} /> Create Patient / Doctor Account
              </Link>
              <Link to="/login" className="btn secondary-outline">
                <LogIn size={15} /> Portal Sign In
              </Link>
              <a href="#demo-console" className="btn secondary-outline">
                <Layers size={15} /> Open Live Demo Console
              </a>
            </div>
            <div className="clinical-meta-grid">
              <div className="meta-metric">
                <b>&lt; 180 ms</b>
                <span>Translation Response</span>
              </div>
              <div className="meta-metric">
                <b>5 Dialects</b>
                <span>Tamil, Telugu, Hindi, Mal, Eng</span>
              </div>
              <div className="meta-metric">
                <b>100% DISHA</b>
                <span>Health Data Compliant</span>
              </div>
            </div>
          </div>

          {/* REAL-TIME SPEECH TRANSLATION PANEL */}
          <div className="clinical-hero-preview">
            <div className="preview-header">
              <div className="preview-title">
                <Globe size={16} color="var(--med-blue-700)" />
                <span>Live Speech Translation Engine</span>
              </div>
              <span className="chip green">
                <span className="status-dot-green"></span> Active Grid
              </span>
            </div>

            <div className="lang-tabs-bar">
              {['Tamil', 'Telugu', 'Hindi', 'Malayalam'].map(l => (
                <button
                  key={l}
                  className={`lang-tab-item ${selectedLang === l ? 'active' : ''}`}
                  onClick={() => setSelectedLang(l)}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="preview-dialog-stream">
              <div className="preview-speech-card">
                <div className="preview-card-meta">
                  <span>Patient Speech Input ({selectedLang})</span>
                  <span>Audio: Optimal</span>
                </div>
                <div>{curPreview.patientText}</div>
                <div className="preview-trans-row">
                  <ArrowRight size={12} />
                  <span>{curPreview.patientTrans}</span>
                </div>
              </div>

              <div className="preview-speech-card">
                <div className="preview-card-meta">
                  <span>Physician Clinical Response (English)</span>
                  <span>Dr. Rajesh Sundaram, MD</span>
                </div>
                <div>{curPreview.docText}</div>
                <div className="preview-trans-row" style={{ color: 'var(--navy-900)' }}>
                  <Check size={12} color="var(--status-normal)" />
                  <span>{curPreview.docTrans}</span>
                </div>
              </div>
            </div>

            <div className="preview-footer-telemetry">
              <span>Interpreter: Ananya Menon (Connected)</span>
              <span>Latency: 142ms · Confidence: 99.4%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          INTERACTIVE DEMO CONSOLE: MENUS ON LEFT SIDE ONE BY ONE
          ========================================================================== */}
      <section id="demo-console" className="demo-console-section">
        <div className="section-title-clinical">
          <span>Clinical Demonstration Console</span>
          <h2>Explore the Platform with Rich Pre-Loaded Datasets</h2>
          <p>
            Select any module from the left menu to inspect live clinical workflows, real hospital data, and translated records.
          </p>
        </div>

        <div className="console-split-layout">
          {/* ==========================================
              LEFT-SIDE MENU LIST (ARRANGED ONE BY ONE)
              ========================================== */}
          <aside className="console-left-sidebar">
            <div className="console-sidebar-header">
              <b>Interactive Demo Modules</b>
              <small>Click to switch active workspace</small>
            </div>

            <div className="console-menu-group-label">Role Exploration Sandboxes</div>

            <button
              className={`console-menu-item ${activeConsoleMenu === 'patient' ? 'active' : ''}`}
              onClick={() => setActiveConsoleMenu('patient')}
            >
              <div className="menu-item-icon-box"><User size={15} /></div>
              <div className="menu-item-text">
                <div className="menu-item-title">
                  <span>Patient Portal</span>
                  <span className="chip slate" style={{ fontSize: 10 }}>Priya S.</span>
                </div>
                <div className="menu-item-sub">Tamil · MRN-TN-8821</div>
              </div>
            </button>

            <button
              className={`console-menu-item ${activeConsoleMenu === 'doctor' ? 'active' : ''}`}
              onClick={() => setActiveConsoleMenu('doctor')}
            >
              <div className="menu-item-icon-box"><Stethoscope size={15} /></div>
              <div className="menu-item-text">
                <div className="menu-item-title">
                  <span>Physician Console</span>
                  <span className="chip slate" style={{ fontSize: 10 }}>Dr. Rajesh</span>
                </div>
                <div className="menu-item-sub">Cardiology · MCI-TN-48201</div>
              </div>
            </button>

            <button
              className={`console-menu-item ${activeConsoleMenu === 'interpreter' ? 'active' : ''}`}
              onClick={() => setActiveConsoleMenu('interpreter')}
            >
              <div className="menu-item-icon-box"><Globe size={15} /></div>
              <div className="menu-item-text">
                <div className="menu-item-title">
                  <span>Interpreter Hub</span>
                  <span className="chip slate" style={{ fontSize: 10 }}>Ananya M.</span>
                </div>
                <div className="menu-item-sub">Tamil / Malayalam / English</div>
              </div>
            </button>

            <button
              className={`console-menu-item ${activeConsoleMenu === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveConsoleMenu('admin')}
            >
              <div className="menu-item-icon-box"><ShieldCheck size={15} /></div>
              <div className="menu-item-text">
                <div className="menu-item-title">
                  <span>Hospital Admin</span>
                  <span className="chip slate" style={{ fontSize: 10 }}>Governance</span>
                </div>
                <div className="menu-item-sub">Telemetry & DISHA Audit Logs</div>
              </div>
            </button>

            <div className="console-menu-group-label" style={{ marginTop: 10 }}>Clinical Modules</div>

            <button
              className={`console-menu-item ${activeConsoleMenu === 'video-room' ? 'active' : ''}`}
              onClick={() => setActiveConsoleMenu('video-room')}
            >
              <div className="menu-item-icon-box"><Video size={15} /></div>
              <div className="menu-item-text">
                <div className="menu-item-title">
                  <span>Live Video Room</span>
                  <span className="chip green" style={{ fontSize: 10 }}>Dual Subtitles</span>
                </div>
                <div className="menu-item-sub">Real-Time Subtitle Translation</div>
              </div>
            </button>

            <button
              className={`console-menu-item ${activeConsoleMenu === 'prescription' ? 'active' : ''}`}
              onClick={() => setActiveConsoleMenu('prescription')}
            >
              <div className="menu-item-icon-box"><FileText size={15} /></div>
              <div className="menu-item-text">
                <div className="menu-item-title">
                  <span>Localized E-Rx</span>
                  <span className="chip blue" style={{ fontSize: 10 }}>Pan 40 · Dolo</span>
                </div>
                <div className="menu-item-sub">Tamil Dosage Instructions</div>
              </div>
            </button>

            <button
              className={`console-menu-item ${activeConsoleMenu === 'booking' ? 'active' : ''}`}
              onClick={() => setActiveConsoleMenu('booking')}
            >
              <div className="menu-item-icon-box"><Calendar size={15} /></div>
              <div className="menu-item-text">
                <div className="menu-item-title">
                  <span>Physician Directory</span>
                  <span className="chip slate" style={{ fontSize: 10 }}>8 Specialists</span>
                </div>
                <div className="menu-item-sub">Apollo, Fortis, Max, Medanta</div>
              </div>
            </button>
          </aside>

          {/* ==========================================
              RIGHT-SIDE WORKSPACE
              ========================================== */}
          <main className="console-right-workspace">
            {activeConsoleMenu === 'patient' && (
              <div>
                <div className="workspace-top-bar">
                  <div>
                    <h3>Patient Portal Simulation: Priya Sharma</h3>
                    <p>Demonstrating how a regional language speaker interacts with scheduled teleconsultations.</p>
                  </div>
                  <button className="btn primary-navy" onClick={() => launchDemo('patient')}>
                    Open Full-Screen Patient Portal <ArrowRight size={14} />
                  </button>
                </div>

                <div className="persona-clinical-card">
                  <div className="persona-initials-badge">
                    PS
                    <small>PATIENT</small>
                  </div>
                  <div className="persona-details">
                    <h4>Priya Sharma</h4>
                    <div className="persona-clinical-meta">
                      <span>MRN: <b>MRN-TN-8821</b></span>
                      <span>Age: <b>32 / Female</b></span>
                      <span>Location: <b>Chennai, Tamil Nadu</b></span>
                      <span>Primary Language: <b style={{ color: 'var(--med-blue-700)' }}>Tamil (தமிழ்)</b></span>
                    </div>
                    <div className="persona-scope-list">
                      <span>Upcoming Cardiology Video Consultation (11:30 AM Today)</span>
                      <span>Tamil-Translated E-Prescription Active</span>
                      <span>Metabolic Panel Diagnostic Reports Synced</span>
                    </div>
                  </div>
                  <div>
                    <button className="btn small primary-navy" onClick={() => launchDemo('patient')}>
                      Sign In As Priya
                    </button>
                  </div>
                </div>

                <div className="dash-panel" style={{ marginTop: 20 }}>
                  <div className="dash-panel-head">
                    <h3>Preloaded Patient EHR Summary</h3>
                    <span className="chip green">Verified Session</span>
                  </div>
                  <table className="clinical-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Physician</th>
                        <th>Hospital / Specialty</th>
                        <th>Language Pair</th>
                        <th>Assigned Interpreter</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><b>Today, 11:30 AM</b></td>
                        <td>Dr. Rajesh Sundaram, MD</td>
                        <td>Apollo Hospitals, Chennai (Cardiology)</td>
                        <td><span className="chip blue">Tamil ↔ English</span></td>
                        <td>Ananya Menon, CMI</td>
                        <td><span className="chip green">Ready in Room</span></td>
                      </tr>
                      <tr>
                        <td>02 Oct 2026, 03:00 PM</td>
                        <td>Dr. Kavitha Krishnan, DM</td>
                        <td>Fortis Memorial, Bengaluru (Neurology)</td>
                        <td><span className="chip blue">Tamil ↔ English</span></td>
                        <td>Pending Assignment</td>
                        <td><span className="chip slate">Scheduled</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeConsoleMenu === 'doctor' && (
              <div>
                <div className="workspace-top-bar">
                  <div>
                    <h3>Physician Console: Dr. Rajesh Sundaram, MD</h3>
                    <p>Demonstrates clinical intake, dual-language speech translation, and digital prescription issuance.</p>
                  </div>
                  <button className="btn primary-navy" onClick={() => launchDemo('doctor')}>
                    Open Full-Screen Doctor Portal <ArrowRight size={14} />
                  </button>
                </div>

                <div className="persona-clinical-card">
                  <div className="persona-initials-badge" style={{ background: 'var(--med-blue-700)' }}>
                    RS
                    <small>PHYSICIAN</small>
                  </div>
                  <div className="persona-details">
                    <h4>Dr. Rajesh Sundaram, MD, DM (Cardiology), FACC</h4>
                    <div className="persona-clinical-meta">
                      <span>Registration: <b>MCI-TN-48201</b></span>
                      <span>Hospital: <b>Apollo Hospitals, Greams Road, Chennai</b></span>
                      <span>Languages: <b>English, Tamil</b></span>
                    </div>
                    <div className="persona-scope-list">
                      <span>Active Tele-OPD Queue: 3 Patients</span>
                      <span>Speech-to-English Neural Translation Active</span>
                      <span>Digital Rx Signature Authority</span>
                    </div>
                  </div>
                  <div>
                    <button className="btn small primary-navy" onClick={() => launchDemo('doctor')}>
                      Sign In As Dr. Rajesh
                    </button>
                  </div>
                </div>

                <div className="dash-panel" style={{ marginTop: 20 }}>
                  <div className="dash-panel-head">
                    <h3>Today's Tele-OPD Consultation Queue</h3>
                    <span className="chip blue">3 Patients Waiting</span>
                  </div>
                  <table className="clinical-table">
                    <thead>
                      <tr>
                        <th>Queue #</th>
                        <th>Patient Name</th>
                        <th>Age / Gender</th>
                        <th>Language</th>
                        <th>Chief Complaint</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><b>#01</b></td>
                        <td>Priya Sharma</td>
                        <td>32y / F</td>
                        <td><span className="chip blue">Tamil</span></td>
                        <td>Substernal chest tightness & heartburn</td>
                        <td><button className="btn small primary-navy" onClick={() => setActiveConsoleMenu('video-room')}>Start Consult</button></td>
                      </tr>
                      <tr>
                        <td><b>#02</b></td>
                        <td>Venkat Rao</td>
                        <td>48y / M</td>
                        <td><span className="chip blue">Telugu</span></td>
                        <td>Type 2 Diabetes glycemic follow-up</td>
                        <td><button className="btn small secondary-outline">Open Chart</button></td>
                      </tr>
                      <tr>
                        <td><b>#03</b></td>
                        <td>Omana Kurian</td>
                        <td>61y / F</td>
                        <td><span className="chip blue">Malayalam</span></td>
                        <td>Hypertension & asthma follow-up</td>
                        <td><button className="btn small secondary-outline">Open Chart</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeConsoleMenu === 'interpreter' && (
              <div>
                <div className="workspace-top-bar">
                  <div>
                    <h3>Certified Medical Interpreter Hub: Ananya Menon, CMI</h3>
                    <p>Demonstrates live 3-way conference dispatch and certified medical translation assistance.</p>
                  </div>
                  <button className="btn primary-navy" onClick={() => launchDemo('interpreter')}>
                    Open Full-Screen Interpreter Portal <ArrowRight size={14} />
                  </button>
                </div>

                <div className="persona-clinical-card">
                  <div className="persona-initials-badge" style={{ background: 'var(--navy-800)' }}>
                    AM
                    <small>INTERPRETER</small>
                  </div>
                  <div className="persona-details">
                    <h4>Ananya Menon</h4>
                    <div className="persona-clinical-meta">
                      <span>Certification: <b>Certified Medical Interpreter (CMI #9042)</b></span>
                      <span>Working Dialects: <b>Tamil, Malayalam, English</b></span>
                      <span>Dispatch Center: <b>Kochi Medical Command Hub</b></span>
                    </div>
                    <div className="persona-scope-list">
                      <span>Live 3-Way Conference Bridge</span>
                      <span>Medical Terminology Glossaries</span>
                      <span>Patient Cultural Mediation</span>
                    </div>
                  </div>
                  <div>
                    <button className="btn small primary-navy" onClick={() => launchDemo('interpreter')}>
                      Sign In As Ananya
                    </button>
                  </div>
                </div>

                <div className="dash-panel" style={{ marginTop: 20 }}>
                  <div className="dash-panel-head">
                    <h3>Incoming Translation Dispatch Requests</h3>
                    <span className="chip green">On Duty</span>
                  </div>
                  <table className="clinical-table">
                    <thead>
                      <tr>
                        <th>Req ID</th>
                        <th>Language Pair</th>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Hospital / Specialty</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INITIAL_REQUESTS.map(r => (
                        <tr key={r.id}>
                          <td><b>#REQ-{r.id}</b></td>
                          <td><span className="chip blue">{r.sourceLang} ↔ {r.targetLang}</span></td>
                          <td>{r.patientName}</td>
                          <td>{r.doctorName}</td>
                          <td>Apollo / Cardiology</td>
                          <td><span className="chip green">{r.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeConsoleMenu === 'admin' && (
              <div>
                <div className="workspace-top-bar">
                  <div>
                    <h3>Hospital Governance & Compliance: Central Operations Admin</h3>
                    <p>DISHA & HIPAA clinical telemetry, interpreter dispatch logs, and platform compliance audit trails.</p>
                  </div>
                  <button className="btn primary-navy" onClick={() => launchDemo('admin')}>
                    Open Full-Screen Admin Console <ArrowRight size={14} />
                  </button>
                </div>

                <div className="clinical-stats-grid">
                  <div className="stat-unit-card">
                    <small>Registered Patients</small>
                    <b>1,428</b>
                    <span style={{ fontSize: 11, color: 'var(--status-normal)' }}>+12% this month</span>
                  </div>
                  <div className="stat-unit-card">
                    <small>Physicians On-Duty</small>
                    <b>84</b>
                    <span style={{ fontSize: 11, color: 'var(--slate-500)' }}>14 Specialties</span>
                  </div>
                  <div className="stat-unit-card">
                    <small>Certified Interpreters</small>
                    <b>36</b>
                    <span style={{ fontSize: 11, color: 'var(--slate-500)' }}>5 Regional Languages</span>
                  </div>
                  <div className="stat-unit-card">
                    <small>Translation Latency</small>
                    <b>180 ms</b>
                    <span style={{ fontSize: 11, color: 'var(--status-normal)' }}>Optimal Grade</span>
                  </div>
                </div>

                <div className="dash-panel">
                  <div className="dash-panel-head">
                    <h3>DISHA & HIPAA Security Audit Trail</h3>
                    <span className="chip green">Cryptographically Verified</span>
                  </div>
                  <table className="clinical-table">
                    <thead>
                      <tr>
                        <th>Timestamp (IST)</th>
                        <th>Event Description</th>
                        <th>Actor</th>
                        <th>Integrity Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2026-09-28 11:30:10</td>
                        <td>Interpreter Ananya Menon joined Session #CLINIC-782</td>
                        <td>System Dispatch</td>
                        <td><code>e8f49...21a</code></td>
                      </tr>
                      <tr>
                        <td>2026-09-28 09:15:22</td>
                        <td>Priya Sharma logged in with verified OTP session</td>
                        <td>Priya Sharma</td>
                        <td><code>a1c84...77d</code></td>
                      </tr>
                      <tr>
                        <td>2026-09-27 18:45:00</td>
                        <td>E-Prescription #RX-2026-8941 digitally generated and translated to Tamil</td>
                        <td>Dr. Rajesh Sundaram</td>
                        <td><code>b3099...80f</code></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeConsoleMenu === 'video-room' && (
              <div>
                <div className="workspace-top-bar">
                  <div>
                    <h3>Virtual Teleconsultation Room #CLINIC-ROOM-782</h3>
                    <p>Interactive 3-way conference with live dual-language subtitles stream.</p>
                  </div>
                  <button className="btn small primary-navy" onClick={() => launchDemo('doctor')}>
                    Open in Full Dashboard <ArrowRight size={14} />
                  </button>
                </div>

                <div className="teleconsult-clinical-room">
                  <div className="video-clinical-stage">
                    <div className="video-clinical-split">
                      <div className={`feed-box ${activeSpeaker === 'doctor' ? 'speaker-active' : ''}`}>
                        <div className="feed-center-info">
                          <div className="feed-initials-circle">RS</div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>Dr. Rajesh Sundaram, MD</div>
                          <div style={{ fontSize: 11, color: 'var(--slate-400)' }}>Cardiologist · English</div>
                        </div>
                        <div className="feed-label-tag">
                          <span className="status-dot-green"></span> Doctor (Remote)
                        </div>
                      </div>

                      <div className={`feed-box ${activeSpeaker === 'patient' ? 'speaker-active' : ''}`}>
                        <div className="feed-center-info">
                          <div className="feed-initials-circle" style={{ background: 'var(--med-blue-700)' }}>PS</div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>Priya Sharma</div>
                          <div style={{ fontSize: 11, color: 'var(--slate-400)' }}>Patient · Tamil (தமிழ்)</div>
                        </div>
                        <div className="feed-label-tag">
                          <span className="status-dot-green"></span> Patient
                        </div>
                      </div>
                    </div>

                    <div className="clinical-subtitle-bar">
                      <div className="subtitle-telemetry-tag">
                        <span>Live Dual-Language Caption Feed ({activeSpeaker === 'doctor' ? 'Doctor Speaking' : 'Patient Speaking'})</span>
                        <span>Neural Model Latency: 120ms</span>
                      </div>
                      {activeSpeaker === 'doctor' ? (
                        <div>
                          <b>Doctor (English):</b> "Please complete the full 14-day course of Pantoprazole before breakfast."
                          <div className="subtitle-trans-text">
                            🔄 <b>Tamil Translation:</b> "காலை உணவுக்கு முன் பான்டோபிரசோலின் 14 நாள் முழு படிப்பையும் முடிக்கவும்."
                          </div>
                        </div>
                      ) : (
                        <div>
                          <b>Patient (Tamil):</b> "மருத்துவரே, நெஞ்சு எரிச்சல் குறைந்துள்ளது, படுக்கும் போது மட்டும் லேசான சிரமம் உள்ளது."
                          <div className="subtitle-trans-text">
                            🔄 <b>English Translation:</b> "Doctor, the heartburn has subsided, with only slight discomfort remaining when lying down."
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="video-clinical-controls">
                      <div>
                        <span>🗣️ Interpreter: Ananya Menon (Assigned) · 🔒 256-Bit Encrypted</span>
                      </div>
                      <div className="ctrl-btn-set">
                        <button className="ctrl-btn" title="Microphone"><Mic size={15} /></button>
                        <button className="ctrl-btn" title="Camera"><Camera size={15} /></button>
                        <button className="ctrl-btn danger" title="End Session"><LogOut size={15} /></button>
                      </div>
                    </div>
                  </div>

                  <div className="clinical-side-assistant">
                    <div className="panel-section-box">
                      <div className="panel-header-sm">
                        <Activity size={14} color="var(--med-blue-700)" /> Patient Real-Time Vitals
                      </div>
                      <div className="vitals-summary-grid">
                        <div className="vital-metric-unit"><small>BP</small><b>124/82</b></div>
                        <div className="vital-metric-unit"><small>HR</small><b>76 bpm</b></div>
                        <div className="vital-metric-unit"><small>SpO2</small><b>99%</b></div>
                        <div className="vital-metric-unit"><small>TEMP</small><b>98.4°F</b></div>
                      </div>
                    </div>

                    <div className="panel-section-box">
                      <div className="panel-header-sm">
                        <RefreshCw size={14} color="var(--med-blue-700)" /> Simulate Active Dialogue
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className={`btn small ${activeSpeaker === 'doctor' ? 'primary-navy' : 'secondary-outline'}`}
                          style={{ flex: 1 }}
                          onClick={() => setActiveSpeaker('doctor')}
                        >
                          Doctor (English)
                        </button>
                        <button
                          className={`btn small ${activeSpeaker === 'patient' ? 'primary-navy' : 'secondary-outline'}`}
                          style={{ flex: 1 }}
                          onClick={() => setActiveSpeaker('patient')}
                        >
                          Patient (Tamil)
                        </button>
                      </div>
                    </div>

                    <div className="panel-section-box" style={{ flex: 1 }}>
                      <div className="panel-header-sm">
                        <FileCheck2 size={14} color="var(--med-blue-700)" /> Physician Intake Notes
                      </div>
                      <textarea
                        rows="4"
                        style={{ width: '100%', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: 8, fontSize: 12.5 }}
                        defaultValue="Suspected Gastroesophageal Reflux (GERD). Heartburn aggravated by lying flat. Prescribing PPI & antacid therapy."
                      />
                      <button className="btn small primary-navy" style={{ marginTop: 8 }}>
                        Save Note & Update Rx
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeConsoleMenu === 'prescription' && (
              <div>
                <div className="workspace-top-bar">
                  <div>
                    <h3>Electronic Prescription & Regional Language Timing Sheet</h3>
                    <p>Demonstrates automatic translation of medical dosages and meal timings into Tamil.</p>
                  </div>
                  <button className="btn small primary-navy" onClick={() => launchDemo('patient')}>
                    View in Patient Portal <ArrowRight size={14} />
                  </button>
                </div>

                <div className="clinical-rx-document">
                  <div className="rx-doc-header">
                    <div>
                      <div className="rx-hospital-name">Apollo Hospitals, Greams Road, Chennai</div>
                      <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>
                        Department of Cardiology & Internal Medicine · Reg: TN-MC-48201
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 12.5 }}>
                      <div><b>Rx Number:</b> #RX-2026-8941</div>
                      <div><b>Date:</b> 28 Sep 2026</div>
                      <div><b>Patient:</b> Priya Sharma (MRN-TN-8821)</div>
                      <div><b>Primary Language:</b> Tamil (தமிழ்)</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 14, fontSize: 13 }}>
                    <b>Clinical Diagnosis:</b> Gastroesophageal Reflux Disease (GERD) with Mild Acidity Cephalea (ICD-10: K21.9)
                  </div>

                  <table className="rx-doc-table">
                    <thead>
                      <tr>
                        <th>Medication Name</th>
                        <th>Dosage</th>
                        <th>Standard Clinical Timing</th>
                        <th>Patient Regional Language Instructions (Tamil)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INITIAL_RECORDS[0].medications.map((m, idx) => (
                        <tr key={idx}>
                          <td><b>{m.name}</b></td>
                          <td>{m.dosage}</td>
                          <td>{m.timing} ({m.duration})</td>
                          <td>
                            <span className="rx-localized-badge">
                              ✓ {m.translatedTiming}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ background: 'var(--bg-canvas-subtle)', padding: 12, border: '1px solid var(--border-subtle)', borderRadius: 4, fontSize: 12.5, marginBottom: 16 }}>
                    <b>Dietary Guidance:</b> {INITIAL_RECORDS[0].dietAdvice}
                    <div style={{ color: 'var(--med-blue-700)', fontWeight: 600, marginTop: 4 }}>
                      👉 {INITIAL_RECORDS[0].translatedDiet}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'var(--slate-500)', paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                    <span>Digitally Signed: Dr. Rajesh Sundaram, MD (Digital Certificate TN-48201)</span>
                    <span>DISHA & HIPAA Certified Architecture</span>
                  </div>
                </div>
              </div>
            )}

            {activeConsoleMenu === 'booking' && (
              <div>
                <div className="workspace-top-bar">
                  <div>
                    <h3>Physician Directory & Language Matching (8 Specialists)</h3>
                    <p>Filter qualified medical specialists by language spoken and hospital network.</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  {INITIAL_DOCTORS.map(doc => (
                    <div key={doc.id} className="dash-panel" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                        <div className="mini-initials" style={{ width: 40, height: 40, fontSize: 14 }}>
                          {doc.initials}
                        </div>
                        <div>
                          <b style={{ fontSize: 13.5 }}>{doc.name}</b>
                          <div style={{ fontSize: 12, color: 'var(--med-blue-700)', fontWeight: 600 }}>{doc.specialty}</div>
                          <div style={{ fontSize: 11, color: 'var(--slate-500)' }}>{doc.hospital}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                        {doc.languages.map(l => (
                          <span key={l} className="chip slate" style={{ fontSize: 11 }}>🗣️ {l}</span>
                        ))}
                        <span className="chip green" style={{ fontSize: 11 }}>⭐ {doc.rating}</span>
                        <span className="chip slate" style={{ fontSize: 11 }}>⏳ {doc.experience}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{doc.fee}</div>
                          <small style={{ color: 'var(--slate-500)', fontSize: 11 }}>Slot: {doc.nextSlot}</small>
                        </div>
                        <button
                          className="btn small primary-navy"
                          onClick={() => {
                            setBookingModalDoc(doc);
                            setBookingSuccess(false);
                          }}
                        >
                          Book Teleconsult
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* BOOKING MODAL */}
      {bookingModalDoc && (
        <div className="clinical-modal-overlay" onClick={() => setBookingModalDoc(null)}>
          <div className="clinical-modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16 }}>Schedule Teleconsultation</h3>
              <button style={{ border: 0, background: 'none', cursor: 'pointer', fontSize: 16 }} onClick={() => setBookingModalDoc(null)}>✕</button>
            </div>
            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 36, color: 'var(--status-normal)', marginBottom: 8 }}>✓</div>
                <h4 style={{ marginBottom: 6 }}>Appointment Confirmed</h4>
                <p style={{ fontSize: 13, color: 'var(--slate-500)', marginBottom: 16 }}>
                  Scheduled with {bookingModalDoc.name} for Today at 02:00 PM. A certified regional interpreter will join automatically.
                </p>
                <button className="btn small primary-navy" onClick={() => launchDemo('patient')}>
                  View in Patient Portal <ArrowRight size={13} />
                </button>
              </div>
            ) : (
              <div className="clinical-form-grid">
                <div className="form-item">
                  <label>Physician</label>
                  <input readOnly value={`${bookingModalDoc.name} (${bookingModalDoc.specialty})`} />
                </div>
                <div className="form-split-two">
                  <div className="form-item">
                    <label>Date</label>
                    <input type="date" defaultValue="2026-09-29" />
                  </div>
                  <div className="form-item">
                    <label>Time Slot</label>
                    <select defaultValue="02:00 PM">
                      <option>11:30 AM</option>
                      <option>02:00 PM</option>
                      <option>04:30 PM</option>
                    </select>
                  </div>
                </div>
                <div className="form-item">
                  <label>Preferred Consultation Language</label>
                  <select defaultValue="Tamil">
                    {langs.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="form-item">
                  <label>Chief Symptoms</label>
                  <textarea rows="2" defaultValue="Heartburn, mild tension headache post-meals." />
                </div>
                <button className="btn primary-navy" onClick={() => setBookingSuccess(true)}>
                  Confirm Appointment Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="clinical-site-footer">
        <div className="footer-inner-grid">
          <div>
            <h4>MediLingua Telehealth Network</h4>
            <p>
              National multilingual telemedicine infrastructure advancing healthcare accessibility for linguistic minorities across primary, secondary, and tertiary care.
            </p>
          </div>
          <div>
            <h4>Account Access</h4>
            <ul>
              <li><Link to="/login" style={{ color: 'inherit' }}>Sign In to Portal</Link></li>
              <li><Link to="/register" style={{ color: 'inherit' }}>Register New Patient Account</Link></li>
              <li><Link to="/register/doctor" style={{ color: 'inherit' }}>Physician Credential Registration</Link></li>
              <li><Link to="/register/interpreter" style={{ color: 'inherit' }}>Interpreter Accreditation</Link></li>
            </ul>
          </div>
          <div>
            <h4>Regional Languages</h4>
            <ul>
              <li>Tamil (தமிழ்)</li>
              <li>Telugu (తెలుగు)</li>
              <li>Hindi (हिन्दी)</li>
              <li>Malayalam (മലയാളം)</li>
              <li>English</li>
            </ul>
          </div>
          <div>
            <h4>Compliance & Standards</h4>
            <ul>
              <li>MoHFW Telemedicine Guidelines</li>
              <li>DISHA Compliant (Health Data)</li>
              <li>HIPAA Safe Standards</li>
              <li>256-Bit TLS End-to-End Encryption</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom-row">
          <div>© 2026 MediLingua Health Tech. All rights reserved. Hospital Telehealth Demonstration.</div>
          <div>Demo Verification Code: <b>123456</b> · Pre-Loaded Datasets Active</div>
        </div>
      </footer>
    </>
  );
}

// =============================================================================
// AUTHENTICATION COMPONENTS: DEDICATED SIGN IN & SIGN UP (REGISTRATION)
// =============================================================================

function AuthShell({ mode = 'login', role = 'patient', children }) {
  const nav = useNavigate();
  return (
    <div className="auth-viewport-wrapper">
      <div className={`auth-form-card ${mode === 'register' ? 'register-wide' : ''}`}>
        <div className="auth-brand-head">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 20, color: 'var(--navy-950)' }}>
            <span className="clinical-logo-mark" style={{ width: 30, height: 30, fontSize: 13 }}>ML</span> MediLingua
          </Link>
          <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 2 }}>National Telemedicine Access Portal</div>
        </div>

        {/* TOP TOGGLE: SIGN IN vs SIGN UP */}
        <div className="auth-nav-toggle">
          <button
            className={`auth-toggle-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => nav(`/login/${role}`)}
          >
            <LogIn size={14} style={{ display: 'inline', marginRight: 6 }} /> Sign In
          </button>
          <button
            className={`auth-toggle-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => nav(`/register/${role}`)}
          >
            <UserPlus size={14} style={{ display: 'inline', marginRight: 6 }} /> Create Account (Sign Up)
          </button>
        </div>

        {/* ROLE PICKER TABS */}
        <div className="auth-role-tabs">
          {roles.map(r => (
            <button
              key={r}
              className={`auth-role-tab ${r === role ? 'active' : ''}`}
              onClick={() => nav(`/${mode}/${r}`)}
            >
              {roleLabel(r)}
            </button>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
}

// LOGIN PAGE COMPONENT
function Login() {
  const { role = 'patient' } = useParams();
  const nav = useNavigate();
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(API + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p, role })
      });
      const d = await res.json();
      if (!res.ok) {
        setMsg({ text: d.message || 'Login failed.', type: 'error' });
        return;
      }
      localStorage.setItem('token', d.token);
      localStorage.setItem('user', JSON.stringify(d.user));
      nav('/dashboard');
    } catch (err) {
      // Local fallback
      const acc = DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS.patient;
      localStorage.setItem('user', JSON.stringify(acc));
      localStorage.setItem('token', 'local-token');
      nav('/dashboard');
    }
  };

  const handle1Click = r => {
    const acc = DEMO_ACCOUNTS[r];
    localStorage.setItem('user', JSON.stringify(acc));
    localStorage.setItem('token', 'clinical-token-' + r);
    nav('/dashboard');
  };

  return (
    <AuthShell mode="login" role={role}>
      <form onSubmit={submit} className="clinical-form-grid">
        <div className="form-item">
          <label>Username</label>
          <input
            required
            placeholder={`Enter ${role} username (e.g. ${role}_demo)`}
            value={u}
            onChange={e => setU(e.target.value)}
          />
        </div>
        <div className="form-item">
          <label>Password</label>
          <input
            required
            type="password"
            placeholder="Enter password (demo123)"
            value={p}
            onChange={e => setP(e.target.value)}
          />
        </div>

        <button className="btn primary-navy" style={{ marginTop: 8 }}>
          Sign In as {roleLabel(role)}
        </button>

        {msg.text && (
          <div className="chip red" style={{ padding: 8, marginTop: 8 }}>
            <AlertCircle size={14} /> {msg.text}
          </div>
        )}
      </form>

      <div style={{ marginTop: 22, padding: 14, background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', borderRadius: 6, textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 8 }}>
          ⚡ 1-Click Sandbox Logins (Instant Access):
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn small secondary-outline" onClick={() => handle1Click('patient')}>Patient (Priya)</button>
          <button className="btn small secondary-outline" onClick={() => handle1Click('doctor')}>Doctor (Dr. Rajesh)</button>
          <button className="btn small secondary-outline" onClick={() => handle1Click('interpreter')}>Interpreter (Ananya)</button>
          <button className="btn small secondary-outline" onClick={() => handle1Click('admin')}>Admin</button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13 }}>
        Don't have an account? <Link to={`/register/${role}`} style={{ color: 'var(--med-blue-700)', fontWeight: 700 }}>Register / Sign Up here</Link>
      </div>

      <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12 }}>
        <Link to="/" style={{ color: 'var(--slate-500)' }}>← Return to Platform Home</Link>
      </div>
    </AuthShell>
  );
}

// SIGN UP / REGISTRATION PAGE COMPONENT
function Register() {
  const { role = 'patient' } = useParams();
  const nav = useNavigate();

  const [f, setF] = useState({
    role,
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    email: '',
    dob: '',
    location: '',
    language: 'Tamil',
    regNo: '',
    cert: ''
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    setF(prev => ({ ...prev, role }));
  }, [role]);

  const update = e => setF({ ...f, [e.target.name]: e.target.value });

  const calculatedAge = f.dob
    ? Math.max(0, new Date().getFullYear() - new Date(f.dob).getFullYear() -
        ((new Date().getMonth() + 1 < new Date(f.dob).getMonth() + 1) ||
         (new Date().getMonth() + 1 === new Date(f.dob).getMonth() + 1 && new Date().getDate() < new Date(f.dob).getDate()) ? 1 : 0))
    : '';

  const sendOtp = async () => {
    if (!f.phone) {
      setMsg({ text: 'Please enter a valid mobile phone number first.', type: 'error' });
      return;
    }
    setOtpSent(true);
    setMsg({ text: 'Demo OTP dispatched: 123456 (pre-verified for clinical testing)', type: 'info' });
    setOtp('123456');
  };

  const submit = async e => {
    e.preventDefault();
    if (f.password !== f.confirmPassword) {
      setMsg({ text: 'Passwords do not match. Please re-enter.', type: 'error' });
      return;
    }
    if (!otpSent || otp !== '123456') {
      setMsg({ text: 'Please verify phone number using demo OTP: 123456', type: 'error' });
      return;
    }

    try {
      const res = await fetch(API + '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...f,
          age: calculatedAge || 30
        })
      });
      const d = await res.json();
      if (!res.ok) {
        setMsg({ text: d.message || 'Registration failed.', type: 'error' });
        return;
      }
      localStorage.setItem('token', d.token);
      localStorage.setItem('user', JSON.stringify(d.user));
      setMsg({ text: 'Registration successful! Taking you to clinical portal...', type: 'success' });
      setTimeout(() => nav('/dashboard'), 800);
    } catch (err) {
      const newUser = {
        id: Date.now(),
        ...f,
        age: calculatedAge || 30,
        mrn: role === 'patient' ? `MRN-IN-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
        verified: true
      };
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', 'local-reg-token-' + Date.now());
      setMsg({ text: 'Account created! Redirecting to clinical portal...', type: 'success' });
      setTimeout(() => nav('/dashboard'), 600);
    }
  };

  return (
    <AuthShell mode="register" role={role}>
      <form onSubmit={submit} className="clinical-form-grid">
        <div className="form-split-two">
          <div className="form-item">
            <label>Full Legal Name</label>
            <input
              name="name"
              required
              placeholder="e.g. Priya Sharma"
              value={f.name}
              onChange={update}
            />
          </div>
          <div className="form-item">
            <label>Username</label>
            <input
              name="username"
              required
              placeholder="e.g. priya_sharma"
              value={f.username}
              onChange={update}
            />
          </div>
        </div>

        <div className="form-split-two">
          <div className="form-item">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="e.g. priya@example.com"
              value={f.email}
              onChange={update}
            />
          </div>
          <div className="form-item">
            <label>Mobile Phone Number</label>
            <input
              name="phone"
              required
              placeholder="10-digit mobile number"
              value={f.phone}
              onChange={update}
            />
          </div>
        </div>

        <div className="otp-send-row">
          <button type="button" className="btn small secondary-outline" onClick={sendOtp}>
            Send Phone OTP
          </button>
          {otpSent && (
            <input
              placeholder="Enter OTP (Use 123456)"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              style={{ padding: '7px 10px', fontSize: 13 }}
            />
          )}
        </div>

        <div className="form-split-two">
          <div className="form-item">
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Create password"
              value={f.password}
              onChange={update}
            />
          </div>
          <div className="form-item">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              placeholder="Confirm password"
              value={f.confirmPassword}
              onChange={update}
            />
          </div>
        </div>

        <div className="form-split-two">
          <div className="form-item">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              required
              value={f.dob}
              onChange={update}
            />
          </div>
          <div className="form-item">
            <label>Calculated Age</label>
            <input
              readOnly
              value={calculatedAge ? `${calculatedAge} Years` : ''}
              placeholder="Auto-calculated from DOB"
            />
          </div>
        </div>

        <div className="form-split-two">
          <div className="form-item">
            <label>City & State Location</label>
            <input
              name="location"
              required
              placeholder="e.g. Chennai, Tamil Nadu"
              value={f.location}
              onChange={update}
            />
          </div>
          <div className="form-item">
            <label>Primary Registered Language</label>
            <select name="language" value={f.language} onChange={update}>
              {langs.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {role === 'doctor' && (
          <div className="form-split-two">
            <div className="form-item">
              <label>MCI / NMC Registration Number</label>
              <input
                name="regNo"
                placeholder="e.g. MCI-TN-48201"
                value={f.regNo}
                onChange={update}
              />
            </div>
            <div className="form-item">
              <label>Specialty & Qualifications</label>
              <input
                placeholder="e.g. Cardiology, MBBS MD DM"
                defaultValue="Cardiology & Internal Medicine"
              />
            </div>
          </div>
        )}

        {role === 'interpreter' && (
          <div className="form-item">
            <label>Accredited Certification (CMI / CCHI)</label>
            <input
              name="cert"
              placeholder="e.g. Certified Medical Interpreter CMI #9042"
              value={f.cert}
              onChange={update}
            />
          </div>
        )}

        <button className="btn primary-navy" style={{ marginTop: 10 }}>
          Complete Registration & Sign In as {roleLabel(role)}
        </button>

        {msg.text && (
          <div className={`chip ${msg.type === 'error' ? 'red' : 'green'}`} style={{ padding: 8, marginTop: 8 }}>
            {msg.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle size={14} />} {msg.text}
          </div>
        )}
      </form>

      <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13 }}>
        Already have an account? <Link to={`/login/${role}`} style={{ color: 'var(--med-blue-700)', fontWeight: 700 }}>Sign In here</Link>
      </div>

      <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12 }}>
        <Link to="/" style={{ color: 'var(--slate-500)' }}>← Return to Platform Home</Link>
      </div>
    </AuthShell>
  );
}

// =============================================================================
// DASHBOARD VIEW
// =============================================================================

function Dashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [tab, setTab] = useState('Overview');

  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [doctorsList, setDoctorsList] = useState(INITIAL_DOCTORS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const [bookingModalDoc, setBookingModalDoc] = useState(null);
  const [msgInput, setMsgInput] = useState('');

  useEffect(() => {
    if (!user) nav('/login');
  }, [user]);

  if (!user) return null;

  const logout = () => {
    localStorage.clear();
    nav('/');
  };

  const switchDemoRole = (newRole) => {
    const acc = DEMO_ACCOUNTS[newRole];
    localStorage.setItem('user', JSON.stringify(acc));
    localStorage.setItem('token', 'clinical-demo-token-' + newRole);
    setUser(acc);
    setTab('Overview');
  };

  const handleSendMessage = () => {
    if (!msgInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: user.name,
      role: user.role,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: msgInput,
      translated: user.language === 'English'
        ? `[Tamil Translated]: ${msgInput}`
        : `[English Translated]: ${msgInput}`
    };
    setMessages(prev => [...prev, newMsg]);
    setMsgInput('');

    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        from: user.role === 'patient' ? 'Dr. Rajesh Sundaram' : 'Clinical Care Coordinator',
        role: user.role === 'patient' ? 'doctor' : 'admin',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'Clinical inquiry reviewed by physician. Response recorded in medical record.',
        translated: 'மருத்துவ விசாரணை மருத்துவரால் மதிப்பாய்வு செய்யப்பட்டது. மருத்துவப் பதிவேட்டில் பதிவு செய்யப்பட்டது.'
      };
      setMessages(prev => [...prev, reply]);
    }, 1200);
  };

  const renderSidebarMenus = () => {
    return (
      <div className="sidebar-nav-scroll">
        <div className="sidebar-category-header">Clinical Services</div>

        <button
          className={`sidebar-nav-item ${tab === 'Overview' ? 'active' : ''}`}
          onClick={() => setTab('Overview')}
        >
          <div className="sidebar-nav-item-left">
            <Activity size={15} />
            <span>Overview</span>
          </div>
        </button>

        <button
          className={`sidebar-nav-item ${tab === 'Consultations' ? 'active' : ''}`}
          onClick={() => setTab('Consultations')}
        >
          <div className="sidebar-nav-item-left">
            <Video size={15} />
            <span>Virtual Consult Room</span>
          </div>
          <span className="chip green" style={{ fontSize: 10 }}>Room 782</span>
        </button>

        <button
          className={`sidebar-nav-item ${tab === 'Appointments' ? 'active' : ''}`}
          onClick={() => setTab('Appointments')}
        >
          <div className="sidebar-nav-item-left">
            <Calendar size={15} />
            <span>Appointments</span>
          </div>
          <span className="chip slate" style={{ fontSize: 10 }}>{appointments.length}</span>
        </button>

        <button
          className={`sidebar-nav-item ${tab === 'Medical Records' ? 'active' : ''}`}
          onClick={() => setTab('Medical Records')}
        >
          <div className="sidebar-nav-item-left">
            <FileText size={15} />
            <span>Medical Records (EHR)</span>
          </div>
        </button>

        <div className="sidebar-category-header">Care Collaboration</div>

        <button
          className={`sidebar-nav-item ${tab === 'Find Doctors' ? 'active' : ''}`}
          onClick={() => setTab('Find Doctors')}
        >
          <div className="sidebar-nav-item-left">
            <Search size={15} />
            <span>Physician Directory</span>
          </div>
          <span className="chip slate" style={{ fontSize: 10 }}>8 Docs</span>
        </button>

        {user.role === 'doctor' && (
          <button
            className={`sidebar-nav-item ${tab === 'Patients' ? 'active' : ''}`}
            onClick={() => setTab('Patients')}
          >
            <div className="sidebar-nav-item-left">
              <Users size={15} />
              <span>Assigned Patients</span>
            </div>
            <span className="chip blue" style={{ fontSize: 10 }}>3 Waiting</span>
          </button>
        )}

        <button
          className={`sidebar-nav-item ${tab === 'Requests' ? 'active' : ''}`}
          onClick={() => setTab('Requests')}
        >
          <div className="sidebar-nav-item-left">
            <Globe size={15} />
            <span>Interpreter Dispatch</span>
          </div>
          <span className="chip slate" style={{ fontSize: 10 }}>{requests.length}</span>
        </button>

        <button
          className={`sidebar-nav-item ${tab === 'Messages' ? 'active' : ''}`}
          onClick={() => setTab('Messages')}
        >
          <div className="sidebar-nav-item-left">
            <MessageSquare size={15} />
            <span>Care Team Chat</span>
          </div>
        </button>

        <div className="sidebar-category-header">Governance & Account</div>

        {(user.role === 'admin' || user.role === 'doctor') && (
          <button
            className={`sidebar-nav-item ${tab === 'Reports' ? 'active' : ''}`}
            onClick={() => setTab('Reports')}
          >
            <div className="sidebar-nav-item-left">
              <ClipboardList size={15} />
              <span>Clinical Telemetry</span>
            </div>
          </button>
        )}

        {user.role === 'admin' && (
          <button
            className={`sidebar-nav-item ${tab === 'Audit Logs' ? 'active' : ''}`}
            onClick={() => setTab('Audit Logs')}
          >
            <div className="sidebar-nav-item-left">
              <ShieldCheck size={15} />
              <span>DISHA Audit Trails</span>
            </div>
          </button>
        )}

        <button
          className={`sidebar-nav-item ${tab === 'Profile' ? 'active' : ''}`}
          onClick={() => setTab('Profile')}
        >
          <div className="sidebar-nav-item-left">
            <UserCog size={15} />
            <span>Profile & Language</span>
          </div>
        </button>
      </div>
    );
  };

  const renderDashboardContent = () => {
    if (tab === 'Overview') {
      return (
        <div>
          <div className="clinical-stats-grid">
            <div className="stat-unit-card">
              <small>Upcoming Consultations</small>
              <b>{appointments.filter(a => a.status === 'Upcoming').length}</b>
              <span style={{ fontSize: 11, color: 'var(--med-blue-700)' }}>Today at 11:30 AM</span>
            </div>
            <div className="stat-unit-card">
              <small>Primary Registered Language</small>
              <b>{user.language}</b>
              <span style={{ fontSize: 11, color: 'var(--status-normal)' }}>Locked to Clinical EHR</span>
            </div>
            <div className="stat-unit-card">
              <small>Electronic Records (EHR)</small>
              <b>{records.length}</b>
              <span style={{ fontSize: 11, color: 'var(--slate-500)' }}>1 Rx · 1 Lab Report</span>
            </div>
            <div className="stat-unit-card">
              <small>Assigned Interpreter</small>
              <b>Ananya Menon</b>
              <span style={{ fontSize: 11, color: 'var(--status-normal)' }}>CMI Verified</span>
            </div>
          </div>

          <div className="dash-panel" style={{ borderLeft: '4px solid var(--med-blue-700)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <span className="chip green" style={{ marginBottom: 6 }}>
                  <span className="status-dot-green"></span> Active Clinical Session Ready
                </span>
                <h2 style={{ fontSize: 18, color: 'var(--navy-950)', marginTop: 4 }}>
                  Dr. Rajesh Sundaram, MD (Cardiology) · Room #CLINIC-ROOM-782
                </h2>
                <div style={{ fontSize: 13, color: 'var(--slate-500)', marginTop: 2 }}>
                  Scheduled: <b>Today, 11:30 AM</b> · Language: <b>{user.language} ↔ English</b> · Interpreter: <b>Ananya Menon (Connected)</b>
                </div>
              </div>
              <button className="btn primary-navy" onClick={() => setTab('Consultations')}>
                <Video size={15} /> Enter Virtual Consultation Room
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
            <div className="dash-panel">
              <div className="dash-panel-head">
                <h3>Scheduled Teleconsultations</h3>
                <button className="btn small secondary-outline" onClick={() => setTab('Appointments')}>View All</button>
              </div>
              <table className="clinical-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Physician</th>
                    <th>Hospital / Specialty</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 2).map(a => (
                    <tr key={a.id}>
                      <td><b>{a.date} · {a.time}</b></td>
                      <td>{a.doctor}</td>
                      <td>{a.specialty}</td>
                      <td>
                        <button className="btn small primary-navy" onClick={() => setTab('Consultations')}>Join Call</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="dash-panel">
              <div className="dash-panel-head">
                <h3>Care Team Communications</h3>
                <button className="btn small secondary-outline" onClick={() => setTab('Messages')}>Open Thread</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.slice(-2).map(m => (
                  <div key={m.id} style={{ padding: 10, background: 'var(--bg-canvas-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 4, fontSize: 12.5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: 2 }}>
                      <span>{m.from}</span>
                      <small style={{ color: 'var(--slate-500)' }}>{m.time}</small>
                    </div>
                    <div>{m.text}</div>
                    <div style={{ color: 'var(--med-blue-700)', fontSize: 11.5, marginTop: 4 }}>
                      🔄 {m.translated}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (tab === 'Consultations') {
      return (
        <div>
          <div className="dash-panel-head">
            <div>
              <h2 style={{ fontSize: 18 }}>Virtual Teleconsultation Room #CLINIC-ROOM-782</h2>
              <div style={{ fontSize: 12.5, color: 'var(--slate-500)' }}>
                DISHA Compliant WebRTC Session with Live Dual-Language Medical Subtitles
              </div>
            </div>
            <span className="chip green"><span className="status-dot-green"></span> Live Stream Active</span>
          </div>

          <div className="teleconsult-clinical-room">
            <div className="video-clinical-stage">
              <div className="video-clinical-split">
                <div className="feed-box speaker-active">
                  <div className="feed-center-info">
                    <div className="feed-initials-circle">RS</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Dr. Rajesh Sundaram, MD</div>
                    <div style={{ fontSize: 11, color: 'var(--slate-400)' }}>Cardiology · English</div>
                  </div>
                  <div className="feed-label-tag"><span className="status-dot-green"></span> Doctor (Remote)</div>
                </div>

                <div className="feed-box">
                  <div className="feed-center-info">
                    <div className="feed-initials-circle" style={{ background: 'var(--med-blue-700)' }}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--slate-400)' }}>Patient · {user.language}</div>
                  </div>
                  <div className="feed-label-tag"><span className="status-dot-green"></span> You ({user.name.split(' ')[0]})</div>
                </div>
              </div>

              <div className="clinical-subtitle-bar">
                <div className="subtitle-telemetry-tag">
                  <span>Live Medical Subtitle Stream</span>
                  <span>Audio Latency: 120ms</span>
                </div>
                <div>
                  <b>Doctor (English):</b> "Please complete the full 14-day course of Pantoprazole before breakfast."
                  <div className="subtitle-trans-text">
                    🔄 <b>Tamil Translation:</b> "காலை உணவுக்கு முன் பான்டோபிரசோலின் 14 நாள் முழு படிப்பையும் முடிக்கவும்."
                  </div>
                </div>
              </div>

              <div className="video-clinical-controls">
                <div><span>🗣️ Interpreter: Ananya Menon (Active)</span></div>
                <div className="ctrl-btn-set">
                  <button className="ctrl-btn"><Mic size={15} /></button>
                  <button className="ctrl-btn"><Camera size={15} /></button>
                  <button className="ctrl-btn danger"><LogOut size={15} /></button>
                </div>
              </div>
            </div>

            <div className="clinical-side-assistant">
              <div className="panel-section-box">
                <div className="panel-header-sm">Patient Vitals Telemetry</div>
                <div className="vitals-summary-grid">
                  <div className="vital-metric-unit"><small>BP</small><b>124/82</b></div>
                  <div className="vital-metric-unit"><small>HR</small><b>76 bpm</b></div>
                  <div className="vital-metric-unit"><small>SpO2</small><b>99%</b></div>
                  <div className="vital-metric-unit"><small>TEMP</small><b>98.4°F</b></div>
                </div>
              </div>

              <div className="panel-section-box" style={{ flex: 1 }}>
                <div className="panel-header-sm">Consultation Notes & Orders</div>
                <textarea
                  rows="6"
                  style={{ width: '100%', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: 8, fontSize: 12.5 }}
                  defaultValue="Patient reports marked improvement in acid reflux symptoms after starting Pantoprazole. Advised continued adherence for 2 weeks."
                />
                <button className="btn small primary-navy" style={{ marginTop: 8 }}>
                  Save & Sync to EHR
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (tab === 'Appointments') {
      return (
        <div className="dash-panel">
          <div className="dash-panel-head">
            <h3>Scheduled Teleconsultations</h3>
            <button className="btn small primary-navy" onClick={() => setTab('Find Doctors')}>
              Schedule New Appointment
            </button>
          </div>
          <table className="clinical-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Physician</th>
                <th>Specialty</th>
                <th>Language</th>
                <th>Interpreter</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.id}>
                  <td><b>{a.date} · {a.time}</b></td>
                  <td>{a.doctor}</td>
                  <td>{a.specialty}</td>
                  <td><span className="chip blue">{a.language}</span></td>
                  <td>{a.interpreterName || 'Direct'}</td>
                  <td><span className="chip green">{a.status}</span></td>
                  <td>
                    {a.status !== 'Completed' ? (
                      <button className="btn small primary-navy" onClick={() => setTab('Consultations')}>Join Call</button>
                    ) : (
                      <button className="btn small secondary-outline" onClick={() => setTab('Medical Records')}>View Rx</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (tab === 'Find Doctors') {
      return (
        <div>
          <div className="dash-panel-head" style={{ marginBottom: 16 }}>
            <h3>Physician Directory & Language Match (8 Specialists)</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {doctorsList.map(doc => (
              <div key={doc.id} className="dash-panel" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                  <div className="mini-initials" style={{ width: 40, height: 40 }}>{doc.initials}</div>
                  <div>
                    <b>{doc.name}</b>
                    <div style={{ fontSize: 12, color: 'var(--med-blue-700)', fontWeight: 600 }}>{doc.specialty}</div>
                    <div style={{ fontSize: 11, color: 'var(--slate-500)' }}>{doc.hospital}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                  {doc.languages.map(l => <span key={l} className="chip slate" style={{ fontSize: 11 }}>🗣️ {l}</span>)}
                  <span className="chip green" style={{ fontSize: 11 }}>⭐ {doc.rating}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                  <div><b>{doc.fee}</b> <small style={{ color: 'var(--slate-500)' }}>· {doc.nextSlot}</small></div>
                  <button className="btn small primary-navy" onClick={() => setBookingModalDoc(doc)}>Book</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (tab === 'Medical Records') {
      return (
        <div>
          <div className="clinical-rx-document" style={{ marginBottom: 20 }}>
            <div className="rx-doc-header">
              <div>
                <div className="rx-hospital-name">Apollo Hospitals, Greams Road, Chennai</div>
                <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>
                  Official Electronic Prescription · Reg: TN-MC-48201
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 12.5 }}>
                <div><b>Rx Number:</b> #RX-2026-8941</div>
                <div><b>Patient:</b> {user.name} ({user.language})</div>
              </div>
            </div>

            <table className="rx-doc-table">
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Clinical Timing</th>
                  <th>Regional Translation ({user.language})</th>
                </tr>
              </thead>
              <tbody>
                {records[0].medications.map((m, idx) => (
                  <tr key={idx}>
                    <td><b>{m.name}</b></td>
                    <td>{m.dosage}</td>
                    <td>{m.timing}</td>
                    <td><span className="rx-localized-badge">✓ {m.translatedTiming}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head">
              <h3>Diagnostic Lab Evaluation: Comprehensive Metabolic & Glycemic Panel</h3>
              <span className="chip green">Normal</span>
            </div>
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Observed Value</th>
                  <th>Reference Range</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records[1].tests.map((t, idx) => (
                  <tr key={idx}>
                    <td><b>{t.name}</b></td>
                    <td>{t.value}</td>
                    <td>{t.reference}</td>
                    <td><span className="chip green">{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (tab === 'Messages') {
      return (
        <div className="clinical-chat-box">
          <div className="chat-history-scroll">
            {messages.map(m => {
              const isMine = m.from === user.name || (user.role === 'patient' && m.role === 'patient');
              return (
                <div key={m.id} className={`chat-entry ${isMine ? 'mine' : 'theirs'}`}>
                  <div className="chat-entry-meta">{m.from} · {m.time}</div>
                  <div className="chat-entry-body">
                    <div>{m.text}</div>
                    <div className="chat-trans-footnote">🔄 {m.translated}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="chat-input-bar">
            <input
              placeholder={`Type in ${user.language} or English...`}
              value={msgInput}
              onChange={e => setMsgInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="btn primary-navy" onClick={handleSendMessage}>
              <Send size={14} /> Send
            </button>
          </div>
        </div>
      );
    }

    if (tab === 'Profile') {
      return <Profile user={user} setUser={setUser} />;
    }

    if (tab === 'Audit Logs' || tab === 'Reports') {
      return (
        <div className="dash-panel">
          <div className="dash-panel-head">
            <h3>DISHA & HIPAA Compliance Telemetry & Audit Logs</h3>
            <span className="chip green">Verified</span>
          </div>
          <table className="clinical-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Event Description</th>
                <th>Actor</th>
                <th>Compliance Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2026-09-28 11:30:10</td>
                <td>Interpreter Ananya Menon connected to Room #CLINIC-782</td>
                <td>System Dispatch</td>
                <td><span className="chip green">Optimal</span></td>
              </tr>
              <tr>
                <td>2026-09-28 09:15:22</td>
                <td>Patient session authenticated with verified OTP</td>
                <td>Priya Sharma</td>
                <td><span className="chip green">Verified</span></td>
              </tr>
              <tr>
                <td>2026-09-27 18:45:00</td>
                <td>Digital Rx #RX-2026-8941 translated to Tamil and archived</td>
                <td>Dr. Rajesh Sundaram</td>
                <td><span className="chip green">Signed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    return <div className="dash-panel">Clinical module ready.</div>;
  };

  return (
    <>
      <div className="env-notice-bar">
        <div>
          <span>CLINICAL SIMULATION ENVIRONMENT: <b>{user.name}</b> ({roleLabel(user.role)} · {user.language})</span>
        </div>
        <div className="env-switcher-actions">
          <span style={{ color: 'var(--slate-400)', marginRight: 4 }}>Switch Role Persona:</span>
          <button className={`env-switch-btn ${user.role === 'patient' ? 'active' : ''}`} onClick={() => switchDemoRole('patient')}>
            Patient
          </button>
          <button className={`env-switch-btn ${user.role === 'doctor' ? 'active' : ''}`} onClick={() => switchDemoRole('doctor')}>
            Doctor
          </button>
          <button className={`env-switch-btn ${user.role === 'interpreter' ? 'active' : ''}`} onClick={() => switchDemoRole('interpreter')}>
            Interpreter
          </button>
          <button className={`env-switch-btn ${user.role === 'admin' ? 'active' : ''}`} onClick={() => switchDemoRole('admin')}>
            Admin
          </button>
          <Link to="/" className="env-switch-btn" style={{ marginLeft: 6 }}>
            Home Page
          </Link>
        </div>
      </div>

      <div className="clinical-dashboard-container">
        <aside className="dash-left-sidebar">
          <div className="sidebar-org-brand">
            <div className="clinical-logo-mark" style={{ width: 30, height: 30, fontSize: 13 }}>ML</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <b style={{ fontSize: 14, color: 'var(--navy-950)' }}>MediLingua</b>
              <small style={{ fontSize: 10, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Clinical Portal</small>
            </div>
          </div>

          {renderSidebarMenus()}

          <div className="sidebar-footer-profile">
            <div className="profile-card-mini">
              <div className="mini-initials">
                {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <b style={{ fontSize: 12.5, color: 'var(--navy-950)', display: 'block' }}>{user.name.split(' ')[0]}</b>
                <small style={{ fontSize: 11, color: 'var(--status-normal)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="status-dot-green"></span> {user.language}
                </small>
              </div>
            </div>
            <button
              onClick={logout}
              style={{ border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--slate-500)' }}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </aside>

        <main className="dash-main-viewport">
          <div className="dash-title-bar">
            <div>
              <span className="chip slate" style={{ marginBottom: 4 }}>MediLingua Telehealth Portal</span>
              <h1>{tab}</h1>
            </div>
            <div className="chip blue" style={{ padding: '6px 12px', fontSize: 12.5 }}>
              Registered Clinical Language: <b>{user.language}</b>
            </div>
          </div>

          {renderDashboardContent()}
        </main>
      </div>

      {bookingModalDoc && (
        <div className="clinical-modal-overlay" onClick={() => setBookingModalDoc(null)}>
          <div className="clinical-modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3>Schedule Teleconsultation</h3>
              <button style={{ border: 0, background: 'none', cursor: 'pointer' }} onClick={() => setBookingModalDoc(null)}>✕</button>
            </div>
            <div className="clinical-form-grid">
              <div className="form-item">
                <label>Doctor</label>
                <input readOnly value={`${bookingModalDoc.name} (${bookingModalDoc.specialty})`} />
              </div>
              <div className="form-split-two">
                <div className="form-item">
                  <label>Date</label>
                  <input type="date" defaultValue="2026-10-02" />
                </div>
                <div className="form-item">
                  <label>Slot</label>
                  <select defaultValue="11:30 AM">
                    <option>11:30 AM</option>
                    <option>02:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="form-item">
                <label>Language Needed</label>
                <select defaultValue={user.language}>
                  {langs.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <button
                className="btn primary-navy"
                onClick={() => {
                  const newAppt = {
                    id: Date.now(),
                    doctor: bookingModalDoc.name,
                    specialty: bookingModalDoc.specialty,
                    patientName: user.name,
                    date: '2026-10-02',
                    time: '11:30 AM',
                    status: 'Scheduled',
                    type: 'Video Teleconsultation',
                    roomCode: 'CLINIC-ROOM-' + Math.floor(100 + Math.random() * 900),
                    language: user.language,
                    interpreterRequired: true,
                    interpreterName: 'Assigned on call join',
                    symptoms: 'Scheduled review'
                  };
                  setAppointments(prev => [newAppt, ...prev]);
                  setBookingModalDoc(null);
                  setTab('Appointments');
                }}
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// PROFILE COMPONENT
function Profile({ user, setUser }) {
  const [f, setF] = useState(user);
  const [msg, setMsg] = useState('');

  const update = e => setF({ ...f, [e.target.name]: e.target.value });

  const save = () => {
    localStorage.setItem('user', JSON.stringify(f));
    setUser(f);
    setMsg('Clinical profile updated successfully!');
  };

  return (
    <div className="dash-panel" style={{ maxWidth: 650 }}>
      <div className="dash-panel-head">
        <h3>Personal & Medical Profile</h3>
      </div>
      <div className="clinical-form-grid">
        <div className="form-split-two">
          <div className="form-item">
            <label>Full Name</label>
            <input name="name" value={f.name || ''} onChange={update} />
          </div>
          <div className="form-item">
            <label>Username</label>
            <input name="username" value={f.username || ''} onChange={update} />
          </div>
        </div>

        <div className="form-split-two">
          <div className="form-item">
            <label>Phone Number</label>
            <input name="phone" value={f.phone || ''} onChange={update} />
          </div>
          <div className="form-item">
            <label>Email Address</label>
            <input name="email" value={f.email || ''} onChange={update} />
          </div>
        </div>

        <div className="form-item">
          <label>Registered Preferred Language (Locks to EHR Records)</label>
          <select name="language" value={f.language || 'Tamil'} onChange={update}>
            {langs.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        <button className="btn primary-navy" onClick={save} style={{ marginTop: 8 }}>
          Save Profile Updates
        </button>

        {msg && (
          <div className="chip green" style={{ padding: 8, marginTop: 8 }}>
            ✓ {msg}
          </div>
        )}
      </div>
    </div>
  );
}

// MAIN APP ROUTER
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/:role" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/video" element={<Dashboard />} />
    </Routes>
  );
}

const rootEl = document.getElementById('root');
if (!window.__medilingua_root) {
  window.__medilingua_root = createRoot(rootEl);
}
window.__medilingua_root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

