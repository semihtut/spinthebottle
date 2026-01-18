import { describe, it, expect } from 'vitest';
import { pickFinalAngle } from '../engine/spin/rng';
import { angleToPlayerIndex } from '../engine/spin/fairness';

describe('Spin Fairness', () => {
  it('pickFinalAngle generates angles in valid range [0, 2π]', () => {
    const TAU = Math.PI * 2;
    for (let i = 0; i < 1000; i++) {
      const seed = Date.now() + i;
      const angle = pickFinalAngle(seed);
      expect(angle).toBeGreaterThanOrEqual(0);
      expect(angle).toBeLessThan(TAU);
    }
  });

  it('angleToPlayerIndex maps correctly for various player counts', () => {
    // The function adds PI/2 offset to rotate coordinate system
    // With 4 players, slice = TAU/4 = PI/2
    // angle 0 + PI/2 = PI/2, floor(PI/2 / (PI/2)) = 1
    expect(angleToPlayerIndex(0, 4)).toBe(1);
    // angle PI/2 + PI/2 = PI, floor(PI / (PI/2)) = 2
    expect(angleToPlayerIndex(Math.PI / 2, 4)).toBe(2);
    // angle PI + PI/2 = 3*PI/2, floor(3*PI/2 / (PI/2)) = 3
    expect(angleToPlayerIndex(Math.PI, 4)).toBe(3);
    // angle 3*PI/2 + PI/2 = 2*PI = 0 (normalized), floor(0 / (PI/2)) = 0
    expect(angleToPlayerIndex(3 * Math.PI / 2, 4)).toBe(0);

    // 8 players: slice = TAU/8 = PI/4
    // angle 0 + PI/2 = PI/2, floor(PI/2 / (PI/4)) = 2
    expect(angleToPlayerIndex(0, 8)).toBe(2);
    // Verify all results are in valid range
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      const result = angleToPlayerIndex(angle, 8);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(8);
    }
  });

  it('distributes uniformly across players over 10k trials', () => {
    const playerCount = 8;
    const counts = new Array(playerCount).fill(0);
    const trials = 10_000;

    for (let i = 0; i < trials; i++) {
      const seed = Date.now() + i * 1337;
      const angle = pickFinalAngle(seed);
      const index = angleToPlayerIndex(angle, playerCount);
      counts[index]++;
    }

    const expected = trials / playerCount;
    const tolerance = expected * 0.15; // 15% tolerance

    for (let i = 0; i < playerCount; i++) {
      expect(counts[i]).toBeGreaterThan(expected - tolerance);
      expect(counts[i]).toBeLessThan(expected + tolerance);
    }
  });

  it('distributes uniformly across players over 100k trials with chi-squared test', () => {
    const playerCount = 8;
    const counts = new Array(playerCount).fill(0);
    const trials = 100_000;

    for (let i = 0; i < trials; i++) {
      const seed = Date.now() + i;
      const angle = pickFinalAngle(seed);
      const index = angleToPlayerIndex(angle, playerCount);
      counts[index]++;
    }

    const expected = trials / playerCount;
    const chiSquared = counts.reduce((sum, c) => {
      return sum + Math.pow(c - expected, 2) / expected;
    }, 0);

    // χ² critical value for df=7, p=0.01 is ~18.48
    // We use a more lenient value to account for PRNG characteristics
    expect(chiSquared).toBeLessThan(25);
  });

  it('works correctly for edge cases (3, 15 players)', () => {
    // Test with minimum and maximum player counts
    for (const playerCount of [3, 15]) {
      const counts = new Array(playerCount).fill(0);
      const trials = 10_000;

      for (let i = 0; i < trials; i++) {
        const seed = Date.now() + i * 7919;
        const angle = pickFinalAngle(seed);
        const index = angleToPlayerIndex(angle, playerCount);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(playerCount);
        counts[index]++;
      }

      // Each player should get roughly equal selections
      const expected = trials / playerCount;
      const tolerance = expected * 0.2; // 20% tolerance for smaller sample

      for (let i = 0; i < playerCount; i++) {
        expect(counts[i]).toBeGreaterThan(expected - tolerance);
        expect(counts[i]).toBeLessThan(expected + tolerance);
      }
    }
  });
});
