'use client';

import { useCallback, useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  readonly particleCount?: number;
  readonly connectDistance?: number;
  readonly className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
}

const NEON_COLORS = [
  'rgba(168, 85, 247,',
  'rgba(236, 72, 153,',
  'rgba(59, 130, 246,',
  'rgba(6, 182, 212,',
];

export function ParticleBackground({
  particleCount = 80,
  connectDistance = 120,
  className = '',
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const reducedMotionRef = useRef(false);

  const initParticles = useCallback(
    (width: number, height: number) => {
      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        const opacity = Math.random() * 0.5 + 0.3; // 0.3 - 0.8
        const colorBase = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1, // 1 - 3px
          opacity,
          color: `${colorBase} ${opacity})`,
        });
      }
      particlesRef.current = particles;
    },
    [particleCount],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mq.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mq.addEventListener('change', handleMotionChange);

    // Resize
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
      if (particlesRef.current.length === 0) {
        initParticles(rect.width, rect.height);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking
    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    canvas.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 },
    );
    observer.observe(canvas);

    // Animation loop
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      if (!isVisibleRef.current) return;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const isReduced = reducedMotionRef.current;

      for (const p of particles) {
        if (!isReduced) {
          // Mouse repel interaction
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 0) {
            const force = (150 - dist) / 150;
            p.vx -= (dx / dist) * force * 0.03;
            p.vy -= (dy / dist) * force * 0.03;
          }

          // Damping to keep velocities in check
          p.vx *= 0.99;
          p.vy *= 0.99;

          p.x += p.vx;
          p.y += p.vy;

          // Bounce off edges
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
          p.x = Math.max(0, Math.min(width, p.x));
          p.y = Math.max(0, Math.min(height, p.y));
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // Draw connection lines between nearby particles (skip in reduced motion)
      if (!isReduced) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectDistance) {
              const alpha = 0.15 * (1 - dist / connectDistance);
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      // Gradient fade at top and bottom edges
      const fadeHeight = 80;
      const topGrad = ctx.createLinearGradient(0, 0, 0, fadeHeight);
      topGrad.addColorStop(0, 'rgba(10, 10, 15, 1)');
      topGrad.addColorStop(1, 'rgba(10, 10, 15, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, fadeHeight);

      const bottomGrad = ctx.createLinearGradient(0, height - fadeHeight, 0, height);
      bottomGrad.addColorStop(0, 'rgba(10, 10, 15, 0)');
      bottomGrad.addColorStop(1, 'rgba(10, 10, 15, 1)');
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, height - fadeHeight, width, fadeHeight);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouse);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      mq.removeEventListener('change', handleMotionChange);
      observer.disconnect();
    };
  }, [connectDistance, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
    />
  );
}
