import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, RefreshCw } from 'lucide-react';
import WordMatchGameConfig from './config';
import { WordMatchParameters } from './types';
import GameWrapper from '@/components/game/GameWrapper';
import ParametersForm from '@/components/game/ParametersForm';
import InstructionsPanel from '@/components/game/InstructionsPanel';
import FeedbackDisplay from '@/components/game/FeedbackDisplay';
import WordGrid from './components/WordGrid';
import { useWordMatchStore } from './store';

// Añadir tipos para las props de los componentes
interface GameStageProps {
    stage: string;
    onComplete: () => void;
    onPlayAgain: () => void;
}

interface GameBoardProps {
    onEndGame: () => void;
}

// Componente para la fase del juego - Principio SRP
const GameStage = ({ stage, onComplete, onPlayAgain }: GameStageProps) => {
    const {
        startGame,
        selectCard,
        endGame,
        calculateScore,
        formatTime,
        isGameCompleted,
        words,
        translations,
        selectedCards,
        matchedPairs,
        timeLeft,
        metrics,
        incorrectAttempts
    } = useWordMatchStore();

    // Verificar finalización del juego
    useEffect(() => {
        if (stage === 'playing' && (isGameCompleted() || timeLeft <= 0)) {
            endGame();
            onComplete();
        }
    }, [stage, isGameCompleted, timeLeft, endGame, onComplete]);

    switch (stage) {
        case 'parameters':
            return (
                <ParametersForm
                    gameConfig={WordMatchGameConfig}
                    onSubmit={(params) => {
                        startGame(params);
                        onComplete();
                    }}
                />
            );

        case 'instructions':
            return (
                <InstructionsPanel
                    instructions={WordMatchGameConfig.instructions}
                    onComplete={onComplete}
                />
            );

        case 'playing':
            return (
                <GameBoard
                    onEndGame={() => {
                        endGame();
                        onComplete();
                    }}
                />
            );

        case 'feedback':
            return (
                <FeedbackDisplay
                    gameId="word-match"
                    score={calculateScore()}
                    maxScore={words.length * 100}
                    metrics={{
                        correct: matchedPairs.length / 2,
                        incorrect: metrics.incorrect,
                        timeSpent: metrics.timeSpent,
                        accuracy: matchedPairs.length > 0
                            ? Math.round((metrics.correct / (metrics.correct + metrics.incorrect)) * 100)
                            : 0
                    }}
                    customMetrics={[
                        {
                            label: 'Tiempo de juego',
                            value: `${Math.floor(metrics.timeSpent / 60)}m ${metrics.timeSpent % 60}s`
                        },
                        {
                            label: 'Intentos incorrectos',
                            value: incorrectAttempts.toString()
                        },
                        {
                            label: 'Parejas encontradas',
                            value: `${matchedPairs.length / 2} / ${words.length}`
                        }
                    ]}
                    onPlayAgain={onPlayAgain}
                />
            );

        default:
            return null;
    }
};

// Componente tablero del juego - Principio SRP
const GameBoard = ({ onEndGame }: GameBoardProps) => {
    const {
        words,
        translations,
        selectedCards,
        matchedPairs,
        selectCard,
        formatTime,
        timeLeft,
        parameters
    } = useWordMatchStore();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-2xl p-6 w-full"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Word Match</h2>

                {parameters?.timerEnabled && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
                        <Timer className="w-4 h-4 text-purple" />
                        <span className="font-medium">{formatTime(timeLeft)}</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <WordGrid
                    words={words}
                    selectedCards={selectedCards}
                    matchedPairs={matchedPairs}
                    onSelect={selectCard}
                    label="English"
                    isTranslation={false}
                />

                <WordGrid
                    words={translations}
                    selectedCards={selectedCards}
                    matchedPairs={matchedPairs}
                    onSelect={selectCard}
                    label="Español"
                    isTranslation={true}
                />
            </div>

            <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    Parejas: {matchedPairs.length / 2} / {words.length / 2}
                </div>

                <button
                    className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-muted-foreground hover:bg-secondary"
                    onClick={onEndGame}
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Terminar juego</span>
                </button>
            </div>
        </motion.div>
    );
};

// Componente principal - Control de flujo
const WordMatchGame = () => {
    const [gameStage, setGameStage] = useState('parameters');

    const handleStageComplete = () => {
        switch (gameStage) {
            case 'parameters':
                setGameStage('instructions');
                break;
            case 'instructions':
                setGameStage('playing');
                break;
            case 'playing':
                setGameStage('feedback');
                break;
        }
    };

    const handlePlayAgain = () => {
        setGameStage('parameters');
    };

    useEffect(() => {
        const store = useWordMatchStore.getState();

        return () => {
            if (store.timerId) {
                clearInterval(store.timerId);
            }
        };
    }, []);

    return (
        <GameWrapper title="Word Match">
            <AnimatePresence mode="wait">
                <GameStage
                    key={gameStage}
                    stage={gameStage}
                    onComplete={handleStageComplete}
                    onPlayAgain={handlePlayAgain}
                />
            </AnimatePresence>
        </GameWrapper>
    );
};

export default WordMatchGame; 