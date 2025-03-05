import { IGame } from '@/types/game';
import { SpellingBeeParameters } from './types';

const SpellingBeeGameConfig: IGame = {
    id: 'spelling-bee',  // ID único para el juego
    type: 'Writing',
    difficulty: 'intermediate',
    category: 'Vocabulary',
    parameters: {
        wordsPerRound: 10,
        categories: [
            { value: 'commonWords', label: 'Common Words' },
            { value: 'silentLetters', label: 'Silent Letters' },
            { value: 'doubleLetters', label: 'Double Letters' },
            { value: 'irregularSpelling', label: 'Irregular Spelling' },
            { value: 'homonyms', label: 'Homonyms' },
            { value: 'britishAmerican', label: 'British/American' },
            { value: 'compound', label: 'Compound Words' },
            { value: 'academic', label: 'Academic Words' }
        ],
        useHints: true,
        showDefinition: true,
        maxAttempts: 3,
        timeLimit: 0  // 0 significa sin límite de tiempo
    } as SpellingBeeParameters,
    instructions: [
        "Escucha atentamente la pronunciación de cada palabra.",
        "Escribe la ortografía correcta en el campo de texto.",
        "Puedes usar las pistas si tienes dificultades.",
        "Cada palabra tiene un número limitado de intentos.",
        "Presta atención a los patrones ortográficos para mejorar."
    ]
};

export default SpellingBeeGameConfig; 