import { getColorsByLevel } from './colorData';
import { DrawingObject, ColorLevel } from '../types';
import { DifficultyLevel } from '@/types/game';


const ObjectEasy: DrawingObject[] = [
    {
        id: 'apple',
        name: 'Manzana',
        translation: 'Apple',
        description: 'Una fruta roja o verde',
        difficulty: 'beginner',
        requiredColors: ['red', 'green']
    },
    {
        id: 'banana',
        name: 'Plátano',
        translation: 'Banana',
        description: 'Una fruta amarilla',
        difficulty: 'beginner',
        requiredColors: ['yellow']
    },
    {
        id: 'strawberry',
        name: 'Fresa',
        translation: 'Strawberry',
        description: 'Una fruta roja con semillas',
        difficulty: 'beginner',
        requiredColors: ['red']
    },
    {
        id: 'leaf',
        name: 'Hoja',
        translation: 'Leaf',
        description: 'Parte verde de una planta',
        difficulty: 'beginner',
        requiredColors: ['green']
    },
    {
        id: 'sun',
        name: 'Sol',
        translation: 'Sun',
        description: 'Una estrella amarilla',
        difficulty: 'beginner',
        requiredColors: ['yellow']
    },
    {
        id: 'blueberry',
        name: 'Arándano',
        translation: 'Blueberry',
        description: 'Una pequeña fruta azul',
        difficulty: 'beginner',
        requiredColors: ['blue']
    },
    {
        id: 'traffic_light',
        name: 'Semáforo',
        translation: 'Traffic light',
        description: 'Luz roja, amarilla y verde',
        difficulty: 'beginner',
        requiredColors: ['red', 'yellow', 'green']
    },
    {
        id: 'lemon',
        name: 'Limón',
        translation: 'Lemon',
        description: 'Una fruta amarilla y ácida',
        difficulty: 'beginner',
        requiredColors: ['yellow']
    },
    {
        id: 'grass',
        name: 'Césped',
        translation: 'Grass',
        description: 'Planta verde que cubre el suelo',
        difficulty: 'beginner',
        requiredColors: ['green']
    },
    {
        id: 'tomato',
        name: 'Tomate',
        translation: 'Tomato',
        description: 'Una fruta roja utilizada en ensaladas',
        difficulty: 'beginner',
        requiredColors: ['red']
    },
    {
        id: 'sky_day',
        name: 'Cielo diurno',
        translation: 'Day sky',
        description: 'Cielo azul durante el día',
        difficulty: 'beginner',
        requiredColors: ['blue']
    },
    {
        id: 'lime',
        name: 'Lima',
        translation: 'Lime',
        description: 'Una fruta verde y ácida',
        difficulty: 'beginner',
        requiredColors: ['green']
    },
    {
        id: 'fire_truck',
        name: 'Camión de bomberos',
        translation: 'Fire truck',
        description: 'Vehículo rojo utilizado por bomberos',
        difficulty: 'beginner',
        requiredColors: ['red']
    },
    {
        id: 'sunflower',
        name: 'Girasol',
        translation: 'Sunflower',
        description: 'Una flor amarilla',
        difficulty: 'beginner',
        requiredColors: ['yellow']
    },
    {
        id: 'blue_jay',
        name: 'Arrendajo azul',
        translation: 'Blue jay',
        description: 'Un pájaro azul',
        difficulty: 'beginner',
        requiredColors: ['blue']
    },
    {
        id: 'cucumber',
        name: 'Pepino',
        translation: 'Cucumber',
        description: 'Una verdura verde',
        difficulty: 'beginner',
        requiredColors: ['green']
    },
    {
        id: 'stop_sign',
        name: 'Señal de stop',
        translation: 'Stop sign',
        description: 'Señal roja de tráfico',
        difficulty: 'beginner',
        requiredColors: ['red']
    },
    {
        id: 'daffodil',
        name: 'Narciso',
        translation: 'Daffodil',
        description: 'Una flor amarilla',
        difficulty: 'beginner',
        requiredColors: ['yellow']
    },
    {
        id: 'ocean',
        name: 'Océano',
        translation: 'Ocean',
        description: 'Agua azul del océano',
        difficulty: 'beginner',
        requiredColors: ['blue']
    },
    {
        id: 'watermelon',
        name: 'Sandía',
        translation: 'Watermelon',
        description: 'Una fruta verde por fuera y roja por dentro',
        difficulty: 'beginner',
        requiredColors: ['green', 'red']
    }
]
const ObjectsMedium: DrawingObject[] = [
    {
        id: 'rainbow',
        name: 'Arcoíris',
        translation: 'Rainbow',
        description: 'Un arcoíris de colores',
        difficulty: 'intermediate',
        requiredColors: ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
    },
    {
        id: 'fruit_basket',
        name: 'Cesta de frutas',
        translation: 'Fruit basket',
        description: 'Una cesta con frutas variadas',
        difficulty: 'intermediate',
        requiredColors: ['red', 'green', 'yellow', 'orange', 'brown']
    },
    {
        id: 'sunset',
        name: 'Atardecer',
        translation: 'Sunset',
        description: 'Un cielo al atardecer con colores cálidos',
        difficulty: 'intermediate',
        requiredColors: ['red', 'orange', 'yellow', 'purple', 'pink']
    },
    {
        id: 'parrot',
        name: 'Loro',
        translation: 'Parrot',
        description: 'Un pájaro con plumas coloridas',
        difficulty: 'intermediate',
        requiredColors: ['green', 'yellow', 'red', 'blue', 'orange']
    },
    {
        id: 'ice_cream',
        name: 'Helado',
        translation: 'Ice cream',
        description: 'Un helado con varios sabores',
        difficulty: 'intermediate',
        requiredColors: ['pink', 'brown', 'yellow', 'green', 'red']
    },
    {
        id: 'butterfly',
        name: 'Mariposa',
        translation: 'Butterfly',
        description: 'Una mariposa con alas coloridas',
        difficulty: 'intermediate',
        requiredColors: ['blue', 'purple', 'yellow', 'orange', 'pink']
    },
    {
        id: 'flower_garden',
        name: 'Jardín de flores',
        translation: 'Flower garden',
        description: 'Un jardín con flores de varios colores',
        difficulty: 'intermediate',
        requiredColors: ['red', 'yellow', 'pink', 'purple', 'green']
    },
    {
        id: 'cupcake',
        name: 'Magdalena',
        translation: 'Cupcake',
        description: 'Un pastelito con decoraciones coloridas',
        difficulty: 'intermediate',
        requiredColors: ['pink', 'brown', 'yellow', 'green', 'purple']
    },
    {
        id: 'hot_air_balloon',
        name: 'Globo aerostático',
        translation: 'Hot air balloon',
        description: 'Un globo aerostático con colores vibrantes',
        difficulty: 'intermediate',
        requiredColors: ['red', 'blue', 'yellow', 'orange', 'purple']
    },
    {
        id: 'candy',
        name: 'Caramelo',
        translation: 'Candy',
        description: 'Un caramelo con colores brillantes',
        difficulty: 'intermediate',
        requiredColors: ['red', 'yellow', 'green', 'pink', 'orange']
    },
    {
        id: 'tropical_fish',
        name: 'Pez tropical',
        translation: 'Tropical fish',
        description: 'Un pez con escamas de colores',
        difficulty: 'intermediate',
        requiredColors: ['blue', 'yellow', 'orange', 'green', 'purple']
    },
    {
        id: 'autumn_tree',
        name: 'Árbol de otoño',
        translation: 'Autumn tree',
        description: 'Un árbol con hojas de colores otoñales',
        difficulty: 'intermediate',
        requiredColors: ['red', 'orange', 'yellow', 'brown', 'green']
    },
    {
        id: 'kite',
        name: 'Cometa',
        translation: 'Kite',
        description: 'Una cometa volando en el cielo',
        difficulty: 'intermediate',
        requiredColors: ['red', 'blue', 'yellow', 'green', 'purple']
    },
    {
        id: 'sundae',
        name: 'Helado sundae',
        translation: 'Sundae',
        description: 'Un helado con toppings coloridos',
        difficulty: 'intermediate',
        requiredColors: ['brown', 'pink', 'yellow', 'green', 'red']
    },
    {
        id: 'abstract_art',
        name: 'Arte abstracto',
        translation: 'Abstract art',
        description: 'Una obra de arte con formas y colores variados',
        difficulty: 'intermediate',
        requiredColors: ['red', 'blue', 'yellow', 'purple', 'orange', 'green']
    },
    {
        id: 'beach_umbrella',
        name: 'Sombrilla de playa',
        translation: 'Beach umbrella',
        description: 'Una sombrilla con rayas de colores',
        difficulty: 'intermediate',
        requiredColors: ['red', 'yellow', 'blue', 'green', 'orange']
    },
    {
        id: 'birthday_cake',
        name: 'Pastel de cumpleaños',
        translation: 'Birthday cake',
        description: 'Un pastel decorado con colores festivos',
        difficulty: 'intermediate',
        requiredColors: ['pink', 'blue', 'yellow', 'green', 'purple']
    },
    {
        id: 'colorful_socks',
        name: 'Calcetines coloridos',
        translation: 'Colorful socks',
        description: 'Un par de calcetines con rayas de colores',
        difficulty: 'intermediate',
        requiredColors: ['red', 'blue', 'yellow', 'green', 'orange']
    },
    {
        id: 'mosaic',
        name: 'Mosaico',
        translation: 'Mosaic',
        description: 'Un mosaico con piezas de colores',
        difficulty: 'intermediate',
        requiredColors: ['red', 'blue', 'yellow', 'green', 'purple', 'orange']
    },
    {
        id: 'playground',
        name: 'Parque infantil',
        translation: 'Playground',
        description: 'Un parque con juegos coloridos',
        difficulty: 'intermediate',
        requiredColors: ['red', 'blue', 'yellow', 'green', 'orange', 'purple']
    }
]
const ObjectHard: DrawingObject[] = [
    {
        id: 'peacock',
        name: 'Pavo real',
        translation: 'Peacock',
        description: 'Un ave con plumas coloridas y detalladas',
        difficulty: 'advanced',
        requiredColors: ['blue', 'green', 'turquoise', 'purple', 'cyan', 'magenta', 'black', 'white']
    },
    {
        id: 'rainbow_landscape',
        name: 'Paisaje arcoíris',
        translation: 'Rainbow landscape',
        description: 'Un paisaje con todos los colores del arcoíris',
        difficulty: 'advanced',
        requiredColors: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'cyan', 'magenta']
    },
    {
        id: 'kaleidoscope',
        name: 'Caleidoscopio',
        translation: 'Kaleidoscope',
        description: 'Un diseño simétrico y colorido',
        difficulty: 'advanced',
        requiredColors: ['red', 'blue', 'yellow', 'green', 'purple', 'orange', 'pink', 'cyan', 'magenta', 'black', 'white']
    },
    {
        id: 'tropical_reef',
        name: 'Arrecife tropical',
        translation: 'Tropical reef',
        description: 'Un arrecife con corales y peces coloridos',
        difficulty: 'advanced',
        requiredColors: ['blue', 'green', 'yellow', 'orange', 'pink', 'purple', 'cyan', 'turquoise', 'red']
    },
    {
        id: 'festival_costume',
        name: 'Traje de festival',
        translation: 'Festival costume',
        description: 'Un traje lleno de colores y detalles',
        difficulty: 'advanced',
        requiredColors: ['red', 'blue', 'yellow', 'green', 'purple', 'pink', 'orange', 'magenta', 'cyan', 'black', 'white']
    },
    {
        id: 'abstract_painting',
        name: 'Pintura abstracta',
        translation: 'Abstract painting',
        description: 'Una obra de arte con colores y formas variadas',
        difficulty: 'advanced',
        requiredColors: ['red', 'blue', 'yellow', 'green', 'purple', 'orange', 'pink', 'cyan', 'magenta', 'black', 'white', 'gray']
    },
    {
        id: 'colorful_market',
        name: 'Mercado colorido',
        translation: 'Colorful market',
        description: 'Un mercado lleno de productos y decoraciones vibrantes',
        difficulty: 'advanced',
        requiredColors: ['red', 'blue', 'yellow', 'green', 'orange', 'purple', 'pink', 'brown', 'cyan', 'magenta', 'black', 'white']
    },
    {
        id: 'fantasy_creature',
        name: 'Criatura fantástica',
        translation: 'Fantasy creature',
        description: 'Una criatura mítica con colores únicos',
        difficulty: 'advanced',
        requiredColors: ['green', 'blue', 'purple', 'cyan', 'magenta', 'pink', 'orange', 'black', 'white']
    },
    {
        id: 'neon_cityscape',
        name: 'Paisaje urbano neón',
        translation: 'Neon cityscape',
        description: 'Una ciudad iluminada con luces de neón',
        difficulty: 'advanced',
        requiredColors: ['blue', 'pink', 'cyan', 'magenta', 'purple', 'green', 'yellow', 'red', 'black', 'white']
    },
    {
        id: 'mardi_gras',
        name: 'Mardi Gras',
        translation: 'Mardi Gras',
        description: 'Una celebración con disfraces y decoraciones coloridas',
        difficulty: 'advanced',
        requiredColors: ['purple', 'green', 'yellow', 'blue', 'pink', 'orange', 'red', 'magenta', 'cyan', 'black', 'white']
    },
    {
        id: 'underwater_world',
        name: 'Mundo submarino',
        translation: 'Underwater world',
        description: 'Un fondo marino lleno de vida y colores',
        difficulty: 'advanced',
        requiredColors: ['blue', 'green', 'turquoise', 'cyan', 'purple', 'pink', 'yellow', 'orange', 'red', 'black', 'white']
    },
    {
        id: 'color_wheel',
        name: 'Rueda de colores',
        translation: 'Color wheel',
        description: 'Una rueda con todos los colores del espectro',
        difficulty: 'advanced',
        requiredColors: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'cyan', 'magenta', 'black', 'white']
    },
    {
        id: 'festive_parade',
        name: 'Desfile festivo',
        translation: 'Festive parade',
        description: 'Un desfile con decoraciones y disfraces coloridos',
        difficulty: 'advanced',
        requiredColors: ['red', 'blue', 'yellow', 'green', 'purple', 'pink', 'orange', 'cyan', 'magenta', 'black', 'white']
    },
    {
        id: 'galaxy',
        name: 'Galaxia',
        translation: 'Galaxy',
        description: 'Una galaxia con estrellas y nebulosas coloridas',
        difficulty: 'advanced',
        requiredColors: ['blue', 'purple', 'pink', 'cyan', 'magenta', 'black', 'white', 'gray', 'yellow', 'orange']
    },
    {
        id: 'carnival_mask',
        name: 'Máscara de carnaval',
        translation: 'Carnival mask',
        description: 'Una máscara decorada con colores vibrantes',
        difficulty: 'advanced',
        requiredColors: ['red', 'blue', 'yellow', 'green', 'purple', 'pink', 'orange', 'cyan', 'magenta', 'black', 'white']
    },
    {
        id: 'colorful_mosaic',
        name: 'Mosaico colorido',
        translation: 'Colorful mosaic',
        description: 'Un mosaico con piezas de todos los colores',
        difficulty: 'advanced',
        requiredColors: ['red', 'blue', 'yellow', 'green', 'purple', 'pink', 'orange', 'cyan', 'magenta', 'black', 'white', 'gray']
    },
    {
        id: 'fantasy_castle',
        name: 'Castillo fantástico',
        translation: 'Fantasy castle',
        description: 'Un castillo con detalles y colores mágicos',
        difficulty: 'advanced',
        requiredColors: ['purple', 'blue', 'pink', 'cyan', 'magenta', 'green', 'yellow', 'orange', 'black', 'white']
    },
    {
        id: 'neon_sign',
        name: 'Letrero de neón',
        translation: 'Neon sign',
        description: 'Un letrero brillante con luces de neón',
        difficulty: 'advanced',
        requiredColors: ['blue', 'pink', 'cyan', 'magenta', 'purple', 'green', 'yellow', 'red', 'black', 'white']
    },
    {
        id: 'colorful_sunset',
        name: 'Atardecer colorido',
        translation: 'Colorful sunset',
        description: 'Un atardecer con todos los colores del espectro',
        difficulty: 'advanced',
        requiredColors: ['red', 'orange', 'yellow', 'pink', 'purple', 'blue', 'cyan', 'magenta', 'black', 'white']
    },
    {
        id: 'prism',
        name: 'Prisma',
        translation: 'Prism',
        description: 'Un prisma que descompone la luz en colores',
        difficulty: 'advanced',
        requiredColors: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'cyan', 'magenta', 'black', 'white']
    }
]
// Definir los objetos disponibles para dibujar
export const ALL_OBJECTS: DrawingObject[] = [
    ...ObjectEasy,
    ...ObjectsMedium,
    ...ObjectHard,

];

// Función para obtener objetos según la dificultad y el nivel de color
export const getObjectsByDifficulty = (
    difficulty: DifficultyLevel,
    count: number,
    colorLevel?: ColorLevel // Parámetro opcional
): DrawingObject[] => {
    // Si no se proporciona nivel de color, usar un valor predeterminado
    const level = colorLevel || 'basic';

    // Obtener colores disponibles en este nivel
    const availableColors = getColorsByLevel(level);
    const availableColorNames = new Set(availableColors.map(color => color.name));

    // Filtrar objetos cuyos colores requeridos estén disponibles en este nivel
    const filteredObjects = ALL_OBJECTS.filter(obj => {
        return obj.requiredColors.every(colorName => availableColorNames.has(colorName));
    });

    // Filtrar por dificultad
    let difficultyFilteredObjects = filteredObjects;

    if (difficulty === 'beginner') {
        difficultyFilteredObjects = filteredObjects.filter(obj => obj.requiredColors.length <= 2);
    } else if (difficulty === 'intermediate') {
        difficultyFilteredObjects = filteredObjects.filter(obj =>
            obj.requiredColors.length > 1 && obj.requiredColors.length <= 3
        );
    } else { // hard
        difficultyFilteredObjects = filteredObjects.filter(obj => obj.requiredColors.length >= 2);
    }

    // Si no hay suficientes objetos después del filtrado, usar los objetos con menos colores requeridos
    if (difficultyFilteredObjects.length < count) {
        const sortedByColorCount = filteredObjects.sort(
            (a, b) => a.requiredColors.length - b.requiredColors.length
        );
        difficultyFilteredObjects = sortedByColorCount;
    }

    // Seleccionar objetos al azar
    const shuffled = [...difficultyFilteredObjects].sort(() => Math.random() - 0.5);
    const result = shuffled.slice(0, Math.min(count, shuffled.length));

    // Si solo hay 1 objeto, duplicarlo (como solución temporal)
    if (result.length === 1) {
        console.log("Solo hay 1 objeto disponible, usando el mismo objeto dos veces");
        result.push({ ...result[0], id: result[0].id + '-copy' });
    }

    return result;
}; 