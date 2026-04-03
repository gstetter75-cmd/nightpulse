'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode, useCallback, useRef } from 'react';

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
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hoverable || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    },
    [hoverable],
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

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
      ref={cardRef}
      className={baseClasses}
      style={{
        backgroundColor: GLOW_COLORS[glowColor],
        transition: 'transform 0.2s ease-out, box-shadow 0.3s ease',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={
        hoverable
          ? {
              boxShadow: HOVER_GLOW_COLORS[glowColor],
            }
          : undefined
      }
      {...motionProps}
    >
      {/* Top edge shine / light hit */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 70%, transparent 100%)',
        }}
      />
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.02,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />
      {/* Children rendered above overlays */}
      <div className="relative z-[2]">{children}</div>
    </motion.div>
  );
}
