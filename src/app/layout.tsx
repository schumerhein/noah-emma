
import type {Metadata, Viewport} from 'next';
import './globals.css';
import {Navigation} from '@/components/Navigation';
import {Header} from '@/components/Header';
import {Toaster} from '@/components/ui/toaster';
import {ThemeProvider} from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Noah & Emma | Tweedehands Kindermode',
  description: 'De makkelijkste en veiligste manier om kinderkleding te kopen en verkopen voor kids van 0 tot 12 jaar.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Noah & Emma',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="font-body flex flex-col min-h-screen bg-background text-foreground max-w-md mx-auto relative border-x border-border/50 shadow-2xl overflow-x-hidden">
        <ThemeProvider>
          <Header />
          <main className="flex-1 overflow-y-auto pb-safe-bottom pt-safe-top">
            {children}
          </main>
          <Navigation />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
