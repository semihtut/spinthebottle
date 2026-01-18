import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Player, Prompt, Environment, HouseRules } from '@/domain';
import { DEFAULT_ENVIRONMENTS, DEFAULT_HOUSE_RULES } from '@/domain';

export type GamePhase = 'idle' | 'spinning' | 'choosing' | 'prompt' | 'done';

interface GameState {
  // Game phase
  phase: GamePhase;

  // Players
  players: Player[];
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
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  setPlayers: (players: Player[]) => void;
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
  players: [],
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

        addPlayer: (player) =>
          set(
            (state) => ({
              players: [...state.players, player],
            }),
            false,
            'addPlayer'
          ),

        removePlayer: (playerId) =>
          set(
            (state) => ({
              players: state.players.filter((p) => p.id !== playerId),
            }),
            false,
            'removePlayer'
          ),

        updatePlayer: (playerId, updates) =>
          set(
            (state) => ({
              players: state.players.map((p) =>
                p.id === playerId ? { ...p, ...updates } : p
              ),
            }),
            false,
            'updatePlayer'
          ),

        setPlayers: (players) => set({ players }, false, 'setPlayers'),

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
          players: state.players,
          environment: state.environment,
          houseRules: state.houseRules,
        }),
      }
    ),
    { name: 'GameStore' }
  )
);
