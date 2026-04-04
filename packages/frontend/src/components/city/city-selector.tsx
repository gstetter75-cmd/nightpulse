'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { type City, CITIES, findNearestCity } from '@/lib/cities';
import { AnimatedText } from '@/components/ui/animated-text';
import { GlassCard } from '@/components/ui/glass-card';
import { ParticleBackground } from '@/components/effects/particle-background';
import { GradientMesh } from '@/components/effects/gradient-mesh';

interface CitySelectorProps {
  readonly onSelect: (city: City) => void;
}

export function CitySelector({ onSelect }: CitySelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const handleSelect = useCallback(
    (city: City) => {
      setSelected(city.slug);
      // Short delay for the selection animation before transitioning
      setTimeout(() => {
        onSelect(city);
      }, 400);
    },
    [onSelect],
  );

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = findNearestCity(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
        handleSelect(nearest);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [handleSelect]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-y-auto bg-[var(--dark-bg)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background effects */}
        <GradientMesh className="fixed inset-0 z-0" opacity={0.2} />
        <ParticleBackground className="z-[1]" particleCount={60} />

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-16">
          {/* Heading */}
          <div className="text-center mb-12">
            <AnimatedText
              text="Wo bist du?"
              as="h1"
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4"
              gradient
              mode="blur-in"
            />
            <motion.p
              className="text-lg sm:text-xl text-white/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              W&auml;hle deine Stadt f&uuml;r personalisierte Events
            </motion.p>
          </div>

          {/* Locate button */}
          <motion.div
            className="flex justify-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <button
              onClick={handleLocate}
              disabled={locating}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/70 hover:text-white hover:bg-white/[0.1] transition-all duration-300 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {locating ? 'Suche...' : 'Standort erkennen'}
            </button>
          </motion.div>

          {/* City grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05, delayChildren: 0.8 } },
            }}
          >
            {CITIES.map((city) => (
              <motion.div
                key={city.slug}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
              >
                <button
                  onClick={() => handleSelect(city)}
                  className="w-full text-left"
                >
                  <GlassCard
                    glowColor="purple"
                    className={[
                      'p-5 cursor-pointer transition-all duration-300',
                      selected === city.slug
                        ? 'ring-2 ring-purple-500 scale-95'
                        : 'hover:scale-[1.03]',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{city.emoji}</span>
                      <div>
                        <span className="text-lg font-bold text-white">{city.name}</span>
                        <span className="block text-sm text-white/40">{city.country}</span>
                      </div>
                    </div>
                  </GlassCard>
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
