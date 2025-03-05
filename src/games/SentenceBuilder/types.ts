import { DifficultyLevel } from '@/types/game';

export type SentenceBuilderDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface SentenceBuilderParameters {
    difficulty: { label: string, value: SentenceBuilderDifficulty };
    sentencesPerRound: number;
    timerEnabled: boolean;
    timeLimit: number;
    showHints: boolean;
    showTranslation?: boolean;
    shuffleFragments?: boolean;
    maxAttemptsPerSentence?: number;
}

export interface SentenceFragment {
    id: string;
    text: string;
    position: number;
}

export interface SentenceData {
    id: string;
    fragments: SentenceFragment[];
    correctOrder: number[];
    translation?: string;
    difficulty: DifficultyLevel;
}

export interface SentenceBuilderState {
    sentences: SentenceData[];
    currentSentenceIndex: number;
    currentOrder: number[];
    isCorrect: boolean | null;
    score: number;
    timeRemaining: number;
    gameStatus: 'ready' | 'playing' | 'paused' | 'finished';
    completedSentences: {
        sentence: SentenceData;
        wasCorrect: boolean;
        timeSpent: number;
    }[];
    hintsUsed: number;
}

export interface Word {
    id: string;
    text: string;
    type: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'article' | 'pronoun' | 'conjunction' | 'other';
}

export interface Sentence {
    id: string;
    words: Word[];
    correctOrder: string[];
    translations: { es: string };
    grammarFocus: string;
    grammarHint: string;
    alternatives?: string[][];
    level: DifficultyLevel;
}

export interface SentenceGameState {
    sentences: Sentence[];
    currentSentenceIndex: number;
    currentSentence: Sentence | null;
    wordOrder: string[];
    isCorrect: boolean | null;
    showHint: boolean;
    score: number;
    mistakes: number;
    timeLeft: number;
    startTime: number;
    metrics: {
        correct: number;
        incorrect: number;
        timeSpent: number;
        hintsUsed: number;
    };
}