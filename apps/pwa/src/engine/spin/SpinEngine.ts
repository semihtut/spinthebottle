import type { GestureData, SpinConfig, SpinResult, SpinEvent } from './types';
import { DEFAULT_SPIN_CONFIG } from './types';
import { pickFinalAngle, generateSpinSeed } from './rng';
import { angleToPlayerIndex } from './fairness';
import { spinEasing } from './easing';
import { TAU, normalizeAngle } from '@/utils/math';
import { clamp } from '@/utils/clamp';

type SpinCallback = (event: SpinEvent) => void;

export class SpinEngine {
  private config: SpinConfig;
  private animationId: number | null = null;
  private startTime: number = 0;
  private duration: number = 0;
  private startAngle: number = 0;
  private totalRotation: number = 0;
  private finalAngle: number = 0;
  private seed: number = 0;
  private playerCount: number = 0;
  private onFrame: SpinCallback | null = null;
  private onComplete: ((result: SpinResult) => void) | null = null;
  private lastTapAngle: number = 0;

  constructor(config: Partial<SpinConfig> = {}) {
    this.config = { ...DEFAULT_SPIN_CONFIG, ...config };
  }

  setConfig(config: Partial<SpinConfig>): void {
    this.config = { ...this.config, ...config };
  }

  start(
    gesture: GestureData,
    playerCount: number,
    seed?: number,
    currentAngle: number = 0
  ): void {
    if (this.animationId !== null) {
      this.cancel();
    }

    this.playerCount = playerCount;
    this.seed = seed ?? generateSpinSeed();
    this.startAngle = normalizeAngle(currentAngle);
    this.finalAngle = pickFinalAngle(this.seed);

    // Calculate gesture magnitude
    const gestureMagnitude = Math.sqrt(
      gesture.velocityX ** 2 + gesture.velocityY ** 2
    );
    const normalizedGesture = clamp(gestureMagnitude / 1000, 0.3, 1);

    // Duration based on gesture (stronger = longer spin)
    this.duration =
      this.config.baseDuration +
      (this.config.maxDuration - this.config.baseDuration) *
        normalizedGesture *
        this.config.gestureMultiplier;
    this.duration = clamp(
      this.duration,
      this.config.baseDuration,
      this.config.maxDuration
    );

    // Calculate total rotation (multiple full spins + final position)
    const minRotations = 3 + Math.floor(normalizedGesture * 3);
    const angleDiff = this.finalAngle - this.startAngle;
    this.totalRotation = minRotations * TAU + angleDiff;

    this.startTime = performance.now();
    this.lastTapAngle = this.startAngle;

    this.emitEvent('start', this.startAngle, 1, 0);
    this.animate();
  }

  cancel(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  onFrameCallback(callback: SpinCallback): void {
    this.onFrame = callback;
  }

  onCompleteCallback(callback: (result: SpinResult) => void): void {
    this.onComplete = callback;
  }

  private animate = (): void => {
    const now = performance.now();
    const elapsed = now - this.startTime;
    const progress = clamp(elapsed / this.duration, 0, 1);
    const eased = spinEasing(progress);

    // Calculate current angle with wobble
    let currentAngle = this.startAngle + this.totalRotation * eased;

    // Add wobble that decreases as spin slows
    if (this.config.wobbleAmplitude > 0 && progress < 0.9) {
      const wobbleDecay = 1 - progress;
      const wobble =
        Math.sin(elapsed * this.config.wobbleFrequency * 0.01) *
        this.config.wobbleAmplitude *
        wobbleDecay;
      currentAngle += wobble;
    }

    // Calculate velocity (derivative of position)
    const velocity = (1 - eased) * (this.totalRotation / this.duration) * 1000;

    // Emit tap events at regular intervals
    const normalizedCurrent = normalizeAngle(currentAngle);
    const anglesSinceLastTap = Math.abs(normalizedCurrent - this.lastTapAngle);
    if (anglesSinceLastTap > Math.PI / 2 && progress < 0.95) {
      this.emitEvent('tap', normalizedCurrent, velocity, progress);
      this.lastTapAngle = normalizedCurrent;
    }

    // Emit frame event
    this.emitEvent('frame', normalizedCurrent, velocity, progress);

    // Emit slow event when nearing end
    if (progress > 0.8 && progress < 0.85) {
      this.emitEvent('slow', normalizedCurrent, velocity, progress);
    }

    if (progress < 1) {
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      this.animationId = null;
      const finalNormalized = normalizeAngle(this.finalAngle);
      this.emitEvent('stop', finalNormalized, 0, 1);

      if (this.onComplete) {
        this.onComplete({
          finalAngle: finalNormalized,
          selectedPlayerIndex: angleToPlayerIndex(
            finalNormalized,
            this.playerCount
          ),
          duration: this.duration,
          seed: this.seed,
        });
      }
    }
  };

  private emitEvent(
    type: SpinEvent['type'],
    angle: number,
    velocity: number,
    progress: number
  ): void {
    if (this.onFrame) {
      this.onFrame({ type, angle, velocity, progress });
    }
  }
}

export const spinEngine = new SpinEngine();
