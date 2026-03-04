import { ChapterDataSchema } from '../validation/bibleSchemas';
import { Message, MessageData } from '../domain/Message';

export interface ValidChapterData {
    book: string;
    chapter: number;
    title: string;
    messages: Message[];
}

export class BibleDataService {
    static async loadChapter(bookId: string, chapter: number): Promise<ValidChapterData> {
        const response = await fetch(`/data/${bookId}/${chapter}.json`);
        if (!response.ok) {
            throw new Error(`El capítulo ${chapter} no pudo ser cargado.`);
        }

        const json = await response.json();
        const parsedData = ChapterDataSchema.parse(json);

        return {
            ...parsedData,
            messages: parsedData.messages.map((m: MessageData) => new Message(m)),
        };
    }
}
