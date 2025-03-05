import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNumberRace } from './hooks/useNumberRace';
import NumberDisplay from './components/NumberDisplay';
import RunnerVisual from './components/RunnerVisual';
import NumberInput from './components/NumberInput';
import GameWrapper from '@/components/game/GameWrapper';
import ParametersForm from '@/components/game/ParametersForm';
import InstructionsPanel from '@/components/game/InstructionsPanel';
import FeedbackDisplay from '@/components/game/FeedbackDisplay';
import NumberRaceConfig, { TIME_LIMITS, NUMBER_RANGES } from './config';
import { NumberRaceDifficulty, NumberRaceParameters } from './types';
import { DifficultyLevel } from '@/types/game';
import { Button } from '@/components/ui/button';
import HintDisplay from './components/HintDisplay';

type GameStage = 'parameters' | 'instructions' | 'playing' | 'feedback';

const NumberRace = () => {
    // Estado para el flujo del juego
    const [gameStage, setGameStage] = useState<GameStage>('parameters');
    const [difficulty, setDifficulty] = useState<DifficultyLevel>(NumberRaceConfig.difficulty);
    const [parameters, setParameters] = useState<NumberRaceParameters>(
        NumberRaceConfig.parameters as NumberRaceParameters
    );

    // Hook personalizado para la lógica del juego
    const {
        state,
        startGame,
        pauseGame,
        resumeGame,
        handleInputChange,
        checkUserAnswer,
        requestHint
    } = useNumberRace(parameters);

    // Manejadores para las transiciones entre etapas
    const handleParametersSubmit = (newDifficulty: DifficultyLevel, params: any) => {
        setDifficulty(newDifficulty);

        // Conversion map para asegurar que usamos valores válidos
        const difficultyMap: Record<string, NumberRaceDifficulty> = {
            'beginner': 'beginner',
            'intermediate': 'intermediate',
            'advanced': 'advanced'
        };

        const mappedDifficulty = difficultyMap[newDifficulty] || 'beginner';

        // Establecer los parámetros usando los valores del formulario Formik
        setParameters({
            difficulty: mappedDifficulty,
            timeLimit: TIME_LIMITS[mappedDifficulty],
            maxNumber: NUMBER_RANGES[mappedDifficulty].max, // Usamos siempre el max según la dificultad
            enableTimer: params.enableTimer !== undefined ? params.enableTimer : true,
            numbersToFinish: params.numbersToFinish || 10
        });

        setGameStage('instructions');
    };

    const handleInstructionsComplete = () => {
        startGame();
        setGameStage('playing');
    };

    const handleGameComplete = () => {
        setGameStage('feedback');
    };

    const handlePlayAgain = () => {
        setGameStage('parameters');
    };

    // Comprobar si el juego ha terminado
    if (
        gameStage === 'playing' &&
        (state.gameStatus === 'finished' || state.timeRemaining <= 0)
    ) {
        handleGameComplete();
    }

    // Manejar cambio de dificultad
    const handleDifficultyChange = (value: DifficultyLevel) => {
        const newDifficulty = value as NumberRaceDifficulty;
        setParameters({
            ...parameters,
            difficulty: newDifficulty,
            timeLimit: TIME_LIMITS[newDifficulty]
        });
    };

    return (
        <GameWrapper title="Number Race">
            <AnimatePresence mode="wait">
                {gameStage === 'parameters' && (
                    <motion.div
                        key="parameters"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full"
                    >
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-4">Game Configuration</h2>
                            <p className="text-gray-600">
                                Customize your Number Race experience by adjusting these options.
                            </p>
                        </div>

                        <ParametersForm
                            gameConfig={NumberRaceConfig}
                            onSubmit={handleParametersSubmit}
                        />
                    </motion.div>
                )}

                {gameStage === 'instructions' && (
                    <InstructionsPanel
                        key="instructions"
                        instructions={NumberRaceConfig.instructions}
                        onComplete={handleInstructionsComplete}
                    />
                )}

                {gameStage === 'playing' && (
                    <motion.div
                        key="playing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full flex flex-col gap-6"
                    >
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-3">
                                {parameters.enableTimer ? (
                                    <div>
                                        <span className="text-sm text-gray-500">Time remaining:</span>
                                        <h3 className="text-xl font-bold">
                                            {!isNaN(state.timeRemaining) ?
                                                `${Math.floor(state.timeRemaining / 60)}:${(state.timeRemaining % 60).toString().padStart(2, '0')}` :
                                                "0:00"}
                                        </h3>
                                    </div>
                                ) : (
                                    <div>
                                        <span className="text-sm text-gray-500">Mode:</span>
                                        <h3 className="text-xl font-bold">Practice</h3>
                                    </div>
                                )}

                                <div className="text-center">
                                    <span className="text-sm text-gray-500">Vueltas</span>
                                    <h3 className="text-xl font-bold">{!isNaN(state.level - 1) ? state.level - 1 : 0}</h3>
                                </div>

                                <div className="text-right">
                                    <span className="text-sm text-gray-500">Score</span>
                                    <h3 className="text-xl font-bold">{!isNaN(state.score) ? state.score : 0}</h3>
                                </div>
                            </div>

                            {parameters.enableTimer && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                    <div
                                        className={`h-2.5 rounded-full ${state.timeRemaining < 10 ? 'bg-red-500' : 'bg-purple'}`}
                                        style={{ width: `${!isNaN(state.timeRemaining) ? (state.timeRemaining / parameters.timeLimit) * 100 : 0}%` }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Runner Visual */}
                        <RunnerVisual position={state.runnerPosition} level={state.level} />

                        {/* Number Display */}
                        <NumberDisplay
                            number={state.currentNumber}
                            isCorrect={state.isCorrect}
                            showCorrectAnswer={state.showCorrectAnswer}
                        />

                        {/* Hint Display */}
                        <HintDisplay
                            hint={state.hint}
                            hintLevel={state.hintLevel}
                            onRequestHint={requestHint}
                            isPlaying={state.gameStatus === 'playing'}
                        />

                        {/* Number Input */}
                        <div className="flex justify-center">
                            <NumberInput
                                value={state.currentAnswer}
                                onChange={handleInputChange}
                                onSubmit={checkUserAnswer}
                                isCorrect={state.isCorrect}
                                isPlaying={state.gameStatus === 'playing'}
                            />
                        </div>

                        {/* Controls */}
                        <div className="mt-8 flex justify-center space-x-4">
                            <Button
                                variant="outline"
                                onClick={state.gameStatus === 'playing' ? pauseGame : resumeGame}
                            >
                                {state.gameStatus === 'playing' ? 'Pause' : 'Resume'}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {gameStage === 'feedback' && (
                    <FeedbackDisplay
                        key="feedback"
                        gameId="number-race"
                        score={state.score}
                        maxScore={state.level * 200}
                        metrics={{
                            correct: state.numberHistory.filter(h => h.wasCorrect).length,
                            incorrect: state.numberHistory.filter(h => !h.wasCorrect).length,
                            timeSpent: parameters.timeLimit - state.timeRemaining,
                            accuracy: state.numberHistory.length > 0
                                ? (state.numberHistory.filter(h => h.wasCorrect).length / state.numberHistory.length) * 100
                                : 0
                        }}
                        customFeedback={
                            <div className="mt-6">
                                <h3 className="text-lg font-medium mb-3">Statistics</h3>
                                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Level Reached</p>
                                            <p className="text-xl font-bold">{state.level}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Average Response Time</p>
                                            <p className="text-xl font-bold">
                                                {state.numberHistory.length > 0
                                                    ? (state.numberHistory.reduce((sum, item) => sum + item.responseTime, 0) /
                                                        state.numberHistory.length / 1000).toFixed(2)
                                                    : "0.00"}s
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Hints Used</p>
                                            <p className="text-xl font-bold">{state.hintsUsed}</p>
                                        </div>
                                    </div>
                                </div>

                                {state.numberHistory.filter(h => !h.wasCorrect).length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-2">Numbers to review:</h4>
                                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                            <div className="grid grid-cols-2 gap-2">
                                                {state.numberHistory.filter(h => !h.wasCorrect).slice(0, 6).map((entry, index) => (
                                                    <div
                                                        key={index}
                                                        className="border border-gray-200 p-2 rounded"
                                                    >
                                                        <div className="font-medium">{entry.number}</div>
                                                        <div className="text-sm text-gray-600">{entry.correctAnswer}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                        onPlayAgain={handlePlayAgain}
                    />
                )}
            </AnimatePresence>
        </GameWrapper>
    );
};

export default NumberRace;
