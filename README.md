# DawaiLo - Medicine Management System

A prescription-driven medicine management system with role-based access for doctors, pharmacists, and patients.

## 🚀 Quick Deploy to Render

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Select your `dawai-lo` repository
5. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node server/index.js`
6. Add Environment Variables:
   ```
   NODE_ENV=production
   JWT_SECRET=<generate-random-string>
   JWT_EXPIRES_IN=7d
   DB_PATH=./server/dawai-lo.db
   CORS_ORIGIN=*
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   LOG_LEVEL=info
   ```
7. Click "Create Web Service"

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Test
Visit your Render URL and login with:
- Doctor: doctor@test.com / doctor123
- Pharmacist: pharmacist@test.com / pharma123
- Patient: patient@test.com / patient123

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development (frontend + backend)
npm run dev:all

# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

---

## 🏗️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Zustand, React Router  
**Backend:** Node.js, Express, SQLite, JWT, bcrypt  
**Security:** Helmet, CORS, Rate Limiting, Password Hashing

---

## 📋 Features

- **Doctor Portal:** Manage patients and create prescriptions
- **Pharmacist Portal:** View prescriptions for dispensing
- **Patient Portal:** Track medicine adherence with notifications
- **Security:** JWT authentication, password hashing, role-based access
- **Notifications:** Browser notifications for medicine reminders

---

## 📁 Project Structure

```
dawai-lo/
├── src/                    # Frontend React app
│   ├── components/         # Reusable UI components
│   ├── pages/             # Route pages (doctor/pharmacist/patient)
│   ├── store/             # Zustand state management
│   └── utils/             # API client, notifications, helpers
├── server/                # Backend Node.js server
│   ├── middleware/        # Auth middleware
│   ├── utils/            # Logger
│   ├── config.js         # Environment config
│   ├── database.js       # SQLite setup
│   └── index.js          # Express server
├── .env.example          # Environment variables template
└── package.json          # Dependencies and scripts
```

---

## 🔐 Security Features

- JWT token authentication
- bcrypt password hashing
- Role-based access control
- Rate limiting (100 req/15min)
- CORS protection
- Security headers (Helmet)
- SQL injection prevention

---

## 🌐 Environment Variables

Copy `.env.example` to `.env` and update:

```bash
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

---

## 📦 Scripts

```bash
npm run dev          # Frontend only
npm run server       # Backend only
npm run dev:all      # Both frontend and backend
npm run build        # Build for production
npm start            # Production mode
```

---

## 🆘 Troubleshooting

**Build fails:** Check Node.js version (18.x recommended)  
**Login fails:** Verify JWT_SECRET is set  
**CORS errors:** Check CORS_ORIGIN matches your frontend URL  
**Database issues:** Delete `server/dawai-lo.db` and restart

---

## 📄 License

MIT

---

**Built with ❤️ for better healthcare outcomes** 💊
