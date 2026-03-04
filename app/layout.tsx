import type { Metadata } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
    title: 'Sola Scriptura x NAAS',
    description: 'Bible App connected to NAAS',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700;900&display=swap" rel="stylesheet" />
            </head>
            <body>
                <div id="root">{children}</div>
            </body>
        </html>
    );
}
