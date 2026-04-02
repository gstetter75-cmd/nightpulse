import { DEMO_EVENTS } from '@/lib/demo-events';
import { EventDetailClient } from './event-detail-client';

export function generateStaticParams() {
  return DEMO_EVENTS.map((event) => ({
    id: event.id,
  }));
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
