import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, MessageSquare, Users, Book, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Constants & Types
import { BIBLE_BOOKS } from './constants/books';
import { BookInfo, Message } from './types/bible';

// Hooks
import { useSettings } from './hooks/useSettings';
import { useBibleChat } from './hooks/useBibleChat';
import { useAudio } from './hooks/useSettings';

// UI Components
import { Surface, Avatar } from './components/ui/Surface';
import { GroupListItem } from './components/home/GroupListItem';
import { MessageBubble } from './components/chat/MessageBubble';
import { TypingIndicator } from './components/chat/TypingIndicator';
import { ChatHeader } from './components/chat/ChatHeader';
import { InputBar } from './components/chat/InputBar';
import { GroupInfoDrawer } from './components/chat/GroupInfoDrawer';

export default function App() {
    // --- Persistence & Settings ---
    const [view, setView] = useState<'home' | 'chat'>('home');
    const [currentBookId, setCurrentBookId] = useState(() => localStorage.getItem('lastBook') || 'genesis');
    const { isMuted, setIsMuted, readingSpeed, setReadingSpeed } = useSettings();
    const { playPop } = useAudio(isMuted);

    const bookConfig = BIBLE_BOOKS.find(b => b.id === currentBookId);

    const getInitialChapter = (bookId: string) => {
        const saved = localStorage.getItem(`lastChapter_${bookId}`);
        const book = BIBLE_BOOKS.find(b => b.id === bookId);
        if (!book) return 1;
        const savedVal = saved ? Number(saved) : -1;
        return book.availableChapters.includes(savedVal) ? savedVal : (book.availableChapters[0] || 1);
    };

    const [currentChapter, setCurrentChapter] = useState(() => getInitialChapter(currentBookId));
    const [likedMessages, setLikedMessages] = useState<Set<string>>(() => {
        const saved = localStorage.getItem('likedMessages');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    // --- Chat Logic ---
    const {
        data, currentIndex, isAdvancing, error, visibleMessages,
        nextMessage, isNextUser, handleManualNext, restartChapter
    } = useBibleChat(currentBookId, currentChapter, readingSpeed, view === 'chat', (msg: Message) => {
        if (msg.speaker !== 'Narrador' && !msg.isSectionTitle) playPop();
    });

    // --- UI State ---
    const [showSelector, setShowSelector] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Persistence Effect
    useEffect(() => {
        localStorage.setItem('lastBook', currentBookId);
        localStorage.setItem(`lastChapter_${currentBookId}`, currentChapter.toString());
        localStorage.setItem('likedMessages', JSON.stringify(Array.from(likedMessages)));
    }, [currentBookId, currentChapter, likedMessages]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [currentIndex, isAdvancing]);

    const handleSelectBook = (id: string) => {
        const initialChap = getInitialChapter(id);
        setCurrentBookId(id);
        setCurrentChapter(initialChap);
        setView('chat');
    };

    const handleToggleLike = (id: string) => {
        setLikedMessages(prev => {
            const next = new Set(prev);
            const key = `${currentBookId}_${id}`;
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const handleNextChapter = () => {
        const nextIdx = bookConfig ? bookConfig.availableChapters.indexOf(currentChapter) + 1 : -1;
        if (bookConfig && nextIdx < bookConfig.availableChapters.length) {
            setCurrentChapter(bookConfig.availableChapters[nextIdx]);
        } else {
            setView('home');
        }
    };

    // --- Render Logic ---
    if (view === 'home') {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center sm:p-4 md:p-8">
                <main data-viewport-scope="home" className="w-full max-w-6xl bg-white border-4 border-[#0A0A0A] flex flex-col h-[100dvh] sm:h-[90vh] overflow-hidden shadow-[8px_8px_0_#0A0A0A] mx-auto font-sans">
                    <header data-aida="attention" className="border-b-4 border-black bg-[#FFD600] p-6 flex items-center justify-between shrink-0">
                        <div className="flex flex-col text-left">
                            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none italic">BIBLIA CHAT</h1>
                            <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-100">Neo-AIDA Accessible System</span>
                        </div>
                        <div className="flex gap-4">
                            <Surface className="p-2 rounded-full border-2"><Search className="w-5 h-5" /></Surface>
                            <Surface className="p-2 rounded-full border-2"><MoreVertical className="w-5 h-5" /></Surface>
                        </div>
                    </header>

                    <section data-aida="interest" className="flex-1 overflow-y-auto bg-white">
                        <div className="italic p-4 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 border-b-2 border-gray-100">
                            Canal de Revelación Activo
                        </div>
                        <div className="">
                            {BIBLE_BOOKS.map((book) => (
                                <GroupListItem
                                    key={book.id}
                                    book={book}
                                    lastChapter={Number(localStorage.getItem(`lastChapter_${book.id}`)) || book.availableChapters[0]}
                                    onSelect={handleSelectBook}
                                />
                            ))}
                        </div>
                    </section>

                    <nav data-aida="action" className="border-t-4 border-black bg-[#FAFAFA] p-4 flex justify-around items-center shrink-0">
                        <div className="flex flex-col items-center gap-1 cursor-pointer"><MessageSquare className="w-6 h-6" /><span className="text-[8px] font-black uppercase">CHATS</span></div>
                        <div className="flex flex-col items-center gap-1 opacity-20"><Users className="w-6 h-6" /><span className="text-[8px] font-black uppercase">COMMUNITY</span></div>
                        <div className="flex flex-col items-center gap-1 opacity-20"><Book className="w-6 h-6" /><span className="text-[8px] font-black uppercase">SCRIPTORIUM</span></div>
                    </nav>
                </main>
            </div>
        );
    }

    const lastSectionTitle = visibleMessages.slice().reverse().find(m => m.isSectionTitle);
    const subtitle = lastSectionTitle ? lastSectionTitle.text : (data?.title || '');

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center sm:p-4 md:p-8 font-sans">
            <main data-viewport-scope="chat" className="w-full max-w-6xl bg-white border-4 border-[#0A0A0A] shadow-[8px_8px_0_#0A0A0A] flex flex-col h-[100dvh] sm:h-[90vh] relative overflow-hidden mx-auto">
                <ChatHeader
                    book={bookConfig} chapter={currentChapter} subtitle={subtitle}
                    onBack={() => setView('home')}
                    onToggleSelector={() => setShowSelector(!showSelector)} isSelectorOpen={showSelector}
                    onSelectChapter={(c) => { setCurrentChapter(c); setShowSelector(false); }}
                    isMuted={isMuted} currentSpeed={readingSpeed}
                    onToggleMute={() => setIsMuted(!isMuted)} onSetSpeed={setReadingSpeed}
                    onShowInfo={() => setShowInfo(true)} onRestart={restartChapter}
                    isOptionsOpen={showOptions} onToggleOptions={() => setShowOptions(!showOptions)}
                />

                <section ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-[#FAFAFA] space-y-12 scroll-smooth pb-40">
                    {error ? (
                        <div className="py-20 flex flex-col items-center opacity-40 italic"><RefreshCw className="w-10 h-10 mb-4 animate-spin" /><p className="font-black uppercase text-xs">{error}</p></div>
                    ) : (data && visibleMessages.length > 0) ? (
                        <>
                            <div className="flex flex-col items-center gap-3 mb-10 opacity-60">
                                <div className="flex items-center gap-2 bg-gray-200 border-2 border-black px-4 py-1 text-[10px] font-black uppercase tracking-widest"><ShieldCheck className="w-3 h-3" /> Grupo creado hace eones por el Espíritu Santo</div>
                                <div className="flex items-center gap-2 bg-gray-200 border-2 border-black px-4 py-1 text-[10px] font-black uppercase tracking-widest"><MessageSquare className="w-3 h-3" /> Has ingresado al grupo de {bookConfig?.name}</div>
                            </div>

                            <AnimatePresence initial={false}>
                                {visibleMessages.map(msg => (
                                    <MessageBubble
                                        key={msg.id} message={msg}
                                        isLiked={likedMessages.has(`${currentBookId}_${msg.id}`)}
                                        onToggleLike={handleToggleLike}
                                    />
                                ))}
                            </AnimatePresence>

                            {nextMessage && isAdvancing && nextMessage.speaker !== 'Narrador' && !nextMessage.isSectionTitle && (
                                <TypingIndicator speaker={nextMessage.speaker} isGod={nextMessage.speaker === 'Dios'} />
                            )}
                        </>
                    ) : (
                        <div className="py-20 flex flex-col items-center opacity-40"><RefreshCw className="w-10 h-10 mb-4 animate-spin" /><p className="font-black uppercase text-xs">SYNCHRONIZING REVELATION...</p></div>
                    )}
                </section>

                <InputBar
                    nextMessage={nextMessage} isAdvancing={isAdvancing} isNextUser={isNextUser || false}
                    isComplete={!nextMessage && (currentIndex >= 0)} error={error}
                    onManualNext={handleManualNext} onNextChapter={handleNextChapter} onGoHome={() => setView('home')}
                />

                <GroupInfoDrawer isOpen={showInfo} book={bookConfig} onClose={() => setShowInfo(false)} />
            </main>
        </div>
    );
}
