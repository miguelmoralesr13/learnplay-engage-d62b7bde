import { TongueTwister } from '../types/game';

export const tongueTwisters: TongueTwister[] = [
    {
        id: 'tt1',
        text: "Peter Piper picked a peck of pickled peppers",
        difficulty: 'beginner',
        category: 'P sounds',
        translation: "Pedro Piper recogió una pizca de pimientos en escabeche",
        bpm: 120,
        focusPhoneme: {
            first: 'p',
            position: 'start'
        },
        second: 'b',
    },
    {
        id: 'tt2',
        text: "She sells seashells by the seashore",
        difficulty: 'beginner',
        category: 'S sounds',
        translation: "Ella vende conchas marinas junto a la orilla del mar",
        bpm: 110,
        focusPhoneme: {
            first: 's',
            position: 'start'
        },
        second: 'b',
    },

    // Añadir más tongue twisters...
]; 