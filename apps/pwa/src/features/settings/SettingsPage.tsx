import { Link } from 'react-router-dom';
import { useSettingsStore } from '@/app/providers';

export default function SettingsPage() {
  const {
    sfxVolume,
    setSfxVolume,
    ambienceVolume,
    setAmbienceVolume,
    masterMuted,
    toggleMasterMuted,
    reducedMotion,
    setReducedMotion,
    haptics,
    setHaptics,
    locale,
    setLocale,
    resetSettings,
  } = useSettingsStore();

  return (
    <div className="flex-1 flex flex-col p-4 gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="glass glass-hover w-10 h-10 flex items-center justify-center rounded-full"
        >
          <span className="text-xl">&larr;</span>
        </Link>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Audio */}
      <section className="glass rounded-[var(--radius-lg)] p-4">
        <h2 className="text-lg font-semibold mb-4">Audio</h2>

        <div className="space-y-4">
          {/* Master mute */}
          <label className="flex items-center justify-between">
            <span>Sound Effects</span>
            <button
              onClick={toggleMasterMuted}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                masterMuted ? 'bg-[var(--color-surface)]' : 'bg-[var(--color-primary)]'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  masterMuted ? 'left-1' : 'left-6'
                }`}
              />
            </button>
          </label>

          {/* SFX Volume */}
          <label className="block">
            <span className="block mb-2 text-[var(--color-text-muted)]">
              SFX Volume: {Math.round(sfxVolume * 100)}%
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sfxVolume}
              onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
              className="w-full accent-[var(--color-primary)]"
            />
          </label>

          {/* Ambience Volume */}
          <label className="block">
            <span className="block mb-2 text-[var(--color-text-muted)]">
              Ambience Volume: {Math.round(ambienceVolume * 100)}%
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambienceVolume}
              onChange={(e) => setAmbienceVolume(parseFloat(e.target.value))}
              className="w-full accent-[var(--color-primary)]"
            />
          </label>
        </div>
      </section>

      {/* Accessibility */}
      <section className="glass rounded-[var(--radius-lg)] p-4">
        <h2 className="text-lg font-semibold mb-4">Accessibility</h2>

        <div className="space-y-4">
          {/* Reduced Motion */}
          <label className="flex items-center justify-between">
            <div>
              <span className="block">Reduced Motion</span>
              <span className="text-sm text-[var(--color-text-muted)]">
                Disable animations
              </span>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                reducedMotion ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface)]'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  reducedMotion ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </label>

          {/* Haptics */}
          <label className="flex items-center justify-between">
            <div>
              <span className="block">Haptic Feedback</span>
              <span className="text-sm text-[var(--color-text-muted)]">
                Vibration on actions
              </span>
            </div>
            <button
              onClick={() => setHaptics(!haptics)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                haptics ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface)]'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  haptics ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </label>
        </div>
      </section>

      {/* Language */}
      <section className="glass rounded-[var(--radius-lg)] p-4">
        <h2 className="text-lg font-semibold mb-4">Language</h2>

        <div className="flex gap-2">
          <button
            onClick={() => setLocale('en')}
            className={`flex-1 py-3 rounded-[var(--radius-md)] font-medium transition-all ${
              locale === 'en'
                ? 'bg-[var(--color-primary)]'
                : 'glass glass-hover'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLocale('tr')}
            className={`flex-1 py-3 rounded-[var(--radius-md)] font-medium transition-all ${
              locale === 'tr'
                ? 'bg-[var(--color-primary)]'
                : 'glass glass-hover'
            }`}
          >
            Türkçe
          </button>
        </div>
      </section>

      {/* Reset */}
      <button
        onClick={resetSettings}
        className="glass glass-hover py-3 rounded-[var(--radius-md)] text-[var(--color-danger)]"
      >
        Reset to Defaults
      </button>
    </div>
  );
}
