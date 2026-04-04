'use client';

import { useMemo, useState } from 'react';
import type { DbEvent } from '@nightpulse/shared';
import { AnimatedText } from '@/components/ui/animated-text';
import { PageTransition } from '@/components/layout/page-transition';
import { ParallaxSection } from '@/components/effects/parallax-section';
import { EventFilters, type EventFilterState } from '@/components/events/event-filters';
import { EventList } from '@/components/events/event-list';
import { useEvents } from '@/hooks/use-events';
import { useRealtimeEvents } from '@/hooks/use-realtime-events';
import { DEFAULT_RADIUS_KM } from '@nightpulse/shared';

function matchesSearch(event: DbEvent, query: string): boolean {
  const q = query.toLowerCase();
  return (
    event.title.toLowerCase().includes(q) ||
    event.venueName.toLowerCase().includes(q) ||
    event.description.toLowerCase().includes(q) ||
    event.category.toLowerCase().includes(q)
  );
}

export default function EventsPage() {
  const [filters, setFilters] = useState<EventFilterState>({
    category: null,
    radiusKm: DEFAULT_RADIUS_KM,
    dateRange: 'all',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fromDate = useMemo(() => {
    const now = new Date();
    switch (filters.dateRange) {
      case 'today':
        return now.toISOString();
      case 'week': {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - weekAgo.getDay());
        return weekAgo.toISOString();
      }
      case 'month': {
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      }
      default:
        return undefined;
    }
  }, [filters.dateRange]);

  const { events, loading } = useEvents({
    radiusKm: filters.radiusKm,
    category: filters.category,
    fromDate,
  });

  const { newEventIds } = useRealtimeEvents();

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    return events.filter((event) => matchesSearch(event, searchQuery.trim()));
  }, [events, searchQuery]);

  return (
    <PageTransition>
      {/* Hero */}
      <ParallaxSection speed={0.4} className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <AnimatedText
            text="Events"
            as="h1"
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4"
            gradient
            mode="blur-in"
          />
          <p className="text-white/50 text-lg">
            Entdecke, was in deiner Nähe passiert
          </p>
        </div>
      </ParallaxSection>

      {/* Filters */}
      <div className="sticky top-16 z-30 px-4 py-3 bg-[var(--dark-bg)]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <EventFilters
            filters={filters}
            onFilterChange={setFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </div>

      {/* Event Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <EventList events={filteredEvents} loading={loading} newEventIds={newEventIds} />
      </section>
    </PageTransition>
  );
}
