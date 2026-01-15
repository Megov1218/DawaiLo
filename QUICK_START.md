# 🚀 DawaiLo - Quick Start Guide

## Get Running in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Application

**Windows Users:**
```bash
# Double-click start.bat
# OR run:
npm run dev:all
```

**Mac/Linux Users:**
```bash
npm run dev:all
```

### Step 3: Open Browser
Go to: **http://localhost:5173**

---

## 🎯 Test the Complete Workflow

### 1️⃣ Login as Doctor
```
Email: doctor@test.com
Password: doctor123
```

**Actions:**
- Click "Create Prescription"
- Select "Rajesh Singh" as patient
- Add medicine: "Amoxicillin 500mg"
- Set frequency: 3 times per day
- Add times: 08:00, 14:00, 20:00
- Set dates: Today to 7 days from now
- Click "Save Prescription"

### 2️⃣ Login as Pharmacist
```
Email: pharmacist@test.com
Password: pharma123
```

**Actions:**
- Search for "Rajesh"
- Click "View Medicines"
- See the prescription you just created
- Note: You can't edit anything (read-only)

### 3️⃣ Login as Patient
```
Email: patient@test.com
Password: patient123
```

**Actions:**
- See today's medicine schedule
- Click "Mark Taken" for a dose
- Check adherence percentage
- Click "History" to see logs

---

## 🎨 What You'll See

### Landing Page
- Colorful hero section
- Interactive portal cards (hover to see features)
- "How It Works" flow diagram
- "Get Started" button

### Doctor Portal
- Clean dashboard
- Patient search
- Prescription form with multiple medicines
- Edit/stop medicine options

### Pharmacist Portal
- Search all prescriptions
- Expandable medicine lists
- Doctor and patient information
- Read-only access

### Patient Portal
- Today's schedule with times
- Adherence statistics
- Mark taken/missed buttons
- History page with date grouping

---

## 🔧 Troubleshooting

### "Connection error" message?
**Backend isn't running!**
```bash
# Open a new terminal and run:
npm run server
```

### Port already in use?
**Kill the process:**
```bash
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

### Database issues?
**Reset the database:**
```bash
# Delete the database file
rm server/dawai-lo.db  # Mac/Linux
del server\dawai-lo.db  # Windows

# Restart the server - it will recreate
npm run server
```

---

## 📱 Test Accounts

| Role | Email | Password | Name |
|------|-------|----------|------|
| 👨‍⚕️ Doctor | doctor@test.com | doctor123 | Dr. Sharma |
| 💊 Pharmacist | pharmacist@test.com | pharma123 | Pharmacist Kumar |
| 👤 Patient 1 | patient@test.com | patient123 | Rajesh Singh |
| 👤 Patient 2 | patient2@test.com | patient123 | Priya Patel |
| 👤 Patient 3 | patient3@test.com | patient123 | Amit Verma |

---

## 🎯 Key Features to Test

### Doctor Features
- ✅ Create prescription for any patient
- ✅ Add multiple medicines
- ✅ Set custom schedules
- ✅ Edit existing prescriptions
- ✅ Stop a medicine

### Pharmacist Features
- ✅ Search prescriptions
- ✅ View all medicine details
- ✅ See doctor information
- ✅ Cannot edit anything

### Patient Features
- ✅ View only YOUR medicines
- ✅ See today's schedule
- ✅ Mark doses taken/missed
- ✅ Track adherence percentage
- ✅ View history

---

## 🎉 Success Indicators

You'll know it's working when:

1. **Doctor creates prescription** → Shows in doctor dashboard
2. **Pharmacist searches patient** → Sees the same prescription
3. **Patient logs in** → Sees only their medicines
4. **Patient marks dose** → Adherence percentage updates
5. **Doctor edits prescription** → Changes reflect everywhere

---

## 📚 More Information

- **Full Setup Guide**: See `SETUP.md`
- **Feature List**: See `FEATURES.md`
- **Technical Details**: See `README.md`

---

## 💡 Pro Tips

1. **Test with multiple patients**: Create prescriptions for patient2 and patient3
2. **Test date filtering**: Create medicines with past end dates (they won't show)
3. **Test notifications**: Allow browser notifications when prompted
4. **Test search**: Try searching in doctor and pharmacist portals
5. **Test edit flow**: Create → Edit → Stop a medicine

---

## 🆘 Need Help?

**Check these in order:**
1. Are both servers running? (frontend + backend)
2. Is the backend on port 3001?
3. Is the frontend on port 5173?
4. Any errors in the terminal?
5. Any errors in browser console (F12)?

**Still stuck?** Check the terminal output for specific error messages.

---

## 🚀 You're Ready!

The system is designed to be intuitive. Just follow the workflow:

**Doctor prescribes → Pharmacist dispenses → Patient tracks**

Enjoy exploring DawaiLo! 💊
