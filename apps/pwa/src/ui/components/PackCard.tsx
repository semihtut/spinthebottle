import { memo } from 'react';
import type { Pack, Locale } from '@/domain';

interface PackCardProps {
  pack: Pack;
  locale: Locale;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

export const PackCard = memo(function PackCard({
  pack,
  locale,
  onToggle,
  className = '',
}: PackCardProps) {
  const promptCount = pack.prompts.length;
  const truthCount = pack.prompts.filter((p) => p.type === 'truth').length;
  const dareCount = pack.prompts.filter((p) => p.type === 'dare').length;

  return (
    <div
      className={`glass rounded-[var(--radius-lg)] overflow-hidden transition-all ${
        pack.isEnabled ? 'ring-2 ring-[var(--color-primary)]' : 'opacity-70'
      } ${className}`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{pack.name[locale]}</h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              {pack.description[locale]}
            </p>
          </div>

          {/* Toggle switch */}
          <button
            onClick={() => onToggle(!pack.isEnabled)}
            className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
              pack.isEnabled ? 'bg-[var(--color-primary)]' : 'bg-white/20'
            }`}
            role="switch"
            aria-checked={pack.isEnabled}
            aria-label={`${pack.isEnabled ? 'Disable' : 'Enable'} ${pack.name[locale]}`}
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                pack.isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-muted)]">
              {promptCount} {locale === 'tr' ? 'soru' : 'prompts'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>{truthCount}</span>
          </div>
          <div className="flex items-center gap-2 text-orange-400">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            <span>{dareCount}</span>
          </div>
        </div>

        {/* Default badge */}
        {pack.isDefault && (
          <div className="mt-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-[var(--color-text-muted)]">
              {locale === 'tr' ? 'Varsayılan' : 'Default'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});
