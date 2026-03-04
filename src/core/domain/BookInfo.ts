export interface BookInfo {
    id: string;
    name: string;
    availableChapters: number[];
    isLocked?: boolean;
    category: string;
    description: string;
    participants: string[];
}
