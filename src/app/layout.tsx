
import type {Metadata, Viewport} from 'next';
import {headers} from 'next/headers';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import {ThemeProvider} from '@/components/ThemeProvider';
import {AppFrame} from '@/components/AppFrame';
import {GoogleAnalytics} from '@/components/GoogleAnalytics';
import {CookieMelding} from '@/components/CookieMelding';
import {OG_AFBEELDING, SITE_URL} from '@/components/marketing/links';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Noah & Emma | Kinderkleding & Accessoires Kopen en Verkopen',
  description: 'De makkelijkste en veiligste manier om kinderkleding en accessoires te kopen en verkopen voor kids van 0 tot 12 jaar.',
  // Standaard voor pagina's zonder eigen openGraph (privacy, voorwaarden, cookies).
  openGraph: {
    images: [OG_AFBEELDING],
    siteName: 'Noah & Emma',
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const forceMarketing = headerList.get("x-noah-emma-marketing") === "1";

  return (
    <html lang="nl" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="font-body min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <AppFrame forceMarketing={forceMarketing}>{children}</AppFrame>
          <Toaster />
          <CookieMelding />
          <GoogleAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
