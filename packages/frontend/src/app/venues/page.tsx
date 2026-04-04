'use client';

import { motion } from 'framer-motion';
import { AnimatedText } from '@/components/ui/animated-text';
import { PageTransition } from '@/components/layout/page-transition';
import { ParallaxSection } from '@/components/effects/parallax-section';
import { VenueCard } from '@/components/venues/venue-card';
import { staggerContainer } from '@/lib/animations';
import { VENUES, getEventsForVenue } from '@/lib/venues';
import { DEMO_EVENTS } from '@/lib/demo-events';

export default function VenuesPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <ParallaxSection speed={0.4} className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <AnimatedText
            text="Venues"
            as="h1"
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4"
            gradient
            mode="blur-in"
          />
          <p className="text-white/50 text-lg">
            Entdecke Berlins beste Clubs und Locations
          </p>
        </div>
      </ParallaxSection>

      {/* Venue Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {VENUES.map((venue, index) => {
            const venueEvents = getEventsForVenue(venue.name, DEMO_EVENTS);
            return (
              <VenueCard
                key={venue.slug}
                venue={venue}
                eventCount={venueEvents.length}
                index={index}
              />
            );
          })}
        </motion.div>
      </section>
    </PageTransition>
  );
}
