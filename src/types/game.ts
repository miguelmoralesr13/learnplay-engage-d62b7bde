export type GameType = 'Writing' | 'Selection' | 'Canvas' | 'Audio';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type GameCategory = 'Grammar' | 'Vocabulary' | 'Pronunciation' | 'Listening' | 'Reading' | 'Arithmetic';
export type GameStatus = 'idle' | 'loading' | 'playing' | 'completed';
export type GameProgress = number; // 0-100 percentage

export interface GameParameters {
    [key: string]: any;
}

export interface VisualConfig {
    showTimerPreview: boolean;
    showSpeedPreview: boolean;
    showDifficultyBadge: boolean;
    rhythmVisualization: boolean;
    speedControlType: 'slider' | 'buttons';
    timerStyle: 'circular' | 'linear';
    difficultyColors: {
        easy: string;
        medium: string;
        hard: string;
    };
}

export interface IGame {
    id: string;       // ID único del juego para seleccionar el formulario
    type: GameType;
    difficulty: DifficultyLevel;
    category: GameCategory;
    parameters: Record<string, any>;
    instructions: string[];
    dynamicParameters?: Record<string, any>;
    visualConfig?: VisualConfig;
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