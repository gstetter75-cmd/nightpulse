'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

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
    'bg-gradient-to-r from-purple-600 to-pink-600 text-white glow-btn-primary',
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
  const [sparkles, setSparkles] = useState<ReadonlyArray<{ readonly x: number; readonly y: number; readonly id: number }>>([]);
  const nextId = useRef(0);
  const btnRef = useRef<HTMLElement>(null);

  // Magnetic hover effect
  const handleMagneticMove = useCallback((e: MouseEvent) => {
    if (!btnRef.current || disabled) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    const maxDist = 120;

    if (distance < maxDist) {
      const pull = (1 - distance / maxDist) * 6;
      const moveX = (distX / distance) * pull;
      const moveY = (distY / distance) * pull;
      btnRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    } else {
      btnRef.current.style.transform = 'translate(0px, 0px)';
    }
  }, [disabled]);

  const handleMagneticLeave = useCallback(() => {
    if (btnRef.current) {
      btnRef.current.style.transform = 'translate(0px, 0px)';
    }
  }, []);

  useEffect(() => {
    const handler = handleMagneticMove;
    const leaveHandler = handleMagneticLeave;
    window.addEventListener('mousemove', handler);
    window.addEventListener('mouseleave', leaveHandler);
    return () => {
      window.removeEventListener('mousemove', handler);
      window.removeEventListener('mouseleave', leaveHandler);
    };
  }, [handleMagneticMove, handleMagneticLeave]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = nextId.current++;

      // Ripple
      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);

      // Sparkles on click
      const sparkleCount = 6;
      const newSparkles = Array.from({ length: sparkleCount }, () => ({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 30,
        id: nextId.current++,
      }));
      setSparkles((prev) => [...prev, ...newSparkles] as ReadonlyArray<{ readonly x: number; readonly y: number; readonly id: number }>);
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => !newSparkles.some((ns) => ns.id === s.id)));
      }, 800);

      onClick?.();
    },
    [onClick],
  );

  const classes = [
    'relative inline-flex items-center justify-center font-semibold overflow-hidden',
    'transition-all duration-300 cursor-pointer group',
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    disabled ? 'opacity-50 pointer-events-none' : '',
    className,
  ].join(' ');

  const inner = (
    <>
      {/* Scanning light beam for primary */}
      {variant === 'primary' && (
        <span
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.12) 55%, transparent 60%)',
            animation: 'btn-shimmer 3s ease-in-out infinite',
          }}
        />
      )}

      <span className="relative z-10 inline-flex items-center gap-1">
        {children}
        {/* Arrow that slides in on hover for link buttons */}
        {href && (
          <span
            className="inline-block overflow-hidden w-0 group-hover:w-5 transition-all duration-300"
            aria-hidden="true"
          >
            <svg
              className="w-4 h-4 translate-x-[-8px] group-hover:translate-x-0 transition-transform duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        )}
      </span>

      {/* Ripple effects */}
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

      {/* Sparkle particles on click */}
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="absolute pointer-events-none z-20"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 0 6px 2px rgba(255,255,255,0.8)',
            animation: 'sparkle-burst 0.8s ease-out forwards',
          }}
        />
      ))}

      {/* Inline styles for glow button effects */}
      <style jsx>{`
        .glow-btn-primary {
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(236, 72, 153, 0.15);
          animation: btn-ambient-glow 3s ease-in-out infinite;
        }
        .glow-btn-primary:hover {
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(236, 72, 153, 0.35), 0 0 90px rgba(168, 85, 247, 0.15);
        }
        @keyframes btn-ambient-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(236, 72, 153, 0.15); }
          50% { box-shadow: 0 0 28px rgba(168, 85, 247, 0.4), 0 0 50px rgba(236, 72, 153, 0.2); }
        }
        @keyframes sparkle-burst {
          0% { transform: scale(1) translate(0, 0); opacity: 1; }
          100% { transform: scale(0) translate(${Math.random() > 0.5 ? '' : '-'}${15 + Math.random() * 20}px, -${20 + Math.random() * 15}px); opacity: 0; }
        }
      `}</style>
    </>
  );

  if (href) {
    return (
      <motion.div
        whileTap={{ scale: 0.95 }}
        style={{ transition: 'transform 0.15s ease-out' }}
      >
        <Link
          href={href}
          className={classes}
          onClick={handleClick}
          ref={btnRef as React.Ref<HTMLAnchorElement>}
        >
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
      ref={btnRef as React.Ref<HTMLButtonElement>}
      style={{ transition: 'transform 0.15s ease-out' }}
    >
      {inner}
    </motion.button>
  );
}
