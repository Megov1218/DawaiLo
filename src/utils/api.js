const API_BASE = 'http://localhost:3001/api';

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  // Patients
  getPatients: async () => {
    const res = await fetch(`${API_BASE}/patients`);
    return res.json();
  },

  getPatient: async (id) => {
    const res = await fetch(`${API_BASE}/patients/${id}`);
    return res.json();
  },

  registerPatient: async (data) => {
    const res = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  searchPatients: async (query) => {
    const res = await fetch(`${API_BASE}/patients/search?q=${encodeURIComponent(query)}`);
    return res.json();
  },

  // Prescriptions
  getPrescriptionsByPatient: async (patientId) => {
    const res = await fetch(`${API_BASE}/prescriptions/patient/${patientId}`);
    return res.json();
  },

  getPrescriptionsByDoctor: async (doctorId) => {
    const res = await fetch(`${API_BASE}/prescriptions/doctor/${doctorId}`);
    return res.json();
  },

  getAllPrescriptions: async () => {
    const res = await fetch(`${API_BASE}/prescriptions`);
    return res.json();
  },

  createPrescription: async (data) => {
    const res = await fetch(`${API_BASE}/prescriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updatePrescription: async (id, data) => {
    const res = await fetch(`${API_BASE}/prescriptions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Medicines
  getMedicinesByPrescription: async (prescriptionId) => {
    const res = await fetch(`${API_BASE}/medicines/prescription/${prescriptionId}`);
    return res.json();
  },

  getMedicinesByPatient: async (patientId) => {
    const res = await fetch(`${API_BASE}/medicines/patient/${patientId}`);
    return res.json();
  },

  stopMedicine: async (medicineId) => {
    const res = await fetch(`${API_BASE}/medicines/${medicineId}/stop`, {
      method: 'PATCH'
    });
    return res.json();
  },

  // Adherence
  getAdherenceLogs: async (patientId) => {
    const res = await fetch(`${API_BASE}/adherence/patient/${patientId}`);
    return res.json();
  },

  markDose: async (data) => {
    const res = await fetch(`${API_BASE}/adherence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
