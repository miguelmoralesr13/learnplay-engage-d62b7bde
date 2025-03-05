import { SpellingWord, SpellingCategory } from '../types';
import { DifficultyLevel } from '@/types/game';

// Función para generar un ID único
const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
};

// Base de datos de palabras para deletrear


// Función para obtener palabras por categoría y dificultad
export const getWordsByFilters = (
    categories: SpellingCategory[],
    difficulty: DifficultyLevel | null,
    count: number
): SpellingWord[] => {
    let filteredWords = spellingWordsDatabase.filter(word =>
        categories.includes(word.category) &&
        (!difficulty || word.difficulty === difficulty)
    );

    // Si no hay suficientes palabras con el filtro actual, ampliar a más dificultades
    if (filteredWords.length < count) {
        filteredWords = spellingWordsDatabase.filter(word =>
            categories.includes(word.category)
        );
    }

    // Barajar las palabras
    const shuffled = [...filteredWords].sort(() => 0.5 - Math.random());

    // Devolver la cantidad solicitada
    return shuffled.slice(0, count);
};

// Generar una pista basada en el nivel
export const generateHint = (word: string, level: string): string => {
    switch (level) {
        case 'first':
            // Mostrar solo la primera letra
            return word.charAt(0) + '_'.repeat(word.length - 1);

        case 'vowels':
            // Mostrar vocales y ocultar consonantes
            return word.split('').map(char => {
                return 'aeiouAEIOU'.includes(char) ? char : '_';
            }).join('');

        case 'partial':
            // Mostrar algunas letras estratégicamente (1/3 de las letras)
            const revealCount = Math.max(1, Math.floor(word.length / 3));
            let result = '_'.repeat(word.length).split('');

            // Revelar la primera letra
            result[0] = word[0];

            // Revelar algunas letras más aleatoriamente
            const revealPositions = new Set<number>();
            revealPositions.add(0); // Ya revelamos la primera

            while (revealPositions.size < revealCount) {
                const pos = Math.floor(Math.random() * word.length);
                if (!revealPositions.has(pos)) {
                    revealPositions.add(pos);
                    result[pos] = word[pos];
                }
            }

            return result.join('');

        default:
            return '_'.repeat(word.length);
    }
};

// Verificar si la respuesta es correcta
export const checkSpelling = (original: string, typed: string): boolean => {
    return original.toLowerCase() === typed.toLowerCase();
};

// Calcular puntaje basado en dificultad, intentos y pistas
export const calculateScore = (
    word: SpellingWord,
    attempts: number,
    hintsUsed: string
): number => {
    // Puntaje base según dificultad
    let baseScore = 0;
    switch (word.difficulty) {
        case 'beginner':
            baseScore = 50;
            break;
        case 'intermediate':
            baseScore = 75;
            break;
        case 'advanced':
            baseScore = 100;
            break;
    }

    // Reducir por intentos usados
    const attemptMultiplier = 1 - ((attempts - 1) * 0.25); // 25% menos por cada intento adicional

    // Reducir por pistas usadas
    let hintPenalty = 0;
    switch (hintsUsed) {
        case 'first':
            hintPenalty = 0.1; // 10% de penalización
            break;
        case 'vowels':
            hintPenalty = 0.25; // 25% de penalización
            break;
        case 'partial':
            hintPenalty = 0.4; // 40% de penalización
            break;
        default:
            hintPenalty = 0; // Sin penalización
    }

    // Calcular puntaje final (no puede ser negativo)
    return Math.max(0, Math.round(baseScore * attemptMultiplier * (1 - hintPenalty)));
};
const commonWords: SpellingWord[] = [
    // Beginner
    {
        "id": generateId(),
        "word": "happy",
        "phonetic": "/ˈhæpi/",
        "definition": "feeling or showing pleasure or contentment",
        "example": "She felt happy on her birthday.",
        "difficulty": "beginner",
        "category": "commonWords",
        "spellingPattern": "Double P in the middle"
    },
    {
        "id": generateId(),
        "word": "friend",
        "phonetic": "/frɛnd/",
        "definition": "a person with whom one has a bond of mutual affection",
        "example": "He is my best friend.",
        "difficulty": "beginner",
        "category": "commonWords",
        "spellingPattern": "EI pattern, sounds like 'frend'"
    },
    {
        "id": generateId(),
        "word": "apple",
        "phonetic": "/ˈæpl/",
        "definition": "a round fruit with red, yellow, or green skin",
        "example": "She ate a green apple.",
        "difficulty": "beginner",
        "category": "commonWords",
        "spellingPattern": "Double P in the middle"
    },
    {
        "id": generateId(),
        "word": "summer",
        "phonetic": "/ˈsʌmər/",
        "definition": "the warmest season of the year",
        "example": "We go to the beach every summer.",
        "difficulty": "beginner",
        "category": "commonWords",
        "spellingPattern": "Double M in the middle"
    },
    {
        "id": generateId(),
        "word": "water",
        "phonetic": "/ˈwɔːtər/",
        "definition": "a colorless, transparent liquid essential for life",
        "example": "Drink plenty of water daily.",
        "difficulty": "beginner",
        "category": "commonWords",
        "spellingPattern": "ER ending, common vowel pattern"
    },
    {
        "id": generateId(),
        "word": "mother",
        "phonetic": "/ˈmʌðər/",
        "definition": "a female parent",
        "example": "She is a wonderful mother.",
        "difficulty": "beginner",
        "category": "commonWords",
        "spellingPattern": "TH sound in the middle"
    },
    {
        "id": generateId(),
        "word": "school",
        "phonetic": "/skuːl/",
        "definition": "a place where children go to learn",
        "example": "They walk to school every day.",
        "difficulty": "beginner",
        "category": "commonWords",
        "spellingPattern": "CH sounds like K"
    },
    {
        "id": generateId(),
        "word": "house",
        "phonetic": "/haʊs/",
        "definition": "a building for people to live in",
        "example": "Their house is very big.",
        "difficulty": "beginner",
        "category": "commonWords",
        "spellingPattern": "OU sounds like OW"
    },
    {
        "id": generateId(),
        "word": "music",
        "phonetic": "/ˈmjuːzɪk/",
        "definition": "the art of arranging sounds in a way that is pleasant",
        "example": "She loves listening to music.",
        "difficulty": "beginner",
        "category": "commonWords",
        "spellingPattern": "IC ending"
    },
    {
        "id": generateId(),
        "word": "color",
        "phonetic": "/ˈkʌlər/",
        "definition": "the property of an object that is seen when light reflects",
        "example": "Blue is my favorite color.",
        "difficulty": "beginner",
        "category": "commonWords",
        "spellingPattern": "OR ending (American spelling)"
    },

    // Intermediate
    {
        "id": generateId(),
        "word": "knowledge",
        "phonetic": "/ˈnɒlɪdʒ/",
        "definition": "information, understanding, and skills acquired",
        "example": "He has great knowledge of history.",
        "difficulty": "intermediate",
        "category": "commonWords",
        "spellingPattern": "Silent K at the beginning"
    },
    {
        "id": generateId(),
        "word": "business",
        "phonetic": "/ˈbɪznɪs/",
        "definition": "an organization involved in commercial activities",
        "example": "She runs a small business.",
        "difficulty": "intermediate",
        "category": "commonWords",
        "spellingPattern": "Silent I in the middle"
    },
    {
        "id": generateId(),
        "word": "measure",
        "phonetic": "/ˈmɛʒər/",
        "definition": "to determine the size, amount, or degree of something",
        "example": "He used a ruler to measure the table.",
        "difficulty": "intermediate",
        "category": "commonWords",
        "spellingPattern": "S sounds like ZH"
    },
    {
        "id": generateId(),
        "word": "science",
        "phonetic": "/ˈsaɪəns/",
        "definition": "the systematic study of the structure and behavior of the world",
        "example": "Physics is a branch of science.",
        "difficulty": "intermediate",
        "category": "commonWords",
        "spellingPattern": "SCI sounds like S"
    },
    {
        "id": generateId(),
        "word": "decide",
        "phonetic": "/dɪˈsaɪd/",
        "definition": "to make a choice after thinking about it",
        "example": "She decided to move to a new city.",
        "difficulty": "intermediate",
        "category": "commonWords",
        "spellingPattern": "Ends in -ide"
    },
    {
        "id": generateId(),
        "word": "trouble",
        "phonetic": "/ˈtrʌbl/",
        "definition": "difficulty or problems",
        "example": "He is in trouble for breaking the window.",
        "difficulty": "intermediate",
        "category": "commonWords",
        "spellingPattern": "OU sounds like U"
    },
    {
        "id": generateId(),
        "word": "pressure",
        "phonetic": "/ˈprɛʃər/",
        "definition": "continuous physical force exerted on something",
        "example": "The pressure of work can be stressful.",
        "difficulty": "intermediate",
        "category": "commonWords",
        "spellingPattern": "S sounds like SH"
    },

    // Advanced
    {
        "id": generateId(),
        "word": "consciousness",
        "phonetic": "/ˈkɒnʃəsnɪs/",
        "definition": "the state of being aware and able to think",
        "example": "He lost consciousness after the accident.",
        "difficulty": "advanced",
        "category": "commonWords",
        "spellingPattern": "Ends in -ness"
    },
    {
        "id": generateId(),
        "word": "sufficient",
        "phonetic": "/səˈfɪʃənt/",
        "definition": "enough; adequate",
        "example": "We have sufficient resources for the project.",
        "difficulty": "advanced",
        "category": "commonWords",
        "spellingPattern": "CI sounds like SH"
    },
    {
        "id": generateId(),
        "word": "accommodation",
        "phonetic": "/əˌkɒməˈdeɪʃən/",
        "definition": "a place where someone can stay or live",
        "example": "The hotel provides excellent accommodation.",
        "difficulty": "advanced",
        "category": "commonWords",
        "spellingPattern": "Double C, double M"
    }
]

const silentLetters: SpellingWord[] = [
    // Beginner
    {
        "id": generateId(),
        "word": "knee",
        "phonetic": "/niː/",
        "definition": "the joint between the thigh and the lower leg",
        "example": "He hurt his knee while playing soccer.",
        "difficulty": "beginner",
        "category": "silentLetters",
        "spellingPattern": "Silent K at the beginning"
    },
    {
        "id": generateId(),
        "word": "comb",
        "phonetic": "/koʊm/",
        "definition": "a tool used for arranging or untangling hair",
        "example": "She used a comb to fix her hair.",
        "difficulty": "beginner",
        "category": "silentLetters",
        "spellingPattern": "Silent B at the end"
    },
    {
        "id": generateId(),
        "word": "lamb",
        "phonetic": "/læm/",
        "definition": "a young sheep",
        "example": "The farmer has a newborn lamb.",
        "difficulty": "beginner",
        "category": "silentLetters",
        "spellingPattern": "Silent B at the end"
    },
    {
        "id": generateId(),
        "word": "thumb",
        "phonetic": "/θʌm/",
        "definition": "the short, thick first digit of the hand",
        "example": "He gave a thumbs-up.",
        "difficulty": "beginner",
        "category": "silentLetters",
        "spellingPattern": "Silent B at the end"
    },
    {
        "id": generateId(),
        "word": "write",
        "phonetic": "/raɪt/",
        "definition": "to put words on paper or in digital form",
        "example": "She loves to write stories.",
        "difficulty": "beginner",
        "category": "silentLetters",
        "spellingPattern": "Silent W at the beginning"
    },
    {
        "id": generateId(),
        "word": "gnome",
        "phonetic": "/noʊm/",
        "definition": "a small imaginary human-like creature",
        "example": "There was a garden gnome on the lawn.",
        "difficulty": "beginner",
        "category": "silentLetters",
        "spellingPattern": "Silent G at the beginning"
    },
    {
        "id": generateId(),
        "word": "honest",
        "phonetic": "/ˈɒnɪst/",
        "definition": "truthful and sincere",
        "example": "She is an honest person.",
        "difficulty": "beginner",
        "category": "silentLetters",
        "spellingPattern": "Silent H at the beginning"
    },
    {
        "id": generateId(),
        "word": "island",
        "phonetic": "/ˈaɪlənd/",
        "definition": "a piece of land surrounded by water",
        "example": "They traveled to a tropical island.",
        "difficulty": "beginner",
        "category": "silentLetters",
        "spellingPattern": "Silent S in the middle"
    },
    {
        "id": generateId(),
        "word": "castle",
        "phonetic": "/ˈkæsl/",
        "definition": "a large fortified building",
        "example": "The king lived in a huge castle.",
        "difficulty": "beginner",
        "category": "silentLetters",
        "spellingPattern": "Silent T in the middle"
    },
    {
        "id": generateId(),
        "word": "calf",
        "phonetic": "/kæf/",
        "definition": "a young cow or bull",
        "example": "The farmer fed the newborn calf.",
        "difficulty": "beginner",
        "category": "silentLetters",
        "spellingPattern": "Silent L at the end"
    },

    // Intermediate
    {
        "id": generateId(),
        "word": "knuckle",
        "phonetic": "/ˈnʌkl/",
        "definition": "a joint of a finger",
        "example": "He cracked his knuckles.",
        "difficulty": "intermediate",
        "category": "silentLetters",
        "spellingPattern": "Silent K at the beginning"
    },
    {
        "id": generateId(),
        "word": "debt",
        "phonetic": "/dɛt/",
        "definition": "money owed to someone",
        "example": "He is paying off his debt.",
        "difficulty": "intermediate",
        "category": "silentLetters",
        "spellingPattern": "Silent B in the middle"
    },
    {
        "id": generateId(),
        "word": "subtle",
        "phonetic": "/ˈsʌtl/",
        "definition": "delicate or precise, difficult to perceive",
        "example": "Her perfume has a subtle scent.",
        "difficulty": "intermediate",
        "category": "silentLetters",
        "spellingPattern": "Silent B in the middle"
    },
    {
        "id": generateId(),
        "word": "receipt",
        "phonetic": "/rɪˈsiːt/",
        "definition": "a written or printed statement of payment",
        "example": "Keep the receipt for your records.",
        "difficulty": "intermediate",
        "category": "silentLetters",
        "spellingPattern": "Silent P in the middle"
    },
    {
        "id": generateId(),
        "word": "whistle",
        "phonetic": "/ˈwɪsl/",
        "definition": "a high-pitched sound made by forcing air through lips or a device",
        "example": "He blew the whistle to start the game.",
        "difficulty": "intermediate",
        "category": "silentLetters",
        "spellingPattern": "Silent T in the middle"
    },
    {
        "id": generateId(),
        "word": "salmon",
        "phonetic": "/ˈsæmən/",
        "definition": "a type of fish",
        "example": "They grilled salmon for dinner.",
        "difficulty": "intermediate",
        "category": "silentLetters",
        "spellingPattern": "Silent L in the middle"
    },

    // Advanced
    {
        "id": generateId(),
        "word": "rendezvous",
        "phonetic": "/ˈrɒndeɪvuː/",
        "definition": "a meeting at an agreed time and place",
        "example": "They arranged a secret rendezvous.",
        "difficulty": "advanced",
        "category": "silentLetters",
        "spellingPattern": "Silent Z at the end"
    },
    {
        "id": generateId(),
        "word": "fascinate",
        "phonetic": "/ˈfæsɪneɪt/",
        "definition": "to attract and hold attention",
        "example": "The magician fascinated the audience.",
        "difficulty": "advanced",
        "category": "silentLetters",
        "spellingPattern": "Silent C in the middle"
    },
    {
        "id": generateId(),
        "word": "mnemonic",
        "phonetic": "/nɪˈmɒnɪk/",
        "definition": "a device that helps in remembering something",
        "example": "He used a mnemonic to remember the list.",
        "difficulty": "advanced",
        "category": "silentLetters",
        "spellingPattern": "Silent M at the beginning"
    },
    {
        "id": generateId(),
        "word": "ascent",
        "phonetic": "/əˈsɛnt/",
        "definition": "a movement upward",
        "example": "The ascent to the mountain peak was challenging.",
        "difficulty": "advanced",
        "category": "silentLetters",
        "spellingPattern": "Silent C in the middle"
    }
]
const doubleLetters: SpellingWord[] = [
    // Beginner
    {
        "id": generateId(),
        "word": "happy",
        "phonetic": "/ˈhæpi/",
        "definition": "feeling or showing pleasure or contentment",
        "example": "She felt happy on her birthday.",
        "difficulty": "beginner",
        "category": "doubleLetters",
        "spellingPattern": "Double P in the middle"
    },
    {
        "id": generateId(),
        "word": "butter",
        "phonetic": "/ˈbʌtər/",
        "definition": "a yellow dairy product made from milk",
        "example": "She spread butter on her toast.",
        "difficulty": "beginner",
        "category": "doubleLetters",
        "spellingPattern": "Double T in the middle"
    },
    {
        "id": generateId(),
        "word": "letter",
        "phonetic": "/ˈlɛtər/",
        "definition": "a written message",
        "example": "He wrote a letter to his friend.",
        "difficulty": "beginner",
        "category": "doubleLetters",
        "spellingPattern": "Double T in the middle"
    },
    {
        "id": generateId(),
        "word": "summer",
        "phonetic": "/ˈsʌmər/",
        "definition": "the warmest season of the year",
        "example": "We go to the beach in summer.",
        "difficulty": "beginner",
        "category": "doubleLetters",
        "spellingPattern": "Double M in the middle"
    },
    {
        "id": generateId(),
        "word": "address",
        "phonetic": "/ˈædrɛs/",
        "definition": "the location of a place",
        "example": "Please send the package to my new address.",
        "difficulty": "beginner",
        "category": "doubleLetters",
        "spellingPattern": "Double D in the middle"
    },
    {
        "id": generateId(),
        "word": "coffee",
        "phonetic": "/ˈkɒfi/",
        "definition": "a popular caffeinated drink",
        "example": "I drink coffee every morning.",
        "difficulty": "beginner",
        "category": "doubleLetters",
        "spellingPattern": "Double F in the middle"
    },
    {
        "id": generateId(),
        "word": "balloon",
        "phonetic": "/bəˈluːn/",
        "definition": "a rubber sack filled with air or gas",
        "example": "The child played with a red balloon.",
        "difficulty": "beginner",
        "category": "doubleLetters",
        "spellingPattern": "Double L in the middle"
    },
    {
        "id": generateId(),
        "word": "horror",
        "phonetic": "/ˈhɒrər/",
        "definition": "a feeling of intense fear or shock",
        "example": "She loves watching horror movies.",
        "difficulty": "beginner",
        "category": "doubleLetters",
        "spellingPattern": "Double R in the middle"
    },
    {
        "id": generateId(),
        "word": "carrot",
        "phonetic": "/ˈkærət/",
        "definition": "an orange root vegetable",
        "example": "Rabbits love eating carrots.",
        "difficulty": "beginner",
        "category": "doubleLetters",
        "spellingPattern": "Double R in the middle"
    },
    {
        "id": generateId(),
        "word": "puppy",
        "phonetic": "/ˈpʌpi/",
        "definition": "a young dog",
        "example": "The little puppy was very playful.",
        "difficulty": "beginner",
        "category": "doubleLetters",
        "spellingPattern": "Double P in the middle"
    },

    // Intermediate
    {
        "id": generateId(),
        "word": "committee",
        "phonetic": "/kəˈmɪti/",
        "definition": "a group of people appointed for a specific function",
        "example": "She serves on the school committee.",
        "difficulty": "intermediate",
        "category": "doubleLetters",
        "spellingPattern": "Double M, double T"
    },
    {
        "id": generateId(),
        "word": "misspell",
        "phonetic": "/mɪsˈspɛl/",
        "definition": "to spell a word incorrectly",
        "example": "Be careful not to misspell your name.",
        "difficulty": "intermediate",
        "category": "doubleLetters",
        "spellingPattern": "Double S, double L"
    },
    {
        "id": generateId(),
        "word": "parallel",
        "phonetic": "/ˈpærəˌlɛl/",
        "definition": "side by side and having the same distance continuously",
        "example": "The train tracks run parallel to each other.",
        "difficulty": "intermediate",
        "category": "doubleLetters",
        "spellingPattern": "Double L in the middle"
    },
    {
        "id": generateId(),
        "word": "embarrass",
        "phonetic": "/ɪmˈbærəs/",
        "definition": "to cause someone to feel ashamed or awkward",
        "example": "She didn’t want to embarrass herself in front of everyone.",
        "difficulty": "intermediate",
        "category": "doubleLetters",
        "spellingPattern": "Double R, double S"
    },
    {
        "id": generateId(),
        "word": "possess",
        "phonetic": "/pəˈzɛs/",
        "definition": "to have or own something",
        "example": "He possesses great talent.",
        "difficulty": "intermediate",
        "category": "doubleLetters",
        "spellingPattern": "Double S at the end"
    },

    // Advanced
    {
        "id": generateId(),
        "word": "successful",
        "phonetic": "/səkˈsɛsfəl/",
        "definition": "achieving an aim or purpose",
        "example": "He is a successful entrepreneur.",
        "difficulty": "advanced",
        "category": "doubleLetters",
        "spellingPattern": "Double C, double S"
    },
    {
        "id": generateId(),
        "word": "aggressive",
        "phonetic": "/əˈɡrɛsɪv/",
        "definition": "ready to attack or confront",
        "example": "The dog became aggressive when provoked.",
        "difficulty": "advanced",
        "category": "doubleLetters",
        "spellingPattern": "Double G, double S"
    },
    {
        "id": generateId(),
        "word": "accommodation",
        "phonetic": "/əˌkɒməˈdeɪʃən/",
        "definition": "a place where someone lives or stays",
        "example": "They booked accommodation in a luxury hotel.",
        "difficulty": "advanced",
        "category": "doubleLetters",
        "spellingPattern": "Double C, double M"
    },
    {
        "id": generateId(),
        "word": "assassinate",
        "phonetic": "/əˈsæsɪneɪt/",
        "definition": "to murder a prominent person",
        "example": "The president was assassinated in the capital.",
        "difficulty": "advanced",
        "category": "doubleLetters",
        "spellingPattern": "Double S in the middle"
    },
    {
        "id": generateId(),
        "word": "committee",
        "phonetic": "/kəˈmɪti/",
        "definition": "a group of people appointed for a specific function",
        "example": "The finance committee approved the budget.",
        "difficulty": "advanced",
        "category": "doubleLetters",
        "spellingPattern": "Double M, double T"
    }
]
const irregularSpelling: SpellingWord[] = [
    // Beginner
    {
        "id": generateId(),
        "word": "friend",
        "phonetic": "/frɛnd/",
        "definition": "a person whom one knows and trusts",
        "example": "She is my best friend.",
        "difficulty": "beginner",
        "category": "irregularSpelling",
        "spellingPattern": "IE instead of expected EI"
    },
    {
        "id": generateId(),
        "word": "said",
        "phonetic": "/sɛd/",
        "definition": "past tense of 'say'",
        "example": "He said he would be here at noon.",
        "difficulty": "beginner",
        "category": "irregularSpelling",
        "spellingPattern": "AI pronounced as short E"
    },
    {
        "id": generateId(),
        "word": "done",
        "phonetic": "/dʌn/",
        "definition": "past participle of 'do'",
        "example": "I have done my homework.",
        "difficulty": "beginner",
        "category": "irregularSpelling",
        "spellingPattern": "Silent E at the end"
    },
    {
        "id": generateId(),
        "word": "eight",
        "phonetic": "/eɪt/",
        "definition": "the number after seven",
        "example": "There are eight apples on the table.",
        "difficulty": "beginner",
        "category": "irregularSpelling",
        "spellingPattern": "GH is silent"
    },
    {
        "id": generateId(),
        "word": "one",
        "phonetic": "/wʌn/",
        "definition": "the number before two",
        "example": "I have one book.",
        "difficulty": "beginner",
        "category": "irregularSpelling",
        "spellingPattern": "O pronounced as W"
    },
    {
        "id": generateId(),
        "word": "two",
        "phonetic": "/tuː/",
        "definition": "the number after one",
        "example": "I have two cats.",
        "difficulty": "beginner",
        "category": "irregularSpelling",
        "spellingPattern": "W is silent"
    },
    {
        "id": generateId(),
        "word": "who",
        "phonetic": "/huː/",
        "definition": "question word used to ask about a person",
        "example": "Who is coming to the party?",
        "difficulty": "beginner",
        "category": "irregularSpelling",
        "spellingPattern": "W is silent"
    },
    {
        "id": generateId(),
        "word": "laugh",
        "phonetic": "/læf/",
        "definition": "to express happiness with sound",
        "example": "She laughed at the joke.",
        "difficulty": "beginner",
        "category": "irregularSpelling",
        "spellingPattern": "GH pronounced as F"
    },
    {
        "id": generateId(),
        "word": "once",
        "phonetic": "/wʌns/",
        "definition": "one single time",
        "example": "I have been there once.",
        "difficulty": "beginner",
        "category": "irregularSpelling",
        "spellingPattern": "CE sounds like S"
    },
    {
        "id": generateId(),
        "word": "busy",
        "phonetic": "/ˈbɪzi/",
        "definition": "having a lot of work or tasks",
        "example": "She is very busy today.",
        "difficulty": "beginner",
        "category": "irregularSpelling",
        "spellingPattern": "U pronounced as I"
    },

    // Intermediate
    {
        "id": generateId(),
        "word": "colonel",
        "phonetic": "/ˈkɝːnəl/",
        "definition": "a high-ranking military officer",
        "example": "The colonel led the army into battle.",
        "difficulty": "intermediate",
        "category": "irregularSpelling",
        "spellingPattern": "L pronounced as R"
    },
    {
        "id": generateId(),
        "word": "yacht",
        "phonetic": "/jɒt/",
        "definition": "a large, luxurious boat",
        "example": "He owns a yacht in Monaco.",
        "difficulty": "intermediate",
        "category": "irregularSpelling",
        "spellingPattern": "CH is silent"
    },
    {
        "id": generateId(),
        "word": "island",
        "phonetic": "/ˈaɪlənd/",
        "definition": "a piece of land surrounded by water",
        "example": "They traveled to a tropical island.",
        "difficulty": "intermediate",
        "category": "irregularSpelling",
        "spellingPattern": "S is silent"
    },
    {
        "id": generateId(),
        "word": "subtle",
        "phonetic": "/ˈsʌtl/",
        "definition": "delicate or difficult to perceive",
        "example": "She made a subtle comment.",
        "difficulty": "intermediate",
        "category": "irregularSpelling",
        "spellingPattern": "B is silent"
    },

    // Advanced
    {
        "id": generateId(),
        "word": "queue",
        "phonetic": "/kjuː/",
        "definition": "a line of people or things waiting",
        "example": "We waited in the queue for tickets.",
        "difficulty": "advanced",
        "category": "irregularSpelling",
        "spellingPattern": "UEUE is silent"
    },
    {
        "id": generateId(),
        "word": "rendezvous",
        "phonetic": "/ˈrɒndeɪvuː/",
        "definition": "a meeting at an agreed time and place",
        "example": "They had a secret rendezvous.",
        "difficulty": "advanced",
        "category": "irregularSpelling",
        "spellingPattern": "French-origin spelling"
    },
    {
        "id": generateId(),
        "word": "bourgeois",
        "phonetic": "/ˈbʊərʒwɑː/",
        "definition": "relating to the middle class",
        "example": "He had bourgeois tastes.",
        "difficulty": "advanced",
        "category": "irregularSpelling",
        "spellingPattern": "French-origin spelling"
    },
    {
        "id": generateId(),
        "word": "liaison",
        "phonetic": "/liˈeɪzɒn/",
        "definition": "communication between people or groups",
        "example": "He acted as a liaison between teams.",
        "difficulty": "advanced",
        "category": "irregularSpelling",
        "spellingPattern": "IA pronounced as a single vowel sound"
    },
    {
        "id": generateId(),
        "word": "mnemonic",
        "phonetic": "/nɪˈmɒnɪk/",
        "definition": "a memory aid",
        "example": "She used a mnemonic to remember the rules.",
        "difficulty": "advanced",
        "category": "irregularSpelling",
        "spellingPattern": "M is silent"
    },
    {
        "id": generateId(),
        "word": "ptarmigan",
        "phonetic": "/ˈtɑːrmɪɡən/",
        "definition": "a type of bird found in cold climates",
        "example": "The ptarmigan is well camouflaged in winter.",
        "difficulty": "advanced",
        "category": "irregularSpelling",
        "spellingPattern": "P is silent"
    }
]

const homonyms: SpellingWord[] = [
    // Beginner
    {
        "id": generateId(),
        "word": "bat",
        "phonetic": "/bæt/",
        "definition": "a flying nocturnal mammal or a piece of sports equipment",
        "example": "A bat flew out of the cave. / He swung the bat at the ball.",
        "difficulty": "beginner",
        "category": "homonyms",
        "spellingPattern": "Same spelling, different meanings"
    },
    {
        "id": generateId(),
        "word": "bank",
        "phonetic": "/bæŋk/",
        "definition": "a financial institution or the side of a river",
        "example": "She deposited money in the bank. / They sat by the river bank.",
        "difficulty": "beginner",
        "category": "homonyms",
        "spellingPattern": "Same spelling, different meanings"
    },
    {
        "id": generateId(),
        "word": "bark",
        "phonetic": "/bɑːrk/",
        "definition": "the sound a dog makes or the outer covering of a tree",
        "example": "The dog barked loudly. / The tree’s bark is rough.",
        "difficulty": "beginner",
        "category": "homonyms",
        "spellingPattern": "Same spelling, different meanings"
    },
    {
        "id": generateId(),
        "word": "watch",
        "phonetic": "/wɒtʃ/",
        "definition": "a timepiece worn on the wrist or the act of observing",
        "example": "She wore a gold watch. / Let’s watch a movie tonight.",
        "difficulty": "beginner",
        "category": "homonyms",
        "spellingPattern": "Same spelling, different meanings"
    },
    {
        "id": generateId(),
        "word": "pen",
        "phonetic": "/pɛn/",
        "definition": "a writing instrument or an enclosure for animals",
        "example": "She wrote with a blue pen. / The sheep were in a pen.",
        "difficulty": "beginner",
        "category": "homonyms",
        "spellingPattern": "Same spelling, different meanings"
    },

    // Intermediate
    {
        "id": generateId(),
        "word": "lead",
        "phonetic": "/lɛd/ or /liːd/",
        "definition": "a type of metal (pronounced 'led') or to guide (pronounced 'leed')",
        "example": "The pipes are made of lead. / She will lead the team.",
        "difficulty": "intermediate",
        "category": "homonyms",
        "spellingPattern": "Same spelling, different pronunciations"
    },
    {
        "id": generateId(),
        "word": "row",
        "phonetic": "/roʊ/ or /raʊ/",
        "definition": "a line of objects (pronounced 'roh') or an argument (pronounced 'row')",
        "example": "We sat in the front row. / They had a row about politics.",
        "difficulty": "intermediate",
        "category": "homonyms",
        "spellingPattern": "Same spelling, different pronunciations"
    },
    {
        "id": generateId(),
        "word": "wind",
        "phonetic": "/wɪnd/ or /waɪnd/",
        "definition": "movement of air (pronounced 'wind') or to twist something (pronounced 'wined')",
        "example": "The wind is strong today. / Wind the clock before bed.",
        "difficulty": "intermediate",
        "category": "homonyms",
        "spellingPattern": "Same spelling, different pronunciations"
    },
    {
        "id": generateId(),
        "word": "bass",
        "phonetic": "/bæs/ or /beɪs/",
        "definition": "a type of fish (pronounced 'bass') or low-frequency sound (pronounced 'base')",
        "example": "He caught a bass in the lake. / The bass in this song is deep.",
        "difficulty": "intermediate",
        "category": "homonyms",
        "spellingPattern": "Same spelling, different pronunciations"
    },
    {
        "id": generateId(),
        "word": "tear",
        "phonetic": "/tɪər/ or /tɛər/",
        "definition": "a drop of liquid from the eye (pronounced 'teer') or to rip (pronounced 'tare')",
        "example": "A tear rolled down her cheek. / He will tear the paper in half.",
        "difficulty": "intermediate",
        "category": "homonyms",
        "spellingPattern": "Same spelling, different pronunciations"
    },

    // Advanced
    {
        "id": generateId(),
        "word": "subject",
        "phonetic": "/ˈsʌbdʒɪkt/ or /səbˈdʒɛkt/",
        "definition": "a topic (noun) or to force someone to undergo something (verb)",
        "example": "Math is my favorite subject. / He was subjected to harsh criticism.",
        "difficulty": "advanced",
        "category": "homonyms",
        "spellingPattern": "Same spelling, different pronunciations"
    },
    {
        "id": generateId(),
        "word": "contract",
        "phonetic": "/ˈkɒntrækt/ or /kənˈtrækt/",
        "definition": "a legal agreement (noun) or to shrink (verb)",
        "example": "She signed a contract. / The metal contracts in the cold.",
        "difficulty": "advanced",
        "category": "homonyms",
        "spellingPattern": "Same spelling, different pronunciations"
    },
    {
        "id": generateId(),
        "word": "refuse",
        "phonetic": "/ˈrɛfjuːs/ or /rɪˈfjuːz/",
        "definition": "waste material (noun) or to decline something (verb)",
        "example": "The city collects refuse every Monday. / I refuse to give up.",
        "difficulty": "advanced",
        "category": "homonyms",
        "spellingPattern": "Same spelling, different pronunciations"
    },
    {
        "id": generateId(),
        "word": "object",
        "phonetic": "/ˈɒbdʒɪkt/ or /əbˈdʒɛkt/",
        "definition": "a physical item (noun) or to oppose (verb)",
        "example": "She placed the object on the table. / They object to the new policy.",
        "difficulty": "advanced",
        "category": "homonyms",
        "spellingPattern": "Same spelling, different pronunciations"
    },
    {
        "id": generateId(),
        "word": "resent",
        "phonetic": "/rɪˈzɛnt/ or /ˈriːsɛnt/",
        "definition": "to feel bitterness (verb) or sent again (past tense of 'resend')",
        "example": "He resents the unfair treatment. / She resent the email yesterday.",
        "difficulty": "advanced",
        "category": "homonyms",
        "spellingPattern": "Same spelling, different pronunciations"
    }
]
const britishAmerican: SpellingWord[] = [
    // Beginner
    {
        "id": generateId(),
        "word": "colour / color",
        "phonetic": "/ˈkʌl.ər/ (UK), /ˈkʌl.ɚ/ (US)",
        "definition": "the property of an object producing different visual sensations",
        "example": "She loves the colour blue. (UK) / She loves the color blue. (US)",
        "difficulty": "beginner",
        "category": "britishAmerican",
        "spellingPattern": "UK: -our, US: -or"
    },
    {
        "id": generateId(),
        "word": "favourite / favorite",
        "phonetic": "/ˈfeɪ.vər.ɪt/ (UK), /ˈfeɪ.vɚ.ɪt/ (US)",
        "definition": "preferred above all others",
        "example": "Ice cream is my favourite dessert. (UK) / Ice cream is my favorite dessert. (US)",
        "difficulty": "beginner",
        "category": "britishAmerican",
        "spellingPattern": "UK: -our, US: -or"
    },
    {
        "id": generateId(),
        "word": "realise / realize",
        "phonetic": "/ˈrɪə.laɪz/ (UK), /ˈriː.ə.laɪz/ (US)",
        "definition": "to become aware of something",
        "example": "I didn't realise it was so late. (UK) / I didn't realize it was so late. (US)",
        "difficulty": "beginner",
        "category": "britishAmerican",
        "spellingPattern": "UK: -ise, US: -ize"
    },
    {
        "id": generateId(),
        "word": "centre / center",
        "phonetic": "/ˈsɛn.tər/ (UK), /ˈsɛn.tɚ/ (US)",
        "definition": "the middle point of something",
        "example": "The town centre is crowded. (UK) / The town center is crowded. (US)",
        "difficulty": "beginner",
        "category": "britishAmerican",
        "spellingPattern": "UK: -re, US: -er"
    },
    {
        "id": generateId(),
        "word": "travelling / traveling",
        "phonetic": "/ˈtræv.əl.ɪŋ/ (UK), /ˈtræv.əl.ɪŋ/ (US)",
        "definition": "the act of going from one place to another",
        "example": "She enjoys travelling abroad. (UK) / She enjoys traveling abroad. (US)",
        "difficulty": "beginner",
        "category": "britishAmerican",
        "spellingPattern": "UK: double L, US: single L"
    },

    // Intermediate
    {
        "id": generateId(),
        "word": "aeroplane / airplane",
        "phonetic": "/ˈeə.rə.pleɪn/ (UK), /ˈɛr.pleɪn/ (US)",
        "definition": "a powered flying vehicle",
        "example": "The aeroplane took off smoothly. (UK) / The airplane took off smoothly. (US)",
        "difficulty": "intermediate",
        "category": "britishAmerican",
        "spellingPattern": "UK: aer-, US: air-"
    },
    {
        "id": generateId(),
        "word": "programme / program",
        "phonetic": "/ˈprəʊ.ɡræm/ (UK), /ˈproʊ.ɡræm/ (US)",
        "definition": "a planned series of events or performances",
        "example": "We watched a TV programme. (UK) / We watched a TV program. (US)",
        "difficulty": "intermediate",
        "category": "britishAmerican",
        "spellingPattern": "UK: -mme, US: -m"
    },
    {
        "id": generateId(),
        "word": "cheque / check",
        "phonetic": "/tʃɛk/ (UK & US)",
        "definition": "a written order directing a bank to pay money",
        "example": "I wrote a cheque for £100. (UK) / I wrote a check for $100. (US)",
        "difficulty": "intermediate",
        "category": "britishAmerican",
        "spellingPattern": "UK: cheque, US: check"
    },
    {
        "id": generateId(),
        "word": "analyse / analyze",
        "phonetic": "/ˈæn.ə.laɪz/ (UK), /ˈæn.ə.laɪz/ (US)",
        "definition": "to examine methodically",
        "example": "He will analyse the data. (UK) / He will analyze the data. (US)",
        "difficulty": "intermediate",
        "category": "britishAmerican",
        "spellingPattern": "UK: -yse, US: -yze"
    },
    {
        "id": generateId(),
        "word": "defence / defense",
        "phonetic": "/dɪˈfɛns/ (UK & US)",
        "definition": "protection against attack",
        "example": "The country's defence strategy is strong. (UK) / The country's defense strategy is strong. (US)",
        "difficulty": "intermediate",
        "category": "britishAmerican",
        "spellingPattern": "UK: -ce, US: -se"
    },

    // Advanced
    {
        "id": generateId(),
        "word": "metre / meter",
        "phonetic": "/ˈmiː.tər/ (UK), /ˈmiː.tɚ/ (US)",
        "definition": "a unit of length equal to 100 centimeters",
        "example": "The room is five metres long. (UK) / The room is five meters long. (US)",
        "difficulty": "advanced",
        "category": "britishAmerican",
        "spellingPattern": "UK: -re, US: -er"
    },
    {
        "id": generateId(),
        "word": "sceptical / skeptical",
        "phonetic": "/ˈskɛp.tɪ.kəl/ (UK & US)",
        "definition": "doubtful about something",
        "example": "She was sceptical about the claim. (UK) / She was skeptical about the claim. (US)",
        "difficulty": "advanced",
        "category": "britishAmerican",
        "spellingPattern": "UK: c-, US: k-"
    },
    {
        "id": generateId(),
        "word": "plough / plow",
        "phonetic": "/plaʊ/ (UK & US)",
        "definition": "a tool used to turn over soil",
        "example": "The farmer used a plough. (UK) / The farmer used a plow. (US)",
        "difficulty": "advanced",
        "category": "britishAmerican",
        "spellingPattern": "UK: -ough, US: -ow"
    },
    {
        "id": generateId(),
        "word": "manoeuvre / maneuver",
        "phonetic": "/məˈnuː.vər/ (UK), /məˈnuː.vɚ/ (US)",
        "definition": "a movement requiring skill",
        "example": "The car performed a tricky manoeuvre. (UK) / The car performed a tricky maneuver. (US)",
        "difficulty": "advanced",
        "category": "britishAmerican",
        "spellingPattern": "UK: -oeuvre, US: -euvr"
    },
    {
        "id": generateId(),
        "word": "kerb / curb",
        "phonetic": "/kɜːb/ (UK & US)",
        "definition": "the edge of a sidewalk",
        "example": "He tripped over the kerb. (UK) / He tripped over the curb. (US)",
        "difficulty": "advanced",
        "category": "britishAmerican",
        "spellingPattern": "UK: kerb, US: curb"
    }
]
const compound: SpellingWord[] = [
    // Beginner
    {
        "id": generateId(),
        "word": "sunflower",
        "phonetic": "/ˈsʌnˌflaʊ.ər/",
        "definition": "a tall plant with large yellow flowers",
        "example": "She planted a sunflower in her garden.",
        "difficulty": "beginner",
        "category": "compound",
        "spellingPattern": "sun + flower"
    },
    {
        "id": generateId(),
        "word": "bedroom",
        "phonetic": "/ˈbɛd.ruːm/",
        "definition": "a room used for sleeping",
        "example": "My bedroom has a big window.",
        "difficulty": "beginner",
        "category": "compound",
        "spellingPattern": "bed + room"
    },
    {
        "id": generateId(),
        "word": "toothbrush",
        "phonetic": "/ˈtuːθ.brʌʃ/",
        "definition": "a small brush for cleaning teeth",
        "example": "I forgot my toothbrush at home.",
        "difficulty": "beginner",
        "category": "compound",
        "spellingPattern": "tooth + brush"
    },
    {
        "id": generateId(),
        "word": "rainbow",
        "phonetic": "/ˈreɪn.bəʊ/",
        "definition": "a curved spectrum of colors in the sky",
        "example": "A beautiful rainbow appeared after the rain.",
        "difficulty": "beginner",
        "category": "compound",
        "spellingPattern": "rain + bow"
    },
    {
        "id": generateId(),
        "word": "football",
        "phonetic": "/ˈfʊt.bɔːl/",
        "definition": "a sport played with a round ball",
        "example": "He loves playing football with his friends.",
        "difficulty": "beginner",
        "category": "compound",
        "spellingPattern": "foot + ball"
    },

    // Intermediate
    {
        "id": generateId(),
        "word": "airport",
        "phonetic": "/ˈeə.pɔːt/",
        "definition": "a place where airplanes take off and land",
        "example": "We arrived at the airport early.",
        "difficulty": "intermediate",
        "category": "compound",
        "spellingPattern": "air + port"
    },
    {
        "id": generateId(),
        "word": "notebook",
        "phonetic": "/ˈnəʊt.bʊk/",
        "definition": "a book for writing notes",
        "example": "She always carries a notebook to write ideas.",
        "difficulty": "intermediate",
        "category": "compound",
        "spellingPattern": "note + book"
    },
    {
        "id": generateId(),
        "word": "firefighter",
        "phonetic": "/ˈfaɪəˌfaɪ.tər/",
        "definition": "a person who fights fires",
        "example": "The firefighter saved the cat from the tree.",
        "difficulty": "intermediate",
        "category": "compound",
        "spellingPattern": "fire + fighter"
    },
    {
        "id": generateId(),
        "word": "blueprint",
        "phonetic": "/ˈbluː.prɪnt/",
        "definition": "a detailed technical plan",
        "example": "The architect studied the blueprint carefully.",
        "difficulty": "intermediate",
        "category": "compound",
        "spellingPattern": "blue + print"
    },
    {
        "id": generateId(),
        "word": "moonlight",
        "phonetic": "/ˈmuːn.laɪt/",
        "definition": "light from the moon",
        "example": "We took a walk under the moonlight.",
        "difficulty": "intermediate",
        "category": "compound",
        "spellingPattern": "moon + light"
    },

    // Advanced
    {
        "id": generateId(),
        "word": "underestimate",
        "phonetic": "/ˌʌn.dərˈɛs.tɪ.meɪt/",
        "definition": "to think something is smaller or less important than it really is",
        "example": "Never underestimate the power of knowledge.",
        "difficulty": "advanced",
        "category": "compound",
        "spellingPattern": "under + estimate"
    },
    {
        "id": generateId(),
        "word": "foresight",
        "phonetic": "/ˈfɔː.saɪt/",
        "definition": "the ability to predict what will happen",
        "example": "Her foresight helped the company avoid problems.",
        "difficulty": "advanced",
        "category": "compound",
        "spellingPattern": "fore + sight"
    },
    {
        "id": generateId(),
        "word": "breakthrough",
        "phonetic": "/ˈbreɪk.θruː/",
        "definition": "a major achievement or discovery",
        "example": "The scientist made an important breakthrough in medicine.",
        "difficulty": "advanced",
        "category": "compound",
        "spellingPattern": "break + through"
    },
    {
        "id": generateId(),
        "word": "afterthought",
        "phonetic": "/ˈæf.tər.θɔːt/",
        "definition": "something considered later",
        "example": "Adding decorations was just an afterthought.",
        "difficulty": "advanced",
        "category": "compound",
        "spellingPattern": "after + thought"
    },
    {
        "id": generateId(),
        "word": "counterattack",
        "phonetic": "/ˈkaʊn.tər.əˌtæk/",
        "definition": "an attack made in response to another attack",
        "example": "The army launched a strong counterattack.",
        "difficulty": "advanced",
        "category": "compound",
        "spellingPattern": "counter + attack"
    }
]

const academic: SpellingWord[] = [
    // Beginner
    {
        "id": generateId(),
        "word": "subject",
        "phonetic": "/ˈsʌb.dʒɪkt/",
        "definition": "a branch of knowledge studied in school",
        "example": "Math is my favorite subject.",
        "difficulty": "beginner",
        "category": "academic",
        "spellingPattern": "Common academic term"
    },
    {
        "id": generateId(),
        "word": "teacher",
        "phonetic": "/ˈtiː.tʃər/",
        "definition": "a person who teaches students",
        "example": "My teacher gave us homework.",
        "difficulty": "beginner",
        "category": "academic",
        "spellingPattern": "Common academic term"
    },
    {
        "id": generateId(),
        "word": "lesson",
        "phonetic": "/ˈlɛs.ən/",
        "definition": "a period of learning or instruction",
        "example": "Today's lesson is about geography.",
        "difficulty": "beginner",
        "category": "academic",
        "spellingPattern": "Common academic term"
    },
    {
        "id": generateId(),
        "word": "study",
        "phonetic": "/ˈstʌd.i/",
        "definition": "to learn about a subject",
        "example": "I need to study for my exam.",
        "difficulty": "beginner",
        "category": "academic",
        "spellingPattern": "Common academic term"
    },
    {
        "id": generateId(),
        "word": "exam",
        "phonetic": "/ɪɡˈzæm/",
        "definition": "a formal test of knowledge",
        "example": "The final exam is next week.",
        "difficulty": "beginner",
        "category": "academic",
        "spellingPattern": "Common academic term"
    },

    // Intermediate
    {
        "id": generateId(),
        "word": "hypothesis",
        "phonetic": "/haɪˈpɒθ.ə.sɪs/",
        "definition": "a proposed explanation based on limited evidence",
        "example": "The scientist tested his hypothesis in the lab.",
        "difficulty": "intermediate",
        "category": "academic",
        "spellingPattern": "Greek origin spelling"
    },
    {
        "id": generateId(),
        "word": "analysis",
        "phonetic": "/əˈnæl.ə.sɪs/",
        "definition": "detailed examination of elements or structure",
        "example": "Her analysis of the data was impressive.",
        "difficulty": "intermediate",
        "category": "academic",
        "spellingPattern": "Greek origin spelling"
    },
    {
        "id": generateId(),
        "word": "theory",
        "phonetic": "/ˈθɪə.ri/",
        "definition": "a system of ideas explaining something",
        "example": "Einstein's theory of relativity changed physics.",
        "difficulty": "intermediate",
        "category": "academic",
        "spellingPattern": "Greek origin spelling"
    },
    {
        "id": generateId(),
        "word": "citation",
        "phonetic": "/saɪˈteɪ.ʃən/",
        "definition": "a reference to a source of information",
        "example": "You must include a citation in your essay.",
        "difficulty": "intermediate",
        "category": "academic",
        "spellingPattern": "Latin origin spelling"
    },
    {
        "id": generateId(),
        "word": "literature",
        "phonetic": "/ˈlɪt.rə.tʃər/",
        "definition": "written works, especially those of high quality",
        "example": "Shakespeare's works are famous in literature.",
        "difficulty": "intermediate",
        "category": "academic",
        "spellingPattern": "French origin spelling"
    },

    // Advanced
    {
        "id": generateId(),
        "word": "epistemology",
        "phonetic": "/ɪˌpɪs.tɪˈmɒl.ə.dʒi/",
        "definition": "the theory of knowledge and belief",
        "example": "Epistemology explores the nature of truth.",
        "difficulty": "advanced",
        "category": "academic",
        "spellingPattern": "Greek origin spelling"
    },
    {
        "id": generateId(),
        "word": "metaphysics",
        "phonetic": "/ˌmɛt.əˈfɪz.ɪks/",
        "definition": "the branch of philosophy dealing with fundamental reality",
        "example": "He is studying metaphysics in his PhD program.",
        "difficulty": "advanced",
        "category": "academic",
        "spellingPattern": "Greek origin spelling"
    },
    {
        "id": generateId(),
        "word": "quantitative",
        "phonetic": "/ˈkwɒn.tɪ.tə.tɪv/",
        "definition": "relating to numbers or amounts",
        "example": "The study uses a quantitative approach.",
        "difficulty": "advanced",
        "category": "academic",
        "spellingPattern": "Latin origin spelling"
    },
    {
        "id": generateId(),
        "word": "paradigm",
        "phonetic": "/ˈpær.ə.daɪm/",
        "definition": "a model or example of a theory or process",
        "example": "The shift in the paradigm changed scientific thinking.",
        "difficulty": "advanced",
        "category": "academic",
        "spellingPattern": "Greek origin spelling"
    },
    {
        "id": generateId(),
        "word": "anthropology",
        "phonetic": "/ˌæn.θrəˈpɒl.ə.dʒi/",
        "definition": "the study of human societies and cultures",
        "example": "She is an expert in cultural anthropology.",
        "difficulty": "advanced",
        "category": "academic",
        "spellingPattern": "Greek origin spelling"
    }
]

export const spellingWordsDatabase: SpellingWord[] = [
    ...commonWords,
    ...silentLetters,
    ...doubleLetters,
    ...irregularSpelling,
    ...homonyms,
    ...britishAmerican,
    ...compound,
    ...academic,
];
