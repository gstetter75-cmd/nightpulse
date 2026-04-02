import type { NormalizedEvent } from '@nightpulse/shared';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('dedup');

/**
 * Deduplicate events by their source + sourceId composite key.
 * When duplicates are found, the event with more complete data is kept.
 */
export function deduplicateEvents(
  events: readonly NormalizedEvent[],
): readonly NormalizedEvent[] {
  const seen = new Map<string, NormalizedEvent>();

  for (const event of events) {
    const key = compositeKey(event);
    const existing = seen.get(key);

    if (!existing) {
      seen.set(key, event);
    } else {
      // Keep the event with more complete data
      const winner = completenessScore(event) > completenessScore(existing) ? event : existing;
      seen.set(key, winner);
    }
  }

  const deduplicated = [...seen.values()];
  const removed = events.length - deduplicated.length;

  if (removed > 0) {
    logger.info({ input: events.length, output: deduplicated.length, removed }, 'Deduplication complete');
  }

  return deduplicated;
}

/** Create a composite key from source and sourceId */
function compositeKey(event: NormalizedEvent): string {
  return `${event.source}::${event.sourceId}`;
}

/** Score how complete an event's data is (higher = more complete) */
function completenessScore(event: NormalizedEvent): number {
  let score = 0;

  if (event.title) score++;
  if (event.description) score++;
  if (event.startDate) score++;
  if (event.endDate) score++;
  if (event.url) score++;
  if (event.imageUrl) score++;
  if (event.venueName && event.venueName !== 'Unknown Venue') score++;
  if (event.venueAddress) score++;
  if (event.city) score++;
  if (event.price) score++;
  if (event.category) score++;

  return score;
}
