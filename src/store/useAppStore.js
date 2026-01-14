import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      role: null,
      
      login: (userData) => set({ user: userData, role: userData.role }),
      logout: () => set({ user: null, role: null, prescriptions: [], medicines: [], adherenceLogs: [] }),

      // Prescriptions
      prescriptions: [],
      
      addPrescription: (prescription) => set((state) => ({
        prescriptions: [...state.prescriptions, { ...prescription, id: Date.now().toString() }]
      })),
      
      updatePrescription: (id, updates) => set((state) => ({
        prescriptions: state.prescriptions.map(p => p.id === id ? { ...p, ...updates } : p)
      })),

      // Medicines
      medicines: [],
      
      addMedicine: (medicine) => set((state) => ({
        medicines: [...state.medicines, { ...medicine, id: Date.now().toString() }]
      })),
      
      updateMedicine: (id, updates) => set((state) => ({
        medicines: state.medicines.map(m => m.id === id ? { ...m, ...updates } : m)
      })),

      // Adherence Logs
      adherenceLogs: [],
      
      markDose: (medicineId, timestamp, status) => set((state) => ({
        adherenceLogs: [...state.adherenceLogs, {
          id: Date.now().toString(),
          medicineId,
          timestamp,
          status,
          markedAt: new Date().toISOString()
        }]
      })),

      getDoseStatus: (medicineId, timestamp) => {
        const logs = get().adherenceLogs;
        return logs.find(log => log.medicineId === medicineId && log.timestamp === timestamp);
      },
    }),
    {
      name: 'dawai-lo-storage',
    }
  )
);

export default useAppStore;
