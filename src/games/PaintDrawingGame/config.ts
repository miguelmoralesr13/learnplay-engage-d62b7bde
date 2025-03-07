import { IGame } from '@/types/game';
import { ColorLevel, PaintDrawingParameters } from './types';

const PaintDrawingGameConfig: IGame = {
    id: 'paint-drawing',
    type: 'Vocabulary',
    category: 'Vocabulary',
    parameters: {
        difficulty: { label: 'Dificultad', value: 'beginner' },
        roundsCount: 3,
        timerEnabled: true,
        timePerRound: 120,
        colorLevel: 'basic',
        showColorNames: true,
        enableAudio: false,
        objectsPerRound: 1,
        timeLimit: 0,
    } as PaintDrawingParameters,

    instructions: [
        "Welcome to Paint Drawing Game!",
        "In this game, you'll be given words to draw using the painting tools.",
        "Each round, try to draw the given word before the time runs out.",
        "Use different brush sizes and colors to create your drawing.",
        "Have fun and express your creativity!"
    ]
};

export default PaintDrawingGameConfig; 