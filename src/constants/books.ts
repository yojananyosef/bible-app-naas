import { BookInfo } from '../types/bible';

export const BIBLE_BOOKS: BookInfo[] = [
    {
        id: 'genesis',
        name: 'Génesis',
        availableChapters: [1],
        category: 'Pentateuco',
        description: 'El libro de los comienzos: la creación, la caída y la promesa divina a los patriarcas.',
        participants: ['Dios', 'Narrador', 'Adán', 'Eva']
    },
    {
        id: 'exodus',
        name: 'Éxodo',
        availableChapters: [3, 4],
        category: 'Pentateuco',
        description: 'La liberación épica de Israel de la esclavitud en Egipto y la entrega de la Ley.',
        participants: ['Dios', 'Moisés', 'Narrador']
    },
    {
        id: 'levitico',
        name: 'Levítico',
        availableChapters: [],
        isLocked: true,
        category: 'Pentateuco',
        description: 'Leyes ceremoniales y santidad del pueblo de Dios.',
        participants: ['Dios', 'Moisés']
    },
    {
        id: 'numeros',
        name: 'Números',
        availableChapters: [],
        isLocked: true,
        category: 'Pentateuco',
        description: 'El censo y el vagabundeo de Israel por el desierto.',
        participants: ['Moisés']
    },
    {
        id: 'deuteronomio',
        name: 'Deuteronomio',
        availableChapters: [],
        isLocked: true,
        category: 'Pentateuco',
        description: 'Repetición de la ley y despedida de Moisés.',
        participants: ['Moisés']
    },
    {
        id: 'salmos',
        name: 'Salmos',
        availableChapters: [],
        isLocked: true,
        category: 'Poesía',
        description: 'Cánticos de adoración, lamento y esperanza.',
        participants: ['David', 'Asaf']
    },
    {
        id: 'mateo',
        name: 'Mateo',
        availableChapters: [],
        isLocked: true,
        category: 'Evangelios',
        description: 'El evangelio del Rey de los judíos.',
        participants: ['Jesús', 'Mateo']
    },
    {
        id: 'juan',
        name: 'Juan',
        availableChapters: [],
        isLocked: true,
        category: 'Evangelios',
        description: 'El Hijo de Dios entre nosotros.',
        participants: ['Jesús', 'Juan']
    }
];

export const READING_SPEEDS = [
    { label: 'Zen', val: 2.0, multiplier: 2.0 },
    { label: 'Norm', val: 1.0, multiplier: 1.0 },
    { label: 'Fast', val: 0.25, multiplier: 0.25 }
];
