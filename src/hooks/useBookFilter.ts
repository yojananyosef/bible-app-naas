import { useState, useMemo } from 'react';
import { BIBLE_BOOKS } from '../constants/books';

export const useBookFilter = (initialQuery: string = '') => {
    const [query, setQuery] = useState(initialQuery);

    const filteredBooks = useMemo(() => {
        const lowerQuery = query.toLowerCase();
        return BIBLE_BOOKS.filter(b =>
            b.name.toLowerCase().includes(lowerQuery) ||
            b.category.toLowerCase().includes(lowerQuery)
        );
    }, [query]);

    return { query, setQuery, filteredBooks };
};
