import { memo } from 'react';
import type { Player } from '@/domain';

interface PlayerChipProps {
  player: Player;
  isSelected?: boolean;
  isCurrentTurn?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'min-w-[40px] h-[40px] text-xs px-2',
  md: 'min-w-[52px] h-[52px] text-sm px-3',
  lg: 'min-w-[64px] h-[64px] text-base px-4',
};

export const PlayerChip = memo(function PlayerChip({
  player,
  isSelected = false,
  isCurrentTurn = false,
  size = 'md',
  onClick,
}: PlayerChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        glass rounded-full flex items-center justify-center gap-1
        transition-all duration-300 ease-out
        ${sizeClasses[size]}
        ${isSelected ? 'ring-2 ring-[var(--color-primary)] scale-110 z-10' : ''}
        ${isCurrentTurn ? 'ring-2 ring-[var(--color-success)] animate-pulse' : ''}
        ${!isSelected && !isCurrentTurn ? 'opacity-80 hover:opacity-100' : ''}
        ${onClick ? 'cursor-pointer active:scale-95' : 'cursor-default'}
      `}
      disabled={!onClick}
      aria-label={`Player: ${player.name}${isCurrentTurn ? ' (current turn)' : ''}`}
    >
      <span className="flex-shrink-0" aria-hidden="true">
        {player.emoji || '👤'}
      </span>
      <span className="truncate max-w-[60px] font-medium">
        {player.name}
      </span>
    </button>
  );
});
