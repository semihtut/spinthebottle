import { useRef, useCallback, useEffect } from 'react';
import type { GestureData } from '@/engine/spin';

interface SpinGestureOptions {
  onGestureStart?: () => void;
  onGestureMove?: (angle: number) => void;
  onGestureEnd?: (gesture: GestureData) => void;
  disabled?: boolean;
  minVelocity?: number;
}

interface GestureState {
  isActive: boolean;
  startTime: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  lastTime: number;
  velocityX: number;
  velocityY: number;
  centerX: number;
  centerY: number;
}

export function useSpinGesture(
  elementRef: React.RefObject<HTMLElement | null>,
  options: SpinGestureOptions = {}
) {
  const {
    onGestureStart,
    onGestureMove,
    onGestureEnd,
    disabled = false,
    minVelocity = 100,
  } = options;

  const gestureState = useRef<GestureState>({
    isActive: false,
    startTime: 0,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    velocityX: 0,
    velocityY: 0,
    centerX: 0,
    centerY: 0,
  });

  const getEventCoords = useCallback(
    (e: MouseEvent | TouchEvent): { x: number; y: number } => {
      if ('touches' in e && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      if ('clientX' in e) {
        return { x: e.clientX, y: e.clientY };
      }
      return { x: 0, y: 0 };
    },
    []
  );

  const calculateAngle = useCallback((x: number, y: number): number => {
    const state = gestureState.current;
    const dx = x - state.centerX;
    const dy = y - state.centerY;
    return Math.atan2(dy, dx);
  }, []);

  const handleStart = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (disabled) return;

      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const { x, y } = getEventCoords(e);

      gestureState.current = {
        isActive: true,
        startTime: performance.now(),
        startX: x,
        startY: y,
        lastX: x,
        lastY: y,
        lastTime: performance.now(),
        velocityX: 0,
        velocityY: 0,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
      };

      onGestureStart?.();
    },
    [disabled, elementRef, getEventCoords, onGestureStart]
  );

  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const state = gestureState.current;
      if (!state.isActive || disabled) return;

      const { x, y } = getEventCoords(e);
      const now = performance.now();
      const dt = Math.max(now - state.lastTime, 1);

      // Calculate velocity (pixels per second)
      state.velocityX = ((x - state.lastX) / dt) * 1000;
      state.velocityY = ((y - state.lastY) / dt) * 1000;

      state.lastX = x;
      state.lastY = y;
      state.lastTime = now;

      const angle = calculateAngle(x, y);
      onGestureMove?.(angle);
    },
    [disabled, getEventCoords, calculateAngle, onGestureMove]
  );

  const handleEnd = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const state = gestureState.current;
      if (!state.isActive || disabled) return;

      state.isActive = false;

      const { x, y } = getEventCoords(e);
      const now = performance.now();
      const duration = now - state.startTime;

      // Calculate final velocity based on recent movement
      const dt = Math.max(now - state.lastTime, 1);
      if (dt < 100) {
        // Use stored velocity if recent
        // Already stored in state
      } else {
        // Recalculate from last position
        state.velocityX = ((x - state.lastX) / dt) * 1000;
        state.velocityY = ((y - state.lastY) / dt) * 1000;
      }

      const velocityMagnitude = Math.sqrt(
        state.velocityX ** 2 + state.velocityY ** 2
      );

      // Only trigger if velocity exceeds minimum threshold
      if (velocityMagnitude >= minVelocity) {
        onGestureEnd?.({
          velocityX: state.velocityX,
          velocityY: state.velocityY,
          duration,
        });
      }
    },
    [disabled, getEventCoords, minVelocity, onGestureEnd]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled) return;

    // Touch events
    element.addEventListener('touchstart', handleStart, { passive: true });
    element.addEventListener('touchmove', handleMove, { passive: true });
    element.addEventListener('touchend', handleEnd, { passive: true });
    element.addEventListener('touchcancel', handleEnd, { passive: true });

    // Mouse events
    element.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    return () => {
      element.removeEventListener('touchstart', handleStart);
      element.removeEventListener('touchmove', handleMove);
      element.removeEventListener('touchend', handleEnd);
      element.removeEventListener('touchcancel', handleEnd);
      element.removeEventListener('mousedown', handleStart);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, [elementRef, disabled, handleStart, handleMove, handleEnd]);

  return {
    isGestureActive: () => gestureState.current.isActive,
  };
}
