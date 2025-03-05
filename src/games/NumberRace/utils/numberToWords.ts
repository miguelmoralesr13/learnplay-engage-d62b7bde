const units = [
    '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
    'seventeen', 'eighteen', 'nineteen'
];

const tens = [
    '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

/**
 * Convierte un número a su representación en palabras en inglés
 */
export function numberToWords(num: number): string {
    if (num === 0) return 'zero';

    if (num < 0) return `negative ${numberToWords(Math.abs(num))}`;

    let words = '';

    // Manejar miles
    if (num >= 1000) {
        words += `${numberToWords(Math.floor(num / 1000))} thousand`;
        num %= 1000;
        if (num > 0) words += ' ';
    }

    // Manejar cientos
    if (num >= 100) {
        words += `${units[Math.floor(num / 100)]} hundred`;
        num %= 100;
        if (num > 0) words += ' and ';
    }

    // Manejar decenas y unidades
    if (num > 0) {
        if (num < 20) {
            words += units[num];
        } else {
            words += tens[Math.floor(num / 10)];
            if (num % 10 > 0) {
                words += `-${units[num % 10]}`;
            }
        }
    }

    return words;
}

/**
 * Normaliza una respuesta para compararla con la respuesta correcta
 */
export function normalizeAnswer(answer: string): string {
    return answer
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\s+and\s+/g, ' and ')
        .replace(/\s*-\s*/g, '-');
}

/**
 * Verifica si la respuesta del usuario es correcta
 */
export function checkAnswer(userAnswer: string, number: number): boolean {
    const correctAnswer = numberToWords(number);
    const normalizedUserAnswer = normalizeAnswer(userAnswer);
    const normalizedCorrectAnswer = normalizeAnswer(correctAnswer);

    return normalizedUserAnswer === normalizedCorrectAnswer;
} 