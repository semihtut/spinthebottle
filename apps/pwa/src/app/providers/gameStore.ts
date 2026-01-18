import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Prompt, Environment, HouseRules } from '@/domain';
import { DEFAULT_ENVIRONMENTS, DEFAULT_HOUSE_RULES } from '@/domain';

export type GamePhase = 'idle' | 'spinning' | 'choosing' | 'prompt' | 'done';

interface GameState {
  // Game phase
  phase: GamePhase;

  // Player count (3-15) - simplified from named players
  playerCount: number;
  currentPlayerIndex: number | null;

  // Prompt selection
  selectedType: 'truth' | 'dare' | null;
  currentPrompt: Prompt | null;

  // Environment
  environment: Environment;

  // House rules
  houseRules: HouseRules;

  // Spin state
  spinSeed: number | null;

  // Actions
  setPhase: (phase: GamePhase) => void;
  setPlayerCount: (count: number) => void;
  setCurrentPlayerIndex: (index: number | null) => void;
  setSelectedType: (type: 'truth' | 'dare' | null) => void;
  setCurrentPrompt: (prompt: Prompt | null) => void;
  setEnvironment: (environment: Environment) => void;
  setHouseRules: (rules: Partial<HouseRules>) => void;
  setSpinSeed: (seed: number | null) => void;
  resetGame: () => void;
  startNewRound: () => void;
}

const initialState = {
  phase: 'idle' as GamePhase,
  playerCount: 4,
  currentPlayerIndex: null,
  selectedType: null,
  currentPrompt: null,
  environment: DEFAULT_ENVIRONMENTS[0],
  houseRules: DEFAULT_HOUSE_RULES,
  spinSeed: null,
};

export const useGameStore = create<GameState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setPhase: (phase) => set({ phase }, false, 'setPhase'),

        setPlayerCount: (count) =>
          set({ playerCount: Math.min(15, Math.max(3, count)) }, false, 'setPlayerCount'),

        setCurrentPlayerIndex: (index) =>
          set({ currentPlayerIndex: index }, false, 'setCurrentPlayerIndex'),

        setSelectedType: (type) =>
          set({ selectedType: type }, false, 'setSelectedType'),

        setCurrentPrompt: (prompt) =>
          set({ currentPrompt: prompt }, false, 'setCurrentPrompt'),

        setEnvironment: (environment) =>
          set({ environment }, false, 'setEnvironment'),

        setHouseRules: (rules) =>
          set(
            (state) => ({
              houseRules: { ...state.houseRules, ...rules },
            }),
            false,
            'setHouseRules'
          ),

        setSpinSeed: (seed) => set({ spinSeed: seed }, false, 'setSpinSeed'),

        resetGame: () =>
          set(
            {
              phase: 'idle',
              currentPlayerIndex: null,
              selectedType: null,
              currentPrompt: null,
              spinSeed: null,
            },
            false,
            'resetGame'
          ),

        startNewRound: () =>
          set(
            {
              phase: 'idle',
              selectedType: null,
              currentPrompt: null,
              spinSeed: null,
            },
            false,
            'startNewRound'
          ),
      }),
      {
        name: 'game-store',
        partialize: (state) => ({
          playerCount: state.playerCount,
          environment: state.environment,
          houseRules: state.houseRules,
        }),
      }
    ),
    { name: 'GameStore' }
  )
);
