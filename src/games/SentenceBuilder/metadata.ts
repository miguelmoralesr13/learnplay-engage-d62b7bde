import { Game } from '@/store/gameStore';

export const gameMetadata: Game = {
    id: 'sentence-builder',
    name: 'Sentence Builder',
    description: 'Construye oraciones gramaticalmente correctas ordenando bloques de palabras',
    category: 'grammar',
    difficulty: ['beginner', 'intermediate', 'advanced'],
    thumbnail: '/images/games/Sentence-Builder.webp',
    path: '/games/sentence-builder'
}; 