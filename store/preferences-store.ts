import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PersonalityMode = 'hacker' | 'chill' | 'gamer' | 'focus';
export type FontType = 'Inter' | 'JetBrains Mono' | 'Fira Code' | 'System';

interface PreferencesState {
  // Theme & Identity
  personalityMode: PersonalityMode;
  accentColor: string;
  theme: 'dark' | 'light';
  
  // Visuals
  fontFamily: FontType;
  motionIntensity: number; // 0 to 1
  reducedMotion: boolean;
  
  // IDE specific
  hackerModeActive: boolean; // Overrides visuals when enabled (neon, matrix)
  soundEnabled: boolean;

  // Extras
  matrixRainUnlocked: boolean;
  
  // Background Engine
  desktopBackgroundActive: boolean;
  backgroundParallax: number; // 0 to 1
  backgroundBlur: number; // 0 to 1
  backgroundOpacity: number; // 0 to 1
  
  // Actions
  setPersonalityMode: (mode: PersonalityMode) => void;
  setAccentColor: (color: string) => void;
  setFontFamily: (font: FontType) => void;
  setMotionIntensity: (intensity: number) => void;
  toggleReducedMotion: () => void;
  toggleHackerMode: () => void;
  toggleSound: () => void;
  unlockMatrixRain: () => void;
  resetToDefaults: () => void;

  // Background Actions
  setDesktopBackgroundActive: (active: boolean) => void;
  setBackgroundParallax: (val: number) => void;
  setBackgroundBlur: (val: number) => void;
  setBackgroundOpacity: (val: number) => void;
}

const defaultState = {
  personalityMode: 'hacker' as PersonalityMode,
  accentColor: '#8b5cf6', // purple-500
  theme: 'dark' as const,
  fontFamily: 'JetBrains Mono' as FontType,
  motionIntensity: 0.75,
  reducedMotion: false,
  hackerModeActive: true,
  soundEnabled: true,
  matrixRainUnlocked: false,
  desktopBackgroundActive: false,
  backgroundParallax: 0.5,
  backgroundBlur: 0.2, // light blur by default
  backgroundOpacity: 0.8, // dark overlay to ensure readability
};

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      ...defaultState,
      
      setPersonalityMode: (mode) => set({ personalityMode: mode }),
      setAccentColor: (color) => set({ accentColor: color }),
      setFontFamily: (font) => set({ fontFamily: font }),
      setMotionIntensity: (intensity) => set({ motionIntensity: intensity }),
      toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
      toggleHackerMode: () => set((state) => ({ hackerModeActive: !state.hackerModeActive })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      unlockMatrixRain: () => set({ matrixRainUnlocked: true }),
      resetToDefaults: () => set(defaultState),
      
      setDesktopBackgroundActive: (active) => set({ desktopBackgroundActive: active }),
      setBackgroundParallax: (val) => set({ backgroundParallax: val }),
      setBackgroundBlur: (val) => set({ backgroundBlur: val }),
      setBackgroundOpacity: (val) => set({ backgroundOpacity: val }),
    }),
    {
      name: 'ide-preferences', // local storage key
    }
  )
);
