import { Link, useNavigate } from 'react-router-dom';
import { useGameStore } from '@/app/providers';
import { DEFAULT_ENVIRONMENTS, createPlayer } from '@/domain';
import { useState } from 'react';
import { EnvironmentPicker } from '@/ui/components';

export default function SetupPage() {
  const navigate = useNavigate();
  const {
    players,
    addPlayer,
    removePlayer,
    environment,
    setEnvironment,
    houseRules,
    setHouseRules,
  } = useGameStore();

  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (newPlayerName.trim() && players.length < 15) {
      addPlayer(createPlayer(newPlayerName.trim()));
      setNewPlayerName('');
    }
  };

  const handleStartGame = () => {
    if (players.length >= 3) {
      navigate('/game');
    }
  };

  const canStart = players.length >= 3;

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
        <h1 className="text-2xl font-bold">Setup</h1>
      </div>

      {/* Environment Selection */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-[var(--color-text-muted)]">
          Environment
        </h2>
        <EnvironmentPicker
          environments={DEFAULT_ENVIRONMENTS}
          selectedId={environment.id}
          onSelect={setEnvironment}
        />
      </section>

      {/* Players */}
      <section className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[var(--color-text-muted)]">
            Players ({players.length}/15)
          </h2>
          {players.length < 3 && (
            <span className="text-sm text-[var(--color-danger)]">
              Min 3 players
            </span>
          )}
        </div>

        {/* Add player input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
            placeholder="Player name"
            maxLength={20}
            className="flex-1 glass rounded-[var(--radius-md)] px-4 py-3 bg-transparent text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
          />
          <button
            onClick={handleAddPlayer}
            disabled={!newPlayerName.trim() || players.length >= 15}
            className="glass glass-hover px-4 py-3 rounded-[var(--radius-md)] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>

        {/* Player list */}
        <div className="flex flex-wrap gap-2">
          {players.map((player) => (
            <div
              key={player.id}
              className="glass flex items-center gap-2 pl-4 pr-2 py-2 rounded-full"
            >
              <span>{player.emoji || '👤'}</span>
              <span className="font-medium">{player.name}</span>
              <button
                onClick={() => removePlayer(player.id)}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[var(--color-danger)]/20 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Intensity */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-[var(--color-text-muted)]">
          Intensity
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
              {level === 1 ? 'Light' : level === 2 ? 'Medium' : 'Bold'}
            </button>
          ))}
        </div>
      </section>

      {/* Start button */}
      <button
        onClick={handleStartGame}
        disabled={!canStart}
        className={`w-full py-4 rounded-[var(--radius-lg)] font-bold text-lg transition-all ${
          canStart
            ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-95'
            : 'glass opacity-50 cursor-not-allowed'
        }`}
      >
        Start Game
      </button>
    </div>
  );
}
