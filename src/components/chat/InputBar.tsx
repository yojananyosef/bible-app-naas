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
        <div className="border-t-4 border-[#0A0A0A] bg-white p-4 md:p-6 flex justify-center z-50 shrink-0 h-24 md:h-28 transition-all">
            <div className="w-full max-w-4xl flex items-center gap-4 h-full">
                {!props.error && !props.isComplete ? (
                    props.nextMessage?.isSectionTitle ? (
                        <button
                            onClick={props.onManualNext}
                            className="w-full h-full bg-[#FAFAFA] border-2 border-black font-black uppercase text-[10px] md:text-lg shadow-[4px_4px_0_#0A0A0A] flex items-center justify-center p-2 text-center hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none"
                        >
                            <BookOpen className="w-5 h-5 mr-3 hidden md:block" /> {props.nextMessage?.text}
                        </button>
                    ) : props.isNextUser ? (
                        <>
                            <button
                                onClick={props.onManualNext}
                                className="flex-1 h-full bg-[#FAFAFA] border-2 border-black px-6 text-left font-semibold text-gray-800 truncate flex flex-col justify-center hover:bg-gray-50 transition-all"
                            >
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{props.nextMessage?.speaker}</span>
                                <span className="truncate block leading-tight">{props.nextMessage?.text}</span>
                            </button>
                            <button
                                onClick={props.onManualNext}
                                className="bg-[#FFD600] w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 border-black shadow-[3px_3px_0_#0A0A0A] active:translate-y-1 active:shadow-none transition-all outline-none shrink-0 hover:-translate-y-1"
                            >
                                <Send className="w-7 h-7" />
                            </button>
                        </>
                    ) : (
                        <div className="flex-1 h-full flex items-center justify-center font-black text-gray-400 uppercase tracking-[0.3em] italic animate-pulse text-[10px] md:text-sm">
                            {props.nextMessage?.speaker} ESCRIBIENDO...
                        </div>
                    )
                ) : props.error ? (
                    <button
                        onClick={props.onGoHome}
                        className="w-full h-full bg-[#FFD600] border-2 border-black font-black uppercase shadow-[4px_4px_0_#0A0A0A] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all"
                    >
                        Regresar a la Selección
                    </button>
                ) : props.isComplete ? (
                    <button
                        onClick={props.onNextChapter}
                        className="w-full h-full bg-[#FFD600] border-4 border-black font-black text-lg md:text-2xl uppercase shadow-[6px_6px_0_#0A0A0A] flex items-center justify-center hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all"
                    >
                        <BookOpen className="w-6 h-6 mr-3" /> Siguiente Capítulo
                    </button>
                ) : null}
            </div>
        </div>
    );
};
