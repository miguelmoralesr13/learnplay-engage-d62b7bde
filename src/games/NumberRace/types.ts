import { DifficultyLevel } from "@/types/game";

export interface NumberRaceParameters {
    difficulty: { value: DifficultyLevel, label: string };
    timeLimit: number; // en segundos
    maxNumber: number;
    enableTimer?: boolean;
    numbersToFinish?: number;
}

export interface NumberRaceState {
    currentNumber: number;
    currentAnswer: string;
    score: number;
    timeRemaining: number;
    isCorrect: boolean | null;
    gameStatus: 'ready' | 'playing' | 'paused' | 'finished';
    runnerPosition: number; // 0-100% para visualización del progreso
    level: number;
    numberHistory: Array<{
        number: number;
        correctAnswer: string;
        userAnswer: string;
        wasCorrect: boolean;
        responseTime: number;
    }>;
    hint: string | null;
    hintsUsed: number;
    hintLevel: number; // 0: sin pista, 1: pista básica, 2: pista avanzada
    currentAttempts: number;
    showCorrectAnswer: boolean;
}

export type NumberRanges = {
    [key in DifficultyLevel]: {
        min: number;
        max: number;
    };
}; 