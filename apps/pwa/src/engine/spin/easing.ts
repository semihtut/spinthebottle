// Easing functions for spin animation

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Custom easing that starts fast and slows down gradually (like a spinning bottle)
export function spinEasing(t: number): number {
  // Combination of expo and quart for natural spin feel
  const expo = easeOutExpo(t);
  const quart = easeOutQuart(t);
  return 0.7 * expo + 0.3 * quart;
}
