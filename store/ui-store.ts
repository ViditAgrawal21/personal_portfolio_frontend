import { create } from 'zustand';

interface UIState {
  adminSidebarOpen: boolean;
  portfolioSidebarOpen: boolean;
  terminalOpen: boolean;
  theme: 'dark' | 'light';
  toggleAdminSidebar: () => void;
  togglePortfolioSidebar: () => void;
  toggleTerminal: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useUIStore = create<UIState>((set) => ({
  adminSidebarOpen: true,
  portfolioSidebarOpen: true,
  terminalOpen: true,
  theme: 'dark',
  toggleAdminSidebar: () => set((state) => ({ adminSidebarOpen: !state.adminSidebarOpen })),
  togglePortfolioSidebar: () => set((state) => ({ portfolioSidebarOpen: !state.portfolioSidebarOpen })),
  toggleTerminal: () => set((state) => ({ terminalOpen: !state.terminalOpen })),
  setTheme: (theme) => set({ theme }),
}));
