import type { Region, RawEvent } from '@nightpulse/shared';
import { BaseSource } from './base-source.js';
import { createLogger } from '../utils/logger.js';
import { withRetry } from '../utils/retry.js';

const logger = createLogger('eventbrite');

/** Shape of a single event in the Eventbrite API response */
interface EventbriteEvent {
  readonly id: string;
  readonly name?: { readonly text?: string };
  readonly description?: { readonly text?: string };
  readonly start?: { readonly utc?: string };
  readonly end?: { readonly utc?: string };
  readonly url?: string;
  readonly logo?: { readonly url?: string };
  readonly venue?: {
    readonly name?: string;
    readonly address?: {
      readonly localized_address_display?: string;
      readonly city?: string;
      readonly latitude?: string;
      readonly longitude?: string;
    };
  };
  readonly ticket_availability?: {
    readonly minimum_ticket_price?: { readonly display?: string };
  };
  readonly category?: { readonly name?: string };
}

/** Shape of the Eventbrite /events/search/ response */
interface EventbriteSearchResponse {
  readonly events: readonly EventbriteEvent[];
  readonly pagination: {
    readonly page_number: number;
    readonly page_count: number;
    readonly has_more_items: boolean;
  };
}

/** Minimum interval between API requests in milliseconds */
const RATE_LIMIT_INTERVAL_MS = 500;

/**
 * Fetches events from the Eventbrite API v3.
 * Uses exponential backoff retries and rate limiting.
 */
export class EventbriteSource extends BaseSource {
  readonly name = 'eventbrite' as const;
  readonly cronSchedule = '*/15 * * * *';

  private readonly apiKey: string;
  private lastRequestTime = 0;

  constructor() {
    super();
    const key = process.env['EVENTBRITE_API_KEY'];
    if (!key) {
      throw new Error('EVENTBRITE_API_KEY environment variable is required');
    }
    this.apiKey = key;
  }

  async fetchEvents(region: Region): Promise<readonly RawEvent[]> {
    logger.info({ region: region.name }, 'Fetching events from Eventbrite');

    const allEvents: RawEvent[] = [];
    let page = 1;
    let hasMore = true;

    try {
      while (hasMore) {
        const response = await this.fetchPage(region, page);
        const mapped = response.events.map((event) => this.mapToRawEvent(event));
        allEvents.push(...mapped);

        hasMore = response.pagination.has_more_items;
        page++;

        // Cap pages to avoid runaway fetching
        if (page > 10) {
          logger.warn({ region: region.name }, 'Reached max page limit (10)');
          break;
        }
      }
    } catch (error: unknown) {
      logger.error({ error, region: region.name }, 'Failed to fetch Eventbrite events');
      throw error;
    }

    logger.info({ count: allEvents.length, region: region.name }, 'Fetched Eventbrite events');
    return allEvents;
  }

  private async fetchPage(region: Region, page: number): Promise<EventbriteSearchResponse> {
    await this.respectRateLimit();

    const params = new URLSearchParams({
      'location.latitude': String(region.centerLat),
      'location.longitude': String(region.centerLng),
      'location.within': `${region.radiusKm}km`,
      'expand': 'venue,ticket_availability,category',
      'page': String(page),
    });

    const url = `https://www.eventbriteapi.com/v3/events/search/?${params.toString()}`;

    return withRetry(
      async () => {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Accept': 'application/json',
          },
        });

        if (response.status === 429) {
          throw new Error('Eventbrite rate limit exceeded');
        }

        if (!response.ok) {
          throw new Error(`Eventbrite API error: ${response.status} ${response.statusText}`);
        }

        return (await response.json()) as EventbriteSearchResponse;
      },
      { maxAttempts: 3, baseDelayMs: 2000 },
    );
  }

  private async respectRateLimit(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < RATE_LIMIT_INTERVAL_MS) {
      await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_INTERVAL_MS - elapsed));
    }
    this.lastRequestTime = Date.now();
  }

  private mapToRawEvent(event: EventbriteEvent): RawEvent {
    return {
      sourceId: event.id,
      source: 'eventbrite',
      title: event.name?.text ?? '',
      description: event.description?.text,
      startDate: event.start?.utc,
      endDate: event.end?.utc,
      url: event.url,
      imageUrl: event.logo?.url,
      venueName: event.venue?.name,
      venueAddress: event.venue?.address?.localized_address_display,
      city: event.venue?.address?.city,
      lat: event.venue?.address?.latitude
        ? Number(event.venue.address.latitude)
        : undefined,
      lng: event.venue?.address?.longitude
        ? Number(event.venue.address.longitude)
        : undefined,
      price: event.ticket_availability?.minimum_ticket_price?.display,
      category: event.category?.name,
    };
  }
}
