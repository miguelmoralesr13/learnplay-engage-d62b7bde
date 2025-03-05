import { IGame } from '@/types/game';

const MinimalPairsConfig: IGame = {
    id: 'minimal-pairs',
    type: 'Audio',
    difficulty: 'beginner',
    category: 'Listening',
    parameters: {
        difficulty: 'beginner',
        pairCount: 10,
        categories: [
            { value: 'vowels', label: 'Vocales' },
            { value: 'consonants', label: 'Consonantes' }
        ],
        showPhonetics: true
    },
    instructions: [
        "Escucharás una palabra en inglés - presta mucha atención a su pronunciación",
        "Se te mostrarán dos palabras similares con una diferencia sutil de pronunciación",
        "Selecciona la palabra que crees haber escuchado",
        "Puedes usar los botones de audio para escuchar nuevamente o comparar ambas palabras",
        "Presta atención a los símbolos fonéticos para identificar la diferencia de sonidos",
        "¡Cuanto más rápido respondas correctamente, más puntos ganarás!"
    ]
};

export default MinimalPairsConfig; 