'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { fadeInUp } from '@/lib/animations';
import type { VenueInfo } from '@/lib/venues';

interface VenueCardProps {
  readonly venue: VenueInfo;
  readonly eventCount: number;
  readonly index?: number;
}

function LocationIcon() {
  return (
    <svg
      className="inline-block w-3.5 h-3.5 mr-1 -mt-0.5 opacity-60"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function VenueCard({ venue, eventCount, index = 0 }: VenueCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/venues/${venue.slug}`}>
        <GlassCard glowColor="purple" className="group cursor-pointer h-full hover-gradient-border">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={venue.imageUrl}
              alt={venue.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-surface)] via-transparent to-transparent" />

            {/* Event count badge */}
            {eventCount > 0 && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {eventCount} {eventCount === 1 ? 'Event' : 'Events'}
                </span>
              </div>
            )}

            {/* Capacity badge */}
            {venue.capacity && (
              <div className="absolute bottom-3 left-3">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/10">
                  {venue.capacity}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
              {venue.name}
            </h3>

            {/* Genre pills */}
            <div className="flex flex-wrap gap-1.5">
              {venue.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/5 text-white/60 border border-white/5"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-sm text-white/50 flex items-center">
              <LocationIcon />
              <span className="line-clamp-1">{venue.address}</span>
            </p>
          </div>

          {/* Animated gradient border on hover */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                'linear-gradient(var(--dark-surface), var(--dark-surface)) padding-box, conic-gradient(from var(--border-angle, 0deg), #a855f7, #ec4899, #06b6d4, #a855f7) border-box',
              border: '1px solid transparent',
              animation: 'spin-border 4s linear infinite',
            }}
          />
        </GlassCard>
      </Link>
    </motion.div>
  );
}
