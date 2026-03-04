import React from 'react';
import { Users, CheckCheck } from 'lucide-react';
import { BookInfo } from '../../types/bible';
import { Surface, Avatar } from '../ui/Surface';

interface GroupListItemProps {
    book: BookInfo;
    lastChapter: number;
    onSelect: (id: string) => void;
}

export const GroupListItem: React.FC<GroupListItemProps> = ({ book, lastChapter, onSelect }) => {
    return (
        <Surface
            onClick={() => onSelect(book.id)}
            elevation={false}
            className="p-5 md:p-6 flex items-center gap-4 md:gap-6 border-x-0 border-t-0 first:border-t-2 group border-b-2"
        >
            <Avatar letter={book.name[0]} size="md" />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter leading-none">{book.name}</h2>
                    <span className="text-[10px] font-bold text-gray-400">Cap {lastChapter}</span>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400 font-medium truncate leading-tight pr-4">
                        {book.description}
                    </p>
                    <CheckCheck className="w-4 h-4 text-blue-500 opacity-60 shrink-0" />
                </div>
            </div>
        </Surface>
    );
};
