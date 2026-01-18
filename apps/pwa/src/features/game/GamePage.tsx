import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useGameStore, useSettingsStore } from '@/app/providers';
import { BottleSpinner, PlayerRing, EnvironmentBackground, PromptCard, type BottleSpinnerRef } from '@/ui/components';
import { useSpinGesture, useAudio, useHaptics } from '@/hooks';
import { SpinEngine, type SpinResult } from '@/engine/spin';
import { promptSelector, initializePrompts } from '@/data';
import type { Prompt } from '@/domain';

export default function GamePage() {
  const navigate = useNavigate();
  const locale = useSettingsStore((s) => s.locale);
  const {
    players,
    phase,
    currentPlayerIndex,
    environment,
    houseRules,
    setPhase,
    setCurrentPlayerIndex,
    setSpinSeed,
  } = useGameStore();

  const bottleRef = useRef<BottleSpinnerRef>(null);
  const gestureAreaRef = useRef<HTMLDivElement>(null);
  const spinEngineRef = useRef<SpinEngine | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    locale === 'tr' ? 'Şişeyi çevirmek için kaydır!' : 'Swipe the bottle to spin!'
  );
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [promptsInitialized, setPromptsInitialized] = useState(false);

  // Haptics
  const { trigger: haptic } = useHaptics();

  // Audio
  const {
    loadProfile,
    playAmbience,
    stopAmbience,
    playSpinLoop,
    stopSpinLoop,
    updateSpinVelocity,
    playTap,
    playSettle,
    isInitialized,
  } = useAudio();

  // Initialize prompts on mount
  useEffect(() => {
    initializePrompts().then(() => setPromptsInitialized(true));
  }, []);

  // Initialize spin engine
  useEffect(() => {
    spinEngineRef.current = new SpinEngine({
      friction: environment.surfaceFriction,
    });

    return () => {
      spinEngineRef.current?.cancel();
    };
  }, [environment.surfaceFriction]);

  // Load audio profile and play ambience when environment changes
  useEffect(() => {
    const setupAudio = async () => {
      if (isInitialized()) {
        await loadProfile(environment.audioProfileId);
        playAmbience();
      }
    };
    setupAudio();

    return () => {
      stopAmbience();
    };
  }, [environment.audioProfileId, loadProfile, playAmbience, stopAmbience, isInitialized]);

  // Redirect if not enough players
  useEffect(() => {
    if (players.length < 3) {
      navigate('/setup');
    }
  }, [players.length, navigate]);

  const handleSpinComplete = useCallback(
    (result: SpinResult) => {
      // Stop spin audio and play settle sound
      stopSpinLoop();
      playSettle();
      haptic('success');

      setCurrentPlayerIndex(result.selectedPlayerIndex);
      setSpinSeed(result.seed);
      setPhase('choosing');

      const selectedPlayer = players[result.selectedPlayerIndex];
      setStatusMessage(
        locale === 'tr'
          ? `${selectedPlayer?.name || 'Oyuncu'} seçiyor!`
          : `${selectedPlayer?.name || 'Player'}'s turn!`
      );
    },
    [players, setCurrentPlayerIndex, setSpinSeed, setPhase, stopSpinLoop, playSettle, locale, haptic]
  );

  const handleGestureEnd = useCallback(
    (gesture: { velocityX: number; velocityY: number; duration: number }) => {
      if (phase !== 'idle' || !spinEngineRef.current || !bottleRef.current) {
        return;
      }

      setPhase('spinning');
      setStatusMessage(locale === 'tr' ? 'Dönüyor...' : 'Spinning...');

      const engine = spinEngineRef.current;
      const bottle = bottleRef.current;

      // Calculate initial velocity for audio
      const gestureMagnitude = Math.sqrt(gesture.velocityX ** 2 + gesture.velocityY ** 2);
      const initialVelocity = Math.min(gestureMagnitude / 100, 15);

      // Start spin audio
      playTap(Math.min(initialVelocity / 10, 1));
      playSpinLoop(initialVelocity);

      engine.onCompleteCallback((result) => {
        handleSpinComplete(result);
      });

      engine.onFrameCallback((event) => {
        if (event.type === 'frame') {
          // The bottle component handles its own animation via CSS
        }
      });

      // Start the spin - the engine will calculate the fair final angle
      engine.start(
        gesture,
        players.length,
        undefined,
        bottle.getCurrentAngle()
      );

      // Get the result synchronously to animate the bottle
      const seed = Date.now();
      const tempEngine = new SpinEngine({ friction: environment.surfaceFriction });
      let finalAngle = 0;
      let duration = 3000;

      tempEngine.onCompleteCallback((result) => {
        finalAngle = result.finalAngle;
        duration = result.duration;
      });

      tempEngine.start(gesture, players.length, seed, bottle.getCurrentAngle());

      // Calculate duration based on gesture
      const normalizedGesture = Math.min(Math.max(gestureMagnitude / 1000, 0.3), 1);
      duration = 2000 + 4000 * normalizedGesture;

      // Animate the bottle to the final position
      bottle.spin(finalAngle, duration);

      // Animate spin audio velocity decay
      const startTime = Date.now();
      const animateAudio = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentVelocity = initialVelocity * (1 - eased);
        updateSpinVelocity(currentVelocity);

        if (progress < 1) {
          requestAnimationFrame(animateAudio);
        }
      };
      requestAnimationFrame(animateAudio);

      // Set completion after animation
      setTimeout(() => {
        tempEngine.cancel();
        const selectedIndex = Math.floor(
          (((finalAngle + Math.PI / 2) % (Math.PI * 2)) / (Math.PI * 2)) * players.length
        ) % players.length;

        handleSpinComplete({
          finalAngle,
          selectedPlayerIndex: selectedIndex,
          duration,
          seed,
        });
      }, duration);
    },
    [phase, players.length, environment.surfaceFriction, setPhase, handleSpinComplete, playTap, playSpinLoop, updateSpinVelocity, locale]
  );

  // Set up gesture detection
  useSpinGesture(gestureAreaRef, {
    onGestureEnd: handleGestureEnd,
    disabled: phase !== 'idle',
    minVelocity: 150,
  });

  // Keyboard spin trigger (Enter/Space when focused)
  const handleKeyboardSpin = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && phase === 'idle') {
        e.preventDefault();
        haptic('medium');
        // Simulate a random gesture for keyboard spin
        const randomVelocity = 400 + Math.random() * 600;
        const randomAngle = Math.random() * Math.PI * 2;
        handleGestureEnd({
          velocityX: Math.cos(randomAngle) * randomVelocity,
          velocityY: Math.sin(randomAngle) * randomVelocity,
          duration: 200,
        });
      }
    },
    [phase, handleGestureEnd, haptic]
  );

  const handleChooseType = useCallback(
    async (type: 'truth' | 'dare') => {
      if (!promptsInitialized) return;

      const prompt = await promptSelector.select(type, houseRules);
      if (prompt) {
        setCurrentPrompt(prompt);
        setPhase('prompt');
      } else {
        // No prompts available - show error
        setStatusMessage(
          locale === 'tr'
            ? 'Uygun soru bulunamadı. Paketleri kontrol edin.'
            : 'No prompts available. Check your packs.'
        );
      }
    },
    [promptsInitialized, houseRules, setPhase, locale]
  );

  const handleReplacePrompt = useCallback(async () => {
    if (!currentPrompt) return;

    const newPrompt = await promptSelector.select(currentPrompt.type, houseRules);
    if (newPrompt) {
      setCurrentPrompt(newPrompt);
    }
  }, [currentPrompt, houseRules]);

  const handleSkipPrompt = useCallback(() => {
    setCurrentPrompt(null);
    setPhase('choosing');
  }, [setPhase]);

  const handleNewRound = useCallback(() => {
    setCurrentPrompt(null);
    setPhase('idle');
    setCurrentPlayerIndex(null);
    setStatusMessage(
      locale === 'tr' ? 'Şişeyi çevirmek için kaydır!' : 'Swipe the bottle to spin!'
    );
  }, [setPhase, setCurrentPlayerIndex, locale]);

  const currentPlayer = currentPlayerIndex !== null ? players[currentPlayerIndex] : null;

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Environment background */}
      <EnvironmentBackground environment={environment} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4">
        <Link
          to="/setup"
          className="glass glass-hover w-10 h-10 flex items-center justify-center rounded-full"
          aria-label={locale === 'tr' ? 'Kuruluma dön' : 'Back to setup'}
        >
          <span className="text-xl">&larr;</span>
        </Link>
        <span className="text-[var(--color-text-muted)]">
          {players.length} {locale === 'tr' ? 'Oyuncu' : 'Players'}
        </span>
      </header>

      {/* Game area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-md aspect-square">
          {/* Player ring */}
          <PlayerRing
            players={players}
            selectedIndex={currentPlayerIndex}
            currentTurnIndex={phase === 'choosing' || phase === 'prompt' ? currentPlayerIndex : null}
            className="absolute inset-0"
          />

          {/* Gesture capture area + Bottle */}
          <div
            ref={gestureAreaRef}
            className={`absolute inset-[20%] flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
              phase === 'idle' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
            }`}
            role="button"
            aria-label={
              phase === 'idle'
                ? locale === 'tr' ? 'Şişeyi çevirmek için Enter veya Space tuşuna bas' : 'Press Enter or Space to spin the bottle'
                : locale === 'tr' ? 'Şişe dönüyor' : 'Bottle is spinning'
            }
            tabIndex={phase === 'idle' ? 0 : -1}
            onKeyDown={handleKeyboardSpin}
          >
            <BottleSpinner
              ref={bottleRef}
              className="w-16 h-44"
              onSpinComplete={() => {}}
            />
          </div>
        </div>

        {/* Status message / Game state */}
        <div
          className="mt-8 text-center w-full max-w-sm"
          role="status"
          aria-live="polite"
        >
          {phase === 'choosing' && currentPlayer ? (
            <div className="space-y-4">
              <p className="text-xl font-bold">
                {locale === 'tr'
                  ? `${currentPlayer.name} seçiyor!`
                  : `${currentPlayer.name}'s turn!`}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleChooseType('truth')}
                  className="glass glass-hover px-6 py-3 rounded-[var(--radius-md)] font-semibold text-blue-400 transition-transform active:scale-95"
                >
                  {locale === 'tr' ? 'Doğruluk' : 'Truth'}
                </button>
                <button
                  onClick={() => handleChooseType('dare')}
                  className="glass glass-hover px-6 py-3 rounded-[var(--radius-md)] font-semibold text-orange-400 transition-transform active:scale-95"
                >
                  {locale === 'tr' ? 'Cesaret' : 'Dare'}
                </button>
              </div>
            </div>
          ) : phase === 'prompt' && currentPrompt ? (
            <PromptCard
              prompt={currentPrompt}
              locale={locale}
              onSkip={handleSkipPrompt}
              onReplace={handleReplacePrompt}
              onDone={handleNewRound}
            />
          ) : (
            <p className="text-[var(--color-text-muted)]">{statusMessage}</p>
          )}
        </div>
      </main>
    </div>
  );
}
