import { Sentence, Word } from '../types';
import { DifficultyLevel } from '@/types/game';
import { shuffle } from '@/lib/utils';
import { SentenceBuilderParameters } from '../types';

// Generador de IDs únicos
const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
};

// Convertir texto a objetos Word
const wordsFromText = (text: string): Word[] => {
    const words = text.split(' ').map((w) => ({
        id: generateId(),
        text: w,
        type: getWordType(w)
    }));
    return words;
};

// Función simple para determinar el tipo de palabra
const getWordType = (word: string): Word['type'] => {
    const articles = ['a', 'an', 'the'];
    const prepositions = ['in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'of', 'about'];
    const pronouns = ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];
    const conjunctions = ['and', 'but', 'or', 'so', 'because', 'if', 'when', 'while', 'though', 'although'];

    const lowercaseWord = word.toLowerCase().replace(/[.,!?;:]/, '');

    if (articles.includes(lowercaseWord)) return 'article';
    if (prepositions.includes(lowercaseWord)) return 'preposition';
    if (pronouns.includes(lowercaseWord)) return 'pronoun';
    if (conjunctions.includes(lowercaseWord)) return 'conjunction';

    // Simplificación - en un sistema real usaríamos NLP más avanzado
    if (lowercaseWord.endsWith('ly')) return 'adverb';
    if (lowercaseWord.endsWith('ing') || lowercaseWord.endsWith('ed')) return 'verb';
    if (lowercaseWord.endsWith('ful') || lowercaseWord.endsWith('ous')) return 'adjective';

    return 'other';
};

// Base de datos de oraciones
const createSentence = (text: string, translation: string, focus: string, hint: string, level: DifficultyLevel, alternativeTexts: string[] = []) => {
    // Generar palabras una sola vez
    const words = wordsFromText(text);

    // Usar esas mismas palabras para el orden correcto
    const correctOrder = words.map(w => w.id);

    // Para alternativas, necesitamos mapear las palabras originales
    const alternatives = alternativeTexts.map(altText => {
        // Crear un mapa de texto -> id basado en las palabras originales
        const wordMap = new Map<string, string>();
        words.forEach(w => wordMap.set(w.text.toLowerCase(), w.id));

        // Mapear cada palabra de la alternativa a su ID correspondiente
        return altText.split(' ').map(w => {
            const id = wordMap.get(w.toLowerCase());
            if (!id) console.warn(`Palabra "${w}" no encontrada en la oración original`);
            return id || '';
        });
    });

    return {
        id: `sen-${generateId()}`,
        words,
        correctOrder,
        translations: { es: translation },
        grammarFocus: focus,
        grammarHint: hint,
        alternatives: alternatives.length > 0 ? alternatives : undefined,
        level
    };
};

export const sentencesDatabase: Sentence[] = [
    // Oraciones nivel principiante (beginner)
    createSentence(
        'I eat breakfast every morning',
        'Yo desayuno todas las mañanas',
        'simple present',
        'Usamos el presente simple para rutinas y hábitos diarios',
        'beginner'
    ),
    createSentence(
        'He watches TV in the evening',
        'Él mira TV en la tarde',
        'simple present',
        'Para he/she/it agregamos -s/-es al verbo en presente simple',
        'beginner'
    ),
    createSentence(
        'We are studying English',
        'Nosotros estamos estudiando inglés',
        'present continuous',
        'Presente continuo: am/is/are + verbo con -ing para acciones en progreso',
        'beginner'
    ),
    createSentence(
        'My sister lives in London',
        'Mi hermana vive en Londres',
        'simple present',
        'Usamos el presente simple para estados o situaciones permanentes',
        'beginner'
    ),
    createSentence(
        'They play soccer on weekends',
        'Ellos juegan fútbol los fines de semana',
        'simple present',
        'El presente simple se usa para actividades regulares',
        'beginner'
    ),
    createSentence(
        'She is cooking dinner now',
        'Ella está cocinando la cena ahora',
        'present continuous',
        'Usamos el presente continuo para acciones que ocurren en este momento',
        'beginner'
    ),
    createSentence(
        'I like pizza and hamburgers',
        'Me gustan la pizza y las hamburguesas',
        'simple present',
        'Expresamos gustos y preferencias con el presente simple',
        'beginner'
    ),
    createSentence(
        'The bus arrives at 8 AM',
        'El autobús llega a las 8 AM',
        'simple present',
        'Usamos el presente simple para horarios establecidos',
        'beginner'
    ),
    createSentence(
        'My parents are working today',
        'Mis padres están trabajando hoy',
        'present continuous',
        'Present continuous para acciones temporales que ocurren ahora',
        'beginner'
    ),
    createSentence(
        'He speaks English and Spanish',
        'Él habla inglés y español',
        'simple present',
        'Presente simple para habilidades y capacidades generales',
        'beginner'
    ),
    createSentence(
        'I drink coffee in the morning',
        'Yo tomo café en la mañana',
        'simple present',
        'Presente simple para hábitos diarios',
        'beginner'
    ),
    createSentence(
        'She is reading a book',
        'Ella está leyendo un libro',
        'present continuous',
        'Presente continuo para acciones que ocurren en este momento',
        'beginner'
    ),
    createSentence(
        'They walk to school every day',
        'Ellos caminan a la escuela todos los días',
        'simple present',
        'Presente simple para rutinas diarias',
        'beginner'
    ),
    createSentence(
        'My brother likes ice cream',
        'A mi hermano le gusta el helado',
        'simple present',
        'Presente simple para expresar gustos',
        'beginner'
    ),
    createSentence(
        'We are eating dinner now',
        'Estamos cenando ahora',
        'present continuous',
        'Presente continuo para acciones en progreso',
        'beginner'
    ),
    createSentence(
        'The cat sleeps on the sofa',
        'El gato duerme en el sofá',
        'simple present',
        'Presente simple para hábitos de tercera persona singular',
        'beginner'
    ),
    createSentence(
        'I am learning English',
        'Estoy aprendiendo inglés',
        'present continuous',
        'Presente continuo para procesos de aprendizaje actuales',
        'beginner'
    ),
    createSentence(
        'She lives near the beach',
        'Ella vive cerca de la playa',
        'simple present',
        'Presente simple para estados permanentes',
        'beginner'
    ),
    createSentence(
        'They are playing video games',
        'Ellos están jugando videojuegos',
        'present continuous',
        'Presente continuo para actividades en curso',
        'beginner'
    ),
    createSentence(
        'The store opens at nine',
        'La tienda abre a las nueve',
        'simple present',
        'Presente simple para horarios establecidos',
        'beginner'
    ),

    // Oraciones nivel intermedio (intermediate)

    createSentence(
        'I have been living here for five years',
        'He estado viviendo aquí por cinco años',
        'present perfect continuous',
        'Usamos present perfect continuous para acciones que comenzaron en el pasado y continúan hasta ahora',
        'intermediate'
    ),
    createSentence(
        'If you study hard, you will pass the exam',
        'Si estudias duro, aprobarás el examen',
        'first conditional',
        'Primer condicional: if + presente simple, will + infinitivo para resultados probables',
        'intermediate'
    ),
    createSentence(
        'The movie was directed by Steven Spielberg',
        'La película fue dirigida por Steven Spielberg',
        'passive voice',
        'Voz pasiva: be + participio pasado cuando el objeto es más importante que el sujeto',
        'intermediate'
    ),
    createSentence(
        'She suggested going to the beach',
        'Ella sugirió ir a la playa',
        'gerund after verbs',
        'Después de ciertos verbos como suggest, recommend, enjoy, usamos gerundio',
        'intermediate'
    ),
    createSentence(
        'I wish I had more free time',
        'Desearía tener más tiempo libre',
        'wish + past simple',
        'Wish + pasado simple para expresar deseos sobre el presente',
        'intermediate'
    ),
    createSentence(
        'He must have forgotten about the meeting',
        'Él debe haber olvidado la reunión',
        'modal perfect',
        'Modal + have + participio pasado para especular sobre el pasado',
        'intermediate'
    ),
    createSentence(
        'The more you practice, the better you become',
        'Cuanto más practicas, mejor te vuelves',
        'comparative correlative',
        'The + comparativo, the + comparativo para expresar relaciones proporcionales',
        'intermediate'
    ),
    createSentence(
        'Despite feeling sick, she went to work',
        'A pesar de sentirse enferma, ella fue a trabajar',
        'despite + gerund',
        'Despite + gerundio para expresar contraste',
        'intermediate'
    ),
    createSentence(
        'I would rather stay at home than go out',
        'Preferiría quedarme en casa que salir',
        'would rather',
        'Would rather + infinitivo para expresar preferencias',
        'intermediate'
    ),
    createSentence(
        'She has had her car repaired',
        'Ella ha hecho reparar su auto',
        'causative have',
        'Have + objeto + participio pasado para acciones realizadas por otros',
        'intermediate'
    ),
    createSentence(
        'The project is expected to be finished next month',
        'Se espera que el proyecto esté terminado el próximo mes',
        'passive infinitive',
        'Be + participio pasado + infinitivo para expectativas pasivas',
        'intermediate'
    ),
    createSentence(
        'I am used to working late',
        'Estoy acostumbrado a trabajar hasta tarde',
        'be used to + gerund',
        'Be used to + gerundio para expresar hábitos o costumbres',
        'intermediate'
    ),
    createSentence(
        'You should have called me earlier',
        'Deberías haberme llamado antes',
        'modal perfect',
        'Modal + have + participio pasado para consejos sobre el pasado',
        'intermediate'
    ),
    createSentence(
        'The house needs to be painted',
        'La casa necesita ser pintada',
        'need + passive infinitive',
        'Need + to be + participio pasado para necesidades pasivas',
        'intermediate'
    ),
    createSentence(
        'I look forward to hearing from you',
        'Espero tener noticias tuyas',
        'preposition + gerund',
        'Look forward to + gerundio es una frase común en inglés formal',
        'intermediate'
    ),
    createSentence(
        'She managed to finish the project on time',
        'Ella logró terminar el proyecto a tiempo',
        'manage to + infinitive',
        'Manage to + infinitivo para expresar logro con esfuerzo',
        'intermediate'
    ),
    createSentence(
        'The children were made to clean their rooms',
        'Se hizo que los niños limpiaran sus habitaciones',
        'causative make',
        'Make + objeto + infinitivo para expresar obligación',
        'intermediate'
    ),
    createSentence(
        'I would prefer to stay indoors while it is raining',
        'Preferiría quedarme adentro mientras llueve',
        'would prefer',
        'Would prefer + infinitivo para expresar preferencias formales',
        'intermediate'
    ),
    createSentence(
        'He denied breaking the window',
        'Él negó haber roto la ventana',
        'verb + gerund',
        'Después de deny usamos gerundio',
        'intermediate'
    ),
    createSentence(
        'The meeting is supposed to start at 3 PM',
        'Se supone que la reunión empieza a las 3 PM',
        'be supposed to',
        'Be supposed to + infinitivo para expresar expectativas o planes',
        'intermediate'
    )
    ,

    // Oraciones nivel avanzado (advanced)
    createSentence(
        'Had I known about the consequences, I would have acted differently',
        'Si hubiera sabido sobre las consecuencias, habría actuado diferente',
        'third conditional inverted',
        'Inversión del tercer condicional: Had + sujeto + participio pasado para mayor formalidad',
        'advanced'
    ),
    createSentence(
        'Not until I arrived home did I realize I had lost my wallet',
        'No fue hasta que llegué a casa que me di cuenta que había perdido mi billetera',
        'negative inversion',
        'Inversión después de Not until: auxiliar + sujeto en la cláusula principal',
        'advanced'
    ),
    createSentence(
        'Seldom have I encountered such profound wisdom',
        'Raramente he encontrado tal profunda sabiduría',
        'adverb inversion',
        'Inversión con adverbios negativos al inicio de la oración',
        'advanced'
    ),
    createSentence(
        'No sooner had she finished the project than the client requested changes',
        'Apenas había terminado el proyecto cuando el cliente solicitó cambios',
        'no sooner inversion',
        'No sooner + inversión del pasado perfecto, than para la segunda cláusula',
        'advanced'
    ),
    createSentence(
        'Were you to ask me, I would strongly recommend against it',
        'Si me lo preguntaras, te recomendaría firmemente en contra',
        'conditional inversion',
        'Were + sujeto en lugar de If you were para un estilo más formal',
        'advanced'
    ),
    createSentence(
        'Not only did she excel in her studies, but she also managed to work part-time',
        'No solo sobresalió en sus estudios, sino que también logró trabajar medio tiempo',
        'not only inversion',
        'Inversión después de Not only, but also para énfasis',
        'advanced'
    ),
    createSentence(
        'Little did they know that their decision would have such far-reaching implications',
        'Poco sabían que su decisión tendría implicaciones tan trascendentales',
        'little inversion',
        'Inversión con Little al inicio para énfasis dramático',
        'advanced'
    ),
    createSentence(
        'Should you require any further assistance, please do not hesitate to contact us',
        'Si necesita ayuda adicional, por favor no dude en contactarnos',
        'conditional should',
        'Should + sujeto al inicio en lugar de If you should, común en inglés formal',
        'advanced'
    ),
    createSentence(
        'Under no circumstances are employees to share confidential information',
        'Bajo ninguna circunstancia los empleados deben compartir información confidencial',
        'negative expression inversion',
        'Inversión después de expresión negativa al inicio',
        'advanced'
    ),
    createSentence(
        'Only after thoroughly reviewing the document should you sign it',
        'Solo después de revisar minuciosamente el documento deberías firmarlo',
        'only inversion',
        'Only + frase adverbial causa inversión en la cláusula principal',
        'advanced'
    ),
    createSentence(
        'Such was the impact of his speech that it changed company policy',
        'Tal fue el impacto de su discurso que cambió la política de la empresa',
        'such inversion',
        'Such + be al inicio para énfasis, that para resultado',
        'advanced'
    ),
    createSentence(
        'Never before has technology advanced at such a rapid pace',
        'Nunca antes la tecnología ha avanzado a un ritmo tan rápido',
        'never before inversion',
        'Never before + auxiliar + sujeto para énfasis histórico',
        'advanced'
    ),
    createSentence(
        'Were it not for your help, the project would have failed',
        'Si no fuera por tu ayuda, el proyecto habría fracasado',
        'were it not for',
        'Were it not for es una estructura formal para expresar gratitud o dependencia',
        'advanced'
    ),
    createSentence(
        'So complex was the problem that it required expert consultation',
        'Tan complejo era el problema que requirió consulta experta',
        'so inversion',
        'So + adjetivo al inicio causa inversión, that para consecuencia',
        'advanced'
    ),
    createSentence(
        'Hardly had I stepped outside when it started to rain',
        'Apenas había salido cuando empezó a llover',
        'hardly inversion',
        'Hardly + pasado perfecto causa inversión, when para secuencia inmediata',
        'advanced'
    ),
    createSentence(
        'On no account should this information be disclosed to the public',
        'Bajo ningún concepto esta información debe ser revelada al público',
        'on no account inversion',
        'On no account + should + inversión para prohibición enfática',
        'advanced'
    ),
    createSentence(
        'Not since the Industrial Revolution has society undergone such dramatic changes',
        'No desde la Revolución Industrial la sociedad ha experimentado cambios tan dramáticos',
        'not since inversion',
        'Not since + frase nominal causa inversión en presente perfecto',
        'advanced'
    ),
    createSentence(
        'Rather than accept defeat, they chose to persevere',
        'En lugar de aceptar la derrota, eligieron perseverar',
        'rather than + bare infinitive',
        'Rather than + infinitivo sin to para contrastar acciones',
        'advanced'
    ),
    createSentence(
        'In no way does this compromise our standards of quality',
        'De ninguna manera esto compromete nuestros estándares de calidad',
        'in no way inversion',
        'In no way + auxiliar + sujeto para negación enfática',
        'advanced'
    ),
    createSentence(
        'Only by working together can we overcome these challenges',
        'Solo trabajando juntos podemos superar estos desafíos',
        'only + gerund inversion',
        'Only + frase gerundio causa inversión con modal can',
        'advanced'
    )
];

// Función para obtener oraciones según los parámetros
export function getSentencesByParameters(params: SentenceBuilderParameters): Sentence[] {
    const { difficulty, sentencesPerRound, showTranslation, showHints, shuffleFragments, maxAttemptsPerSentence } = params;

    // Filtrar primero por nivel
    let filteredSentences = sentencesDatabase.filter(sentence => sentence.level === difficulty.value);



    // Limitamos al número de oraciones por ronda
    const shuffledSentences = shuffle([...filteredSentences]);
    return shuffledSentences.slice(0, sentencesPerRound || 3);
}

// Comprobar si la respuesta del usuario es correcta
export const checkSentenceOrder = (
    sentence: Sentence,
    userOrder: string[]
): boolean => {
    // Comprobar contra el orden principal
    if (arraysEqual(userOrder, sentence.correctOrder)) {
        return true;
    }

    // Comprobar contra alternativas si existen
    if (sentence.alternatives && sentence.alternatives.length > 0) {
        return sentence.alternatives.some(alt => arraysEqual(userOrder, alt));
    }

    return false;
};

// Función auxiliar para comparar arrays
const arraysEqual = (a: string[], b: string[]): boolean => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

// Obtener texto de una oración a partir de los IDs
export const getSentenceText = (sentence: Sentence, orderIds: string[]): string => {
    // Crear un mapa para búsqueda rápida
    const wordMap = new Map<string, Word>();
    sentence.words.forEach(word => {
        wordMap.set(word.id, word);
    });

    // Construir el texto
    return orderIds.map(id => wordMap.get(id)?.text || '').join(' ');
}; 