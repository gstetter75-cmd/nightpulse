'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface ParallaxSectionProps {
  readonly children: ReactNode;
  readonly speed?: number;
  readonly className?: string;
  readonly fadeOnScroll?: boolean;
}

export function ParallaxSection({
  children,
  speed = 0.5,
  className = '',
  fadeOnScroll = false,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    fadeOnScroll ? [0, 1, 1, 0] : [1, 1, 1, 1],
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, opacity }}>{children}</motion.div>
    </div>
  );
}
