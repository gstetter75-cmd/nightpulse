import { createServiceClient } from '@nightpulse/shared';
import type { Region } from '@nightpulse/shared';
import { Scheduler } from './scheduler.js';
import { EventbriteSource } from './sources/eventbrite.js';
import { createLogger } from './utils/logger.js';
import { upsertEventsToJson } from './db/json-store.js';

const logger = createLogger('main');

/** Default JSON output path relative to pipeline package */
const DEFAULT_JSON_OUTPUT = new URL(
  '../../frontend/public/data/events.json',
  import.meta.url,
).pathname;

function loadRegions(): readonly Region[] {
  // Default regions - can be extended via config or database
  return [
    {
      id: 'berlin',
      name: 'Berlin',
      centerLat: 52.52,
      centerLng: 13.405,
      radiusKm: 25,
    },
  ] as const;
}

/** Determine pipeline storage mode based on environment */
function resolveStorageMode(): { mode: 'supabase'; url: string; key: string } | { mode: 'json'; outputPath: string } {
  const supabaseUrl = process.env['SUPABASE_URL'];
  const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (supabaseUrl && supabaseKey) {
    return { mode: 'supabase', url: supabaseUrl, key: supabaseKey };
  }

  const outputPath = process.env['JSON_OUTPUT_PATH'] ?? DEFAULT_JSON_OUTPUT;
  return { mode: 'json', outputPath };
}

async function main(): Promise<void> {
  try {
    logger.info('NightPulse Pipeline starting...');

    const storage = resolveStorageMode();
    logger.info({ mode: storage.mode }, 'Storage mode resolved');

    // Load regions
    const regions = loadRegions();
    logger.info({ regionCount: regions.length, regions: regions.map((r) => r.name) }, 'Regions loaded');

    if (storage.mode === 'supabase') {
      // Supabase mode: validate Eventbrite key and use cron scheduler
      const eventbriteKey = process.env['EVENTBRITE_API_KEY'];
      if (!eventbriteKey) {
        throw new Error('Missing required environment variable: EVENTBRITE_API_KEY');
      }

      const supabase = createServiceClient(storage.url, storage.key);
      logger.info('Supabase client created');

      const scheduler = new Scheduler(supabase);
      const eventbriteSource = new EventbriteSource();
      scheduler.registerSource(eventbriteSource);
      scheduler.start(regions);

      logger.info('NightPulse Pipeline running (Supabase mode)');
    } else {
      // JSON mode: use JSON store callback with scheduler
      logger.info({ outputPath: storage.outputPath }, 'JSON fallback mode active');

      const jsonStoreFn = async (events: Parameters<typeof upsertEventsToJson>[0]) =>
        upsertEventsToJson(events, storage.outputPath);

      const scheduler = new Scheduler(null, jsonStoreFn);

      // Only register Eventbrite if API key is available
      const eventbriteKey = process.env['EVENTBRITE_API_KEY'];
      if (eventbriteKey) {
        const eventbriteSource = new EventbriteSource();
        scheduler.registerSource(eventbriteSource);
      } else {
        logger.warn('No EVENTBRITE_API_KEY set. No sources registered.');
      }

      scheduler.start(regions);
      logger.info('NightPulse Pipeline running (JSON fallback mode)');
    }
  } catch (error: unknown) {
    logger.fatal({ error }, 'Pipeline failed to start');
    process.exit(1);
  }
}

void main();
