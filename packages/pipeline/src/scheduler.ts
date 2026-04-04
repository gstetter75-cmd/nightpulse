import cron, { type ScheduledTask } from 'node-cron';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { NormalizedEvent, Region } from '@nightpulse/shared';
import { BaseSource } from './sources/base-source.js';
import { normalizeEvents } from './normalizer/normalize.js';
import { deduplicateEvents } from './dedup/dedup.js';
import { upsertEvents, type UpsertResult } from './db/upsert.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger('scheduler');

/** Store callback that accepts events and returns insert/update counts */
export type StoreFn = (events: readonly NormalizedEvent[]) => Promise<{ inserted: number; updated: number; errors: readonly Error[] }>;

/**
 * Orchestrates cron-based event pipeline execution.
 * Each registered source gets its own cron job.
 * Errors in one source do not affect others.
 */
export class Scheduler {
  private readonly sources: BaseSource[] = [];
  private readonly tasks: ScheduledTask[] = [];
  private readonly storeFn: StoreFn;
  private running = false;

  constructor(client: SupabaseClient | null, jsonStoreFn?: StoreFn) {
    if (client) {
      // Supabase store
      this.storeFn = (events) => upsertEvents(client, events);
    } else if (jsonStoreFn) {
      // JSON fallback store
      this.storeFn = jsonStoreFn;
    } else {
      throw new Error('Scheduler requires either a Supabase client or a JSON store function');
    }
  }

  /** Register a data source for scheduled fetching */
  registerSource(source: BaseSource): void {
    this.sources.push(source);
    logger.info(
      { source: source.name, schedule: source.cronSchedule },
      'Source registered',
    );
  }

  /** Start all cron jobs for the given regions */
  start(regions: readonly Region[]): void {
    if (this.running) {
      logger.warn('Scheduler is already running');
      return;
    }

    for (const source of this.sources) {
      const task = cron.schedule(source.cronSchedule, () => {
        void this.runPipeline(source, regions);
      });

      this.tasks.push(task);
      logger.info(
        { source: source.name, schedule: source.cronSchedule },
        'Cron job started',
      );
    }

    this.running = true;
    this.registerShutdownHandlers();

    logger.info(
      { sourceCount: this.sources.length, regionCount: regions.length },
      'Scheduler started',
    );

    // Run all sources once immediately on startup
    for (const source of this.sources) {
      void this.runPipeline(source, regions);
    }
  }

  /** Stop all cron jobs gracefully */
  stop(): void {
    if (!this.running) {
      return;
    }

    for (const task of this.tasks) {
      task.stop();
    }

    this.tasks.length = 0;
    this.running = false;

    logger.info('Scheduler stopped');
  }

  /** Execute the full pipeline for a single source across all regions */
  private async runPipeline(
    source: BaseSource,
    regions: readonly Region[],
  ): Promise<void> {
    logger.info({ source: source.name }, 'Pipeline run starting');

    for (const region of regions) {
      try {
        // 1. Fetch raw events
        const rawEvents = await source.fetchEvents(region);
        logger.info(
          { source: source.name, region: region.name, rawCount: rawEvents.length },
          'Events fetched',
        );

        if (rawEvents.length === 0) {
          continue;
        }

        // 2. Normalize
        const normalized = normalizeEvents(rawEvents, source.name);

        // 3. Deduplicate
        const deduplicated = deduplicateEvents(normalized);

        if (deduplicated.length === 0) {
          logger.info(
            { source: source.name, region: region.name },
            'No valid events after normalization and dedup',
          );
          continue;
        }

        // 4. Store events (Supabase or JSON)
        const result = await this.storeFn(deduplicated);
        logger.info(
          {
            source: source.name,
            region: region.name,
            inserted: result.inserted,
            updated: result.updated,
            errors: result.errors.length,
          },
          'Pipeline run completed for region',
        );
      } catch (error: unknown) {
        logger.error(
          { error, source: source.name, region: region.name },
          'Pipeline run failed for region, continuing with next',
        );
      }
    }

    logger.info({ source: source.name }, 'Pipeline run finished');
  }

  /** Register SIGTERM/SIGINT handlers for graceful shutdown */
  private registerShutdownHandlers(): void {
    const shutdown = (signal: string) => {
      logger.info({ signal }, 'Received shutdown signal');
      this.stop();
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }
}
