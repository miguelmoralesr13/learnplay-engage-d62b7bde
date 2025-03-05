import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DifficultyLevel } from '@/types/game';
import { ColorLevel, PaintDrawingParameters } from './types';
import GameWrapper from '@/components/game/GameWrapper';
import InstructionsPanel from '@/components/game/InstructionsPanel';
import ParametersForm from '@/components/game/ParametersForm';
import DrawingCanvas from '../../components/canvas/DrawingCanvas';
import DrawingInstructions from './components/DrawingInstructions';
import ColorLearningPanel from './components/ColorLearningPanel';
import ResultFeedback from './components/ResultFeedback';
import FeedbackDisplay from '@/components/game/FeedbackDisplay';
import PaintDrawingGameConfig from './config';
import { usePaintDrawingGame } from './hooks/usePaintDrawingGame';
import { gameMetadata } from './metadata';
import ColorPalette from './components/ColorPalette';
import { getColorsByLevel } from './utils/colorData';

type GameStage = 'parameters' | 'instructions' | 'playing' | 'feedback';

const PaintDrawingGame: React.FC = () => {
    // Estado para el flujo del juego
    const [gameStage, setGameStage] = useState<GameStage>('parameters');
    const [difficulty, setDifficulty] = useState<DifficultyLevel>(PaintDrawingGameConfig.difficulty);
    const [parameters, setParameters] = useState<PaintDrawingParameters>(
        PaintDrawingGameConfig.parameters as PaintDrawingParameters
    );

    // Hook para la lógica del juego
    const {
        gameState,
        startGame,
        startDrawingPhase,
        selectColor,
        registerColorUse,
        saveDrawing,
        checkDrawing,
        nextObject,
        endGame
    } = usePaintDrawingGame(difficulty, parameters);

    // Manejador para el envío del formulario dinámico
    const handleFormSubmit = (difficultyValue: DifficultyLevel, formValues: any) => {
        // Mapear colorPalette a colorLevel
        let colorLevel: ColorLevel = 'basic';
        if (formValues.colorPalette === 'intermediate') {
            colorLevel = 'intermediate';
        } else if (formValues.colorPalette === 'advanced') {
            colorLevel = 'advanced';
        }

        // Convertir los valores del formulario al formato PaintDrawingParameters
        const newParams: PaintDrawingParameters = {
            roundsCount: formValues.roundsCount || 3,
            timerEnabled: formValues.timerEnabled !== undefined ? formValues.timerEnabled : true,
            timePerRound: formValues.timerEnabled ? (formValues.timePerRound || 120) : 0,
            colorLevel: colorLevel, // Usar el valor mapeado desde colorPalette
            showColorNames: formValues.showColorNames !== undefined ? formValues.showColorNames : true,
            enableAudio: formValues.enableAudio !== undefined ? formValues.enableAudio : false,
            objectsPerRound: formValues.objectsPerRound || 1,
            timeLimit: formValues.timeLimit || 0
        };

        console.log("DEBUG - Parámetros configurados:", {
            original: formValues,
            processed: newParams,
            colorPalette: formValues.colorPalette,
            mappedToLevel: colorLevel
        });

        setDifficulty(difficultyValue);
        setParameters(newParams);
        setGameStage('instructions');
    };

    // Manejadores para las transiciones entre etapas
    const handleInstructionsComplete = () => {
        startLearningWithCorrectColors();
        setGameStage('playing');
    };

    const handleGameComplete = () => {
        setGameStage('feedback');
    };

    const handlePlayAgain = () => {
        setGameStage('parameters');
    };

    // Puntuación máxima posible (para FeedbackDisplay)
    const maxScore = parameters.roundsCount * 100;

    // Referencia al canvas
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Añadir este código en el componente principal
    const handleCheckDrawing = useCallback(() => {
        // Capturar el dibujo actual
        if (canvasRef.current) {
            const dataUrl = canvasRef.current.toDataURL('image/png');

            // Guardar el dibujo y verificar en el callback asegurando que se use el dibujo actual
            saveDrawing(dataUrl);

            // Verificar directamente pasando el dibujo actual
            checkDrawing(dataUrl);

            console.log("Dibujo guardado y verificado");
        } else {
            console.warn("No se pudo acceder al canvas para guardar el dibujo");
        }
    }, [saveDrawing, checkDrawing]);

    // Agregar un useEffect para monitorear cambios de estado
    useEffect(() => {
        console.log("Estado del juego:", {
            gameStatus: gameState.gameStatus,
            currentObject: gameState.currentObject?.name,
            currentObjectIndex: gameState.currentObjectIndex,
            totalObjects: gameState.objects.length,
            userDrawing: gameState.userDrawing ? "Disponible" : "No disponible"
        });
    }, [gameState]);

    // En el componente principal, añadir un efecto para depurar
    // Añadir este efecto para verificar el mapeo y los valores
    useEffect(() => {
        console.log("Parámetros actuales:", {
            colorLevel: parameters.colorLevel,
            colorsCount: gameState.colors?.length || 0,
            colorsNames: gameState.colors?.map(c => c.name) || []
        });
    }, [parameters, gameState.colors]);

    // Al iniciar la fase de aprendizaje, añadir mejores logs
    const startLearningWithCorrectColors = useCallback(() => {
        console.log("DEBUG - Iniciando fase de aprendizaje con colores correctos");

        // Obtener colores según el nivel
        const levelColors = getColorsByLevel(parameters.colorLevel || 'basic');

        // Limitar el número de colores según el nivel
        const maxColors = parameters.colorLevel === 'advanced' ? 14 :
            parameters.colorLevel === 'intermediate' ? 8 : 4;

        const limitedColors = levelColors.slice(0, maxColors);

        console.log("DEBUG - Colores seleccionados para aprendizaje:", {
            level: parameters.colorLevel,
            allColorsCount: levelColors.length,
            limitedColorsCount: limitedColors.length,
            limitedColorNames: limitedColors.map(c => c.name)
        });

        // Llamar a startGame con los colores limitados
        startGame(limitedColors);
    }, [parameters.colorLevel, startGame]);

    // Renderizado principal
    return (
        <GameWrapper
            title="Paint Drawing Game"
        >
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
                                Customize your Paint Drawing experience by adjusting these options.
                            </p>
                        </div>

                        <ParametersForm
                            gameConfig={PaintDrawingGameConfig}
                            onSubmit={handleFormSubmit}
                        />
                    </motion.div>
                )}

                {gameStage === 'instructions' && (
                    <motion.div
                        key="instructions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <InstructionsPanel
                            instructions={PaintDrawingGameConfig.instructions}
                            onComplete={handleInstructionsComplete}
                        />
                    </motion.div>
                )}

                {gameStage === 'playing' && (
                    <motion.div
                        key="playing"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        {!gameState.gameStatus || !gameState.colors || gameState.colors.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-xl">Cargando juego...</p>
                            </div>
                        ) : (
                            <>
                                {gameState.gameStatus === 'learning' && (
                                    <ColorLearningPanel
                                        colors={gameState.colors}
                                        onContinue={startDrawingPhase}
                                        colorLevel={parameters.colorLevel}
                                    />
                                )}

                                {gameState.gameStatus === 'drawing' && gameState.currentObject && (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-1">
                                            <ColorPalette
                                                colors={gameState.colors}
                                                selectedColor={gameState.selectedColor}
                                                onSelectColor={selectColor}
                                                showNames={parameters.showColorNames}
                                                enableAudio={parameters.enableAudio}
                                            />
                                        </div>

                                        <div className="lg:col-span-2">
                                            <DrawingInstructions
                                                object={gameState.currentObject}
                                                currentRound={Math.floor(gameState.currentObjectIndex / parameters.objectsPerRound) + 1}
                                                totalRounds={parameters.roundsCount}
                                                objectIndex={gameState.currentObjectIndex}
                                                objectsPerRound={parameters.objectsPerRound}
                                            />

                                            <DrawingCanvas
                                                ref={canvasRef}
                                                object={gameState.currentObject}
                                                selectedColor={gameState.selectedColor}
                                                onSave={saveDrawing}
                                                onColorUsed={registerColorUse}
                                                isDisabled={gameState.gameStatus !== 'drawing'}
                                            />

                                            <div className="mt-4 flex justify-end space-x-3">
                                                {parameters.objectsPerRound > 1 && (
                                                    <button
                                                        onClick={() => {
                                                            saveDrawing("");
                                                            nextObject();
                                                        }}
                                                        className="py-2 px-6 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400"
                                                    >
                                                        Saltar objeto
                                                    </button>
                                                )}
                                                <button
                                                    onClick={handleCheckDrawing}
                                                    className="py-2 px-6 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={!gameState.selectedColor}
                                                >
                                                    Comprobar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {gameState.gameStatus === 'feedback' && gameState.currentObject && (
                                    <ResultFeedback
                                        isCorrect={gameState.isCorrect || false}
                                        score={gameState.score}
                                        object={gameState.currentObject}
                                        userDrawing={gameState.userDrawing || '/placeholder-drawing.png'}
                                        usedColors={gameState.usedColors}
                                        onNext={nextObject}
                                    />
                                )}

                                {gameState.gameStatus === 'completed' && (
                                    <FeedbackDisplay
                                        gameId={gameMetadata.id}
                                        score={gameState.score}
                                        maxScore={maxScore}
                                        metrics={{
                                            correct: gameState.metrics.correctColorUses,
                                            incorrect: gameState.metrics.totalColorUses - gameState.metrics.correctColorUses,
                                            timeSpent: gameState.metrics.timeSpent
                                        }}
                                        customMetrics={[
                                            {
                                                label: 'Tiempo de juego',
                                                value: `${Math.round(gameState.metrics.timeSpent / 60)} min ${Math.round(gameState.metrics.timeSpent % 60)} seg`
                                            },
                                            {
                                                label: 'Precisión de colores',
                                                value: `${Math.round((gameState.metrics.correctColorUses / Math.max(1, gameState.metrics.totalColorUses)) * 100)}%`
                                            },
                                            {
                                                label: 'Dibujos completados',
                                                value: `${gameState.completedObjects.length} / ${gameState.objects.length}`
                                            }
                                        ]}
                                        onPlayAgain={handlePlayAgain}
                                    />
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Depuración</h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => console.log("Estado actual:", { gameState, parameters })}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                        >
                            Log Estado
                        </button>
                        <button
                            onClick={() => {
                                const colors = getColorsByLevel(parameters.colorLevel || 'basic');
                                console.log("Colores del nivel:", {
                                    level: parameters.colorLevel,
                                    colors: colors.map(c => c.name)
                                });
                            }}
                            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                        >
                            Test Colores
                        </button>
                    </div>
                </div>
            )}
        </GameWrapper>
    );
};

export default PaintDrawingGame;