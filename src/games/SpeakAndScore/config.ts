import { IGame } from '@/types/game';
import { SpeakAndScoreParameters } from './types';

// Valores predeterminados
export const defaultParameters: SpeakAndScoreParameters = {
    difficulty: 'beginner',
    useTimer: false,
    categories: [
        { label: 'Common', value: 'common' },
        { label: 'Academic', value: 'academic' },
        { label: 'Business', value: 'business' },
        { label: 'Other', value: 'other' },
    ],
    showPhonetics: true,
    timeLimitSeconds: 60,
    wordsPerSession: 10
};

// Instrucciones del juego
export const gameInstructions: string[] = [
    "Welcome to Speak & Score! This game will help you improve your English pronunciation.",
    "You will be presented with common English words to pronounce.",
    "Listen to the word by clicking the 'Listen' button to hear the correct pronunciation.",
    "Click the microphone button and clearly pronounce the word.",
    "The system will analyze your pronunciation and give you immediate feedback.",
    "Try to get the highest score by pronouncing each word as accurately as possible!",
    "Use the visual waveform comparison to see how your pronunciation compares to the original."
];

// Crear configuración del juego
export const gameConfig: IGame = {
    id: 'speak-and-score',
    type: 'Audio',
    difficulty: 'beginner',
    category: 'Pronunciation',
    parameters: defaultParameters,
    instructions: gameInstructions
};

export const CATEGORIES = gameConfig.parameters.categories;

export interface SpeakAndScoreState {
    currentWord: string;
    score: number;
    attemptsLeft: number;
    recording: boolean;
    playingAudio: boolean;
    feedback: string;
}

export type WordList = {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
}
