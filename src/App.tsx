import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, MessageSquare, Users, Book, ShieldCheck, RefreshCw, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Constants & Types
import { BIBLE_BOOKS } from './constants/books';
import { BookInfo, Message, FavoriteMessage } from './types/bible';

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
import { FavoritesDrawer } from './components/home/FavoritesDrawer';

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
    const [favorites, setFavorites] = useState<FavoriteMessage[]>(() => {
        const saved = localStorage.getItem('bible_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    const isMessageLiked = (msgId: string) =>
        favorites.some(f => f.bookId === currentBookId && f.id === msgId);

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
    const [showHomeSearch, setShowHomeSearch] = useState(false);
    const [homeSearchQuery, setHomeSearchQuery] = useState('');
    const [showHomeOptions, setShowHomeOptions] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // --- Progression Logic (10 levels) ---
    const getSpiritualLevel = (count: number) => {
        const levels = [
            { min: 0, title: 'Iniciado', rank: 'Nivel 1', color: '#FFFFFF', icon: 'I' },
            { min: 3, title: 'Oyente Fiel', rank: 'Nivel 2', color: '#E8E8E8', icon: 'O' },
            { min: 7, title: 'Buscador', rank: 'Nivel 3', color: '#D1D1D1', icon: 'B' },
            { min: 15, title: 'Aprendiz', rank: 'Nivel 4', color: '#A3A3A3', icon: 'A' },
            { min: 30, title: 'Seguidor', rank: 'Nivel 5', color: '#FFD600', icon: 'S' },
            { min: 60, title: 'Discípulo', rank: 'Nivel 6', color: '#FCD34D', icon: 'D' },
            { min: 100, title: 'Siervo', rank: 'Nivel 7', color: '#FBBF24', icon: 'V' },
            { min: 180, title: 'Embajador', rank: 'Nivel 8', color: '#F59E0B', icon: 'E' },
            { min: 300, title: 'Testigo', rank: 'Nivel 9', color: '#D97706', icon: 'T' },
            { min: 500, title: 'Ungido', rank: 'Nivel 10', color: '#000000', icon: 'U', textColor: 'text-white' }
        ];

        const current = [...levels].reverse().find(l => count >= l.min) || levels[0];
        const nextIdx = levels.indexOf(current) + 1;
        const next = levels[nextIdx];

        const progress = next
            ? ((count - current.min) / (next.min - current.min)) * 100
            : 100;

        return { ...current, nextTitle: next?.title, progress };
    };

    const userLevel = getSpiritualLevel(favorites.length);

    const filteredBooks = BIBLE_BOOKS.filter(b =>
        b.name.toLowerCase().includes(homeSearchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(homeSearchQuery.toLowerCase())
    );

    // Persistence Effect
    useEffect(() => {
        localStorage.setItem('lastBook', currentBookId);
        localStorage.setItem(`lastChapter_${currentBookId}`, currentChapter.toString());
        localStorage.setItem('bible_favorites', JSON.stringify(favorites));
    }, [currentBookId, currentChapter, favorites]);

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

    const handleToggleLike = (id: string, overrideBookId?: string) => {
        const targetBookId = overrideBookId || currentBookId;

        // If it's a chat toggle, we have the message in 'data'
        // If it's a drawer toggle, we find it in favorites
        const existing = favorites.find(f => f.bookId === targetBookId && f.id === id);

        if (existing) {
            setFavorites(prev => prev.filter(f => !(f.bookId === targetBookId && f.id === id)));
        } else {
            const msg = data?.messages.find(m => m.id === id);
            if (!msg || !bookConfig) return;

            const fav: FavoriteMessage = {
                ...msg,
                bookId: currentBookId,
                bookName: bookConfig.name,
                chapter: currentChapter
            };
            setFavorites(prev => [...prev, fav]);
        }
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
            <div className="min-h-screen sm:bg-[#FAFAFA] bg-white flex items-center justify-center sm:p-4 md:p-8">
                <main data-viewport-scope="home" className="w-full bg-white flex flex-col h-[100dvh] overflow-hidden sm:max-w-6xl sm:border-4 sm:border-[#0A0A0A] sm:h-[90vh] sm:shadow-[8px_8px_0_#0A0A0A] sm:mx-auto font-sans">
                    <header data-aida="attention" className="border-b-4 border-black bg-[#FFD600] p-5 sm:p-6 flex items-center justify-between shrink-0 relative z-50">
                        <div className="flex flex-col text-left">
                            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none italic">BIBLIA CHAT</h1>
                            <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-100">Neo-AIDA Accessible System</span>
                        </div>
                        <div className="flex gap-4">
                            <Surface
                                onClick={() => { setShowHomeSearch(!showHomeSearch); if (showHomeSearch) setHomeSearchQuery(''); }}
                                className={`p-2 rounded-full border-2 transition-colors ${showHomeSearch ? 'bg-black text-[#FFD600]' : ''}`}
                            >
                                <Search className="w-5 h-5" />
                            </Surface>
                            <div className="relative">
                                <Surface
                                    onClick={() => setShowHomeOptions(!showHomeOptions)}
                                    className={`p-2 rounded-full border-2 transition-colors ${showHomeOptions ? 'bg-black text-[#FFD600]' : ''}`}
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </Surface>

                                <AnimatePresence>
                                    {showHomeOptions && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                            className="absolute top-full right-0 mt-2 w-80 bg-white border-4 border-black shadow-[6px_6px_0_#0A0A0A] z-[100]"
                                        >
                                            <div className="bg-black text-white p-3 text-[10px] font-black uppercase tracking-widest">Centro de Control</div>
                                            <div className="p-1">
                                                <button
                                                    onClick={() => { setShowFavorites(true); setShowHomeOptions(false); }}
                                                    className="w-full text-left p-3 hover:bg-[#FFD600] font-black text-[10px] uppercase tracking-wider flex items-center gap-3 transition-colors border-2 border-transparent hover:border-black"
                                                >
                                                    <Heart className="w-4 h-4" /> Mensajes Destacados
                                                </button>
                                                <div className="border-t-2 border-black/10 my-1"></div>
                                                <div className="p-3">
                                                    <div className="text-[9px] font-black uppercase tracking-[0.2em] mb-3 text-gray-500 border-b border-black/5 pb-1">Identidad Espiritual Neo-AIDA</div>

                                                    <div className="bg-white border-4 border-black p-5 relative overflow-hidden">
                                                        {/* Status Header - Cleaned up and maximized for titles */}
                                                        <div className="flex gap-4 items-center mb-6">
                                                            <div 
                                                                className="w-12 h-16 shrink-0 border-4 border-black flex items-center justify-center text-2xl font-black shadow-[4px_4px_0_#000]"
                                                                style={{ backgroundColor: userLevel.color, color: userLevel.textColor === 'text-white' ? 'white' : 'black' }}
                                                            >
                                                                {userLevel.icon}
                                                            </div>
                                                            <div className="flex flex-col min-w-0 flex-1">
                                                                <div className="text-[18px] font-black uppercase italic tracking-tighter leading-tight mb-0.5 break-words">{userLevel.title}</div>
                                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{userLevel.rank}</div>
                                                            </div>
                                                        </div>

                                                        {/* Progress Meter */}
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-end">
                                                                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">Estado de Sincronización</span>
                                                                <span className="bg-black text-[#FFD600] px-2 py-0.5 text-[10px] font-black italic shadow-[2px_2px_0_rgba(0,0,0,0.1)]">{Math.floor(userLevel.progress)}%</span>
                                                            </div>
                                                            <div className="h-6 border-4 border-black bg-gray-100 p-1 shadow-inner">
                                                                <motion.div 
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${userLevel.progress}%` }}
                                                                    className="h-full bg-black"
                                                                />
                                                            </div>
                                                            <div className="flex justify-between items-start pt-1">
                                                                <div className="flex flex-col">
                                                                    <div className="text-[12px] font-black uppercase italic leading-none">{favorites.length}</div>
                                                                    <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                                        {favorites.length === 1 ? 'Versículo' : 'Versículos'}
                                                                    </div>
                                                                </div>
                                                                {userLevel.nextTitle && (
                                                                    <div className="text-right">
                                                                        <div className="text-[8px] text-gray-400 font-black uppercase leading-none mb-1">Siguiente Consagración</div>
                                                                        <div className="text-[11px] font-black uppercase italic text-black tracking-tight">{userLevel.nextTitle}</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Decorative Elements */}
                                                        <div className="absolute top-0 right-0 opacity-5 pointer-events-none p-1">
                                                            <ShieldCheck className="w-20 h-20 rotate-12" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Search Bar Overlay */}
                        <AnimatePresence>
                            {showHomeSearch && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute inset-0 bg-[#FFD600] flex items-center p-3 sm:p-6 gap-2 sm:gap-4"
                                >
                                    <div className="flex-1 relative">
                                        <input
                                            autoFocus
                                            type="text"
                                            value={homeSearchQuery}
                                            onChange={(e) => setHomeSearchQuery(e.target.value)}
                                            placeholder="BUSCAR LIBRO..."
                                            className="w-full bg-white border-2 sm:border-4 border-black p-3 sm:p-4 font-black uppercase tracking-tighter text-sm sm:text-xl placeholder:text-gray-300 focus:outline-none shadow-[2px_2px_0_#0A0A0A] sm:shadow-[4px_4px_0_#0A0A0A]"
                                        />
                                    </div>
                                    <button
                                        onClick={() => { setShowHomeSearch(false); setHomeSearchQuery(''); }}
                                        className="bg-black text-white p-3 sm:p-4 border-2 sm:border-4 border-black font-black uppercase text-[10px] sm:text-xs tracking-widest hover:bg-white hover:text-black transition-colors shrink-0"
                                    >
                                        CERRAR
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </header>

                    <section data-aida="interest" className="flex-1 overflow-y-auto bg-white">
                        <div className="italic p-4 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 border-b-2 border-gray-100">
                            Canal de Revelación Activo
                        </div>
                        <div className="">
                            {filteredBooks.map((book) => (
                                <GroupListItem
                                    key={book.id}
                                    book={book}
                                    lastChapter={Number(localStorage.getItem(`lastChapter_${book.id}`)) || book.availableChapters[0]}
                                    onSelect={handleSelectBook}
                                />
                            ))}
                            {filteredBooks.length === 0 && (
                                <div className="py-20 text-center opacity-40">
                                    <div className="text-4xl mb-4">📜</div>
                                    <p className="font-black uppercase text-xs tracking-[0.2em]">Libro no encontrado en el Canon</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <nav data-aida="action" className="border-t-4 border-black bg-[#FAFAFA] p-4 flex justify-around items-center shrink-0">
                        <div className="flex flex-col items-center gap-1 cursor-pointer"><MessageSquare className="w-6 h-6" /><span className="text-[8px] font-black uppercase">CHATS</span></div>
                        <div className="flex flex-col items-center gap-1 opacity-20"><Users className="w-6 h-6" /><span className="text-[8px] font-black uppercase">COMMUNITY</span></div>
                        <div className="flex flex-col items-center gap-1 opacity-20"><Book className="w-6 h-6" /><span className="text-[8px] font-black uppercase">SCRIPTORIUM</span></div>
                    </nav>

                    <FavoritesDrawer
                        isOpen={showFavorites}
                        onClose={() => setShowFavorites(false)}
                        favorites={favorites}
                        onToggleLike={handleToggleLike}
                    />
                </main>
            </div>
        );
    }

    const lastSectionTitle = visibleMessages.slice().reverse().find(m => m.isSectionTitle);
    const subtitle = lastSectionTitle ? lastSectionTitle.text : (data?.title || '');

    return (
        <div className="min-h-screen sm:bg-[#FAFAFA] bg-white flex items-center justify-center sm:p-4 md:p-8 font-sans">
            <main data-viewport-scope="chat" className="w-full bg-white flex flex-col h-[100dvh] relative overflow-hidden sm:max-w-6xl sm:border-4 sm:border-[#0A0A0A] sm:shadow-[8px_8px_0_#0A0A0A] sm:h-[90vh] sm:mx-auto">
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
                                        isLiked={isMessageLiked(msg.id)}
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
