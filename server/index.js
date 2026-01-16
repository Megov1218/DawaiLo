import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './database.js';
import { config } from './config.js';
import { authenticateToken, authorizeRole } from './middleware/auth.js';
import { logger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(express.json());

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { success: false, message: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      logger.warn('Login attempt with invalid password', { email });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const { password: _, ...userWithoutPassword } = user;
    
    logger.info('User logged in successfully', { userId: user.id, role: user.role });
    
    res.json({ 
      success: true, 
      user: userWithoutPassword,
      token 
    });
  } catch (error) {
    logger.error('Login error', { error: error.message });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Protected routes - require authentication
app.use('/api', authenticateToken);

// Get all patients (doctor only)
app.get('/api/patients', authorizeRole('doctor'), (req, res) => {
  try {
    const patients = db.prepare(`
      SELECT id, name, email, created_at 
      FROM users 
      WHERE role = 'patient'
      ORDER BY created_at DESC
    `).all();
    
    logger.debug('Fetched patients list', { count: patients.length });
    res.json(patients);
  } catch (error) {
    logger.error('Error fetching patients', { error: error.message });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get patient by ID
app.get('/api/patients/:id', authorizeRole('doctor', 'pharmacist'), (req, res) => {
  try {
    const patient = db.prepare(`
      SELECT id, name, email, created_at 
      FROM users 
      WHERE id = ? AND role = 'patient'
    `).get(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    logger.error('Error fetching patient', { error: error.message });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Register new patient (doctor only)
app.post('/api/patients', authorizeRole('doctor'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    const patientId = `patient_${Date.now()}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)')
      .run(patientId, name, email, hashedPassword, 'patient');
    
    logger.info('New patient registered', { patientId, doctorId: req.user.id });
    
    res.json({ success: true, patientId });
  } catch (error) {
    logger.error('Error registering patient', { error: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
});

// Search patients
app.get('/api/patients/search', authorizeRole('doctor', 'pharmacist'), (req, res) => {
  try {
    const { q } = req.query;
    const patients = db.prepare(`
      SELECT id, name, email 
      FROM users 
      WHERE role = 'patient' AND (name LIKE ? OR email LIKE ?)
    `).all(`%${q}%`, `%${q}%`);
    
    res.json(patients);
  } catch (error) {
    logger.error('Error searching patients', { error: error.message });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get prescriptions by patient
app.get('/api/prescriptions/patient/:patientId', authorizeRole('doctor', 'pharmacist', 'patient'), (req, res) => {
  try {
    // Patients can only access their own prescriptions
    if (req.user.role === 'patient' && req.user.id !== req.params.patientId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const prescriptions = db.prepare(`
      SELECT p.*, u.name as doctor_name 
      FROM prescriptions p
      JOIN users u ON p.doctor_id = u.id
      WHERE p.patient_id = ?
      ORDER BY p.created_at DESC
    `).all(req.params.patientId);
    
    res.json(prescriptions);
  } catch (error) {
    logger.error('Error fetching prescriptions', { error: error.message });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get prescriptions by doctor
app.get('/api/prescriptions/doctor/:doctorId', authorizeRole('doctor'), (req, res) => {
  try {
    // Doctors can only access their own prescriptions
    if (req.user.id !== req.params.doctorId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const prescriptions = db.prepare(`
      SELECT p.*, u.name as patient_name 
      FROM prescriptions p
      JOIN users u ON p.patient_id = u.id
      WHERE p.doctor_id = ?
      ORDER BY p.created_at DESC
    `).all(req.params.doctorId);
    
    res.json(prescriptions);
  } catch (error) {
    logger.error('Error fetching prescriptions', { error: error.message });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all prescriptions (pharmacist only)
app.get('/api/prescriptions', authorizeRole('pharmacist'), (req, res) => {
  try {
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
  } catch (error) {
    logger.error('Error fetching prescriptions', { error: error.message });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create prescription (doctor only)
app.post('/api/prescriptions', authorizeRole('doctor'), (req, res) => {
  try {
    const { patientId, doctorId, medicines } = req.body;
    
    // Verify doctor is creating their own prescription
    if (req.user.id !== doctorId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const prescriptionId = `presc_${Date.now()}`;
    
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
    
    logger.info('Prescription created', { prescriptionId, doctorId, patientId });
    
    res.json({ success: true, prescriptionId });
  } catch (error) {
    logger.error('Error creating prescription', { error: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update prescription (doctor only)
app.put('/api/prescriptions/:id', authorizeRole('doctor'), (req, res) => {
  try {
    const { medicines } = req.body;
    
    // Verify doctor owns this prescription
    const prescription = db.prepare('SELECT doctor_id FROM prescriptions WHERE id = ?').get(req.params.id);
    if (!prescription || prescription.doctor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    db.prepare('UPDATE prescriptions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(req.params.id);
    
    db.prepare('DELETE FROM medicines WHERE prescription_id = ?').run(req.params.id);
    
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
        med.startDate || med.start_date,
        med.endDate || med.end_date,
        med.status || 'active'
      );
    });
    
    logger.info('Prescription updated', { prescriptionId: req.params.id, doctorId: req.user.id });
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Error updating prescription', { error: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get medicines for a prescription
app.get('/api/medicines/prescription/:prescriptionId', (req, res) => {
  try {
    const medicines = db.prepare('SELECT * FROM medicines WHERE prescription_id = ?')
      .all(req.params.prescriptionId);
    
    const parsed = medicines.map(m => ({
      ...m,
      times: JSON.parse(m.times)
    }));
    
    res.json(parsed);
  } catch (error) {
    logger.error('Error fetching medicines', { error: error.message });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get active medicines for a patient
app.get('/api/medicines/patient/:patientId', authorizeRole('patient', 'doctor'), (req, res) => {
  try {
    // Patients can only access their own medicines
    if (req.user.role === 'patient' && req.user.id !== req.params.patientId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

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
  } catch (error) {
    logger.error('Error fetching patient medicines', { error: error.message });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Stop a medicine (doctor only)
app.patch('/api/medicines/:id/stop', authorizeRole('doctor'), (req, res) => {
  try {
    db.prepare('UPDATE medicines SET status = ? WHERE id = ?').run('stopped', req.params.id);
    logger.info('Medicine stopped', { medicineId: req.params.id, doctorId: req.user.id });
    res.json({ success: true });
  } catch (error) {
    logger.error('Error stopping medicine', { error: error.message });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get adherence logs for patient
app.get('/api/adherence/patient/:patientId', authorizeRole('patient', 'doctor'), (req, res) => {
  try {
    // Patients can only access their own logs
    if (req.user.role === 'patient' && req.user.id !== req.params.patientId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const logs = db.prepare('SELECT * FROM adherence_logs WHERE patient_id = ? ORDER BY scheduled_time DESC')
      .all(req.params.patientId);
    res.json(logs);
  } catch (error) {
    logger.error('Error fetching adherence logs', { error: error.message });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Mark dose (patient only)
app.post('/api/adherence', authorizeRole('patient'), (req, res) => {
  try {
    const { medicineId, patientId, scheduledTime, status } = req.body;
    
    // Verify patient is marking their own dose
    if (req.user.id !== patientId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const logId = `log_${Date.now()}`;
    
    db.prepare(`
      INSERT INTO adherence_logs (id, medicine_id, patient_id, scheduled_time, status)
      VALUES (?, ?, ?, ?, ?)
    `).run(logId, medicineId, patientId, scheduledTime, status);
    
    logger.info('Dose marked', { logId, patientId, status });
    
    res.json({ success: true, logId });
  } catch (error) {
    logger.error('Error marking dose', { error: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Serve static files in production
if (config.nodeEnv === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  
  // All non-API routes serve React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start server
app.listen(config.port, () => {
  logger.info(`🚀 DawaiLo API running on http://localhost:${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`CORS origin: ${config.cors.origin}`);
});
