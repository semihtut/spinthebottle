import { memo } from 'react';
import { usePWA } from '../../hooks/usePWA';
import { useSettingsStore } from '../../app/providers/settingsStore';

export const OfflineIndicator = memo(function OfflineIndicator() {
  const { isOnline } = usePWA();
  const locale = useSettingsStore((s) => s.locale);

  if (isOnline) return null;

  const text = {
    en: 'You are offline',
    tr: 'Çevrimdışısınız',
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 safe-top">
      <div className="bg-amber-500/90 backdrop-blur-sm px-4 py-2 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-black">
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle cx="12" cy="20" r="1" />
          </svg>
          <span>{text[locale]}</span>
        </div>
      </div>
    </div>
  );
});
