import { createGameConfig } from '@/lib/gameConfig';
import { TongueTwistersParameters } from './types/game';
import { IGame } from '@/types/game';

const TongueTwistersConfig: IGame = {
    id: 'tongue-twisters',
    type: 'Audio',
    category: 'Pronunciation',
    instructions: [
        "Listen to the tongue twister by clicking 'Listen'",
        "Practice saying it a few times in your mind",
        "Click 'Start' and try to say it clearly",
        "Click 'Stop' when you finish speaking"
    ],
    parameters: {
        difficulty: 'easy',
        showTranslation: true,
        useRhythm: true,
        practiceMode: true,
        speedMultiplier: 1.0,
        timeLimit: 300,
        attempts: 3,
        lives: 3
    } as TongueTwistersParameters,
    difficulty: 'beginner',
    dynamicParameters: {
        difficulty: 'easy',
        showTranslation: true,
        useRhythm: true,
        practiceMode: true,
        speedMultiplier: 1.0,
        timeLimit: 300,
        attempts: 3,
        lives: 3
    },
    visualConfig: {
        showTimerPreview: true,
        showSpeedPreview: true,
        showDifficultyBadge: true,
        rhythmVisualization: true,
        speedControlType: 'slider',
        timerStyle: 'circular',
        difficultyColors: {
            easy: '#4ade80',
            medium: '#fbbf24',
            hard: '#f87171'
        }
    }
};

export default TongueTwistersConfig; 