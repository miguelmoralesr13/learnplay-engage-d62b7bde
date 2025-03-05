import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSentenceGame } from './hooks/useSentenceGame';
import WordBlock from './components/WordBlock';
import SentenceZone from './components/SentenceZone';
import GrammarHint from './components/GrammarHint';
import ParametersForm from '@/components/game/ParametersForm';
import InstructionsPanel from '@/components/game/InstructionsPanel';
import FeedbackDisplay from '@/components/game/FeedbackDisplay';
import { Timer, Lightbulb, Check, ArrowRight } from 'lucide-react';
import SentenceBuilderGameConfig from './config';
import { DifficultyLevel } from '@/types/game';
import { SentenceBuilderParameters, Word } from './types';
import GameWrapper from '@/components/game/GameWrapper';

type GameStage = 'parameters' | 'instructions' | 'playing' | 'feedback';

const SentenceBuilder = () => {
    // Estado para el flujo del juego
    const [gameStage, setGameStage] = useState<GameStage>('parameters');
    const [parameters, setParameters] = useState<SentenceBuilderParameters>(
        SentenceBuilderGameConfig.parameters as SentenceBuilderParameters
    );

    // Hook personalizado para la lógica del juego
    const {
        gameState,
        startGame,
        addWordToSentence,
        removeWordFromSentence,
        moveWord,
        toggleHint,
        checkSentence,
        nextSentence,
        endGame,
        getAvailableWords,
        getCurrentSentenceText,
        getCorrectSentenceText,
        formatTime,
        isGameCompleted,
        getProgress,
        restartCurrentSentence
    } = useSentenceGame(parameters);

    // Manejadores para las transiciones entre etapas
    const handleParametersSubmit = (params: SentenceBuilderParameters) => {

        // Asegurar que los parámetros tienen la estructura esperada
        const updatedParams = {
            ...params,
        };

        setParameters(updatedParams);
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
    if (gameStage === 'playing' && (isGameCompleted || gameState.timeLeft <= 0 && parameters.timeLimit > 0)) {
        handleGameComplete();
    }

    // Obtener palabras disponibles para colocar
    const availableWords = getAvailableWords();

    // Mapear palabras en orden actual a objetos Word
    const sentenceWords: Word[] = gameState.wordOrder.map(wordId => {
        const word = gameState.currentSentence?.words.find(w => w.id === wordId);
        return word as Word; // Casting seguro porque sabemos que estos IDs existen
    });

    // Calcular progreso
    const progress = getProgress();

    // Obtener traducción de la oración actual
    const translation = gameState.currentSentence?.translations.es || '';

    // Agrega un log para ver si hay datos disponibles
    console.log("Estado del juego:", gameState);
    console.log("Palabras disponibles:", availableWords);
    console.log("Palabras en la oración:", sentenceWords);

    return (
        <GameWrapper title="Sentence Builder">
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
                            gameConfig={SentenceBuilderGameConfig}
                            onSubmit={handleParametersSubmit}
                        />
                    </motion.div>
                )}

                {gameStage === 'instructions' && (
                    <InstructionsPanel
                        key="instructions"
                        instructions={SentenceBuilderGameConfig.instructions}
                        onComplete={handleInstructionsComplete}
                    />
                )}

                {gameStage === 'playing' && (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-4xl mx-auto"
                    >
                        {/* Encabezado y progreso */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium">
                                    Oración {gameState.currentSentenceIndex + 1} / {gameState.sentences.length}
                                </span>

                                {parameters.timeLimit > 0 && (
                                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                                        <Timer className="w-4 h-4 text-purple" />
                                        <span className="text-sm font-medium">{formatTime(gameState.timeLeft)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={toggleHint}
                                    className={`p-2 rounded-full ${gameState.showHint ? 'bg-blue-100' : 'bg-gray-100 hover:bg-blue-50'}`}
                                    aria-label="Mostrar pista"
                                >
                                    <Lightbulb className="w-5 h-5 text-blue-600" />
                                </button>
                            </div>
                        </div>

                        {/* Barra de progreso */}
                        <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
                            <div
                                className="h-full bg-purple rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {/* Zona de construcción de oraciones */}
                        <SentenceZone
                            words={sentenceWords}
                            onRemoveWord={removeWordFromSentence}
                            isCorrect={gameState.isCorrect}
                        />

                        {/* Feedback de respuesta */}
                        {gameState.isCorrect === false && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                                <p className="text-red-700 mb-1">Tu oración no es correcta.</p>
                                <p className="text-sm text-red-600">Intenta reorganizar las palabras o usa la pista.</p>
                            </div>
                        )}

                        {gameState.isCorrect === true && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
                                <p className="text-green-700">¡Correcto! Has formado la oración correctamente.</p>
                                <p className="text-sm text-green-600">Oración: "{getCorrectSentenceText()}"</p>
                            </div>
                        )}

                        {/* Pistas y traducción */}
                        <GrammarHint
                            sentence={gameState.currentSentence}
                            showHint={gameState.showHint}
                            translation={translation}
                        />

                        {/* Palabras disponibles */}
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-500 mb-3">Palabras disponibles:</h3>
                            <div className="flex flex-wrap gap-2">
                                {availableWords.map((word) => (
                                    <WordBlock
                                        key={word.id}
                                        word={word}
                                        onClick={() => addWordToSentence(word.id)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="mt-8 flex justify-between">
                            {gameState.isCorrect === null && gameState.wordOrder.length > 0 && (
                                <button
                                    onClick={checkSentence}
                                    className="flex items-center gap-2 bg-purple text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                                >
                                    <Check className="w-5 h-5" />
                                    Comprobar
                                </button>
                            )}

                            {gameState.isCorrect === true && (
                                <button
                                    onClick={nextSentence}
                                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors ml-auto"
                                >
                                    Siguiente
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            )}

                            {gameState.isCorrect === false && (
                                <button
                                    onClick={() => {
                                        // Reiniciar la oración actual usando las funciones del hook
                                        // Opción 1: Si existe una función para reiniciar en el hook
                                        restartCurrentSentence();

                                        // Opción 2: Si no existe, podemos usar una combinación de funciones existentes
                                        // Como resetear el wordOrder y el estado de corrección
                                    }}
                                    className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                                >
                                    Reintentar
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {gameStage === 'feedback' && (
                    <FeedbackDisplay
                        key="feedback"
                        gameId="sentence-builder"
                        score={gameState.score}
                        maxScore={gameState.sentences.length * 100}
                        metrics={gameState.metrics}
                        onPlayAgain={handlePlayAgain}
                    />
                )}
            </AnimatePresence>
        </GameWrapper>
    );
};

export default SentenceBuilder; 