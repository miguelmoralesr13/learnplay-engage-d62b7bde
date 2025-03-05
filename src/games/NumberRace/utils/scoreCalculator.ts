import { BASE_POINTS, TIME_BONUS } from '../config';
import { NumberRaceDifficulty } from '../types';

/**
 * Calcula la puntuación basada en la dificultad y el tiempo de respuesta
 */
export function calculateScore(
    difficulty: NumberRaceDifficulty,
    responseTimeMs: number,
    isCorrect: boolean
): number {
    if (!isCorrect) return 0;

    // Convertir milisegundos a segundos
    const responseTimeSec = responseTimeMs / 1000;

    // Factor de dificultad
    const difficultyFactor = {
        easy: 1,
        medium: 1.5,
        hard: 2
    }[difficulty];

    // Factor de tiempo (respuestas más rápidas dan más puntos)
    // Máximo 3 segundos para puntuación máxima
    const timeFactor = Math.max(0, 1 - (responseTimeSec / 10));

    // Cálculo de puntuación
    const score = Math.round(BASE_POINTS * difficultyFactor * (1 + timeFactor));

    return score;
}

/**
 * Calcula el tiempo adicional basado en la velocidad de respuesta
 */
export function calculateTimeBonus(
    difficulty: NumberRaceDifficulty,
    responseTimeMs: number
): number {
    const baseBonus = TIME_BONUS[difficulty];
    const responseTimeSec = responseTimeMs / 1000;

    // Si la respuesta es muy rápida (menos de 2 segundos), dar bonificación adicional
    if (responseTimeSec < 2) {
        return baseBonus * 1.5;
    }

    // Si la respuesta es rápida (menos de 5 segundos), dar bonificación normal
    if (responseTimeSec < 5) {
        return baseBonus;
    }

    // Para respuestas más lentas, dar bonificación reducida
    return baseBonus * 0.5;
} 