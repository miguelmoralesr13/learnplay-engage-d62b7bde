import { WordMatchConfig, WordPair } from '../types';
import { DifficultyLevel } from '@/types/game';

// Base de datos de pares de palabras
export const wordPairsDatabase: WordPair[] = [
    // Beginner words
    { word: 'house', translation: 'casa' },
    { word: 'car', translation: 'coche' },
    { word: 'tree', translation: 'árbol' },
    { word: 'book', translation: 'libro' },
    { word: 'dog', translation: 'perro' },
    { word: 'cat', translation: 'gato' },
    { word: 'apple', translation: 'manzana' },
    { word: 'water', translation: 'agua' },

    // Intermediate words
    { word: 'knowledge', translation: 'conocimiento' },
    { word: 'beautiful', translation: 'hermoso' },
    { word: 'challenge', translation: 'desafío' },
    { word: 'respect', translation: 'respeto' },
    { word: 'journey', translation: 'viaje' },
    { word: 'imagine', translation: 'imaginar' },
    { word: 'success', translation: 'éxito' },
    { word: 'responsibility', translation: 'responsabilidad' },

    // Advanced words
    { word: 'simultaneously', translation: 'simultáneamente' },
    { word: 'indispensable', translation: 'indispensable' },
    { word: 'enthusiasm', translation: 'entusiasmo' },
    { word: 'persistent', translation: 'persistente' },
    { word: 'significant', translation: 'significativo' },
    { word: 'extraordinary', translation: 'extraordinario' },
    { word: 'innovation', translation: 'innovación' },
    { word: 'achievement', translation: 'logro' },
];

// Configuración por dificultad
export const getGameConfigByDifficulty = (difficulty: DifficultyLevel): WordMatchConfig => {
    // Filtrar palabras por dificultad
    let filteredPairs: WordPair[] = [];

    switch (difficulty) {
        case 'beginner':
            filteredPairs = wordPairsDatabase.slice(0, 8);
            return {
                wordPairs: filteredPairs,
                timeLimit: 120,
            };
        case 'intermediate':
            filteredPairs = wordPairsDatabase.slice(8, 16);
            return {
                wordPairs: filteredPairs,
                timeLimit: 90,
            };
        case 'advanced':
            filteredPairs = wordPairsDatabase.slice(16, 24);
            return {
                wordPairs: filteredPairs,
                timeLimit: 60,
            };
        default:
            return {
                wordPairs: wordPairsDatabase.slice(0, 8),
                timeLimit: 120,
            };
    }
}; 