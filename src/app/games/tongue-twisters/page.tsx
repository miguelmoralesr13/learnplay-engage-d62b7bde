import React from 'react';
import TongueTwistersChallenge from '@/games/TongueTwisters';
import { createMetadata } from '@/lib/metadata';
import { metadata as gameMetadata } from '@/games/TongueTwisters/metadata';

export const metadata = createMetadata({
    title: gameMetadata.title,
    description: gameMetadata.description
});

export default function TongueTwistersPage() {
    return <TongueTwistersChallenge />;
} 