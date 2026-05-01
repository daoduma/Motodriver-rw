# 🚗 MotoDriver Rwanda

A mobile-first progressive web app (PWA) connecting vehicle owners with trusted drivers across all 30 districts of Rwanda.

---

## 🌍 Live Features

| Feature | Details |
|---|---|
| **Roles** | Clients (need a driver) & Drivers (offer services) |
| **Driver Profiles** | Photo, district, bio, experience |
| **Discovery** | Browse & filter drivers by location or district |
| **Location** | GPS detection → nearest drivers first |
| **Map View** | OpenStreetMap / Leaflet (100% free) |
| **Ratings** | 1–5 star system with running averages |
| **Multilingual** | English, French, Kinyarwanda — UI + LLM bio translation |
| **PWA** | Installable on Android & iOS like a native app |
| **Safety Notice** | Credential verification reminder on every relevant screen |

---

## 🆓 100% Free Stack

| Layer | Service | Free Tier |
|---|---|---|
| **Frontend** | React (Create React App) | Always free |
| **Hosting** | Vercel or Firebase Hosting | Free forever |
| **Auth** | Firebase Auth | 10k users/month free |
| **Database** | Firebase Firestore | 1GB + 50k reads/day free |
| **Storage** | Firebase Storage | 5GB free |
| **LLM Translation** | Groq API | Free tier available |
| **Maps** | OpenStreetMap + Leaflet | Always free |

---

## 📁 Project Structure

```
motodriver-rw/
├── public/
│   ├── index.html          # PWA shell
│   ├── manifest.json       # PWA manifest (installable)
│   └── service-worker.js   # Offline caching
├── src/
│   ├── context/
│   │   └── AppContext.js   # Auth + language global state
│   ├── services/
│   │   ├── firebase.js     # Firebase init
│   │   ├── drivers.js      # Firestore CRUD for drivers & ratings
│   │   └── groq.js         # LLM translation via Groq API
│   ├── utils/
│   │   └── districts.js    # All 30 Rwanda districts + geo helpers
│   ├── i18n/
│   │   └── translations.js # EN / FR / RW UI strings
│   ├── components/
│   │   ├── Navbar.js       # Top nav + bottom tab bar
│   │   ├── DriverCard.js   # Driver listing card
│   │   ├── DriverMap.js    # Leaflet map (lazy-loaded)
│   │   └── StarRating.js   # Star display + interactive picker
│   ├── pages/
│   │   ├── Home.js         # Landing page
│   │   ├── Auth.js         # Login / Register
│   │   ├── DriversPage.js  # Driver listing with filters
│   │   ├── DriverDetailPage.js  # Full profile + rating + translation
│   │   ├── DriverProfilePage.js # Driver registration form
│   │   └── ProfilePage.js  # User settings
│   ├── App.js              # Router setup
│   └── index.css           # Global design system
├── firestore.rules         # Database security rules
├── storage.rules           # Storage security rules
├── firebase.json           # Firebase hosting config
└── .env.example            # Environment variable template
```

---

## ⚙️ Setup Instructions

### Step 1 — Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/motodriver-rw.git
cd motodriver-rw
npm install
```

### Step 2 — Create a Firebase Project (FREE)

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → name it `motodriver-rw` → Continue
3. Disable Google Analytics (optional) → **Create project**

**Enable Authentication:**
- Left sidebar → **Authentication** → Get Started
- Enable **Email/Password** provider → Save

**Enable Firestore:**
- Left sidebar → **Firestore Database** → Create database
- Choose **"Start in test mode"** (we'll apply proper rules later)
- Choose region: `europe-west1` (closest to Rwanda) → Enable

**Enable Storage:**
- Left sidebar → **Storage** → Get started
- Choose test mode → Next → Done

**Get your credentials:**
- Project Overview (⚙️ gear icon) → **Project settings**
- Scroll to "Your apps" → click **`</>`** (Web)
- Register app name: `motodriver-web`
- Copy the `firebaseConfig` object values

### Step 3 — Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase credentials:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=motodriver-rw.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=motodriver-rw
REACT_APP_FIREBASE_STORAGE_BUCKET=motodriver-rw.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123

REACT_APP_GROQ_API_KEY=gsk_...
```

### Step 4 — Get Groq API Key (FREE)

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Go to **API Keys** → **Create API Key**
4. Copy the key into `.env.local`

### Step 5 — Apply Firebase Security Rules

Install Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase init   # select: Firestore, Storage, Hosting
                # use existing project: motodriver-rw
```

Deploy the security rules:
```bash
firebase deploy --only firestore:rules,storage
```

### Step 6 — Run Locally

```bash
npm start
```

App opens at [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deployment Guide

### Option A — Deploy to Vercel (Recommended, Easiest)

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: MotoDriver Rwanda MVP"
git remote add origin https://github.com/YOUR_USERNAME/motodriver-rw.git
git push -u origin main
```

2. Go to [https://vercel.com](https://vercel.com) → Sign in with GitHub
3. Click **"Add New Project"** → Import your `motodriver-rw` repo
4. In **Environment Variables**, add all your `.env.local` values
5. Click **Deploy** → Done! ✅

Your app will be live at `https://motodriver-rw.vercel.app`

**Auto-deploys:** Every push to `main` automatically redeploys.

---

### Option B — Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

Your app will be live at `https://motodriver-rw.web.app`

---

## 🏗️ Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                    User's Phone (PWA)                      │
│  React SPA + Service Worker (offline support)              │
│                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Home    │  │ Drivers  │  │ Profile  │  │  Auth    │  │
│  │  Page    │  │ Listing  │  │  Page    │  │  Page    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────┬──────────────────────────────────┘
                          │ HTTPS
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
  ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
  │   Firebase   │ │   Firebase  │ │  Groq API    │
  │    Auth      │ │  Firestore  │ │  (LLaMA 3)   │
  │              │ │  + Storage  │ │              │
  │  Email/Pass  │ │  drivers/   │ │  Translates  │
  │  sign-in     │ │  users/     │ │  driver bios │
  │              │ │  ratings/   │ │  to EN/FR/RW │
  └──────────────┘ └─────────────┘ └──────────────┘
```

**Data flow:**
1. User signs up → Firebase Auth creates account → Firestore stores profile
2. Driver registers → Profile + photo saved to Firestore + Storage
3. Client opens app → Drivers fetched from Firestore, sorted by GPS proximity
4. Client selects language → Groq API translates driver bio on-demand
5. Client rates driver → Rating saved to Firestore, average recalculated

---

## 📱 PWA Installation

**On Android (Chrome):**
1. Open the app URL in Chrome
2. Tap the **"Add to Home Screen"** banner or the ⋮ menu → "Install app"
3. App installs like a native app

**On iPhone (Safari):**
1. Open the app URL in Safari
2. Tap the **Share** button (box with arrow)
3. Scroll down → tap **"Add to Home Screen"**
4. Tap "Add" → Done

---

## 🔒 Security Notes

- **Firestore rules** prevent users from editing other users' data
- **Storage rules** limit uploads to authenticated users, max 5MB
- **Groq API key** is in the frontend — for production, proxy it through a serverless function
- Always remind clients to verify driver credentials offline (built into UI)

---

## 🛠️ Customization

### Add more districts
Edit `src/utils/districts.js` — each district needs `id`, `name`, `province`, `lat`, `lng`.

### Change translation model
Edit `src/services/groq.js` → change the `MODEL` constant. Free Groq models:
- `llama3-8b-8192` (fast, free)
- `mixtral-8x7b-32768` (larger context)
- `gemma2-9b-it` (alternative)

### Add more languages
Edit `src/i18n/translations.js` — add a new language key object, then add to `SUPPORTED_LANGUAGES`.

---

## 📊 Firebase Free Tier Limits

| Resource | Free Limit | Typical Usage |
|---|---|---|
| Auth users | 10,000/month | ✅ Fine for MVP |
| Firestore reads | 50,000/day | ✅ ~5,000 page views/day |
| Firestore writes | 20,000/day | ✅ Fine for MVP |
| Storage | 5 GB | ✅ ~5,000 profile photos |
| Hosting bandwidth | 10 GB/month | ✅ Fine for MVP |

---

## 🤝 Contributing

Pull requests welcome! Key areas for improvement:
- Push notifications (Firebase Cloud Messaging)
- In-app messaging between client and driver
- Driver availability toggle
- Booking/scheduling system
- Payment integration (MTN Mobile Money API)

---

## ⚠️ Disclaimer

MotoDriver Rwanda is a connection platform only. Users must independently verify driver credentials before hiring. The platform does not guarantee driver qualifications.
