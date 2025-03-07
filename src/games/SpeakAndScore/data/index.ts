import { Word } from '../types';

// TODO: faltan palabras en todo los niveles y todas las categorias
const beginnerWords: Word[] = [
    {
        id: 'word-001',
        text: 'Apple',
        phonetic: '/ˈæp.əl/',
        meaning: 'A round fruit with red, yellow, or green skin and firm white flesh',
        category: 'common',
        difficulty: 'beginner'
    },
    {
        id: 'word-002',
        text: 'House',
        phonetic: '/haʊs/',
        meaning: 'A building for human habitation',
        category: 'common',
        difficulty: 'beginner'
    },
    {
        id: 'word-003',
        text: 'Water',
        phonetic: '/ˈwɔː.tər/',
        meaning: 'A clear liquid with no color, taste, or smell that falls as rain',
        category: 'common',
        difficulty: 'beginner'
    },
    {
        id: 'word-004',
        text: 'Book',
        phonetic: '/bʊk/',
        meaning: 'A set of pages that have been fastened together inside a cover to be read',
        category: 'common',
        difficulty: 'beginner'
    },
    {
        id: 'word-005',
        text: 'Friend',
        phonetic: '/frend/',
        meaning: 'A person you know well and like, but who is not related to you',
        category: 'common',
        difficulty: 'beginner'
    }
];

// Palabras para nivel intermedio
const intermediateWords: Word[] = [
    {
        id: 'word-101',
        text: 'Vocabulary',
        phonetic: '/vəˈkæb.jə.ler.i/',
        meaning: 'All the words known and used by a particular person',
        category: 'academic',
        difficulty: 'intermediate'
    },
    {
        id: 'word-102',
        text: 'Schedule',
        phonetic: '/ˈʃed.juːl/',
        meaning: 'A plan of things to be done and the times they will be done',
        category: 'business',
        difficulty: 'intermediate'
    }
];

// Palabras para nivel avanzado
const advancedWords: Word[] = [
    {
        id: 'word-201',
        text: 'Entrepreneurship',
        phonetic: '/ˌɒn.trə.prəˈnɜː.ʃɪp/',
        meaning: 'The activity of setting up a business or businesses, taking on financial risks in the hope of profit',
        category: 'business',
        difficulty: 'advanced'
    },
    {
        id: 'word-202',
        text: 'Phenomenon',
        phonetic: '/fəˈnɒm.ɪ.nən/',
        meaning: 'Something that exists and can be perceived, especially something unusual or interesting',
        category: 'academic',
        difficulty: 'advanced'
    }
];

// Combinar todas las palabras
const allWords: Word[] = [
    ...beginnerWords,
    ...intermediateWords,
    ...advancedWords
];

// Función para obtener palabras por dificultad
export const getWordsByDifficulty = (difficulty: string): Word[] => {
    return allWords.filter(word => word.difficulty === difficulty);
};

// Función para obtener palabras por categoría
export const getWordsByCategory = (category: string): Word[] => {
    return allWords.filter(word => word.category === category);
};

// Función para obtener una palabra por ID
export const getWordById = (id: string): Word | undefined => {
    return allWords.find(word => word.id === id);
};

// Exportar todas las palabras
export default allWords; 