import { DifficultyLevel } from '@/types/game';

export type ColorLevel = 'basic' | 'intermediate' | 'advanced';

export interface ColorItem {
    name: string;
    translation: string;
    hexCode: string;
    level: ColorLevel;
}

export interface DrawingObject {
    id: string;
    name: string;
    translation: string;
    description: string;
    requiredColors: string[];
    difficulty: DifficultyLevel;
}

export interface PaintDrawingParameters {
    roundsCount: number;
    timerEnabled: boolean;
    timePerRound: number;
    colorLevel: ColorLevel;
    showColorNames: boolean;
    enableAudio: boolean;
    objectsPerRound: number;
    timeLimit: number;
}

export type PaintDrawingStatus =
    | 'idle'
    | 'learning'
    | 'drawing'
    | 'feedback'
    | 'completed';

export interface PaintDrawingGameState {
    colors: ColorItem[];
    objects: DrawingObject[];
    currentObjectIndex: number;
    currentObject: DrawingObject | null;
    selectedColor: ColorItem | null;
    userDrawing: string | null;
    score: number;
    gameStatus: PaintDrawingStatus;
    completedObjects: DrawingObject[];
    startTime: number;
    endTime: number | null;
    isCorrect: boolean | null;
    usedColors: Set<string>;
    metrics: {
        correctColorUses: number;
        totalColorUses: number;
        timeSpent: number;
        completionRate: number;
    };
} 