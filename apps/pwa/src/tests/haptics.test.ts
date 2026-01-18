import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isHapticsSupported, haptic, createHapticTrigger, cancelHaptic } from '../utils/haptics';

// Declare globalThis type for navigator mocking
declare const globalThis: {
  navigator: Navigator & { vibrate?: (pattern: number | number[]) => boolean };
};

describe('haptics', () => {
  let originalNavigator: typeof globalThis.navigator;
  let mockVibrate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    originalNavigator = globalThis.navigator;
    mockVibrate = vi.fn();

    // Mock navigator with vibrate support
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        vibrate: mockVibrate,
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
    vi.clearAllMocks();
  });

  describe('isHapticsSupported', () => {
    it('should return true when vibrate is available', () => {
      expect(isHapticsSupported()).toBe(true);
    });

    it('should return false when vibrate is not available', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      });

      expect(isHapticsSupported()).toBe(false);
    });
  });

  describe('haptic', () => {
    it('should call navigator.vibrate with light pattern by default', () => {
      haptic();
      expect(mockVibrate).toHaveBeenCalledWith(10);
    });

    it('should call navigator.vibrate with medium pattern', () => {
      haptic('medium');
      expect(mockVibrate).toHaveBeenCalledWith(20);
    });

    it('should call navigator.vibrate with heavy pattern', () => {
      haptic('heavy');
      expect(mockVibrate).toHaveBeenCalledWith(30);
    });

    it('should call navigator.vibrate with success pattern', () => {
      haptic('success');
      expect(mockVibrate).toHaveBeenCalledWith([10, 50, 20]);
    });

    it('should call navigator.vibrate with error pattern', () => {
      haptic('error');
      expect(mockVibrate).toHaveBeenCalledWith([30, 50, 30, 50, 30]);
    });

    it('should call navigator.vibrate with selection pattern', () => {
      haptic('selection');
      expect(mockVibrate).toHaveBeenCalledWith(5);
    });

    it('should not throw when vibrate is not available', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      });

      expect(() => haptic('light')).not.toThrow();
    });

    it('should handle vibrate throwing an error', () => {
      mockVibrate.mockImplementation(() => {
        throw new Error('Not allowed');
      });

      expect(() => haptic('light')).not.toThrow();
    });
  });

  describe('createHapticTrigger', () => {
    it('should trigger haptic when enabled is true', () => {
      const trigger = createHapticTrigger(true);
      trigger('medium');

      expect(mockVibrate).toHaveBeenCalledWith(20);
    });

    it('should not trigger haptic when enabled is false', () => {
      const trigger = createHapticTrigger(false);
      trigger('medium');

      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it('should use light pattern by default', () => {
      const trigger = createHapticTrigger(true);
      trigger();

      expect(mockVibrate).toHaveBeenCalledWith(10);
    });
  });

  describe('cancelHaptic', () => {
    it('should call navigator.vibrate with 0 to cancel', () => {
      cancelHaptic();
      expect(mockVibrate).toHaveBeenCalledWith(0);
    });

    it('should not throw when vibrate is not available', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      });

      expect(() => cancelHaptic()).not.toThrow();
    });
  });
});
