import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, BookOpen } from 'lucide-react';
import { FavoriteMessage } from '../../types/bible';

interface FavoritesDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    favorites: FavoriteMessage[];
    onToggleLike: (id: string, bookId: string) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({ isOpen, onClose, favorites, onToggleLike }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 40 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 40 }}
                        className="w-full max-w-2xl bg-white border-4 border-black shadow-[10px_10px_0_#0A0A0A] overflow-hidden h-[85vh] flex flex-col"
                    >
                        <div className="bg-[#FFD600] border-b-4 border-black p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Heart className="w-6 h-6 fill-black" />
                                <h3 className="text-xl font-black uppercase tracking-tighter italic">Tesoros en el Corazón</h3>
                            </div>
                            <button onClick={onClose} className="p-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0_#0A0A0A] active:translate-y-0.5 active:shadow-none font-black text-xs">
                                <X className="w-5 h-5" strokeWidth={3} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[#FAFAFA]">
                            {favorites.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-10">
                                    <div className="text-6xl mb-6">📜</div>
                                    <p className="font-black uppercase text-sm tracking-[0.2em]">Aún no has guardado ninguna palabra</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {favorites.map(fav => (
                                        <div key={`${fav.bookId}_${fav.id}`} className="bg-white border-2 border-black p-5 shadow-[4px_4px_0_#0A0A0A] relative group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-3 h-3 text-[#FFD600]" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{fav.bookName} • CAP {fav.chapter}</span>
                                                    </div>
                                                    <div className="text-[9px] font-bold text-gray-400">Speaker: {fav.speaker} • Versículo {fav.verse}</div>
                                                </div>
                                                <button
                                                    onClick={() => onToggleLike(fav.id, fav.bookId)}
                                                    className="p-1.5 bg-red-50 text-red-600 border-2 border-transparent hover:border-red-600 transition-all rounded-sm"
                                                >
                                                    <Heart className="w-4 h-4 fill-current" />
                                                </button>
                                            </div>
                                            <p className="text-sm md:text-base font-medium italic text-gray-800 leading-relaxed border-l-4 border-[#FFD600] pl-4">
                                                "{fav.text}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
