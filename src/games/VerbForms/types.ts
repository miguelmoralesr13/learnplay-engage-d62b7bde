import { GameCategory, DifficultyLevel, GameType } from '@/types/game';

export interface Verb {
    base: string;            // Forma base (infinitivo sin "to")
    past: string;            // Pasado simple
    pastParticiple: string;  // Participio pasado
    present: string;         // Tercera persona singular presente
    gerund: string;          // Gerundio (-ing)
    isRegular: boolean;      // Indicador de verbo regular/irregular
    examples: {              // Ejemplos en diferentes tiempos verbales
        present: string;
        past: string;
        future: string;
        presentPerfect: string;
        pastPerfect: string;
    };
}

export type VerbTense = 'past' | 'pastParticiple' | 'present' | 'gerund';

export interface VerbFormsParameters {
    difficulty: DifficultyLevel;
    includeRegular: boolean;
    includeIrregular: boolean;
    verbCount: number;
    tenses: { label: string, value: VerbTense }[];
    timeLimit: number; // en segundos, 0 para sin límite
    timerEnabled?: boolean; // Nueva propiedad
}

export interface VerbFormsGameState {
    currentVerbIndex: number;
    verbs: Verb[];
    selectedTense: { label: string, value: VerbTense };
    userInput: string[];
    isCorrect: boolean | null;
    mistakes: number;
    correctAnswers: number;
    timeLeft: number;
    gameStartTime: number;
    metrics: {
        correct: number;
        incorrect: number;
        timeSpent: number;
        accuracyByTense: Record<VerbTense, { correct: number, total: number }>;
    };
}

export interface VerbFormsConfig {
    verbs: Verb[];
    timeLimit: number;
} 