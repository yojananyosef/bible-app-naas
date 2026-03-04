import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, Users, MessageSquare } from 'lucide-react';
import { BookInfo } from '../../types/bible';
import { Avatar, Surface } from '../ui/Surface';

interface GroupInfoDrawerProps {
    isOpen: boolean;
    book: BookInfo | undefined;
    onClose: () => void;
}

export const GroupInfoDrawer: React.FC<GroupInfoDrawerProps> = ({ isOpen, book, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && book && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 40, rotate: -1 }}
                        animate={{ scale: 1, y: 0, rotate: 0 }}
                        exit={{ scale: 0.9, y: 40, rotate: 1 }}
                        className="w-full max-w-md bg-white border-4 border-black shadow-[10px_10px_0_#0A0A0A] overflow-hidden flex flex-col relative"
                    >
                        {/* Header del Panel */}
                        <div className="bg-[#FFD600] border-b-4 border-black p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Users className="w-6 h-6" />
                                <h3 className="text-xl font-black uppercase tracking-tighter italic">Detalles del Grupo</h3>
                            </div>
                            <button onClick={onClose} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-[2px_2px_0_#0A0A0A] active:translate-y-0.5 active:shadow-none">
                                <X className="w-5 h-5" strokeWidth={3} />
                            </button>
                        </div>

                        <div className="p-8 flex flex-col items-center text-center">
                            <Avatar letter={book.name[0]} size="lg" color="bg-white" />

                            <div className="mt-8 mb-4">
                                <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">{book.name}</h2>
                                <div className="mt-2 inline-block bg-black text-[#FFD600] px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em]">
                                    {book.category}
                                </div>
                            </div>

                            <p className="text-base font-medium text-gray-800 mb-8 leading-tight italic border-l-4 border-[#FFD600] pl-4 py-2 text-left bg-gray-50">
                                "{book.description}"
                            </p>

                            <div className="w-full text-left space-y-6">
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4 border-b-2 border-gray-100 pb-2 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-black" /> Miembros del Grupo
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {book.participants.filter(p => p !== 'Narrador').map(p => (
                                            <div key={p} className="bg-white border-2 border-black px-3 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0_#0A0A0A] hover:-translate-y-0.5 transition-all">
                                                {p}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-black text-white p-4 border-2 border-black">
                                    <span className="text-[9px] font-black text-[#FFD600] uppercase tracking-[0.2em] block mb-2 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" /> Verificación Canónica
                                    </span>
                                    <p className="text-[10px] font-bold opacity-80 uppercase leading-relaxed">
                                        Libro verificado por el sistema central. El contenido se sincroniza directamente desde el canon bíblico original.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                data-cta="primary"
                                className="w-full mt-10 bg-[#FFD600] border-4 border-black py-5 font-black uppercase tracking-widest hover:-translate-y-1 transition-all duration-150 shadow-[5px_5px_0_#0A0A0A] text-xl active:translate-y-0 active:shadow-none"
                            >
                                Reanudar Lectura
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
