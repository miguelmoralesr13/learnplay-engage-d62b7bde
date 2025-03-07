import { GameCategory, DifficultyLevel, GameType } from '@/types/game';

export interface WordPair {
    word: string;
    translation: string;
}

export interface WordMatchParameters {
    difficulty: { label: string; value: DifficultyLevel };
    timerEnabled: boolean;
    pairCount: number;
}

export interface WordMatchGameState {
    words: string[];
    translations: string[];
    selectedCards: string[];
    matchedPairs: string[];
    incorrectAttempts: number;
    timeLeft: number;
    gameStartTime: number;
    gameConfig: WordMatchConfig | null;
    parameters: WordMatchParameters | null;
    timerId: number | null;
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