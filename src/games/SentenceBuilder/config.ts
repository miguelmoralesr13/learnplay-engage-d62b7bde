import { IGame } from '@/types/game';
import { SentenceBuilderParameters } from './types';

const SentenceBuilderGameConfig: IGame = {
    id: 'sentence-builder',
    type: 'Selection',
    difficulty: 'intermediate',
    category: 'Grammar',
    parameters: {
        difficulty: { label: 'intermediate', value: 'intermediate' },
        timerEnabled: true,
        sentencesPerRound: 3,
        timeLimit: 300,
        showHints: true,
        showTranslation: true,
        shuffleFragments: true,
        maxAttemptsPerSentence: 0 // 0 significa intentos ilimitados
    } as SentenceBuilderParameters,
    instructions: [
        "Construye oraciones gramaticalmente correctas ordenando bloques de palabras.",
        "Arrastra las palabras y colócalas en el orden correcto para formar una oración con sentido.",
        "Presta atención a las reglas gramaticales del inglés (sujeto + verbo + complemento).",
        "Puedes solicitar una pista si tienes dificultades.",
        "Al terminar, verás explicaciones y estructuras alternativas correctas."
    ]
};

export default SentenceBuilderGameConfig; 