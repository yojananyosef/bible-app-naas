import React, { useState } from 'react';
import { UIStateProvider } from './context/UIStateContext';
import { HomeView } from './views/HomeView';
import { ChatView } from './views/ChatView';

export default function App() {
    const [view, setView] = useState<'home' | 'chat'>('home');
    return (
        <UIStateProvider>
            {view === 'home' ? (
                <HomeView onOpenChat={() => setView('chat')} />
            ) : (
                <ChatView onBack={() => setView('home')} />
            )}
        </UIStateProvider>
    );
}
