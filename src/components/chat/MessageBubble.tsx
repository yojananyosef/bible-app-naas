import React, { useRef } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '../../core/domain/Message';
import { Avatar, Surface } from '../ui/Surface';

interface MessageBubbleProps {
    message: Message;
    isLiked: boolean;
    onToggleLike: (id: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLiked, onToggleLike }) => {
    const lastTap = useRef<number>(0);

    const isGod = message.speaker === 'Dios';
    const isNarrator = message.speaker === 'Narrador';
    const isSerpent = message.speaker === 'Serpiente';
    const actorColor = "bg-[#F5F5F5]";

    const handleInteraction = (e?: any) => {
        const now = Date.now();
        const timeSince = now - lastTap.current;

        if (timeSince < 300 && timeSince > 0) {
            onToggleLike(message.id);
            if (e.cancelable) e.preventDefault();
        }
        lastTap.current = now;
    };

    if (message.isSectionTitle) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center my-12">
                <Surface dataAida="attention" dataCta="primary" className="inline-block px-6 py-2 text-xs font-black uppercase tracking-widest">
                    {message.text}
                </Surface>
            </motion.div>
        );
    }

    if (isNarrator) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
                onClick={handleInteraction}
            >
                <div className="group cursor-pointer max-w-2xl bg-[#EAEAEA] border-2 border-dashed border-[#0A0A0A] p-6 text-center relative font-medium text-gray-800 transition-colors hover:bg-white active:bg-white shadow-[4px_4px_0_rgba(0,0,0,0.05)]">
                    <span className="text-[10px] font-black text-gray-400 block mb-2 uppercase tracking-widest">v.{message.verse} NARRADOR</span>
                    {message.text}
                    <LikeBadge isLiked={isLiked} position="bottom-right" />
                </div>
            </motion.div>
        );
    }

    // ── Serpiente: inversa de Dios — solid, matte, NAAS style ──
    if (isSerpent) {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-end w-full"
            >
                <div className="flex items-end gap-2 sm:gap-3 max-w-[92%] sm:max-w-[85%] flex-row-reverse">
                    <Avatar
                        letter="🐍"
                        color="bg-[#1A0A0A]"
                        size="md"
                        borderColor="border-[#4A0000]"
                    />
                    <div
                        onClick={handleInteraction}
                        className="p-4 md:p-6 relative border-2 border-[#4A0000] rounded-l-2xl rounded-tr-2xl overflow-visible bg-[#1A0A0A] shadow-[4px_4px_0_#4A0000] cursor-pointer"
                    >
                        <div className="flex justify-between gap-8 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-tight text-red-400">
                                {message.speaker}
                            </span>
                            <span className="text-[10px] font-bold text-red-900">v.{message.verse}</span>
                        </div>
                        <p className="text-base md:text-xl lg:text-3xl font-medium text-red-100 italic">
                            {message.text}
                        </p>
                        <LikeBadge isLiked={isLiked} position="bottom-left" />
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: isGod ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex flex-col ${isGod ? 'items-start' : 'items-end'} w-full`}
        >
            <div className={`flex items-end gap-2 sm:gap-3 max-w-[92%] sm:max-w-[85%] ${isGod ? 'flex-row' : 'flex-row-reverse'}`}>
                <Avatar
                    letter={message.speaker?.[0] || '?'}
                    color={isGod ? "bg-[#FFD600]" : actorColor}
                    size="md"
                />
                <Surface
                    onClick={handleInteraction}
                    className={`p-4 md:p-6 relative border-2 border-black shadow-[4px_4px_0_#0A0A0A] overflow-visible ${isGod
                        ? 'bg-white rounded-r-2xl rounded-tl-2xl'
                        : `${actorColor} rounded-l-2xl rounded-tr-2xl`
                        }`}
                >
                    <div className="flex justify-between gap-8 mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-tight ${isGod ? 'text-black' : 'text-gray-500'}`}>
                            {message.speaker}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">v.{message.verse}</span>
                    </div>
                    <p className={`text-base md:text-xl lg:text-3xl ${isGod ? 'font-black text-black leading-tight' : 'font-medium text-gray-700'}`}>
                        {message.text}
                    </p>
                    <LikeBadge isLiked={isLiked} position={isGod ? "bottom-right" : "bottom-left"} />
                </Surface>
            </div>
        </motion.div>
    );
};

const LikeBadge: React.FC<{ isLiked: boolean, position: 'bottom-right' | 'bottom-left' }> = ({ isLiked, position }) => (
    <AnimatePresence>
        {isLiked && (
            <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 45 }}
                className={`absolute -bottom-3 ${position === 'bottom-right' ? '-right-3' : '-left-3'} bg-red-500 text-white rounded-full p-2 border-2 border-black shadow-[2px_2px_0_#0A0A0A] z-10`}
            >
                <Heart className="w-4 h-4 fill-current shadow-lg" />
            </motion.div>
        )}
    </AnimatePresence>
);
