import { TongueTwister } from './types';

export const tongueTwistersData: TongueTwister[] = [
    {
        id: 'tw001',
        text: 'She sells seashells by the seashore.',
        difficulty: 'beginner',
        translation: 'Ella vende conchas marinas en la orilla del mar.'
    },
    {
        id: 'tw002',
        text: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
        difficulty: 'intermediate',
        translation: '¿Cuánta madera tiraría una marmota si una marmota pudiera tirar madera?'
    },
    {
        id: 'tw003',
        text: 'Peter Piper picked a peck of pickled peppers.',
        difficulty: 'intermediate',
        translation: 'Peter Piper recogió una pizca de pimientos en escabeche.'
    },
    {
        id: 'tw004',
        text: 'Six slick slim sycamore saplings.',
        difficulty: 'intermediate',
        translation: 'Seis esbeltos y finos retoños de sicómoro.'
    },
    {
        id: 'tw005',
        text: 'Thirty-three thirsty, thundering thoroughbreds.',
        difficulty: 'advanced',
        translation: 'Treinta y tres caballos purasangre sedientos y atronadores.'
    },
    {
        id: 'tw006',
        text: 'Volunteer vanguard veterans view victory valuably.',
        difficulty: 'advanced',
        translation: 'Los veteranos voluntarios de vanguardia valoran la victoria.'
    },
    {
        id: 'tw007',
        text: 'A big black bug bit a big black bear.',
        difficulty: 'beginner',
        translation: 'Un gran insecto negro mordió a un gran oso negro.'
    },
    {
        id: 'tw008',
        text: 'Fresh fried fly flesh.',
        difficulty: 'intermediate',
        translation: 'Carne de mosca frita fresca.'
    },
    {
        id: 'tw009',
        text: 'Rural really rarely railroad rarely.',
        difficulty: 'advanced',
        translation: 'Rural realmente raramente ferrocarril raramente.'
    },
    {
        id: 'tw010',
        text: 'Which wristwatches are Swiss wristwatches?',
        difficulty: 'advanced',
        translation: '¿Qué relojes de pulsera son relojes de pulsera suizos?'
    },
    {
        id: 'tw011',
        text: 'Toy boat. Toy boat. Toy boat.',
        difficulty: 'intermediate',
        translation: 'Barco de juguete. Barco de juguete. Barco de juguete.'
    },
    {
        id: 'tw012',
        text: 'Eleven benevolent elephants.',
        difficulty: 'beginner',
        translation: 'Once elefantes benevolentes.'
    },
    {
        id: 'tw013',
        text: 'Truly rural, truly rural, truly rural.',
        difficulty: 'advanced',
        translation: 'Verdaderamente rural, verdaderamente rural, verdaderamente rural.'
    },
    {
        id: 'tw014',
        text: 'Mixed biscuits, mixed biscuits, mixed biscuits.',
        difficulty: 'intermediate',
        translation: 'Galletas mixtas, galletas mixtas, galletas mixtas.'
    },
    {
        id: 'tw015',
        text: 'Yellow leather, red leather, yellow leather, red leather.',
        difficulty: 'advanced',
        translation: 'Cuero amarillo, cuero rojo, cuero amarillo, cuero rojo.'
    },
    {
        id: 'tw016',
        text: 'The thin theologian thought thoroughly through thousands of theories.',
        difficulty: 'advanced',
        translation: 'El delgado teólogo pensó minuciosamente en miles de teorías.'
    },
    {
        id: 'tw017',
        text: 'Six sticky skeletons.',
        difficulty: 'intermediate',
        translation: 'Seis esqueletos pegajosos.'
    },
    {
        id: 'tw018',
        text: 'I thought a thought. But the thought I thought wasn\'t the thought I thought I thought.',
        difficulty: 'advanced',
        translation: 'Pensé un pensamiento. Pero el pensamiento que pensé no era el pensamiento que pensé que pensaba.'
    },
    {
        id: 'tw019',
        text: 'Unique New York, unique New York.',
        difficulty: 'intermediate',
        translation: 'Nueva York único, Nueva York único.'
    },
    {
        id: 'tw020',
        text: 'We surely shall see the sun shine soon.',
        difficulty: 'beginner',
        translation: 'Seguramente veremos brillar el sol pronto.'
    }
]

export const getTwistersByDifficulty = (difficulty: string) => {
    return tongueTwistersData.filter(twister => twister.difficulty === difficulty);
};

export const getTwisterById = (id: string) => {
    return tongueTwistersData.find(twister => twister.id === id);
}; 