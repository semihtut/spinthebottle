import { describe, it, expect } from 'vitest';
import {
  mulberry32,
  createSeededRandom,
  randomInRange,
  randomInt,
  pickRandom,
  shuffle,
} from '../utils/random';

describe('mulberry32', () => {
  it('should produce deterministic output for same seed', () => {
    const rng1 = mulberry32(12345);
    const rng2 = mulberry32(12345);

    for (let i = 0; i < 100; i++) {
      expect(rng1()).toBe(rng2());
    }
  });

  it('should produce different output for different seeds', () => {
    const rng1 = mulberry32(12345);
    const rng2 = mulberry32(54321);

    const values1 = Array.from({ length: 10 }, () => rng1());
    const values2 = Array.from({ length: 10 }, () => rng2());

    // Should be different sequences
    expect(values1).not.toEqual(values2);
  });

  it('should produce values between 0 and 1', () => {
    const rng = mulberry32(42);

    for (let i = 0; i < 1000; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('should have good distribution', () => {
    const rng = mulberry32(9999);
    const buckets = new Array(10).fill(0);

    const iterations = 10000;
    for (let i = 0; i < iterations; i++) {
      const bucket = Math.floor(rng() * 10);
      buckets[bucket]++;
    }

    // Each bucket should have roughly 10% (1000) entries
    // Allow 20% deviation
    for (const count of buckets) {
      expect(count).toBeGreaterThan(800);
      expect(count).toBeLessThan(1200);
    }
  });
});

describe('createSeededRandom', () => {
  it('should create deterministic RNG with explicit seed', () => {
    const rng1 = createSeededRandom(42);
    const rng2 = createSeededRandom(42);

    expect(rng1()).toBe(rng2());
    expect(rng1()).toBe(rng2());
  });

  it('should create RNG without seed (uses Date.now)', () => {
    const rng = createSeededRandom();
    const value = rng();

    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });
});

describe('randomInRange', () => {
  it('should produce values within range', () => {
    const rng = mulberry32(123);

    for (let i = 0; i < 100; i++) {
      const value = randomInRange(10, 20, rng);
      expect(value).toBeGreaterThanOrEqual(10);
      expect(value).toBeLessThan(20);
    }
  });

  it('should use Math.random by default', () => {
    const value = randomInRange(0, 100);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(100);
  });

  it('should handle negative ranges', () => {
    const rng = mulberry32(456);

    for (let i = 0; i < 100; i++) {
      const value = randomInRange(-50, -10, rng);
      expect(value).toBeGreaterThanOrEqual(-50);
      expect(value).toBeLessThan(-10);
    }
  });
});

describe('randomInt', () => {
  it('should produce integers within inclusive range', () => {
    const rng = mulberry32(789);
    const seen = new Set<number>();

    for (let i = 0; i < 1000; i++) {
      const value = randomInt(1, 5, rng);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(5);
      seen.add(value);
    }

    // Should have seen all values 1-5
    expect(seen.size).toBe(5);
  });

  it('should handle single value range', () => {
    const rng = mulberry32(111);
    const value = randomInt(5, 5, rng);
    expect(value).toBe(5);
  });
});

describe('pickRandom', () => {
  it('should return undefined for empty array', () => {
    expect(pickRandom([])).toBeUndefined();
  });

  it('should return element from array', () => {
    const rng = mulberry32(222);
    const array = ['a', 'b', 'c', 'd'];

    for (let i = 0; i < 100; i++) {
      const picked = pickRandom(array, rng);
      expect(array).toContain(picked);
    }
  });

  it('should eventually pick all elements given enough iterations', () => {
    const rng = mulberry32(333);
    const array = [1, 2, 3, 4, 5];
    const seen = new Set<number>();

    for (let i = 0; i < 1000; i++) {
      const picked = pickRandom(array, rng);
      if (picked !== undefined) seen.add(picked);
    }

    expect(seen.size).toBe(5);
  });
});

describe('shuffle', () => {
  it('should return array with same elements', () => {
    const rng = mulberry32(444);
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffle(original, rng);

    expect(shuffled.sort()).toEqual(original.sort());
  });

  it('should not modify original array', () => {
    const rng = mulberry32(555);
    const original = [1, 2, 3, 4, 5];
    const originalCopy = [...original];

    shuffle(original, rng);

    expect(original).toEqual(originalCopy);
  });

  it('should produce deterministic result with same seed', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const rng1 = mulberry32(666);
    const rng2 = mulberry32(666);

    const shuffled1 = shuffle(array, rng1);
    const shuffled2 = shuffle(array, rng2);

    expect(shuffled1).toEqual(shuffled2);
  });

  it('should actually shuffle (not return same order)', () => {
    const rng = mulberry32(777);
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = shuffle(original, rng);

    // Very unlikely to be in same order after shuffle
    expect(shuffled).not.toEqual(original);
  });

  it('should handle single element array', () => {
    const rng = mulberry32(888);
    const shuffled = shuffle([42], rng);
    expect(shuffled).toEqual([42]);
  });

  it('should handle empty array', () => {
    const rng = mulberry32(999);
    const shuffled = shuffle([], rng);
    expect(shuffled).toEqual([]);
  });
});
