import { useState, useCallback, useEffect } from 'react';
import {
    PaintDrawingGameState,
    PaintDrawingParameters,
    ColorItem,
    DrawingObject
} from '../types';
import {
    getColorsByLevel,
    checkCorrectColors,
    verifyObjectsHaveRequiredColors
} from '../utils/colorData';
import { DifficultyLevel } from '@/types/game';
import { getObjectsByDifficulty } from '../utils/objectData';

// Colores de respaldo en caso de error
const FALLBACK_COLORS: ColorItem[] = [
    { name: 'Red', translation: 'Rojo', hexCode: '#FF0000', level: 'basic' },
    { name: 'Blue', translation: 'Azul', hexCode: '#0000FF', level: 'basic' },
    { name: 'Green', translation: 'Verde', hexCode: '#00FF00', level: 'basic' },
    { name: 'Yellow', translation: 'Amarillo', hexCode: '#FFFF00', level: 'basic' }
];

// Objeto de respaldo
const FALLBACK_OBJECT: DrawingObject = {
    id: 'fallback-1',
    name: 'Simple Drawing',
    translation: 'Dibujo Simple',
    description: 'Draw using the colors',
    requiredColors: ['Red', 'Blue'],
    difficulty: 'beginner'
};

export const usePaintDrawingGame = (
    difficulty: DifficultyLevel,
    parameters: PaintDrawingParameters
) => {
    // Estado del juego
    const [gameState, setGameState] = useState<PaintDrawingGameState>({
        colors: [],
        objects: [],
        currentObjectIndex: 0,
        currentObject: null,
        selectedColor: null,
        userDrawing: null,
        score: 0,
        gameStatus: 'idle',
        completedObjects: [],
        startTime: 0,
        endTime: null,
        isCorrect: null,
        usedColors: new Set<string>(),
        metrics: {
            correctColorUses: 0,
            totalColorUses: 0,
            timeSpent: 0,
            completionRate: 0
        }
    });

    // Iniciar el juego
    const startGame = useCallback((providedColors?: ColorItem[]) => {
        console.log("DEBUG - startGame llamado", {
            providedColorsExist: !!providedColors,
            providedColorsCount: providedColors?.length || 0,
            providedColorNames: providedColors?.map(c => c.name) || []
        });

        // If colors are provided, use them
        const colors = providedColors || getColorsByLevel(parameters.colorLevel || 'basic');

        // Mostrar colores que se usarán
        console.log("DEBUG - Colores que se usarán en el juego:", {
            usingProvided: !!providedColors,
            count: colors.length,
            colorNames: colors.map(c => c.name)
        });

        // Calcular el número total de objetos necesarios (rondas × objetos por ronda)
        const totalObjectsNeeded = parameters.roundsCount * parameters.objectsPerRound;

        // Obtener objetos según la dificultad y el nivel de color
        let gameObjects = getObjectsByDifficulty(
            difficulty,
            totalObjectsNeeded, // Ahora pedimos la cantidad total
            parameters.colorLevel || 'basic'
        );

        console.log("Objetos del juego:", {
            objectsPerRound: parameters.objectsPerRound,
            totalObjectsNeeded,
            obtainedCount: gameObjects.length,
            objects: gameObjects.map(obj => obj.name)
        });

        // Si no hay objetos, usar el fallback
        if (!gameObjects || gameObjects.length === 0) {
            console.warn("No se encontraron objetos, usando objeto de respaldo");
            gameObjects = [FALLBACK_OBJECT];
        }

        // Recopilar todos los colores necesarios
        const requiredColorNames = new Set<string>();
        gameObjects.forEach(obj => {
            if (obj.requiredColors) {
                obj.requiredColors.forEach(color => {
                    requiredColorNames.add(color);
                });
            }
        });

        // Obtener colores según el nivel configurado
        let allLevelColors = getColorsByLevel(parameters.colorLevel || 'basic');

        console.log("Colores disponibles para nivel:", {
            level: parameters.colorLevel,
            count: allLevelColors.length,
            colors: allLevelColors.map(c => c.name)
        });

        // Asegurar que tenemos el número correcto de colores según el nivel
        const maxColors = parameters.colorLevel === 'advanced' ? 14 :
            parameters.colorLevel === 'intermediate' ? 8 : 4;

        // Si tenemos más colores de los que corresponden al nivel, recortar
        if (allLevelColors.length > maxColors) {
            // Primero asegurar que incluimos todos los colores necesarios para los objetos
            const requiredColors = allLevelColors.filter(color =>
                requiredColorNames.has(color.name)
            );

            // Completar con otros colores hasta el máximo permitido
            if (requiredColors.length < maxColors) {
                const otherColors = allLevelColors
                    .filter(color => !requiredColorNames.has(color.name))
                    .slice(0, maxColors - requiredColors.length);

                allLevelColors = [...requiredColors, ...otherColors];
            } else {
                allLevelColors = requiredColors.slice(0, maxColors);
            }
        }

        // Mezclar los colores para presentación
        allLevelColors.sort(() => Math.random() - 0.5);

        console.log("Colores finales seleccionados:", {
            level: parameters.colorLevel,
            count: allLevelColors.length,
            colors: allLevelColors.map(c => c.name)
        });

        // Asegurarse de que hay colores, incluso si todo falla
        const finalColors = allLevelColors.length > 0 ? allLevelColors : FALLBACK_COLORS;

        // Configurar el primer objeto
        const firstObject = gameObjects.length > 0 ? gameObjects[0] : null;

        // Verificar que los objetos pueden completarse con los colores disponibles
        const canCompleteAllObjects = verifyObjectsHaveRequiredColors(gameObjects, finalColors);
        if (!canCompleteAllObjects) {
            console.error("DEBUG - ⚠️ No todos los objetos pueden completarse con los colores disponibles");
        }

        // Inicializar estado
        setGameState(state => ({
            ...state,
            colors: finalColors,
            objects: gameObjects,
            currentObjectIndex: 0,
            currentObject: firstObject,
            selectedColor: null,
            userDrawing: null,
            score: 0,
            gameStatus: 'learning',
            completedObjects: [],
            startTime: Date.now(),
            endTime: null,
            isCorrect: null,
            usedColors: new Set<string>(),
            metrics: {
                correctColorUses: 0,
                totalColorUses: 0,
                timeSpent: 0,
                completionRate: 0
            }
        }));
    }, [difficulty, parameters]);

    // Pasar de la fase de aprendizaje a la de dibujo
    const startDrawingPhase = useCallback(() => {
        console.log("Iniciando fase de dibujo");

        // Verificar que haya objetos disponibles
        setGameState(prev => {
            // Si no hay objetos, no cambiar a fase de dibujo
            if (!prev.objects.length || !prev.currentObject) {
                console.error("No hay objetos disponibles para dibujar");
                return prev;
            }

            return {
                ...prev,
                gameStatus: 'drawing'
            };
        });
    }, []);

    // Seleccionar un color
    const selectColor = useCallback((color: ColorItem) => {
        setGameState(prev => ({
            ...prev,
            selectedColor: color
        }));
    }, []);

    // Registrar uso de un color
    const registerColorUse = useCallback((colorName: string) => {
        // Si recibimos 'reset', limpiar los colores usados
        if (colorName === 'reset') {
            setGameState(prev => ({
                ...prev,
                usedColors: new Set<string>()
            }));
            console.log("Colores usados reiniciados");
            return;
        }

        // Actualizar con el nuevo color usado
        setGameState(prev => {
            const newUsedColors = new Set(prev.usedColors);
            newUsedColors.add(colorName);

            return {
                ...prev,
                usedColors: newUsedColors,
                metrics: {
                    ...prev.metrics,
                    totalColorUses: prev.metrics.totalColorUses + 1
                }
            };
        });

        console.log(`Color registrado: ${colorName}`);
    }, []);

    // Guardar dibujo del usuario
    const saveDrawing = useCallback((dataURL: string) => {
        setGameState(prev => ({
            ...prev,
            userDrawing: dataURL
        }));
    }, []);

    // Comprobar si se usaron los colores correctamente
    const checkDrawing = useCallback((directDrawing?: string) => {
        if (!gameState.currentObject) {
            console.warn("No hay objeto actual para verificar");
            return;
        }

        // Usar el dibujo pasado directamente o el almacenado en el estado
        const drawingToCheck = directDrawing || gameState.userDrawing;

        if (!drawingToCheck) {
            console.warn("No hay dibujo para verificar");
            return;
        }

        console.log("Verificando dibujo...");
        console.log("Colores usados:", Array.from(gameState.usedColors));

        // Verificar si se utilizaron los colores correctos
        const isCorrect = checkCorrectColors(gameState.currentObject, gameState.usedColors);

        // Calcular puntuación para este objeto
        const objectScore = isCorrect ? 100 / (parameters.roundsCount * parameters.objectsPerRound) : 0;

        console.log(`Verificación: ${isCorrect ? 'Correcta' : 'Incorrecta'}, Puntuación: ${objectScore}`);

        // Actualizar estado asegurando que se guarde el dibujo (incluso si se pasó directamente)
        setGameState(prev => ({
            ...prev,
            gameStatus: 'feedback',
            isCorrect,
            userDrawing: drawingToCheck, // Asegurar que se use el dibujo correcto
            score: prev.score + objectScore,
            completedObjects: [...prev.completedObjects, prev.currentObject!],
            metrics: {
                ...prev.metrics,
                correctColorUses: isCorrect ? prev.metrics.correctColorUses + 1 : prev.metrics.correctColorUses,
                completionRate: (prev.completedObjects.length + 1) / prev.objects.length
            }
        }));
    }, [gameState, parameters.roundsCount, parameters.objectsPerRound]);

    // Pasar al siguiente objeto o terminar el juego
    const nextObject = useCallback(() => {
        console.log("Avanzando al siguiente objeto:", {
            currentObjectIndex: gameState.currentObjectIndex,
            totalObjects: gameState.objects.length,
            objectsPerRound: parameters.objectsPerRound,
            currentRound: Math.floor(gameState.currentObjectIndex / parameters.objectsPerRound) + 1,
            totalRounds: parameters.roundsCount
        });

        setGameState(prev => {
            const nextIndex = prev.currentObjectIndex + 1;
            const currentRound = Math.floor(nextIndex / parameters.objectsPerRound) + 1;

            // Verificar si hemos terminado la ronda actual
            const isRoundComplete = nextIndex % parameters.objectsPerRound === 0;

            console.log(`Avanzando al objeto ${nextIndex + 1} (Ronda ${currentRound} de ${parameters.roundsCount})`);

            // Verificar si hemos terminado todos los objetos
            if (nextIndex >= prev.objects.length) {
                console.log("Fin del juego - No hay más objetos");
                return {
                    ...prev,
                    gameStatus: 'completed',
                    endTime: Date.now(),
                    metrics: {
                        ...prev.metrics,
                        timeSpent: (Date.now() - prev.startTime) / 1000
                    }
                };
            }

            // Agregar mensaje para indicar fin de ronda
            if (isRoundComplete && currentRound < parameters.roundsCount) {
                console.log(`¡Ronda ${currentRound} completada!`);
            }

            // Pasar al siguiente objeto
            return {
                ...prev,
                currentObjectIndex: nextIndex,
                currentObject: prev.objects[nextIndex],
                userDrawing: null,
                isCorrect: null,
                gameStatus: 'drawing',
                usedColors: new Set<string>()
            };
        });
    }, [gameState, parameters.objectsPerRound, parameters.roundsCount]);

    // Finalizar el juego
    const endGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            gameStatus: 'completed',
            endTime: Date.now(),
            metrics: {
                ...prev.metrics,
                timeSpent: (Date.now() - prev.startTime) / 1000
            }
        }));
    }, []);

    // Timer para juego con límite de tiempo
    useEffect(() => {
        // Solo activar si estamos en fase de dibujo
        if (gameState.gameStatus !== 'drawing') {
            return;
        }

        // Usar timePerRound en lugar de timeLimit
        // Si no hay tiempo configurado o temporizador desactivado, no hacer nada
        if (!parameters.timerEnabled || parameters.timePerRound === 0) {
            console.log("Temporizador desactivado o tiempo = 0");
            return;
        }

        const timeLimit = parameters.timePerRound * 1000; // Convertir a milisegundos
        console.log(`Temporizador configurado: ${timeLimit / 1000} segundos`);

        const timer = setTimeout(() => {
            console.log("Tiempo agotado, finalizando juego");
            endGame();
        }, timeLimit);

        return () => {
            console.log("Limpiando temporizador");
            clearTimeout(timer);
        };
    }, [gameState.gameStatus, parameters.timerEnabled, parameters.timePerRound, endGame]);

    // Añadir timer para el límite de tiempo total del juego
    useEffect(() => {
        // Solo activar si estamos jugando (aprendiendo, dibujando o feedback)
        if (!['learning', 'drawing', 'feedback'].includes(gameState.gameStatus)) {
            return;
        }

        // Si no hay límite de tiempo para todo el juego, no hacer nada
        if (!parameters.timerEnabled || parameters.timeLimit === 0) {
            return;
        }

        // Convertir el límite de tiempo de minutos a milisegundos
        const fullGameTimeLimit = parameters.timeLimit * 60 * 1000;
        console.log(`Timer global configurado: ${parameters.timeLimit} minutos`);

        // Configurar timer para todo el juego
        const fullGameTimer = setTimeout(() => {
            console.log("Tiempo total de juego agotado, finalizando sesión");
            endGame();
        }, fullGameTimeLimit);

        return () => {
            clearTimeout(fullGameTimer);
        };
    }, [gameState.gameStatus, parameters.timerEnabled, parameters.timeLimit, endGame]);

    return {
        gameState,
        startGame,
        startDrawingPhase,
        selectColor,
        registerColorUse,
        saveDrawing,
        checkDrawing,
        nextObject,
        endGame
    };
}; 