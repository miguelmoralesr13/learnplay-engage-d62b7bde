import { IGame } from '@/types/game';
import { WordRushParameters } from './types';
import { categoryOptions } from './utils/wordData';

// Configuración principal del juego
const WordRushConfig: IGame = {
    id: 'word-rush',  // ID único para el juego
    type: 'Selection',
    difficulty: 'beginner',
    category: 'Vocabulary',
    parameters: {
        timerEnabled: true,
        wordsPerRound: 10,
        timePerWord: 5,
        categories: categoryOptions
    } as WordRushParameters,
    instructions: [
        "Type each word as quickly and accurately as possible",
        "Points are awarded based on speed and accuracy",
        "Complete all words to finish a round",
        "The difficulty increases with each round"
        // Otras instrucciones
    ]
};

export default WordRushConfig; 