import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimonSaysConfig } from './config';
import { useSimonSays, GameStage } from './hooks/useSimonSays';
import CommandDisplay from './components/CommandDisplay';
import BodyDisplay from './components/BodyDisplay';
import GameWrapper from '../../components/game/GameWrapper';
import InstructionsPanel from '../../components/game/InstructionsPanel';
import FeedbackDisplay from '../../components/game/FeedbackDisplay';
import ParametersForm from '../../components/game/ParametersForm';
import Timer from '../../components/ui/Timer';
import ProgressBar from './components/ProgressBar';
import { useSoundEffects } from './hooks/useSoundEffects';
import { SimonSaysGameParams } from './types';
import { RefreshCw } from 'lucide-react';

const SimonSaysGame: React.FC = () => {
    const [highlightedPart, setHighlightedPart] = useState<string | null>(null);
    const [correctPart, setCorrectPart] = useState<string | null>(null);
    const [incorrectPart, setIncorrectPart] = useState<string | null>(null);

    const {
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
    } = useSimonSays(SimonSaysConfig.parameters as SimonSaysGameParams);

    const { playCorrect, playIncorrect, playComplete } = useSoundEffects();

    // Manejar la respuesta del usuario
    const handlePartClick = (partId: string) => {
        if (state.gameStatus !== 'playing') return;

        const isCorrect = handleAnswer(partId);

        if (isCorrect) {
            setCorrectPart(partId);
            playCorrect();
            setTimeout(() => setCorrectPart(null), 1500);
        } else {
            setIncorrectPart(partId);
            playIncorrect();
            setTimeout(() => setIncorrectPart(null), 1500);
        }
    };

    // Añadir un efecto para cuando completa el juego
    useEffect(() => {
        if (gameStage === 'feedback') {
            playComplete();
        }
    }, [gameStage, playComplete]);

    // Contenido principal del juego
    return (
        <GameWrapper title="Simon Says - Body Edition">
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
                            gameConfig={SimonSaysConfig}
                            onSubmit={(values) => {
                                initGame(
                                    values.difficulty,
                                    values.useAudio,
                                    values.showTranslation,
                                    values.useTimer ? parseInt(values.timeLimit) : 0
                                );
                                setGameStage('instructions');
                            }}
                        />
                    </motion.div>
                )}

                {gameStage === 'instructions' && (
                    <motion.div
                        key="instructions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full"
                    >
                        <InstructionsPanel
                            instructions={SimonSaysConfig.instructions}
                            onComplete={startGame}
                        />
                    </motion.div>
                )}

                {gameStage === 'playing' && (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="font-semibold text-lg">
                                Puntuación: {state.score}
                            </div>
                            {state.timeRemaining !== undefined && state.timeRemaining > 0 && (
                                <Timer
                                    seconds={state.timeRemaining}
                                    variant={state.timeRemaining < 10 ? "warning" : "default"}
                                />
                            )}
                        </div>

                        <ProgressBar current={state.currentRound} total={state.totalRounds} />

                        {state.commands.length > 0 && (
                            <CommandDisplay
                                command={state.commands[state.currentCommandIndex]?.text || ''}
                                translation={state.commands[state.currentCommandIndex]?.translation}
                                showTranslation={state.showTranslation}
                                useAudio={state.useAudio}
                                currentRound={state.currentRound}
                                totalRounds={state.totalRounds}
                            />
                        )}

                        <BodyDisplay
                            onPartClick={handlePartClick}
                            highlightedPart={highlightedPart}
                            correctPart={correctPart}
                            incorrectPart={incorrectPart}
                            showLabels={false}
                        />

                        {/* Mensaje de feedback visual */}
                        {feedbackMessage && (
                            <div className={`mt-4 p-3 text-center rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {feedbackMessage}
                            </div>
                        )}

                        {/* Añadir la sección de estadísticas y botón de terminar al final */}
                        <div className="flex justify-between items-center mt-6">
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-green-600">
                                    Correctas: {state.correctAnswers}
                                </div>
                                <div className="text-sm text-red-600">
                                    Incorrectas: {state.incorrectAnswers}
                                </div>
                            </div>

                            <button
                                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-muted-foreground hover:bg-secondary"
                                onClick={() => {
                                    state.completeGame();
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
                    <motion.div
                        key="feedback"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full"
                    >
                        <FeedbackDisplay
                            gameId={SimonSaysConfig.id}
                            score={state.score}
                            maxScore={state.totalRounds * 10}
                            metrics={{
                                correct: getMetrics().correctAnswers,
                                incorrect: getMetrics().incorrectAnswers,
                                timeSpent: getMetrics().timeSpent,
                                accuracy: getMetrics().accuracy
                            }}
                            onPlayAgain={resetGame}
                        />

                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold text-primary">¡Juego completado!</h2>
                            <p className="text-gray-600 mt-2">
                                Has completado {getMetrics().correctAnswers} de {state.totalRounds} comandos correctamente.
                            </p>

                            {getMetrics().accuracy >= 80 ? (
                                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
                                    ¡Excelente trabajo! Tienes un gran conocimiento de las partes del cuerpo en inglés.
                                </div>
                            ) : getMetrics().accuracy >= 50 ? (
                                <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-md">
                                    Buen trabajo. Sigue practicando para mejorar tu vocabulario del cuerpo humano.
                                </div>
                            ) : (
                                <div className="mt-4 p-3 bg-amber-100 text-amber-800 rounded-md">
                                    Sigue practicando. Recuerda prestar atención a las instrucciones en inglés.
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GameWrapper>
    );
};

export default SimonSaysGame; 