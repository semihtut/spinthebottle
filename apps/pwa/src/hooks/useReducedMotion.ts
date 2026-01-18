import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/app/providers';

/**
 * Hook that returns true if reduced motion should be used
 * Respects both user preference and system settings
 */
export function useReducedMotion(): boolean {
  const userPreference = useSettingsStore((s) => s.reducedMotion);
  const [systemPreference, setSystemPreference] = useState(false);

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemPreference(mediaQuery.matches);

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // User preference overrides system if explicitly set
  // If user preference is false but system is true, respect system
  return userPreference || systemPreference;
}

/**
 * Returns CSS transition duration based on reduced motion preference
 */
export function useAnimationDuration(normalMs: number = 300): number {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? 0 : normalMs;
}
