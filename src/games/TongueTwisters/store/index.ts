import { create } from 'zustand';
import { getTwistersByDifficulty } from '../data';
import { TongueTwistersParameters, TongueTwistersGameState, TongueTwister } from '../types';

// Interface para el store del juego
export interface TongueTwistersStore extends TongueTwistersGameState {
    parameters: TongueTwistersParameters;
    currentTwister: TongueTwister | null;
    availableTwisters: TongueTwister[];
    completedTwisters: string[];
    audioLevels: number[];
    recognizedText: string;
    textSimilarity: number;
    showRecognitionFeedback: boolean;

    // Acciones
    setParameters: (params: TongueTwistersParameters) => void;
    startGame: () => void;
    nextTwister: () => void;
    startListening: () => void;
    stopListening: () => void;
    startRecording: () => void;
    stopRecording: () => void;
    setScore: (score: number) => void;
    endGame: () => void;
    resetGame: () => void;
    setAudioLevels: (levels: number[]) => void;
    setRecognitionFeedback: (text: string, similarity: number) => void;
    hideRecognitionFeedback: () => void;
}

// Creación del store
export const useTongueTwistersStore = create<TongueTwistersStore>((set, get) => ({
    // Estado inicial
    parameters: {
        difficulty: { label: 'Dificultad', value: 'beginner' },
        category: 'general',
        useTimer: false,
        showTranslation: true,
        timeLimitSeconds: 60,
        speedMultiplier: 1
    },
    currentTwisterId: null,
    currentTwister: null,
    isListening: false,
    isRecording: false,
    currentScore: 0,
    attempts: 0,
    recordedAudioUrl: null,
    gamePhase: 'setup',
    timeRemaining: 0,
    availableTwisters: [],
    completedTwisters: [],
    audioLevels: Array(20).fill(0),
    recognizedText: '',
    textSimilarity: 0,
    showRecognitionFeedback: false,

    // Acciones
    setParameters: (params) => set({ parameters: params }),

    startGame: () => {
        const { parameters } = get();
        let twisters = [];
        twisters = getTwistersByDifficulty(parameters.difficulty.value);

        set({
            availableTwisters: twisters,
            gamePhase: 'instructions',
            currentScore: 0,
            completedTwisters: []
        });
    },

    nextTwister: () => {
        const { availableTwisters, completedTwisters, parameters } = get();

        // Filtrar los trabalenguas que ya se han completado
        const remainingTwisters = availableTwisters.filter(
            twister => !completedTwisters.includes(twister.id)
        );

        if (remainingTwisters.length === 0) {
            // Si no hay más trabalenguas, terminar el juego
            set({ gamePhase: 'feedback' });
            return;
        }

        // Seleccionar un trabalenguas aleatorio
        const randomIndex = Math.floor(Math.random() * remainingTwisters.length);
        const selectedTwister = remainingTwisters[randomIndex];

        set({
            currentTwister: selectedTwister,
            currentTwisterId: selectedTwister.id,
            attempts: 0,
            recordedAudioUrl: null,
            gamePhase: 'playing',
            timeRemaining: parameters.useTimer ? parameters.timeLimitSeconds : 0
        });
    },

    startListening: () => set({ isListening: true }),

    stopListening: () => set({ isListening: false }),

    startRecording: () => set({ isRecording: true, recordedAudioUrl: null }),

    stopRecording: () => {
        set({ isRecording: false });
    },

    setScore: (score) => set({ currentScore: score }),

    endGame: () => set({ gamePhase: 'feedback' }),

    resetGame: () => set({
        gamePhase: 'setup',
        currentScore: 0,
        attempts: 0,
        recordedAudioUrl: null,
        completedTwisters: [],
        currentTwister: null,
        currentTwisterId: null
    }),

    setAudioLevels: (levels) => set({ audioLevels: levels }),

    setRecognitionFeedback: (text, similarity) => set({
        recognizedText: text,
        textSimilarity: similarity,
        showRecognitionFeedback: true
    }),

    hideRecognitionFeedback: () => set({
        showRecognitionFeedback: false
    })
})); 