import { memo, useState, useEffect } from 'react';
import { usePWA } from '../../hooks/usePWA';
import { useSettingsStore } from '../../app/providers/settingsStore';

export const InstallPrompt = memo(function InstallPrompt() {
  const { canInstall, promptInstall, isInstalled } = usePWA();
  const locale = useSettingsStore((s) => s.locale);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  // Show after a delay if can install
  useEffect(() => {
    if (canInstall && !dismissed && !isInstalled) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [canInstall, dismissed, isInstalled]);

  if (!visible) return null;

  const text = {
    en: {
      title: 'Install App',
      description: 'Add to your home screen for the best experience',
      install: 'Install',
      later: 'Later',
    },
    tr: {
      title: 'Uygulamayı Yükle',
      description: 'En iyi deneyim için ana ekrana ekle',
      install: 'Yükle',
      later: 'Sonra',
    },
  };

  const t = text[locale];

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (!installed) {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 animate-slide-up">
      <div className="glass rounded-lg p-4 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          {/* App icon */}
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 text-primary"
              fill="currentColor"
            >
              <path d="M12 2C10.9 2 10 2.9 10 4V8C10 8.6 10.4 9 11 9H13C13.6 9 14 8.6 14 8V4C14 2.9 13.1 2 12 2Z" />
              <ellipse cx="12" cy="14" rx="4" ry="7" opacity="0.6" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-text">{t.title}</h3>
            <p className="text-sm text-text-muted mt-0.5">{t.description}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-glass-bg-hover transition-colors"
          >
            {t.later}
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary-hover text-white transition-colors"
          >
            {t.install}
          </button>
        </div>
      </div>
    </div>
  );
});
