import { Difficulty } from '@/store/gameStore';
import { IGame } from '../../types/game';

export type BodyPart = {
    id: string;
    name: string;
    spanishName: string;
    area: { x: number; y: number; width: number; height: number };
    pronunciationText: string;
};

export type Command = {
    text: string;
    translation: string;
    targetPart: string;
    audio?: string;
};


export interface SimonSaysStore {
    // Estado
    currentCommandIndex: number;
    commands: Command[];
    score: number;
    correctAnswers: number;
    incorrectAnswers: number;
    timeRemaining?: number;
    gameStatus: 'ready' | 'playing' | 'paused' | 'completed';
    useAudio: boolean;
    showTranslation: boolean;
    currentRound: number;
    totalRounds: number;
    currentPartAttempts: number;
    showCorrectAnswer: () => string | null;

    // Métodos
    initGame: (difficulty: { label: string, value: Difficulty }, useAudio?: boolean, showTranslation?: boolean, timeLimit?: number) => void;
    checkAnswer: (partId: string) => boolean;
    nextCommand: () => void;
    resetGame: () => void;
    startGame: () => void;
    pauseGame: () => void;
    resumeGame: () => void;
    completeGame: () => void;
}

export interface SimonSaysGameParams {
    difficulty: { label: string; value: Difficulty };
    useAudio: boolean;
    showTranslation: boolean;
    timeLimit?: number; // en segundos, undefined para sin límite
} 