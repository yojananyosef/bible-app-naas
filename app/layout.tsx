import type { Metadata, Viewport } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
    title: 'BIBLIA CHAT 📖',
    description: 'Experiencia bíblica inmersiva Neo-AIDA',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Biblia Chat',
    },
    formatDetection: {
        telephone: false,
    },
};

export const viewport: Viewport = {
    themeColor: '#FFD600',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className="h-full overflow-hidden selection:bg-yellow-200">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700;900&display=swap" rel="stylesheet" />
            </head>
            <body className="h-full overflow-hidden bg-white text-[#0A0A0A] antialiased touch-none">
                <div id="root" className="h-full overflow-hidden">{children}</div>
            </body>
        </html>
    );
}
