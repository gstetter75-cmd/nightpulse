'use client';

import { motion } from 'framer-motion';
import type { DbEvent } from '@nightpulse/shared';
import { staggerContainer } from '@/lib/animations';
import { EventCard } from './event-card';

interface EventListProps {
  readonly events: readonly DbEvent[];
  readonly loading?: boolean;
  readonly newEventIds?: ReadonlySet<string>;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
      <div className="h-48 skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 rounded skeleton" />
        <div className="h-4 w-1/2 rounded skeleton" />
        <div className="h-4 w-2/3 rounded skeleton" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="text-6xl mb-4"
        style={{ animation: 'float 3s ease-in-out infinite' }}
      >
        {/* Moon icon via CSS gradient */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-50 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-white/60 mt-4">
        Keine Events gefunden
      </h3>
      <p className="text-sm text-white/40 mt-2 max-w-sm">
        Versuche andere Filter oder erweitere den Suchradius.
      </p>
    </motion.div>
  );
}

export function EventList({ events, loading = false, newEventIds }: EventListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {events.map((event, index) => (
        <EventCard
          key={event.id}
          event={event}
          isNew={newEventIds?.has(event.id)}
          index={index}
        />
      ))}
    </motion.div>
  );
}
