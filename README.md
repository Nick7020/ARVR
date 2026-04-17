# 🎮 Game-o-thon 2K26 — Hackathon Management System

<div align="center">

![Game-o-thon Banner](https://arvrhackthon.vercel.app/logo.webp)

### A Complete Full-Stack Hackathon Management Platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-arvrhackthon.vercel.app-a855f7?style=for-the-badge)](https://arvrhackthon.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Nick7020%2FARVR-22d3ee?style=for-the-badge&logo=github)](https://github.com/Nick7020/ARVR)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## 🏫 About

**Game-o-thon 2K26** is a Game Designing Hackathon organized by:

> **Zeal Institute of Business Administration, Computer Application and Research (ZIBACAR)**
> *Zeal Education Society's — In Collaboration with IIT Mandi iHub & HCI Foundation*
> *Sponsored by Vinsys IT Services Limited*

**Event Date:** 23 April 2026 | **Venue:** Zeal College, Pune

---

## ✨ Features

### 🌐 Public Website
- Futuristic AR/VR themed UI with neon glow effects
- Animated preloader with college branding
- Smooth scroll animations (Framer Motion)
- Interactive 3D model (Three.js + React Three Fiber)
- Custom cursor with spring trail effect
- Particle background with canvas
- Fully responsive (Mobile + Tablet + Desktop)
- AI Chatbot assistant (ARIA) with event info

### 📝 Registration System
- 5-step multi-stage registration form
- Personal → Academic → Team → Payment → Review
- UPI QR code payment display
- Payment screenshot upload
- Real-time form validation
- Pending approval system

### 🔐 Admin Panel (`/admin`)
- Password protected dashboard
- Tabs: Pending / Approved / Rejected / All
- View payment screenshots
- One-click Approve / Reject with reason
- Auto email with QR entry pass on approval
- Check-in status tracking with IST time
- Reset check-in functionality
- Export to Excel (all data)
- Staff Panel quick access

### 📧 Email System
- Beautiful HTML email on approval
- Unique Entry ID: `GOT2K26-XXXXXXXX`
- QR Code embedded in email
- Event details & instructions
- Rejection email with reason

### 👥 Staff Check-in Panel (`/staff`)
- 3 default staff accounts
- **Camera QR Scanner** (real-time)
- Manual ID entry fallback
- Duplicate scan prevention (3s cooldown)
- Live checked-in list with timestamps
- IST timezone display

### 🎟️ Entry Pass / Ticket
- Boarding pass style design
- All participant details
- Team members list
- Event info
- Download as PDF

---

## 🛠️ Tech Stack

### Frontend
| Technology | Usage |
|---|---|
| **React 18 + Vite** | UI Framework |
| **Tailwind CSS v4** | Styling |
| **Framer Motion** | Animations |
| **Three.js + R3F** | 3D Model |
| **@react-three/drei** | 3D Helpers |
| **html5-qrcode** | QR Scanner |
| **html2canvas + jsPDF** | PDF Generation |
| **xlsx** | Excel Export |

### Backend (Vercel Serverless)
| Technology | Usage |
|---|---|
| **Vercel Functions** | Serverless API |
| **MongoDB Atlas** | Database |
| **Mongoose** | ODM |
| **Nodemailer** | Email (Gmail SMTP) |
| **qrcode** | QR Generation |

---

## 📁 Project Structure

```
ARVR/
├── api/                    # Serverless API Functions
│   ├── register.js         # POST /api/register
│   ├── registrations.js    # GET /api/registrations
│   ├── registration.js     # GET /api/registration?id=
│   ├── approve.js          # POST /api/approve
│   ├── checkin.js          # POST /api/checkin
│   ├── reset-checkin.js    # POST /api/reset-checkin
│   ├── staff-login.js      # POST /api/staff-login
│   ├── health.js           # GET /api/health
│   ├── _model.js           # Registration Schema
│   ├── _staff.js           # Staff Schema
│   └── _db.js              # MongoDB Connection
│
├── public/
│   ├── model.glb           # 3D Model (Draco compressed)
│   ├── logo.webp           # College Logo
│   ├── qr.png              # Payment QR Code
│   ├── rulebook.pdf        # Official Rulebook
│   └── presentation.pptx  # Event Presentation
│
└── src/
    ├── components/
    │   ├── Preloader.jsx       # Loading animation
    │   ├── CursorGlow.jsx      # Custom cursor
    │   ├── ParticlesBackground.jsx
    │   ├── Navbar.jsx          # Navigation
    │   ├── Hero.jsx            # Landing section
    │   ├── About.jsx           # About section
    │   ├── Tracks.jsx          # Hack tracks
    │   ├── Timeline.jsx        # Event timeline
    │   ├── Prizes.jsx          # Prize pool
    │   ├── Rules.jsx           # Rule book
    │   ├── Footer.jsx          # Footer
    │   ├── Chatbot.jsx         # AI Assistant (ARIA)
    │   ├── RegisterModal.jsx   # Registration form
    │   ├── HackathonTicket.jsx # Entry pass
    │   ├── AdminPage.jsx       # Admin dashboard
    │   ├── StaffPanel.jsx      # Check-in scanner
    │   ├── VRModel.jsx         # 3D model wrapper
    │   └── VRModelDesktop.jsx  # Desktop 3D model
    └── App.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Gmail account (for emails)

### Installation

```bash
# Clone the repo
git clone https://github.com/Nick7020/ARVR.git
cd ARVR

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Environment Variables

```env
VITE_API_URL=https://your-domain.vercel.app

# Vercel Environment Variables (set in dashboard)
MONGO_URI=mongodb+srv://...
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
RESEND_API_KEY=re_xxxxxxxxxxxx
```

### Run Locally

```bash
# Frontend
npm run dev

# The API functions run on Vercel only
# For local API testing, use Vercel CLI:
npx vercel dev
```

---

## 🌐 Deployment

### Deploy to Vercel (Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repo
3. Add environment variables
4. Deploy!

```
Frontend: https://your-app.vercel.app
Admin:    https://your-app.vercel.app/admin
Staff:    https://your-app.vercel.app/staff
```

---

## 🔑 Default Credentials

| Role | URL | Username | Password |
|---|---|---|---|
| Admin | `/admin` | — | `password` |
| Staff 1 | `/staff` | `1staff` | `123` |
| Staff 2 | `/staff` | `2staff` | `456` |
| Staff 3 | `/staff` | `3staff` | `789` |

---

## 📊 System Architecture

```
Student                Admin               Staff
   │                     │                   │
   ▼                     ▼                   ▼
Register Form      Admin Panel         Staff Panel
   │               (approve/reject)    (QR Scanner)
   ▼                     │                   │
Vercel API ──────────────┼───────────────────┘
   │                     │
   ▼                     ▼
MongoDB Atlas      Gmail SMTP
(store data)       (send email)
                         │
                         ▼
                   Student Email
                   (QR Entry Pass)
```

---

## 💰 Cost

**Total Cost = ₹0 / month**

| Service | Free Tier |
|---|---|
| Vercel | 100GB bandwidth, 100K API calls |
| MongoDB Atlas | 512MB storage |
| Gmail SMTP | 500 emails/day |
| GitHub | Unlimited |

---

## 👨‍💻 Built By

**Nikhil Mistari**
MCA Department — ZIBACAR, Pune

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077b5?style=flat&logo=linkedin)](https://linkedin.com)
[![GitHub](https://img.shields.io/badge/GitHub-Nick7020-333?style=flat&logo=github)](https://github.com/Nick7020)

---

## 📄 License

MIT License — Free to use and modify

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ by MCA Department · ZIBACAR · 2026

</div>
