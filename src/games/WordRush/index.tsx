import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWordRushGame } from './hooks/useWordRushGame';
import WordCard from './components/WordCard';
import TimerDisplay from './components/TimerDisplay';
import ComboIndicator from './components/ComboIndicator';
import GameWrapper from '@/components/game/GameWrapper';
import ParametersForm from '@/components/game/ParametersForm';
import InstructionsPanel from '@/components/game/InstructionsPanel';
import FeedbackDisplay from '@/components/game/FeedbackDisplay';
import { CloudLightning, Pause, Play, RotateCcw } from 'lucide-react';
import WordRushGameConfig from './config';
import { DifficultyLevel } from '@/types/game';
import { WordRushParameters, WordCategory } from './types';
import { categoryOptions } from './utils/wordData';

type GameStage = 'parameters' | 'instructions' | 'playing' | 'feedback';

const WordRush = () => {
    // Estado para el flujo del juego
    const [gameStage, setGameStage] = useState<GameStage>('parameters');
    const [parameters, setParameters] = useState<WordRushParameters>(
        WordRushGameConfig.parameters as WordRushParameters
    );

    // Hook personalizado para la lógica del juego
    const {
        gameState,
        startGame,
        checkAnswer,
        endGame,
        togglePause,
        formatTime,
        getTimePercentage,
        getProgressPercentage
    } = useWordRushGame(parameters);

    // Manejador de envío del formulario
    const handleParametersSubmit = (params: WordRushParameters) => {
        console.log(params);
        // Establecer los parámetros usando los valores del formulario Formik
        setParameters({
            timerEnabled: params.timerEnabled !== undefined ? params.timerEnabled : true,
            wordsPerRound: params.wordsPerRound || 10,
            timePerWord: params.timePerWord || 5,
            // Propiedades requeridas que faltan
            timeLimit: (params.timePerWord || 5) * (params.wordsPerRound || 10),
            categories: params.categories,
            showTranslation: true,
            timeBonusPerWord: 1,
            comboMultiplier: 0.5
        });
        console.log(parameters);
        console.log(params.categories);
        setGameStage('instructions');
    };

    const handleInstructionsComplete = () => {
        startGame();
        setGameStage('playing');
    };

    const handleGameComplete = () => {
        endGame();
        setGameStage('feedback');
    };

    const handlePlayAgain = () => {
        setGameStage('parameters');
    };

    // Comprobar si el juego ha terminado
    if (
        gameStage === 'playing' &&
        (gameState.gameStatus === 'completed' || gameState.timeLeft <= 0)
    ) {
        handleGameComplete();
    }

    // Calcular progreso
    const timePercentage = getTimePercentage();
    const progressPercentage = getProgressPercentage();

    return (
        <GameWrapper title="Word Rush">
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
                            gameConfig={WordRushGameConfig}
                            onSubmit={handleParametersSubmit}
                        />
                    </motion.div>
                )}

                {gameStage === 'instructions' && (
                    <InstructionsPanel
                        key="instructions"
                        instructions={WordRushGameConfig.instructions}
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
                                <div>
                                    <span className="text-sm text-gray-500">Tiempo restante:</span>
                                    <h3 className="text-xl font-bold">{formatTime(gameState.timeLeft)}</h3>
                                </div>

                                <div className="text-center">
                                    <span className="text-sm text-gray-500">Palabra</span>
                                    <h3 className="text-xl font-bold">
                                        {gameState.currentWordIndex + 1} / {gameState.words.length}
                                    </h3>
                                </div>

                                <div className="text-right">
                                    <span className="text-sm text-gray-500">Puntuación</span>
                                    <h3 className="text-xl font-bold">{gameState.score}</h3>
                                </div>
                            </div>

                            {/* Barra de tiempo */}
                            <TimerDisplay
                                timeLeft={gameState.timeLeft}
                                totalTime={parameters.timeLimit}
                                formattedTime={formatTime(gameState.timeLeft)}
                            />

                            {/* Barra de progreso */}
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-purple h-2.5 rounded-full"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>

                            {/* Categorías activas en el juego */}
                            <div className="mt-3 bg-gray-50 p-2 rounded-lg">
                                <div className="flex flex-wrap gap-2 items-center">
                                    <span className="text-xs font-medium text-gray-500">Categorías:</span>
                                    {parameters.categories.map(category => (
                                        <span
                                            key={category.value}
                                            className="text-xs px-2 py-0.5 bg-purple/10 text-purple rounded-full"
                                        >
                                            {category.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Indicador de Combo */}
                        {gameState.combo > 1 && (
                            <ComboIndicator
                                combo={gameState.combo}
                                multiplier={parameters.comboMultiplier}
                            />
                        )}

                        {/* Tarjeta de Palabra */}
                        {gameState.currentWord && (
                            <WordCard
                                word={gameState.currentWord}
                                showDefinition={!parameters.showTranslation}
                                categories={parameters.categories}
                            />
                        )}

                        {/* Opciones de Respuesta */}
                        <div className="mt-8 grid grid-cols-2 gap-3">
                            {gameState.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => checkAnswer(option)}
                                    className="bg-white border-2 border-gray-200 hover:border-purple
                           p-4 rounded-xl shadow-sm transition-colors
                           text-center font-medium"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        {/* Controles */}
                        <div className="mt-8 flex justify-center space-x-4">
                            <button
                                onClick={togglePause}
                                className="bg-gray-100 p-3 rounded-full text-gray-700 hover:bg-gray-200"
                            >
                                {gameState.gameStatus === 'playing' ? (
                                    <Pause className="w-5 h-5" />
                                ) : (
                                    <Play className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}

                {gameStage === 'feedback' && (
                    <FeedbackDisplay
                        key="feedback"
                        gameId="word-rush"
                        score={gameState.score}
                        maxScore={parameters.wordsPerRound * 200} // Puntuación máxima estimada
                        metrics={{
                            correct: gameState.metrics.correct,
                            incorrect: gameState.metrics.incorrect,
                            timeSpent: parameters.timeLimit - gameState.timeLeft,
                            accuracy: gameState.metrics.correct /
                                (gameState.metrics.correct + gameState.metrics.incorrect) * 100
                        }}
                        customFeedback={
                            <div className="mt-6">
                                <h3 className="text-lg font-medium mb-3">Estadísticas</h3>
                                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Racha máxima</p>
                                            <p className="text-xl font-bold">{gameState.maxCombo}x</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Tiempo de respuesta</p>
                                            <p className="text-xl font-bold">
                                                {gameState.metrics.averageResponseTime.toFixed(2)}s
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {gameState.wrongAnswers.length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-2">Palabras para repasar:</h4>
                                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                            <div className="grid grid-cols-2 gap-2">
                                                {gameState.wrongAnswers.slice(0, 6).map((word, index) => (
                                                    <div
                                                        key={index}
                                                        className="border border-gray-200 p-2 rounded"
                                                    >
                                                        <div className="font-medium">{word.text}</div>
                                                        <div className="text-sm text-gray-600">{word.translation}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            {gameState.wrongAnswers.length > 6 && (
                                                <p className="text-sm text-gray-500 mt-2 text-center">
                                                    Y {gameState.wrongAnswers.length - 6} más...
                                                </p>
                                            )}
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

export default WordRush; 