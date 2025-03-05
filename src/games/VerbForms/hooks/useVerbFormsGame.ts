import { useState, useEffect } from 'react';
import { DifficultyLevel } from '@/types/game';
import {
    VerbFormsGameState,
    VerbFormsParameters,
    VerbTense,
    Verb
} from '../types';
import { getGameConfigByDifficulty } from '../utils/verbData';

export const useVerbFormsGame = (
    parameters: VerbFormsParameters
) => {
    // Estado del juego
    const [gameState, setGameState] = useState<VerbFormsGameState>({
        currentVerbIndex: 0,
        verbs: [],
        selectedTense: { label: 'Past', value: 'past' },
        userInput: [''],
        isCorrect: null,
        mistakes: 0,
        correctAnswers: 0,
        timeLeft: 0,
        gameStartTime: 0,
        metrics: {
            correct: 0,
            incorrect: 0,
            timeSpent: 0,
            accuracyByTense: {
                past: { correct: 0, total: 0 },
                pastParticiple: { correct: 0, total: 0 },
                present: { correct: 0, total: 0 },
                gerund: { correct: 0, total: 0 }
            }
        }
    });

    // Iniciar el juego
    const startGame = () => {
        const gameConfig = getGameConfigByDifficulty(parameters.difficulty, {
            includeRegular: parameters.includeRegular,
            includeIrregular: parameters.includeIrregular,
            verbCount: parameters.verbCount
        });

        // Asegurar que selectedTense sea un objeto con el formato correcto
        const initialTense = Object.keys(parameters.tenses)[0] || 'past';
        const tenseObject = {
            label: initialTense.charAt(0).toUpperCase() + initialTense.slice(1),
            value: initialTense as VerbTense
        };

        // Inicializamos el estado del juego con el formato correcto
        setGameState({
            currentVerbIndex: 0,
            verbs: gameConfig.verbs,
            selectedTense: tenseObject,
            userInput: [''],
            isCorrect: null,
            mistakes: 0,
            correctAnswers: 0,
            timeLeft: parameters.timeLimit || gameConfig.timeLimit,
            gameStartTime: Date.now(),
            metrics: {
                correct: 0,
                incorrect: 0,
                timeSpent: 0,
                accuracyByTense: {
                    past: { correct: 0, total: 0 },
                    pastParticiple: { correct: 0, total: 0 },
                    present: { correct: 0, total: 0 },
                    gerund: { correct: 0, total: 0 }
                }
            }
        });

        // Asegúrate de que el array verbsToUse existe y tiene elementos
        if (!gameConfig.verbs || gameConfig.verbs.length === 0) {
            console.error("No verbs available for the game");
            setGameState(prev => ({
                ...prev,
                currentVerb: null,
                gameStatus: 'error'
            }));
            return;
        }

        // Ahora es seguro acceder al primer elemento
        const firstVerb = gameConfig.verbs[0];

        setGameState(prev => ({
            ...prev,
            currentVerbIndex: 0,
            currentVerb: firstVerb,
            userInput: ['']
        }));
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

    // Manejar el cambio de entrada del usuario
    const handleInputChange = (input: string) => {
        setGameState(prevState => ({
            ...prevState,
            userInput: [input],
            isCorrect: null
        }));
    };

    // Manejar cambio de tiempo verbal
    const handleTenseChange = (tense: VerbTense) => {
        // Crear un objeto tense con el formato esperado
        const tenseObject = {
            label: tense.charAt(0).toUpperCase() + tense.slice(1),
            value: tense
        };

        setGameState(prevState => ({
            ...prevState,
            selectedTense: tenseObject,
            userInput: [''],
            isCorrect: null
        }));
    };

    // Verificar la respuesta del usuario
    const checkAnswer = () => {
        if (!gameState.verbs.length) return;

        const currentVerb = gameState.verbs[gameState.currentVerbIndex];
        const correctAnswer = currentVerb[gameState.selectedTense.value];
        const isCorrect = gameState.userInput[0].trim().toLowerCase() === correctAnswer.toLowerCase();

        // Actualizamos las métricas
        const updatedMetrics = { ...gameState.metrics };
        if (isCorrect) {
            updatedMetrics.correct += 1;
            updatedMetrics.accuracyByTense[gameState.selectedTense.value].correct += 1;
        } else {
            updatedMetrics.incorrect += 1;
        }
        updatedMetrics.accuracyByTense[gameState.selectedTense.value].total += 1;

        setGameState(prevState => ({
            ...prevState,
            isCorrect,
            correctAnswers: isCorrect ? prevState.correctAnswers + 1 : prevState.correctAnswers,
            mistakes: !isCorrect ? prevState.mistakes + 1 : prevState.mistakes,
            metrics: updatedMetrics
        }));

        // Si la respuesta es correcta, programamos para pasar al siguiente verbo
        if (isCorrect) {
            setTimeout(() => {
                nextVerb();
            }, 1500);
        }
    };

    // Pasar al siguiente verbo
    const nextVerb = () => {
        if (gameState.currentVerbIndex >= gameState.verbs.length - 1) {
            // Si hemos completado todos los verbos, finalizamos el juego
            endGame();
            return;
        }

        setGameState(prevState => ({
            ...prevState,
            currentVerbIndex: prevState.currentVerbIndex + 1,
            userInput: [''],
            isCorrect: null
        }));
    };

    // Finalizar el juego
    const endGame = () => {
        const timeSpent = Math.round((Date.now() - gameState.gameStartTime) / 1000);

        setGameState(prevState => ({
            ...prevState,
            metrics: {
                ...prevState.metrics,
                timeSpent
            }
        }));
    };

    // Calcular puntuación
    const calculateScore = () => {
        const baseScore = gameState.correctAnswers * 100;
        const timePenalty = gameState.metrics.timeSpent / 10;
        const mistakePenalty = gameState.mistakes * 20;

        return Math.max(0, Math.round(baseScore - timePenalty - mistakePenalty));
    };

    // Formatear tiempo
    const formatTime = (seconds: number) => {
        if (!parameters.timeLimit) return "∞"; // Si no hay límite de tiempo
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Obtener el verbo actual
    const getCurrentVerb = (): Verb | null => {
        if (!gameState.verbs.length) return null;
        return gameState.verbs[gameState.currentVerbIndex];
    };

    // Comprobar si se ha completado el juego
    const isGameCompleted = gameState.currentVerbIndex >= gameState.verbs.length - 1 && gameState.isCorrect;

    return {
        gameState,
        startGame,
        handleInputChange,
        handleTenseChange,
        checkAnswer,
        nextVerb,
        endGame,
        calculateScore,
        formatTime,
        getCurrentVerb,
        isGameCompleted
    };
}; 