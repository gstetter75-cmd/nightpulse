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

export function useEvents(filters: UseEventsFilters = {}): UseEventsReturn {
  const [events, setEvents] = useState<readonly DbEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    const client = createClient();

    // Fallback to demo data if Supabase is not configured
    if (!client) {
      let filtered = [...DEMO_EVENTS];

      if (filters.category) {
        filtered = filtered.filter((e) => e.category === filters.category);
      }

      if (filters.fromDate) {
        filtered = filtered.filter((e) => e.startDate >= filters.fromDate!);
      }

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
      // Fallback to demo events
      setEvents(DEMO_EVENTS);
    } finally {
      setLoading(false);
    }
  }, [filters.lat, filters.lng, filters.radiusKm, filters.category, filters.fromDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}
