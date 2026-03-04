import React, { useRef, useState } from 'react';
import { RefreshCw, ShieldCheck, MessageSquare } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { useBibleChat } from '../hooks/useBibleChat';
import { useScrollOnUpdate } from '../hooks/useScrollOnUpdate';
import { usePersistentState } from '../hooks/usePersistentState';
import { useUIState } from '../context/UIStateContext';
import { useSettings, useAudio } from '../hooks/useSettings';
import { BibleDataService } from '../core/services/BibleDataService';

import { BIBLE_BOOKS } from '../constants/books';
import { ChatHeader } from '../components/chat/ChatHeader';
import { MessageBubble } from '../components/chat/MessageBubble';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { InputBar } from '../components/chat/InputBar';
import { GroupInfoDrawer } from '../components/chat/GroupInfoDrawer';
import { Message } from '../core/domain/Message';

interface ChatViewProps {
    onBack: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ onBack }) => {
    const [isMounted, setIsMounted] = useState(false);
    React.useEffect(() => setIsMounted(true), []);

    const { isMuted, setIsMuted, readingSpeed, setReadingSpeed } = useSettings();
    const { playPop } = useAudio(isMuted);

    const { currentBookId, currentChapter, setCurrentChapter, favorites, setFavorites } = usePersistentState();
    const { showInfo, setShowInfo } = useUIState();

    const [showSelector, setShowSelector] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const bookConfig = BIBLE_BOOKS.find(b => b.id === currentBookId);

    const onMessageNext = (msg: Message) => {
        if (!msg.isTitle() && msg.speaker !== 'Narrador') playPop();
    };

    const {
        data, currentIndex, isAdvancing, error, visibleMessages,
        nextMessage, canAdvanceManually, handleManualNext, restartChapter
    } = useBibleChat({
        book: currentBookId,
        chapter: currentChapter,
        speed: readingSpeed,
        isActive: true, // We are in the chat view
        loadChapterService: BibleDataService.loadChapter,
        onMessageUpdate: onMessageNext
    });

    const scrollRef = useRef<HTMLDivElement>(null);
    useScrollOnUpdate(scrollRef, [currentIndex, isAdvancing]);

    const isMessageLiked = (msgId: string) =>
        favorites.some(f => f.bookId === currentBookId && f.id === msgId);

    const handleToggleLike = (id: string, overrideBookId?: string) => {
        const targetBookId = overrideBookId || currentBookId;
        const existing = favorites.find(f => f.bookId === targetBookId && f.id === id);

        if (existing) {
            setFavorites(prev => prev.filter(f => !(f.bookId === targetBookId && f.id === id)));
        } else {
            const rawMsg = data?.messages.find(m => m.id === id);
            if (!rawMsg || !bookConfig) return;
            const msg = rawMsg as any; // Type workaround for favorite object creation

            setFavorites(prev => [...prev, {
                ...msg,
                bookId: targetBookId,
                bookName: bookConfig.name,
                chapter: currentChapter
            }]);
        }
    };

    const handleNextChapter = () => {
        const nextIdx = bookConfig ? bookConfig.availableChapters.indexOf(currentChapter) + 1 : -1;
        if (bookConfig && nextIdx >= 0 && nextIdx < bookConfig.availableChapters.length) {
            setCurrentChapter(bookConfig.availableChapters[nextIdx]);
        } else {
            onBack();
        }
    };

    const lastSectionTitle = visibleMessages.slice().reverse().find(m => m.isTitle());
    const subtitle = lastSectionTitle ? lastSectionTitle.text : (data?.title || '');

    return (
        <div className="h-full w-full bg-white overflow-hidden font-sans">
            <main data-viewport-scope="chat" className="w-full flex flex-col h-full relative overflow-hidden">
                <ChatHeader
                    book={bookConfig} chapter={isMounted ? currentChapter : 1} subtitle={subtitle}
                    onBack={onBack}
                    onToggleSelector={() => setShowSelector(!showSelector)} isSelectorOpen={showSelector}
                    onSelectChapter={(c) => { setCurrentChapter(c); setShowSelector(false); }}
                    isMuted={isMuted} currentSpeed={readingSpeed}
                    onToggleMute={() => setIsMuted(!isMuted)} onSetSpeed={setReadingSpeed}
                    onShowInfo={() => setShowInfo(true)} onRestart={restartChapter}
                    isOptionsOpen={showOptions} onToggleOptions={() => setShowOptions(!showOptions)}
                />

                <section ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-white space-y-10 sm:space-y-12 scroll-smooth pb-32 no-scrollbar">
                    {error ? (
                        <div className="py-20 flex flex-col items-center opacity-40 italic">
                            <RefreshCw className="w-10 h-10 mb-4 animate-spin" />
                            <p className="font-black uppercase text-xs">{error}</p>
                        </div>
                    ) : (data && visibleMessages.length > 0) ? (
                        <>
                            <div className="flex flex-col items-center gap-2 mb-8 opacity-50 px-4">
                                <div className="flex items-center gap-2 bg-gray-100 border-2 border-black/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full"><ShieldCheck className="w-3 h-3" /> Grupo creado hace eones por el Espíritu Santo</div>
                                <div className="flex items-center gap-2 bg-gray-100 border-2 border-black/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full"><MessageSquare className="w-3 h-3" /> Has ingresado al grupo de {bookConfig?.name}</div>
                            </div>

                            <AnimatePresence initial={false}>
                                {visibleMessages.map(msg => (
                                    <MessageBubble
                                        key={msg.id} message={msg as any}
                                        isLiked={isMessageLiked(msg.id)}
                                        onToggleLike={handleToggleLike}
                                    />
                                ))}
                            </AnimatePresence>

                            {nextMessage && isAdvancing && nextMessage.isHumanSpeaker() && (
                                <TypingIndicator speaker={nextMessage.speaker} isGod={nextMessage.speaker === 'Dios'} />
                            )}
                        </>
                    ) : (
                        <div className="py-20 flex flex-col items-center opacity-40">
                            <RefreshCw className="w-10 h-10 mb-4 animate-spin" />
                            <p className="font-black uppercase text-xs">SYNCHRONIZING REVELATION...</p>
                        </div>
                    )}
                </section>

                <div className="absolute bottom-0 left-0 right-0 sm:relative">
                    <InputBar
                        nextMessage={nextMessage as any} isAdvancing={isAdvancing} isNextUser={canAdvanceManually}
                        isComplete={!nextMessage && (currentIndex >= 0)} error={error}
                        onManualNext={handleManualNext} onNextChapter={handleNextChapter} onGoHome={onBack}
                    />
                </div>

                <GroupInfoDrawer isOpen={showInfo} book={bookConfig} onClose={() => setShowInfo(false)} />
            </main>
        </div>
    );
};
