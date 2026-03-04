import { useState, useEffect } from 'react';
import { Message } from '../core/domain/Message';
import { ValidChapterData } from '../core/services/BibleDataService';

export interface UseBibleChatProps {
    book: string;
    chapter: number;
    speed: number;
    isActive: boolean;
    loadChapterService: (bookId: string, chapter: number) => Promise<ValidChapterData>;
    onMessageUpdate?: (msg: Message) => void;
    initialIndex?: number;
    onIndexChange?: (index: number) => void;
}

export const useBibleChat = ({
    book,
    chapter,
    speed,
    isActive,
    loadChapterService,
    onMessageUpdate,
    initialIndex = -1,
    onIndexChange
}: UseBibleChatProps) => {
    const [data, setData] = useState<ValidChapterData | null>(null);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isAdvancing, setIsAdvancing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial Fetch
    useEffect(() => {
        setData(null);
        setError(null);

        loadChapterService(book, chapter)
            .then(json => {
                setData(json);
                // Use the initialIndex if valid, else start at 0
                const resumeIdx = initialIndex >= 0 ? Math.min(initialIndex, json.messages.length - 1) : 0;
                setCurrentIndex(resumeIdx);
            })
            .catch(err => setError(err.message));
    }, [book, chapter, loadChapterService]);

    // Lift the state change
    useEffect(() => {
        if (onIndexChange) onIndexChange(currentIndex);
    }, [currentIndex, onIndexChange]);

    const visibleMessages = data ? data.messages.slice(0, currentIndex + 1) : [];
    const nextMessage = data && (currentIndex + 1 < data.messages.length) ? data.messages[currentIndex + 1] : null;

    // Domain behavior rules instead of primitives
    const canAdvanceManually = nextMessage ? (nextMessage.isHumanSpeaker() || nextMessage.isTitle()) : false;

    // Auto-Advance Logic
    useEffect(() => {
        if (!isActive || !nextMessage || canAdvanceManually || !data) return;

        let isMounted = true;
        const autoAdvance = async () => {
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
        setCurrentIndex(0);
        setIsAdvancing(false);
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
