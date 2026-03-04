import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Heart, ShieldCheck, MessageSquare, Users, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useUIState } from '../context/UIStateContext';
import { usePersistentState } from '../hooks/usePersistentState';
import { useSpiritualLevel } from '../hooks/useSpiritualLevel';
import { useBookFilter } from '../hooks/useBookFilter';

import { Surface } from '../components/ui/Surface';
import { GroupListItem } from '../components/home/GroupListItem';
import { FavoritesDrawer } from '../components/home/FavoritesDrawer';

interface HomeViewProps {
    onOpenChat: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenChat }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const {
        showHomeSearch, setShowHomeSearch,
        showHomeOptions, setShowHomeOptions,
        showFavorites, setShowFavorites,
        homeSearchQuery
    } = useUIState();

    const { favorites, changeBook, getInitialChapter, setFavorites } = usePersistentState();
    const { filteredBooks, setQuery } = useBookFilter(homeSearchQuery);
    const userLevel = useSpiritualLevel(favorites.length);

    const handleSelectBook = (id: string) => {
        changeBook(id);
        onOpenChat();
    };

    const handleToggleLike = (id: string, targetBookId?: string) => {
        setFavorites(prev => prev.filter(f => !(f.bookId === targetBookId && f.id === id)));
    };

    return (
        <div className="h-full bg-white flex items-center justify-center overflow-hidden">
            <main data-viewport-scope="home" className="w-full max-w-6xl bg-white flex flex-col h-full sm:h-[90vh] overflow-hidden sm:border-4 sm:border-[#0A0A0A] sm:shadow-[8px_8px_0_#0A0A0A] sm:mx-auto font-sans">
                <header data-aida="attention" className="border-b-4 border-black bg-[#FFD600] px-6 py-4 safe-top flex items-center justify-between shrink-0 relative z-50">
                    <div className="flex flex-col text-left">
                        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none italic">BIBLIA CHAT</h1>
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1 opacity-100">Neo-AIDA Accessible System</span>
                    </div>
                    <div className="flex gap-3">
                        <Surface
                            onClick={() => { setShowHomeSearch(!showHomeSearch); if (showHomeSearch) setQuery(''); }}
                            className={`p-2 rounded-full border-2 transition-colors active:scale-95 ${showHomeSearch ? 'bg-black text-[#FFD600]' : 'bg-white'}`}
                        >
                            <Search className="w-5 h-5" />
                        </Surface>
                        <div className="relative">
                            <Surface
                                onClick={() => setShowHomeOptions(!showHomeOptions)}
                                className={`p-2 rounded-full border-2 transition-colors active:scale-95 ${showHomeOptions ? 'bg-black text-[#FFD600]' : 'bg-white'}`}
                            >
                                <MoreVertical className="w-5 h-5" />
                            </Surface>

                            <AnimatePresence>
                                {showHomeOptions && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                        className="absolute top-full right-0 mt-2 w-[85vw] sm:w-80 bg-white border-4 border-black shadow-[6px_6px_0_#0A0A0A] z-[100]"
                                    >
                                        <div className="bg-black text-white p-3 text-[10px] font-black uppercase tracking-widest">Centro de Control</div>
                                        <div className="p-1">
                                            <button
                                                onClick={() => { setShowFavorites(true); setShowHomeOptions(false); }}
                                                className="w-full text-left p-4 hover:bg-[#FFD600] active:bg-[#FFD600] font-black text-[10px] uppercase tracking-wider flex items-center gap-3 transition-colors border-2 border-transparent hover:border-black"
                                            >
                                                <Heart className="w-4 h-4" /> Mensajes Destacados
                                            </button>
                                            <div className="border-t-2 border-black/10 my-1"></div>
                                            <div className="p-3">
                                                <div className="text-[9px] font-black uppercase tracking-[0.2em] mb-3 text-gray-500 border-b border-black/5 pb-1">Identidad Espiritual Neo-AIDA</div>

                                                <div className="bg-white border-4 border-black p-5 relative overflow-hidden">
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

                    <AnimatePresence>
                        {showHomeSearch && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="absolute inset-0 bg-[#FFD600] safe-top flex items-center px-4 gap-3 z-[60]"
                            >
                                <div className="flex-1 relative">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={homeSearchQuery}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="BUSCAR LIBRO..."
                                        className="w-full bg-white border-4 border-black p-3 font-black uppercase tracking-tighter text-lg placeholder:text-gray-300 focus:outline-none shadow-[4px_4px_0_#0A0A0A]"
                                    />
                                </div>
                                <button
                                    onClick={() => { setShowHomeSearch(false); setQuery(''); }}
                                    className="bg-black text-white px-4 py-3 border-4 border-black font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform"
                                >
                                    CERRAR
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </header>

                <section data-aida="interest" className="flex-1 overflow-y-auto bg-white no-scrollbar">
                    <div className="italic py-3 text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 border-b-2 border-gray-100">
                        Canal de Revelación Activo
                    </div>
                    <div className="pb-24">
                        {filteredBooks.map((book) => (
                            <GroupListItem
                                key={book.id}
                                book={book}
                                lastChapter={isMounted ? getInitialChapter(book.id) : 1}
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

                <nav data-aida="action" className="fixed bottom-0 left-0 right-0 sm:absolute border-t-4 border-black bg-white/95 backdrop-blur-md px-6 py-3 pb-safe flex justify-around items-center shrink-0 z-50">
                    <button className="flex flex-col items-center gap-1.5 transition-transform active:scale-90">
                        <MessageSquare className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">CHATS</span>
                    </button>
                    <button className="flex flex-col items-center gap-1.5 opacity-20 grayscale transition-transform active:scale-90">
                        <Users className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">COMMUNITY</span>
                    </button>
                    <button className="flex flex-col items-center gap-1.5 opacity-20 grayscale transition-transform active:scale-90">
                        <Book className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">SCRIPTORIUM</span>
                    </button>
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
};
