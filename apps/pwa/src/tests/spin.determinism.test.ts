import { describe, it, expect } from 'vitest';
import { pickFinalAngle } from '../engine/spin/rng';
import { mulberry32 } from '../utils/random';

describe('Spin Determinism', () => {
  it('same seed produces same angle', () => {
    const seed = 12345;

    const angle1 = pickFinalAngle(seed);
    const angle2 = pickFinalAngle(seed);

    expect(angle1).toBe(angle2);
  });

  it('different seeds produce different angles', () => {
    const seed1 = 12345;
    const seed2 = 12346;

    const angle1 = pickFinalAngle(seed1);
    const angle2 = pickFinalAngle(seed2);

    expect(angle1).not.toBe(angle2);
  });

  it('mulberry32 is deterministic', () => {
    const seed = 42;
    const rng1 = mulberry32(seed);
    const rng2 = mulberry32(seed);

    const sequence1 = Array.from({ length: 10 }, () => rng1());
    const sequence2 = Array.from({ length: 10 }, () => rng2());

    expect(sequence1).toEqual(sequence2);
  });

  it('mulberry32 produces values in [0, 1)', () => {
    const rng = mulberry32(Date.now());

    for (let i = 0; i < 10000; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('sequential seeds produce different sequences', () => {
    const results: number[] = [];

    for (let seed = 1; seed <= 100; seed++) {
      const angle = pickFinalAngle(seed);
      results.push(angle);
    }

    // Check that we have variety (not all the same)
    const uniqueValues = new Set(results);
    expect(uniqueValues.size).toBeGreaterThan(90); // At least 90 unique values out of 100
  });

  it('replay with stored seed produces same result', () => {
    // Simulate saving and replaying a game
    const gameSeed = 987654321;
    const playerCount = 6;

    // First play
    const angle1 = pickFinalAngle(gameSeed);
    const player1 = Math.floor(((angle1 + Math.PI / 2) % (Math.PI * 2)) / (Math.PI * 2) * playerCount);

    // Replay
    const angle2 = pickFinalAngle(gameSeed);
    const player2 = Math.floor(((angle2 + Math.PI / 2) % (Math.PI * 2)) / (Math.PI * 2) * playerCount);

    expect(angle1).toBe(angle2);
    expect(player1).toBe(player2);
  });
});
