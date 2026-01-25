import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAuthenticated: boolean;
  adminEmail: string | null;
  adminRole: string | null;
  token: string | null;
  login: (email: string, role: string, token: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      adminEmail: null,
      adminRole: null,
      token: null,
      login: (email, role, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('adminToken', token);
          localStorage.setItem('adminEmail', email);
          localStorage.setItem('adminRole', role);
        }
        set({ isAuthenticated: true, adminEmail: email, adminRole: role, token });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminEmail');
          localStorage.removeItem('adminRole');
        }
        set({ isAuthenticated: false, adminEmail: null, adminRole: null, token: null });
      },
    }),
    {
      name: 'admin-storage',
    }
  )
);
