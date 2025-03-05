import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DifficultyLevel, GameStatus, GameParameters } from '@/types/game';
import { gameMetadata as paintDrawingGameMetadata } from '@/games/PaintDrawingGame/metadata';
import { gameMetadata as minimalPairsMetadata } from '@/games/MinimalPairs/metadata';
import { gameMetadata as wordRushMetadata } from '@/games/WordRush/metadata';
import { gameMetadata as sentenceBuilderMetadata } from '@/games/SentenceBuilder/metadata';
import { gameMetadata as verbFormsMetadata } from '@/games/VerbForms/metadata';
import { gameMetadata as wordMatchMetadata } from '@/games/WordMatch/metadata';
import { gameMetadata as tongueTwistersMetadata } from '@/games/TongueTwisters/metadata';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type GameCategory = 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'speaking';

export interface Game {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: Difficulty[];
  thumbnail: string;
  path: string;
}

export interface GameStats {
  gameId: string;
  timesPlayed: number;
  bestScore: number;
  completedAt: string[];
}

export interface UserProgress {
  level: number;
  experience: number;
  nextLevelExperience: number;
  completedGames: Record<string, GameStats>;
}

interface GameSettings {
  difficulty: DifficultyLevel;
  timerEnabled: boolean;
}

interface GameStoreState {
  games: Game[];
  currentGame: Game | null;
  activeFilters: {
    category: GameCategory | null;
    difficulty: Difficulty | null;
  };
  userProgress: UserProgress;
  gameSettings: GameSettings;
  gameStatus: GameStatus;
  setCurrentGame: (game: Game | null) => void;
  setFilters: (filters: Partial<{ category: GameCategory | null; difficulty: Difficulty | null }>) => void;
  resetFilters: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  updateUserProgress: (gameId: string, score: number) => void;
  resetGameState: () => void;
  registerGame: (game: Game) => void;
}

const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      games: [
        wordMatchMetadata,
        verbFormsMetadata,
        sentenceBuilderMetadata,
        wordRushMetadata,
        paintDrawingGameMetadata,
        minimalPairsMetadata,
        tongueTwistersMetadata,
      ],
      currentGame: null,
      activeFilters: {
        category: null,
        difficulty: null,
      },
      userProgress: {
        level: 1,
        experience: 0,
        nextLevelExperience: 100,
        completedGames: {},
      },
      gameSettings: {
        difficulty: 'beginner',
        timerEnabled: true,
      },
      gameStatus: 'idle',
      setCurrentGame: (game) => set({ currentGame: game }),
      setFilters: (filters) => set((state) => ({
        activeFilters: {
          ...state.activeFilters,
          ...filters,
        },
      })),
      resetFilters: () => set({
        activeFilters: {
          category: null,
          difficulty: null,
        },
      }),
      updateSettings: (settings) => set((state) => ({
        gameSettings: {
          ...state.gameSettings,
          ...settings,
        },
      })),
      updateUserProgress: (gameId, score) => set((state) => {
        const now = new Date().toISOString();
        const existingStats = state.userProgress.completedGames[gameId] || {
          gameId,
          timesPlayed: 0,
          bestScore: 0,
          completedAt: [],
        };

        // Calculate experience points based on score and current level
        const baseXP = score * 5;
        const levelMultiplier = 1 + (state.userProgress.level * 0.1);
        const experienceGained = Math.round(baseXP * levelMultiplier);

        let newExperience = state.userProgress.experience + experienceGained;
        let newLevel = state.userProgress.level;
        let newNextLevelExperience = state.userProgress.nextLevelExperience;

        // Level up if enough experience is gained
        while (newExperience >= newNextLevelExperience) {
          newExperience -= newNextLevelExperience;
          newLevel += 1;
          newNextLevelExperience = Math.round(newNextLevelExperience * 1.2);
        }

        return {
          userProgress: {
            level: newLevel,
            experience: newExperience,
            nextLevelExperience: newNextLevelExperience,
            completedGames: {
              ...state.userProgress.completedGames,
              [gameId]: {
                ...existingStats,
                timesPlayed: existingStats.timesPlayed + 1,
                bestScore: Math.max(existingStats.bestScore, score),
                completedAt: [...existingStats.completedAt, now],
              },
            },
          },
        };
      }),
      resetGameState: () => set({
        gameStatus: 'idle'
      }),
      registerGame: (game) => set((state) => ({
        games: [...state.games, game]
      })),
    }),
    {
      name: 'english-games-storage',
      partialize: (state) => ({
        userProgress: state.userProgress,
        gameSettings: state.gameSettings,
      }),
    }
  )
);

export default useGameStore;
export type { DifficultyLevel };
