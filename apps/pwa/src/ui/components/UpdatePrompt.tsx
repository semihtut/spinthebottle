import { memo } from 'react';
import { usePWA } from '../../hooks/usePWA';
import { useSettingsStore } from '../../app/providers/settingsStore';

export const UpdatePrompt = memo(function UpdatePrompt() {
  const { needsUpdate, updateServiceWorker } = usePWA();
  const locale = useSettingsStore((s) => s.locale);

  if (!needsUpdate) return null;

  const text = {
    en: {
      title: 'Update Available',
      description: 'A new version is ready to install',
      update: 'Update Now',
    },
    tr: {
      title: 'Güncelleme Mevcut',
      description: 'Yeni bir sürüm yüklenmeye hazır',
      update: 'Şimdi Güncelle',
    },
  };

  const t = text[locale];

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-slide-up safe-top">
      <div className="glass rounded-lg p-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          {/* Update icon */}
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-success"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-text text-sm">{t.title}</h3>
            <p className="text-xs text-text-muted">{t.description}</p>
          </div>

          <button
            onClick={updateServiceWorker}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-success hover:bg-success/80 text-white transition-colors flex-shrink-0"
          >
            {t.update}
          </button>
        </div>
      </div>
    </div>
  );
});
