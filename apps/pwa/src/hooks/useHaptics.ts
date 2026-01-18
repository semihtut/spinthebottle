import { useCallback } from 'react';
import { useSettingsStore } from '@/app/providers';
import { haptic, isHapticsSupported } from '@/utils/haptics';

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection';

/**
 * Hook for triggering haptic feedback based on user settings
 */
export function useHaptics() {
  const hapticsEnabled = useSettingsStore((s) => s.haptics);

  const trigger = useCallback(
    (pattern: HapticPattern = 'light') => {
      if (hapticsEnabled && isHapticsSupported()) {
        haptic(pattern);
      }
    },
    [hapticsEnabled]
  );

  return {
    trigger,
    isSupported: isHapticsSupported(),
    isEnabled: hapticsEnabled,
  };
}
