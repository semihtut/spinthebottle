import { memo } from 'react';
import type { Prompt, Locale } from '@/domain';

interface PromptCardProps {
  prompt: Prompt;
  locale: Locale;
  onSkip?: () => void;
  onReplace?: () => void;
  onDone?: () => void;
  showActions?: boolean;
  className?: string;
}

export const PromptCard = memo(function PromptCard({
  prompt,
  locale,
  onSkip,
  onReplace,
  onDone,
  showActions = true,
  className = '',
}: PromptCardProps) {
  const isTruth = prompt.type === 'truth';

  // Intensity indicator dots
  const intensityDots = Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={`w-1.5 h-1.5 rounded-full ${
        i < prompt.intensity
          ? isTruth
            ? 'bg-blue-400'
            : 'bg-orange-400'
          : 'bg-white/20'
      }`}
    />
  ));

  return (
    <div
      className={`glass rounded-[var(--radius-lg)] overflow-hidden ${className}`}
      role="article"
      aria-label={`${prompt.type} prompt`}
    >
      {/* Header with type badge */}
      <div
        className={`px-4 py-2 flex items-center justify-between ${
          isTruth ? 'bg-blue-500/20' : 'bg-orange-500/20'
        }`}
      >
        <span
          className={`text-sm font-bold uppercase tracking-wider ${
            isTruth ? 'text-blue-400' : 'text-orange-400'
          }`}
        >
          {isTruth ? (locale === 'tr' ? 'Doğruluk' : 'Truth') : (locale === 'tr' ? 'Cesaret' : 'Dare')}
        </span>
        <div className="flex items-center gap-1">{intensityDots}</div>
      </div>

      {/* Prompt text */}
      <div className="p-6">
        <p className="text-lg leading-relaxed">{prompt.text[locale]}</p>

        {/* Duration badge if applicable */}
        {prompt.durationSec && (
          <div className="mt-4 flex items-center gap-2 text-[var(--color-text-muted)]">
            <TimerIcon />
            <span className="text-sm">
              {prompt.durationSec} {locale === 'tr' ? 'saniye' : 'seconds'}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (onSkip || onReplace || onDone) && (
        <div className="px-4 pb-4 flex gap-3">
          {onSkip && (
            <button
              onClick={onSkip}
              className="flex-1 glass glass-hover py-2 rounded-[var(--radius-md)] text-[var(--color-text-muted)] text-sm"
              aria-label={locale === 'tr' ? 'Atla' : 'Skip'}
            >
              {locale === 'tr' ? 'Atla' : 'Skip'}
            </button>
          )}
          {onReplace && (
            <button
              onClick={onReplace}
              className="flex-1 glass glass-hover py-2 rounded-[var(--radius-md)] text-[var(--color-text-muted)] text-sm"
              aria-label={locale === 'tr' ? 'Değiştir' : 'Replace'}
            >
              {locale === 'tr' ? 'Değiştir' : 'Replace'}
            </button>
          )}
          {onDone && (
            <button
              onClick={onDone}
              className={`flex-1 py-2 rounded-[var(--radius-md)] font-semibold ${
                isTruth
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
              aria-label={locale === 'tr' ? 'Tamam' : 'Done'}
            >
              {locale === 'tr' ? 'Tamam' : 'Done'}
            </button>
          )}
        </div>
      )}
    </div>
  );
});

// Simple timer icon
function TimerIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
