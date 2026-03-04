import { useState, useEffect } from 'react';
import { FavoriteMessage } from '../types/bible';
import { BIBLE_BOOKS } from '../constants/books';

export const usePersistentState = () => {
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

    const getInitialIndex = (bookId: string, chapter: number) => {
        if (typeof window === 'undefined') return -1;
        const saved = localStorage.getItem(`lastIndex_${bookId}_${chapter}`);
        return saved ? Number(saved) : -1;
    };

    const [currentChapter, setCurrentChapter] = useState<number>(() => getInitialChapter(currentBookId));
    const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(() => getInitialIndex(currentBookId, currentChapter));

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
            localStorage.setItem(`lastIndex_${currentBookId}_${currentChapter}`, currentMessageIndex.toString());
            localStorage.setItem('bible_favorites', JSON.stringify(favorites));
        }
    }, [currentBookId, currentChapter, currentMessageIndex, favorites]);

    // Handle index reset/load when book or chapter changes
    useEffect(() => {
        const idx = getInitialIndex(currentBookId, currentChapter);
        setCurrentMessageIndex(idx);
    }, [currentBookId, currentChapter]);

    const changeBook = (id: string) => {
        const initialChap = getInitialChapter(id);
        const initialIdx = getInitialIndex(id, initialChap);
        setCurrentBookId(id);
        setCurrentChapter(initialChap);
        setCurrentMessageIndex(initialIdx);

        // Force immediate localStorage update to prevent hydration mismatches or stale state on route/view change
        if (typeof window !== 'undefined') {
            localStorage.setItem('lastBook', id);
            localStorage.setItem(`lastChapter_${id}`, initialChap.toString());
            localStorage.setItem(`lastIndex_${id}_${initialChap}`, initialIdx.toString());
        }
    };

    return {
        currentBookId,
        currentChapter,
        setCurrentChapter,
        currentMessageIndex,
        setCurrentMessageIndex,
        favorites,
        setFavorites,
        changeBook,
        getInitialChapter
    };
};
