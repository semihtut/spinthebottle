import { playerIndexToAngle } from '../spin/fairness';

export interface RingPosition {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  scale: number;
}

export interface RingLayoutConfig {
  playerCount: number;
  containerSize: number;
  ringRadius: number; // percentage of container (0-50)
  selectedIndex: number | null;
}

/**
 * Calculate player positions around a ring.
 * Returns positions as percentages for CSS positioning.
 */
export function calculateRingLayout(config: RingLayoutConfig): RingPosition[] {
  const { playerCount, ringRadius, selectedIndex } = config;
  const positions: RingPosition[] = [];

  for (let i = 0; i < playerCount; i++) {
    const angle = playerIndexToAngle(i, playerCount);
    const x = 50 + ringRadius * Math.cos(angle);
    const y = 50 + ringRadius * Math.sin(angle);
    const scale = selectedIndex === i ? 1.15 : 1;

    positions.push({ x, y, scale });
  }

  return positions;
}

/**
 * Get recommended ring radius and chip size based on player count.
 */
export function getLayoutRecommendations(playerCount: number): {
  ringRadius: number;
  chipSize: number;
  fontSize: string;
} {
  if (playerCount <= 6) {
    return {
      ringRadius: 38,
      chipSize: 64,
      fontSize: '0.875rem',
    };
  } else if (playerCount <= 10) {
    return {
      ringRadius: 40,
      chipSize: 52,
      fontSize: '0.75rem',
    };
  } else {
    return {
      ringRadius: 42,
      chipSize: 44,
      fontSize: '0.625rem',
    };
  }
}
