import { useState, useEffect, useRef } from 'react';

export const useAudio = (isMuted: boolean) => {
    const popAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        popAudio.current = new Audio('/sounds/pop.mp3');
        if (popAudio.current) popAudio.current.volume = 0.3;
    }, []);

    const playPop = () => {
        if (popAudio.current && !isMuted) {
            popAudio.current.currentTime = 0;
            popAudio.current.play().catch(() => { });
        }
    };

    return { playPop };
};

export const useSettings = () => {
    const [isMuted, setIsMuted] = useState(() =>
        localStorage.getItem('isMuted') === 'true'
    );
    const [readingSpeed, setReadingSpeed] = useState(() =>
        Number(localStorage.getItem('readingSpeedMultiplier')) || 1.0
    );

    useEffect(() => {
        localStorage.setItem('isMuted', isMuted.toString());
        localStorage.setItem('readingSpeedMultiplier', readingSpeed.toString());
    }, [isMuted, readingSpeed]);

    return { isMuted, setIsMuted, readingSpeed, setReadingSpeed };
};
