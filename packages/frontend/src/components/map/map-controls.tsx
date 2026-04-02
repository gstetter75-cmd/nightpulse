'use client';

import { motion } from 'framer-motion';
import type { EventCategory } from '@nightpulse/shared';
import { EVENT_CATEGORIES } from '@nightpulse/shared';

interface MapControlsProps {
  readonly onZoomIn: () => void;
  readonly onZoomOut: () => void;
  readonly onLocate: () => void;
  readonly filters: ReadonlySet<EventCategory>;
  readonly onFilterChange: (filters: ReadonlySet<EventCategory>) => void;
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

function ControlButton({
  onClick,
  label,
  children,
}: {
  readonly onClick: () => void;
  readonly label: string;
  readonly children: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
      whileTap={{ scale: 0.9 }}
      whileHover={{ boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)' }}
    >
      {children}
    </motion.button>
  );
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onLocate,
  filters,
  onFilterChange,
}: MapControlsProps) {
  const toggleCategory = (cat: EventCategory) => {
    const next = new Set(filters);
    if (next.has(cat)) {
      next.delete(cat);
    } else {
      next.add(cat);
    }
    onFilterChange(next);
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
      {/* Zoom / Locate */}
      <div className="glass rounded-xl p-2 flex flex-col gap-2">
        <ControlButton onClick={onZoomIn} label="Zoom in">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </ControlButton>
        <ControlButton onClick={onZoomOut} label="Zoom out">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </ControlButton>
        <div className="h-px bg-white/10" />
        <ControlButton onClick={onLocate} label="Locate me">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2m10-10h-2M4 12H2" />
          </svg>
        </ControlButton>
      </div>

      {/* Category toggles */}
      <div className="glass rounded-xl p-2 flex flex-col gap-1.5 max-h-[300px] overflow-y-auto">
        {EVENT_CATEGORIES.map((cat) => {
          const isActive = filters.has(cat);
          const color = CATEGORY_COLORS[cat] ?? '#a855f7';
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={[
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                isActive ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70',
              ].join(' ')}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: color,
                  opacity: isActive ? 1 : 0.4,
                  boxShadow: isActive ? `0 0 8px ${color}` : 'none',
                }}
              />
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
