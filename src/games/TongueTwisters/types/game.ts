import { DifficultyLevel } from '@/types/game';

export interface TongueTwister {
    id: string;
    text: string;
    difficulty: DifficultyLevel;
    category: string;
    translation?: string;
    bpm?: number;
    focusPhoneme: {
        first: string;
        position: 'start' | 'middle' | 'end';
    },
    second: string;
}

export interface TongueTwistersParameters {
    showTranslation: boolean;
    useRhythm: boolean;
    practiceMode: boolean;
    speedMultiplier: number;
    timeLimit: number;
    attempts: number;
}

export interface TongueTwistersState {
    currentTwisterId: string;
    isPlaying: boolean;
    isRecording: boolean;
    score: number;
    attempts: number;
    feedback: {
        accuracy: number;
        speed: number;
        clarity: number;
        message: string;
    } | null;
    history: {
        twisterId: string;
        accuracy: number;
        timestamp: number;
    }[];
    metrics: {
        correctAttempts: number;
        totalAttempts: number;
        averageAccuracy: number;
        completionTime: number;
    };
    isPracticeMode?: boolean;
}