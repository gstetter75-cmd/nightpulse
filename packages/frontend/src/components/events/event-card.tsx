'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
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

const CATEGORY_GLOW_COLORS: Record<string, string> = {
  TECHNO: 'rgba(168, 85, 247, 0.6)',
  HOUSE: 'rgba(236, 72, 153, 0.6)',
  HIPHOP: 'rgba(245, 158, 11, 0.6)',
  LATIN: 'rgba(239, 68, 68, 0.6)',
  JAZZ: 'rgba(59, 130, 246, 0.6)',
  ROCK: 'rgba(107, 114, 128, 0.6)',
  POP: 'rgba(6, 182, 212, 0.6)',
  ELECTRONIC: 'rgba(139, 92, 246, 0.6)',
  MIXED: 'rgba(16, 185, 129, 0.6)',
  OTHER: 'rgba(100, 116, 139, 0.6)',
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
  const categoryGlow = CATEGORY_GLOW_COLORS[event.category] ?? CATEGORY_GLOW_COLORS.OTHER;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/events/${event.id}`}>
        <GlassCard glowColor="purple" className="group cursor-pointer h-full event-card-upgraded">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={800}
                height={450}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

            {/* Category badge with pulsing glow */}
            <div className="absolute bottom-3 left-3">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${categoryGradient} text-white event-category-badge`}
                style={{
                  boxShadow: `0 0 8px ${categoryGlow}, 0 0 16px ${categoryGlow}`,
                  animation: 'category-pulse 2.5s ease-in-out infinite',
                }}
              >
                {event.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-2">
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1 event-title-glitch">
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
                <span className="text-sm font-semibold text-purple-400 event-price-badge">
                  {event.price}
                </span>
              ) : (
                <span
                  className="text-sm font-bold text-emerald-400 event-price-badge-free"
                  style={{
                    textShadow: '0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  Free
                </span>
              )}
            </div>
          </div>

          {/* Animated gradient line at bottom */}
          <div
            className="absolute bottom-0 inset-x-0 h-[2px] pointer-events-none event-bottom-line"
            style={{
              background: 'linear-gradient(90deg, transparent, #a855f7, #ec4899, #06b6d4, #a855f7, transparent)',
              backgroundSize: '200% 100%',
              opacity: 0,
              transition: 'opacity 0.4s ease',
              animation: 'gradient-flow 3s linear infinite',
            }}
          />

          {/* Electric border effect on hover */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 event-electric-border"
            style={{
              background:
                'linear-gradient(var(--dark-surface, #0a0a0f), var(--dark-surface, #0a0a0f)) padding-box, conic-gradient(from var(--border-angle, 0deg), #a855f7, #ec4899, #06b6d4, #a855f7) border-box',
              border: '1px solid transparent',
              animation: 'spin-border 3s linear infinite',
            }}
          />

          {/* Inline styles for event card effects */}
          <style jsx>{`
            @keyframes category-pulse {
              0%, 100% { box-shadow: 0 0 8px ${categoryGlow}, 0 0 16px ${categoryGlow}; }
              50% { box-shadow: 0 0 14px ${categoryGlow}, 0 0 28px ${categoryGlow}; }
            }
            @keyframes gradient-flow {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            .event-card-upgraded:hover .event-bottom-line {
              opacity: 1;
            }
            .event-card-upgraded:hover .event-title-glitch {
              animation: glitch-text 0.3s ease-in-out;
            }
            @keyframes glitch-text {
              0% { text-shadow: none; }
              20% { text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff; }
              40% { text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff; }
              60% { text-shadow: -1px 0 #ff00ff, 1px 0 #00ffff; }
              80% { text-shadow: 1px 0 #ff00ff, -1px 0 #00ffff; }
              100% { text-shadow: none; }
            }
            .event-price-badge {
              text-shadow: 0 0 8px rgba(168, 85, 247, 0.4);
            }
            .event-price-badge-free {
              animation: free-glow 2s ease-in-out infinite;
            }
            @keyframes free-glow {
              0%, 100% { text-shadow: 0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3); }
              50% { text-shadow: 0 0 16px rgba(16, 185, 129, 0.7), 0 0 32px rgba(16, 185, 129, 0.4); }
            }
          `}</style>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
