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
    description: 'Echtzeit Event-Discovery. Sobald ein neues Event veroeffentlicht wird, siehst du es hier.',
    glow: 'purple' as const,
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: 'Interaktive Karte',
    description: 'Finde Events in deiner Naehe mit unserer Live-Karte. Filter nach Genre, Distanz und mehr.',
    glow: 'pink' as const,
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Immer aktuell',
    description: 'Automatische Updates durch Realtime-Sync. Kein Refresh noetig - alles passiert live.',
    glow: 'cyan' as const,
  },
] as const;

const STATS = [
  { value: 1247, suffix: '', label: 'Events' },
  { value: 89, suffix: '', label: 'Staedte' },
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
            Finde Events. Spuere den Vibe. Live.
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
              Karte oeffnen
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
            <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>

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

      {/* ════════ Events Preview ════════ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedText
            text="Naechste Events"
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

      {/* ════════ CTA Section ════════ */}
      <section className="relative py-32 px-4 overflow-hidden">
        <GradientMesh className="absolute inset-0" opacity={0.25} />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <AnimatedText
            text="Bereit fuer die Nacht?"
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
              Karte oeffnen
            </GlowButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
