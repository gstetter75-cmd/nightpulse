'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { DbEvent } from '@nightpulse/shared';
import { AnimatedText } from '@/components/ui/animated-text';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { ShareSheet } from '@/components/events/share-sheet';
import { blurIn, fadeInUp } from '@/lib/animations';

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

interface EventDetailProps {
  readonly event: DbEvent;
}

function formatFullDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  TECHNO: 'from-purple-500 to-violet-600',
  HOUSE: 'from-pink-500 to-rose-600',
  HIPHOP: 'from-amber-500 to-orange-600',
  LATIN: 'from-red-500 to-rose-600',
  JAZZ: 'from-blue-500 to-indigo-600',
  ROCK: 'from-gray-500 to-zinc-600',
  POP: 'from-cyan-500 to-teal-600',
  ELECTRONIC: 'from-violet-500 to-purple-600',
  MIXED: 'from-emerald-500 to-green-600',
  OTHER: 'from-slate-500 to-gray-600',
};

export function EventDetail({ event }: EventDetailProps) {
  const [showShareSheet, setShowShareSheet] = useState(false);
  const categoryGradient = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.OTHER;

  const handleShare = () => {
    setShowShareSheet(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[50vh] overflow-hidden">
        {event.imageUrl ? (
          <motion.img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-bg)] via-[var(--dark-bg)]/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-10 pb-20">
        <motion.div variants={blurIn} initial="hidden" animate="visible">
          <GlassCard hoverable={false} className="p-8" glowColor="purple">
            {/* Category + Date */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span
                className={`px-4 py-1.5 text-sm font-semibold rounded-full bg-gradient-to-r ${categoryGradient} text-white`}
              >
                {event.category}
              </span>
              <span className="text-white/50 text-sm">
                {formatFullDate(event.startDate)}
              </span>
            </div>

            {/* Title */}
            <AnimatedText
              text={event.title}
              as="h1"
              className="text-4xl md:text-5xl font-bold mb-6"
              gradient
              mode="slide-up"
            />

            {/* Venue */}
            <motion.div
              className="flex items-center gap-2 text-white/70 mb-4"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-lg">{event.venueName}</span>
              {event.venueAddress && (
                <span className="text-white/40">- {event.venueAddress}</span>
              )}
            </motion.div>

            {/* Price */}
            <motion.div
              className="mb-8"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              {event.price ? (
                <span className="text-2xl font-bold text-purple-400">{event.price}</span>
              ) : (
                <span className="text-2xl font-bold text-emerald-400">Free Entry</span>
              )}
            </motion.div>

            {/* Description */}
            {event.description && (
              <motion.div
                className="prose prose-invert max-w-none mb-8"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
              >
                <p className="text-white/70 leading-relaxed text-lg">
                  {event.description}
                </p>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              className="flex flex-wrap gap-4"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
            >
              {event.url && (
                <GlowButton href={event.url} variant="primary" size="lg">
                  Tickets
                </GlowButton>
              )}
              <GlowButton variant="secondary" size="lg" onClick={handleShare}>
                Teilen
              </GlowButton>
            </motion.div>
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
              <MiniMap lat={event.lat} lng={event.lng} venueName={event.venueName} />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Share Sheet */}
      <ShareSheet
        event={event}
        isOpen={showShareSheet}
        onClose={() => setShowShareSheet(false)}
      />
    </div>
  );
}
