'use client';

import { useCallback, useState } from 'react';
import { DEFAULT_CENTER } from '@nightpulse/shared';

interface Viewport {
  readonly latitude: number;
  readonly longitude: number;
  readonly zoom: number;
}

interface UseMapViewportReturn {
  readonly viewport: Viewport;
  readonly setViewport: (v: Viewport) => void;
  readonly visibleRadius: number;
}

/**
 * Approximate visible radius in km from zoom level.
 * Based on the relation: radius ~ 40075 * cos(lat) / 2^(zoom+1)
 */
function zoomToRadiusKm(zoom: number, latitude: number): number {
  const latRad = (latitude * Math.PI) / 180;
  const metersPerPixel = (40075016.686 * Math.cos(latRad)) / Math.pow(2, zoom + 8);
  // Approximate visible viewport as ~500px radius
  const radiusMeters = metersPerPixel * 500;
  return Math.round(radiusMeters / 1000);
}

export function useMapViewport(): UseMapViewportReturn {
  const [viewport, setViewportState] = useState<Viewport>({
    latitude: DEFAULT_CENTER.lat,
    longitude: DEFAULT_CENTER.lng,
    zoom: 12,
  });

  const setViewport = useCallback((v: Viewport) => {
    setViewportState(v);
  }, []);

  const visibleRadius = zoomToRadiusKm(viewport.zoom, viewport.latitude);

  return { viewport, setViewport, visibleRadius };
}
