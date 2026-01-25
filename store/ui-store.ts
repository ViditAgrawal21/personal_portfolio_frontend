import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  terminalOpen: boolean;
  theme: 'dark' | 'light';
  toggleSidebar: () => void;
  toggleTerminal: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  terminalOpen: true,
  theme: 'dark',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleTerminal: () => set((state) => ({ terminalOpen: !state.terminalOpen })),
  setTheme: (theme) => set({ theme }),
}));
