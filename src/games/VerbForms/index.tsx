import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVerbFormsGame } from './hooks/useVerbFormsGame';
import TenseSelector from './components/TenseSelector';
import VerbInput from './components/VerbInput';
import ExampleDisplay from './components/ExampleDisplay';
import GameWrapper from '@/components/game/GameWrapper';
import ParametersForm from '@/components/game/ParametersForm';
import InstructionsPanel from '@/components/game/InstructionsPanel';
import FeedbackDisplay from '@/components/game/FeedbackDisplay';
import { Timer, RefreshCw } from 'lucide-react';
import VerbFormsGameConfig from './config';
import { DifficultyLevel } from '@/types/game';
import { VerbFormsParameters, VerbTense } from './types';
import { ParameterFormFactory } from '@/games/factories/ParameterFormFactory';

type GameStage = 'parameters' | 'instructions' | 'playing' | 'feedback';

const VerbFormsGame = () => {
    // Estado para el flujo del juego
    const [gameStage, setGameStage] = useState<GameStage>('parameters');
    const [parameters, setParameters] = useState<VerbFormsParameters>(
        VerbFormsGameConfig.parameters as VerbFormsParameters
    );



    // Hook personalizado para la lógica del juego
    const {
        gameState,
        startGame,
        handleInputChange,
        handleTenseChange,
        checkAnswer,
        nextVerb,
        endGame,
        calculateScore,
        formatTime,
        getCurrentVerb,
        isGameCompleted
    } = useVerbFormsGame(parameters);

    // Manejador para el envío del formulario dinámico
    const handleFormSubmit = (formValues: VerbFormsParameters) => {
        // Convertir los valores del formulario al formato VerbFormsParameters
        const newParams: VerbFormsParameters = {
            difficulty: formValues.difficulty,
            includeRegular: formValues.includeRegular !== undefined ? formValues.includeRegular : true,
            includeIrregular: formValues.includeIrregular !== undefined ? formValues.includeIrregular : true,
            verbCount: formValues.verbCount || 10,
            tenses: formValues.tenses || [{ label: 'Past', value: 'past' }, { label: 'Past Participle', value: 'pastParticiple' }],
            timeLimit: formValues.timerEnabled ? (formValues.timeLimit || 180) : 0,
            timerEnabled: formValues.timerEnabled !== undefined ? formValues.timerEnabled : true
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
    if (gameStage === 'playing' && (isGameCompleted || gameState.timeLeft <= 0 && parameters.timeLimit > 0)) {
        handleGameComplete();
    }

    const currentVerb = getCurrentVerb();
    const progress = Math.round((gameState.currentVerbIndex / gameState.verbs.length) * 100);

    return (
        <GameWrapper title="Verb Forms Master">
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
                            <h2 className="text-2xl font-bold mb-4">Configuración del juego</h2>
                            <p className="text-gray-600">
                                Personaliza tu experiencia de Verb Forms ajustando estas opciones.
                            </p>
                        </div>

                        <ParametersForm
                            gameConfig={VerbFormsGameConfig}
                            onSubmit={handleFormSubmit}
                        />
                    </motion.div>
                )}

                {gameStage === 'instructions' && (
                    <InstructionsPanel
                        key="instructions"
                        instructions={VerbFormsGameConfig.instructions}
                        onComplete={handleInstructionsComplete}
                    />
                )}

                {gameStage === 'playing' && (
                    <motion.div
                        key="playing"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-4xl mx-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Verb Forms Master</h2>

                            <div className="flex items-center gap-4">
                                {parameters.timeLimit > 0 && (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
                                        <Timer className="w-4 h-4 text-purple" />
                                        <span className="font-medium">{formatTime(gameState.timeLeft)}</span>
                                    </div>
                                )}

                                <div className="text-sm">
                                    Verbo: {gameState.currentVerbIndex + 1} / {gameState.verbs.length}
                                </div>
                            </div>
                        </div>

                        {/* Barra de progreso */}
                        <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
                            <div
                                className="h-full bg-purple rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <TenseSelector
                            tenses={parameters.tenses}
                            selectedTense={gameState.selectedTense}
                            onTenseChange={handleTenseChange}
                            disabled={gameState.isCorrect === true}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <VerbInput
                                verb={currentVerb}
                                tense={gameState.selectedTense}
                                userInput={gameState.userInput}
                                isCorrect={gameState.isCorrect}
                                onInputChange={handleInputChange}
                                onSubmit={checkAnswer}
                                disabled={gameState.isCorrect === true}
                            />

                            <ExampleDisplay
                                verb={currentVerb}
                                tense={gameState.selectedTense}
                            />
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-green-600">
                                    Correctas: {gameState.correctAnswers}
                                </div>
                                <div className="text-sm text-red-600">
                                    Errores: {gameState.mistakes}
                                </div>
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
                        gameId="verb-forms"
                        score={calculateScore()}
                        maxScore={gameState.verbs.length * 100}
                        metrics={gameState.metrics}
                        onPlayAgain={handlePlayAgain}
                    />
                )}
            </AnimatePresence>
        </GameWrapper>
    );
};

export default VerbFormsGame; 