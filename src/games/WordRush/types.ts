import { GameCategory, DifficultyLevel } from '@/types/game';

export interface WordItem {
    id: string;
    text: string;
    translation: string;
    definition?: string;
    category: WordCategory;
}

export type WordCategory =
    | 'household_items'
    | 'school_supplies'
    | 'electronics'
    | 'furniture'
    | 'clothes'
    | 'accessories'
    | 'food'
    | 'fruits'
    | 'vegetables'
    | 'kitchen_utensils'
    | 'tools'
    | 'office_supplies'
    | 'personal_items'
    | 'sports_equipment'
    | 'musical_instruments'
    | 'vehicles'
    | 'toys'
    | 'bathroom_items'
    | 'garden_tools'
    | 'medical_supplies'
    | 'beauty_products'
    | 'cleaning_supplies'
    | 'pet_supplies'
    | 'art_supplies'
    | 'books_stationery';


export interface WordRushParameters {
    timerEnabled?: boolean;
    wordsPerRound?: number;
    timePerWord?: number;
    timeLimit: number;          // Tiempo total en segundos
    categories: { label: string, value: WordCategory }[]; // Categorías seleccionadas
    showTranslation: boolean;   // Mostrar traducción o definición
    timeBonusPerWord: number;   // Tiempo extra por palabra correcta (en segundos)
    comboMultiplier: number;    // Multiplicador de puntaje por combo
}

export interface WordRushGameState {
    words: WordItem[];          // Palabras para la ronda actual
    currentWordIndex: number;   // Índice de la palabra actual
    currentWord: WordItem | null; // Palabra actual
    options: string[];          // Opciones para elegir (traducción/definición)
    score: number;              // Puntaje acumulado
    combo: number;              // Combo actual
    maxCombo: number;           // Combo máximo alcanzado
    timeLeft: number;           // Tiempo restante en segundos
    gameStatus: 'ready' | 'playing' | 'paused' | 'completed'; // Estado del juego
    startTime: number;          // Timestamp de inicio del juego
    correctAnswers: WordItem[]; // Palabras contestadas correctamente
    wrongAnswers: WordItem[];   // Palabras contestadas incorrectamente
    metrics: {
        correct: number;          // Total de respuestas correctas
        incorrect: number;        // Total de respuestas incorrectas
        averageResponseTime: number; // Tiempo promedio de respuesta
        comboStats: number[];     // Historial de combos
    };
} 