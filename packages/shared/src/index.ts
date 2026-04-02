// Types
export type {
  EventSource,
  RawEvent,
  NormalizedEvent,
  DbEvent,
  EventChange,
} from './types/event';
export type { Venue } from './types/venue';
export type { Region } from './types/region';

// Constants
export { EventCategory, EVENT_CATEGORIES } from './constants/categories';
export {
  DEFAULT_RADIUS_KM,
  MAX_EVENTS_PER_PAGE,
  REALTIME_CHANNEL,
  DEFAULT_CENTER,
} from './constants/config';

// Client
export { createServiceClient, createBrowserClient } from './client/supabase';

// Validation
export {
  normalizedEventSchema,
  venueSchema,
  regionSchema,
  type ValidatedNormalizedEvent,
  type ValidatedVenue,
  type ValidatedRegion,
} from './validation/schemas';
