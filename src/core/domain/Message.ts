export type Speaker = 'Narrador' | 'Dios' | 'Moisés' | 'Sistema' | string;

export interface MessageData {
    id: string;
    speaker: Speaker;
    text: string;
    verse: number;
    isSectionTitle?: boolean;
}

export class Message {
    constructor(private readonly data: MessageData) { }

    get id() { return this.data.id; }
    get speaker() { return this.data.speaker; }
    get text() { return this.data.text; }
    get verse() { return this.data.verse; }
    get isSectionTitle() { return this.data.isSectionTitle; }

    isHumanSpeaker(): boolean {
        return this.speaker !== 'Dios' && this.speaker !== 'Narrador' && this.speaker !== 'Sistema';
    }

    isTitle(): boolean {
        return !!this.isSectionTitle;
    }

    toJSON(): MessageData {
        return { ...this.data };
    }
}

export interface FavoriteMessageData extends MessageData {
    bookId: string;
    bookName: string;
    chapter: number;
}
