'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

const GLOW_COLORS = {
  purple: 'rgba(168, 85, 247, 0.15)',
  pink: 'rgba(236, 72, 153, 0.15)',
  blue: 'rgba(59, 130, 246, 0.15)',
  cyan: 'rgba(6, 182, 212, 0.15)',
} as const;

const HOVER_GLOW_COLORS = {
  purple: '0 0 30px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.1)',
  pink: '0 0 30px rgba(236, 72, 153, 0.3), 0 0 60px rgba(236, 72, 153, 0.1)',
  blue: '0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1)',
  cyan: '0 0 30px rgba(6, 182, 212, 0.3), 0 0 60px rgba(6, 182, 212, 0.1)',
} as const;

type GlowColor = keyof typeof GLOW_COLORS;

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  readonly children: ReactNode;
  readonly className?: string;
  readonly glowColor?: GlowColor;
  readonly hoverable?: boolean;
  readonly withBorder?: boolean;
}

export function GlassCard({
  children,
  className = '',
  glowColor = 'purple',
  hoverable = true,
  withBorder = false,
  ...motionProps
}: GlassCardProps) {
  const baseClasses = [
    'relative rounded-2xl overflow-hidden',
    'bg-white/[0.03] backdrop-blur-xl',
    'border border-white/[0.06]',
    withBorder ? 'animated-border' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      className={baseClasses}
      style={{ backgroundColor: GLOW_COLORS[glowColor] }}
      whileHover={
        hoverable
          ? {
              scale: 1.02,
              boxShadow: HOVER_GLOW_COLORS[glowColor],
              transition: { duration: 0.3 },
            }
          : undefined
      }
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
