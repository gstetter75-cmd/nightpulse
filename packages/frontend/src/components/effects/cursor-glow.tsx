'use client';

import { useCallback, useEffect, useRef } from 'react';

interface CursorGlowProps {
  readonly color?: string;
  readonly size?: number;
  readonly opacity?: number;
  readonly className?: string;
}

export function CursorGlow({
  color = 'rgba(168, 85, 247, 0.5), rgba(236, 72, 153, 0.3)',
  size = 350,
  opacity = 0.08,
  className = '',
}: CursorGlowProps) {
  const glowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -1000, y: -1000 });
  const targetRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  const animate = useCallback(() => {
    const lerp = 0.12;
    posRef.current = {
      x: posRef.current.x + (targetRef.current.x - posRef.current.x) * lerp,
      y: posRef.current.y + (targetRef.current.y - posRef.current.y) * lerp,
    };

    if (glowRef.current) {
      glowRef.current.style.transform = `translate(${posRef.current.x - size / 2}px, ${posRef.current.y - size / 2}px)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [size]);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      <div
        ref={glowRef}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}, transparent 70%)`,
          opacity,
          willChange: 'transform',
          transform: 'translate(-1000px, -1000px)',
        }}
      />
    </div>
  );
}
