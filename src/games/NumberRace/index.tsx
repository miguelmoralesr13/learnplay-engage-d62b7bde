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
import { NumberRaceParameters } from './types';
import { DifficultyLevel } from '@/types/game';
import { Button } from '@/components/ui/button';
import HintDisplay from './components/HintDisplay';
import { RefreshCw } from 'lucide-react';

type GameStage = 'parameters' | 'instructions' | 'playing' | 'feedback';

const NumberRace = () => {
    // Estado para el flujo del juego
    const [gameStage, setGameStage] = useState<GameStage>('parameters');
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
        requestHint,
    } = useNumberRace(parameters);

    // Manejadores para las transiciones entre etapas
    const handleParametersSubmit = (params: NumberRaceParameters) => {

        // Conversion map para asegurar que usamos valores válidos


        // Establecer los parámetros usando los valores del formulario Formik
        setParameters({
            difficulty: params.difficulty,
            timeLimit: TIME_LIMITS[params.difficulty.value],
            maxNumber: NUMBER_RANGES[params.difficulty.value].max, // Usamos siempre el max según la dificultad
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

                        {/* Mostrar el botón de pausa solo si enableTimer está activado */}
                        {parameters.enableTimer && (
                            <div className="mt-8 flex justify-center space-x-4">
                                <Button
                                    variant="outline"
                                    onClick={state.gameStatus === 'playing' ? pauseGame : resumeGame}
                                >
                                    {state.gameStatus === 'playing' ? 'Pause' : 'Resume'}
                                </Button>
                            </div>
                        )}

                        <div className="mt-8 border-t pt-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-green-600">
                                    Correctas: {state.numberHistory.filter(h => h.wasCorrect).length}
                                </div>
                                <div className="text-sm text-red-600">
                                    Incorrectas: {state.numberHistory.filter(h => !h.wasCorrect).length}
                                </div>
                            </div>

                            <button
                                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-muted-foreground hover:bg-secondary"
                                onClick={() => {
                                    setGameStage('feedback');
                                }}
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Terminar juego</span>
                            </button>
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
