'use client';

import { useCallback, useEffect, useState } from 'react';
import type { DbEvent } from '@nightpulse/shared';
import { DEFAULT_CENTER } from '@nightpulse/shared';
import { useCluster, isCluster, type MapBounds, type ClusterOrPoint } from '../../hooks/use-cluster';
import { ClusterMarker } from './cluster-marker';

interface LiveMapProps {
  readonly events: readonly DbEvent[];
  readonly onMarkerClick?: (event: DbEvent) => void;
  readonly className?: string;
  readonly zoom?: number;
  readonly onZoomChange?: (zoom: number) => void;
}

interface ViewState {
  readonly latitude: number;
  readonly longitude: number;
  readonly zoom: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  TECHNO: '#a855f7',
  HOUSE: '#ec4899',
  HIPHOP: '#f59e0b',
  LATIN: '#ef4444',
  JAZZ: '#3b82f6',
  ROCK: '#6b7280',
  POP: '#06b6d4',
  ELECTRONIC: '#8b5cf6',
  MIXED: '#10b981',
  OTHER: '#64748b',
};

export function LiveMap({ events, onMarkerClick, className = '', zoom: controlledZoom, onZoomChange }: LiveMapProps) {
  const [viewState, setViewState] = useState<ViewState>({
    latitude: DEFAULT_CENTER.lat,
    longitude: DEFAULT_CENTER.lng,
    zoom: controlledZoom ?? 12,
  });
  // Sync controlled zoom from parent
  useEffect(() => {
    if (controlledZoom !== undefined && controlledZoom !== viewState.zoom) {
      setViewState((prev) => ({ ...prev, zoom: controlledZoom }));
    }
  }, [controlledZoom]); // eslint-disable-line react-hooks/exhaustive-deps

  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [MapComponents, setMapComponents] = useState<{
    Map: React.ComponentType<Record<string, unknown>>;
    Marker: React.ComponentType<Record<string, unknown>>;
  } | null>(null);

  const { clusters, getExpansionZoom } = useCluster({
    events: events as DbEvent[],
    zoom: viewState.zoom,
    bounds,
  });

  // Reference to the map instance for flyTo
  const [mapRef, setMapRef] = useState<{ flyTo: (opts: { center: [number, number]; zoom: number }) => void } | null>(null);

  const mapContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && !MapComponents) {
        import('react-map-gl/maplibre').then((mod) => {
          setMapComponents({
            Map: mod.Map as unknown as React.ComponentType<Record<string, unknown>>,
            Marker: mod.Marker as unknown as React.ComponentType<Record<string, unknown>>,
          });
        });
      }
    },
    [MapComponents],
  );

  const handleClusterClick = useCallback(
    (feature: ClusterOrPoint) => {
      if (!isCluster(feature) || !mapRef) return;
      const [lng, lat] = feature.geometry.coordinates;
      const expansionZoom = getExpansionZoom(feature.properties.cluster_id);
      mapRef.flyTo({
        center: [lng, lat],
        zoom: Math.min(expansionZoom, 20),
      });
    },
    [mapRef, getExpansionZoom],
  );

  const handleMove = useCallback(
    (evt: { viewState: ViewState; target?: { getBounds?: () => { getNorth: () => number; getSouth: () => number; getEast: () => number; getWest: () => number } } }) => {
      setViewState(evt.viewState);
      onZoomChange?.(evt.viewState.zoom);

      const map = evt.target;
      if (map?.getBounds) {
        const b = map.getBounds();
        setBounds({
          north: b.getNorth(),
          south: b.getSouth(),
          east: b.getEast(),
          west: b.getWest(),
        });
      }
    },
    [onZoomChange],
  );

  const handleLoad = useCallback(
    (evt: { target?: { getBounds?: () => { getNorth: () => number; getSouth: () => number; getEast: () => number; getWest: () => number } } }) => {
      setMapLoaded(true);
      const map = evt.target;
      if (map?.getBounds) {
        const b = map.getBounds();
        setBounds({
          north: b.getNorth(),
          south: b.getSouth(),
          east: b.getEast(),
          west: b.getWest(),
        });
      }
      // Store map ref for flyTo
      if (map && 'flyTo' in (map as Record<string, unknown>)) {
        setMapRef(map as unknown as { flyTo: (opts: { center: [number, number]; zoom: number }) => void });
      }
    },
    [],
  );

  return (
    <div ref={mapContainerRef} className={`relative w-full h-full ${className}`}>
      {MapComponents ? (
        <MapComponents.Map
          {...(viewState as unknown as Record<string, unknown>)}
          onMove={handleMove as unknown as Record<string, unknown>}
          onLoad={handleLoad as unknown as Record<string, unknown>}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          style={{ width: '100%', height: '100%' }}
        >
          {mapLoaded &&
            clusters.map((feature) => {
              const [lng, lat] = feature.geometry.coordinates;

              if (isCluster(feature)) {
                return (
                  <MapComponents.Marker
                    key={`cluster-${feature.properties.cluster_id}`}
                    latitude={lat}
                    longitude={lng}
                  >
                    <ClusterMarker
                      count={feature.properties.point_count}
                      onClick={() => handleClusterClick(feature)}
                    />
                  </MapComponents.Marker>
                );
              }

              const event = feature.properties.event;
              return (
                <MapComponents.Marker
                  key={event.id}
                  latitude={lat}
                  longitude={lng}
                  onClick={(e: { originalEvent: MouseEvent }) => {
                    e.originalEvent.stopPropagation();
                    onMarkerClick?.(event);
                  }}
                >
                  <div className="relative cursor-pointer group">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: CATEGORY_COLORS[event.category] ?? '#a855f7',
                        animation: 'pulse-ring 2s ease-out infinite',
                        opacity: 0.4,
                      }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white/80 transition-transform group-hover:scale-150"
                      style={{
                        backgroundColor: CATEGORY_COLORS[event.category] ?? '#a855f7',
                        boxShadow: `0 0 12px ${CATEGORY_COLORS[event.category] ?? '#a855f7'}`,
                      }}
                    />
                  </div>
                </MapComponents.Marker>
              );
            })}
        </MapComponents.Map>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[var(--dark-surface)]">
          <div className="text-white/40 text-sm">Karte wird geladen...</div>
        </div>
      )}
    </div>
  );
}
