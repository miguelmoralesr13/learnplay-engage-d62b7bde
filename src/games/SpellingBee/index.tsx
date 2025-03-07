import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpellingGame } from './hooks/useSpellingGame';
import AudioPlayer from './components/AudioPlayer';
import SpellingInput from './components/SpellingInput';
import HintDisplay from './components/HintDisplay';
import ResultFeedback from './components/ResultFeedback';
import GameWrapper from '@/components/game/GameWrapper';
import InstructionsPanel from '@/components/game/InstructionsPanel';
import FeedbackDisplay from '@/components/game/FeedbackDisplay';
import { HintLevel, SpellingBeeParameters, SpellingCategory } from './types';
import SpellingBeeGameConfig from './config';
import { DifficultyLevel } from '@/types/game';

// Importar el sistema de formularios dinámicos
import { ParameterFormFactory } from '@/games/factories/ParameterFormFactory';
import ParametersForm from '@/components/game/ParametersForm';

// 1. Importar el ícono RefreshCw
import { RefreshCw } from 'lucide-react';

type GameStage = 'parameters' | 'instructions' | 'playing' | 'feedback';

const SpellingBee = () => {
    // Estado para el flujo del juego
    const [gameStage, setGameStage] = useState<GameStage>('parameters');
    const [parameters, setParameters] = useState<SpellingBeeParameters>(
        SpellingBeeGameConfig.parameters as SpellingBeeParameters
    );

    // Hook personalizado para la lógica del juego
    const {
        gameState,
        startGame,
        handleInputChange,
        checkAnswer,
        nextWord,
        requestHint,
        playWordAudio,
        getCurrentHint,
        endGame,
        retryWord
    } = useSpellingGame(parameters);

    // Manejador para el envío del formulario dinámico
    const handleFormSubmit = (formValues: any) => {
        // Convertir los valores del formulario al formato SpellingBeeParameters
        const newParams: SpellingBeeParameters = {
            wordsPerRound: formValues.wordsPerRound || 10,
            useHints: formValues.useHints !== undefined ? formValues.useHints : true,
            showDefinition: formValues.showDefinition !== undefined ? formValues.showDefinition : true,
            maxAttempts: formValues.maxAttempts || 3,
            categories: formValues.categories || ['commonWords']
        };

        setParameters(newParams);
        setGameStage('instructions');
    };

    // Manejadores para las transiciones entre etapas
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
        gameState.gameStatus === 'completed'
    ) {
        handleGameComplete();
    }

    // Manejar el reintento de palabra
    const handleRetry = () => {
        retryWord();
    };

    // Listas de todas las categorías disponibles



    return (
        <GameWrapper title="Spelling Bee">
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
                            gameConfig={SpellingBeeGameConfig}
                            onSubmit={handleFormSubmit}
                        />
                    </motion.div>
                )}

                {gameStage === 'instructions' && (
                    <InstructionsPanel
                        key="instructions"
                        instructions={SpellingBeeGameConfig.instructions}
                        onComplete={handleInstructionsComplete}
                    />
                )}

                {gameStage === 'playing' && (
                    <motion.div
                        key="playing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full"
                    >
                        {gameState.gameStatus === 'playing' ? (
                            <div className="flex flex-col items-center">
                                <div className="mb-8">
                                    <div className="text-sm text-center text-gray-500 mb-2">
                                        Palabra {gameState.currentWordIndex + 1} de {gameState.words.length}
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <AudioPlayer
                                            word={gameState.currentWord}
                                            disabled={gameState.gameStatus !== 'playing'}
                                        />

                                        {gameState.currentWord?.definition && parameters.showDefinition && (
                                            <div className="mt-4 mb-2 max-w-md text-center">
                                                <div className="text-xs text-gray-500 mb-1">Definición:</div>
                                                <div className="text-gray-700">{gameState.currentWord.definition}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <SpellingInput
                                    value={gameState.userInput}
                                    onChange={handleInputChange}
                                    onSubmit={checkAnswer}
                                    disabled={false}
                                    isCorrect={gameState.isCorrect}
                                />

                                {parameters.useHints && (
                                    <HintDisplay
                                        hintText={getCurrentHint()}
                                        onRequestHint={requestHint}
                                        currentHintLevel={gameState.hints}
                                        disabled={false}
                                    />
                                )}

                                <div className="w-full max-w-md mx-auto mt-6">
                                    <div className="flex justify-between items-center text-sm">
                                        <div>Intentos: {gameState.attempts}/{parameters.maxAttempts}</div>
                                        <div>Puntuación: {gameState.score}</div>
                                    </div>
                                </div>

                                {/* Añadir al final de la sección pero dentro del contenedor principal */}
                                <div className="mt-8 border-t pt-4 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm text-green-600">
                                            Correctas: {gameState.correctWords.length}
                                        </div>
                                        <div className="text-sm text-red-600">
                                            Incorrectas: {gameState.incorrectWords.length}
                                        </div>
                                    </div>

                                    <button
                                        className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-muted-foreground hover:bg-secondary"
                                        onClick={() => {
                                            // Llamar a la función para terminar el juego
                                            endGame();
                                            // Cambiar a la pantalla de feedback/resultados
                                            setGameStage('feedback');
                                        }}
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        <span>Terminar juego</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            gameState.currentWord && (
                                <ResultFeedback
                                    word={gameState.currentWord}
                                    isCorrect={gameState.isCorrect === true}
                                    userInput={gameState.userInput}
                                    onNext={nextWord}
                                    onRetry={handleRetry}
                                    attemptsLeft={parameters.maxAttempts - gameState.attempts}
                                />
                            )
                        )}
                    </motion.div>
                )}

                {gameStage === 'feedback' && (
                    <FeedbackDisplay
                        key="feedback"
                        gameId="spelling-bee"
                        score={gameState.score}
                        maxScore={gameState.words.length * 100}
                        metrics={{
                            correct: gameState.metrics.correct,
                            incorrect: gameState.metrics.incorrect,
                            timeSpent: gameState.endTime
                                ? Math.round((gameState.endTime - gameState.startTime) / 1000)
                                : 0,
                            accuracy: gameState.metrics.correct + gameState.metrics.incorrect > 0
                                ? Math.round((gameState.metrics.correct / (gameState.metrics.correct + gameState.metrics.incorrect)) * 100)
                                : 0
                        }}
                        onPlayAgain={handlePlayAgain}
                        customFeedback={
                            <div className="mt-6">
                                <h3 className="text-lg font-medium mb-3">Estadísticas adicionales</h3>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <h4 className="text-base font-medium mb-2">Rendimiento</h4>
                                        <div className="bg-secondary p-3 rounded-lg space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Pistas usadas:</span>
                                                <span>{gameState.metrics.hintsUsed}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Intentos promedio:</span>
                                                <span>{gameState.metrics.averageAttempts.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {gameState.metrics.commonMistakes.length > 0 && (
                                        <div>
                                            <h4 className="text-base font-medium mb-2">Errores comunes</h4>
                                            <div className="bg-secondary p-3 rounded-lg">
                                                <ul className="divide-y divide-gray-200">
                                                    {gameState.metrics.commonMistakes.slice(0, 3).map((mistake, index) => (
                                                        <li key={index} className="py-2 first:pt-0 last:pb-0">
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">{mistake.word}</span>
                                                                <span className="text-red-500">{mistake.typed}</span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                    />
                )}
            </AnimatePresence>
        </GameWrapper>
    );
};

export default SpellingBee; 