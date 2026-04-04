'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { DbEvent } from '@nightpulse/shared';
import { AnimatedText } from '@/components/ui/animated-text';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { EventList } from '@/components/events/event-list';
import { PageTransition } from '@/components/layout/page-transition';
import { blurIn, fadeInUp } from '@/lib/animations';
import type { VenueInfo } from '@/lib/venues';

const MiniMap = dynamic(
  () => import('@/components/map/mini-map').then((mod) => ({ default: mod.MiniMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-white/5">
        <div className="text-white/40 text-sm animate-pulse">Karte wird geladen...</div>
      </div>
    ),
  },
);

interface VenueDetailClientProps {
  readonly venue: VenueInfo | null;
  readonly events: readonly DbEvent[];
}

export function VenueDetailClient({ venue, events }: VenueDetailClientProps) {
  if (!venue) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-white/60 mb-4">Venue nicht gefunden</h1>
        <p className="text-white/40 mb-8">Die gesuchte Location existiert nicht.</p>
        <Link
          href="/venues"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold"
        >
          Zurück zu Venues
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      {/* Back button */}
      <motion.div
        className="fixed top-20 left-4 z-30"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link
          href="/venues"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zurück
        </Link>
      </motion.div>

      {/* Hero Image */}
      <div className="relative h-[50vh] overflow-hidden">
        <motion.img
          src={venue.imageUrl}
          alt={venue.name}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-bg)] via-[var(--dark-bg)]/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-10 pb-20">
        <motion.div variants={blurIn} initial="hidden" animate="visible">
          <GlassCard hoverable={false} className="p-8" glowColor="purple">
            {/* Genre pills */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {venue.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/20"
                >
                  {genre}
                </span>
              ))}
              {venue.capacity && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/5 text-white/50 border border-white/10">
                  {venue.capacity}
                </span>
              )}
            </div>

            {/* Name */}
            <AnimatedText
              text={venue.name}
              as="h1"
              className="text-4xl md:text-5xl font-bold mb-6"
              gradient
              mode="slide-up"
            />

            {/* Address */}
            <motion.div
              className="flex items-center gap-2 text-white/70 mb-4"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-lg">{venue.address}</span>
            </motion.div>

            {/* Description */}
            <motion.div
              className="prose prose-invert max-w-none mb-8"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <p className="text-white/70 leading-relaxed text-lg">
                {venue.description}
              </p>
            </motion.div>

            {/* Website */}
            {venue.website && (
              <motion.div
                className="flex flex-wrap gap-4"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
              >
                <GlowButton href={venue.website} variant="primary" size="lg">
                  Website
                </GlowButton>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>

        {/* Mini Map */}
        <motion.div
          className="mt-8"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <GlassCard hoverable={false} className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-white/80">Standort</h3>
            <div className="h-64 rounded-xl overflow-hidden">
              <MiniMap lat={venue.lat} lng={venue.lng} venueName={venue.name} />
            </div>
          </GlassCard>
        </motion.div>

        {/* Upcoming Events */}
        {events.length > 0 && (
          <motion.div
            className="mt-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Kommende Events</h2>
            <EventList events={events} />
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
