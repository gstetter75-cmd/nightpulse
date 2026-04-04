'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { CitySwitcher } from '@/components/city/city-switcher';

const NAV_LINKS = [
  { href: '/events', label: 'Events' },
  { href: '/venues', label: 'Venues' },
  { href: '/map', label: 'Map' },
] as const;

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <>
      <motion.header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 navbar-upgraded',
          isScrolled
            ? 'bg-[var(--dark-bg)]/85 backdrop-blur-3xl border-b border-[var(--glass-border)] navbar-scrolled'
            : 'bg-transparent backdrop-blur-sm',
        ].join(' ')}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo + City */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-2xl font-bold gradient-text navbar-logo-neon"
              style={{
                textShadow: '0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(236, 72, 153, 0.2)',
              }}
            >
              NightPulse
            </Link>
            <CitySwitcher />
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group py-1"
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-[2px] rounded-full transition-all duration-400 ease-out"
                  style={{
                    background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                    boxShadow: '0 0 8px rgba(168, 85, 247, 0.6), 0 0 16px rgba(236, 72, 153, 0.3)',
                  }}
                />
              </Link>
            ))}
          </div>

          {/* Mobile: hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
            >
            <motion.span
              className="block w-6 h-0.5 bg-[var(--text-primary)]"
              animate={mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-[var(--text-primary)]"
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-[var(--text-primary)]"
              animate={mobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            />
            </button>
          </div>
        </nav>

        {/* Animated rainbow gradient line at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, #a855f7, #ec4899, #06b6d4, #fbbf24, #a855f7, transparent)',
            backgroundSize: '200% 100%',
            animation: 'navbar-rainbow-flow 4s linear infinite',
            opacity: isScrolled ? 0.7 : 0.3,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Inline keyframes for navbar effects */}
        <style jsx>{`
          @keyframes navbar-rainbow-flow {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .navbar-upgraded {
            animation: navbar-breathing 6s ease-in-out infinite;
          }
          @keyframes navbar-breathing {
            0%, 100% { box-shadow: 0 0 0 transparent; }
            50% { box-shadow: 0 2px 30px rgba(168, 85, 247, 0.06); }
          }
          .navbar-scrolled {
            animation: navbar-breathing-scrolled 6s ease-in-out infinite;
          }
          @keyframes navbar-breathing-scrolled {
            0%, 100% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); }
            50% { box-shadow: 0 4px 30px rgba(168, 85, 247, 0.12); }
          }
          .navbar-logo-neon {
            animation: logo-neon-pulse 3s ease-in-out infinite;
          }
          @keyframes logo-neon-pulse {
            0%, 100% { text-shadow: 0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(236, 72, 153, 0.2); }
            50% { text-shadow: 0 0 14px rgba(168, 85, 247, 0.7), 0 0 28px rgba(168, 85, 247, 0.4), 0 0 50px rgba(236, 72, 153, 0.3); }
          }
        `}</style>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            {/* Panel */}
            <motion.div
              className="absolute top-16 right-0 w-64 bg-[var(--dark-surface)]/95 backdrop-blur-xl border-l border-[var(--glass-border)] h-[calc(100vh-4rem)]"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="flex flex-col p-6 gap-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
