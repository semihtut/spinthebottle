import { mulberry32 } from '@/utils/random';
import { TAU } from '@/utils/math';

export function pickFinalAngle(seed: number): number {
  const rng = mulberry32(seed);
  return rng() * TAU;
}

export function generateSpinSeed(): number {
  return Math.floor(Math.random() * 0xffffffff);
}
