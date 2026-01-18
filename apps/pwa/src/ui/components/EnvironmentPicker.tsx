import { memo } from 'react';
import type { Environment } from '@/domain';
import { useSettingsStore } from '@/app/providers';

interface EnvironmentPickerProps {
  environments: Environment[];
  selectedId: string;
  onSelect: (environment: Environment) => void;
}

export const EnvironmentPicker = memo(function EnvironmentPicker({
  environments,
  selectedId,
  onSelect,
}: EnvironmentPickerProps) {
  const locale = useSettingsStore((s) => s.locale);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {environments.map((env) => (
        <EnvironmentCard
          key={env.id}
          environment={env}
          isSelected={env.id === selectedId}
          locale={locale}
          onClick={() => onSelect(env)}
        />
      ))}
    </div>
  );
});

interface EnvironmentCardProps {
  environment: Environment;
  isSelected: boolean;
  locale: 'en' | 'tr';
  onClick: () => void;
}

const EnvironmentCard = memo(function EnvironmentCard({
  environment,
  isSelected,
  locale,
  onClick,
}: EnvironmentCardProps) {
  // Generate preview gradient
  const getPreviewGradient = () => {
    switch (environment.id) {
      case 'desktop':
        return 'linear-gradient(135deg, hsl(30, 30%, 25%) 0%, hsl(30, 20%, 15%) 100%)';
      case 'lounge':
        return 'linear-gradient(135deg, hsl(15, 40%, 22%) 0%, hsl(15, 30%, 12%) 100%)';
      case 'rooftop':
        return 'linear-gradient(135deg, hsl(220, 35%, 20%) 0%, hsl(220, 25%, 10%) 100%)';
      default:
        return 'linear-gradient(135deg, hsl(0, 0%, 20%) 0%, hsl(0, 0%, 10%) 100%)';
    }
  };

  // Get icon for environment
  const getIcon = () => {
    switch (environment.id) {
      case 'desktop':
        return '🪵';
      case 'lounge':
        return '🛋️';
      case 'rooftop':
        return '🌃';
      default:
        return '✨';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex-shrink-0 w-28 rounded-[var(--radius-md)] overflow-hidden
        transition-all duration-200 active:scale-95
        ${isSelected ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-bg)]' : ''}
      `}
      aria-pressed={isSelected}
      aria-label={environment.name[locale]}
    >
      {/* Preview image/gradient */}
      <div
        className="h-16 relative"
        style={{ background: getPreviewGradient() }}
      >
        {/* Overlay tint */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: environment.colorGrading.tint }}
        />
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          {getIcon()}
        </div>
      </div>

      {/* Label */}
      <div className="glass px-2 py-2 text-center">
        <p className="text-sm font-medium truncate">{environment.name[locale]}</p>
      </div>
    </button>
  );
});
