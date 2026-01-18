import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Locale } from '@/domain';

interface SettingsState {
  // Audio
  sfxVolume: number;
  ambienceVolume: number;
  masterMuted: boolean;

  // Accessibility
  reducedMotion: boolean;
  haptics: boolean;

  // Localization
  locale: Locale;

  // Actions
  setSfxVolume: (volume: number) => void;
  setAmbienceVolume: (volume: number) => void;
  setMasterMuted: (muted: boolean) => void;
  toggleMasterMuted: () => void;
  setReducedMotion: (reduced: boolean) => void;
  setHaptics: (enabled: boolean) => void;
  setLocale: (locale: Locale) => void;
  resetSettings: () => void;
}

const getSystemReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const getSystemLocale = (): Locale => {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('tr')) return 'tr';
  return 'en';
};

const initialState = {
  sfxVolume: 0.8,
  ambienceVolume: 0.3,
  masterMuted: false,
  reducedMotion: getSystemReducedMotion(),
  haptics: true,
  locale: getSystemLocale(),
};

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setSfxVolume: (volume) =>
          set({ sfxVolume: Math.max(0, Math.min(1, volume)) }, false, 'setSfxVolume'),

        setAmbienceVolume: (volume) =>
          set(
            { ambienceVolume: Math.max(0, Math.min(1, volume)) },
            false,
            'setAmbienceVolume'
          ),

        setMasterMuted: (muted) =>
          set({ masterMuted: muted }, false, 'setMasterMuted'),

        toggleMasterMuted: () =>
          set((state) => ({ masterMuted: !state.masterMuted }), false, 'toggleMasterMuted'),

        setReducedMotion: (reduced) =>
          set({ reducedMotion: reduced }, false, 'setReducedMotion'),

        setHaptics: (enabled) => set({ haptics: enabled }, false, 'setHaptics'),

        setLocale: (locale) => set({ locale }, false, 'setLocale'),

        resetSettings: () => set(initialState, false, 'resetSettings'),
      }),
      {
        name: 'settings-store',
      }
    ),
    { name: 'SettingsStore' }
  )
);
