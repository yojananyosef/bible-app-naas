import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical, BookOpen, Send, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Speaker = 'Narrador' | 'Dios' | 'Moisés' | 'Sistema';

interface Message {
    id: string;
    speaker: Speaker;
    text: string;
    verse: number;
    isSectionTitle?: boolean;
}

interface ChapterData {
    book: string;
    chapter: number;
    title: string;
    messages: Message[];
}

// Typing indicator (Now static while waiting for user interaction)
const TypingIndicator = ({ speaker, isGod }: { speaker: string; isGod: boolean }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
        className={`flex items-end gap-2 md:gap-4 max-w-[85%] sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl ${isGod ? 'flex-row' : 'flex-row-reverse'} mx-2 md:mx-4 lg:mx-6 w-full mt-4 md:mt-6 transition-all duration-300`}
    >
        {/* Avatar */}
        <div className={`w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center shrink-0 naas-border naas-shadow-sm
      ${isGod ? 'bg-[#FFD600]' : 'bg-white'}`}>
            <span className="text-xs md:text-sm lg:text-base font-black">{speaker[0]}</span>
        </div>

        {/* Bubble */}
        <div className={`naas-border p-3 md:p-5 lg:p-6 flex flex-col relative transition-all duration-300
      ${isGod ? 'bg-white rounded-r-xl rounded-tl-xl md:rounded-r-2xl md:rounded-tl-2xl lg:rounded-r-3xl lg:rounded-tl-3xl' : 'bg-[#EAEAEA] rounded-l-xl rounded-tr-xl md:rounded-l-2xl md:rounded-tr-2xl lg:rounded-l-3xl lg:rounded-tr-3xl'}
      ${isGod ? 'naas-shadow-sm md:shadow-[4px_4px_0_#0A0A0A]' : ''}
    `}>
            <div className="flex items-center justify-between gap-4 md:gap-6 mb-2">
                <span className="text-[10px] md:text-xs lg:text-sm font-black uppercase tracking-wider text-gray-400">{speaker} ESTÁ ESCRIBIENDO...</span>
            </div>
            <div className="flex gap-1 md:gap-2 h-3 md:h-4 items-center">
                <motion.div className="w-1.5 h-1.5 md:w-2 md:h-2 lg:w-2.5 lg:h-2.5 bg-[#0A0A0A] rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} />
                <motion.div className="w-1.5 h-1.5 md:w-2 md:h-2 lg:w-2.5 lg:h-2.5 bg-[#0A0A0A] rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} />
                <motion.div className="w-1.5 h-1.5 md:w-2 md:h-2 lg:w-2.5 lg:h-2.5 bg-[#0A0A0A] rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} />
            </div>
        </div>
    </motion.div>
);

export default function App() {
    const [data, setData] = useState<ChapterData | null>(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
    const [isAdvancing, setIsAdvancing] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentBook, setCurrentBook] = useState('genesis');
    const [currentChapter, setCurrentChapter] = useState(1);

    // Fetch JSON data
    useEffect(() => {
        setData(null);
        setCurrentIndex(-1);
        setLikedMessages(new Set());
        fetch(`/data/${currentBook}/${currentChapter}.json`)
            .then(res => {
                if (!res.ok) throw new Error("Chapter not found");
                return res.json();
            })
            .then((json: ChapterData) => {
                setData(json);
                setCurrentIndex(0); // Muestra el primer mensaje automáticamente
            })
            .catch(err => {
                console.warn("End of book or missing file", err);
            });
    }, [currentBook, currentChapter]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentIndex, isAdvancing]);

    const visibleMessages = data ? data.messages.slice(0, currentIndex + 1) : [];
    const nextMessage = data && (currentIndex + 1 < data.messages.length) ? data.messages[currentIndex + 1] : null;
    const isComplete = data ? (!nextMessage && currentIndex >= 0) : false;

    const lastSectionTitleMessage = visibleMessages.slice().reverse().find(msg => msg.isSectionTitle);
    const activeSubtitle = lastSectionTitleMessage ? lastSectionTitleMessage.text : (data?.title || '');

    const isNextSectionTitle = nextMessage && nextMessage.isSectionTitle;
    const isNextSystem = nextMessage && !isNextSectionTitle && (nextMessage.speaker === 'Dios' || nextMessage.speaker === 'Narrador');
    const isNextUser = nextMessage && !isNextSystem;

    // Auto-advance logic for system messages
    useEffect(() => {
        if (!nextMessage || isNextUser) return;

        let isMounted = true;
        const autoAdvance = async () => {
            setIsAdvancing(true);

            // Calculamos el tiempo de lectura del mensaje actual (el último que apareció)
            // Velocidad promedio de lectura: ~35ms por carácter (aprox 250 palabras por minuto)
            const currentMessage = currentIndex >= 0 && data ? data.messages[currentIndex] : null;
            const readingTime = currentMessage ? Math.max(currentMessage.text.length * 35, 1500) : 1000;

            // Calculamos el tiempo de escritura para el siguiente mensaje
            const typingTime = Math.max(nextMessage.text.length * 30, 1500);

            let delay = 0;
            if (nextMessage.speaker === 'Narrador') {
                // El narrador no muestra indicador de "escribiendo", la pausa es el tiempo para leer el mensaje anterior completo.
                delay = Math.min(readingTime + 800, 8000); // Pausa máxima de 8 segundos
            } else {
                // Si es un personaje (Dios), la animación de escribiendo es el tiempo de tipeo más un margen del tiempo de lectura anterior.
                delay = Math.min(typingTime + (readingTime * 0.4), 8000);
            }

            await new Promise(r => setTimeout(r, delay));

            if (isMounted) {
                setCurrentIndex(prev => prev + 1);
                setIsAdvancing(false);
            }
        };

        autoAdvance();

        return () => {
            isMounted = false;
            setIsAdvancing(false);
        };
    }, [nextMessage, isNextUser, currentIndex, data]);

    if (!data) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-display font-bold">CARGANDO...</div>;

    const handleNextMessageClick = async () => {
        if (!nextMessage || isAdvancing || !isNextUser) return;

        setIsAdvancing(true);
        // Instant sending for user
        setCurrentIndex(prev => prev + 1);
        setIsAdvancing(false);
    };

    const toggleLike = (id: string) => {
        setLikedMessages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center sm:p-4 md:p-8 lg:p-12 transition-all duration-300">

            {/* Application Container */}
            <main className="w-full max-w-full sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl bg-white sm:naas-border sm:naas-shadow flex flex-col h-[100dvh] sm:h-[90vh] lg:h-[85vh] relative overflow-hidden transition-all duration-300 mx-auto" data-viewport-scope="hero">

                {/* Header - AIDA Phase 1: Attention */}
                <header data-aida="attention" className="border-b-2 border-[#0A0A0A] bg-[#FAFAFA] shrink-0 p-4 md:p-6 lg:p-8 sticky top-0 z-10 flex items-center justify-between transition-all duration-300">
                    <div className="flex items-center gap-3 md:gap-5">
                        <button
                            onClick={() => setCurrentChapter(prev => Math.max(1, prev - 1))}
                            disabled={currentChapter <= 1}
                            className={`p-1.5 md:p-2.5 naas-border transition-colors ${currentChapter <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#EAEAEA]'}`}
                        >
                            <ArrowLeft className="w-5 h-5 md:w-7 md:h-7 text-[#0A0A0A]" strokeWidth={2.5} />
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-xl md:text-3xl lg:text-4xl font-display font-black leading-none">{data.book} {data.chapter}</h1>
                            <motion.span
                                key={activeSubtitle}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs md:text-sm lg:text-base font-semibold text-gray-500 uppercase tracking-widest mt-1 md:mt-2"
                            >
                                {activeSubtitle}
                            </motion.span>
                        </div>
                    </div>
                    {/* Botón de opciones visuales ficticio por ahora */}
                    <button className="p-1.5 md:p-2.5 hover:bg-[#EAEAEA] naas-border transition-colors">
                        <MoreVertical className="w-5 h-5 md:w-7 md:h-7 text-[#0A0A0A]" strokeWidth={2.5} />
                    </button>
                </header>

                {/* Chat Feed - AIDA Phase 2: Interest */}
                <section
                    ref={scrollRef}
                    data-aida="interest"
                    className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-12 bg-[#FAFAFA] scroll-smooth"
                >
                    <div className="max-w-4xl mx-auto w-full space-y-6 md:space-y-10 pb-32 md:pb-48">

                        <AnimatePresence initial={false}>
                            {visibleMessages.map((msg) => {
                                if (msg.isSectionTitle) {
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                            className="text-center my-8 md:my-14"
                                        >
                                            <span className="inline-block bg-white text-[#0A0A0A] naas-border naas-shadow-sm px-4 py-2 md:px-5 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-wider text-center">
                                                {msg.text}
                                            </span>
                                        </motion.div>
                                    );
                                }

                                const isGod = msg.speaker === 'Dios';
                                const isNarrator = msg.speaker === 'Narrador';
                                const isLiked = likedMessages.has(msg.id);

                                if (isNarrator) {
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                            className="flex flex-col items-center my-6 md:my-10 relative"
                                            onDoubleClick={() => toggleLike(msg.id)}
                                        >
                                            <div className="cursor-pointer select-none max-w-[85%] sm:max-w-md md:max-w-xl lg:max-w-2xl bg-[#EAEAEA] border border-dashed border-[#0A0A0A] p-3 md:p-6 text-sm md:text-base lg:text-lg font-medium text-center text-gray-800 relative naas-interactive transition-all duration-300">
                                                <span className="text-[10px] md:text-xs font-bold text-gray-500 block mb-1 md:mb-2 uppercase tracking-widest">v.{msg.verse} NARRADOR</span>
                                                {msg.text}
                                                {/* Heart icon for Narrator */}
                                                <AnimatePresence>
                                                    {isLiked && (
                                                        <motion.div
                                                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                                            className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 bg-red-500 text-white rounded-full p-1.5 md:p-2 border-2 border-black shadow-[2px_2px_0_#0A0A0A]"
                                                        >
                                                            <Heart className="w-3 h-3 md:w-5 md:h-5 fill-current" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    );
                                }

                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, x: isGod ? -20 : 20, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 250, damping: 20 }}
                                        className={`flex flex-col mx-2 md:mx-4 ${isGod ? 'items-start' : 'items-end'} w-full relative z-0`}
                                    >
                                        <div className={`flex items-end gap-2 md:gap-4 lg:gap-5 max-w-[85%] sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl ${isGod ? 'flex-row' : 'flex-row-reverse'}`}>

                                            {/* Avatar */}
                                            <div className={`w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center shrink-0 naas-border naas-shadow-sm
                      ${isGod ? 'bg-[#FFD600]' : 'bg-white'}`}>
                                                <span className="text-xs md:text-sm lg:text-base font-black">{msg.speaker[0]}</span>
                                            </div>

                                            {/* Bubble */}
                                            <div
                                                onDoubleClick={() => toggleLike(msg.id)} // Double click to like!
                                                className={`cursor-pointer select-none group naas-border p-3 md:p-5 lg:p-6 flex flex-col relative transition-all duration-300
                                                ${isGod ? 'bg-white rounded-r-xl rounded-tl-xl md:rounded-r-2xl md:rounded-tl-2xl lg:rounded-r-3xl lg:rounded-tl-3xl' : 'bg-[#EAEAEA] rounded-l-xl rounded-tr-xl md:rounded-l-2xl md:rounded-tr-2xl lg:rounded-l-3xl lg:rounded-tr-3xl'}
                                                ${isGod ? 'naas-shadow-sm md:shadow-[4px_4px_0_#0A0A0A]' : ''}
                                            `}
                                            >
                                                <div className="flex items-center justify-between gap-6 md:gap-8 mb-1 md:mb-2 lg:mb-3">
                                                    <span className="text-[10px] md:text-xs lg:text-sm font-black uppercase tracking-wider">{msg.speaker}</span>
                                                    <span className="text-[10px] md:text-xs lg:text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors">v.{msg.verse}</span>
                                                </div>
                                                <p className={`text-[15px] md:text-lg lg:text-xl xl:text-2xl leading-snug md:leading-relaxed m-0 ${isGod ? 'font-bold font-display text-gray-900' : 'font-medium text-gray-800'}`}>
                                                    {msg.text}
                                                </p>

                                                {/* Instagram-style floating Heart Like */}
                                                <AnimatePresence>
                                                    {isLiked && (
                                                        <motion.div
                                                            initial={{ scale: 0, translateY: 10 }}
                                                            animate={{ scale: 1, translateY: 0 }}
                                                            exit={{ scale: 0, translateY: 10 }}
                                                            className={`absolute -bottom-3 ${isGod ? '-right-3 md:-right-4' : '-left-3 md:-left-4'} md:-bottom-4 bg-red-500 text-white rounded-full p-1.5 md:p-2 border-2 border-black shadow-[2px_2px_0_#0A0A0A]`}
                                                        >
                                                            <Heart className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {/* Typing Indicator if there is a pending message */}
                        <AnimatePresence>
                            {nextMessage && isAdvancing && nextMessage.speaker !== 'Narrador' && !nextMessage.isSectionTitle && (
                                <TypingIndicator speaker={nextMessage.speaker} isGod={nextMessage.speaker === 'Dios'} />
                            )}
                        </AnimatePresence>
                    </div>

                </section>

                {/* Input Bar / Bottom Action Area */}
                <div className="absolute bottom-0 w-full left-0 bg-white border-t-2 border-[#0A0A0A] p-3 md:p-5 lg:p-6 flex items-center justify-center z-30 sm:naas-shadow min-h-[72px] md:min-h-[100px] transition-all duration-300">
                    <div className="w-full max-w-4xl flex items-center gap-3 md:gap-5 lg:gap-8">
                        {!isComplete ? (
                            isNextSectionTitle ? (
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={handleNextMessageClick}
                                    className="w-full bg-[#FAFAFA] text-[#0A0A0A] py-3 px-4 md:py-4 md:px-6 lg:py-5 lg:px-8 flex items-center justify-center gap-2 md:gap-4 border-2 border-[#0A0A0A] naas-interactive font-black text-sm md:text-lg lg:text-xl tracking-tight shadow-[3px_3px_0_#0A0A0A] md:shadow-[6px_6px_0_#0A0A0A]"
                                >
                                    <BookOpen strokeWidth={2.5} className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mb-[2px]" />
                                    Siguiente Narración: {nextMessage?.text}
                                </motion.button>
                            ) : isNextUser ? (
                                <>
                                    <button
                                        className="flex-1 bg-[#FAFAFA] border-2 border-[#0A0A0A] px-4 py-3 md:px-6 md:py-4 text-sm md:text-lg lg:text-xl font-semibold text-gray-800 text-left truncate overflow-hidden relative naas-interactive transition-all duration-300"
                                        onClick={handleNextMessageClick}
                                    >
                                        <span className="opacity-60 text-xs md:text-sm uppercase font-black mr-2 md:mr-3 tracking-widest">{nextMessage?.speaker}:</span>
                                        {nextMessage?.text}
                                    </button>
                                    <button
                                        onClick={handleNextMessageClick}
                                        disabled={isAdvancing}
                                        className="bg-[#FFD600] w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center shrink-0 border-2 border-[#0A0A0A] naas-shadow-sm hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#0A0A0A] md:hover:shadow-[6px_6px_0_#0A0A0A] transition-all duration-150 active:scale-95"
                                    >
                                        <Send className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-[#0A0A0A] transform translate-x-[1px]" strokeWidth={2.5} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex-1 px-4 py-3 md:py-5 text-sm md:text-lg lg:text-xl font-bold text-gray-400 italic text-center uppercase tracking-widest">
                                    {nextMessage?.speaker} te está contactando...
                                </div>
                            )
                        ) : (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => setCurrentChapter(prev => prev + 1)}
                                data-aida="action"
                                data-cta="primary"
                                className="w-full bg-[#FFD600] text-[#0A0A0A] py-3 px-4 md:py-5 md:px-6 lg:py-6 lg:px-8 flex items-center justify-center gap-2 md:gap-4 border-2 border-[#0A0A0A] naas-interactive font-black text-lg md:text-2xl lg:text-3xl tracking-tight shadow-[3px_3px_0_#0A0A0A] md:shadow-[6px_6px_0_#0A0A0A]"
                            >
                                <BookOpen strokeWidth={2.5} className="w-5 h-5 md:w-8 md:h-8 lg:w-10 lg:h-10 mb-[2px]" />
                                Siguiente Capítulo
                            </motion.button>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
