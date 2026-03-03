import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical, BookOpen, Send, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Speaker = 'Narrador' | 'Dios' | 'Moisés';

interface Message {
    id: string;
    speaker: Speaker;
    text: string;
    verse: number;
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
        className={`flex items-end gap-2 max-w-[85%] ${isGod ? 'flex-row' : 'flex-row-reverse'} mx-2 w-full mt-4`}
    >
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 naas-border naas-shadow-sm
      ${isGod ? 'bg-[#FFD600]' : 'bg-white'}`}>
            <span className="text-xs font-black">{speaker[0]}</span>
        </div>

        {/* Bubble */}
        <div className={`naas-border p-3 flex flex-col relative
      ${isGod ? 'bg-white rounded-r-xl rounded-tl-xl' : 'bg-[#EAEAEA] rounded-l-xl rounded-tr-xl'}
      ${isGod ? 'naas-shadow-sm' : ''}
    `}>
            <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{speaker} ESTÁ ESCRIBIENDO...</span>
            </div>
            <div className="flex gap-1 h-3 items-center">
                <motion.div className="w-1.5 h-1.5 bg-[#0A0A0A] rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} />
                <motion.div className="w-1.5 h-1.5 bg-[#0A0A0A] rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} />
                <motion.div className="w-1.5 h-1.5 bg-[#0A0A0A] rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} />
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
    const [currentChapter, setCurrentChapter] = useState(3);

    // Fetch JSON data
    useEffect(() => {
        setData(null);
        setCurrentIndex(-1);
        setLikedMessages(new Set());
        fetch(`/data/exodus/${currentChapter}.json`)
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
    }, [currentChapter]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentIndex, isAdvancing]);

    const visibleMessages = data ? data.messages.slice(0, currentIndex + 1) : [];
    const nextMessage = data && (currentIndex + 1 < data.messages.length) ? data.messages[currentIndex + 1] : null;
    const isComplete = data ? (!nextMessage && currentIndex >= 0) : false;

    const isNextSystem = nextMessage && (nextMessage.speaker === 'Dios' || nextMessage.speaker === 'Narrador');
    const isNextUser = nextMessage && !isNextSystem;

    // Auto-advance logic for system messages
    useEffect(() => {
        if (!nextMessage || isNextUser) return;

        let isMounted = true;
        const autoAdvance = async () => {
            setIsAdvancing(true);
            // Simulate typing based on character count
            const delay = nextMessage.speaker === 'Narrador' ? 600 : Math.min(Math.max(nextMessage.text.length * 15, 800), 2500);
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
    }, [nextMessage, isNextUser]);

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
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">

            {/* Mobile Device Mockup Container */}
            <main className="w-full max-w-md bg-white naas-border naas-shadow flex flex-col h-[85vh] relative overflow-hidden" data-viewport-scope="hero">

                {/* Header - AIDA Phase 1: Attention */}
                <header data-aida="attention" className="border-b-2 border-[#0A0A0A] bg-[#FAFAFA] shrink-0 p-4 sticky top-0 z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setCurrentChapter(prev => Math.max(3, prev - 1))}
                            disabled={currentChapter <= 3}
                            className={`p-1 naas-border transition-colors ${currentChapter <= 3 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#EAEAEA]'}`}
                        >
                            <ArrowLeft className="w-5 h-5 text-[#0A0A0A]" strokeWidth={2.5} />
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-display font-black leading-none">{data.book} {data.chapter}</h1>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">{data.title}</span>
                        </div>
                    </div>
                    {/* Botón de opciones visuales ficticio por ahora */}
                    <button className="p-1 hover:bg-[#EAEAEA] naas-border transition-colors">
                        <MoreVertical className="w-5 h-5 text-[#0A0A0A]" strokeWidth={2.5} />
                    </button>
                </header>

                {/* Chat Feed - AIDA Phase 2: Interest */}
                <section
                    ref={scrollRef}
                    data-aida="interest"
                    className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 bg-[#FAFAFA] pb-32 scroll-smooth"
                >
                    <div className="text-center mb-6">
                        <span className="inline-block bg-white naas-border naas-shadow-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                            Monte Horeb
                        </span>
                    </div>

                    <AnimatePresence initial={false}>
                        {visibleMessages.map((msg) => {
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
                                        className="flex flex-col items-center my-6 relative"
                                        onDoubleClick={() => toggleLike(msg.id)}
                                    >
                                        <div className="cursor-pointer select-none max-w-[85%] bg-[#EAEAEA] border border-dashed border-[#0A0A0A] p-3 text-sm font-medium text-center text-gray-800 relative naas-interactive">
                                            <span className="text-[10px] font-bold text-gray-500 block mb-1 uppercase tracking-widest">v.{msg.verse} NARRADOR</span>
                                            {msg.text}
                                            {/* Heart icon for Narrator */}
                                            <AnimatePresence>
                                                {isLiked && (
                                                    <motion.div
                                                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                                        className="absolute -bottom-3 -right-3 bg-red-500 text-white rounded-full p-1.5 border-2 border-black shadow-[2px_2px_0_#0A0A0A]"
                                                    >
                                                        <Heart className="w-3 h-3 fill-current" />
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
                                    className={`flex flex-col mx-2 ${isGod ? 'items-start' : 'items-end'} w-full relative z-0`}
                                >
                                    <div className={`flex items-end gap-2 max-w-[85%] ${isGod ? 'flex-row' : 'flex-row-reverse'}`}>

                                        {/* Avatar */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 naas-border naas-shadow-sm
                      ${isGod ? 'bg-[#FFD600]' : 'bg-white'}`}>
                                            <span className="text-xs font-black">{msg.speaker[0]}</span>
                                        </div>

                                        {/* Bubble */}
                                        <div
                                            onDoubleClick={() => toggleLike(msg.id)} // Double click to like!
                                            className={`cursor-pointer select-none group naas-border p-3 flex flex-col relative
                                                ${isGod ? 'bg-white rounded-r-xl rounded-tl-xl' : 'bg-[#EAEAEA] rounded-l-xl rounded-tr-xl'}
                                                ${isGod ? 'naas-shadow-sm' : ''}
                                            `}
                                        >
                                            <div className="flex items-center justify-between gap-6 mb-1">
                                                <span className="text-[10px] font-black uppercase tracking-wider">{msg.speaker}</span>
                                                <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-600 transition-colors">v.{msg.verse}</span>
                                            </div>
                                            <p className={`text-[15px] leading-snug m-0 ${isGod ? 'font-bold font-display' : 'font-medium'}`}>
                                                {msg.text}
                                            </p>

                                            {/* Instagram-style floating Heart Like */}
                                            <AnimatePresence>
                                                {isLiked && (
                                                    <motion.div
                                                        initial={{ scale: 0, translateY: 10 }}
                                                        animate={{ scale: 1, translateY: 0 }}
                                                        exit={{ scale: 0, translateY: 10 }}
                                                        className={`absolute -bottom-3 ${isGod ? '-right-3' : '-left-3'} bg-red-500 text-white rounded-full p-1.5 border-2 border-black shadow-[2px_2px_0_#0A0A0A]`}
                                                    >
                                                        <Heart className="w-4 h-4 fill-current" />
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
                        {nextMessage && isAdvancing && nextMessage.speaker !== 'Narrador' && (
                            <TypingIndicator speaker={nextMessage.speaker} isGod={nextMessage.speaker === 'Dios'} />
                        )}
                    </AnimatePresence>

                </section>

                {/* Input Bar / Bottom Action Area */}
                <div className="absolute bottom-0 w-full left-0 bg-white border-t-2 border-[#0A0A0A] p-3 flex items-center gap-3 z-30 naas-shadow h-[72px]">
                    {!isComplete ? (
                        isNextUser ? (
                            <>
                                <button
                                    className="flex-1 bg-[#FAFAFA] border-2 border-[#0A0A0A] px-4 py-2 text-sm font-semibold text-gray-800 text-left truncate overflow-hidden relative naas-interactive"
                                    onClick={handleNextMessageClick}
                                >
                                    <span className="opacity-60 text-xs uppercase font-black mr-2 tracking-widest">{nextMessage?.speaker}:</span>
                                    {nextMessage?.text}
                                </button>
                                <button
                                    onClick={handleNextMessageClick}
                                    disabled={isAdvancing}
                                    className="bg-[#FFD600] w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 border-[#0A0A0A] naas-shadow-sm hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#0A0A0A] transition-all duration-150 active:scale-95"
                                >
                                    <Send className="w-5 h-5 text-[#0A0A0A] transform translate-x-[1px]" strokeWidth={2.5} />
                                </button>
                            </>
                        ) : (
                            <div className="flex-1 px-4 py-2 text-sm font-bold text-gray-400 italic text-center uppercase tracking-widest">
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
                            className="w-full bg-[#FFD600] text-[#0A0A0A] py-3 px-4 flex items-center justify-center gap-2 border-2 border-[#0A0A0A] naas-interactive font-black text-lg tracking-tight shadow-[3px_3px_0_#0A0A0A]"
                        >
                            <BookOpen strokeWidth={2.5} className="w-5 h-5 mb-[2px]" />
                            Siguiente Capítulo
                        </motion.button>
                    )}
                </div>

            </main>
        </div>
    );
}
