import { DifficultyLevel } from '@/types/game';

export interface SpellingWord {
    id: string;
    word: string;             // La palabra a deletrear
    phonetic: string;         // Representación fonética
    definition: string;       // Definición
    example: string;          // Ejemplo en contexto
    difficulty: DifficultyLevel;
    category: SpellingCategory;
    spellingPattern?: string; // Patrón ortográfico relevante
}

export type SpellingCategory =
    | 'commonWords'
    | 'silentLetters'
    | 'doubleLetters'
    | 'irregularSpelling'
    | 'homonyms'
    | 'britishAmerican'
    | 'compound'
    | 'academic';

export type HintLevel = 'none' | 'first' | 'vowels' | 'partial';

export interface SpellingBeeParameters {
    wordsPerRound: number;     // Cantidad de palabras por ronda
    categories: { value: SpellingCategory, label: string }[]; // Categorías seleccionadas
    useHints: boolean;         // Permitir usar pistas
    showDefinition: boolean;   // Mostrar definición
    maxAttempts: number;       // Intentos máximos por palabra
    timeLimit?: number;        // Límite de tiempo opcional
}

export interface SpellingBeeGameState {
    words: SpellingWord[];     // Palabras para la ronda
    currentWordIndex: number;  // Índice actual
    currentWord: SpellingWord | null; // Palabra actual
    userInput: string;         // Lo que el usuario ha escrito
    attempts: number;          // Intentos para la palabra actual
    hints: HintLevel;          // Nivel de pista actual
    score: number;             // Puntuación
    isCorrect: boolean | null; // Estado de la respuesta actual
    gameStatus: 'ready' | 'playing' | 'checking' | 'completed';
    correctWords: SpellingWord[];  // Palabras acertadas
    incorrectWords: SpellingWord[]; // Palabras falladas
    startTime: number;         // Timestamp de inicio
    endTime: number | null;    // Timestamp de fin
    metrics: {
        correct: number;         // Total de respuestas correctas
        incorrect: number;       // Total de respuestas incorrectas
        hintsUsed: number;       // Total de pistas usadas
        averageAttempts: number; // Intentos promedio por palabra
        commonMistakes: { word: string, typed: string }[]; // Errores comunes
    };
} 