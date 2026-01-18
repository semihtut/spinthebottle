/**
 * Haptic feedback utilities using the Vibration API
 * Provides tactile feedback for touch interactions
 */

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection';

// Vibration patterns (in milliseconds)
const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 20],
  error: [30, 50, 30, 50, 30],
  selection: 5,
};

/**
 * Check if haptics are supported
 */
export function isHapticsSupported(): boolean {
  return 'vibrate' in navigator;
}

/**
 * Trigger haptic feedback
 */
export function haptic(pattern: HapticPattern = 'light'): void {
  if (!isHapticsSupported()) return;

  try {
    navigator.vibrate(PATTERNS[pattern]);
  } catch {
    // Silently fail if vibration is not allowed
  }
}

/**
 * Haptic feedback hook-friendly wrapper
 * Returns a function that triggers haptics only if enabled in settings
 */
export function createHapticTrigger(enabled: boolean) {
  return (pattern: HapticPattern = 'light') => {
    if (enabled) {
      haptic(pattern);
    }
  };
}

/**
 * Cancel any ongoing vibration
 */
export function cancelHaptic(): void {
  if (!isHapticsSupported()) return;

  try {
    navigator.vibrate(0);
  } catch {
    // Silently fail
  }
}
