import { memo, useMemo } from 'react';
import type { Player } from '@/domain';
import { PlayerChip } from './PlayerChip';
import { calculateRingLayout, getLayoutRecommendations } from '@/engine/layout';

interface PlayerRingProps {
  players: Player[];
  selectedIndex: number | null;
  currentTurnIndex?: number | null;
  onPlayerClick?: (index: number) => void;
  className?: string;
}

export const PlayerRing = memo(function PlayerRing({
  players,
  selectedIndex,
  currentTurnIndex = null,
  onPlayerClick,
  className = '',
}: PlayerRingProps) {
  const recommendations = useMemo(
    () => getLayoutRecommendations(players.length),
    [players.length]
  );

  const positions = useMemo(
    () =>
      calculateRingLayout({
        playerCount: players.length,
        containerSize: 100,
        ringRadius: recommendations.ringRadius,
        selectedIndex,
      }),
    [players.length, recommendations.ringRadius, selectedIndex]
  );

  const chipSize = useMemo(() => {
    if (players.length <= 6) return 'lg';
    if (players.length <= 10) return 'md';
    return 'sm';
  }, [players.length]);

  return (
    <div
      className={`relative w-full aspect-square ${className}`}
      role="list"
      aria-label="Players arranged in a circle"
    >
      {players.map((player, index) => {
        const pos = positions[index];
        return (
          <div
            key={player.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -50%) scale(${pos.scale})`,
              zIndex: selectedIndex === index ? 10 : 1,
            }}
            role="listitem"
          >
            <PlayerChip
              player={player}
              isSelected={selectedIndex === index}
              isCurrentTurn={currentTurnIndex === index}
              size={chipSize}
              onClick={onPlayerClick ? () => onPlayerClick(index) : undefined}
            />
          </div>
        );
      })}
    </div>
  );
});
