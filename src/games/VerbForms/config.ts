import { IGame } from '@/types/game';
import { VerbFormsParameters } from './types';

const VerbFormsGameConfig: IGame = {
    id: 'verb-forms',
    type: 'Writing',
    difficulty: 'intermediate',
    category: 'Grammar',
    parameters: {
        includeRegular: true,
        includeIrregular: true,
        verbCount: 10,
        tenses: [{ value: 'past', label: 'Past' },
        { value: 'pastParticiple', label: 'Past Participle' },
        { value: 'present', label: 'Present' },
        { value: 'gerund', label: 'Gerund' }],
        timeLimit: 180,
        timerEnabled: true
    } as VerbFormsParameters,
    instructions: [
        "Practica las conjugaciones de verbos en inglés.",
        "Verás un verbo en su forma base (infinitivo) y tendrás que escribir la forma conjugada correcta según el tiempo verbal solicitado.",
        "Selecciona el tiempo verbal que deseas practicar y escribe la forma correcta del verbo.",
        "Presta atención a los verbos irregulares, que siguen patrones diferentes.",
        "Después de cada respuesta, verás ejemplos del verbo en diferentes contextos."
    ]
};

export default VerbFormsGameConfig; 