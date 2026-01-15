import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set) => ({
      // Auth
      user: null,
      role: null,
      
      login: (userData) => set({ user: userData, role: userData.role }),
      logout: () => set({ user: null, role: null }),
    }),
    {
      name: 'dawai-lo-auth',
    }
  )
);

export default useAppStore;
