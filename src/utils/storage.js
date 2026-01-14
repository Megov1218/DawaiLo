// Mock users for MVP
export const MOCK_USERS = [
  { id: '1', name: 'Dr. Sharma', email: 'doctor@test.com', password: 'doctor123', role: 'doctor' },
  { id: '2', name: 'Pharmacist Kumar', email: 'pharmacist@test.com', password: 'pharma123', role: 'pharmacist' },
  { id: '3', name: 'Patient Singh', email: 'patient@test.com', password: 'patient123', role: 'patient' },
];

export const authenticateUser = (email, password) => {
  return MOCK_USERS.find(u => u.email === email && u.password === password);
};
