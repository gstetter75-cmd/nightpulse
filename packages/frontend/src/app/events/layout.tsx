import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events | NightPulse',
  description:
    'Entdecke Clubs, Partys und Veranstaltungen in deiner Nähe. Filtere nach Kategorie, Datum und Entfernung.',
};

export default function EventsLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}
