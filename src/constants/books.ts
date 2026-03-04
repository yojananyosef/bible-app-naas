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
    }
];

export const READING_SPEEDS = [
    { label: 'Zen', val: 2.0, multiplier: 2.0 },
    { label: 'Norm', val: 1.0, multiplier: 1.0 },
    { label: 'Fast', val: 0.25, multiplier: 0.25 }
];
