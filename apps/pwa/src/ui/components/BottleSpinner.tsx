import { forwardRef, useImperativeHandle, useRef, useState, useCallback } from 'react';
import { useSettingsStore } from '@/app/providers';

export interface BottleSpinnerRef {
  spin: (angle: number, duration: number) => void;
  setAngle: (angle: number) => void;
  getCurrentAngle: () => number;
}

interface BottleSpinnerProps {
  onSpinComplete?: () => void;
  className?: string;
}

export const BottleSpinner = forwardRef<BottleSpinnerRef, BottleSpinnerProps>(
  function BottleSpinner({ onSpinComplete, className = '' }, ref) {
    const bottleRef = useRef<HTMLDivElement>(null);
    const [currentAngle, setCurrentAngle] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const reducedMotion = useSettingsStore((s) => s.reducedMotion);

    const spin = useCallback(
      (targetAngle: number, duration: number) => {
        if (!bottleRef.current) return;

        setIsSpinning(true);

        if (reducedMotion) {
          // Instant result for reduced motion
          setCurrentAngle(targetAngle);
          setIsSpinning(false);
          onSpinComplete?.();
          return;
        }

        // Calculate total rotation (current + multiple spins + final position)
        const currentNormalized = currentAngle % (Math.PI * 2);
        const rotations = Math.floor(duration / 1000) + 2;
        const totalRotation = currentAngle + rotations * Math.PI * 2 + (targetAngle - currentNormalized);

        // Apply CSS transition
        bottleRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        bottleRef.current.style.transform = `rotate(${totalRotation}rad)`;

        setCurrentAngle(totalRotation);

        // Handle completion
        const timeoutId = setTimeout(() => {
          setIsSpinning(false);
          if (bottleRef.current) {
            bottleRef.current.style.transition = 'none';
          }
          onSpinComplete?.();
        }, duration);

        return () => clearTimeout(timeoutId);
      },
      [currentAngle, reducedMotion, onSpinComplete]
    );

    const setAngle = useCallback((angle: number) => {
      if (bottleRef.current) {
        bottleRef.current.style.transition = 'none';
        bottleRef.current.style.transform = `rotate(${angle}rad)`;
      }
      setCurrentAngle(angle);
    }, []);

    const getCurrentAngle = useCallback(() => currentAngle, [currentAngle]);

    useImperativeHandle(ref, () => ({
      spin,
      setAngle,
      getCurrentAngle,
    }));

    return (
      <div
        ref={bottleRef}
        className={`relative ${className}`}
        style={{
          transform: `rotate(${currentAngle}rad)`,
          transformOrigin: 'center center',
          willChange: isSpinning ? 'transform' : 'auto',
        }}
        aria-label="Bottle"
        role="img"
      >
        {/* Bottle SVG - viewBox: bottle spans from y=-55 (pointer) to y=55 (body bottom), centered at origin */}
        <svg
          viewBox="-20 -55 40 110"
          className="w-full h-full drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
        >
          <defs>
            <linearGradient id="bottleBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#34d399" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="bottleNeckGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#6ee7b7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="bottleCapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#065f46" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
            {/* Highlight gradient */}
            <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="30%" stopColor="white" stopOpacity="0.4" />
              <stop offset="50%" stopColor="white" stopOpacity="0.2" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Bottle body - ellipse at bottom half */}
          <ellipse cx="0" cy="25" rx="16" ry="30" fill="url(#bottleBodyGrad)" />

          {/* Body highlight */}
          <ellipse cx="-6" cy="20" rx="4" ry="18" fill="url(#highlightGrad)" />

          {/* Neck connecting to body */}
          <path
            d="M-6 -5 L-6 -25 Q-6 -30 -4 -30 L4 -30 Q6 -30 6 -25 L6 -5 Q6 0 0 5 Q-6 0 -6 -5"
            fill="url(#bottleNeckGrad)"
          />

          {/* Neck highlight */}
          <rect x="-5" y="-27" width="3" height="20" rx="1" fill="rgba(255,255,255,0.25)" />

          {/* Cap */}
          <rect x="-7" y="-42" width="14" height="12" rx="3" fill="url(#bottleCapGrad)" />

          {/* Cap ring */}
          <rect x="-8" y="-32" width="16" height="3" rx="1" fill="#047857" />

          {/* Pointer indicator (top) - pointing direction */}
          <polygon points="0,-55 -4,-45 4,-45" fill="#ef4444" />
        </svg>
      </div>
    );
  }
);
