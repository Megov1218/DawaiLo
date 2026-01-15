import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'dawai-lo.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('doctor', 'pharmacist', 'patient')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS prescriptions (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS medicines (
    id TEXT PRIMARY KEY,
    prescription_id TEXT NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency INTEGER NOT NULL,
    times TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'stopped')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS adherence_logs (
    id TEXT PRIMARY KEY,
    medicine_id TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    scheduled_time DATETIME NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('taken', 'missed')),
    marked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES users(id)
  );

  CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
  CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor ON prescriptions(doctor_id);
  CREATE INDEX IF NOT EXISTS idx_medicines_prescription ON medicines(prescription_id);
  CREATE INDEX IF NOT EXISTS idx_adherence_medicine ON adherence_logs(medicine_id);
  CREATE INDEX IF NOT EXISTS idx_adherence_patient ON adherence_logs(patient_id);
`);

// Seed initial data if empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password, role) 
    VALUES (?, ?, ?, ?, ?)
  `);

  insertUser.run('doc1', 'Dr. Sharma', 'doctor@test.com', 'doctor123', 'doctor');
  insertUser.run('pharma1', 'Pharmacist Kumar', 'pharmacist@test.com', 'pharma123', 'pharmacist');
  insertUser.run('patient1', 'Rajesh Singh', 'patient@test.com', 'patient123', 'patient');
  insertUser.run('patient2', 'Priya Patel', 'patient2@test.com', 'patient123', 'patient');
  insertUser.run('patient3', 'Amit Verma', 'patient3@test.com', 'patient123', 'patient');

  console.log('✅ Database seeded with initial users');
}

export default db;
