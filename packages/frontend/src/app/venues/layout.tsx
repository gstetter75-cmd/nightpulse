import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Venues | NightPulse',
  description:
    'Entdecke Berlins beste Clubs und Locations. Berghain, Watergate, Tresor und mehr.',
};

export default function VenuesLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}
