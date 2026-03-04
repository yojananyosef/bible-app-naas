import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Volume2, VolumeX, RotateCcw, Zap, Eye, Settings2, Activity } from 'lucide-react';
import { Surface } from '../ui/Surface';
import { READING_SPEEDS } from '../../constants/books';

interface OptionsMenuProps {
    isOpen: boolean;
    isMuted: boolean;
    currentSpeed: number;
    onToggleMute: () => void;
    onSetSpeed: (speed: number) => void;
    onShowInfo: () => void;
    onRestart: () => void;
}

export const OptionsMenu: React.FC<OptionsMenuProps> = ({
    isOpen, isMuted, currentSpeed, onToggleMute, onSetSpeed, onShowInfo, onRestart
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-[120%] right-0 w-72 bg-white border-2 border-black shadow-[6px_6px_0_#0A0A0A] z-[100] overflow-hidden"
                >
                    {/* Header del Menú */}
                    <div className="bg-black text-white p-3 flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-[#FFD600]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ajustes de Revelación</span>
                    </div>

                    <div className="p-2 flex flex-col gap-1">
                        {/* Opción: Info del Grupo */}
                        <MenuButton onClick={onShowInfo} icon={<Info className="w-4 h-4" />}>
                            Información del Grupo
                        </MenuButton>

                        {/* Opción: Silenciar */}
                        <MenuButton onClick={onToggleMute} icon={isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}>
                            <div className="flex items-center justify-between w-full">
                                <span>{isMuted ? 'Sonido: Desactivado' : 'Sonido: Activado'}</span>
                                <div className={`w-10 h-5 border-2 border-black relative transition-colors ${isMuted ? 'bg-gray-100' : 'bg-[#FFD600]'}`}>
                                    <div className={`absolute top-[1px] bottom-[1px] w-4 bg-black transition-all ${isMuted ? 'left-[1px]' : 'left-[calc(100%-17px)]'}`} />
                                </div>
                            </div>
                        </MenuButton>

                        {/* Selector de Velocidad */}
                        <div className="mt-2 mb-1 border-t-2 border-black pt-3 px-1">
                            <span className="text-[9px] font-black text-gray-400 block mb-3 tracking-widest uppercase flex items-center gap-2">
                                <Zap className="w-3 h-3" /> Motor de Lectura
                            </span>
                            <div className="grid grid-cols-3 gap-2">
                                {READING_SPEEDS.map(s => {
                                    const Icon = s.label === 'Zen' ? Eye : s.label === 'Norm' ? Activity : Zap;
                                    return (
                                        <button
                                            key={s.label}
                                            onClick={() => onSetSpeed(s.multiplier)}
                                            className={`
                                                flex flex-col items-center justify-center p-2 border-2 transition-all font-black text-[9px] uppercase tracking-tighter
                                                ${currentSpeed === s.multiplier
                                                    ? 'bg-[#FFD600] border-black shadow-[2px_2px_0_#0A0A0A] -translate-y-0.5'
                                                    : 'border-transparent hover:border-black bg-gray-50 text-gray-400'
                                                }
                                            `}
                                        >
                                            <Icon className="w-4 h-4 mb-1" />
                                            {s.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Zona de Peligro */}
                        <div className="mt-2 border-t-2 border-black pb-1">
                            <button
                                onClick={onRestart}
                                className="w-full mt-2 p-3 flex items-center gap-3 hover:bg-black hover:text-white text-red-600 font-black text-[10px] uppercase tracking-widest transition-all active:translate-y-0.5"
                            >
                                <RotateCcw className="w-4 h-4" /> REINICIAR CAPÍTULO
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const MenuButton: React.FC<{ onClick: () => void, icon: React.ReactNode, children: React.ReactNode }> = ({ onClick, icon, children }) => (
    <button
        onClick={onClick}
        className="w-full p-3 flex items-center gap-4 hover:bg-gray-100 font-black text-[11px] uppercase tracking-wider transition-colors active:bg-[#FFD600] border-2 border-transparent hover:border-black"
    >
        <span className="shrink-0">{icon}</span>
        <span className="flex-1 text-left">{children}</span>
    </button>
);
