import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWordMatchGame } from './hooks/useWordMatchGame';
import WordGrid from './components/WordGrid';
import { Timer, RefreshCw } from 'lucide-react';
import WordMatchGameConfig from './config';
import { DifficultyLevel } from '@/types/game';
import { WordMatchParameters } from './types';
import GameWrapper from '@/components/game/GameWrapper';
import ParametersForm from '@/components/game/ParametersForm';
import InstructionsPanel from '@/components/game/InstructionsPanel';
import FeedbackDisplay from '@/components/game/FeedbackDisplay';

type GameStage = 'parameters' | 'instructions' | 'playing' | 'feedback';

const WordMatchGame = () => {
    // Estado para el flujo del juego
    const [gameStage, setGameStage] = useState<GameStage>('parameters');
    const [difficulty, setDifficulty] = useState<DifficultyLevel>(WordMatchGameConfig.difficulty);
    const [parameters, setParameters] = useState<WordMatchParameters>(
        WordMatchGameConfig.parameters as WordMatchParameters
    );

    // Hook personalizado para la lógica del juego
    const {
        gameState,
        startGame,
        selectWord,
        selectTranslation,
        endGame,
        calculateScore,
        formatTime,
        isGameCompleted
    } = useWordMatchGame(difficulty, parameters);

    // Manejadores para las transiciones entre etapas
    const handleParametersSubmit = (difficulty: DifficultyLevel, params: WordMatchParameters) => {
        setDifficulty(difficulty);
        setParameters(params);
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
    if (gameStage === 'playing' && (isGameCompleted || gameState.timeLeft <= 0)) {
        handleGameComplete();
    }

    return (
        <GameWrapper title="Word Match">
            <AnimatePresence mode="wait">
                {gameStage === 'parameters' && (
                    <ParametersForm
                        key="parameters"
                        gameConfig={WordMatchGameConfig}
                        onSubmit={handleParametersSubmit}
                    />
                )}

                {gameStage === 'instructions' && (
                    <InstructionsPanel
                        key="instructions"
                        instructions={WordMatchGameConfig.instructions}
                        onComplete={handleInstructionsComplete}
                    />
                )}

                {gameStage === 'playing' && (
                    <motion.div
                        key="playing"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="glass-card rounded-2xl p-6 w-full"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Word Match</h2>

                            {parameters.timerEnabled && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
                                    <Timer className="w-4 h-4 text-purple" />
                                    <span className="font-medium">{formatTime(gameState.timeLeft)}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 mb-8">
                            <WordGrid
                                words={gameState.words}
                                selectedIndex={gameState.selectedWord}
                                matchedPairs={gameState.matchedPairs}
                                onSelect={selectWord}
                                label="English"
                            />

                            <WordGrid
                                words={gameState.translations}
                                selectedIndex={gameState.selectedTranslation}
                                matchedPairs={gameState.matchedPairs}
                                onSelect={selectTranslation}
                                label="Español"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                                Parejas: {gameState.matchedPairs.length / 2} / {gameState.words.length / 2}
                            </div>

                            <button
                                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-muted-foreground hover:bg-secondary"
                                onClick={handleGameComplete}
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
                        gameId="word-match"
                        score={calculateScore()}
                        maxScore={gameState.words.length / 2 * 100}
                        metrics={gameState.metrics}
                        onPlayAgain={handlePlayAgain}
                    />
                )}
            </AnimatePresence>
        </GameWrapper>
    );
};

export default WordMatchGame; 