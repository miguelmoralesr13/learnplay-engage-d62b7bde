import { create } from 'zustand';
import { WordMatchGameState, WordMatchConfig, WordMatchParameters } from './types';
import { getGameConfigByDifficulty } from './utils/wordPairs';
import { shuffle } from '@/lib/utils';

interface WordMatchStore extends WordMatchGameState {
    // Acciones
    startGame: (parameters: WordMatchParameters) => void;
    selectCard: (index: number, isTranslation: boolean) => void;
    endGame: () => void;
    calculateScore: () => number;
    formatTime: (seconds: number) => string;
    isGameCompleted: () => boolean;
}

export const useWordMatchStore = create<WordMatchStore>((set, get) => ({
    // Estado inicial
    words: [],
    translations: [],
    selectedCards: [],
    matchedPairs: [],
    incorrectAttempts: 0,
    timeLeft: 0,
    gameStartTime: 0,
    gameConfig: null,
    parameters: null,
    metrics: {
        correct: 0,
        incorrect: 0,
        timeSpent: 0,
    },
    timerId: null,

    // Acciones
    startGame: (parameters) => {
        // Primero limpiamos cualquier temporizador existente
        if (get().timerId) {
            clearInterval(get().timerId);
        }

        const gameConfig = getGameConfigByDifficulty(parameters.difficulty.value);
        const selectedPairs = shuffle([...gameConfig.wordPairs]).slice(0, parameters.pairCount);
        const shuffledWords = shuffle(selectedPairs.map(pair => pair.word));
        const shuffledTranslations = shuffle(selectedPairs.map(pair => pair.translation));

        set({
            words: shuffledWords,
            translations: shuffledTranslations,
            selectedCards: [],
            matchedPairs: [],
            incorrectAttempts: 0,
            timeLeft: gameConfig.timeLimit,
            gameStartTime: Date.now(),
            gameConfig,
            parameters,
            metrics: {
                correct: 0,
                incorrect: 0,
                timeSpent: 0,
            }
        });

        // Si el temporizador está habilitado, iniciarlo y guardar su ID
        if (parameters.timerEnabled) {
            const timerId = window.setInterval(() => {
                const { timeLeft } = get();

                if (timeLeft <= 1) {
                    const currentTimerId = get().timerId;
                    if (currentTimerId) clearInterval(currentTimerId);
                    set({ timeLeft: 0, timerId: null });
                } else {
                    set({ timeLeft: timeLeft - 1 });
                }
            }, 1000);

            set({ timerId });
        }
    },

    selectCard: (index, isTranslation) => {
        const cardId = isTranslation ? `t-${index}` : `w-${index}`;
        const state = get();

        // Ignorar si ya está emparejada o seleccionada
        if (state.matchedPairs.includes(cardId) || state.selectedCards.includes(cardId)) {
            return;
        }

        // Ignorar si ya hay dos cartas seleccionadas
        if (state.selectedCards.length >= 2) {
            return;
        }

        // Comprobamos si esta es la primera o segunda carta ANTES de actualizar
        const isSecondCard = state.selectedCards.length === 1;
        const firstCard = isSecondCard ? state.selectedCards[0] : null;

        // Actualizar selección
        set(state => ({
            selectedCards: [...state.selectedCards, cardId]
        }));

        // Si es la segunda carta, verificar coincidencia
        if (isSecondCard && firstCard) {
            setTimeout(() => {
                const state = get();
                const [firstType, firstIndex] = firstCard.split('-');
                const [secondType, secondIndex] = [isTranslation ? 't' : 'w', index.toString()];

                const word = firstType === 'w'
                    ? state.words[parseInt(firstIndex)]
                    : state.words[parseInt(secondIndex)];

                const translation = firstType === 't'
                    ? state.translations[parseInt(firstIndex)]
                    : state.translations[parseInt(secondIndex)];

                const isMatch = state.gameConfig?.wordPairs.some(
                    pair => pair.word === word && pair.translation === translation
                ) || false;

                if (isMatch) {
                    set(state => ({
                        matchedPairs: [...state.matchedPairs, firstCard, cardId],
                        selectedCards: [],
                        metrics: {
                            ...state.metrics,
                            correct: state.metrics.correct + 1
                        }
                    }));
                } else {
                    set(state => ({
                        selectedCards: [],
                        incorrectAttempts: state.incorrectAttempts + 1,
                        metrics: {
                            ...state.metrics,
                            incorrect: state.metrics.incorrect + 1
                        }
                    }));
                }
            }, 1000);
        }
    },

    endGame: () => {
        const timeSpent = Math.round((Date.now() - get().gameStartTime) / 1000);

        set(state => ({
            metrics: {
                ...state.metrics,
                timeSpent
            }
        }));

        // Limpiar el temporizador si existe
        if (get().timerId) {
            clearInterval(get().timerId);
            set({ timerId: null });
        }
    },

    calculateScore: () => {
        const state = get();
        const baseScore = state.matchedPairs.length / 2 * 100;
        const timePenalty = state.metrics.timeSpent / 10;
        const mistakePenalty = state.incorrectAttempts * 20;

        return Math.max(0, Math.round(baseScore - timePenalty - mistakePenalty));
    },

    formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    },

    isGameCompleted: () => {
        const state = get();
        return (state.matchedPairs.length / 2) === state.words.length;
    }
}));