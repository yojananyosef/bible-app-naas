import React from 'react';
import { ArrowLeft, ChevronDown, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookInfo } from '../../types/bible';
import { OptionsMenu } from './OptionsMenu';

interface ChatHeaderProps {
    book: BookInfo | undefined;
    chapter: number;
    subtitle: string;
    onBack: () => void;
    onToggleSelector: () => void;
    isSelectorOpen: boolean;
    onSelectChapter: (chap: number) => void;
    isMuted: boolean;
    currentSpeed: number;
    onToggleMute: () => void;
    onSetSpeed: (speed: number) => void;
    onShowInfo: () => void;
    onRestart: () => void;
    isOptionsOpen: boolean;
    onToggleOptions: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = (props) => {
    return (
        <header className="border-b-4 border-[#0A0A0A] bg-white px-4 py-2 safe-top sticky top-0 z-50 flex items-center justify-between shrink-0 h-auto sm:h-24 md:h-24 transition-all overflow-visible">
            <div className="flex items-center gap-3 min-w-0 h-full py-2">
                <button onClick={props.onBack} className="p-2 border-2 border-black hover:bg-gray-100 transition-all shadow-[2px_2px_0_#0A0A0A] active:translate-y-0.5 active:shadow-none shrink-0 bg-white">
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#0A0A0A]" strokeWidth={2.5} />
                </button>
                <div className="min-w-0 text-left flex flex-col justify-center relative">
                    <button onClick={props.onToggleSelector} className="flex items-center gap-2 group max-w-full outline-none">
                        <h1 className="text-xl md:text-2xl font-black leading-none uppercase truncate">{props.book?.name} • Cap {props.chapter}</h1>
                        <ChevronDown className={`w-5 h-5 transition-transform shrink-0 ${props.isSelectorOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
                    </button>
                    <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] block truncate mt-1">{props.subtitle}</span>

                    {/* Selector de Capítulos — positioned below the title */}
                    <AnimatePresence>
                        {props.isSelectorOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -8 }}
                                className="absolute top-full left-0 mt-2 w-[80vw] sm:w-64 bg-white border-2 border-black z-[100] p-4 shadow-[4px_4px_0_#0A0A0A] grid grid-cols-4 gap-2 max-h-64 overflow-y-auto"
                            >
                                {props.book?.availableChapters.map(chap => (
                                    <button
                                        key={chap}
                                        onClick={() => props.onSelectChapter(chap)}
                                        className={`p-2 border-2 border-black font-black text-sm transition-all ${props.chapter === chap ? 'bg-[#FFD600]' : 'hover:bg-gray-100 shadow-[2px_2px_0_#0A0A0A]'}`}
                                    >
                                        {chap}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex items-center gap-2 relative">
                <div className="relative">
                    <button
                        onClick={props.onToggleOptions}
                        className={`p-2 border-2 border-black transition-all outline-none h-fit shadow-[2px_2px_0_#0A0A0A] active:translate-y-0.5 active:shadow-none ${props.isOptionsOpen ? 'bg-[#FFD600]' : 'hover:bg-gray-100'}`}
                    >
                        <MoreVertical className="w-6 h-6" strokeWidth={2.5} />
                    </button>

                    <OptionsMenu
                        isOpen={props.isOptionsOpen}
                        isMuted={props.isMuted}
                        currentSpeed={props.currentSpeed}
                        onToggleMute={props.onToggleMute}
                        onSetSpeed={props.onSetSpeed}
                        onShowInfo={props.onShowInfo}
                        onRestart={props.onRestart}
                    />
                </div>
            </div>
        </header>
    );
};
