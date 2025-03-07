import { create } from 'zustand';
import { getWordsByDifficulty, getWordsByCategory } from '../data';
import { SpeakAndScoreParameters, SpeakAndScoreGameState, Word } from '../types';

// Interface para el store del juego
export interface SpeakAndScoreStore extends SpeakAndScoreGameState {
    parameters: SpeakAndScoreParameters;
    currentWord: Word | null;
    availableWords: Word[];
    completedWords: string[];
    audioLevels: number[];
    recognizedText: string;
    textSimilarity: number;
    showRecognitionFeedback: boolean;

    // Acciones
    setParameters: (params: SpeakAndScoreParameters) => void;
    startGame: () => void;
    nextWord: () => void;
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
export const useSpeakAndScoreStore = create<SpeakAndScoreStore>((set, get) => ({
    // Estado inicial
    parameters: {
        difficulty: 'beginner',
        categories: [],
        useTimer: false,
        showPhonetics: true,
        timeLimitSeconds: 60,
        wordsPerSession: 10
    },
    currentWordId: null,
    currentWord: null,
    isListening: false,
    isRecording: false,
    currentScore: 0,
    attempts: 0,
    recordedAudioUrl: null,
    gamePhase: 'setup',
    timeRemaining: 0,
    availableWords: [],
    completedWords: [],
    audioLevels: Array(20).fill(0),
    recognizedText: '',
    textSimilarity: 0,
    showRecognitionFeedback: false,

    // Acciones
    setParameters: (params) => set({ parameters: params }),

    startGame: () => {
        const { parameters } = get();
        let words = getWordsByDifficulty(parameters.difficulty);

        if (parameters.categories.length > 0) {
            words = words.filter(word => parameters.categories.some(category => category.value === word.category));
        }

        set({
            availableWords: words,
            gamePhase: 'instructions',
            currentScore: 0,
            completedWords: []
        });
    },

    nextWord: () => {
        const { availableWords, completedWords, parameters } = get();

        // Filtrar las palabras que ya se han completado
        const remainingWords = availableWords.filter(
            word => !completedWords.includes(word.id)
        );

        if (remainingWords.length === 0 || completedWords.length >= parameters.wordsPerSession) {
            // Si no hay más palabras o se alcanzó el límite de palabras, terminar el juego
            set({ gamePhase: 'feedback' });
            return;
        }

        // Seleccionar una palabra aleatoria
        const randomIndex = Math.floor(Math.random() * remainingWords.length);
        const selectedWord = remainingWords[randomIndex];

        set({
            currentWord: selectedWord,
            currentWordId: selectedWord.id,
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
        completedWords: [],
        currentWord: null,
        currentWordId: null
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