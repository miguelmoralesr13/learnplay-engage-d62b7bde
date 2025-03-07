import { useState, useEffect, useCallback, useRef } from 'react';
import {
    SpellingBeeGameState,
    SpellingBeeParameters,
    SpellingWord,
    HintLevel
} from '../types';
import {
    getWordsByFilters,
    checkSpelling,
    generateHint,
    calculateScore
} from '../utils/spellingData';
import { useAudioService } from './useAudioService';

export const useSpellingGame = (
    parameters: SpellingBeeParameters
) => {
    // Estado del juego
    const [gameState, setGameState] = useState<SpellingBeeGameState>({
        words: [],
        currentWordIndex: 0,
        currentWord: null,
        userInput: '',
        attempts: 0,
        hints: 'none',
        score: 0,
        isCorrect: null,
        gameStatus: 'ready',
        correctWords: [],
        incorrectWords: [],
        startTime: 0,
        endTime: null,
        metrics: {
            correct: 0,
            incorrect: 0,
            hintsUsed: 0,
            averageAttempts: 0,
            commonMistakes: []
        }
    });

    // Referencia para el reproductor de audio
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Servicio de audio
    const { pronounceWord } = useAudioService();

    // Iniciar el juego
    const startGame = useCallback(() => {
        // Obtener palabras según parámetros
        const gameWords = getWordsByFilters(
            parameters.categories.map(category => category.value),
            parameters.wordsPerRound
        );

        // Configurar la primera palabra
        const firstWord = gameWords.length > 0 ? gameWords[0] : null;

        setGameState({
            words: gameWords,
            currentWordIndex: 0,
            currentWord: firstWord,
            userInput: '',
            attempts: 0,
            hints: 'none',
            score: 0,
            isCorrect: null,
            gameStatus: 'playing',
            correctWords: [],
            incorrectWords: [],
            startTime: Date.now(),
            endTime: null,
            metrics: {
                correct: 0,
                incorrect: 0,
                hintsUsed: 0,
                averageAttempts: 0,
                commonMistakes: []
            }
        });
    }, [parameters]);

    // Manejar cambios en la entrada del usuario
    const handleInputChange = useCallback((text: string) => {
        setGameState(prev => ({
            ...prev,
            userInput: text
        }));
    }, []);

    // Verificar la respuesta del usuario
    const checkAnswer = useCallback(() => {
        if (!gameState.currentWord || gameState.userInput.trim() === '') return;

        const isCorrect = checkSpelling(gameState.currentWord.word, gameState.userInput);
        const newAttempts = gameState.attempts + 1;

        // Calcular el puntaje si es correcto
        let scoreToAdd = 0;
        if (isCorrect) {
            scoreToAdd = calculateScore(
                gameState.currentWord,
                newAttempts,
                gameState.hints
            );
        }

        // Actualizar el estado del juego
        setGameState(prev => {
            // Actualizar métricas
            const metrics = { ...prev.metrics };

            if (isCorrect) {
                metrics.correct += 1;
            } else if (newAttempts >= parameters.maxAttempts) {
                metrics.incorrect += 1;
                // Registrar error común
                metrics.commonMistakes.push({
                    word: prev.currentWord?.word || '',
                    typed: prev.userInput
                });
            }

            metrics.averageAttempts =
                (metrics.averageAttempts * (prev.correctWords.length + prev.incorrectWords.length) + newAttempts) /
                (prev.correctWords.length + prev.incorrectWords.length + (isCorrect || newAttempts >= parameters.maxAttempts ? 1 : 0));

            return {
                ...prev,
                isCorrect: isCorrect,
                attempts: newAttempts,
                score: prev.score + scoreToAdd,
                gameStatus: isCorrect || (newAttempts >= parameters.maxAttempts && !isCorrect)
                    ? 'checking'
                    : 'playing',
                correctWords: isCorrect
                    ? [...prev.correctWords, prev.currentWord as SpellingWord]
                    : prev.correctWords,
                incorrectWords: !isCorrect && newAttempts >= parameters.maxAttempts
                    ? [...prev.incorrectWords, prev.currentWord as SpellingWord]
                    : prev.incorrectWords,
                metrics
            };
        });
    }, [gameState.currentWord, gameState.userInput, gameState.attempts, gameState.hints, parameters.maxAttempts]);

    // Volver a intentar la palabra actual
    const retryWord = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            userInput: '',
            isCorrect: null,
            gameStatus: 'playing'
        }));
    }, []);

    // Pasar a la siguiente palabra
    const nextWord = useCallback(() => {
        setGameState(prev => {
            const nextIndex = prev.currentWordIndex + 1;

            // Verificar si hemos terminado todas las palabras
            if (nextIndex >= prev.words.length) {
                return {
                    ...prev,
                    gameStatus: 'completed',
                    endTime: Date.now()
                };
            }

            // Pasar a la siguiente palabra
            return {
                ...prev,
                currentWordIndex: nextIndex,
                currentWord: prev.words[nextIndex],
                userInput: '',
                attempts: 0,
                hints: 'none',
                isCorrect: null,
                gameStatus: 'playing'
            };
        });
    }, []);

    // Solicitar una pista
    const requestHint = useCallback((level: HintLevel) => {
        if (!parameters.useHints || !gameState.currentWord) return;

        setGameState(prev => ({
            ...prev,
            hints: level,
            metrics: {
                ...prev.metrics,
                hintsUsed: prev.metrics.hintsUsed + 1
            }
        }));
    }, [gameState.currentWord, parameters.useHints]);

    // Reproducir el audio de la palabra actual
    const playWordAudio = useCallback(() => {
        if (gameState.currentWord) {
            pronounceWord(gameState.currentWord).catch(error => {
                console.error("Error al reproducir audio:", error);
            });
        }
    }, [gameState.currentWord, pronounceWord]);

    // Finalizar el juego
    const endGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            gameStatus: 'completed',
            endTime: Date.now()
        }));
    }, []);

    // Obtener una pista para la palabra actual
    const getCurrentHint = useCallback(() => {
        if (!gameState.currentWord || gameState.hints === 'none') return '';

        return generateHint(gameState.currentWord.word, gameState.hints);
    }, [gameState.currentWord, gameState.hints]);

    // Efecto para reproducir la palabra cuando cambia
    useEffect(() => {
        if (gameState.currentWord && gameState.gameStatus === 'playing') {
            // Pequeño delay para asegurar que la UI se haya actualizado
            setTimeout(() => {
                playWordAudio();
            }, 500);
        }
    }, [gameState.currentWord, gameState.gameStatus, playWordAudio]);

    return {
        gameState,
        startGame,
        handleInputChange,
        checkAnswer,
        nextWord,
        retryWord,
        requestHint,
        playWordAudio,
        getCurrentHint,
        endGame
    };
}; 