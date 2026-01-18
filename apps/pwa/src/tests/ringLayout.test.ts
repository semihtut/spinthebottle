import { describe, it, expect } from 'vitest';
import { calculateRingLayout, getLayoutRecommendations } from '../engine/layout/ringLayout';

describe('Ring Layout', () => {
  it('calculates correct number of positions', () => {
    for (const count of [3, 6, 10, 15]) {
      const positions = calculateRingLayout({
        playerCount: count,
        containerSize: 100,
        ringRadius: 40,
        selectedIndex: null,
      });

      expect(positions).toHaveLength(count);
    }
  });

  it('positions are within valid percentage bounds', () => {
    const positions = calculateRingLayout({
      playerCount: 8,
      containerSize: 100,
      ringRadius: 40,
      selectedIndex: null,
    });

    for (const pos of positions) {
      expect(pos.x).toBeGreaterThanOrEqual(0);
      expect(pos.x).toBeLessThanOrEqual(100);
      expect(pos.y).toBeGreaterThanOrEqual(0);
      expect(pos.y).toBeLessThanOrEqual(100);
    }
  });

  it('first player is at the top (12 o\'clock position)', () => {
    const positions = calculateRingLayout({
      playerCount: 4,
      containerSize: 100,
      ringRadius: 40,
      selectedIndex: null,
    });

    // First player should be at top center (x=50, y=10 for radius 40)
    expect(positions[0].x).toBeCloseTo(50, 1);
    expect(positions[0].y).toBeLessThan(20); // Near top
  });

  it('players are evenly distributed around the circle', () => {
    const count = 6;
    const positions = calculateRingLayout({
      playerCount: count,
      containerSize: 100,
      ringRadius: 40,
      selectedIndex: null,
    });

    // Check that players are roughly equidistant from center
    const distances = positions.map((pos) => {
      const dx = pos.x - 50;
      const dy = pos.y - 50;
      return Math.sqrt(dx * dx + dy * dy);
    });

    // All distances should be roughly equal (the ring radius as percentage)
    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    for (const d of distances) {
      expect(d).toBeCloseTo(avgDistance, 1);
    }
  });

  it('selected player has larger scale', () => {
    const positions = calculateRingLayout({
      playerCount: 5,
      containerSize: 100,
      ringRadius: 40,
      selectedIndex: 2,
    });

    expect(positions[2].scale).toBeGreaterThan(1);
    expect(positions[0].scale).toBe(1);
    expect(positions[1].scale).toBe(1);
    expect(positions[3].scale).toBe(1);
    expect(positions[4].scale).toBe(1);
  });

  it('getLayoutRecommendations returns appropriate sizes', () => {
    const small = getLayoutRecommendations(4);
    expect(small.chipSize).toBe(64);

    const medium = getLayoutRecommendations(8);
    expect(medium.chipSize).toBe(52);

    const large = getLayoutRecommendations(12);
    expect(large.chipSize).toBe(44);
  });

  it('no two players overlap at any count', () => {
    for (const count of [3, 6, 10, 15]) {
      const { ringRadius, chipSize } = getLayoutRecommendations(count);
      const positions = calculateRingLayout({
        playerCount: count,
        containerSize: 400, // Simulate a 400px container
        ringRadius,
        selectedIndex: null,
      });

      // Check that no two players overlap
      // Minimum distance should be greater than chip diameter
      const minDistanceRequired = chipSize * 0.8; // Allow some tolerance

      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const dx = (positions[i].x - positions[j].x) * 4; // Convert % to px
          const dy = (positions[i].y - positions[j].y) * 4;
          const distance = Math.sqrt(dx * dx + dy * dy);

          expect(distance).toBeGreaterThan(minDistanceRequired);
        }
      }
    }
  });
});
