import { FormDefinition } from '@/types/parameterForm';
import { NUMBER_RANGES } from '@/games/NumberRace/config';
import MinimalPairsConfig from '@/games/MinimalPairs/config';
import { IGame } from '@/types/game';
import { NumberRaceParameters } from '../NumberRace/types';
import { WordMatchParameters } from '../WordMatch/types';
import { SentenceBuilderParameters } from '../SentenceBuilder/types';
import { VerbFormsParameters } from '../VerbForms/types';
import { PaintDrawingParameters } from '../PaintDrawingGame/types';

// Clase Factory para crear definiciones de formulario específicos para cada juego
export class ParameterFormFactory {
    // Método estático para crear la definición del formulario según el ID del juego
    static createFormDefinition(gameConfig: IGame): FormDefinition {
        // Usar el ID específico del juego para seleccionar el formulario adecuado
        const gameId = gameConfig.id;
        console.log('gameId', gameId);

        switch (gameId) {
            case 'number-race':
                return ParameterFormFactory.createNumberRaceForm(gameConfig);
            case 'word-match':
                return ParameterFormFactory.createWordMatchForm(gameConfig);
            case 'word-rush':
                return ParameterFormFactory.createWordRushForm(gameConfig);
            case 'sentence-builder':
                return ParameterFormFactory.createSentenceBuilderForm(gameConfig);
            case 'spelling-bee':
                return ParameterFormFactory.createSpellingBeeForm(gameConfig);
            case 'verb-forms':
                return ParameterFormFactory.createVerbFormsForm(gameConfig);
            case 'paint-drawing':
                return ParameterFormFactory.createPaintDrawingForm(gameConfig);
            case 'minimal-pairs':
                return ParameterFormFactory.createMinimalPairsForm(gameConfig);
            case 'speak-and-score':
                return ParameterFormFactory.createSpeakAndScoreForm(gameConfig);
            case 'tongue-twisters':
                return ParameterFormFactory.createTongueTwistersForm(gameConfig);
            case 'simon-says':
                return ParameterFormFactory.createSimonSaysForm(gameConfig);
            // Agregar más casos específicos aquí
            default:
                // Formulario genérico por defecto
                return {
                    id: 'default-form',
                    title: 'Game Configuration',
                    fields: [
                        {
                            name: 'difficulty',
                            label: 'Difficulty',
                            type: 'customSelect',
                            options: [
                                { value: 'beginner', label: 'Beginner' },
                                { value: 'intermediate', label: 'Intermediate' },
                                { value: 'advanced', label: 'Advanced' },
                            ],
                            defaultValue: 'beginner',
                            description: 'Choose the difficulty level'
                        }
                    ]
                };
        }
    }


    // Método para crear formulario específico de NumberRace
    private static createNumberRaceForm(gameConfig: IGame<NumberRaceParameters>): FormDefinition {
        return {
            id: 'number-race-form',
            title: 'Number Race Configuration',
            fields: [
                {
                    name: 'difficulty',
                    label: 'Difficulty',
                    size: 'col-span-2 md:col-span-1',
                    type: 'customSelect',
                    options: [
                        { value: 'beginner', label: 'Beginner (Numbers 1-10)' },
                        { value: 'intermediate', label: 'Intermediate (Numbers 10-1,000)' },
                        { value: 'advanced', label: 'Advanced (Numbers 1,000-1,000,000)' },
                    ],
                    defaultValue: gameConfig.parameters.difficulty || { label: 'Dificultad', value: 'beginner' },
                    description: 'Choose the difficulty level'
                },
                {
                    name: 'enableTimer',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Enable Timer',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.enableTimer || true,
                    description: 'Play with a timer for extra challenge'
                },
                {
                    name: 'numbersToFinish',
                    label: 'Numbers to Complete a Lap',
                    type: 'range',
                    step: 5,
                    min: 5,
                    max: 20,
                    defaultValue: gameConfig.parameters.numbersToFinish || 5,
                    description: 'How many correct answers to complete one lap'
                }
            ]
        };
    }

    // Método para crear formulario específico de WordMatch
    private static createWordMatchForm(gameConfig: IGame<WordMatchParameters>): FormDefinition {
        return {
            id: 'word-match-form',
            title: 'Word Match Configuration',
            fields: [
                {
                    name: 'difficulty',
                    label: 'Difficulty',
                    type: 'customSelect',
                    size: 'col-span-2 md:col-span-1',
                    options: [
                        { value: 'beginner', label: 'Beginner' },
                        { value: 'intermediate', label: 'Intermediate' },
                        { value: 'advanced', label: 'Advanced' },
                    ],
                    defaultValue: gameConfig.parameters.difficulty || { label: 'Dificultad', value: 'beginner' },
                    description: 'Choose the difficulty level'
                },
                {
                    name: 'timerEnabled',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Enable Timer',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.timerEnabled || true
                },
                {
                    name: 'pairCount',
                    label: 'Number of Pairs',
                    type: 'range',
                    min: 2,
                    max: 12,
                    step: 4,
                    defaultValue: gameConfig.parameters.pairCount || 4
                }
            ]
        };
    }

    // Método para crear formulario específico de WordRush
    private static createWordRushForm(gameConfig: IGame): FormDefinition {
        return {
            id: 'word-rush-form',
            title: 'Word Rush Configuration',
            fields: [
                {
                    name: 'categories',
                    label: 'Word Categories',
                    type: 'multiselect',
                    options: gameConfig.parameters.categories,
                    defaultValue: gameConfig.parameters.categories || [],
                    description: 'Select at least one word category'
                },
                {
                    name: 'timerEnabled',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Enable Timer',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.timerEnabled || true,
                    description: 'Play with a timer for extra challenge'
                },
                {
                    name: 'wordsPerRound',
                    label: 'Words Per Round',
                    type: 'range',
                    step: 5,
                    min: 5,
                    max: 20,
                    defaultValue: gameConfig.parameters.wordsPerRound || 5,
                    description: 'Number of words to complete each round'
                },
                {
                    name: 'timePerWord',
                    label: 'Time Per Word (seconds)',
                    type: 'number',
                    step: 1,
                    min: 3,
                    max: 15,
                    defaultValue: gameConfig.parameters.timePerWord || 3,
                    description: 'Time allowed for each word'
                }
            ]
        };
    }

    // Método específico para SentenceBuilder
    private static createSentenceBuilderForm(gameConfig: IGame<SentenceBuilderParameters>): FormDefinition {
        return {
            id: 'sentence-builder-form',
            title: 'Sentence Builder Configuration',
            fields: [
                {
                    name: 'difficulty',
                    label: 'Difficulty',
                    size: 'col-span-2 md:col-span-1',
                    type: 'customSelect',
                    options: [
                        { value: 'beginner', label: 'Beginner' },
                        { value: 'intermediate', label: 'Intermediate' },
                        { value: 'advanced', label: 'Advanced' },
                    ],
                    defaultValue: gameConfig.parameters.difficulty || { label: 'Dificultad', value: 'intermediate' },
                    description: 'Choose the difficulty level'
                },
                {
                    name: 'timerEnabled',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Enable Timer',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.timerEnabled !== undefined ? gameConfig.parameters.timerEnabled : true,
                    description: 'Play with a timer for extra challenge'
                },
                {
                    name: 'sentencesPerRound',
                    label: 'Sentences Per Round',
                    size: 'col-span-2 md:col-span-1',
                    type: 'range',
                    min: 1,
                    max: 20,
                    defaultValue: gameConfig.parameters.sentencesPerRound || 3,
                    description: 'Number of sentences to practice'
                },
                {
                    name: 'timeLimit',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Time Limit (seconds)',
                    type: 'range',
                    min: 30,
                    max: 600,
                    step: 30,
                    defaultValue: gameConfig.parameters.timeLimit || 300,
                    description: 'Total time to complete all sentences'
                },
                {
                    name: 'showHints',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Show Hints',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.showHints !== undefined ? gameConfig.parameters.showHints : true,
                    description: 'Show helpful grammar hints when needed'
                },
                {
                    name: 'showTranslation',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Show Translation',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.showTranslation !== undefined ? gameConfig.parameters.showTranslation : true,
                    description: 'Show sentence translation after completion'
                }
            ]
        };
    }

    // Método específico para SpellingBee
    private static createSpellingBeeForm(gameConfig: IGame): FormDefinition {
        return {
            id: 'spelling-bee-form',
            title: 'Spelling Bee Configuration',
            fields: [
                {
                    name: 'categories',
                    label: 'Word Categories',
                    type: 'multiselect',
                    options: gameConfig.parameters.categories,
                    defaultValue: gameConfig.parameters.categories || ['commonWords'],
                    description: 'Select at least one word category'
                },
                {
                    name: 'useHints',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Enable Hints',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.useHints || true
                },
                {
                    name: 'showDefinition',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Show Definition',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.showDefinition || true
                },
                {
                    name: 'wordsPerRound',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Words Per Round',
                    type: 'range',
                    step: 5,
                    min: 5,
                    max: 20,
                    defaultValue: gameConfig.parameters.wordsPerRound || 5
                },
                {
                    name: 'maxAttempts',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Max Attempts Per Word',
                    type: 'range',
                    step: 1,
                    min: 1,
                    max: 5,
                    defaultValue: gameConfig.parameters.maxAttempts || 3
                },
            ]
        };
    }

    // Método para crear formulario específico de VerbForms
    private static createVerbFormsForm(gameConfig: IGame<VerbFormsParameters>): FormDefinition {
        return {
            id: 'verb-forms-form',
            title: 'Verb Forms Configuration',
            fields: [
                {
                    name: 'difficulty',
                    label: 'Game Difficulty',
                    size: 'col-span-2 md:col-span-1',
                    type: 'customSelect',
                    options: [
                        { value: 'beginner', label: 'Beginner' },
                        { value: 'intermediate', label: 'Intermediate' },
                        { value: 'advanced', label: 'Advanced' }
                    ],
                    defaultValue: gameConfig.parameters.difficulty || { label: 'Dificultad', value: 'beginner' },
                    description: 'Choose the overall difficulty of the game'
                },
                {
                    name: 'tenses',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Verb Tenses',
                    type: 'multiselect',
                    options: gameConfig.parameters.tenses,
                    defaultValue: gameConfig.parameters.tenses || [{ value: 'past', label: 'Past' }, { value: 'pastParticiple', label: 'Past Participle' }],
                    description: 'Select verb tenses to practice'
                },

                {
                    name: 'verbCount',
                    label: 'Number of Verbs',
                    type: 'range',
                    min: 5,
                    max: 30,
                    step: 5,
                    defaultValue: gameConfig.parameters.verbCount || 10,
                    description: 'Number of verbs to practice in this session'
                },
                {
                    name: 'includeRegular',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Include Regular Verbs',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.includeRegular !== undefined
                        ? gameConfig.parameters.includeRegular
                        : true,
                    description: 'Practice with regular verbs'
                },
                {
                    name: 'includeIrregular',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Include Irregular Verbs',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.includeIrregular !== undefined
                        ? gameConfig.parameters.includeIrregular
                        : true,
                    description: 'Practice with irregular verbs'
                },
                {
                    name: 'timerEnabled',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Enable Timer',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.timerEnabled !== undefined ?
                        gameConfig.parameters.timerEnabled : true,
                    description: 'Play with a timer for extra challenge'
                },
                {
                    name: 'timeLimit',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Time Limit (seconds)',
                    type: 'range',
                    min: 60,
                    max: 600,
                    step: 60,
                    defaultValue: gameConfig.parameters.timeLimit || 180,
                    description: 'Total time limit in seconds',
                    visible: (values) => values.timerEnabled
                }
            ]
        };
    }

    // Método para crear formulario específico de PaintDrawingGame
    private static createPaintDrawingForm(gameConfig: IGame<PaintDrawingParameters>): FormDefinition {
        return {
            id: 'paint-drawing-form',
            title: 'Paint Drawing Configuration',
            fields: [
                {
                    name: 'difficulty',
                    label: 'Game Difficulty',
                    size: 'col-span-2 md:col-span-1',
                    type: 'customSelect',
                    options: [
                        { value: 'beginner', label: 'Beginner' },
                        { value: 'intermediate', label: 'Intermediate' },
                        { value: 'advanced', label: 'Advanced' }
                    ],
                    defaultValue: gameConfig.parameters.difficulty || { label: 'Dificultad', value: 'beginner' },
                    description: 'Choose the overall difficulty of the game'
                },
                {
                    name: 'colorPalette',
                    label: 'Color Palette',
                    size: 'col-span-2 md:col-span-1',
                    type: 'customSelect',
                    options: [
                        { value: 'basic', label: 'Basic (4 colors)' },
                        { value: 'intermediate', label: 'Extended (8 colors)' },
                        { value: 'advanced', label: 'Full Palette (14 colors)' }
                    ],
                    defaultValue: gameConfig.parameters.colorLevel || 'basic',
                    description: 'Choose the number of colors available for drawing'
                },
                {
                    name: 'roundsCount',
                    label: 'Number of Rounds',
                    size: 'col-span-2 md:col-span-1',
                    type: 'range',
                    min: 1,
                    max: 10,
                    step: 1,
                    defaultValue: gameConfig.parameters.roundsCount || 3,
                    description: 'Set how many drawing rounds to play'
                },
                {
                    name: 'objectsPerRound',
                    label: 'Objects Per Round',
                    size: 'col-span-2 md:col-span-1',
                    type: 'range',
                    min: 1,
                    max: 3,
                    step: 1,
                    defaultValue: gameConfig.parameters.objectsPerRound || 1,
                    description: 'Number of objects to draw in each round'
                },

                {
                    name: 'showColorNames',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Show Color Names',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.showColorNames !== undefined
                        ? gameConfig.parameters.showColorNames
                        : true,
                    description: 'Show the names of the colors in the palette'
                },
                {
                    name: 'enableAudio',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Enable Color Pronunciation',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.enableAudio !== undefined
                        ? gameConfig.parameters.enableAudio
                        : false,
                    description: 'Play audio pronunciation when selecting colors'
                },
                {
                    name: 'timerEnabled',
                    label: 'Enable Timer',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.timerEnabled !== undefined
                        ? gameConfig.parameters.timerEnabled
                        : true,
                    description: 'Play with a time limit'
                },
                {
                    name: 'timePerRound',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Time Per Round (seconds)',
                    type: 'range',
                    min: 30,
                    max: 300,
                    step: 30,
                    defaultValue: gameConfig.parameters.timePerRound || 120,
                    description: 'Time allowed for each drawing',
                    visible: (values) => values.timerEnabled
                },
                {
                    name: 'timeLimit',
                    size: 'col-span-2 md:col-span-1',
                    label: 'Total Game Time Limit (minutes)',
                    type: 'range',
                    min: 0,
                    max: 30,
                    step: 5,
                    defaultValue: gameConfig.parameters.timeLimit || 0,
                    description: '0 = No limit, otherwise total time for the whole game',
                    visible: (values) => values.timerEnabled
                }
            ]
        };
    }

    // Método para crear formulario específico de MinimalPairs
    private static createMinimalPairsForm(gameConfig: IGame): FormDefinition {
        return {
            id: 'minimal-pairs-form',
            title: 'Configuración de Minimal Pairs',
            fields: [
                {
                    name: 'difficulty',
                    label: 'Dificultad',
                    type: 'select',
                    options: [
                        { value: 'beginner', label: 'Principiante' },
                        { value: 'intermediate', label: 'Intermedio' },
                        { value: 'advanced', label: 'Avanzado' }
                    ],
                    defaultValue: gameConfig.parameters.difficulty || 'beginner',
                    description: 'Nivel de dificultad de los pares de palabras'
                },
                {
                    name: 'pairCount',
                    label: 'Número de pares',
                    type: 'range',
                    min: 5,
                    max: 20,
                    step: 1,
                    defaultValue: gameConfig.parameters.pairCount !== undefined &&
                        !isNaN(Number(gameConfig.parameters.pairCount))
                        ? Number(gameConfig.parameters.pairCount) : 10,
                    description: 'Cantidad de pares de palabras a practicar'
                },
                {
                    name: 'categories',
                    label: 'Categorías de sonidos',
                    type: 'multiselect',
                    options: gameConfig.parameters.categories,
                    defaultValue: gameConfig.parameters.categories || { value: 'vowels', label: 'Vocales' },
                    description: 'Selecciona qué tipos de sonidos quieres practicar'
                },
                {
                    name: 'showPhonetics',
                    label: 'Mostrar símbolos fonéticos',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.showPhonetics !== undefined ? gameConfig.parameters.showPhonetics : true,
                    description: 'Muestra la representación fonética de las palabras'
                }
            ]
        };
    }

    // Add this new method
    private static createSpeakAndScoreForm(gameConfig: IGame): FormDefinition {
        return {
            id: 'speak-and-score-form',
            title: 'Speak & Score Configuration',
            fields: [
                {
                    name: 'categories',
                    label: 'Word Categories',
                    type: 'multiselect',
                    options: gameConfig.parameters.categories,
                    defaultValue: gameConfig.parameters.categories || 'all',
                    description: 'Select word categories to practice'
                },
                {
                    name: 'difficulty',
                    label: 'Difficulty',
                    size: 'col-span-2 md:col-span-1',
                    type: 'select',
                    options: [
                        { value: 'beginner', label: 'Beginner' },
                        { value: 'intermediate', label: 'Intermediate' },
                        { value: 'advanced', label: 'Advanced' },
                    ],
                    defaultValue: gameConfig.parameters.difficulty || 'beginner',
                    description: 'Choose the difficulty level'
                },
                {
                    name: 'showPhonetics',
                    label: 'Show Phonetics',
                    size: 'col-span-2 md:col-span-1',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.showPhonetics !== undefined ?
                        gameConfig.parameters.showPhonetics : true,
                    description: 'Show phonetic transcription of words'
                },
                {
                    name: 'wordCount',
                    label: 'Number of Words',
                    type: 'range',
                    size: 'col-span-2 md:col-span-1',
                    min: 5,
                    max: 30,
                    step: 5,
                    defaultValue: gameConfig.parameters.wordCount || 10,
                    description: 'Number of words to practice'
                },
                {
                    name: 'maxAttempts',
                    label: 'Maximum Attempts per Word',
                    type: 'range',
                    size: 'col-span-2 md:col-span-1',
                    min: 1,
                    max: 5,
                    step: 1,
                    defaultValue: gameConfig.parameters.maxAttempts || 3,
                    description: 'Maximum number of attempts allowed per word'
                },
                {
                    name: 'timeLimit',
                    label: 'Time Limit (seconds)',
                    type: 'range',
                    min: 0,
                    max: 300,
                    step: 30,
                    defaultValue: gameConfig.parameters.timeLimit || 0,
                    description: '0 = No limit, otherwise time limit per word in seconds'
                }
            ]
        };
    }

    // Método para crear formulario específico de TongueTwisters
    private static createTongueTwistersForm(gameConfig: IGame): FormDefinition {
        return {
            id: 'tongue-twisters-form',
            title: 'Tongue Twisters Configuration',
            fields: [
                {
                    name: 'difficulty',
                    label: 'Difficulty Level',
                    type: 'customSelect',
                    options: [
                        { value: 'beginner', label: 'Beginner' },
                        { value: 'intermediate', label: 'Intermediate' },
                        { value: 'advanced', label: 'Advanced' }
                    ],
                    defaultValue: gameConfig.parameters.difficulty || 'easy',
                    description: 'Select the difficulty of tongue twisters'
                },
                {
                    name: 'useTimer',
                    label: 'Enable Timer',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.useTimer || false,
                    description: 'Set a time limit for each twister'
                },
                {
                    name: 'showTranslation',
                    label: 'Show Translation',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.showTranslation || true,
                    description: 'Show translation of tongue twisters'
                },
                {
                    name: 'timeLimitSeconds',
                    label: 'Time Limit (seconds)',
                    type: 'range',
                    min: 30,
                    max: 300,
                    step: 10,
                    defaultValue: gameConfig.parameters.timeLimitSeconds || 60,
                    description: 'Time allowed for each tongue twister',
                    visible: (values) => values.useTimer
                },
                {
                    name: 'speedMultiplier',
                    label: 'Playback Speed',
                    type: 'range',
                    min: 0.5,
                    max: 2,
                    step: 0.1,
                    defaultValue: gameConfig.parameters.speedMultiplier || 1,
                    description: 'Adjust the speed of audio playback'
                }
            ]
        };
    }

    // Método para crear formulario específico de SimonSays
    private static createSimonSaysForm(gameConfig: IGame): FormDefinition {
        return {
            id: 'simon-says-form',
            title: 'Simon Says Configuration',
            fields: [
                {
                    name: 'difficulty',
                    label: 'Difficulty Level',
                    type: 'customSelect',
                    options: [
                        { value: 'beginner', label: 'Beginner' },
                        { value: 'intermediate', label: 'Intermediate' },
                        { value: 'advanced', label: 'Advanced' }
                    ],
                    defaultValue: gameConfig.parameters.difficulty || 'beginner',
                    description: 'Select the difficulty of commands'
                },
                {
                    name: 'useAudio',
                    label: 'Enable Audio',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.useAudio || true,
                    description: 'Listen to commands with text-to-speech'
                },
                {
                    name: 'showTranslation',
                    label: 'Show Translation',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.showTranslation || true,
                    description: 'Show Spanish translation of commands'
                },
                {
                    name: 'useTimer',
                    label: 'Enable Timer',
                    type: 'checkbox',
                    defaultValue: gameConfig.parameters.timeLimit ? true : false,
                    description: 'Set a time limit for the game'
                },
                {
                    name: 'timeLimit',
                    label: 'Time Limit (seconds)',
                    type: 'range',
                    min: 30,
                    max: 300,
                    step: 10,
                    defaultValue: gameConfig.parameters.timeLimit || 120,
                    description: 'Time allowed for the game session',
                    visible: (values) => values.useTimer
                }
            ]
        };
    }


}
