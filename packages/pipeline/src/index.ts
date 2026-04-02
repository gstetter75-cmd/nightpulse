import { createServiceClient } from '@nightpulse/shared';
import type { Region } from '@nightpulse/shared';
import { Scheduler } from './scheduler.js';
import { EventbriteSource } from './sources/eventbrite.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger('main');

/** Required environment variables - fail fast if missing */
const REQUIRED_ENV_VARS = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'EVENTBRITE_API_KEY',
] as const;

function validateEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  const missing: string[] = [];

  for (const key of REQUIRED_ENV_VARS) {
    const value = process.env[key];
    if (!value) {
      missing.push(key);
    } else {
      env[key] = value;
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return env;
}

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

async function main(): Promise<void> {
  try {
    logger.info('NightPulse Pipeline starting...');

    // Validate environment
    const env = validateEnv();
    logger.info('Environment validated');

    // Create Supabase service client
    const supabase = createServiceClient(
      env['SUPABASE_URL']!,
      env['SUPABASE_SERVICE_ROLE_KEY']!,
    );
    logger.info('Supabase client created');

    // Load regions
    const regions = loadRegions();
    logger.info({ regionCount: regions.length, regions: regions.map((r) => r.name) }, 'Regions loaded');

    // Create scheduler and register sources
    const scheduler = new Scheduler(supabase);

    // Register Eventbrite source
    const eventbriteSource = new EventbriteSource();
    scheduler.registerSource(eventbriteSource);

    // Scraper sources can be added via configuration:
    // const scraperSource = new ScraperSource('https://example.com/events', { ... });
    // scheduler.registerSource(scraperSource);

    // Start the scheduler
    scheduler.start(regions);

    logger.info('NightPulse Pipeline running');
  } catch (error: unknown) {
    logger.fatal({ error }, 'Pipeline failed to start');
    process.exit(1);
  }
}

void main();
