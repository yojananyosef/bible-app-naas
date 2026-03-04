import { useState, useEffect, useCallback } from 'react';
import { Message } from '../core/domain/Message';
import { ValidChapterData } from '../core/services/BibleDataService';

export interface UseBibleChatProps {
    book: string;
    chapter: number;
    speed: number;
    isActive: boolean;
    loadChapterService: (bookId: string, chapter: number) => Promise<ValidChapterData>;
    onMessageUpdate?: (msg: Message) => void;
}

// Tiny helpers to read/write progress to localStorage
function readProgress(book: string, chapter: number): number {
    if (typeof window === 'undefined') return -1;
    const v = localStorage.getItem(`chatProgress_${book}_${chapter}`);
    return v !== null ? Number(v) : -1;
}
function writeProgress(book: string, chapter: number, index: number) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(`chatProgress_${book}_${chapter}`, index.toString());
    }
}

export const useBibleChat = ({
    book,
    chapter,
    speed,
    isActive,
    loadChapterService,
    onMessageUpdate
}: UseBibleChatProps) => {
    const [data, setData] = useState<ValidChapterData | null>(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isAdvancing, setIsAdvancing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Persist progress whenever it changes
    useEffect(() => {
        if (currentIndex >= 0) {
            writeProgress(book, chapter, currentIndex);
        }
    }, [book, chapter, currentIndex]);

    // Initial Fetch — runs when book or chapter changes
    useEffect(() => {
        setData(null);
        setCurrentIndex(-1);
        setIsAdvancing(false);
        setError(null);

        loadChapterService(book, chapter)
            .then(json => {
                setData(json);

                // Check if we have saved progress for this book+chapter
                const savedIdx = readProgress(book, chapter);

                if (savedIdx >= 0 && savedIdx < json.messages.length) {
                    // Resume from saved position
                    setCurrentIndex(savedIdx);
                } else {
                    // Fresh start — check if the first message needs manual send
                    const firstMsg = json.messages[0];
                    const needsManualStart = firstMsg && (firstMsg.isHuman() || firstMsg.isTitle());
                    setCurrentIndex(needsManualStart ? -1 : 0);
                }
            })
            .catch(err => setError(err.message));
    }, [book, chapter, loadChapterService]);

    const visibleMessages = data ? data.messages.slice(0, currentIndex + 1) : [];
    const nextMessage = data && (currentIndex + 1 < data.messages.length) ? data.messages[currentIndex + 1] : null;

    // Domain behavior rules
    const canAdvanceManually = nextMessage ? (nextMessage.isHuman() || nextMessage.isTitle()) : false;

    // Auto-Advance Logic
    useEffect(() => {
        if (!isActive || !nextMessage || canAdvanceManually || !data) return;

        let isMounted = true;
        const autoAdvance = async () => {
            if (!isMounted) return;

            setIsAdvancing(true);
            const currentMessage = currentIndex >= 0 ? data.messages[currentIndex] : null;

            const charTimeReading = 80 * speed;
            const charTimeTyping = 60 * speed;
            const readingFloor = 2500 * speed;
            const typingFloor = 2000 * speed;

            const readingTime = currentMessage ? Math.max(currentMessage.text.length * charTimeReading, readingFloor) : (2000 * speed);
            const typingTime = Math.max(nextMessage.text.length * charTimeTyping, typingFloor);

            let delay = 0;
            if (nextMessage.speaker === 'Narrador') {
                delay = readingTime + (1000 * speed);
            } else if (nextMessage.isTitle()) {
                delay = readingTime * 0.5;
            } else {
                delay = typingTime + (readingTime * 0.2 * speed);
            }

            const maxDelay = Math.max(15000 * speed, 4000);
            delay = Math.min(delay, maxDelay);

            await new Promise(r => setTimeout(r, delay));

            if (isMounted && isActive) {
                setCurrentIndex(prev => prev + 1);
                setIsAdvancing(false);
                if (onMessageUpdate) onMessageUpdate(nextMessage);
            }
        };

        autoAdvance();
        return () => { isMounted = false; setIsAdvancing(false); };
    }, [nextMessage, canAdvanceManually, currentIndex, data, speed, isActive, onMessageUpdate]);

    const handleManualNext = () => {
        if (!nextMessage || isAdvancing || !canAdvanceManually || !data) return;
        setCurrentIndex(prev => prev + 1);
        if (onMessageUpdate) onMessageUpdate(nextMessage);
    };

    const restartChapter = () => {
        if (!data) return;
        const firstMsg = data.messages[0];
        const needsManualStart = firstMsg && (firstMsg.isHuman() || firstMsg.isTitle());
        setCurrentIndex(needsManualStart ? -1 : 0);
        setIsAdvancing(false);
        // Clear saved progress
        writeProgress(book, chapter, -1);
    };

    return {
        data,
        currentIndex,
        isAdvancing,
        error,
        visibleMessages,
        nextMessage,
        canAdvanceManually,
        handleManualNext,
        restartChapter
    };
};
