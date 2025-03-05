import { WordItem, WordCategory } from '../types';

// Función para generar un ID único
const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
};

export const categoryOptions: { value: WordCategory, label: string }[] = [
    { value: 'household_items', label: 'Household Items' },
    { value: 'school_supplies', label: 'School Supplies' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'clothes', label: 'Clothes' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'food', label: 'Food' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'kitchen_utensils', label: 'Kitchen Utensils' },
    { value: 'tools', label: 'Tools' },
    { value: 'office_supplies', label: 'Office Supplies' },
    { value: 'personal_items', label: 'Personal Items' },
    { value: 'sports_equipment', label: 'Sports Equipment' },
    { value: 'musical_instruments', label: 'Musical Instruments' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'toys', label: 'Toys' },
    { value: 'bathroom_items', label: 'Bathroom Items' },
    { value: 'garden_tools', label: 'Garden Tools' },
    { value: 'medical_supplies', label: 'Medical Supplies' },
    { value: 'beauty_products', label: 'Beauty Products' },
    { value: 'cleaning_supplies', label: 'Cleaning Supplies' },
    { value: 'pet_supplies', label: 'Pet Supplies' },
    { value: 'art_supplies', label: 'Art Supplies' },
    { value: 'books_stationery', label: 'Books and Stationery' }
];
export const householdItems: WordItem[] = [
    {
        id: generateId(),
        text: 'mirror',
        translation: 'espejo',
        definition: 'a reflective surface used to see oneself or reflect light',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'lamp',
        translation: 'lámpara',
        definition: 'a device that provides light through electricity',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'pillow',
        translation: 'almohada',
        definition: 'a soft cushion used to support the head while sleeping',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'blanket',
        translation: 'manta',
        definition: 'a covering made of soft material used to keep warm',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'curtain',
        translation: 'cortina',
        definition: 'a piece of fabric that covers a window',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'clock',
        translation: 'reloj',
        definition: 'a device that shows and measures time',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'carpet',
        translation: 'alfombra',
        definition: 'a thick woven fabric used to cover floors',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'vase',
        translation: 'florero',
        definition: 'a decorative container used to hold flowers',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'shelf',
        translation: 'estante',
        definition: 'a flat surface attached to a wall used to store items',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'basket',
        translation: 'cesta',
        definition: 'a container made of woven material used to hold items',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'hanger',
        translation: 'percha',
        definition: 'a device used to hang clothes in a closet',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'towel',
        translation: 'toalla',
        definition: 'a piece of absorbent fabric used for drying',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'broom',
        translation: 'escoba',
        definition: 'a cleaning tool with bristles used to sweep floors',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'dustbin',
        translation: 'basurero',
        definition: 'a container used for disposing of waste',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'cushion',
        translation: 'cojín',
        definition: 'a soft pillow used on chairs or sofas for comfort',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'doormat',
        translation: 'felpudo',
        definition: 'a mat placed at the entrance to clean shoes',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'fan',
        translation: 'ventilador',
        definition: 'a device that moves air to create cooling',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'ladder',
        translation: 'escalera',
        definition: 'a frame with steps used to climb up and down',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'bucket',
        translation: 'cubo',
        definition: 'a container with a handle used to carry liquids',
        category: 'household_items',
    },
    {
        id: generateId(),
        text: 'plunger',
        translation: 'destapador',
        definition: 'a tool used to clear blocked pipes and drains',
        category: 'household_items',
    }
];
export const foodWords: WordItem[] = [
    {
        id: generateId(),
        text: 'bread',
        translation: 'pan',
        definition: 'a basic food made from flour, water, and yeast',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'cheese',
        translation: 'queso',
        definition: 'a food made from milk, often aged and fermented',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'apple',
        translation: 'manzana',
        definition: 'a round fruit with red, green, or yellow skin',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'chicken',
        translation: 'pollo',
        definition: 'a common type of poultry used for meat',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'rice',
        translation: 'arroz',
        definition: 'small white or brown grains used as a staple food',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'potato',
        translation: 'papa',
        definition: 'a starchy vegetable that grows underground',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'soup',
        translation: 'sopa',
        definition: 'a liquid food made by cooking ingredients in water',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'salad',
        translation: 'ensalada',
        definition: 'a mixture of raw vegetables, often with dressing',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'pasta',
        translation: 'pasta',
        definition: 'food made from flour and water, often in various shapes',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'fish',
        translation: 'pescado',
        definition: 'aquatic animals used for food',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'egg',
        translation: 'huevo',
        definition: 'an oval food laid by chickens and other birds',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'meat',
        translation: 'carne',
        definition: 'the flesh of animals used as food',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'butter',
        translation: 'mantequilla',
        definition: 'a dairy product made from cream',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'yogurt',
        translation: 'yogur',
        definition: 'a fermented dairy product with a creamy texture',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'sandwich',
        translation: 'sándwich',
        definition: 'food placed between slices of bread',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'pizza',
        translation: 'pizza',
        definition: 'a flat bread topped with sauce, cheese, and other ingredients',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'chocolate',
        translation: 'chocolate',
        definition: 'a sweet food made from cocoa beans',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'honey',
        translation: 'miel',
        definition: 'a sweet substance produced by bees',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'cereal',
        translation: 'cereal',
        definition: 'a breakfast food made from processed grains',
        category: 'food',
    },
    {
        id: generateId(),
        text: 'hamburger',
        translation: 'hamburguesa',
        definition: 'a ground meat patty served in a bun',
        category: 'food',
    }
];
// Base de datos de palabras por categoría
export const wordsDatabase: WordItem[] = [
    ...householdItems,
    ...foodWords
];

// Función para obtener palabras por categoría y dificultad
export const getWordsByCategories = (
    categories: WordCategory[],
    count: number,
): WordItem[] => {
    let filteredWords = wordsDatabase.filter(word =>
        categories.includes(word.category)
    );

    // Si no hay suficientes palabras, usamos todas las disponibles
    if (filteredWords.length < count) {
        filteredWords = wordsDatabase.filter(word =>
            categories.includes(word.category)
        );
    }

    // Barajar las palabras para obtener un conjunto aleatorio
    const shuffled = [...filteredWords].sort(() => 0.5 - Math.random());

    // Devolver la cantidad requerida o todas si hay menos
    return shuffled.slice(0, count);
};

// Función para generar opciones incorrectas para una palabra
export const generateOptions = (
    correctWord: WordItem,
    count: number,
    showTranslation: boolean
): string[] => {
    // Filtrar palabras de la misma categoría (excepto la correcta)
    const sameCategoryWords = wordsDatabase.filter(word =>
        word.category === correctWord.category &&
        word.id !== correctWord.id
    );

    // Si no hay suficientes de la misma categoría, usar cualquier otra
    let poolOfWords = sameCategoryWords.length >= count
        ? sameCategoryWords
        : wordsDatabase.filter(word => word.id !== correctWord.id);

    // Barajar las palabras
    const shuffled = [...poolOfWords].sort(() => 0.5 - Math.random());

    // Obtener las opciones incorrectas
    const wrongOptions = shuffled.slice(0, count - 1).map(word =>
        showTranslation ? word.translation : word.definition || word.translation
    );

    // Añadir la opción correcta
    const correctOption = showTranslation
        ? correctWord.translation
        : correctWord.definition || correctWord.translation;

    // Combinar y barajar de nuevo
    return [...wrongOptions, correctOption].sort(() => 0.5 - Math.random());
}; 