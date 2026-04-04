import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GradientMesh } from '@/components/effects/gradient-mesh';
import { ToastProvider } from '@/components/ui/toast';
import { RegisterServiceWorker } from '@/components/pwa/register-sw';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { CityProvider } from '@/components/city/city-provider';
import { CityGate } from '@/components/city/city-gate';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'NightPulse - Entdecke die Nacht',
  description:
    'Finde die besten Events und Clubs in deiner Nähe. Echtzeit Event-Discovery mit interaktiver Karte.',
  keywords: ['Events', 'Nightlife', 'Berlin', 'Clubs', 'Techno', 'Parties'],
  manifest: '/nightpulse/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NightPulse',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  openGraph: {
    title: 'NightPulse - Entdecke die Nacht',
    description: 'Finde Events. Spüre den Vibe. Live.',
    type: 'website',
  },
  icons: {
    apple: '/nightpulse/icons/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="de" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#a855f7" />
      </head>
      <body className="bg-[var(--dark-bg)] text-[var(--text-primary)] antialiased font-[family-name:var(--font-inter)]">
        <ThemeProvider>
          <RegisterServiceWorker />
          <ToastProvider>
            <CityProvider>
              <CityGate>
                {/* Global animated background */}
                <GradientMesh className="fixed inset-0 z-0" opacity={0.15} />

                {/* Navigation */}
                <Navbar />

                {/* Main content */}
                <main className="relative z-10">{children}</main>

                {/* Footer */}
                <Footer />
              </CityGate>
            </CityProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
