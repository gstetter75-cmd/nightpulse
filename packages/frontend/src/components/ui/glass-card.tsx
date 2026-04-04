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
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spotlight follows cursor
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = '1';
        spotlightRef.current.style.background = `radial-gradient(350px circle at ${x}px ${y}px, rgba(168, 85, 247, 0.12), transparent 60%)`;
      }

      if (!hoverable) return;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;
      cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    },
    [hoverable],
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = '0';
    }
  }, []);

  const baseClasses = [
    'relative rounded-2xl overflow-hidden glass-card-upgraded',
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
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-[0]"
        style={{
          padding: '1px',
          background: 'linear-gradient(var(--dark-surface, #0a0a0f), var(--dark-surface, #0a0a0f)) padding-box, conic-gradient(from var(--border-angle, 0deg), rgba(168,85,247,0.4), rgba(236,72,153,0.3), rgba(6,182,212,0.3), rgba(168,85,247,0.4)) border-box',
          border: '1px solid transparent',
          animation: 'glass-border-spin 6s linear infinite',
          opacity: 0.4,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Rainbow refraction on top edge */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] pointer-events-none z-[3]"
        style={{
          background:
            'linear-gradient(90deg, transparent 5%, #ff000030 15%, #ff8c0030 25%, #ffd70030 35%, #00ff0030 45%, #00bfff30 55%, #4b008230 65%, #9400d330 75%, transparent 95%)',
          animation: 'rainbow-refraction 4s ease-in-out infinite alternate',
        }}
      />

      {/* Top edge shine / light hit */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none z-[3]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 70%, transparent 100%)',
        }}
      />

      {/* Holographic shimmer on hover */}
      <div
        className="absolute inset-0 pointer-events-none z-[2] opacity-0 glass-card-shimmer"
        style={{
          background:
            'linear-gradient(105deg, transparent 30%, rgba(168,85,247,0.08) 38%, rgba(236,72,153,0.1) 42%, rgba(6,182,212,0.08) 46%, rgba(255,255,255,0.15) 50%, rgba(6,182,212,0.08) 54%, rgba(236,72,153,0.1) 58%, rgba(168,85,247,0.08) 62%, transparent 70%)',
          animation: 'holographic-sweep 2s ease-in-out infinite',
          backgroundSize: '200% 100%',
        }}
      />

      {/* Spotlight that follows the mouse */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none z-[2] transition-opacity duration-300"
        style={{ opacity: 0 }}
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
      <div className="relative z-[4]">{children}</div>

      {/* Inline keyframes for glass card effects */}
      <style jsx>{`
        @keyframes glass-border-spin {
          from { --border-angle: 0deg; }
          to { --border-angle: 360deg; }
        }
        @keyframes holographic-sweep {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes rainbow-refraction {
          0% { opacity: 0.3; filter: hue-rotate(0deg); }
          50% { opacity: 0.6; filter: hue-rotate(30deg); }
          100% { opacity: 0.3; filter: hue-rotate(60deg); }
        }
        .glass-card-upgraded:hover .glass-card-shimmer {
          opacity: 1;
        }
        .glass-card-upgraded:hover > div:first-child {
          opacity: 0.8;
        }
        @property --border-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
      `}</style>
    </motion.div>
  );
}
