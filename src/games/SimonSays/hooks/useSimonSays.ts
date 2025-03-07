import { useState, useEffect, useCallback } from 'react';
import { useSimonSaysStore } from '../store';
import { useTextToSpeech } from '../../../lib/textToSpeech';
import { SimonSaysGameParams } from '../types';
import { useSoundEffects } from './useSoundEffects';
import { BODY_PARTS } from '../config';

export type GameStage = 'parameters' | 'instructions' | 'playing' | 'feedback';

export const useSimonSays = (params: SimonSaysGameParams) => {
    const [gameStage, setGameStage] = useState<GameStage>('parameters');
    const [feedbackMessage, setFeedbackMessage] = useState<string>('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const { speak } = useTextToSpeech();
    const { playCorrect, playIncorrect } = useSoundEffects();
    const [highlightedPart, setHighlightedPart] = useState<string | null>(null);

    // Obtener el estado y métodos del store
    const state = useSimonSaysStore();

    // Inicializar el juego
    const initGame = useCallback((difficulty = params.difficulty, useAudio = params.useAudio, showTranslation = params.showTranslation, timeLimit = params.timeLimit) => {
        state.initGame(difficulty, useAudio, showTranslation, timeLimit);
    }, [params, state]);

    // Manejar el temporizador
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (state.gameStatus === 'playing' && state.timeRemaining !== undefined && state.timeRemaining > 0) {
            timer = setInterval(() => {
                const newTime = state.timeRemaining! - 1;
                useSimonSaysStore.setState({ timeRemaining: newTime });

                if (newTime <= 0) {
                    clearInterval(timer!);
                    state.completeGame();
                    setGameStage('feedback');
                }
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [state.gameStatus, state.timeRemaining]);

    // Reproducir el comando actual en audio si está activado
    useEffect(() => {
        if (state.gameStatus === 'playing' && state.useAudio && state.commands.length > 0) {
            const currentCommand = state.commands[state.currentCommandIndex];
            if (currentCommand) {
                speak(currentCommand.text);
            }
        }
    }, [state.currentCommandIndex, state.gameStatus, state.useAudio, state.commands, speak]);

    // Función para responder a un comando
    const handleAnswer = useCallback((partId: string) => {
        // Si ya hay una respuesta correcta o el juego está procesando, ignorar clics
        if (isCorrect !== null || state.gameStatus !== 'playing') return false;

        const isAnswerCorrect = state.checkAnswer(partId);
        setIsCorrect(isAnswerCorrect);
        const selectedPart = BODY_PARTS.find(p => p.id === partId);

        if (isAnswerCorrect) {
            setFeedbackMessage('¡Correcto! Preparando siguiente parte...');
            playCorrect();
            setTimeout(() => {
                setIsCorrect(null);
                setFeedbackMessage('');
                state.nextCommand();
            }, 2000);
        } else {
            if (state.currentPartAttempts >= 3) {
                const correctPartId = state.showCorrectAnswer();
                if (correctPartId) {
                    const correctPart = BODY_PARTS.find(p => p.id === correctPartId);
                    setFeedbackMessage(`Agotaste tus intentos. La respuesta correcta es: ${correctPart?.name} (${correctPart?.spanishName})`);
                    setHighlightedPart(correctPartId);
                    setTimeout(() => {
                        setFeedbackMessage('Pasando a la siguiente parte...');
                        setTimeout(() => {
                            setHighlightedPart(null);
                            setFeedbackMessage('');
                            setIsCorrect(null);
                            state.nextCommand();
                        }, 1500);
                    }, 2000);
                }
            } else {
                setFeedbackMessage(`Incorrecto, seleccionaste: ${selectedPart?.name} (${selectedPart?.spanishName}). Te quedan ${3 - state.currentPartAttempts} intentos`);
                playIncorrect();
                setTimeout(() => {
                    setIsCorrect(null);
                    setFeedbackMessage('');
                }, 2000);
            }
        }

        return isAnswerCorrect;
    }, [state, playCorrect, playIncorrect, isCorrect]);

    // Función para obtener métricas finales
    const getMetrics = useCallback(() => {
        const totalAttempts = state.correctAnswers + state.incorrectAnswers;
        const accuracy = totalAttempts > 0
            ? Math.round((state.correctAnswers / totalAttempts) * 100)
            : 0;

        return {
            score: state.score,
            correctAnswers: state.correctAnswers,
            incorrectAnswers: state.incorrectAnswers,
            totalAttempts,
            accuracy,
            timeSpent: params.timeLimit
                ? params.timeLimit - (state.timeRemaining || 0)
                : 0
        };
    }, [
        state.score,
        state.correctAnswers,
        state.incorrectAnswers,
        state.timeRemaining,
        params.timeLimit
    ]);

    // Función para reiniciar el juego
    const resetGame = useCallback(() => {
        state.resetGame();
        setGameStage('parameters');
        setFeedbackMessage('');
        setIsCorrect(null);
    }, [state]);

    // Funciones para cambiar etapa del juego
    const startGame = useCallback(() => {
        state.startGame();
        setGameStage('playing');
    }, [state]);

    useEffect(() => {
        if (state.commands.length === 0) {
            initGame();
        }
    }, []);

    return {
        state,
        gameStage,
        feedbackMessage,
        isCorrect,
        initGame,
        handleAnswer,
        getMetrics,
        resetGame,
        setGameStage,
        startGame
    };
}; 