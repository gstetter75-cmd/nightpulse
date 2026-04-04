'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { DbEvent } from '@nightpulse/shared';
import { fadeInUp } from '@/lib/animations';

interface FeaturedCardProps {
  readonly event: DbEvent;
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

export function FeaturedCard({ event, index = 0 }: FeaturedCardProps) {
  const categoryGradient = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.OTHER;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
    >
      <Link href={`/events/${event.id}`}>
        <div className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden cursor-pointer border border-white/[0.06]">
          {/* Background image */}
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50" />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className={`px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r ${categoryGradient} text-white backdrop-blur-sm`}
            >
              {event.category}
            </span>
          </div>

          {/* Price badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1.5 text-xs font-bold rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white">
              {event.price ?? 'Free'}
            </span>
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
              {event.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1.5 opacity-60"
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
                {formatDate(event.startDate)}
              </span>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1.5 opacity-60"
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
                {event.venueName}
              </span>
            </div>
            {event.description && (
              <p className="mt-2 text-sm text-white/50 line-clamp-2">
                {event.description}
              </p>
            )}
          </div>

          {/* Hover border glow */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                'linear-gradient(transparent, transparent) padding-box, conic-gradient(from var(--border-angle, 0deg), #a855f7, #ec4899, #06b6d4, #a855f7) border-box',
              border: '1px solid transparent',
              animation: 'spin-border 4s linear infinite',
            }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
