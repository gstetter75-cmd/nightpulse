import type { SupabaseClient } from '@supabase/supabase-js';
import type { NormalizedEvent } from '@nightpulse/shared';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('upsert');

/** Result of an upsert batch operation */
export interface UpsertResult {
  readonly inserted: number;
  readonly updated: number;
  readonly errors: readonly Error[];
}

/** Batch size for processing events */
const BATCH_SIZE = 50;

/**
 * Upsert normalized events into Supabase.
 * Uses an RPC call per event to handle PostGIS GEOGRAPHY conversion server-side.
 * Processes in batches. Errors on individual events are collected without stopping.
 */
export async function upsertEvents(
  client: SupabaseClient,
  events: readonly NormalizedEvent[],
): Promise<UpsertResult> {
  let inserted = 0;
  let updated = 0;
  const errors: Error[] = [];

  logger.info({ total: events.length }, 'Starting event upsert');

  // Process in batches
  for (let i = 0; i < events.length; i += BATCH_SIZE) {
    const batch = events.slice(i, i + BATCH_SIZE);
    const batchResults = await processBatch(client, batch);

    inserted += batchResults.inserted;
    updated += batchResults.updated;
    errors.push(...batchResults.errors);

    logger.debug(
      { batchIndex: Math.floor(i / BATCH_SIZE), batchSize: batch.length },
      'Batch processed',
    );
  }

  logger.info({ inserted, updated, errorCount: errors.length }, 'Upsert complete');

  return { inserted, updated, errors };
}

async function processBatch(
  client: SupabaseClient,
  events: readonly NormalizedEvent[],
): Promise<{ inserted: number; updated: number; errors: Error[] }> {
  let inserted = 0;
  let updated = 0;
  const errors: Error[] = [];

  // Process events concurrently within a batch
  const results = await Promise.allSettled(
    events.map((event) => upsertSingleEvent(client, event)),
  );

  for (const [index, result] of results.entries()) {
    if (result.status === 'fulfilled') {
      if (result.value === 'inserted') {
        inserted++;
      } else {
        updated++;
      }
    } else {
      const event = events[index];
      const error = new Error(
        `Failed to upsert event ${event?.sourceId ?? 'unknown'}: ${String(result.reason)}`,
      );
      errors.push(error);
      logger.warn(
        { sourceId: event?.sourceId, error: result.reason },
        'Failed to upsert individual event',
      );
    }
  }

  return { inserted, updated, errors };
}

async function upsertSingleEvent(
  client: SupabaseClient,
  event: NormalizedEvent,
): Promise<'inserted' | 'updated'> {
  const { data, error } = await client.rpc('upsert_event', {
    p_source_id: event.sourceId,
    p_source: event.source,
    p_title: event.title,
    p_description: event.description,
    p_start_date: event.startDate,
    p_end_date: event.endDate,
    p_url: event.url,
    p_image_url: event.imageUrl,
    p_venue_name: event.venueName,
    p_venue_address: event.venueAddress,
    p_city: event.city,
    p_lat: event.lat,
    p_lng: event.lng,
    p_price: event.price,
    p_category: event.category,
  });

  if (error) {
    throw new Error(`Supabase RPC error: ${error.message}`);
  }

  // The RPC function returns 'inserted' or 'updated'
  return (data as string) === 'inserted' ? 'inserted' : 'updated';
}
