import { useState, useCallback, useEffect, useRef } from 'react';
import { getTextToSpeech } from '@/lib/textToSpeech';
import { MinimalPair, MinimalPairsParameters, MinimalPairsState } from '../types/game';
import MinimalPairsConfig from '../config';

export const useMinimalPairsGame = (
    allPairs: MinimalPair[],
    parameters: MinimalPairsParameters
) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const tts = getTextToSpeech({
        language: 'es-ES',
        rate: 0.8,
        volume: 0.8,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
    });

    // Estado del juego
    const [gameState, setGameState] = useState<MinimalPairsState>({
        pairs: [],
        currentPairIndex: 0,
        score: 0,
        isPlaying: false,
        isPaused: false,
        feedback: null,
        gameComplete: false,
        chosenWordIndex: null,
        correctWordIndex: null,
        metrics: {
            correctAnswers: 0,
            totalAttempts: 0,
            averageResponseTime: 0,
            completionTime: 0,
            startTime: 0,
            endTime: null
        }
    });

    // Timer reference
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const responseTimeRef = useRef<number>(0);
    const audioLockRef = useRef(false);

    // Limpiar el audio al cambiar de par o al completar el juego
    useEffect(() => {
        return () => {
            tts.stop();
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, []);

    // Al principio del hook añadir validación
    useEffect(() => {
        // Validar parámetros
        console.log('MinimalPairs game parameters:', parameters);

    }, [parameters]);

    // Iniciar juego (simplificado)
    const startGame = useCallback(() => {
        console.log('Starting game with parameters:', parameters);

        // Filtrar y seleccionar palabras según configuración
        let filteredPairs = [...allPairs];

        // Filtrar por categoría (asegurarse de manejar correctamente 'all')
        filteredPairs = filteredPairs.filter(pair =>
            parameters.categories.some(category => category.value === pair.category)
        );
        console.log(`Filtered pairs by category ${parameters.categories[0].value}: ${filteredPairs.length} pairs`);

        // Filtrar por dificultad
        filteredPairs = filteredPairs.filter(pair =>
            pair.difficulty === parameters.difficulty
        );
        console.log(`Filtered pairs by difficulty ${parameters.difficulty}: ${filteredPairs.length} pairs`);

        // Seleccionar número de pares aleatorios
        const selectedPairs: MinimalPair[] = [];
        const pairCount = Math.min(parameters.pairCount || 10, filteredPairs.length);

        // Si no hay suficientes pares, mostrar advertencia
        if (filteredPairs.length < (parameters.pairCount || 10)) {
            console.warn(`Not enough pairs available (requested ${parameters.pairCount}, available ${filteredPairs.length})`);
        }

        // Seleccionar pares aleatorios
        while (selectedPairs.length < pairCount && filteredPairs.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredPairs.length);
            selectedPairs.push(filteredPairs[randomIndex]);
            filteredPairs.splice(randomIndex, 1);
        }

        console.log(`Selected ${selectedPairs.length} pairs for the game`);

        // Reiniciar estado
        tts.stop(); // Cancelar cualquier audio previo

        setGameState({
            pairs: selectedPairs,
            currentPairIndex: 0,
            score: 0,
            isPlaying: true,
            isPaused: false,
            feedback: null,
            gameComplete: false,
            chosenWordIndex: null,
            correctWordIndex: Math.round(Math.random()), // Elegir aleatoriamente palabra 1 o 2
            metrics: {
                correctAnswers: 0,
                totalAttempts: 0,
                averageResponseTime: 0,
                completionTime: 0,
                startTime: Date.now(),
                endTime: null
            }
        });

        // Configurar temporizador si es necesario
        if (parameters.timeLimit > 0) {
            timerRef.current = setTimeout(() => {
                endGame();
            }, parameters.timeLimit * 1000);
        }

        // Iniciar tiempo de respuesta
        responseTimeRef.current = Date.now();

    }, [allPairs, parameters]);

    // Actualizar playCorrectWordAudio
    const playCorrectWordAudio = useCallback(() => {
        if (!gameState.isPlaying || gameState.isPaused || isSpeaking || audioLockRef.current) return;

        const currentPair = gameState.pairs[gameState.currentPairIndex];
        if (!currentPair) return;

        audioLockRef.current = true;
        const correctWord = gameState.correctWordIndex === 0 ? currentPair.word1.text : currentPair.word2.text;

        tts.speak(correctWord);
        setTimeout(() => audioLockRef.current = false, 500);

    }, [gameState, isSpeaking]);

    // Actualizar playBothWords
    const playBothWords = useCallback(() => {
        if (!gameState.isPlaying || gameState.isPaused || isSpeaking || audioLockRef.current) return;

        const currentPair = gameState.pairs[gameState.currentPairIndex];
        if (!currentPair) return;

        audioLockRef.current = true;
        tts.speak(currentPair.word1.text);

        setTimeout(() => {
            tts.speak(currentPair.word2.text);
            setTimeout(() => audioLockRef.current = false, 300);
        }, 800);

    }, [gameState, isSpeaking]);

    // Actualizar playWordAudio
    const playWordAudio = useCallback((wordIndex: 0 | 1) => {
        if (!gameState.isPlaying || gameState.isPaused || isSpeaking || audioLockRef.current) return;

        const currentPair = gameState.pairs[gameState.currentPairIndex];
        if (!currentPair) return;

        audioLockRef.current = true;

        const wordToPlay = wordIndex === 0 ? currentPair.word1.text : currentPair.word2.text;

        tts.speak(wordToPlay);
        setTimeout(() => audioLockRef.current = false, 300);

    }, [gameState, isSpeaking]);

    // Seleccionar una palabra
    const selectWord = useCallback((wordIndex: 0 | 1) => {
        if (!gameState.isPlaying || gameState.isPaused || gameState.feedback) return;

        const currentPair = gameState.pairs[gameState.currentPairIndex];
        if (!currentPair) return;

        // Calcular tiempo de respuesta
        const responseTime = Math.round((Date.now() - responseTimeRef.current) / 1000);

        // Determinar si la selección es correcta
        const isCorrect = wordIndex === gameState.correctWordIndex;

        // Calcular puntuación
        const score = isCorrect ?
            Math.max(10, 20 - Math.min(responseTime, 10)) : 0; // Menos tiempo = más puntos, máximo 20

        // Obtener texto de las palabras
        const selectedWord = wordIndex === 0 ? currentPair.word1.text : currentPair.word2.text;
        const correctWord = gameState.correctWordIndex === 0 ? currentPair.word1.text : currentPair.word2.text;

        // Generar mensaje de feedback
        let feedbackMessage = '';
        if (isCorrect) {
            feedbackMessage = responseTime < 3
                ? "¡Excelente! Respuesta rápida y correcta."
                : "¡Correcto! Has identificado el sonido adecuadamente.";
        } else {
            feedbackMessage = `La palabra correcta era "${correctWord}". Presta atención a la diferencia entre ${currentPair.focusPhoneme.first} y ${currentPair.focusPhoneme.second}.`;
        }

        // Actualizar estado
        setGameState(prev => {
            // Calcular métricas actualizadas
            const totalAttempts = prev.metrics.totalAttempts + 1;
            const correctAnswers = prev.metrics.correctAnswers + (isCorrect ? 1 : 0);
            const totalResponseTime = prev.metrics.averageResponseTime * prev.metrics.totalAttempts + responseTime;
            const averageResponseTime = totalAttempts > 0 ? totalResponseTime / totalAttempts : 0;

            return {
                ...prev,
                score: prev.score + score,
                chosenWordIndex: wordIndex,
                feedback: {
                    isCorrect,
                    selectedWord,
                    correctWord,
                    message: feedbackMessage
                },
                metrics: {
                    ...prev.metrics,
                    correctAnswers,
                    totalAttempts,
                    averageResponseTime
                }
            };
        });
    }, [gameState]);

    // Pasar al siguiente par
    const nextPair = useCallback(() => {
        setGameState(prev => {
            const nextIndex = prev.currentPairIndex + 1;
            const isGameComplete = nextIndex >= prev.pairs.length;

            if (isGameComplete) {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }

                const endTime = Date.now();
                const completionTime = Math.round((endTime - prev.metrics.startTime) / 1000);

                return {
                    ...prev,
                    gameComplete: true,
                    isPlaying: false,
                    feedback: null,
                    chosenWordIndex: null,
                    metrics: {
                        ...prev.metrics,
                        endTime,
                        completionTime
                    }
                };
            }

            // Preparar el siguiente par
            responseTimeRef.current = Date.now();
            return {
                ...prev,
                currentPairIndex: nextIndex,
                feedback: null,
                chosenWordIndex: null,
                correctWordIndex: Math.round(Math.random()), // Aleatorio para el nuevo par
            };
        });

    }, []);

    // Finalizar juego
    const endGame = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        setGameState(prev => {
            const endTime = Date.now();
            const completionTime = Math.round((endTime - prev.metrics.startTime) / 1000);

            return {
                ...prev,
                isPlaying: false,
                gameComplete: true,
                metrics: {
                    ...prev.metrics,
                    endTime,
                    completionTime
                }
            };
        });
    }, []);

    // Obtener par actual
    const getCurrentPair = useCallback(() => {
        if (!gameState.pairs.length) return null;
        return gameState.pairs[gameState.currentPairIndex];
    }, [gameState.pairs, gameState.currentPairIndex]);

    // Obtener progreso del juego
    const getProgress = useCallback(() => {
        if (!gameState.pairs.length) return 0;
        return Math.round((gameState.currentPairIndex / gameState.pairs.length) * 100);
    }, [gameState.currentPairIndex, gameState.pairs.length]);

    return {
        gameState,
        isSpeaking,
        startGame,
        playCorrectWordAudio,
        playBothWords,
        selectWord,
        nextPair,
        endGame,
        getCurrentPair,
        getProgress,
        playWordAudio,
    };
}; 