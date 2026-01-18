import { TAU, normalizeAngle } from '@/utils/math';

/**
 * Maps a final angle to a player index.
 * The bottle "points up" at angle 0, which corresponds to player 0.
 * Players are arranged clockwise from the top.
 */
export function angleToPlayerIndex(
  angle: number,
  playerCount: number
): number {
  const sliceSize = TAU / playerCount;
  // Offset so that angle 0 (pointing up) corresponds to player 0
  const offset = Math.PI / 2;
  const normalizedAngle = normalizeAngle(angle + offset);
  return Math.floor(normalizedAngle / sliceSize) % playerCount;
}

/**
 * Gets the center angle for a player's slice.
 * Used for positioning players around the ring.
 */
export function playerIndexToAngle(
  index: number,
  playerCount: number
): number {
  const sliceSize = TAU / playerCount;
  // Start from the top (- PI/2)
  return index * sliceSize - Math.PI / 2;
}
