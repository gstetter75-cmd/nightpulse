import type { Metadata } from 'next';
import { DEMO_EVENTS } from '@/lib/demo-events';
import { EventDetailClient } from './event-detail-client';

export function generateStaticParams() {
  return DEMO_EVENTS.map((event) => ({
    id: event.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = DEMO_EVENTS.find((e) => e.id === id);

  if (!event) {
    return { title: 'Event nicht gefunden | NightPulse' };
  }

  return {
    title: `${event.title} | NightPulse`,
    description: event.description || `${event.title} @ ${event.venueName}`,
    openGraph: {
      title: event.title,
      description: event.description || `${event.title} @ ${event.venueName}`,
      images: event.imageUrl ? [event.imageUrl] : [],
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = DEMO_EVENTS.find((e) => e.id === id) ?? null;

  return <EventDetailClient event={event} />;
}
