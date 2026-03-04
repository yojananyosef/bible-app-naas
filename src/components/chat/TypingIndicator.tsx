import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, Surface } from '../ui/Surface';

interface TypingIndicatorProps {
    speaker: string;
    isGod: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ speaker, isGod }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`flex items-end gap-2 md:gap-4 max-w-[85%] ${isGod ? 'flex-row' : 'flex-row-reverse'} mx-2 md:mx-4 w-full mt-4 transition-all duration-300`}
    >
        <Avatar letter={speaker[0]} color={isGod ? "bg-[#FFD600]" : "bg-white"} size="sm" />
        <Surface className={`p-3 md:p-5 flex flex-col relative ${isGod ? 'rounded-r-xl rounded-tl-xl' : 'bg-[#EAEAEA] rounded-l-xl rounded-tr-xl'}`}>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                {speaker} ESTÁ ESCRIBIENDO...
            </span>
            <div className="flex gap-1.5 h-3 items-center">
                {[0, 0.2, 0.4].map(delay => (
                    <motion.div key={delay} className="w-1.5 h-1.5 bg-[#0A0A0A] rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay }} />
                ))}
            </div>
        </Surface>
    </motion.div>
);
