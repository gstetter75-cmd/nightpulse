'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { type ReactNode, useCallback, useRef, useState } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface GlowButtonProps {
  readonly children: ReactNode;
  readonly variant?: Variant;
  readonly size?: Size;
  readonly onClick?: () => void;
  readonly href?: string;
  readonly className?: string;
  readonly disabled?: boolean;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.4),0_0_60px_rgba(236,72,153,0.2)]',
  secondary:
    'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]',
  ghost:
    'bg-transparent text-white/80 hover:text-white hover:bg-white/5',
};

const SIZE_STYLES: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
};

export function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  className = '',
  disabled = false,
}: GlowButtonProps) {
  const [ripples, setRipples] = useState<ReadonlyArray<{ readonly x: number; readonly y: number; readonly id: number }>>([]);
  const nextId = useRef(0);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = nextId.current++;
      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
      onClick?.();
    },
    [onClick],
  );

  const classes = [
    'relative inline-flex items-center justify-center font-semibold overflow-hidden',
    'transition-all duration-300 cursor-pointer',
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    disabled ? 'opacity-50 pointer-events-none' : '',
    className,
  ].join(' ');

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x - 5,
            top: ripple.y - 5,
            width: 10,
            height: 10,
            animation: 'ripple 0.6s ease-out forwards',
          }}
        />
      ))}
    </>
  );

  if (href) {
    return (
      <motion.div whileTap={{ scale: 0.95 }}>
        <Link href={href} className={classes} onClick={handleClick}>
          {inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      className={classes}
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
    >
      {inner}
    </motion.button>
  );
}
