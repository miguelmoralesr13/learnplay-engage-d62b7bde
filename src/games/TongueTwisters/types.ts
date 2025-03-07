import { DifficultyLevel } from "@/types/game";

export interface TongueTwister {
    id: string;
    text: string;
    difficulty: DifficultyLevel;
    translation?: string;
}

export interface TongueTwistersParameters {
    difficulty: { label: string; value: DifficultyLevel };
    useTimer: boolean;
    showTranslation: boolean;
    timeLimitSeconds: number;
    speedMultiplier: number;
}

export interface TongueTwistersGameState {
    currentTwisterId: string | null;
    isListening: boolean;
    isRecording: boolean;
    currentScore: number;
    attempts: number;
    recordedAudioUrl: string | null;
    gamePhase: 'setup' | 'instructions' | 'playing' | 'feedback';
    timeRemaining: number;
} 