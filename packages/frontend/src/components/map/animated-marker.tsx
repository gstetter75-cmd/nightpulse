'use client';

import { motion } from 'framer-motion';
import type { DbEvent } from '@nightpulse/shared';

interface AnimatedMarkerProps {
  readonly event: DbEvent;
  readonly isNew?: boolean;
  readonly onClick?: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  TECHNO: '#a855f7',
  HOUSE: '#ec4899',
  HIPHOP: '#f59e0b',
  LATIN: '#ef4444',
  JAZZ: '#3b82f6',
  ROCK: '#6b7280',
  POP: '#06b6d4',
  ELECTRONIC: '#8b5cf6',
  MIXED: '#10b981',
  OTHER: '#64748b',
};

export function AnimatedMarker({ event, isNew = false, onClick }: AnimatedMarkerProps) {
  const color = CATEGORY_COLORS[event.category] ?? '#a855f7';

  return (
    <motion.div
      className="relative cursor-pointer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.4, filter: 'brightness(1.2)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      {/* Outer pulse ring */}
      <div
        className="absolute -inset-2 rounded-full"
        style={{
          backgroundColor: color,
          animation: 'pulse-ring 2s ease-out infinite',
          opacity: isNew ? 0.6 : 0.3,
        }}
      />

      {/* Second ring for new events */}
      {isNew && (
        <div
          className="absolute -inset-4 rounded-full"
          style={{
            backgroundColor: color,
            animation: 'pulse-ring 2s ease-out infinite 0.5s',
            opacity: 0.2,
          }}
        />
      )}

      {/* Core dot */}
      <div
        className="w-4 h-4 rounded-full border-2 border-white/80"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 16px ${color}, 0 0 32px ${color}40`,
        }}
      />
    </motion.div>
  );
}
