'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import type { DbEvent } from '@nightpulse/shared';
import { ParticleBackground } from '@/components/effects/particle-background';
import { AnimatedGradient } from '@/components/effects/animated-gradient';
import { ParallaxSection } from '@/components/effects/parallax-section';
import { GradientMesh } from '@/components/effects/gradient-mesh';
import { Equalizer } from '@/components/effects/equalizer';
import { AnimatedText } from '@/components/ui/animated-text';
import { GlowButton } from '@/components/ui/glow-button';
import { GlassCard } from '@/components/ui/glass-card';
import { EventList } from '@/components/events/event-list';
import { EventCarousel } from '@/components/events/event-carousel';
import { FeaturedCard } from '@/components/events/featured-card';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { DEMO_EVENTS } from '@/lib/demo-events';
import {
  getEventsForTimeRange,
  getWeekendEvents,
  getFeaturedEvents,
} from '@/lib/event-filters';
import { useCityContext } from '@/components/city/city-provider';

/* ─── Inline keyframes (no globals.css modification) ─── */

const INLINE_KEYFRAMES = `
  @keyframes hero-gradient-shift {
    0% { background-position: 0% 50%; }
    25% { background-position: 100% 50%; }
    50% { background-position: 100% 0%; }
    75% { background-position: 0% 100%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes scanline-scroll {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  @keyframes orb-drift-1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(120px, -80px) scale(1.2); }
    50% { transform: translate(-60px, -160px) scale(0.8); }
    75% { transform: translate(-100px, 40px) scale(1.1); }
  }
  @keyframes orb-drift-2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(-100px, 60px) scale(0.9); }
    50% { transform: translate(80px, 120px) scale(1.3); }
    75% { transform: translate(60px, -90px) scale(0.7); }
  }
  @keyframes orb-drift-3 {
    0%, 100% { transform: translate(0, 0) scale(1.1); }
    33% { transform: translate(150px, 100px) scale(0.8); }
    66% { transform: translate(-120px, -50px) scale(1.2); }
  }
  @keyframes cta-btn-scan {
    0% { left: -30%; }
    100% { left: 130%; }
  }
  @keyframes pulse-halo {
    0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(236, 72, 153, 0.15); }
    50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.5), 0 0 80px rgba(236, 72, 153, 0.3), 0 0 120px rgba(168, 85, 247, 0.1); }
  }
  @keyframes neon-flicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; text-shadow: 0 0 8px #22c55e, 0 0 20px #22c55e, 0 0 40px #22c55e; }
    20%, 24%, 55% { opacity: 0.6; text-shadow: none; }
  }
  @keyframes radar-ping {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(3); opacity: 0; }
  }
  @keyframes section-neon-pulse {
    0%, 100% { border-color: rgba(168, 85, 247, 0.3); box-shadow: 0 0 15px rgba(168, 85, 247, 0.1), inset 0 0 15px rgba(168, 85, 247, 0.05); }
    50% { border-color: rgba(236, 72, 153, 0.5); box-shadow: 0 0 30px rgba(236, 72, 153, 0.2), inset 0 0 30px rgba(236, 72, 153, 0.05); }
  }
  @keyframes glow-underline {
    0% { width: 0; opacity: 0; }
    50% { width: 100%; opacity: 1; }
    100% { width: 100%; opacity: 0.7; }
  }
  @keyframes icon-pulse {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.1) rotate(3deg); }
  }
  @keyframes holographic-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes circuit-dash {
    0% { stroke-dashoffset: 200; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes cta-mesh-move {
    0% { background-position: 0% 0%; }
    50% { background-position: 100% 100%; }
    100% { background-position: 0% 0%; }
  }
  @media (prefers-reduced-motion: reduce) {
    .hero-club-bg, .scanline-overlay, .floating-orb, .pulse-halo-wrap,
    .neon-flicker-badge, .radar-ring, .neon-pulse-section, .glow-underline-el,
    .icon-pulse-anim, .holographic-card, .circuit-line, .cta-scan-btn,
    .cta-mesh-animated {
      animation: none !important;
    }
    .floating-orb { opacity: 0 !important; }
  }
`;

/* ─── Animated Counter ─── */

function AnimatedCounter({ target, suffix = '' }: { readonly target: number; readonly suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let frame: number;
    const duration = 2000;
    const start = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString('de-DE')}
      {suffix}
    </span>
  );
}

/* ─── Feature Card Data ─── */

const FEATURES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Live Events',
    description: 'Echtzeit Event-Discovery. Sobald ein neues Event veröffentlicht wird, siehst du es hier.',
    glow: 'purple' as const,
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: 'Interaktive Karte',
    description: 'Finde Events in deiner Nähe mit unserer Live-Karte. Filter nach Genre, Distanz und mehr.',
    glow: 'pink' as const,
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Immer aktuell',
    description: 'Automatische Updates durch Realtime-Sync. Kein Refresh nötig - alles passiert live.',
    glow: 'cyan' as const,
  },
] as const;

const STATS = [
  { value: 1247, suffix: '', label: 'Events' },
  { value: 89, suffix: '', label: 'Städte' },
  { value: 24, suffix: '/7', label: 'Updates' },
] as const;

/* ─── Floating Orbs (pure CSS decorative elements) ─── */

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Orb 1 - large purple */}
      <div
        className="floating-orb absolute rounded-full"
        style={{
          width: 8,
          height: 8,
          top: '20%',
          left: '15%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(168,85,247,0) 70%)',
          boxShadow: '0 0 20px rgba(168,85,247,0.6), 0 0 60px rgba(168,85,247,0.3)',
          animation: 'orb-drift-1 12s ease-in-out infinite',
        }}
      />
      {/* Orb 2 - small pink */}
      <div
        className="floating-orb absolute rounded-full"
        style={{
          width: 6,
          height: 6,
          top: '60%',
          right: '20%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.8) 0%, rgba(236,72,153,0) 70%)',
          boxShadow: '0 0 15px rgba(236,72,153,0.6), 0 0 40px rgba(236,72,153,0.3)',
          animation: 'orb-drift-2 15s ease-in-out infinite',
        }}
      />
      {/* Orb 3 - medium cyan */}
      <div
        className="floating-orb absolute rounded-full"
        style={{
          width: 5,
          height: 5,
          top: '35%',
          right: '10%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.8) 0%, rgba(6,182,212,0) 70%)',
          boxShadow: '0 0 15px rgba(6,182,212,0.6), 0 0 40px rgba(6,182,212,0.3)',
          animation: 'orb-drift-3 18s ease-in-out infinite',
        }}
      />
      {/* Orb 4 - tiny blue */}
      <div
        className="floating-orb absolute rounded-full"
        style={{
          width: 4,
          height: 4,
          top: '75%',
          left: '30%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(59,130,246,0) 70%)',
          boxShadow: '0 0 12px rgba(59,130,246,0.6), 0 0 30px rgba(59,130,246,0.3)',
          animation: 'orb-drift-1 20s ease-in-out infinite reverse',
        }}
      />
      {/* Orb 5 - purple upper right */}
      <div
        className="floating-orb absolute rounded-full"
        style={{
          width: 7,
          height: 7,
          top: '10%',
          right: '30%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, rgba(168,85,247,0) 70%)',
          boxShadow: '0 0 18px rgba(168,85,247,0.5), 0 0 50px rgba(168,85,247,0.2)',
          animation: 'orb-drift-2 14s ease-in-out infinite reverse',
        }}
      />
      {/* Orb 6 - pink lower left */}
      <div
        className="floating-orb absolute rounded-full"
        style={{
          width: 5,
          height: 5,
          bottom: '20%',
          left: '40%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.7) 0%, rgba(236,72,153,0) 70%)',
          boxShadow: '0 0 14px rgba(236,72,153,0.5), 0 0 35px rgba(236,72,153,0.2)',
          animation: 'orb-drift-3 16s ease-in-out infinite',
        }}
      />
    </div>
  );
}

/* ─── Circuit Pattern SVG (connecting feature cards) ─── */

function CircuitPattern() {
  return (
    <svg
      className="circuit-line absolute inset-0 w-full h-full pointer-events-none hidden md:block"
      style={{ zIndex: 0, opacity: 0.08 }}
      aria-hidden="true"
    >
      {/* Horizontal connecting line */}
      <line
        x1="16.5%"
        y1="50%"
        x2="83.5%"
        y2="50%"
        stroke="url(#circuit-grad)"
        strokeWidth="1"
        strokeDasharray="8 4"
        style={{ animation: 'circuit-dash 4s linear infinite' }}
      />
      {/* Junction dots */}
      <circle cx="33%" cy="50%" r="3" fill="rgba(168,85,247,0.4)" />
      <circle cx="66%" cy="50%" r="3" fill="rgba(236,72,153,0.4)" />
      <defs>
        <linearGradient id="circuit-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(168,85,247,0.6)" />
          <stop offset="50%" stopColor="rgba(236,72,153,0.6)" />
          <stop offset="100%" stopColor="rgba(6,182,212,0.6)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Stats Circuit Pattern SVG ─── */

function StatsCircuitPattern() {
  return (
    <svg
      className="circuit-line absolute inset-0 w-full h-full pointer-events-none hidden sm:block"
      style={{ zIndex: 0, opacity: 0.06 }}
      aria-hidden="true"
    >
      <line
        x1="16.5%"
        y1="50%"
        x2="83.5%"
        y2="50%"
        stroke="url(#stats-circuit-grad)"
        strokeWidth="1"
        strokeDasharray="6 3"
        style={{ animation: 'circuit-dash 5s linear infinite' }}
      />
      <circle cx="33%" cy="50%" r="2" fill="rgba(168,85,247,0.3)" />
      <circle cx="66%" cy="50%" r="2" fill="rgba(236,72,153,0.3)" />
      <defs>
        <linearGradient id="stats-circuit-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(168,85,247,0.4)" />
          <stop offset="100%" stopColor="rgba(236,72,153,0.4)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Live Indicator Dot with Radar Ping ─── */

function LiveDot() {
  return (
    <span className="relative inline-flex h-3 w-3 mr-3">
      {/* Outer radar rings */}
      <span
        className="radar-ring absolute inline-flex h-full w-full rounded-full bg-green-400/40"
        style={{ animation: 'radar-ping 2s ease-out infinite' }}
      />
      <span
        className="radar-ring absolute inline-flex h-full w-full rounded-full bg-green-400/30"
        style={{ animation: 'radar-ping 2s ease-out 0.6s infinite' }}
      />
      <span
        className="radar-ring absolute inline-flex h-full w-full rounded-full bg-green-400/20"
        style={{ animation: 'radar-ping 2s ease-out 1.2s infinite' }}
      />
      {/* Original ping */}
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      {/* Core dot */}
      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
    </span>
  );
}

/* ─── LIVE Badge with neon flicker ─── */

function LiveBadge() {
  return (
    <span
      className="neon-flicker-badge inline-flex items-center ml-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
      style={{
        color: '#22c55e',
        border: '1px solid rgba(34,197,94,0.4)',
        background: 'rgba(34,197,94,0.08)',
        animation: 'neon-flicker 3s ease-in-out infinite',
      }}
    >
      LIVE
    </span>
  );
}

/* ─── Page ─── */

export default function HomePage() {
  const { city } = useCityContext();
  const [allEvents, setAllEvents] = useState<readonly DbEvent[]>(DEMO_EVENTS);

  // Try to load generated events from /data/events.json, fall back to DEMO_EVENTS
  useEffect(() => {
    const controller = new AbortController();
    fetch('/data/events.json', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data: DbEvent[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllEvents(data);
        }
      })
      .catch(() => {
        // Fall back to demo events - already set as default
      });
    return () => controller.abort();
  }, []);

  // Curated sections
  const tonightEvents = getEventsForTimeRange(allEvents, 12);
  const tomorrowEvents = getEventsForTimeRange(allEvents, 24);
  const showTonight = tonightEvents.length > 0;
  const heroSectionEvents = showTonight ? tonightEvents : tomorrowEvents;
  const cityLabel = city ? ` in ${city.name}` : '';
  const heroSectionTitle = showTonight ? `Heute Nacht${cityLabel}` : `Morgen${cityLabel}`;

  const weekendEvents = getWeekendEvents(allEvents);
  const featuredEvents = getFeaturedEvents(allEvents, 3);
  const _previewEvents = allEvents.slice(0, 6);

  return (
    <div className="relative">
      {/* Inject keyframes */}
      <style dangerouslySetInnerHTML={{ __html: INLINE_KEYFRAMES }} />

      {/* ════════ Hero Section ════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Club lights animated gradient background */}
        <div
          className="hero-club-bg absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, rgba(88,28,135,0.4) 0%, rgba(157,23,77,0.3) 20%, rgba(30,58,138,0.4) 40%, rgba(88,28,135,0.3) 60%, rgba(6,95,70,0.2) 80%, rgba(157,23,77,0.4) 100%)',
            backgroundSize: '400% 400%',
            animation: 'hero-gradient-shift 15s ease infinite',
          }}
          aria-hidden="true"
        />

        {/* Existing background layers */}
        <ParticleBackground className="z-[1]" particleCount={90} />
        <AnimatedGradient className="z-[2] opacity-20" />

        {/* Scanline effect overlay */}
        <div
          className="scanline-overlay absolute inset-0 z-[4] pointer-events-none"
          style={{ opacity: 0.03 }}
          aria-hidden="true"
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
              animation: 'scanline-scroll 8s linear infinite',
            }}
          />
        </div>

        {/* Floating glowing orbs */}
        <FloatingOrbs />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 z-[5] opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />

        {/* Equalizer visualization behind content */}
        <div className="absolute bottom-0 left-0 right-0 z-[6] h-48 pointer-events-none" aria-hidden="true">
          <Equalizer barCount={28} opacity={0.1} className="h-full" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <AnimatedText
            text="Entdecke die Nacht."
            as="h1"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
            gradient
            mode="blur-in"
          />

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-white/60 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {city ? `Finde Events in ${city.name}. Spüre den Vibe. Live.` : 'Finde Events. Spüre den Vibe. Live.'}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            {/* CTA buttons with pulsing glow halo */}
            <div
              className="pulse-halo-wrap rounded-xl"
              style={{ animation: 'pulse-halo 3s ease-in-out infinite' }}
            >
              <GlowButton href="/events" size="lg">
                Events entdecken
              </GlowButton>
            </div>
            <div
              className="pulse-halo-wrap rounded-xl"
              style={{ animation: 'pulse-halo 3s ease-in-out 1.5s infinite' }}
            >
              <GlowButton href="/map" variant="secondary" size="lg">
                Karte öffnen
              </GlowButton>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div style={{ animation: 'bounce-down 2s ease-in-out infinite' }}>
            <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Section divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      {/* ════════ Features Section ════════ */}
      <ParallaxSection speed={0.3} fadeOnScroll className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Heading with animated glow underline */}
          <div className="relative inline-flex flex-col items-center w-full mb-16">
            <AnimatedText
              text="So funktioniert's"
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center"
              gradient
              mode="slide-up"
            />
            <motion.div
              className="glow-underline-el h-[2px] mt-3 rounded-full"
              style={{
                background: 'linear-gradient(90deg, rgba(168,85,247,0.8), rgba(236,72,153,0.8), rgba(6,182,212,0.8))',
                boxShadow: '0 0 10px rgba(168,85,247,0.5), 0 0 20px rgba(236,72,153,0.3)',
              }}
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: '200px', opacity: 0.7 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
            />
          </div>

          {/* Feature cards with circuit pattern */}
          <div className="relative">
            <CircuitPattern />
            <motion.div
              className="relative z-[1] grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {FEATURES.map((feature) => (
                <motion.div key={feature.title} variants={fadeInUp}>
                  <GlassCard glowColor={feature.glow} className="p-8 h-full text-center">
                    {/* Animated icon */}
                    <div
                      className="icon-pulse-anim inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-6 text-purple-400"
                      style={{ animation: 'icon-pulse 4s ease-in-out infinite' }}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-white/50 leading-relaxed">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </ParallaxSection>

      {/* Section divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />

      {/* ════════ Heute Nacht / Morgen Carousel ════════ */}
      {heroSectionEvents.length > 0 && (
        <section
          className="neon-pulse-section relative py-24 px-4"
          style={{
            border: '1px solid rgba(168,85,247,0.3)',
            borderLeft: 'none',
            borderRight: 'none',
            animation: 'section-neon-pulse 4s ease-in-out infinite',
          }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="flex items-center justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {showTonight && <LiveDot />}
              <AnimatedText
                text={heroSectionTitle}
                as="h2"
                className="text-3xl sm:text-4xl md:text-5xl font-bold"
                gradient
                mode="slide-up"
              />
              {showTonight && <LiveBadge />}
            </motion.div>

            <EventCarousel events={heroSectionEvents} />

            <motion.div
              className="text-center mt-12"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <GlowButton href="/events" size="lg">
                Alle Events
              </GlowButton>
            </motion.div>
          </div>
        </section>
      )}

      {/* Section divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* ════════ Beliebt (Featured) ════════ */}
      {featuredEvents.length > 0 && (
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <AnimatedText
              text="Beliebt"
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16"
              gradient
              mode="slide-up"
            />

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredEvents.map((event, index) => (
                <FeaturedCard key={event.id} event={event} index={index} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Section divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />

      {/* ════════ Dieses Wochenende ════════ */}
      {weekendEvents.length > 0 && (
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <AnimatedText
              text="Dieses Wochenende"
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16"
              gradient
              mode="slide-up"
            />

            <EventList events={weekendEvents} />
          </div>
        </section>
      )}

      {/* Section divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      {/* ════════ Stats Section ════════ */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto relative">
          <StatsCircuitPattern />
          <motion.div
            className="relative z-[1] grid grid-cols-1 sm:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {STATS.map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp}>
                <GlassCard glowColor="purple" className="p-8 text-center group">
                  {/* Holographic/iridescent overlay on hover */}
                  <div
                    className="holographic-card absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(236,72,153,0.1) 25%, rgba(6,182,212,0.1) 50%, rgba(59,130,246,0.1) 75%, rgba(168,85,247,0.1) 100%)',
                      backgroundSize: '200% 200%',
                      animation: 'holographic-shift 3s ease infinite',
                    }}
                    aria-hidden="true"
                  />
                  {/* Neon glow counter */}
                  <div
                    className="relative z-[1] text-5xl md:text-6xl font-bold gradient-text mb-2"
                    style={{
                      textShadow: '0 0 20px rgba(168,85,247,0.4), 0 0 40px rgba(236,72,153,0.2)',
                    }}
                  >
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="relative z-[1] text-white/50 text-lg">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />

      {/* ════════ CTA Section — Grand Finale ════════ */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Animated multi-layer gradient background */}
        <div
          className="cta-mesh-animated absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(88,28,135,0.3) 0%, rgba(157,23,77,0.2) 30%, rgba(30,58,138,0.3) 60%, rgba(88,28,135,0.2) 100%)',
            backgroundSize: '300% 300%',
            animation: 'cta-mesh-move 12s ease infinite',
          }}
          aria-hidden="true"
        />
        <GradientMesh className="absolute inset-0" opacity={0.25} />

        {/* Second gradient mesh layer for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(168,85,247,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(236,72,153,0.08) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <AnimatedText
            text="Bereit für die Nacht?"
            as="h2"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8"
            gradient
            mode="blur-in"
          />

          {/* Neon glow on subtitle */}
          <motion.p
            className="text-xl text-white/60 mb-10"
            style={{
              textShadow: '0 0 30px rgba(168,85,247,0.15)',
            }}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Entdecke jetzt live, was in deiner Stadt passiert.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Extra prominent button with scanning light */}
            <div className="inline-block relative">
              <div
                className="pulse-halo-wrap rounded-xl"
                style={{ animation: 'pulse-halo 2.5s ease-in-out infinite' }}
              >
                <GlowButton href="/map" size="lg" className="relative overflow-hidden">
                  Karte öffnen
                </GlowButton>
              </div>
              {/* Scanning light effect over button */}
              <div
                className="cta-scan-btn absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
                aria-hidden="true"
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '30%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                    animation: 'cta-btn-scan 3s ease-in-out infinite',
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom equalizer accent */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none opacity-60" aria-hidden="true">
          <Equalizer barCount={32} opacity={0.08} className="h-full" />
        </div>
      </section>

    </div>
  );
}
