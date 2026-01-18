export interface GestureData {
  velocityX: number;
  velocityY: number;
  duration: number;
}

export interface SpinConfig {
  baseDuration: number;
  maxDuration: number;
  gestureMultiplier: number;
  friction: number;
  wobbleAmplitude: number;
  wobbleFrequency: number;
}

export interface SpinResult {
  finalAngle: number;
  selectedPlayerIndex: number;
  duration: number;
  seed: number;
}

export type SpinEventType = 'start' | 'frame' | 'tap' | 'slow' | 'stop';

export interface SpinEvent {
  type: SpinEventType;
  angle: number;
  velocity: number;
  progress: number;
}

export const DEFAULT_SPIN_CONFIG: SpinConfig = {
  baseDuration: 2000,
  maxDuration: 6000,
  gestureMultiplier: 1.5,
  friction: 0.96,
  wobbleAmplitude: 0.015,
  wobbleFrequency: 5,
};
