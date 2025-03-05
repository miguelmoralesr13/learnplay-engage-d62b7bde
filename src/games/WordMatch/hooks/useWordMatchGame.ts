import { useState, useEffect } from 'react';
import { DifficultyLevel } from '@/types/game';
import { WordMatchGameState, WordMatchParameters } from '../types';
import { getGameConfigByDifficulty } from '../utils/wordPairs';
import { shuffle } from '@/lib/utils';

export const useWordMatchGame = (
    difficulty: DifficultyLevel,
    parameters: WordMatchParameters
) => {
    // Estado del juego
    const [gameState, setGameState] = useState<WordMatchGameState>({
        words: [],
        translations: [],
        selectedWord: null,
        selectedTranslation: null,
        matchedPairs: [],
        incorrectAttempts: 0,
        timeLeft: 0,
        gameStartTime: 0,
        metrics: {
            correct: 0,
            incorrect: 0,
            timeSpent: 0,
        }
    });

    // Iniciar el juego
    const startGame = () => {
        const gameConfig = getGameConfigByDifficulty(difficulty);

        // Limitar a la cantidad de pares configurada
        const selectedPairs = shuffle([...gameConfig.wordPairs]).slice(0, parameters.pairCount);

        // Configurar palabras y traducciones
        const shuffledWords = shuffle(selectedPairs.map(pair => pair.word));
        const shuffledTranslations = shuffle(selectedPairs.map(pair => pair.translation));

        setGameState({
            words: shuffledWords,
            translations: shuffledTranslations,
            selectedWord: null,
            selectedTranslation: null,
            matchedPairs: [],
            incorrectAttempts: 0,
            timeLeft: gameConfig.timeLimit,
            gameStartTime: Date.now(),
            metrics: {
                correct: 0,
                incorrect: 0,
                timeSpent: 0,
            }
        });
    };

    // Efecto para manejar el temporizador
    useEffect(() => {
        if (gameState.timeLeft <= 0 || !parameters.timerEnabled) return;

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
    }, [gameState.timeLeft, parameters.timerEnabled]);

    // Comprobar si las selecciones coinciden
    useEffect(() => {
        if (gameState.selectedWord === null || gameState.selectedTranslation === null) return;

        const word = gameState.words[gameState.selectedWord];
        const translation = gameState.translations[gameState.selectedTranslation];

        // Buscar si la traducción coincide con la palabra
        const gameConfig = getGameConfigByDifficulty(difficulty);
        const matchedPair = gameConfig.wordPairs
            .find(pair => pair.word === word && pair.translation === translation);

        if (matchedPair) {
            // Coincidencia correcta
            setGameState(prevState => ({
                ...prevState,
                matchedPairs: [...prevState.matchedPairs, prevState.selectedWord, prevState.selectedTranslation],
                metrics: {
                    ...prevState.metrics,
                    correct: prevState.metrics.correct + 1
                }
            }));
        } else {
            // Coincidencia incorrecta
            setTimeout(() => {
                setGameState(prevState => ({
                    ...prevState,
                    selectedWord: null,
                    selectedTranslation: null,
                    incorrectAttempts: prevState.incorrectAttempts + 1,
                    metrics: {
                        ...prevState.metrics,
                        incorrect: prevState.metrics.incorrect + 1
                    }
                }));
            }, 1000);
        }
    }, [gameState.selectedWord, gameState.selectedTranslation]);

    // Seleccionar una palabra
    const selectWord = (index: number) => {
        if (gameState.matchedPairs.includes(index) || gameState.selectedWord === index) return;

        setGameState(prevState => ({
            ...prevState,
            selectedWord: index
        }));
    };

    // Seleccionar una traducción
    const selectTranslation = (index: number) => {
        if (gameState.matchedPairs.includes(index) || gameState.selectedTranslation === index) return;

        setGameState(prevState => ({
            ...prevState,
            selectedTranslation: index
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
        const baseScore = gameState.matchedPairs.length / 2 * 100;
        const timePenalty = gameState.metrics.timeSpent / 10;
        const mistakePenalty = gameState.incorrectAttempts * 20;

        return Math.max(0, Math.round(baseScore - timePenalty - mistakePenalty));
    };

    // Formatear tiempo
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Comprobar si se ha completado el juego
    const isGameCompleted = gameState.matchedPairs.length === gameState.words.length;

    return {
        gameState,
        startGame,
        selectWord,
        selectTranslation,
        endGame,
        calculateScore,
        formatTime,
        isGameCompleted
    };
}; 