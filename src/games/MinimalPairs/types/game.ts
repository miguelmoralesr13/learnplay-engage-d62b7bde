import { DifficultyLevel } from '@/types/game';

export interface MinimalPair {
    id: string;
    word1: {
        text: string;
        phonetic: string;
        audioUrl?: string;
    };
    word2: {
        text: string;
        phonetic: string;
        audioUrl?: string;
    };
    focusPhoneme: {
        first: string;
        second: string;
        position: 'initial' | 'medial' | 'final';
    };
    difficulty: DifficultyLevel;
    category: string; // e.g., "vowels", "consonants"
}

export interface MinimalPairsParameters {
    pairCount: number;
    categories: { value: string; label: string }[];
    difficulty: DifficultyLevel;
    showPhonetics: boolean;
    timeLimit: number; // in seconds, 0 = no limit
    language?: string;
}

export interface MinimalPairsState {
    pairs: MinimalPair[];
    currentPairIndex: number;
    score: number;
    isPlaying: boolean;
    isPaused: boolean;
    feedback: {
        isCorrect: boolean;
        selectedWord: string;
        correctWord: string;
        message: string;
    } | null;
    gameComplete: boolean;
    chosenWordIndex: number | null; // Índice de la palabra elegida (0 o 1)
    correctWordIndex: number | null; // Índice de la palabra correcta (0 o 1)
    metrics: {
        correctAnswers: number;
        totalAttempts: number;
        averageResponseTime: number;
        completionTime: number;
        startTime: number;
        endTime: number | null;
    };
} 