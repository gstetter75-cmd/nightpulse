'use client';

import { useCallback, useState } from 'react';

interface MiniMapProps {
  readonly lat: number;
  readonly lng: number;
  readonly venueName: string;
}

export function MiniMap({ lat, lng, venueName }: MiniMapProps) {
  const [MapComponents, setMapComponents] = useState<{
    Map: React.ComponentType<Record<string, unknown>>;
    Marker: React.ComponentType<Record<string, unknown>>;
  } | null>(null);

  const containerRef = useCallback(
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

  return (
    <div ref={containerRef} className="w-full h-full">
      {MapComponents ? (
        <MapComponents.Map
          latitude={lat}
          longitude={lng}
          zoom={15}
          interactive={false}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
        >
          <MapComponents.Marker latitude={lat} longitude={lng}>
            <div className="relative" title={venueName}>
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: '#a855f7',
                  animation: 'pulse-ring 2s ease-out infinite',
                  opacity: 0.4,
                }}
              />
              <div
                className="w-4 h-4 rounded-full border-2 border-white/80"
                style={{
                  backgroundColor: '#a855f7',
                  boxShadow: '0 0 16px #a855f7, 0 0 32px #a855f780',
                }}
              />
            </div>
          </MapComponents.Marker>
        </MapComponents.Map>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-white/5">
          <div className="text-white/40 text-sm animate-pulse">Karte wird geladen...</div>
        </div>
      )}
    </div>
  );
}
