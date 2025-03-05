import { numberToWords } from './numberToWords';

/**
 * Genera pistas progresivas para la escritura de números en inglés
 */
export function generateHint(number: number, level: number): string {
    const correctAnswer = numberToWords(number);

    // Nivel 1: Mostrar primera letra de cada palabra y la estructura
    if (level === 1) {
        return correctAnswer
            .split(' ')
            .map(word => {
                // Para palabras compuestas con guiones
                if (word.includes('-')) {
                    return word
                        .split('-')
                        .map(part => part.charAt(0) + '_'.repeat(part.length - 1))
                        .join('-');
                }
                return word.charAt(0) + '_'.repeat(word.length - 1);
            })
            .join(' ');
    }

    // Nivel 2: Mostrar la mitad de las letras
    if (level === 2) {
        const words = correctAnswer.split(' ');
        return words
            .map(word => {
                // Para palabras compuestas con guiones
                if (word.includes('-')) {
                    return word
                        .split('-')
                        .map(part => {
                            const halfLength = Math.ceil(part.length / 2);
                            return part.substring(0, halfLength) +
                                '_'.repeat(part.length - halfLength);
                        })
                        .join('-');
                }

                const halfLength = Math.ceil(word.length / 2);
                return word.substring(0, halfLength) + '_'.repeat(word.length - halfLength);
            })
            .join(' ');
    }

    // Nivel 3: Dar una pista más estructural o regla gramatical
    if (level === 3) {
        if (number < 20) {
            return "Este es un número simple (del 1 al 19). Recuerda que cada uno tiene su propia palabra única.";
        } else if (number < 100) {
            return "Este es un número de dos dígitos (20-99). Recuerda: [decena]-[unidad]. Ejemplo: 21 = twenty-one";
        } else if (number < 1000) {
            return "Número de tres dígitos. Estructura: [centena] hundred + and + [resto]. Ejemplo: 101 = one hundred and one";
        } else {
            return "Número grande. Estructura: [millar] thousand + [resto]. Ejemplo: 1001 = one thousand and one";
        }
    }

    return "No hay pista disponible";
} 