import { useEffect } from 'react';
import useGameStore from '@/store/gameStore';
import { gameMetadata as wordMatchMetadata } from '@/games/WordMatch/metadata';
import { gameMetadata as verbFormsMetadata } from '@/games/VerbForms/metadata';
import { gameMetadata as sentenceBuilderMetadata } from '@/games/SentenceBuilder/metadata';
import { gameMetadata as wordRushMetadata } from '@/games/WordRush/metadata';
import { gameMetadata as spellingBeeMetadata } from '@/games/SpellingBee/metadata';
import { gameMetadata as numberRaceMetadata } from '@/games/NumberRace/metadata';
import { gameMetadata as tongueTwistersMetadata } from '@/games/TongueTwisters/metadata';

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
            tongueTwistersMetadata,
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