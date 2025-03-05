import { useState, useEffect } from 'react';
import { DifficultyLevel } from '@/types/game';
import { SentenceGameState, SentenceBuilderParameters, Sentence } from '../types';
import { checkSentenceOrder, getSentencesByParameters, getSentenceText } from '../utils/sentenceData';

export const useSentenceGame = (
    parameters: SentenceBuilderParameters
) => {
    // Estado del juego
    const [gameState, setGameState] = useState<SentenceGameState>({

        sentences: [],
        currentSentenceIndex: 0,
        currentSentence: null,
        wordOrder: [],
        isCorrect: null,
        showHint: false,
        score: 0,
        mistakes: 0,
        timeLeft: 0,
        startTime: 0,
        metrics: {
            correct: 0,
            incorrect: 0,
            timeSpent: 0,
            hintsUsed: 0
        }
    });

    // Iniciar el juego
    const startGame = () => {
        // Agregar logs para depuración
        console.log("Parámetros:", parameters);

        // Obtener oraciones filtradas
        const filteredSentences = getSentencesByParameters(parameters);
        console.log("Oraciones filtradas:", filteredSentences);

        if (filteredSentences.length === 0) {
            console.error("No se encontraron oraciones que coincidan con los parámetros");
            return;
        }

        // Establecer estado inicial
        const currentSentence = filteredSentences.length > 0 ? filteredSentences[0] : null;

        setGameState({
            sentences: filteredSentences,
            currentSentenceIndex: 0,
            currentSentence,
            wordOrder: [],
            isCorrect: null,
            showHint: false,
            score: 0,
            mistakes: 0,
            timeLeft: parameters.timeLimit,
            startTime: Date.now(),
            metrics: {
                correct: 0,
                incorrect: 0,
                timeSpent: 0,
                hintsUsed: 0
            }
        });
    };

    // Efecto para manejar el temporizador
    useEffect(() => {
        if (gameState.timeLeft <= 0 || !parameters.timeLimit) return;

        const timer = setInterval(() => {
            setGameState(prevState => {
                if (prevState.timeLeft <= 1) {
                    clearInterval(timer);
                    return {
                        ...prevState,
                        timeLeft: 0
                    };
                }

                return {
                    ...prevState,
                    timeLeft: prevState.timeLeft - 1
                };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState.timeLeft, parameters.timeLimit]);

    // Añadir una palabra a la oración
    const addWordToSentence = (wordId: string) => {
        if (gameState.isCorrect !== null) return; // No permitir cambios si ya fue validada

        setGameState(prevState => ({
            ...prevState,
            wordOrder: [...prevState.wordOrder, wordId]
        }));
    };

    // Quitar una palabra de la oración
    const removeWordFromSentence = (index: number) => {
        if (gameState.isCorrect !== null) return; // No permitir cambios si ya fue validada

        setGameState(prevState => {
            const newOrder = [...prevState.wordOrder];
            newOrder.splice(index, 1);

            return {
                ...prevState,
                wordOrder: newOrder
            };
        });
    };

    // Mover una palabra a otra posición (para drag and drop)
    const moveWord = (sourceIndex: number, destinationIndex: number) => {
        if (gameState.isCorrect !== null) return; // No permitir cambios si ya fue validada

        setGameState(prevState => {
            const newOrder = [...prevState.wordOrder];
            const [movedItem] = newOrder.splice(sourceIndex, 1);
            newOrder.splice(destinationIndex, 0, movedItem);

            return {
                ...prevState,
                wordOrder: newOrder
            };
        });
    };

    // Mostrar/ocultar pista
    const toggleHint = () => {
        setGameState(prevState => {
            const newHintState = !prevState.showHint;

            return {
                ...prevState,
                showHint: newHintState,
                metrics: {
                    ...prevState.metrics,
                    hintsUsed: newHintState ? prevState.metrics.hintsUsed + 1 : prevState.metrics.hintsUsed
                }
            };
        });
    };

    // Verificar si la oración es correcta
    const checkSentence = () => {
        if (!gameState.currentSentence || gameState.isCorrect !== null) return;

        const isCorrect = checkSentenceOrder(gameState.currentSentence, gameState.wordOrder);

        // Actualizar métricas
        const updatedMetrics = { ...gameState.metrics };
        if (isCorrect) {
            updatedMetrics.correct += 1;
        } else {
            updatedMetrics.incorrect += 1;
        }

        setGameState(prevState => ({
            ...prevState,
            isCorrect,
            score: isCorrect ? prevState.score + calculateScore() : prevState.score,
            mistakes: !isCorrect ? prevState.mistakes + 1 : prevState.mistakes,
            metrics: updatedMetrics
        }));
    };

    // Calcular puntuación basada en tiempo y uso de pistas
    const calculateScore = () => {
        const baseScore = 100;
        const hintPenalty = gameState.showHint ? 20 : 0;

        // Bonificación por velocidad: máximo si < 10 segundos, disminuye hasta 0 a los 60 segundos
        const timeSpent = (Date.now() - gameState.startTime) / 1000;
        const timeBonus = Math.max(0, 50 * (1 - Math.min(timeSpent, 60) / 60));

        return Math.round(baseScore - hintPenalty + timeBonus);
    };

    // Pasar a la siguiente oración
    const nextSentence = () => {
        if (gameState.currentSentenceIndex >= gameState.sentences.length - 1) {
            // Fin del juego
            endGame();
            return;
        }

        const nextIndex = gameState.currentSentenceIndex + 1;

        setGameState(prevState => ({
            ...prevState,
            currentSentenceIndex: nextIndex,
            currentSentence: prevState.sentences[nextIndex],
            wordOrder: [],
            isCorrect: null,
            showHint: false,
            startTime: Date.now()
        }));
    };

    // Finalizar el juego
    const endGame = () => {
        const timeSpent = Math.round((Date.now() - gameState.startTime) / 1000);

        setGameState(prevState => ({
            ...prevState,
            metrics: {
                ...prevState.metrics,
                timeSpent
            }
        }));
    };

    // Obtener palabras disponibles (no usadas en la orden actual)
    const getAvailableWords = () => {
        if (!gameState.currentSentence) return [];

        // Ids ya usados en la oración actual
        const usedIds = new Set(gameState.wordOrder);

        // Filtrar sólo las palabras no usadas
        return gameState.currentSentence.words.filter(word => !usedIds.has(word.id));
    };

    // Obtener el texto de la oración actual
    const getCurrentSentenceText = () => {
        if (!gameState.currentSentence) return '';
        return getSentenceText(gameState.currentSentence, gameState.wordOrder);
    };

    // Obtener el texto de la oración correcta
    const getCorrectSentenceText = () => {
        if (!gameState.currentSentence) return '';
        return getSentenceText(gameState.currentSentence, gameState.currentSentence.correctOrder);
    };

    // Formato para mostrar tiempo
    const formatTime = (seconds: number) => {
        if (!parameters.timeLimit) return "∞"; // Sin límite de tiempo
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Verificar si el juego está completado
    const isGameCompleted = gameState.currentSentenceIndex >= gameState.sentences.length - 1 &&
        gameState.isCorrect === true;

    // Progreso del juego (0-100%)
    const getProgress = () => {
        if (gameState.sentences.length === 0) return 0;
        return Math.round(((gameState.currentSentenceIndex) / gameState.sentences.length) * 100);
    };

    const restartCurrentSentence = () => {
        setGameState(prev => ({
            ...prev,
            wordOrder: [],
            isCorrect: null
        }));
    };

    return {
        gameState,
        startGame,
        addWordToSentence,
        removeWordFromSentence,
        moveWord,
        toggleHint,
        checkSentence,
        nextSentence,
        endGame,
        getAvailableWords,
        getCurrentSentenceText,
        getCorrectSentenceText,
        formatTime,
        isGameCompleted,
        getProgress,
        restartCurrentSentence
    };
}; 