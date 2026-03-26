import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAuthenticated: boolean;
  adminEmail: string | null;
  adminRole: string | null;
  token: string | null;
  login: (email: string, role: string, token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      adminEmail: null,
      adminRole: null,
      token: null,
      
      login: (email, role, token) => {
        console.log('🔐 Admin Login:', { email, role, hasToken: !!token });
        
        if (typeof window !== 'undefined') {
          // Store in both localStorage and sessionStorage for redundancy
          localStorage.setItem('adminToken', token);
          localStorage.setItem('adminEmail', email);
          localStorage.setItem('adminRole', role);
          sessionStorage.setItem('adminToken', token);
          sessionStorage.setItem('adminEmail', email);
          sessionStorage.setItem('adminRole', role);
        }
        
        set({ 
          isAuthenticated: true, 
          adminEmail: email, 
          adminRole: role, 
          token 
        });
        
        console.log('✅ Admin login successful');
      },
      
      logout: () => {
        console.log('🚪 Admin Logout');
        
        if (typeof window !== 'undefined') {
          // Clear all storage
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminEmail');
          localStorage.removeItem('adminRole');
          sessionStorage.removeItem('adminToken');
          sessionStorage.removeItem('adminEmail');
          sessionStorage.removeItem('adminRole');
          
          // Clear the persisted store
          localStorage.removeItem('admin-storage');
        }
        
        set({ 
          isAuthenticated: false, 
          adminEmail: null, 
          adminRole: null, 
          token: null 
        });
      },
      
      checkAuth: () => {
        const state = get();

        // If state already has a token, trust it — don't wipe on tab switch
        if (state.token && state.isAuthenticated) return true;

        // Try to restore from localStorage (persists across tabs and sessions)
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('adminToken');
          const email = localStorage.getItem('adminEmail');
          const role = localStorage.getItem('adminRole');

          if (token && email && role) {
            set({ isAuthenticated: true, adminEmail: email, adminRole: role, token });
            return true;
          }
        }

        return false;
      },
    }),
    {
      name: 'admin-storage',
    }
  )
);
