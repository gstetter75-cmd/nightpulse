'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { DbEvent, EventChange } from '@nightpulse/shared';
import { REALTIME_CHANNEL } from '@nightpulse/shared';
import { createClient } from '@/lib/supabase-browser';
import { useToast } from '@/components/ui/toast';

interface UseRealtimeEventsReturn {
  readonly newEventIds: ReadonlySet<string>;
  readonly latestChange: EventChange | null;
}

export function useRealtimeEvents(): UseRealtimeEventsReturn {
  const [newEventIds, setNewEventIds] = useState<ReadonlySet<string>>(new Set());
  const [latestChange, setLatestChange] = useState<EventChange | null>(null);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const { showToast } = useToast();

  const addNewEventId = useCallback(
    (id: string) => {
      setNewEventIds((prev) => new Set([...prev, id]));

      // Auto-remove after 3 seconds
      const timeout = setTimeout(() => {
        setNewEventIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        timeoutsRef.current.delete(id);
      }, 3000);

      timeoutsRef.current.set(id, timeout);
    },
    [],
  );

  useEffect(() => {
    const client = createClient();
    if (!client) return;

    const channel = client
      .channel(REALTIME_CHANNEL)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'events' },
        (payload) => {
          const event = payload.new as DbEvent;
          const change: EventChange = { type: 'INSERT', event };
          setLatestChange(change);
          addNewEventId(event.id);
          showToast(`Neues Event: ${event.title}`, { type: 'info' });
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'events' },
        (payload) => {
          const event = payload.new as DbEvent;
          const oldEvent = payload.old as DbEvent;
          const change: EventChange = { type: 'UPDATE', event, oldEvent };
          setLatestChange(change);
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'events' },
        (payload) => {
          const event = payload.old as DbEvent;
          const change: EventChange = { type: 'DELETE', event };
          setLatestChange(change);
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      for (const timeout of timeoutsRef.current.values()) {
        clearTimeout(timeout);
      }
      timeoutsRef.current.clear();
    };
  }, [addNewEventId, showToast]);

  return { newEventIds, latestChange };
}
