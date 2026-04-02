'use client';

import { type ReactNode } from 'react';

interface GradientBorderProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly colors?: readonly string[];
  readonly speed?: number;
}

export function GradientBorder({
  children,
  className = '',
  colors = ['#a855f7', '#ec4899', '#06b6d4'],
  speed = 4,
}: GradientBorderProps) {
  const gradientColors = [...colors, colors[0]].join(', ');

  return (
    <div className={`relative rounded-2xl p-[2px] ${className}`}>
      {/* Animated border layer */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `conic-gradient(from var(--border-angle, 0deg), ${gradientColors})`,
          animation: `spin-border ${speed}s linear infinite`,
        }}
      />
      {/* Content layer */}
      <div className="relative rounded-2xl bg-[var(--dark-surface)]">
        {children}
      </div>
    </div>
  );
}
