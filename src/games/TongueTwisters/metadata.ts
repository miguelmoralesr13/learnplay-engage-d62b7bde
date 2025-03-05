import { Game } from '@/store/gameStore';

export const gameMetadata: Game = {
    id: 'tongue-twisters',
    name: 'Tongue Twisters',
    description: 'Improve your pronunciation with fun tongue twisters',
    category: 'pronunciation',
    difficulty: ['beginner', 'intermediate', 'advanced'],
    thumbnail: '/images/games/tongue-twisters.png',
    path: '/games/tongue-twisters'
};

export default gameMetadata; 