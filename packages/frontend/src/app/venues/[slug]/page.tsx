import type { Metadata } from 'next';
import { VENUES, getVenueBySlug, getEventsForVenue } from '@/lib/venues';
import { DEMO_EVENTS } from '@/lib/demo-events';
import { VenueDetailClient } from './venue-detail-client';

export function generateStaticParams() {
  return VENUES.map((venue) => ({
    slug: venue.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);

  if (!venue) {
    return { title: 'Venue nicht gefunden | NightPulse' };
  }

  return {
    title: `${venue.name} | NightPulse`,
    description: venue.description,
    openGraph: {
      title: `${venue.name} | NightPulse`,
      description: venue.description,
      images: [venue.imageUrl],
    },
  };
}

export default async function VenueDetailPage({
  params,
}: {
  readonly params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug) ?? null;
  const events = venue ? getEventsForVenue(venue.name, DEMO_EVENTS) : [];

  return <VenueDetailClient venue={venue} events={events} />;
}
