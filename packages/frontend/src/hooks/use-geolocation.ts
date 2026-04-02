'use client';

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_CENTER } from '@nightpulse/shared';

interface GeolocationState {
  readonly lat: number;
  readonly lng: number;
  readonly loading: boolean;
  readonly error: string | null;
}

interface UseGeolocationReturn extends GeolocationState {
  readonly refresh: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>({
    lat: DEFAULT_CENTER.lat,
    lng: DEFAULT_CENTER.lng,
    loading: true,
    error: null,
  });

  const locate = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported',
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (err) => {
        setState({
          lat: DEFAULT_CENTER.lat,
          lng: DEFAULT_CENTER.lng,
          loading: false,
          error: err.message,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  useEffect(() => {
    locate();
  }, [locate]);

  return { ...state, refresh: locate };
}
