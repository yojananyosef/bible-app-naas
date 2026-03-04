import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical, BookOpen, Send, Heart, Book, ChevronDown, RefreshCw, MessageSquare, ShieldCheck, Users, Search, CheckCheck } from 'lucide-react';
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

interface BookInfo {
    id: string;
    name: string;
    availableChapters: number[];
    category: string;
    description: string;
}

const BIBLE_BOOKS: BookInfo[] = [
    {
        id: 'genesis',
        name: 'Génesis',
        availableChapters: [1],
        category: 'Pentateuco',
        description: 'El libro de los comienzos: la creación, la caída y la promesa.'
    },
    {
        id: 'exodus',
        name: 'Éxodo',
        availableChapters: [3, 4],
        category: 'Pentateuco',
        description: 'La liberación de Egipto y el encuentro con Dios en el Sinaí.'
    }
];

// Typing indicator
const TypingIndicator = ({ speaker, isGod }: { speaker: string; isGod: boolean }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
        className={`flex items-end gap-2 md:gap-4 max-w-[85%] sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl ${isGod ? 'flex-row' : 'flex-row-reverse'} mx-2 md:mx-4 lg:mx-6 w-full mt-4 md:mt-6 transition-all duration-300`}
    >
        <div className={`w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center shrink-0 naas-border naas-shadow-sm
      ${isGod ? 'bg-[#FFD600]' : 'bg-white'}`}>
            <span className="text-xs md:text-sm lg:text-base font-black">{speaker[0]}</span>
        </div>
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
    // Persistent States
    const [view, setView] = useState<'home' | 'chat'>('home');
    const [currentBook, setCurrentBook] = useState(() => localStorage.getItem('lastBook') || 'genesis');

    const getInitialChapter = (bookId: string) => {
        const saved = localStorage.getItem(`lastChapter_${bookId}`);
        const book = BIBLE_BOOKS.find(b => b.id === bookId);
        if (!book) return 1;
        const savedLevel = saved ? Number(saved) : -1;
        if (book.availableChapters.includes(savedLevel)) return savedLevel;
        return book.availableChapters[0] || 1;
    };

    const [currentChapter, setCurrentChapter] = useState(() => getInitialChapter(currentBook));

    const [likedMessages, setLikedMessages] = useState<Set<string>>(() => {
        const saved = localStorage.getItem('likedMessages');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    // Session States
    const [data, setData] = useState<ChapterData | null>(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isAdvancing, setIsAdvancing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showChapterSelector, setShowChapterSelector] = useState(false);
    const [showSystemLogs, setShowSystemLogs] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const popAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        popAudio.current = new Audio('/sounds/pop.mp3');
        if (popAudio.current) popAudio.current.volume = 0.3;
    }, []);

    const playPop = () => {
        if (popAudio.current && view === 'chat') {
            popAudio.current.currentTime = 0;
            popAudio.current.play().catch(() => { });
        }
    };

    // Persistence Effect
    useEffect(() => {
        localStorage.setItem('lastBook', currentBook);
        localStorage.setItem(`lastChapter_${currentBook}`, currentChapter.toString());
        localStorage.setItem('likedMessages', JSON.stringify(Array.from(likedMessages)));
    }, [currentBook, currentChapter, likedMessages]);

    // Reset session when going home
    useEffect(() => {
        if (view === 'home') {
            setData(null);
            setCurrentIndex(-1);
            setIsAdvancing(false);
            setShowSystemLogs(false);
        }
    }, [view]);

    // Fetch JSON data
    useEffect(() => {
        if (view !== 'chat') return;
        setData(null);
        setError(null);
        setCurrentIndex(-1);

        fetch(`/data/${currentBook}/${currentChapter}.json`)
            .then(res => {
                if (!res.ok) throw new Error(`El capítulo ${currentChapter} no pudo ser cargado.`);
                return res.json();
            })
            .then((json: ChapterData) => {
                setData(json);
                setCurrentIndex(0);
                setShowSystemLogs(true);
            })
            .catch(err => {
                setError(err.message);
            });
    }, [currentBook, currentChapter, view]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentIndex, isAdvancing, showSystemLogs]);

    // Sound sync
    useLayoutEffect(() => {
        if (currentIndex < 0 || !data || view !== 'chat') return;
        const msg = data.messages[currentIndex];
        if (msg && msg.speaker !== 'Narrador' && !msg.isSectionTitle) {
            playPop();
        }
    }, [currentIndex, data, view]);

    const visibleMessages = data ? data.messages.slice(0, currentIndex + 1) : [];
    const nextMessage = data && (currentIndex + 1 < data.messages.length) ? data.messages[currentIndex + 1] : null;
    const isComplete = data ? (!nextMessage && currentIndex >= 0) : false;

    const lastSectionTitleMessage = visibleMessages.slice().reverse().find((msg: Message) => msg.isSectionTitle);
    const activeSubtitle = lastSectionTitleMessage ? lastSectionTitleMessage.text : (data?.title || '');

    const isNextSectionTitle = nextMessage && nextMessage.isSectionTitle;
    const isNextUser = nextMessage && (nextMessage.speaker !== 'Dios' && nextMessage.speaker !== 'Narrador' && !nextMessage.isSectionTitle);

    // Auto-advance logic
    useEffect(() => {
        if (!nextMessage || isNextUser || !data || view !== 'chat') return;

        let isMounted = true;
        const autoAdvance = async () => {
            setIsAdvancing(true);
            const currentMessage = currentIndex >= 0 ? data.messages[currentIndex] : null;
            const readingTime = currentMessage ? Math.max(currentMessage.text.length * 100, 4000) : 3000;
            const typingTime = Math.max(nextMessage.text.length * 80, 3500);

            let delay = 0;
            if (nextMessage.speaker === 'Narrador') {
                delay = Math.min(readingTime + 2000, 15000);
            } else if (nextMessage.isSectionTitle) {
                return;
            } else {
                delay = Math.min(typingTime + (readingTime * 0.3), 15000);
            }

            await new Promise(r => setTimeout(r, delay));

            if (isMounted && view === 'chat') {
                setCurrentIndex((prev: number) => prev + 1);
                setIsAdvancing(false);
            }
        };

        autoAdvance();
        return () => { isMounted = false; setIsAdvancing(false); };
    }, [nextMessage, isNextUser, currentIndex, data, view]);

    const handleNextMessageClick = async () => {
        if (!nextMessage || isAdvancing || !isNextUser) return;
        setIsAdvancing(true);
        setCurrentIndex((prev: number) => prev + 1);
        setIsAdvancing(false);
    };

    const toggleLike = (id: string) => {
        setLikedMessages((prev: Set<string>) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const handleBookSelect = (bookId: string) => {
        const initialChap = getInitialChapter(bookId);
        setCurrentBook(bookId);
        setCurrentChapter(initialChap);
        setView('chat');
    };

    // --- RENDER HOME ---
    if (view === 'home') {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center sm:p-4 md:p-8">
                <main className="w-full max-w-6xl bg-white sm:naas-border sm:naas-shadow flex flex-col h-[100dvh] sm:h-[90vh] overflow-hidden transition-all duration-300 mx-auto font-display">
                    <header className="border-b-2 border-black bg-[#FFD600] p-6 flex items-center justify-between shrink-0">
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">BIBLIA CHAT</h1>
                            <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Mensajería Sagrada</span>
                        </div>
                        <div className="flex gap-4">
                            <button className="p-2 hover:bg-black/10 rounded-full transition-colors"><Search className="w-6 h-6" /></button>
                            <button className="p-2 hover:bg-black/10 rounded-full transition-colors"><MoreVertical className="w-6 h-6" /></button>
                        </div>
                    </header>

                    <section className="flex-1 overflow-y-auto bg-white">
                        <div className="divide-y-2 divide-gray-100 italic p-4 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Selecciona una revelación para continuar
                        </div>
                        <div className="divide-y-2 divide-gray-100">
                            {BIBLE_BOOKS.map((book) => {
                                const lastChap = Number(localStorage.getItem(`lastChapter_${book.id}`)) || book.availableChapters[0];
                                return (
                                    <button
                                        key={book.id}
                                        onClick={() => handleBookSelect(book.id)}
                                        className="w-full p-5 md:p-6 flex items-center gap-4 md:gap-6 hover:bg-gray-50 transition-all text-left active:bg-gray-100 group"
                                    >
                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full naas-border bg-white flex items-center justify-center shrink-0 naas-shadow-sm group-hover:shadow-[4px_4px_0_#FFD600] transition-all">
                                            <Users className="w-6 h-6 md:w-8 md:h-8" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <h2 className="text-lg md:text-xl font-black uppercase truncate">{book.name}</h2>
                                                <span className="text-[10px] font-bold text-gray-400">Cap {lastChap}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs md:text-sm text-gray-400 font-medium truncate leading-tight pr-4">
                                                    {book.description}
                                                </p>
                                                <CheckCheck className="w-4 h-4 text-blue-500 opacity-60 shrink-0" />
                                            </div>
                                            <div className="mt-2 text-[10px] font-black text-[#FFD600] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                Continuar lectura →
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <nav className="border-t-2 border-black bg-[#FAFAFA] p-4 flex justify-around items-center shrink-0">
                        <div className="flex flex-col items-center gap-1 cursor-pointer">
                            <MessageSquare className="w-6 h-6" />
                            <span className="text-[8px] font-black uppercase">CHATS</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 opacity-20 cursor-not-allowed">
                            <Users className="w-6 h-6" />
                            <span className="text-[8px] font-black uppercase">COMUNIDAD</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 opacity-20 cursor-not-allowed">
                            <Book className="w-6 h-6" />
                            <span className="text-[8px] font-black uppercase">LIBROS</span>
                        </div>
                    </nav>
                </main>
            </div>
        );
    }

    // --- RENDER CHAT ---
    const bookConfig = BIBLE_BOOKS.find(b => b.id === currentBook);

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center sm:p-4 md:p-8 transition-all duration-300 font-display">
            {/* Main Application Window */}
            <main className="w-full max-w-6xl bg-white sm:naas-border sm:naas-shadow flex flex-col h-[100dvh] sm:h-[90vh] relative overflow-hidden transition-all duration-300 mx-auto">
                {/* Fixed Header */}
                <header className="border-b-2 border-[#0A0A0A] bg-[#FAFAFA] p-4 md:p-6 sticky top-0 z-50 flex items-center justify-between shrink-0 h-20 md:h-24 transition-all">
                    <div className="flex items-center gap-4 min-w-0 h-full">
                        <button onClick={() => setView('home')} className="p-2 naas-border hover:bg-gray-100 transition-colors shrink-0">
                            <ArrowLeft className="w-6 h-6 text-[#0A0A0A]" strokeWidth={2.5} />
                        </button>
                        <div className="min-w-0 text-left flex flex-col justify-center">
                            <button onClick={() => setShowChapterSelector(!showChapterSelector)} className="flex items-center gap-2 group max-w-full">
                                <h1 className="text-xl md:text-2xl font-black leading-none uppercase truncate">{bookConfig?.name} • Cap {currentChapter}</h1>
                                <ChevronDown className={`w-5 h-5 transition-transform shrink-0 ${showChapterSelector ? 'rotate-180' : ''}`} strokeWidth={3} />
                            </button>
                            <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] block truncate mt-1">{activeSubtitle}</span>
                        </div>
                    </div>

                    {/* Floating Chapter Selector Sidebar/Popover */}
                    <AnimatePresence>
                        {showChapterSelector && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute top-[90%] left-4 right-4 bg-white border-2 border-black z-[100] p-6 naas-shadow grid grid-cols-4 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto"
                            >
                                {bookConfig?.availableChapters.map(chap => (
                                    <button
                                        key={chap}
                                        onClick={() => { setCurrentChapter(chap); setShowChapterSelector(false); }}
                                        className={`p-3 naas-border font-black text-sm transition-all ${currentChapter === chap ? 'bg-[#FFD600]' : 'hover:bg-gray-100'}`}
                                    >
                                        {chap}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button className="p-2 naas-border hover:bg-gray-100 shrink-0"><MoreVertical className="w-6 h-6" strokeWidth={2.5} /></button>
                </header>

                {/* Scrollable Chat Area */}
                <section ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-[#FAFAFA] space-y-8 scroll-smooth pb-40">
                    {error ? (
                        <div className="py-20 flex flex-col items-center text-center opacity-40 italic">
                            <RefreshCw className="w-10 h-10 mb-4 animate-spin" />
                            <p className="font-black uppercase text-xs tracking-widest">{error}</p>
                            <p className="text-[10px] mt-2">Capítulo no disponible en la base de datos local</p>
                        </div>
                    ) : (data && visibleMessages.length > 0) ? (
                        <>
                            {showSystemLogs && (
                                <div className="flex flex-col items-center gap-3 mb-10 opacity-60">
                                    <div className="flex items-center gap-2 bg-gray-200 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">
                                        <ShieldCheck className="w-3 h-3" /> El Espíritu Santo ha creado este grupo hace eones
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-200 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">
                                        <MessageSquare className="w-3 h-3" /> Te has unido al grupo de {bookConfig?.name}
                                    </div>
                                </div>
                            )}

                            <AnimatePresence initial={false}>
                                {visibleMessages.map((msg: Message) => {
                                    if (msg.isSectionTitle) {
                                        return (
                                            <motion.div key={msg.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center my-12">
                                                <span className="inline-block bg-[#FFD600] text-[#0A0A0A] naas-border naas-shadow-sm px-6 py-2 text-xs font-black uppercase tracking-widest">{msg.text}</span>
                                            </motion.div>
                                        );
                                    }

                                    const isGod = msg.speaker === 'Dios';
                                    const isLiked = likedMessages.has(`${currentBook}_${msg.id}`);

                                    if (msg.speaker === 'Narrador') {
                                        return (
                                            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center" onDoubleClick={() => toggleLike(`${currentBook}_${msg.id}`)}>
                                                <div className="cursor-pointer max-w-2xl bg-[#EAEAEA] border border-dashed border-[#0A0A0A] p-6 text-center relative font-medium text-gray-800 transition-colors hover:bg-[#F2F2F2]">
                                                    <span className="text-[10px] font-black text-gray-400 block mb-2 uppercase tracking-widest">v.{msg.verse} NARRADOR</span>
                                                    {msg.text}
                                                    <AnimatePresence>
                                                        {isLiked && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                exit={{ scale: 0 }}
                                                                className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 bg-red-500 text-white rounded-full p-2 border-2 border-black shadow-[2px_2px_0_#0A0A0A]"
                                                            >
                                                                <Heart className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </motion.div>
                                        );
                                    }

                                    return (
                                        <motion.div key={msg.id} initial={{ opacity: 0, x: isGod ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} className={`flex flex-col ${isGod ? 'items-start' : 'items-end'} w-full`}>
                                            <div className={`flex items-end gap-3 max-w-[85%] ${isGod ? 'flex-row' : 'flex-row-reverse'}`}>
                                                <div className={`w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center naas-border naas-shadow-sm font-black shrink-0 ${isGod ? 'bg-[#FFD600]' : 'bg-white'} transition-all`}>
                                                    {msg.speaker[0]}
                                                </div>
                                                <div
                                                    onDoubleClick={() => toggleLike(`${currentBook}_${msg.id}`)}
                                                    className={`cursor-pointer naas-border p-4 md:p-6 transition-all relative ${isGod ? 'bg-white rounded-r-2xl rounded-tl-2xl naas-shadow-sm hover:shadow-[4px_4px_0_#FFD600]' : 'bg-[#EAEAEA] rounded-l-2xl rounded-tr-2xl hover:bg-[#DEDEDE]'}`}
                                                >
                                                    <div className="flex justify-between gap-8 mb-2">
                                                        <span className="text-xs font-black uppercase tracking-tight">{msg.speaker}</span>
                                                        <span className="text-xs font-bold text-gray-400">v.{msg.verse}</span>
                                                    </div>
                                                    <p className={`text-base md:text-xl lg:text-2xl ${isGod ? 'font-black text-black leading-tight' : 'font-medium text-gray-800'}`}>{msg.text}</p>
                                                    <AnimatePresence>
                                                        {isLiked && (
                                                            <motion.div
                                                                initial={{ scale: 0, y: 10 }}
                                                                animate={{ scale: 1, y: 0 }}
                                                                exit={{ scale: 0, y: 10 }}
                                                                className={`absolute -bottom-3 ${isGod ? '-right-3 md:-right-4' : '-left-3 md:-left-4'} md:-bottom-4 bg-red-500 text-white rounded-full p-2 border-2 border-black shadow-[2px_2px_0_#0A0A0A]`}
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

                            {nextMessage && isAdvancing && nextMessage.speaker !== 'Narrador' && !nextMessage.isSectionTitle && (
                                <TypingIndicator speaker={nextMessage.speaker} isGod={nextMessage.speaker === 'Dios'} />
                            )}
                        </>
                    ) : (
                        <div className="py-20 flex flex-col items-center text-center opacity-40 italic">
                            <RefreshCw className="w-10 h-10 mb-4 animate-spin" />
                            <p className="font-black uppercase text-xs tracking-widest">Sincronizando la revelación...</p>
                        </div>
                    )}
                </section>

                {/* Fixed Bottom Input Bar */}
                <div className="border-t-2 border-black bg-white p-4 md:p-6 flex justify-center z-50 shrink-0 h-24 md:h-28 transition-all">
                    <div className="w-full max-w-4xl flex items-center gap-4 h-full">
                        {!error && data && !isComplete ? (
                            isNextSectionTitle ? (
                                <button onClick={handleNextMessageClick} className="w-full h-full bg-[#FAFAFA] naas-border font-black uppercase text-xs md:text-lg shadow-[4px_4px_0_#0A0A0A] flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 mr-3 hidden md:block" /> {nextMessage?.text}
                                </button>
                            ) : isNextUser ? (
                                <>
                                    <button onClick={handleNextMessageClick} className="flex-1 h-full bg-[#FAFAFA] naas-border px-6 text-left font-semibold text-gray-800 truncate flex flex-col justify-center">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{nextMessage?.speaker}</span>
                                        <span className="truncate block leading-tight">{nextMessage?.text}</span>
                                    </button>
                                    <button onClick={handleNextMessageClick} className="bg-[#FFD600] w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center naas-border naas-shadow-sm active:scale-95 transition-all outline-none shrink-0"><Send className="w-7 h-7" /></button>
                                </>
                            ) : (
                                <div className="flex-1 h-full flex items-center justify-center font-black text-gray-400 uppercase tracking-[0.3em] italic animate-pulse text-xs md:text-sm">
                                    {nextMessage?.speaker} ESCRIBIENDO...
                                </div>
                            )
                        ) : error ? (
                            <button onClick={() => setView('home')} className="w-full h-full bg-[#FFD600] naas-border font-black uppercase shadow-[4px_4px_0_#0A0A0A]">Regresar a la Selección</button>
                        ) : isComplete ? (
                            <button
                                onClick={() => {
                                    const nextIdx = bookConfig ? bookConfig.availableChapters.indexOf(currentChapter) + 1 : -1;
                                    if (bookConfig && nextIdx < bookConfig.availableChapters.length) {
                                        setCurrentChapter(bookConfig.availableChapters[nextIdx]);
                                    } else {
                                        setView('home');
                                    }
                                }}
                                className="w-full h-full bg-[#FFD600] naas-border font-black text-lg md:text-2xl uppercase shadow-[6px_6px_0_#0A0A0A] flex items-center justify-center"
                            >
                                <BookOpen className="w-6 h-6 mr-3" /> {bookConfig && (bookConfig.availableChapters.indexOf(currentChapter) + 1 < bookConfig.availableChapters.length) ? 'Siguiente Capítulo' : 'Finalizar Lectura'}
                            </button>
                        ) : null}
                    </div>
                </div>
            </main>
        </div>
    );
}
