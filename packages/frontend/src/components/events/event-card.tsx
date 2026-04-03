'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { DbEvent } from '@nightpulse/shared';
import { GlassCard } from '@/components/ui/glass-card';
import { fadeInUp } from '@/lib/animations';

interface EventCardProps {
  readonly event: DbEvent;
  readonly isNew?: boolean;
  readonly index?: number;
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

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function ClockIcon() {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
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

export function EventCard({ event, isNew = false, index = 0 }: EventCardProps) {
  const categoryGradient = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.OTHER;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/events/${event.id}`}>
        <GlassCard glowColor="purple" className="group cursor-pointer h-full hover-gradient-border">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50" />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-surface)] via-transparent to-transparent" />

            {/* NEW badge */}
            {isNew && (
              <div className="absolute top-3 right-3">
                <span
                  className="px-2 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
                >
                  NEU
                </span>
              </div>
            )}

            {/* Category badge */}
            <div className="absolute bottom-3 left-3">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${categoryGradient} text-white`}
              >
                {event.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-2">
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
              {event.title}
            </h3>
            <p className="text-sm text-white/50 flex items-center">
              <ClockIcon />
              {formatDate(event.startDate)}
            </p>
            <p className="text-sm text-white/70 flex items-center">
              <LocationIcon />
              {event.venueName}
            </p>
            <div className="pt-2">
              {event.price ? (
                <span className="text-sm font-semibold text-purple-400">{event.price}</span>
              ) : (
                <span className="text-sm font-semibold text-emerald-400">Free</span>
              )}
            </div>
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
