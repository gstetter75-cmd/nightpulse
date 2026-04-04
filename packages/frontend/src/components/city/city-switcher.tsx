'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CITIES } from '@/lib/cities';
import { useCityContext } from './city-provider';

export function CitySwitcher() {
  const { city, setCity, clearCity } = useCityContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleCityClick = useCallback(
    (slug: string) => {
      const found = CITIES.find((c) => c.slug === slug);
      if (found) {
        setCity(found);
      }
      setOpen(false);
    },
    [setCity],
  );

  const handleClear = useCallback(() => {
    setOpen(false);
    clearCity();
  }, [clearCity]);

  if (!city) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-sm text-white/70 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
      >
        <span>{city.emoji}</span>
        <span className="hidden sm:inline">{city.name}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full left-0 mt-2 w-56 rounded-xl overflow-hidden bg-[var(--dark-surface)]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl z-50"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-h-72 overflow-y-auto py-1">
              {CITIES.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => handleCityClick(c.slug)}
                  className={[
                    'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                    c.slug === city.slug
                      ? 'bg-purple-500/20 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.06]',
                  ].join(' ')}
                >
                  <span className="text-lg">{c.emoji}</span>
                  <span>{c.name}</span>
                  {c.slug === city.slug && (
                    <svg className="w-4 h-4 ml-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <div className="border-t border-white/[0.06]">
              <button
                onClick={handleClear}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Andere Stadt
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
