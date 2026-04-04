'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { type City, getCityBySlug } from '@/lib/cities';

const STORAGE_KEY = 'nightpulse-city';

interface CityContextValue {
  readonly city: City | null;
  readonly setCity: (city: City) => void;
  readonly clearCity: () => void;
  readonly isLoading: boolean;
}

const CityContext = createContext<CityContextValue | null>(null);

export function CityProvider({ children }: { readonly children: ReactNode }) {
  const [city, setCityState] = useState<City | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = getCityBySlug(stored);
        if (parsed) {
          setCityState(parsed);
        }
      }
    } catch {
      // localStorage not available
    }
    setIsLoading(false);
  }, []);

  const setCity = useCallback((newCity: City) => {
    setCityState(newCity);
    try {
      localStorage.setItem(STORAGE_KEY, newCity.slug);
    } catch {
      // localStorage not available
    }
  }, []);

  const clearCity = useCallback(() => {
    setCityState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage not available
    }
  }, []);

  const value = useMemo(
    () => ({ city, setCity, clearCity, isLoading }),
    [city, setCity, clearCity, isLoading],
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCityContext(): CityContextValue {
  const ctx = useContext(CityContext);
  if (!ctx) {
    throw new Error('useCityContext must be used within a CityProvider');
  }
  return ctx;
}
