import type { Region, RawEvent } from '@nightpulse/shared';

/**
 * Abstract base class for all event data sources.
 * Each source provides a cron schedule and a method to fetch raw events.
 */
export abstract class BaseSource {
  /** Human-readable name of this source */
  abstract readonly name: string;

  /** Cron expression controlling how often this source is polled */
  abstract readonly cronSchedule: string;

  /**
   * Fetch raw events for the given region.
   * Implementations must handle their own rate limiting and error recovery.
   */
  abstract fetchEvents(region: Region): Promise<readonly RawEvent[]>;
}
