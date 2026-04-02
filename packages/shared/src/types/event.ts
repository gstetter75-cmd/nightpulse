import type { EventCategory } from '../constants/categories';

/** Supported event data sources */
export type EventSource = 'eventbrite' | 'scraper';

/** Raw event data before normalization - flexible shape from external sources */
export interface RawEvent {
  readonly sourceId: string;
  readonly source: EventSource;
  readonly title: string;
  readonly description?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly url?: string;
  readonly imageUrl?: string;
  readonly venueName?: string;
  readonly venueAddress?: string;
  readonly city?: string;
  readonly lat?: number;
  readonly lng?: number;
  readonly price?: string;
  readonly category?: string;
  readonly [key: string]: unknown;
}

/** Fully typed and validated event after normalization */
export interface NormalizedEvent {
  readonly sourceId: string;
  readonly source: EventSource;
  readonly title: string;
  readonly description: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly url: string;
  readonly imageUrl: string | null;
  readonly venueName: string;
  readonly venueAddress: string;
  readonly city: string;
  readonly lat: number;
  readonly lng: number;
  readonly price: string | null;
  readonly category: EventCategory;
}

/** Event as stored in the database with metadata */
export interface DbEvent extends NormalizedEvent {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** Realtime event change payload */
export interface EventChange {
  readonly type: 'INSERT' | 'UPDATE' | 'DELETE';
  readonly event: DbEvent;
  readonly oldEvent?: DbEvent;
}
