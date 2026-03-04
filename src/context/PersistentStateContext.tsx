import React, { createContext, useContext, useState, useEffect } from 'react';
import { FavoriteMessage } from '../types/bible';
import { BIBLE_BOOKS } from '../constants/books';

interface PersistentState {
    currentBookId: string;
    currentChapter: number;
    setCurrentChapter: (chapter: number) => void;
    favorites: FavoriteMessage[];
    setFavorites: React.Dispatch<React.SetStateAction<FavoriteMessage[]>>;
    changeBook: (id: string) => void;
    getInitialChapter: (bookId: string) => number;
}

const PersistentStateContext = createContext<PersistentState | undefined>(undefined);

export const PersistentStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentBookId, setCurrentBookId] = useState<string>(() => {
        if (typeof window === 'undefined') return 'genesis';
        return localStorage.getItem('lastBook') || 'genesis';
    });

    const getInitialChapter = (bookId: string) => {
        if (typeof window === 'undefined') return 1;
        const saved = localStorage.getItem(`lastChapter_${bookId}`);
        const book = BIBLE_BOOKS.find(b => b.id === bookId);
        if (!book) return 1;
        const savedVal = saved ? Number(saved) : -1;
        return book.availableChapters.includes(savedVal) ? savedVal : (book.availableChapters[0] || 1);
    };

    const [currentChapter, setCurrentChapter] = useState<number>(() => getInitialChapter(currentBookId));

    const [favorites, setFavorites] = useState<FavoriteMessage[]>(() => {
        if (typeof window === 'undefined') return [];
        const saved = localStorage.getItem('bible_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    // Sync to local storage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('lastBook', currentBookId);
            localStorage.setItem(`lastChapter_${currentBookId}`, currentChapter.toString());
            localStorage.setItem('bible_favorites', JSON.stringify(favorites));
        }
    }, [currentBookId, currentChapter, favorites]);

    const changeBook = (id: string) => {
        const initialChap = getInitialChapter(id);
        setCurrentBookId(id);
        setCurrentChapter(initialChap);
        if (typeof window !== 'undefined') {
            localStorage.setItem('lastBook', id);
            localStorage.setItem(`lastChapter_${id}`, initialChap.toString());
        }
    };

    return (
        <PersistentStateContext.Provider value={{
            currentBookId,
            currentChapter,
            setCurrentChapter,
            favorites,
            setFavorites,
            changeBook,
            getInitialChapter
        }}>
            {children}
        </PersistentStateContext.Provider>
    );
};

export const usePersistentState = () => {
    const context = useContext(PersistentStateContext);
    if (!context) throw new Error('usePersistentState must be used within a PersistentStateProvider');
    return context;
};
