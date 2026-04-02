'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { DbEvent } from '@nightpulse/shared';

interface MapPopupProps {
  readonly event: DbEvent;
  readonly onClose: () => void;
}

function formatShortDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('de-DE', {
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

export function MapPopup({ event, onClose }: MapPopupProps) {
  return (
    <motion.div
      className="absolute bottom-6 left-1/2 z-20 w-[320px] -ml-[160px]"
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="glass rounded-2xl overflow-hidden glow-purple">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white/60 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        {event.imageUrl && (
          <div className="h-32 overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-surface)] via-transparent to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-2">
          <h4 className="text-base font-bold text-white line-clamp-1">{event.title}</h4>
          <p className="text-xs text-white/50">{formatShortDate(event.startDate)}</p>
          <p className="text-sm text-white/70">{event.venueName}</p>

          <Link
            href={`/events/${event.id}`}
            className="inline-block mt-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-shadow"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
