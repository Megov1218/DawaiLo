const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Token management
const getToken = () => localStorage.getItem('dawai-lo-token');
const setToken = (token) => localStorage.setItem('dawai-lo-token', token);
const removeToken = () => localStorage.removeItem('dawai-lo-token');

// API request helper with auth
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  // Handle token expiration
  if (response.status === 401 || response.status === 403) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  return response;
};

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE.replace('/api', '')}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    
    if (data.success && data.token) {
      setToken(data.token);
    }
    
    return data;
  },

  logout: () => {
    removeToken();
  },

  // Patients
  getPatients: async () => {
    const res = await apiRequest('/patients');
    return res.json();
  },

  getPatient: async (id) => {
    const res = await apiRequest(`/patients/${id}`);
    return res.json();
  },

  registerPatient: async (data) => {
    const res = await apiRequest('/patients', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.json();
  },

  searchPatients: async (query) => {
    const res = await apiRequest(`/patients/search?q=${encodeURIComponent(query)}`);
    return res.json();
  },

  // Prescriptions
  getPrescriptionsByPatient: async (patientId) => {
    const res = await apiRequest(`/prescriptions/patient/${patientId}`);
    return res.json();
  },

  getPrescriptionsByDoctor: async (doctorId) => {
    const res = await apiRequest(`/prescriptions/doctor/${doctorId}`);
    return res.json();
  },

  getAllPrescriptions: async () => {
    const res = await apiRequest('/prescriptions');
    return res.json();
  },

  createPrescription: async (data) => {
    const res = await apiRequest('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updatePrescription: async (id, data) => {
    const res = await apiRequest(`/prescriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Medicines
  getMedicinesByPrescription: async (prescriptionId) => {
    const res = await apiRequest(`/medicines/prescription/${prescriptionId}`);
    return res.json();
  },

  getMedicinesByPatient: async (patientId) => {
    const res = await apiRequest(`/medicines/patient/${patientId}`);
    return res.json();
  },

  stopMedicine: async (medicineId) => {
    const res = await apiRequest(`/medicines/${medicineId}/stop`, {
      method: 'PATCH'
    });
    return res.json();
  },

  // Adherence
  getAdherenceLogs: async (patientId) => {
    const res = await apiRequest(`/adherence/patient/${patientId}`);
    return res.json();
  },

  markDose: async (data) => {
    const res = await apiRequest('/adherence', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
