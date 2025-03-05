import { IGame } from '@/types/game';
import { NumberRaceParameters, NumberRaceDifficulty } from './types';

// Rangos de números para cada dificultad
export const NUMBER_RANGES = {
    beginner: { min: 1, max: 10 },       // Números del 1-10 para principiantes
    intermediate: { min: 10, max: 1000 }, // Números del 10-1000 para nivel intermedio
    advanced: { min: 1000, max: 1000000 } // Números del 1000-millones para nivel avanzado
};

// Tiempo límite en segundos para cada dificultad
export const TIME_LIMITS = {
    beginner: 120,    // 2 minutos
    intermediate: 180,  // 3 minutos
    advanced: 240     // 4 minutos
};

// Velocidad base del corredor (se incrementa con cada respuesta correcta)
export const BASE_RUNNER_SPEED = {
    beginner: 5,      // Incremento del 5% por respuesta correcta
    intermediate: 3,    // Incremento del 3% por respuesta correcta
    advanced: 2       // Incremento del 2% por respuesta correcta
};

// Bonificación de tiempo por respuesta correcta (segundos)
export const TIME_BONUS = {
    beginner: 3,
    intermediate: 2,
    advanced: 1
};

// Puntos base por respuesta correcta
export const BASE_POINTS = 10;

// Instrucciones del juego


// Configuración principal del juego
const NUMBER_RACE_CONFIG: IGame = {
    id: 'number-race',  // ID único para el juego
    type: 'Writing',
    difficulty: 'beginner',
    category: 'Arithmetic',
    parameters: {
        difficulty: 'beginner',
        timeLimit: TIME_LIMITS.beginner,
        maxNumber: 10,
        enableTimer: true,
        numbersToFinish: 10  // Valor por defecto
    } as NumberRaceParameters,
    instructions: [
        "Escribe el número que ves en palabras en inglés",
        "Usa guiones para números compuestos (twenty-one, thirty-five)",
        "¡Sé rápido! El corredor se mueve más rápido a medida que avanzas",
        "Gana puntos por cada respuesta correcta y bonificaciones de tiempo",
        "Ejemplos: 7 = seven, 21 = twenty-one, 105 = one hundred and five"
    ]
};

export default NUMBER_RACE_CONFIG; 