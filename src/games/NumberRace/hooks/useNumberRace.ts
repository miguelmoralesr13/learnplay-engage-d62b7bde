import { useState, useEffect, useCallback, useRef } from 'react';
import { NumberRaceState, NumberRaceParameters } from '../types';
import { NUMBER_RANGES, BASE_RUNNER_SPEED, TIME_LIMITS } from '../config';
import { checkAnswer, numberToWords } from '../utils/numberToWords';
import { calculateTimeBonus } from '../utils/scoreCalculator';
import { generateHint } from '../utils/hintGenerator';

export function useNumberRace(params: NumberRaceParameters) {
    const [state, setState] = useState<NumberRaceState>({
        currentNumber: 0,
        currentAnswer: '',
        score: 0,
        timeRemaining: params.timeLimit,
        isCorrect: null,
        gameStatus: 'ready',
        runnerPosition: 0,
        level: 1,
        numberHistory: [],
        hint: null,
        hintsUsed: 0,
        hintLevel: 0,
        currentAttempts: 0,
        showCorrectAnswer: false
    });

    const timerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

    // Generar un nuevo número aleatorio basado en la configuración
    const generateRandomNumber = useCallback(() => {
        // Usar el máximo seleccionado por el usuario en lugar del rango predefinido
        const { min } = NUMBER_RANGES[params.difficulty.value];
        const max = params.maxNumber || NUMBER_RANGES[params.difficulty.value].max;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }, [params.difficulty, params.maxNumber]);

    // Iniciar el juego
    const startGame = useCallback(() => {
        const firstNumber = generateRandomNumber();
        setState(prev => ({
            ...prev,
            currentNumber: firstNumber,
            currentAnswer: '',
            score: 0,
            timeRemaining: params.timeLimit,
            gameStatus: 'playing',
            runnerPosition: 0,
            level: 1,
            numberHistory: []
        }));
        startTimeRef.current = Date.now();

        // Iniciar el temporizador
        if (timerRef.current) {
            window.clearInterval(timerRef.current);
        }

        timerRef.current = window.setInterval(() => {
            setState(prev => {
                const newTimeRemaining = prev.timeRemaining - 1;
                // Si se acaba el tiempo, terminar el juego
                if (newTimeRemaining <= 0) {
                    if (timerRef.current) {
                        window.clearInterval(timerRef.current);
                    }
                    return {
                        ...prev,
                        timeRemaining: 0,
                        gameStatus: 'finished'
                    };
                }

                return {
                    ...prev,
                    timeRemaining: newTimeRemaining
                };
            });
        }, 1000);
    }, [generateRandomNumber, params.timeLimit]);

    // Manejar el cambio en el campo de entrada
    const handleInputChange = useCallback((value: string) => {
        setState(prev => ({
            ...prev,
            currentAnswer: value,
            isCorrect: null
        }));
    }, []);

    // Mover esta función al inicio, justo después de las declaraciones de estado y refs
    const resetHint = useCallback(() => {
        setState(prev => ({
            ...prev,
            hint: null,
            hintLevel: 0
        }));
    }, []);

    // Verificar la respuesta
    const checkUserAnswer = useCallback(() => {
        const { currentNumber, currentAnswer, score, numberHistory, level, currentAttempts } = state;
        const responseTime = Date.now() - startTimeRef.current;
        const isAnswerCorrect = checkAnswer(currentAnswer, currentNumber);

        // Si acierta o ha agotado los 3 intentos, continuar con el siguiente número
        const shouldMoveToNextNumber = isAnswerCorrect || currentAttempts >= 2;

        // Si agotó los intentos y no acertó, mostrar la respuesta correcta
        const showAnswer = !isAnswerCorrect && currentAttempts >= 2;

        // Calcular puntos (solo se dan puntos si es correcto)
        let pointsEarned = 0;
        if (isAnswerCorrect) {
            // Más puntos por menos intentos: 30 (primer intento), 20 (segundo), 10 (tercero)
            pointsEarned = Math.max(30 - (currentAttempts * 10), 10);
        }

        // Bonificación de tiempo solo si acertó
        const timeBonus = (isAnswerCorrect && params.enableTimer) ?
            calculateTimeBonus(params.difficulty, responseTime) : 0;

        // Calcular posición del corredor (solo avanza si acierta)
        let newRunnerPosition = state.runnerPosition;
        if (isAnswerCorrect) {
            const numbersToFinish = params.numbersToFinish || 10;
            const progressPerAnswer = 100 / numbersToFinish;
            newRunnerPosition = Math.min(100, newRunnerPosition + progressPerAnswer);
        }

        // Nuevo nivel si el corredor llega al final
        const newLevel = newRunnerPosition >= 100 ? level + 1 : level;
        // Reset runner if level up
        if (newLevel > level) {
            newRunnerPosition = 0;
        }

        // Registrar historial
        const historyEntry = {
            number: currentNumber,
            correctAnswer: numberToWords(currentNumber),
            userAnswer: currentAnswer,
            wasCorrect: isAnswerCorrect,
            responseTime,
            attemptsUsed: currentAttempts + 1
        };

        setState(prev => ({
            ...prev,
            isCorrect: isAnswerCorrect,
            score: score + pointsEarned,
            timeRemaining: params.enableTimer ? prev.timeRemaining + timeBonus : prev.timeRemaining,
            runnerPosition: newRunnerPosition,
            level: newLevel,
            numberHistory: [...numberHistory, historyEntry],
            currentAttempts: shouldMoveToNextNumber ? 0 : currentAttempts + 1,
            showCorrectAnswer: showAnswer
        }));

        // Generar nuevo número si acierta o agota los intentos
        if (shouldMoveToNextNumber) {
            // Si necesita mostrar la respuesta, esperar más tiempo
            const delay = showAnswer ? 2500 : 1000;

            setTimeout(() => {
                const nextNumber = generateRandomNumber();
                setState(prev => ({
                    ...prev,
                    currentNumber: nextNumber,
                    currentAnswer: '',
                    isCorrect: null,
                    showCorrectAnswer: false
                }));
                startTimeRef.current = Date.now();
            }, delay);
            resetHint();
        }
    }, [state, params.difficulty, params.enableTimer, params.numbersToFinish, generateRandomNumber, resetHint]);

    // Pausar el juego
    const pauseGame = useCallback(() => {
        if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setState(prev => ({
            ...prev,
            gameStatus: 'paused'
        }));
    }, []);

    // Reanudar el juego
    const resumeGame = useCallback(() => {
        if (state.gameStatus === 'paused') {
            startTimeRef.current = Date.now();
            timerRef.current = window.setInterval(() => {
                setState(prev => {
                    const newTimeRemaining = prev.timeRemaining - 1;
                    if (newTimeRemaining <= 0) {
                        if (timerRef.current) {
                            window.clearInterval(timerRef.current);
                        }
                        return {
                            ...prev,
                            timeRemaining: 0,
                            gameStatus: 'finished'
                        };
                    }
                    return {
                        ...prev,
                        timeRemaining: newTimeRemaining
                    };
                });
            }, 1000);

            setState(prev => ({
                ...prev,
                gameStatus: 'playing'
            }));
        }
    }, [state.gameStatus]);

    // Limpiar el temporizador al desmontar el componente
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                window.clearInterval(timerRef.current);
            }
        };
    }, []);

    // Inicializar el primer número cuando el juego está listo
    useEffect(() => {
        if (state.gameStatus === 'ready') {
            const firstNumber = generateRandomNumber();
            setState(prev => ({
                ...prev,
                currentNumber: firstNumber
            }));
        }
    }, [state.gameStatus, generateRandomNumber]);

    // Nueva función para solicitar pistas
    const requestHint = useCallback(() => {
        if (state.gameStatus !== 'playing') return;

        // Incrementar el nivel de pista (máximo 3 niveles)
        const newHintLevel = Math.min(state.hintLevel + 1, 3);

        // Generar la pista correspondiente
        const hint = generateHint(state.currentNumber, newHintLevel);

        // Pequeña penalización por usar pista
        const hintPenalty = newHintLevel * 3; // 3, 6 o 9 segundos según el nivel de pista

        setState(prev => ({
            ...prev,
            hint,
            hintLevel: newHintLevel,
            hintsUsed: prev.hintsUsed + 1,
            timeRemaining: Math.max(1, prev.timeRemaining - hintPenalty)
        }));
    }, [state.gameStatus, state.currentNumber, state.hintLevel]);

    return {
        state,
        startGame,
        pauseGame,
        resumeGame,
        handleInputChange,
        checkUserAnswer,
        requestHint
    };
} 