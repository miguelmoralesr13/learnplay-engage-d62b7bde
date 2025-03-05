import { IGame } from '@/types/game';

export function createGameConfig(config: Partial<IGame>): IGame {
    return {
        id: '',
        type: 'Audio',
        difficulty: 'beginner',
        category: 'Pronunciation',
        parameters: {},
        instructions: [],
        ...config
    };
} 