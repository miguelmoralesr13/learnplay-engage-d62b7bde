import { ColorItem, ColorLevel, DrawingObject } from '../types';
import { DifficultyLevel } from '@/types/game';

// Base de datos de colores
export const colorsDatabase: ColorItem[] = [
    // Colores básicos
    {
        name: 'red',
        translation: 'rojo',
        hexCode: '#FF0000',
        level: 'basic'
    },
    {
        name: 'blue',
        translation: 'azul',
        hexCode: '#0000FF',
        level: 'basic'
    },
    {
        name: 'yellow',
        translation: 'amarillo',
        hexCode: '#FFFF00',
        level: 'basic'
    },
    {
        name: 'green',
        translation: 'verde',
        hexCode: '#008000',
        level: 'basic'
    },
    // Colores intermedios
    {
        name: 'orange',
        translation: 'naranja',
        hexCode: '#FFA500',
        level: 'intermediate'
    },
    {
        name: 'purple',
        translation: 'morado',
        hexCode: '#800080',
        level: 'intermediate'
    },
    {
        name: 'pink',
        translation: 'rosa',
        hexCode: '#FFC0CB',
        level: 'intermediate'
    },
    {
        name: 'brown',
        translation: 'marrón',
        hexCode: '#A52A2A',
        level: 'intermediate'
    },
    // Colores avanzados
    {
        name: 'gray',
        translation: 'gris',
        hexCode: '#808080',
        level: 'advanced'
    },
    {
        name: 'black',
        translation: 'negro',
        hexCode: '#000000',
        level: 'advanced'
    },
    {
        name: 'white',
        translation: 'blanco',
        hexCode: '#FFFFFF',
        level: 'advanced'
    },
    {
        name: 'cyan',
        translation: 'cian',
        hexCode: '#00FFFF',
        level: 'advanced'
    },
    {
        name: 'magenta',
        translation: 'magenta',
        hexCode: '#FF00FF',
        level: 'advanced'
    },
    {
        name: 'turquoise',
        translation: 'turquesa',
        hexCode: '#40E0D0',
        level: 'advanced'
    }
];


// Función para obtener colores según el nivel y limitar el número
export const getColorsByLevel = (level: ColorLevel): ColorItem[] => {
    console.log(`DEBUG - getColorsByLevel llamado con nivel: ${level}`);

    // Filtrar colores por nivel
    const result = colorsDatabase.filter(color => {
        if (level === 'advanced') return true;
        if (level === 'intermediate') return color.level === 'basic' || color.level === 'intermediate';
        return color.level === 'basic';
    });

    console.log(`DEBUG - Colores filtrados por nivel ${level}:`, {
        filteredCount: result.length,
        filteredLevels: [...new Set(result.map(c => c.level))],
        filteredNames: result.map(c => c.name)
    });

    // Limitar el número de colores según el nivel
    const maxColors = level === 'advanced' ? 14 :
        level === 'intermediate' ? 8 : 4;

    // Si tenemos más colores de los permitidos, recortar
    let finalColors = result;
    if (result.length > maxColors) {
        finalColors = result.slice(0, maxColors);
        console.log(`DEBUG - Limitando colores a ${maxColors}:`, {
            before: result.length,
            after: finalColors.length,
            finalNames: finalColors.map(c => c.name)
        });
    }

    return finalColors;
};

// Función para obtener objetos según dificultad

// Función para verificar si se utilizaron los colores correctos
export const checkCorrectColors = (
    object: DrawingObject,
    usedColors: Set<string>
): boolean => {
    // Convertir a minúsculas para comparación insensible a mayúsculas/minúsculas
    const requiredColorsLower = object.requiredColors.map(c => c.toLowerCase());
    const usedColorsLower = Array.from(usedColors).map(c => c.toLowerCase());

    // Verificar que todos los colores requeridos fueron utilizados
    const allRequiredUsed = requiredColorsLower.every(requiredColor =>
        usedColorsLower.includes(requiredColor)
    );

    return allRequiredUsed;
};

// Nueva función para verificar que los objetos tienen sus colores disponibles
export const verifyObjectsHaveRequiredColors = (
    objects: DrawingObject[],
    availableColors: ColorItem[]
): boolean => {
    const availableColorNames = new Set(availableColors.map(c => c.name.toLowerCase()));

    const missingColors: Record<string, string[]> = {};
    let allColorsAvailable = true;

    objects.forEach(obj => {
        const missingForObject: string[] = [];

        obj.requiredColors.forEach(requiredColor => {
            if (!availableColorNames.has(requiredColor.toLowerCase())) {
                missingForObject.push(requiredColor);
                allColorsAvailable = false;
            }
        });

        if (missingForObject.length > 0) {
            missingColors[obj.name] = missingForObject;
        }
    });

    if (!allColorsAvailable) {
        console.warn("DEBUG - ⚠️ Algunos objetos no tienen todos sus colores requeridos:", missingColors);
    } else {
        console.log("DEBUG - ✅ Todos los objetos tienen sus colores requeridos disponibles");
    }

    return allColorsAvailable;
}; 