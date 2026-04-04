'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { DbEvent } from '@nightpulse/shared';
import { EventCard } from './event-card';
import { fadeInUp } from '@/lib/animations';

interface EventCarouselProps {
  readonly events: readonly DbEvent[];
}

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  readonly direction: 'left' | 'right';
  readonly onClick: () => void;
  readonly disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Vorherige Events' : 'Nächste Events'}
      className={`
        absolute top-1/2 -translate-y-1/2 z-10
        ${direction === 'left' ? 'left-2' : 'right-2'}
        w-10 h-10 rounded-full
        backdrop-blur-xl bg-white/10 border border-white/20
        flex items-center justify-center
        text-white/80 hover:text-white hover:bg-white/20
        transition-all duration-200
        disabled:opacity-0 disabled:pointer-events-none
        shadow-lg shadow-black/20
      `}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        {direction === 'left' ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

export function EventCarousel({ events }: EventCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = useCallback(
    (direction: 'left' | 'right') => {
      const el = scrollRef.current;
      if (!el) return;
      // Scroll by one card width (~340px) plus gap
      const scrollAmount = 360;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      // Delay state update to let scroll finish
      setTimeout(updateScrollState, 350);
    },
    [updateScrollState],
  );

  if (events.length === 0) return null;

  return (
    <motion.div
      className="relative group"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Arrow buttons - visible on hover */}
      <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowButton direction="left" onClick={() => scroll('left')} disabled={!canScrollLeft} />
        <ArrowButton direction="right" onClick={() => scroll('right')} disabled={!canScrollRight} />
      </div>

      {/* Scrollable container */}
      <motion.div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
        onScroll={updateScrollState}
        drag="x"
        dragConstraints={scrollRef}
        dragElastic={0.1}
        dragMomentum={false}
      >
        {events.map((event, index) => (
          <div
            key={event.id}
            className="snap-start shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <EventCard event={event} index={index} />
          </div>
        ))}
      </motion.div>

      {/* Fade edges */}
      <div className="absolute top-0 left-0 bottom-4 w-8 bg-gradient-to-r from-[var(--dark-bg)] to-transparent pointer-events-none z-[5]" />
      <div className="absolute top-0 right-0 bottom-4 w-8 bg-gradient-to-l from-[var(--dark-bg)] to-transparent pointer-events-none z-[5]" />
    </motion.div>
  );
}
