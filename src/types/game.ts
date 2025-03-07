export type GameType = 'Vocabulary' | 'Grammar' | 'Speaking' | 'Writing' | 'Reading' | 'Listening';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type GameCategory = 'Grammar' | 'Vocabulary' | 'Pronunciation' | 'Listening' | 'Reading' | 'Arithmetic';
export type GameStatus = 'idle' | 'loading' | 'playing' | 'completed';
export type GameProgress = number; // 0-100 percentage

export interface GameParameters {
    [key: string]: any;
}

export interface IGame<T = any> {
    id: string;       // ID único del juego para seleccionar el formulario
    type: GameType;
    category: GameCategory;
    parameters: T;
    instructions: string[];
    dynamicParameters?: Record<string, any>;
    onComplete?: (results: any) => void;
}

export interface GameMetrics {
    correct: number;
    incorrect: number;
    timeSpent: number;
    [key: string]: any;
}

export interface GameConfig {
    gameId: string;
    difficulty: DifficultyLevel;
    parameters: GameParameters;
}

export interface GameMetadata {
    id: string;
    name: string;
    description: string;
    instructions: string[];
    icon: string;
    coverImage: string;
    category: GameCategory;
    tags: string[];
    duration: string;
    difficulty: DifficultyLevel;
    skills: string[];
}
