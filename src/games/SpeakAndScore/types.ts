import { IGame } from '@/types/game';

export interface SpeakAndScoreParameters {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    categories: { label: string, value: string }[];
    useTimer: boolean;
    showPhonetics: boolean;
    timeLimitSeconds: number;
    wordsPerSession: number;
}

export interface Word {
    id: string;
    text: string;
    phonetic: string;
    meaning: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface SpeakAndScoreGameState {
    gamePhase: 'setup' | 'instructions' | 'playing' | 'feedback';
    currentWordId: string | null;
    isListening: boolean;
    isRecording: boolean;
    recordedAudioUrl: string | null;
    currentScore: number;
    attempts: number;
    timeRemaining: number;
} 