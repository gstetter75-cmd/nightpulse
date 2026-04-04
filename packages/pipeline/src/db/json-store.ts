import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { NormalizedEvent, DbEvent, Venue } from '@nightpulse/shared';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('json-store');

/** Result of a JSON upsert operation */
export interface JsonUpsertResult {
  readonly inserted: number;
  readonly updated: number;
  readonly errors: readonly Error[];
}

/**
 * Read existing events from a JSON file.
 * Returns an empty array if the file does not exist.
 */
async function readExistingEvents(filePath: string): Promise<readonly DbEvent[]> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const parsed: unknown = JSON.parse(content);

    if (!Array.isArray(parsed)) {
      logger.warn({ filePath }, 'Existing JSON is not an array, starting fresh');
      return [];
    }

    return parsed as DbEvent[];
  } catch (error: unknown) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return [];
    }
    logger.warn({ error, filePath }, 'Failed to read existing JSON, starting fresh');
    return [];
  }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error;
}

/** Build a unique key for deduplication */
function eventKey(source: string, sourceId: string): string {
  return `${source}::${sourceId}`;
}

/** Convert a NormalizedEvent to a DbEvent with generated metadata */
function toDbEvent(event: NormalizedEvent, now: string): DbEvent {
  return {
    ...event,
    id: `${event.source}-${event.sourceId}`,
    createdAt: now,
    updatedAt: now,
  };
}

/** Extract unique venues from events */
function extractVenues(events: readonly DbEvent[]): readonly Venue[] {
  const venueMap = new Map<string, Venue>();

  for (const event of events) {
    const key = `${event.venueName}::${event.city}`;
    if (!venueMap.has(key)) {
      venueMap.set(key, {
        id: key.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: event.venueName,
        address: event.venueAddress,
        city: event.city,
        lat: event.lat,
        lng: event.lng,
        website: event.url,
        imageUrl: event.imageUrl,
      });
    }
  }

  return [...venueMap.values()];
}

/**
 * Upsert normalized events to a JSON file.
 * Merges with existing data, deduplicating by source + sourceId.
 * Also generates a venues.json alongside the events file.
 */
export async function upsertEventsToJson(
  events: readonly NormalizedEvent[],
  outputPath: string,
): Promise<JsonUpsertResult> {
  const now = new Date().toISOString();
  let inserted = 0;
  let updated = 0;
  const errors: Error[] = [];

  try {
    // Read existing events
    const existing = await readExistingEvents(outputPath);

    // Build lookup map from existing events
    const eventMap = new Map<string, DbEvent>();
    for (const event of existing) {
      eventMap.set(eventKey(event.source, event.sourceId), event);
    }

    // Merge new events
    for (const event of events) {
      const key = eventKey(event.source, event.sourceId);
      const existingEvent = eventMap.get(key);

      if (existingEvent) {
        // Update: keep original createdAt, update the rest
        eventMap.set(key, {
          ...event,
          id: existingEvent.id,
          createdAt: existingEvent.createdAt,
          updatedAt: now,
        });
        updated++;
      } else {
        eventMap.set(key, toDbEvent(event, now));
        inserted++;
      }
    }

    const mergedEvents = [...eventMap.values()];

    // Ensure output directory exists
    await mkdir(dirname(outputPath), { recursive: true });

    // Write events JSON
    await writeFile(outputPath, JSON.stringify(mergedEvents, null, 2), 'utf-8');
    logger.info({ outputPath, total: mergedEvents.length, inserted, updated }, 'Events written');

    // Write venues JSON
    const venues = extractVenues(mergedEvents);
    const venuesPath = outputPath.replace(/events\.json$/, 'venues.json');
    await writeFile(venuesPath, JSON.stringify(venues, null, 2), 'utf-8');
    logger.info({ venuesPath, venueCount: venues.length }, 'Venues written');
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    errors.push(err);
    logger.error({ error }, 'Failed to write JSON store');
  }

  return { inserted, updated, errors };
}
