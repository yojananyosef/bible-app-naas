import React from 'react';
import { Send, BookOpen } from 'lucide-react';
import { Message } from '../../types/bible';

interface InputBarProps {
    nextMessage: Message | null;
    isAdvancing: boolean;
    isNextUser: boolean;
    isComplete: boolean;
    error: string | null;
    onManualNext: () => void;
    onNextChapter: () => void;
    onGoHome: () => void;
}

export const InputBar: React.FC<InputBarProps> = (props) => {
    return (
        <div className="border-t-4 border-[#0A0A0A] bg-white/95 backdrop-blur-md px-4 py-4 sm:p-6 flex justify-center z-50 shrink-0 h-auto pb-safe transition-all shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <div className="w-full max-w-4xl flex items-center gap-3 h-full min-h-[60px]">
                {!props.error && !props.isComplete ? (
                    !props.nextMessage ? (
                        <div className="flex-1 h-full flex items-center justify-center font-black text-gray-300 uppercase tracking-[0.2em] text-[9px]">
                            Esperando Revelación...
                        </div>
                    ) : props.nextMessage.isSectionTitle ? (
                        <button
                            onClick={props.onManualNext}
                            className="w-full bg-[#FAFAFA] border-2 border-black font-black uppercase text-[11px] md:text-lg shadow-[3px_3px_0_#0A0A0A] flex items-center justify-center p-3 text-center active:scale-95 transition-all"
                        >
                            <BookOpen className="w-5 h-5 mr-3 hidden md:block" /> {props.nextMessage?.text}
                        </button>
                    ) : props.isNextUser ? (
                        <>
                            <button
                                onClick={props.onManualNext}
                                className={`flex-1 min-h-[56px] border-2 px-4 text-left font-semibold truncate flex flex-col justify-center transition-all overflow-hidden ${props.nextMessage?.speaker === 'Serpiente'
                                    ? 'bg-[#1A0A0A] border-[#4A0000] text-red-100 active:bg-[#250c0c]'
                                    : 'bg-[#FAFAFA] border-black text-gray-800 active:bg-gray-50'
                                    }`}
                            >
                                <span className={`text-[9px] font-black uppercase tracking-widest leading-none mb-1 ${props.nextMessage?.speaker === 'Serpiente' ? 'text-red-400' : 'text-gray-400'}`}>{props.nextMessage?.speaker}</span>
                                <span className={`truncate block leading-tight text-sm sm:text-base ${props.nextMessage?.speaker === 'Serpiente' ? 'italic' : ''}`}>{props.nextMessage?.text}</span>
                            </button>
                            <button
                                onClick={props.onManualNext}
                                className="bg-[#FFD600] w-14 h-14 rounded-full flex items-center justify-center border-2 border-black shadow-[3px_3px_0_#0A0A0A] active:scale-90 transition-all outline-none shrink-0"
                            >
                                <Send className="w-6 h-6" />
                            </button>
                        </>
                    ) : (
                        <div className={`flex-1 h-full flex items-center justify-center font-black uppercase tracking-[0.2em] italic animate-pulse text-[9px] md:text-sm ${props.nextMessage?.speaker === 'Serpiente' ? 'text-red-500' : 'text-gray-400'
                            }`}>
                            {props.nextMessage?.speaker} ESCRIBIENDO...
                        </div>
                    )
                ) : props.error ? (
                    <button
                        onClick={props.onGoHome}
                        className="w-full py-4 bg-[#FFD600] border-2 border-black font-black uppercase shadow-[4px_4px_0_#0A0A0A] active:scale-95 transition-all"
                    >
                        Regresar a la Selección
                    </button>
                ) : props.isComplete ? (
                    <button
                        onClick={props.onNextChapter}
                        className="w-full py-4 bg-[#FFD600] border-4 border-black font-black text-base md:text-2xl uppercase shadow-[6px_6px_0_#0A0A0A] flex items-center justify-center active:scale-95 transition-all"
                    >
                        <BookOpen className="w-6 h-6 mr-3" /> Siguiente Capítulo
                    </button>
                ) : null}
            </div>
        </div>
    );
};
