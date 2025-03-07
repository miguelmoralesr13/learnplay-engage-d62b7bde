import { useState, useEffect, useCallback } from 'react';
import { WordRushGameState, WordRushParameters, WordItem } from '../types';
import { getWordsByCategories, generateOptions } from '../utils/wordData';
import { DifficultyLevel } from '@/types/game';

export const useWordRushGame = (
    parameters: WordRushParameters
) => {
    // Estado del juego
    const [gameState, setGameState] = useState<WordRushGameState>({
        words: [],
        currentWordIndex: 0,
        currentWord: null,
        options: [],
        score: 0,
        combo: 0,
        maxCombo: 0,
        timeLeft: parameters.timeLimit,
        gameStatus: 'ready',
        startTime: 0,
        correctAnswers: [],
        wrongAnswers: [],
        metrics: {
            correct: 0,
            incorrect: 0,
            averageResponseTime: 0,
            comboStats: []
        }
    });

    // Iniciar el juego
    const startGame = useCallback(() => {
        // Obtener palabras según parámetros
        const gameWords = getWordsByCategories(
            parameters.categories.map(category => category.value),
            parameters.wordsPerRound,
        );
        console.log(gameWords);

        // Configurar la primera palabra
        const firstWord = gameWords.length > 0 ? gameWords[0] : null;

        // Generar opciones para la primera palabra
        const initialOptions = firstWord
            ? generateOptions(firstWord, 4, parameters.showTranslation)
            : [];

        setGameState({
            words: gameWords,
            currentWordIndex: 0,
            currentWord: firstWord,
            options: initialOptions,
            score: 0,
            combo: 0,
            maxCombo: 0,
            timeLeft: parameters.timeLimit,
            gameStatus: 'playing',
            startTime: Date.now(),
            correctAnswers: [],
            wrongAnswers: [],
            metrics: {
                correct: 0,
                incorrect: 0,
                averageResponseTime: 0,
                comboStats: []
            }
        });
    }, [parameters]);

    // Efecto para el temporizador
    useEffect(() => {
        if (!parameters.timerEnabled) return;

        let timer: NodeJS.Timeout | null = null;
        if (gameState.gameStatus === 'playing' && gameState.timeLeft > 0) {
            timer = setInterval(() => {
                setGameState(prev => ({
                    ...prev,
                    timeLeft: prev.timeLeft - 1
                }));
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [gameState.gameStatus, gameState.timeLeft, parameters.timerEnabled]);

    // Verificar respuesta seleccionada
    const checkAnswer = useCallback((selectedOption: string) => {
        if (
            gameState.gameStatus !== 'playing' ||
            !gameState.currentWord
        ) return;

        const correctOption = parameters.showTranslation
            ? gameState.currentWord.translation
            : gameState.currentWord.definition || gameState.currentWord.translation;

        const isCorrect = selectedOption === correctOption;

        // Calcular tiempo de respuesta
        const responseTime = (Date.now() - gameState.startTime) / 1000;

        // Actualizar métricas y estado
        setGameState(prev => {
            // Calcular nuevo combo
            const newCombo = isCorrect ? prev.combo + 1 : 0;

            // Calcular puntaje
            // Base: 100 puntos por respuesta correcta
            // Bonus: combo multiplier
            const pointsEarned = isCorrect
                ? Math.round(100 * (1 + (newCombo * parameters.comboMultiplier)))
                : 0;

            // Tiempo adicional por respuesta correcta
            const timeBonus = isCorrect ? parameters.timeBonusPerWord : 0;

            // Actualizar métricas
            const newMetrics = {
                ...prev.metrics,
                correct: isCorrect ? prev.metrics.correct + 1 : prev.metrics.correct,
                incorrect: !isCorrect ? prev.metrics.incorrect + 1 : prev.metrics.incorrect,
                averageResponseTime:
                    ((prev.metrics.averageResponseTime *
                        (prev.metrics.correct + prev.metrics.incorrect)) +
                        responseTime) /
                    ((prev.metrics.correct + prev.metrics.incorrect) + 1),
                comboStats: [...prev.metrics.comboStats, newCombo]
            };

            // Añadir a respuestas correctas/incorrectas
            const updatedCorrect = isCorrect
                ? [...prev.correctAnswers, prev.currentWord as WordItem]
                : prev.correctAnswers;

            const updatedWrong = !isCorrect
                ? [...prev.wrongAnswers, prev.currentWord as WordItem]
                : prev.wrongAnswers;

            return {
                ...prev,
                score: prev.score + pointsEarned,
                combo: newCombo,
                maxCombo: Math.max(prev.maxCombo, newCombo),
                timeLeft: prev.timeLeft + timeBonus,
                metrics: newMetrics,
                correctAnswers: updatedCorrect,
                wrongAnswers: updatedWrong
            };
        });

        // Pasar a la siguiente palabra
        setTimeout(() => {
            nextWord();
        }, 500); // Pequeña pausa para mostrar feedback

    }, [gameState.currentWord, gameState.startTime, gameState.gameStatus, parameters]);

    // Pasar a la siguiente palabra
    const nextWord = useCallback(() => {
        setGameState(prev => {
            // Verificar si hemos terminado todas las palabras
            if (prev.currentWordIndex >= prev.words.length - 1) {
                return {
                    ...prev,
                    gameStatus: 'completed'
                };
            }

            // Pasar a la siguiente palabra
            const nextIndex = prev.currentWordIndex + 1;
            const nextWord = prev.words[nextIndex];

            // Generar nuevas opciones
            const newOptions = generateOptions(
                nextWord,
                4,
                parameters.showTranslation
            );

            return {
                ...prev,
                currentWordIndex: nextIndex,
                currentWord: nextWord,
                options: newOptions
            };
        });
    }, [parameters.showTranslation]);

    // Finalizar el juego
    const endGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            gameStatus: 'completed'
        }));
    }, []);

    // Pausar/reanudar el juego
    const togglePause = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            gameStatus: prev.gameStatus === 'playing' ? 'paused' : 'playing'
        }));
    }, []);

    // Calcular porcentaje de tiempo restante
    const getTimePercentage = useCallback(() => {
        return (gameState.timeLeft / parameters.timeLimit) * 100;
    }, [gameState.timeLeft, parameters.timeLimit]);

    // Calcular porcentaje de progreso
    const getProgressPercentage = useCallback(() => {
        if (gameState.words.length === 0) return 0;
        return (gameState.currentWordIndex / gameState.words.length) * 100;
    }, [gameState.currentWordIndex, gameState.words.length]);

    // Formatear tiempo como mm:ss
    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }, []);

    return {
        gameState,
        startGame,
        checkAnswer,
        nextWord,
        endGame,
        togglePause,
        getTimePercentage,
        getProgressPercentage,
        formatTime
    };
}; 