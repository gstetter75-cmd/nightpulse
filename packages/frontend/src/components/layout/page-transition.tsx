'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { pageTransition } from '@/lib/animations';

interface PageTransitionProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
