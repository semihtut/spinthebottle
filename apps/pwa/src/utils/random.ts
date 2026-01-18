// Mulberry32 - A fast, high-quality 32-bit PRNG
export function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeededRandom(seed?: number): () => number {
  const actualSeed = seed ?? Date.now();
  return mulberry32(actualSeed);
}

export function randomInRange(min: number, max: number, rng = Math.random): number {
  return min + rng() * (max - min);
}

export function randomInt(min: number, max: number, rng = Math.random): number {
  return Math.floor(randomInRange(min, max + 1, rng));
}

export function pickRandom<T>(array: T[], rng = Math.random): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(rng() * array.length)];
}

export function shuffle<T>(array: T[], rng = Math.random): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
