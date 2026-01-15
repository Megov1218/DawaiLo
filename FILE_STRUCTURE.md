# 📁 DawaiLo - Complete File Structure

```
dawai-lo/
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies and scripts
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS config
│   ├── postcss.config.js         # PostCSS config
│   └── .gitignore                # Git ignore rules
│
├── 📚 Documentation
│   ├── README.md                 # Project overview
│   ├── SETUP.md                  # Detailed setup guide
│   ├── QUICK_START.md            # 3-step quick start
│   ├── FEATURES.md               # Feature checklist
│   ├── PROJECT_SUMMARY.md        # Complete summary
│   └── FILE_STRUCTURE.md         # This file
│
├── 🚀 Startup
│   └── start.bat                 # Windows quick start script
│
├── 🎨 Frontend (src/)
│   │
│   ├── 📄 Entry Points
│   │   ├── main.jsx              # React entry point
│   │   ├── App.jsx               # Main app with routing
│   │   └── index.css             # Global styles + Tailwind
│   │
│   ├── 📦 Components (src/components/)
│   │   ├── ConfirmDialog.jsx    # Confirmation modal
│   │   ├── LoadingSpinner.jsx   # Loading indicator
│   │   ├── MedicineCard.jsx     # Medicine display card
│   │   ├── RoleGuard.jsx        # Route protection
│   │   ├── StatusBadge.jsx      # Status indicator
│   │   └── Toast.jsx            # Toast notification wrapper
│   │
│   ├── 📄 Pages (src/pages/)
│   │   │
│   │   ├── Home.jsx             # Landing page
│   │   ├── Login.jsx            # Authentication
│   │   │
│   │   ├── 🩺 Doctor Portal (src/pages/doctor/)
│   │   │   ├── DoctorDashboard.jsx      # Doctor home
│   │   │   ├── CreatePrescription.jsx   # New prescription
│   │   │   └── EditPrescription.jsx     # Edit/stop medicines
│   │   │
│   │   ├── 💊 Pharmacist Portal (src/pages/pharmacist/)
│   │   │   └── PharmacistDashboard.jsx  # View prescriptions
│   │   │
│   │   └── 👤 Patient Portal (src/pages/patient/)
│   │       ├── PatientDashboard.jsx     # Today's schedule
│   │       └── PatientHistory.jsx       # Adherence history
│   │
│   ├── 🗄️ State Management (src/store/)
│   │   └── useAppStore.js       # Zustand store (auth only)
│   │
│   └── 🛠️ Utilities (src/utils/)
│       ├── api.js               # API client functions
│       ├── notifications.js     # Browser notifications
│       ├── schedule.js          # Schedule calculations
│       └── storage.js           # Mock data (legacy)
│
├── 🔧 Backend (server/)
│   ├── index.js                 # Express server + API routes
│   ├── database.js              # SQLite setup + schema
│   ├── package.json             # ES module config
│   └── dawai-lo.db              # SQLite database (auto-created)
│
└── 🌐 Public
    └── index.html               # HTML entry point

```

---

## 📊 File Count by Category

| Category | Files | Purpose |
|----------|-------|---------|
| 📚 Documentation | 6 | Guides and references |
| 🎨 Components | 6 | Reusable UI elements |
| 📄 Pages | 8 | Route-based views |
| 🛠️ Utilities | 4 | Helper functions |
| 🔧 Backend | 3 | Server and database |
| ⚙️ Config | 5 | Build and style config |
| **Total** | **32** | **Core project files** |

---

## 🎯 Key Files Explained

### Must-Read Files
1. **QUICK_START.md** - Get running in 3 steps
2. **src/App.jsx** - Routing and structure
3. **server/index.js** - All API endpoints
4. **server/database.js** - Database schema

### Important Components
1. **RoleGuard.jsx** - Protects routes by role
2. **Toast.jsx** - User feedback system
3. **ConfirmDialog.jsx** - Confirmation modals
4. **LoadingSpinner.jsx** - Loading states

### Core Pages
1. **Home.jsx** - Landing page (entry point)
2. **Login.jsx** - Authentication
3. **DoctorDashboard.jsx** - Doctor home
4. **PatientDashboard.jsx** - Patient home

### Utilities
1. **api.js** - All backend communication
2. **notifications.js** - Browser notifications
3. **schedule.js** - Medicine scheduling logic
4. **useAppStore.js** - Global state (auth)

---

## 🔄 Data Flow

```
User Action
    ↓
React Component
    ↓
API Call (src/utils/api.js)
    ↓
Express Route (server/index.js)
    ↓
Database Query (server/database.js)
    ↓
SQLite Database (server/dawai-lo.db)
    ↓
Response Back Up the Chain
    ↓
UI Update + Toast Notification
```

---

## 🎨 Component Hierarchy

```
App.jsx
├── Toast.jsx (global)
├── Home.jsx
├── Login.jsx
└── RoleGuard.jsx
    ├── DoctorDashboard.jsx
    │   └── (links to CreatePrescription, EditPrescription)
    │
    ├── CreatePrescription.jsx
    │   ├── LoadingSpinner.jsx
    │   └── (form inputs)
    │
    ├── EditPrescription.jsx
    │   ├── LoadingSpinner.jsx
    │   ├── ConfirmDialog.jsx
    │   └── (form inputs)
    │
    ├── PharmacistDashboard.jsx
    │   ├── LoadingSpinner.jsx
    │   └── MedicineCard.jsx
    │
    ├── PatientDashboard.jsx
    │   ├── LoadingSpinner.jsx
    │   └── StatusBadge.jsx
    │
    └── PatientHistory.jsx
        ├── LoadingSpinner.jsx
        └── StatusBadge.jsx
```

---

## 🗄️ Database Files

### Location
```
server/dawai-lo.db
```

### Tables (4)
1. **users** - All user accounts
2. **prescriptions** - Doctor-patient links
3. **medicines** - Prescription details
4. **adherence_logs** - Patient tracking

### Auto-Created
- Database is created automatically on first run
- Seeded with 5 test users
- No manual setup needed

---

## 📝 Configuration Files

### package.json
```json
{
  "scripts": {
    "dev": "vite",              // Frontend only
    "server": "node server/index.js",  // Backend only
    "dev:all": "concurrently ..."      // Both together
  }
}
```

### vite.config.js
- React plugin
- Port 5173 (default)

### tailwind.config.js
- Custom font sizes (larger)
- Content paths for purging

### postcss.config.js
- Tailwind CSS
- Autoprefixer

---

## 🚀 Startup Files

### start.bat (Windows)
```batch
Opens two terminals:
1. Backend server (port 3001)
2. Frontend dev server (port 5173)
```

### Alternative: npm run dev:all
```bash
Runs both servers concurrently in one terminal
```

---

## 📦 Dependencies

### Frontend (package.json)
```
react, react-dom          # UI framework
react-router-dom          # Routing
zustand                   # State management
dayjs                     # Date handling
react-hot-toast           # Notifications
tailwindcss               # Styling
vite                      # Build tool
```

### Backend (package.json)
```
express                   # Web framework
cors                      # CORS handling
better-sqlite3            # Database
```

---

## 🎯 File Naming Conventions

### Components
- PascalCase: `MedicineCard.jsx`
- Descriptive: `ConfirmDialog.jsx`
- Reusable: Used across multiple pages

### Pages
- PascalCase: `DoctorDashboard.jsx`
- Role-based folders: `doctor/`, `patient/`, `pharmacist/`
- Clear purpose: `CreatePrescription.jsx`

### Utilities
- camelCase: `api.js`, `notifications.js`
- Functional: Helper functions only
- No UI components

### Config
- lowercase: `vite.config.js`
- Standard names: `package.json`, `tailwind.config.js`

---

## 🔍 Finding Things Quickly

### Need to change...

**API endpoints?**
→ `server/index.js`

**Database schema?**
→ `server/database.js`

**Routing?**
→ `src/App.jsx`

**Styles?**
→ `src/index.css` or `tailwind.config.js`

**Authentication?**
→ `src/pages/Login.jsx` + `src/store/useAppStore.js`

**Doctor features?**
→ `src/pages/doctor/`

**Patient features?**
→ `src/pages/patient/`

**Pharmacist features?**
→ `src/pages/pharmacist/`

**Reusable UI?**
→ `src/components/`

**Helper functions?**
→ `src/utils/`

---

## 📈 File Size Overview

| Category | Approximate Size |
|----------|-----------------|
| Frontend Code | ~60 KB |
| Backend Code | ~15 KB |
| Documentation | ~50 KB |
| Config Files | ~5 KB |
| Database | ~20 KB (with data) |
| **Total** | **~150 KB** |

*Excluding node_modules (~200 MB)*

---

## 🎓 Learning Path

### Start Here
1. `QUICK_START.md` - Get it running
2. `src/App.jsx` - Understand routing
3. `src/pages/Login.jsx` - See authentication
4. `server/index.js` - Explore API

### Then Explore
5. `src/pages/doctor/DoctorDashboard.jsx`
6. `src/pages/patient/PatientDashboard.jsx`
7. `src/utils/api.js`
8. `server/database.js`

### Finally Master
9. `src/components/` - Reusable patterns
10. `FEATURES.md` - Complete feature list
11. `PROJECT_SUMMARY.md` - Big picture

---

## 🎉 You're Ready!

This file structure is designed for:
- ✅ Easy navigation
- ✅ Clear separation of concerns
- ✅ Scalability
- ✅ Maintainability
- ✅ Team collaboration

**Happy coding!** 💻
