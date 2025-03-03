
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type GameCategory = 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'speaking';

export interface Game {
  id: string;
  name: string;
  description: string;
  category: GameCategory;
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

interface GameState {
  games: Game[];
  currentGame: Game | null;
  activeFilters: {
    category: GameCategory | null;
    difficulty: Difficulty | null;
  };
  userProgress: UserProgress;
  gameSettings: {
    difficulty: Difficulty;
    timerEnabled: boolean;
    soundEnabled: boolean;
  };
  setCurrentGame: (game: Game | null) => void;
  setFilters: (filters: Partial<{ category: GameCategory | null; difficulty: Difficulty | null }>) => void;
  resetFilters: () => void;
  updateGameSettings: (settings: Partial<GameState['gameSettings']>) => void;
  updateUserProgress: (gameId: string, score: number) => void;
}

const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      games: [
        {
          id: 'word-match',
          name: 'Word Match',
          description: 'Match English words with their meanings',
          category: 'vocabulary',
          difficulty: ['beginner', 'intermediate', 'advanced'],
          thumbnail: '/lovable-uploads/b871120f-9f5f-4e93-b53a-648caaf93c3b.png',
          path: '/games/word-match'
        },
        {
          id: 'sentence-builder',
          name: 'Sentence Builder',
          description: 'Form correct sentences by arranging words',
          category: 'grammar',
          difficulty: ['beginner', 'intermediate', 'advanced'],
          thumbnail: '/lovable-uploads/b871120f-9f5f-4e93-b53a-648caaf93c3b.png',
          path: '/games/sentence-builder'
        },
        {
          id: 'word-search',
          name: 'Word Search',
          description: 'Find hidden English words in a grid',
          category: 'vocabulary',
          difficulty: ['beginner', 'intermediate', 'advanced'],
          thumbnail: '/lovable-uploads/b871120f-9f5f-4e93-b53a-648caaf93c3b.png',
          path: '/games/word-search'
        },
        {
          id: 'listening-quiz',
          name: 'Listening Quiz',
          description: 'Test your listening skills with audio questions',
          category: 'listening',
          difficulty: ['intermediate', 'advanced'],
          thumbnail: '/lovable-uploads/b871120f-9f5f-4e93-b53a-648caaf93c3b.png',
          path: '/games/listening-quiz'
        }
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
        soundEnabled: true,
      },
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
      updateGameSettings: (settings) => set((state) => ({
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
