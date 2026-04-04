'use client';

import { useCallback, useEffect, useState } from 'react';
import type { DbEvent, EventCategory } from '@nightpulse/shared';
import { createClient } from '@/lib/supabase-browser';
import { DEMO_EVENTS } from '@/lib/demo-events';

interface UseEventsFilters {
  readonly lat?: number;
  readonly lng?: number;
  readonly radiusKm?: number;
  readonly category?: EventCategory | null;
  readonly fromDate?: string;
}

interface UseEventsReturn {
  readonly events: readonly DbEvent[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly refetch: () => void;
}

/** Haversine distance in km between two lat/lng points */
function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Filter events client-side (used for JSON fallback and demo mode) */
function filterEventsClientSide(
  events: readonly DbEvent[],
  filters: UseEventsFilters,
): readonly DbEvent[] {
  let filtered = [...events];

  if (filters.category) {
    filtered = filtered.filter((e) => e.category === filters.category);
  }

  if (filters.fromDate) {
    filtered = filtered.filter((e) => e.startDate >= filters.fromDate!);
  }

  if (filters.lat != null && filters.lng != null && filters.radiusKm != null) {
    const { lat, lng, radiusKm } = filters;
    filtered = filtered.filter(
      (e) => haversineKm(lat, lng, e.lat, e.lng) <= radiusKm,
    );
  }

  return filtered;
}

/** Try to fetch events from the static JSON file */
async function fetchJsonEvents(): Promise<readonly DbEvent[] | null> {
  try {
    const response = await fetch('/data/events.json');
    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (!Array.isArray(data)) return null;
    return data as DbEvent[];
  } catch {
    return null;
  }
}

export function useEvents(filters: UseEventsFilters = {}): UseEventsReturn {
  const [events, setEvents] = useState<readonly DbEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    const client = createClient();

    // Fallback path: no Supabase configured
    if (!client) {
      // Try JSON file first, then demo events
      const jsonEvents = await fetchJsonEvents();
      const source = jsonEvents ?? DEMO_EVENTS;
      const filtered = filterEventsClientSide(source, filters);
      setEvents(filtered);
      setLoading(false);
      return;
    }

    try {
      const { data, error: rpcError } = await client.rpc('find_events_in_radius', {
        p_lat: filters.lat ?? 52.52,
        p_lng: filters.lng ?? 13.405,
        p_radius_km: filters.radiusKm ?? 25,
        p_category: filters.category ?? null,
        p_from_date: filters.fromDate ?? null,
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      setEvents(data ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch events';
      setError(message);

      // Fallback: try JSON file, then demo events
      const jsonEvents = await fetchJsonEvents();
      const source = jsonEvents ?? DEMO_EVENTS;
      setEvents(filterEventsClientSide(source, filters));
    } finally {
      setLoading(false);
    }
  }, [filters.lat, filters.lng, filters.radiusKm, filters.category, filters.fromDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}
