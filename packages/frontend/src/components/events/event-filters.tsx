'use client';

import { motion } from 'framer-motion';
import { EVENT_CATEGORIES, type EventCategory } from '@nightpulse/shared';

export interface EventFilterState {
  readonly category: EventCategory | null;
  readonly radiusKm: number;
  readonly dateRange: 'today' | 'week' | 'month' | 'all';
}

interface EventFiltersProps {
  readonly filters: EventFilterState;
  readonly onFilterChange: (filters: EventFilterState) => void;
  readonly searchQuery?: string;
  readonly onSearchChange?: (query: string) => void;
}

const DATE_OPTIONS = [
  { value: 'all', label: 'Alle' },
  { value: 'today', label: 'Heute' },
  { value: 'week', label: 'Diese Woche' },
  { value: 'month', label: 'Dieser Monat' },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  TECHNO: 'Techno',
  HOUSE: 'House',
  HIPHOP: 'HipHop',
  LATIN: 'Latin',
  JAZZ: 'Jazz',
  ROCK: 'Rock',
  POP: 'Pop',
  ELECTRONIC: 'Electronic',
  MIXED: 'Mixed',
  OTHER: 'Sonstige',
};

export function EventFilters({ filters, onFilterChange, searchQuery = '', onSearchChange }: EventFiltersProps) {
  const handleCategoryClick = (cat: EventCategory) => {
    onFilterChange({
      ...filters,
      category: filters.category === cat ? null : cat,
    });
  };

  const handleDateChange = (range: EventFilterState['dateRange']) => {
    onFilterChange({ ...filters, dateRange: range });
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, radiusKm: Number(e.target.value) });
  };

  return (
    <div className="glass rounded-2xl p-4 space-y-4">
      {/* Search */}
      {onSearchChange && (
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Events durchsuchen..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm outline-none transition-all focus:bg-white/[0.08] focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
          />
        </div>
      )}

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {EVENT_CATEGORIES.map((cat) => {
          const isActive = filters.category === cat;
          return (
            <motion.button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={[
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all',
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white glow-purple'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white',
              ].join(' ')}
              layout
              whileTap={{ scale: 0.95 }}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </motion.button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        {/* Radius slider */}
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <label className="text-sm text-white/50 whitespace-nowrap">
            Radius: {filters.radiusKm} km
          </label>
          <input
            type="range"
            min={1}
            max={100}
            value={filters.radiusKm}
            onChange={handleRadiusChange}
            className="flex-1 h-1 rounded-full appearance-none bg-white/10 accent-purple-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
          />
        </div>

        {/* Date range */}
        <div className="flex gap-2">
          {DATE_OPTIONS.map((opt) => {
            const isActive = filters.dateRange === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleDateChange(opt.value)}
                className={[
                  'px-3 py-1.5 rounded-lg text-sm transition-all',
                  isActive
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5',
                ].join(' ')}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
