import { IGame } from '@/types/game';
import { WordMatchParameters } from './types';

const WordMatchGameConfig: IGame = {
    id: 'word-match',
    type: 'Vocabulary',
    category: 'Vocabulary',
    parameters: {
        timerEnabled: true,
        pairCount: 8
    } as WordMatchParameters,
    instructions: [
        "Relaciona cada palabra en inglés con su traducción correcta en español.",
        "Selecciona una palabra de cada columna para hacer una pareja.",
        "El objetivo es encontrar todas las parejas antes de que se acabe el tiempo.",
        "Obtendrás puntos por cada pareja correcta, pero perderás puntos por intentos incorrectos."
    ]
};

export default WordMatchGameConfig; 