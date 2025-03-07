import { IGame } from '../../types/game';
import { BodyPart, Command, SimonSaysGameParams } from './types';

export const BODY_PARTS: BodyPart[] = [
    {
        id: 'head',
        name: 'Head',
        spanishName: 'Cabeza',
        area: { x: 50, y: 20, width: 60, height: 30 },
        pronunciationText: 'Head'
    }, //ok
    {
        id: 'eye',
        name: 'Eye',
        spanishName: 'Ojo',
        area: { x: 37, y: 25, width: 10, height: 5 },
        pronunciationText: 'Eye'
    }, //ok
    {
        id: 'ear',
        name: 'Ear',
        spanishName: 'Oreja',
        area: { x: 23, y: 27, width: 10, height: 5 },
        pronunciationText: 'Ear'
    }, //ok
    {
        id: 'nose',
        name: 'Nose',
        spanishName: 'Nariz',
        area: { x: 48, y: 27, width: 6, height: 3 },
        pronunciationText: 'Nose'
    }, // ok
    {
        id: 'mouth',
        name: 'Mouth',
        spanishName: 'Boca',
        area: { x: 48, y: 30, width: 20, height: 3 },
        pronunciationText: 'Mouth'
    }, // ok
    {
        id: 'neck',
        name: 'Neck',
        spanishName: 'Cuello',
        area: { x: 48, y: 38, width: 10, height: 4 },
        pronunciationText: 'Neck'
    }, // ok
    {
        id: 'arm',
        name: 'Arm',
        spanishName: 'Brazo',
        area: { x: 25, y: 52, width: 12, height: 20 },
        pronunciationText: 'Arm'
    }, // ok
    {
        id: 'hand',
        name: 'Hand',
        spanishName: 'Mano',
        area: { x: 10, y: 64, width: 12, height: 7 },
        pronunciationText: 'Hand'
    }, // ok
    {
        id: 'leg',
        name: 'Leg',
        spanishName: 'Pierna',
        area: { x: 38, y: 75, width: 12, height: 26 },
        pronunciationText: 'Leg'
    },
    {
        id: 'foot',
        name: 'Foot',
        spanishName: 'Pie',
        area: { x: 30, y: 95, width: 18, height: 6 },
        pronunciationText: 'Foot'
    },
    {
        id: 'chest',
        name: 'Chest',
        spanishName: 'Pecho',
        area: { x: 48, y: 45, width: 30, height: 10 },
        pronunciationText: 'Chest'
    },
    {
        id: 'shoulder',
        name: 'Shoulder',
        spanishName: 'Hombro',
        area: { x: 35, y: 42, width: 10, height: 4 },
        pronunciationText: 'Shoulder'
    },
    {
        id: 'stomach',
        name: 'Stomach',
        spanishName: 'Vientre',
        area: { x: 48, y: 55, width: 30, height: 10 },
        pronunciationText: 'Stomach'
    }, {
        id: 'knee',
        name: 'Knee',
        spanishName: 'Rodilla',
        area: { x: 38, y: 78, width: 10, height: 4 },
        pronunciationText: 'Knee'
    },
    {
        id: 'elbow',
        name: 'Elbow',
        spanishName: 'Codo',
        area: { x: 22, y: 52, width: 10, height: 4 },
        pronunciationText: 'Elbow'
    },
    {
        id: 'fingers',
        name: 'Fingers',
        spanishName: 'Dedo',
        area: { x: 7, y: 66, width: 7, height: 5 },
        pronunciationText: 'Fingers'
    }, {
        id: 'wrist',
        name: 'Wrist',
        spanishName: 'Muñeca',
        area: { x: 12, y: 60, width: 10, height: 2 },
        pronunciationText: 'Wrist'
    },
    {
        id: 'ankle',
        name: 'Ankle',
        spanishName: 'Tobillo',
        area: { x: 35, y: 91, width: 10, height: 4 },
        pronunciationText: 'Ankle'
    },
    {
        id: 'hip',
        name: 'Hip',
        spanishName: 'Cadera',
        area: { x: 48, y: 60, width: 30, height: 4 },
        pronunciationText: 'Hip'
    },
    {
        id: 'forehead',
        name: 'Forehead',
        spanishName: 'Frente',
        area: { x: 48, y: 16, width: 35, height: 5 },
        pronunciationText: 'Forehead'
    },
    {
        id: 'cheek',
        name: 'Cheek',
        spanishName: 'Mejilla',
        area: { x: 35, y: 30, width: 10, height: 5 },
        pronunciationText: 'Cheek'
    },
    {
        id: 'chin',
        name: 'Chin',
        spanishName: 'Barba',
        area: { x: 48, y: 35, width: 12, height: 3 },
        pronunciationText: 'Chin'
    },
    {
        id: 'eyebrow',
        name: 'Eyebrow',
        spanishName: 'Cejas',
        area: { x: 37, y: 20, width: 14, height: 3 },
        pronunciationText: 'Eyebrow'
    },

];

export const COMMANDS_BY_DIFFICULTY: Record<string, Command[]> = {
    beginner: [
        { text: 'Touch your knee', translation: 'Toca tu rodilla', targetPart: 'knee' },
        { text: 'Touch your elbow', translation: 'Toca tu codo', targetPart: 'elbow' },
        { text: 'Touch your fingers', translation: 'Toca tus dedos', targetPart: 'fingers' },
        { text: 'Touch your chest', translation: 'Toca tu pecho', targetPart: 'chest' },
        { text: 'Touch your stomach', translation: 'Toca tu vientre', targetPart: 'stomach' },
        { text: 'Touch your shoulder', translation: 'Toca tu hombro', targetPart: 'shoulder' },
        { text: 'Touch your wrist', translation: 'Toca tu muñeca', targetPart: 'wrist' },
        { text: 'Touch your ankle', translation: 'Toca tu tobillo', targetPart: 'ankle' }
    ],
    intermediate: [
        { text: 'Point to your forehead', translation: 'Señala tu frente', targetPart: 'forehead' },
        { text: 'Put your hand on your hip', translation: 'Pon tu mano en tu cadera', targetPart: 'hip' },
        { text: 'Touch your cheeks', translation: 'Toca tus mejillas', targetPart: 'cheek' },
        { text: 'Point to your chin', translation: 'Señala tu barbilla', targetPart: 'chin' },
        { text: 'Raise your eyebrows', translation: 'Levanta tus cejas', targetPart: 'eyebrow' },
        { text: 'Touch your stomach', translation: 'Toca tu estómago', targetPart: 'stomach' },
        { text: 'Point to your chest', translation: 'Señala tu pecho', targetPart: 'chest' },
        { text: 'Touch your shoulders', translation: 'Toca tus hombros', targetPart: 'shoulder' }
    ],
    advanced: [
        { text: 'Simon says touch your knee', translation: 'Simón dice toca tu rodilla', targetPart: 'knee' },
        { text: 'Simon says point to your elbow', translation: 'Simón dice señala tu codo', targetPart: 'elbow' },
        { text: 'Touch your wrist', translation: 'Toca tu muñeca', targetPart: 'wrist' },
        { text: 'Simon says touch your ankle', translation: 'Simón dice toca tu tobillo', targetPart: 'ankle' },
        { text: 'Simon says point to your hip', translation: 'Simón dice señala tu cadera', targetPart: 'hip' },
        { text: 'Touch your forehead', translation: 'Toca tu frente', targetPart: 'forehead' },
        { text: 'Simon says touch your cheeks', translation: 'Simón dice toca tus mejillas', targetPart: 'cheek' },
        { text: 'Point to your eyebrows', translation: 'Señala tus cejas', targetPart: 'eyebrow' }
    ]
};

export const SimonSaysConfig: IGame = {
    id: 'simon-says',
    type: 'Speaking',
    category: 'Vocabulary',
    parameters: {
        difficulty: { label: 'Beginner', value: 'beginner' },
        useAudio: true,
        showTranslation: true,
        timeLimit: 0 // 0 significa sin límite
    } as SimonSaysGameParams,
    instructions: [
        'Escucha o lee la instrucción que te da "Simon" en inglés.',
        'Haz clic en la parte correcta del cuerpo según la instrucción.',
        'En nivel avanzado, solo debes seguir las instrucciones que comiencen con "Simon says".',
        'Gana puntos por cada respuesta correcta.'
    ]
}; 