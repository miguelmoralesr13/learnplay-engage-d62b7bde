import { useEffect } from 'react';
import useGameStore from '../store/gameStore';
import React from 'react';
import { gameMetadata as wordMatchMetadata } from '@/games/WordMatch/metadata';
import { gameMetadata as verbFormsMetadata } from '@/games/VerbForms/metadata';
import { gameMetadata as sentenceBuilderMetadata } from '@/games/SentenceBuilder/metadata';
import { gameMetadata as wordRushMetadata } from '@/games/WordRush/metadata';
import { gameMetadata as spellingBeeMetadata } from '@/games/SpellingBee/metadata';
import { gameMetadata as numberRaceMetadata } from '@/games/NumberRace/metadata';
import { gameMetadata as speakAndScoreMetadata } from '@/games/SpeakAndScore/metadata';
import { gameMetadata as tongueTwistersMetadata } from '@/games/TongueTwisters/metadata';
import { gameMetadata as simonSaysMetadata } from '@/games/SimonSays/metadata';

export const useGameRegistry = () => {
    const { registerGame, games } = useGameStore();

    useEffect(() => {
        const allMetadata = [
            wordMatchMetadata,
            verbFormsMetadata,
            sentenceBuilderMetadata,
            wordRushMetadata,
            spellingBeeMetadata,
            numberRaceMetadata,
            speakAndScoreMetadata,
            tongueTwistersMetadata,
            simonSaysMetadata,
        ];

        // Register games if not already registered
        allMetadata.forEach(metadata => {
            const isRegistered = games.some(game => game.id === metadata.id);
            if (!isRegistered) {
                registerGame(metadata);
            }
        });
    }, [registerGame, games]);
};

