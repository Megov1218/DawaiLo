# DawaiLo Setup Guide

## Quick Start (Windows)

### Option 1: Automatic Start (Easiest)
Double-click `start.bat` - this will open two command windows:
- One for the backend server (port 3001)
- One for the frontend (port 5173)

### Option 2: Manual Start

1. **Install Dependencies**
```bash
npm install
```

2. **Start Backend Server** (Terminal 1)
```bash
npm run server
```
Wait for: `🚀 DawaiLo API running on http://localhost:3001`

3. **Start Frontend** (Terminal 2)
```bash
npm run dev
```
Open browser to: `http://localhost:5173`

### Option 3: Run Both Together
```bash
npm run dev:all
```

## First Time Setup

1. The database will be automatically created on first run
2. Test users are seeded automatically
3. No additional configuration needed!

## Test the System

### 1. Login as Doctor
- Email: `doctor@test.com`
- Password: `doctor123`
- Create a prescription for a patient

### 2. Login as Pharmacist
- Email: `pharmacist@test.com`
- Password: `pharma123`
- View the prescription you just created

### 3. Login as Patient
- Email: `patient@test.com`
- Password: `patient123`
- View your medicines and mark doses

## Available Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Doctor | doctor@test.com | doctor123 |
| Pharmacist | pharmacist@test.com | pharma123 |
| Patient 1 | patient@test.com | patient123 |
| Patient 2 | patient2@test.com | patient123 |
| Patient 3 | patient3@test.com | patient123 |

## Troubleshooting

### Backend won't start
- Make sure port 3001 is not in use
- Check if Node.js is installed: `node --version`
- Try: `npm install` again

### Frontend won't start
- Make sure port 5173 is not in use
- Clear browser cache
- Try: `npm install` again

### "Connection error" on login
- Make sure the backend server is running
- Check console for errors
- Verify backend is on http://localhost:3001

### Database issues
- Delete `server/dawai-lo.db` file
- Restart the backend server
- Database will be recreated with fresh data

## Features to Test

✅ **Doctor Portal**
- Create prescription for a patient
- Add multiple medicines with schedules
- Edit existing prescriptions
- Stop a medicine

✅ **Pharmacist Portal**
- Search for patients
- View prescription details
- See all medicines to dispense

✅ **Patient Portal**
- View today's medicine schedule
- Mark doses as taken/missed
- View adherence statistics
- Check history

## Database Location

The SQLite database is stored at: `server/dawai-lo.db`

You can inspect it with any SQLite browser tool.

## Next Steps

After testing the MVP:
1. Add more patients via database
2. Test notification permissions
3. Create multiple prescriptions
4. Track adherence over multiple days
5. Test edit/stop medicine workflows

## Support

If you encounter issues:
1. Check both terminal windows for error messages
2. Verify all dependencies are installed
3. Make sure both servers are running
4. Clear browser localStorage if needed

Enjoy using DawaiLo! 💊
