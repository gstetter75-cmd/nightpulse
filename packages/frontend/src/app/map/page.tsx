'use client';

import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import type { DbEvent, EventCategory } from '@nightpulse/shared';
import { EVENT_CATEGORIES } from '@nightpulse/shared';
import { MapControls } from '@/components/map/map-controls';
import { MapPopup } from '@/components/map/map-popup';
import { PageTransition } from '@/components/layout/page-transition';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useEvents } from '@/hooks/use-events';
import { useRealtimeEvents } from '@/hooks/use-realtime-events';
import { useCityContext } from '@/components/city/city-provider';

// Dynamic import - maps need browser APIs
const LiveMap = dynamic(
  () => import('@/components/map/live-map').then((mod) => ({ default: mod.LiveMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[var(--dark-surface)]">
        <div className="text-white/40 animate-pulse">Karte wird geladen...</div>
      </div>
    ),
  },
);

export default function MapPage() {
  const { city } = useCityContext();
  const { lat, lng, refresh: refreshLocation } = useGeolocation();
  const mapLat = city?.lat ?? lat;
  const mapLng = city?.lng ?? lng;
  const { events } = useEvents({ lat: mapLat, lng: mapLng, radiusKm: 50, city: city?.name });
  useRealtimeEvents();

  const [selectedEvent, setSelectedEvent] = useState<DbEvent | null>(null);
  const [categoryFilters, setCategoryFilters] = useState<ReadonlySet<EventCategory>>(
    new Set(EVENT_CATEGORIES),
  );
  const [zoom, setZoom] = useState(12);

  const filteredEvents = events.filter((e) => categoryFilters.has(e.category));

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 1, 18));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 1, 1));
  }, []);

  return (
    <PageTransition className="h-screen pt-16">
      <div className="relative w-full h-full">
        {/* Map */}
        <LiveMap
          events={filteredEvents}
          onMarkerClick={setSelectedEvent}
          zoom={zoom}
          onZoomChange={setZoom}
          centerLat={mapLat}
          centerLng={mapLng}
          className="w-full h-full"
        />

        {/* Controls */}
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onLocate={refreshLocation}
          filters={categoryFilters}
          onFilterChange={setCategoryFilters}
        />

        {/* Popup */}
        <AnimatePresence>
          {selectedEvent && (
            <MapPopup
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
