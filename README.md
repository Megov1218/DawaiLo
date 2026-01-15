# DawaiLo - Medicine Management System

A prescription-driven medicine management system with role-based access for doctors, pharmacists, and patients.

## Features

- **Doctor Portal**: Create and manage digital prescriptions
- **Pharmacist Portal**: View prescriptions for accurate dispensing
- **Patient Portal**: Track medicine adherence with notifications
- **Browser Notifications**: Timely reminders for medicine intake
- **Adherence Tracking**: Complete history and statistics
- **Database Backend**: SQLite with proper data relationships

## Tech Stack

**Frontend:**
- React + Vite
- Tailwind CSS
- Zustand (state management)
- React Router
- Day.js
- React Hot Toast

**Backend:**
- Node.js + Express
- SQLite (better-sqlite3)
- RESTful API

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Run both frontend and backend together
npm run dev:all

# Or run separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`  
The backend API will run on `http://localhost:3001`

## Test Credentials

- **Doctor**: doctor@test.com / doctor123
- **Pharmacist**: pharmacist@test.com / pharma123
- **Patient**: patient@test.com / patient123
- **Patient 2**: patient2@test.com / patient123
- **Patient 3**: patient3@test.com / patient123

## Key Features Implemented

✅ Patient-doctor data isolation  
✅ Medicine duration filtering  
✅ Edit/stop prescriptions  
✅ Toast notifications  
✅ Loading states  
✅ Empty states  
✅ Confirmation dialogs  
✅ Search functionality  
✅ Database with proper relationships  
✅ RESTful API  

## Database Schema

- **users**: Doctors, pharmacists, and patients
- **prescriptions**: Links doctors to patients
- **medicines**: Prescription details with dosage and schedule
- **adherence_logs**: Patient dose tracking

## Future Enhancements

- Mediclaim automation
- Insurance API integration
- Payment processing
- Advanced analytics
- Mobile app

## License

MIT
