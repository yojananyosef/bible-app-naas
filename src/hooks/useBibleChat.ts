import { useState, useEffect } from 'react';
import { ChapterData, Message } from '../types/bible';

export const useBibleChat = (book: string, chapter: number, speed: number, isActive: boolean, onMessageUpdate: (msg: Message) => void) => {
    const [data, setData] = useState<ChapterData | null>(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isAdvancing, setIsAdvancing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial Fetch
    useEffect(() => {
        setData(null);
        setCurrentIndex(-1);
        setError(null);

        fetch(`/data/${book}/${chapter}.json`)
            .then(res => {
                if (!res.ok) throw new Error(`El capítulo ${chapter} no pudo ser cargado.`);
                return res.json();
            })
            .then((json: ChapterData) => {
                setData(json);
                setCurrentIndex(0);
            })
            .catch(err => setError(err.message));
    }, [book, chapter]);

    const visibleMessages = data ? data.messages.slice(0, currentIndex + 1) : [];
    const nextMessage = data && (currentIndex + 1 < data.messages.length) ? data.messages[currentIndex + 1] : null;
    const isNextUser = nextMessage && (nextMessage.speaker !== 'Dios' && nextMessage.speaker !== 'Narrador' && !nextMessage.isSectionTitle);

    // Auto-Advance Logic
    useEffect(() => {
        if (!isActive || !nextMessage || isNextUser || !data) return;

        let isMounted = true;
        const autoAdvance = async () => {
            // ... timer calculations ...
            // (I'll keep the actual logic from before, just adding the isActive guard)
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
            } else if (nextMessage.isSectionTitle) {
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
                onMessageUpdate(nextMessage);
            }
        };

        autoAdvance();
        return () => { isMounted = false; setIsAdvancing(false); };
    }, [nextMessage, isNextUser, currentIndex, data, speed, isActive]);

    const handleManualNext = () => {
        if (!nextMessage || isAdvancing || !isNextUser) return;
        setCurrentIndex(prev => prev + 1);
        onMessageUpdate(nextMessage);
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
        isNextUser,
        handleManualNext,
        restartChapter
    };
};
