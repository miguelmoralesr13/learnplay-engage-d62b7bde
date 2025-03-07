import { create } from 'zustand';
import { SimonSaysStore, Command } from './types';
import { COMMANDS_BY_DIFFICULTY } from './config';
import { Difficulty } from '@/store/gameStore';

// Función para obtener comandos aleatorios según dificultad
const getRandomCommands = (difficulty: { label: string, value: Difficulty }, count: number = 10): Command[] => {
    const availableCommands = COMMANDS_BY_DIFFICULTY[difficulty.value];
    if (!availableCommands || availableCommands.length === 0) {
        return [];
    }

    // Mezclar el array de comandos
    const shuffled = [...availableCommands].sort(() => 0.5 - Math.random());

    // Tomar la cantidad solicitada o todos si hay menos
    return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const useSimonSaysStore = create<SimonSaysStore>((set, get) => ({
    // Estado inicial
    currentCommandIndex: 0,
    commands: [],
    score: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    timeRemaining: undefined,
    gameStatus: 'ready',
    useAudio: true,
    showTranslation: true,
    currentRound: 0,
    totalRounds: 10,
    currentPartAttempts: 0,

    // Métodos
    initGame: (difficulty, useAudio = true, showTranslation = true, timeLimit) => {
        console.log(difficulty, useAudio, showTranslation, timeLimit);
        const commands = getRandomCommands(difficulty, 10);
        console.log(commands);
        set({
            commands,
            currentCommandIndex: 0,
            score: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            timeRemaining: timeLimit,
            gameStatus: 'ready',
            useAudio,
            showTranslation,
            currentRound: 0,
            totalRounds: commands.length
        });
    },

    checkAnswer: (partId) => {
        const { commands, currentCommandIndex, gameStatus, currentPartAttempts } = get();

        if (gameStatus !== 'playing' || !commands[currentCommandIndex]) {
            return false;
        }

        const currentCommand = commands[currentCommandIndex];
        const isCorrect = currentCommand.targetPart === partId;

        if (isCorrect) {
            set((state) => ({
                score: state.score + 10,
                correctAnswers: state.correctAnswers + 1,
                currentPartAttempts: 0
            }));
        } else {
            set((state) => ({
                incorrectAnswers: state.incorrectAnswers + 1,
                currentPartAttempts: state.currentPartAttempts + 1
            }));
        }

        return isCorrect;
    },

    nextCommand: () => {
        const { currentCommandIndex, commands, totalRounds } = get();
        const nextIndex = currentCommandIndex + 1;

        if (nextIndex >= commands.length) {
            // Fin del juego
            set({ gameStatus: 'completed' });
        } else {
            set({
                currentCommandIndex: nextIndex,
                currentRound: nextIndex
            });
        }
    },

    resetGame: () => {
        const { gameStatus } = get();
        if (gameStatus === 'playing' || gameStatus === 'paused') {
            // Reiniciar el juego actual
            set({
                currentCommandIndex: 0,
                score: 0,
                correctAnswers: 0,
                incorrectAnswers: 0,
                gameStatus: 'ready',
                currentRound: 0
            });
        } else {
            // Iniciar un nuevo juego con la configuración actual
            const difficulty = get().commands.length > 0
                ? (get().commands[0].text.includes('Simon says') ? 'advanced' :
                    get().commands[0].text.includes('finger') ? 'intermediate' : 'beginner')
                : 'beginner';

            get().initGame(
                { label: difficulty, value: difficulty },
                get().useAudio,
                get().showTranslation,
                get().timeRemaining
            );
        }
    },

    startGame: () => set({ gameStatus: 'playing' }),
    pauseGame: () => set({ gameStatus: 'paused' }),
    resumeGame: () => set({ gameStatus: 'playing' }),
    completeGame: () => set({ gameStatus: 'completed' }),

    showCorrectAnswer: () => {
        set((state) => ({
            currentPartAttempts: 0
        }));
        return get().commands[get().currentCommandIndex]?.targetPart || null;
    }
})); 