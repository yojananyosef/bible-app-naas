export type Speaker = 'Narrador' | 'Dios' | 'Moisés' | 'Sistema';

export interface Message {
    id: string;
    speaker: Speaker;
    text: string;
    verse: number;
    isSectionTitle?: boolean;
}

export interface ChapterData {
    book: string;
    chapter: number;
    title: string;
    messages: Message[];
}

export interface BookInfo {
    id: string;
    name: string;
    availableChapters: number[];
    category: string;
    description: string;
    participants: string[];
}
