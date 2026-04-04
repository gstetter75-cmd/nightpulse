'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCityContext } from './city-provider';
import { CitySelector } from './city-selector';
import type { ReactNode } from 'react';

interface CityGateProps {
  readonly children: ReactNode;
}

export function CityGate({ children }: CityGateProps) {
  const { city, setCity, isLoading } = useCityContext();

  // While loading from localStorage, show nothing to avoid flash
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[var(--dark-bg)]" />
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!city ? (
        <CitySelector key="selector" onSelect={setCity} />
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
