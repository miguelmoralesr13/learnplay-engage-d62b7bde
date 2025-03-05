import { GameCategory, DifficultyLevel, GameType } from '@/types/game';

export interface WordPair {
    word: string;
    translation: string;
}

export interface WordMatchParameters {
    timerEnabled: boolean;
    pairCount: number;
}

export interface WordMatchGameState {
    words: string[];
    translations: string[];
    selectedWord: number | null;
    selectedTranslation: number | null;
    matchedPairs: number[];
    incorrectAttempts: number;
    timeLeft: number;
    gameStartTime: number;
    metrics: {
        correct: number;
        incorrect: number;
        timeSpent: number;
    };
}

export interface WordMatchConfig {
    wordPairs: WordPair[];
    timeLimit: number; // in seconds
} 