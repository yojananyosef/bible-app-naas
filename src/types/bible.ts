import { MessageData, Speaker } from '../core/domain/Message';

export type { Speaker };

export interface Message extends MessageData { }

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
    isLocked?: boolean;
    category: string;
    description: string;
    participants: string[];
}
export interface FavoriteMessage extends Message {
    bookId: string;
    bookName: string;
    chapter: number;
}
