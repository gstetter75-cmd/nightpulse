'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ParticleBackground } from '@/components/effects/particle-background';
import { AnimatedGradient } from '@/components/effects/animated-gradient';
import { ParallaxSection } from '@/components/effects/parallax-section';
import { GradientMesh } from '@/components/effects/gradient-mesh';
import { AnimatedText } from '@/components/ui/animated-text';
import { GlowButton } from '@/components/ui/glow-button';
import { GlassCard } from '@/components/ui/glass-card';
import { EventList } from '@/components/events/event-list';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { DEMO_EVENTS } from '@/lib/demo-events';

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
      // easeOutQuart
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

/* ─── Page ─── */

export default function HomePage() {
  const previewEvents = DEMO_EVENTS.slice(0, 6);

  return (
    <div className="relative">
      {/* ════════ Hero Section ════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background layers */}
        <ParticleBackground className="z-0" particleCount={90} />
        <AnimatedGradient className="z-[1] opacity-20" />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 z-[2] opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />

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
            Finde Events. Spüre den Vibe. Live.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <GlowButton href="/events" size="lg">
              Events entdecken
            </GlowButton>
            <GlowButton href="/map" variant="secondary" size="lg">
              Karte öffnen
            </GlowButton>
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
          <AnimatedText
            text="So funktioniert's"
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16"
            gradient
            mode="slide-up"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {FEATURES.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <GlassCard glowColor={feature.glow} className="p-8 h-full text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-6 text-purple-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-white/50 leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </ParallaxSection>

      {/* Section divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />

      {/* ════════ Events Preview ════════ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedText
            text="Nächste Events"
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16"
            gradient
            mode="slide-up"
          />

          <EventList events={previewEvents} />

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

      {/* Section divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      {/* ════════ Stats Section ════════ */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {STATS.map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp}>
                <GlassCard glowColor="purple" className="p-8 text-center">
                  <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-white/50 text-lg">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />

      {/* ════════ CTA Section ════════ */}
      <section className="relative py-32 px-4 overflow-hidden">
        <GradientMesh className="absolute inset-0" opacity={0.25} />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <AnimatedText
            text="Bereit für die Nacht?"
            as="h2"
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8"
            gradient
            mode="blur-in"
          />

          <motion.p
            className="text-lg text-white/50 mb-10"
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
            <GlowButton href="/map" size="lg">
              Karte öffnen
            </GlowButton>
          </motion.div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      {/* ════════ Footer ════════ */}
      <footer className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold gradient-text">NightPulse</span>
              <span className="text-white/30 text-sm">Built with NightPulse</span>
            </div>

            {/* Social links placeholders */}
            <div className="flex items-center gap-4">
              <a href="#" className="text-white/30 hover:text-white/60 transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="text-white/30 hover:text-white/60 transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-white/30 hover:text-white/60 transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>

            <p className="text-white/20 text-sm">
              &copy; {new Date().getFullYear()} NightPulse. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
