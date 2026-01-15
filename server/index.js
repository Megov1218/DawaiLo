import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Auth
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get all patients (for doctor)
app.get('/api/patients', (req, res) => {
  const patients = db.prepare(`
    SELECT id, name, email, created_at 
    FROM users 
    WHERE role = 'patient'
    ORDER BY created_at DESC
  `).all();
  res.json(patients);
});

// Get patient by ID with details
app.get('/api/patients/:id', (req, res) => {
  const patient = db.prepare(`
    SELECT id, name, email, created_at 
    FROM users 
    WHERE id = ? AND role = 'patient'
  `).get(req.params.id);
  
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }
  
  res.json(patient);
});

// Register new patient (doctor only)
app.post('/api/patients', (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if email already exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }
  
  const patientId = `patient_${Date.now()}`;
  
  try {
    db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)')
      .run(patientId, name, email, password, 'patient');
    
    res.json({ success: true, patientId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get prescriptions by patient
app.get('/api/prescriptions/patient/:patientId', (req, res) => {
  const prescriptions = db.prepare(`
    SELECT p.*, u.name as doctor_name 
    FROM prescriptions p
    JOIN users u ON p.doctor_id = u.id
    WHERE p.patient_id = ?
    ORDER BY p.created_at DESC
  `).all(req.params.patientId);
  
  res.json(prescriptions);
});

// Get prescriptions by doctor
app.get('/api/prescriptions/doctor/:doctorId', (req, res) => {
  const prescriptions = db.prepare(`
    SELECT p.*, u.name as patient_name 
    FROM prescriptions p
    JOIN users u ON p.patient_id = u.id
    WHERE p.doctor_id = ?
    ORDER BY p.created_at DESC
  `).all(req.params.doctorId);
  
  res.json(prescriptions);
});

// Get all prescriptions (for pharmacist)
app.get('/api/prescriptions', (req, res) => {
  const prescriptions = db.prepare(`
    SELECT p.*, 
           u1.name as patient_name,
           u2.name as doctor_name
    FROM prescriptions p
    JOIN users u1 ON p.patient_id = u1.id
    JOIN users u2 ON p.doctor_id = u2.id
    ORDER BY p.created_at DESC
  `).all();
  
  res.json(prescriptions);
});

// Create prescription
app.post('/api/prescriptions', (req, res) => {
  const { patientId, doctorId, medicines } = req.body;
  
  const prescriptionId = `presc_${Date.now()}`;
  
  try {
    db.prepare('INSERT INTO prescriptions (id, patient_id, doctor_id) VALUES (?, ?, ?)')
      .run(prescriptionId, patientId, doctorId);
    
    const insertMedicine = db.prepare(`
      INSERT INTO medicines (id, prescription_id, name, dosage, frequency, times, start_date, end_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    medicines.forEach(med => {
      const medicineId = `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      insertMedicine.run(
        medicineId,
        prescriptionId,
        med.name,
        med.dosage,
        med.frequency,
        JSON.stringify(med.times),
        med.startDate,
        med.endDate
      );
    });
    
    res.json({ success: true, prescriptionId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update prescription
app.put('/api/prescriptions/:id', (req, res) => {
  const { medicines } = req.body;
  
  try {
    db.prepare('UPDATE prescriptions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(req.params.id);
    
    // Delete existing medicines
    db.prepare('DELETE FROM medicines WHERE prescription_id = ?').run(req.params.id);
    
    // Insert updated medicines
    const insertMedicine = db.prepare(`
      INSERT INTO medicines (id, prescription_id, name, dosage, frequency, times, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    medicines.forEach(med => {
      const medicineId = `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      insertMedicine.run(
        medicineId,
        req.params.id,
        med.name,
        med.dosage,
        med.frequency,
        JSON.stringify(med.times),
        med.startDate,
        med.endDate,
        med.status || 'active'
      );
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get medicines for a prescription
app.get('/api/medicines/prescription/:prescriptionId', (req, res) => {
  const medicines = db.prepare('SELECT * FROM medicines WHERE prescription_id = ?')
    .all(req.params.prescriptionId);
  
  const parsed = medicines.map(m => ({
    ...m,
    times: JSON.parse(m.times)
  }));
  
  res.json(parsed);
});

// Get active medicines for a patient
app.get('/api/medicines/patient/:patientId', (req, res) => {
  const medicines = db.prepare(`
    SELECT m.* 
    FROM medicines m
    JOIN prescriptions p ON m.prescription_id = p.id
    WHERE p.patient_id = ? 
      AND m.status = 'active'
      AND DATE(m.end_date) >= DATE('now')
    ORDER BY m.created_at DESC
  `).all(req.params.patientId);
  
  const parsed = medicines.map(m => ({
    ...m,
    times: JSON.parse(m.times)
  }));
  
  res.json(parsed);
});

// Stop a medicine
app.patch('/api/medicines/:id/stop', (req, res) => {
  db.prepare('UPDATE medicines SET status = ? WHERE id = ?').run('stopped', req.params.id);
  res.json({ success: true });
});

// Get adherence logs for patient
app.get('/api/adherence/patient/:patientId', (req, res) => {
  const logs = db.prepare('SELECT * FROM adherence_logs WHERE patient_id = ? ORDER BY scheduled_time DESC')
    .all(req.params.patientId);
  res.json(logs);
});

// Mark dose
app.post('/api/adherence', (req, res) => {
  const { medicineId, patientId, scheduledTime, status } = req.body;
  
  const logId = `log_${Date.now()}`;
  
  try {
    db.prepare(`
      INSERT INTO adherence_logs (id, medicine_id, patient_id, scheduled_time, status)
      VALUES (?, ?, ?, ?, ?)
    `).run(logId, medicineId, patientId, scheduledTime, status);
    
    res.json({ success: true, logId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Search patients
app.get('/api/patients/search', (req, res) => {
  const { q } = req.query;
  const patients = db.prepare(`
    SELECT id, name, email 
    FROM users 
    WHERE role = 'patient' AND (name LIKE ? OR email LIKE ?)
  `).all(`%${q}%`, `%${q}%`);
  
  res.json(patients);
});

app.listen(PORT, () => {
  console.log(`🚀 DawaiLo API running on http://localhost:${PORT}`);
});
