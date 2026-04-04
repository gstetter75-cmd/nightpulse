'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_CENTER } from '@nightpulse/shared';
import { useCityContext } from '@/components/city/city-provider';

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
  const { city } = useCityContext();

  const defaultCenter = useMemo(
    () =>
      city
        ? { lat: city.lat, lng: city.lng }
        : { lat: DEFAULT_CENTER.lat, lng: DEFAULT_CENTER.lng },
    [city],
  );

  const [state, setState] = useState<GeolocationState>({
    lat: defaultCenter.lat,
    lng: defaultCenter.lng,
    loading: true,
    error: null,
  });

  // Update defaults when city changes
  useEffect(() => {
    setState((prev) => {
      // Only update if still at previous default (browser geo hasn't overridden)
      if (prev.error || prev.loading) {
        return { ...prev, lat: defaultCenter.lat, lng: defaultCenter.lng };
      }
      return prev;
    });
  }, [defaultCenter]);

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
          lat: defaultCenter.lat,
          lng: defaultCenter.lng,
          loading: false,
          error: err.message,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, [defaultCenter]);

  useEffect(() => {
    locate();
  }, [locate]);

  return { ...state, refresh: locate };
}
