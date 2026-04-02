/** Default search radius in kilometers */
export const DEFAULT_RADIUS_KM = 25 as const;

/** Maximum number of events returned per page */
export const MAX_EVENTS_PER_PAGE = 50 as const;

/** Supabase realtime channel name for event changes */
export const REALTIME_CHANNEL = 'event-changes' as const;

/** Default map center coordinates (Berlin) */
export const DEFAULT_CENTER = {
  lat: 52.52,
  lng: 13.405,
} as const;
