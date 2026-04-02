import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { GradientMesh } from '@/components/effects/gradient-mesh';
import { ToastProvider } from '@/components/ui/toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'NightPulse - Entdecke die Nacht',
  description:
    'Finde die besten Events und Clubs in deiner Naehe. Echtzeit Event-Discovery mit interaktiver Karte.',
  keywords: ['Events', 'Nightlife', 'Berlin', 'Clubs', 'Techno', 'Parties'],
  openGraph: {
    title: 'NightPulse - Entdecke die Nacht',
    description: 'Finde Events. Spuere den Vibe. Live.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="bg-[#0a0a0f] text-white antialiased font-[family-name:var(--font-inter)]">
        <ToastProvider>
          {/* Global animated background */}
          <GradientMesh className="fixed inset-0 z-0" opacity={0.15} />

          {/* Navigation */}
          <Navbar />

          {/* Main content */}
          <main className="relative z-10">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
