import { WordMatchConfig, WordPair } from '../types';
import { DifficultyLevel } from '@/types/game';

const beginnerWords: WordPair[] = [
    { word: 'house', translation: 'casa' },
    { word: 'car', translation: 'coche' },
    { word: 'tree', translation: 'árbol' },
    { word: 'book', translation: 'libro' },
    { word: 'dog', translation: 'perro' },
    { word: 'cat', translation: 'gato' },
    { word: 'apple', translation: 'manzana' },
    { word: 'water', translation: 'agua' },
    { word: 'sun', translation: 'sol' },
    { word: 'moon', translation: 'luna' },
    { word: 'star', translation: 'estrella' },
    { word: 'door', translation: 'puerta' },
    { word: 'window', translation: 'ventana' },
    { word: 'chair', translation: 'silla' },
    { word: 'table', translation: 'mesa' },
    { word: 'bed', translation: 'cama' },
    { word: 'phone', translation: 'teléfono' },
    { word: 'pen', translation: 'bolígrafo' },
    { word: 'pencil', translation: 'lápiz' },
    { word: 'paper', translation: 'papel' },
    { word: 'school', translation: 'escuela' },
    { word: 'teacher', translation: 'maestro' },
    { word: 'student', translation: 'estudiante' },
    { word: 'friend', translation: 'amigo' },
    { word: 'family', translation: 'familia' },
    { word: 'father', translation: 'padre' },
    { word: 'mother', translation: 'madre' },
    { word: 'brother', translation: 'hermano' },
    { word: 'sister', translation: 'hermana' },
    { word: 'baby', translation: 'bebé' },
    { word: 'food', translation: 'comida' },
    { word: 'milk', translation: 'leche' },
    { word: 'bread', translation: 'pan' },
    { word: 'cheese', translation: 'queso' },
    { word: 'egg', translation: 'huevo' },
    { word: 'fish', translation: 'pescado' },
    { word: 'chicken', translation: 'pollo' },
    { word: 'orange', translation: 'naranja' },
    { word: 'banana', translation: 'plátano' }
]
const intermediateWords: WordPair[] = [
    { word: 'knowledge', translation: 'conocimiento' },
    { word: 'beautiful', translation: 'hermoso' },
    { word: 'challenge', translation: 'desafío' },
    { word: 'respect', translation: 'respeto' },
    { word: 'journey', translation: 'viaje' },
    { word: 'imagine', translation: 'imaginar' },
    { word: 'success', translation: 'éxito' },
    { word: 'responsibility', translation: 'responsabilidad' },
    { word: 'memory', translation: 'memoria' },
    { word: 'adventure', translation: 'aventura' },
    { word: 'experience', translation: 'experiencia' },
    { word: 'freedom', translation: 'libertad' },
    { word: 'confidence', translation: 'confianza' },
    { word: 'decision', translation: 'decisión' },
    { word: 'ambition', translation: 'ambición' },
    { word: 'effort', translation: 'esfuerzo' },
    { word: 'behavior', translation: 'comportamiento' },
    { word: 'improvement', translation: 'mejora' },
    { word: 'patience', translation: 'paciencia' },
    { word: 'curiosity', translation: 'curiosidad' },
    { word: 'opportunity', translation: 'oportunidad' },
    { word: 'solution', translation: 'solución' },
    { word: 'determination', translation: 'determinación' },
    { word: 'inspiration', translation: 'inspiración' },
    { word: 'creativity', translation: 'creatividad' },
    { word: 'decision', translation: 'decisión' },
    { word: 'strategy', translation: 'estrategia' },
    { word: 'possibility', translation: 'posibilidad' },
    { word: 'cooperation', translation: 'cooperación' },
    { word: 'communication', translation: 'comunicación' },
    { word: 'education', translation: 'educación' },
    { word: 'motivation', translation: 'motivación' },
    { word: 'discipline', translation: 'disciplina' },
    { word: 'achievement', translation: 'logro' },
    { word: 'independence', translation: 'independencia' },
    { word: 'perspective', translation: 'perspectiva' },
    { word: 'reaction', translation: 'reacción' },
    { word: 'relationship', translation: 'relación' },
    { word: 'encouragement', translation: 'ánimo' },
    { word: 'perception', translation: 'percepción' }
]

const advancedWords: WordPair[] = [
    { word: 'simultaneously', translation: 'simultáneamente' },
    { word: 'indispensable', translation: 'indispensable' },
    { word: 'enthusiasm', translation: 'entusiasmo' },
    { word: 'persistent', translation: 'persistente' },
    { word: 'significant', translation: 'significativo' },
    { word: 'extraordinary', translation: 'extraordinario' },
    { word: 'innovation', translation: 'innovación' },
    { word: 'achievement', translation: 'logro' },
    { word: 'sophisticated', translation: 'sofisticado' },
    { word: 'perseverance', translation: 'perseverancia' },
    { word: 'transformation', translation: 'transformación' },
    { word: 'persuasive', translation: 'persuasivo' },
    { word: 'sustainability', translation: 'sostenibilidad' },
    { word: 'philosophy', translation: 'filosofía' },
    { word: 'vulnerability', translation: 'vulnerabilidad' },
    { word: 'authenticity', translation: 'autenticidad' },
    { word: 'consciousness', translation: 'conciencia' },
    { word: 'interpretation', translation: 'interpretación' },
    { word: 'sophistication', translation: 'sofisticación' },
    { word: 'exaggeration', translation: 'exageración' },
    { word: 'metaphorical', translation: 'metafórico' },
    { word: 'unpredictable', translation: 'impredecible' },
    { word: 'phenomenon', translation: 'fenómeno' },
    { word: 'unparalleled', translation: 'sin igual' },
    { word: 'comprehensive', translation: 'comprehensivo' },
    { word: 'manifestation', translation: 'manifestación' },
    { word: 'contemplation', translation: 'contemplación' },
    { word: 'revolutionary', translation: 'revolucionario' },
    { word: 'susceptibility', translation: 'susceptibilidad' },
    { word: 'distinguished', translation: 'distinguido' },
    { word: 'extraordinarily', translation: 'extraordinariamente' },
    { word: 'indisputable', translation: 'indiscutible' },
    { word: 'intricately', translation: 'intrincadamente' },
    { word: 'procrastination', translation: 'procrastinación' },
    { word: 'enlightenment', translation: 'iluminación' },
    { word: 'indifference', translation: 'indiferencia' },
    { word: 'reconciliation', translation: 'reconciliación' },
    { word: 'unprecedented', translation: 'sin precedentes' },
    { word: 'misconception', translation: 'idea errónea' },
    { word: 'perplexity', translation: 'perplejidad' }
]


// Base de datos de pares de palabras
export const wordPairsDatabase: WordPair[] = [
    ...beginnerWords,
    ...intermediateWords,
    ...advancedWords,
];

// Configuración por dificultad
export const getGameConfigByDifficulty = (difficulty: DifficultyLevel): WordMatchConfig => {
    // Filtrar palabras por dificultad
    let filteredPairs: WordPair[] = [];

    switch (difficulty) {
        case 'beginner':
            filteredPairs = beginnerWords.sort(() => Math.random() - 0.5).slice(0, 8);
            return {
                wordPairs: filteredPairs,
                timeLimit: 120,
            };
        case 'intermediate':
            filteredPairs = intermediateWords.sort(() => Math.random() - 0.5).slice(0, 8);
            return {
                wordPairs: filteredPairs,
                timeLimit: 90,
            };
        case 'advanced':
            filteredPairs = advancedWords.sort(() => Math.random() - 0.5).slice(0, 8);
            console.log(filteredPairs);
            return {
                wordPairs: filteredPairs,
                timeLimit: 60,
            };
        default:
            return {
                wordPairs: wordPairsDatabase.sort(() => Math.random() - 0.5).slice(0, 8),
                timeLimit: 120,
            };
    }
}; 