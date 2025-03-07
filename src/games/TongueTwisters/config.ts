import { z } from 'zod';
import { ParameterFormFactory } from '@/games/factories/ParameterFormFactory';
import { TongueTwistersParameters } from './types';
import { FormDefinition } from '@/types/parameterForm';
import { IGame } from '@/types/game';

// Esquema de validación para los parámetros
export const TongueTwistersParametersSchema = z.object({
    difficulty: z.object({
        label: z.string(),
        value: z.enum(['beginner', 'intermediate', 'advanced'])
    }),
    category: z.enum(['general', 'vowels', 'consonants', 'rl', 'th']).default('general'),
    useTimer: z.boolean().default(false),
    showTranslation: z.boolean().default(true),
    timeLimitSeconds: z.number().min(30).max(300).default(60),
    speedMultiplier: z.number().min(0.5).max(2).step(0.1).default(1)
});

// Valores predeterminados
export const defaultParameters: TongueTwistersParameters = {
    difficulty: { label: 'Beginner', value: 'beginner' },
    useTimer: false,
    showTranslation: true,
    timeLimitSeconds: 60,
    speedMultiplier: 1
};

// Definición del formulario

// Instrucciones del juego
export const gameInstructions: string[] = [
    "Welcome to Tongue Twisters Practice! This game will help you improve your pronunciation.",
    "You will be presented with tongue twisters of varying difficulty.",
    "Listen to each tongue twister by clicking the 'Listen' button and familiarize yourself with it.",
    "When you're ready, click 'Start Recording' and try to say the tongue twister clearly.",
    "Click 'Stop Recording' when you finish speaking. You can then listen to your recording.",
    "Compare your pronunciation with the original and try again if needed.",
    "The better your pronunciation, the higher your score!"
];
// Crear un objeto de configuración del juego siguiendo el patrón establecido
export const gameConfig: IGame = {
    id: 'tongue-twisters',
    type: 'Speaking',
    category: 'Pronunciation',
    parameters: defaultParameters,
    instructions: gameInstructions
};