'use client';

import { useMemo } from 'react';

interface EqualizerProps {
  readonly barCount?: number;
  readonly className?: string;
  readonly opacity?: number;
}

/**
 * CSS-only animated equalizer bars (music visualizer effect).
 * Each bar has randomized animation-delay and animation-duration for an organic feel.
 * Respects prefers-reduced-motion.
 */
export function Equalizer({ barCount = 24, className = '', opacity = 0.15 }: EqualizerProps) {
  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      // Deterministic pseudo-random based on index (no Math.random for SSR consistency)
      const seed1 = ((i * 7 + 3) % 11) / 11;
      const seed2 = ((i * 13 + 5) % 17) / 17;
      const seed3 = ((i * 19 + 7) % 23) / 23;

      return {
        id: i,
        minHeight: 10 + seed1 * 20, // 10-30%
        maxHeight: 40 + seed2 * 55, // 40-95%
        duration: 0.8 + seed3 * 1.4, // 0.8-2.2s
        delay: seed1 * 2, // 0-2s
      };
    });
  }, [barCount]);

  const keyframesStyle = `
    @keyframes eq-bounce {
      0%, 100% { transform: scaleY(var(--eq-min)); }
      50% { transform: scaleY(var(--eq-max)); }
    }
    @media (prefers-reduced-motion: reduce) {
      .eq-bar { animation: none !important; transform: scaleY(var(--eq-min)) !important; }
    }
  `;

  return (
    <div
      className={`flex items-end justify-center gap-[2px] ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <style dangerouslySetInnerHTML={{ __html: keyframesStyle }} />
      {bars.map((bar) => (
        <div
          key={bar.id}
          className="eq-bar w-[3px] sm:w-[4px] rounded-t-full origin-bottom"
          style={{
            height: '100%',
            '--eq-min': bar.minHeight / 100,
            '--eq-max': bar.maxHeight / 100,
            transform: `scaleY(${bar.minHeight / 100})`,
            animation: `eq-bounce ${bar.duration}s ease-in-out ${bar.delay}s infinite`,
            background: `linear-gradient(to top, rgba(168, 85, 247, 0.8), rgba(236, 72, 153, 0.6), rgba(59, 130, 246, 0.4))`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
