import { Link, useNavigate } from 'react-router-dom';
import { useGameStore, useSettingsStore } from '@/app/providers';
import { DEFAULT_ENVIRONMENTS } from '@/domain';
import { EnvironmentPicker } from '@/ui/components';

export default function SetupPage() {
  const navigate = useNavigate();
  const locale = useSettingsStore((s) => s.locale);
  const {
    playerCount,
    setPlayerCount,
    environment,
    setEnvironment,
    houseRules,
    setHouseRules,
  } = useGameStore();

  const handleStartGame = () => {
    navigate('/game');
  };

  const increment = () => setPlayerCount(playerCount + 1);
  const decrement = () => setPlayerCount(playerCount - 1);

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
        <h1 className="text-2xl font-bold">
          {locale === 'tr' ? 'Kurulum' : 'Setup'}
        </h1>
      </div>

      {/* Environment Selection */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-[var(--color-text-muted)]">
          {locale === 'tr' ? 'Ortam' : 'Environment'}
        </h2>
        <EnvironmentPicker
          environments={DEFAULT_ENVIRONMENTS}
          selectedId={environment.id}
          onSelect={setEnvironment}
        />
      </section>

      {/* Player Count */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-[var(--color-text-muted)]">
          {locale === 'tr' ? 'Oyuncu Sayısı' : 'Number of Players'}
        </h2>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={decrement}
            disabled={playerCount <= 3}
            className="glass glass-hover w-14 h-14 rounded-full text-2xl font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
            aria-label={locale === 'tr' ? 'Azalt' : 'Decrease'}
          >
            −
          </button>
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold tabular-nums">{playerCount}</span>
            <span className="text-sm text-[var(--color-text-muted)]">
              {locale === 'tr' ? 'oyuncu' : 'players'}
            </span>
          </div>
          <button
            onClick={increment}
            disabled={playerCount >= 15}
            className="glass glass-hover w-14 h-14 rounded-full text-2xl font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
            aria-label={locale === 'tr' ? 'Arttır' : 'Increase'}
          >
            +
          </button>
        </div>
        <p className="text-center text-sm text-[var(--color-text-muted)] mt-2">
          {locale === 'tr' ? '3-15 arası' : '3 to 15'}
        </p>
      </section>

      {/* Intensity */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-[var(--color-text-muted)]">
          {locale === 'tr' ? 'Yoğunluk' : 'Intensity'}
        </h2>
        <div className="flex gap-2">
          {([1, 2, 3] as const).map((level) => (
            <button
              key={level}
              onClick={() => setHouseRules({ intensityMax: level })}
              className={`flex-1 glass py-3 rounded-[var(--radius-md)] font-medium transition-all ${
                houseRules.intensityMax === level
                  ? 'ring-2 ring-[var(--color-primary)]'
                  : 'glass-hover'
              }`}
            >
              {level === 1
                ? locale === 'tr' ? 'Hafif' : 'Light'
                : level === 2
                ? locale === 'tr' ? 'Orta' : 'Medium'
                : locale === 'tr' ? 'Cesur' : 'Bold'}
            </button>
          ))}
        </div>
      </section>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Start button */}
      <button
        onClick={handleStartGame}
        className="w-full py-4 rounded-[var(--radius-lg)] font-bold text-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-95 transition-all"
      >
        {locale === 'tr' ? 'Oyunu Başlat' : 'Start Game'}
      </button>
    </div>
  );
}
