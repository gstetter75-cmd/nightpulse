'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { EventDetail } from '@/components/events/event-detail';
import { PageTransition } from '@/components/layout/page-transition';
import type { DbEvent } from '@nightpulse/shared';

interface EventDetailClientProps {
  readonly event: DbEvent | null;
}

export function EventDetailClient({ event }: EventDetailClientProps) {
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-white/60 mb-4">Event nicht gefunden</h1>
        <p className="text-white/40 mb-8">Das gesuchte Event existiert nicht mehr.</p>
        <Link
          href="/events"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold"
        >
          Zurück zu Events
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <motion.div
        className="fixed top-20 left-4 z-30"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zurück
        </Link>
      </motion.div>

      <EventDetail event={event} />
    </PageTransition>
  );
}
