import {
  EventCategory,
  normalizedEventSchema,
  type RawEvent,
  type NormalizedEvent,
} from '@nightpulse/shared';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('normalizer');

/** Mapping from common freetext category terms to EventCategory */
const CATEGORY_MAP: ReadonlyMap<string, EventCategory> = new Map([
  ['techno', EventCategory.TECHNO],
  ['tech-house', EventCategory.TECHNO],
  ['house', EventCategory.HOUSE],
  ['deep house', EventCategory.HOUSE],
  ['hip hop', EventCategory.HIPHOP],
  ['hiphop', EventCategory.HIPHOP],
  ['hip-hop', EventCategory.HIPHOP],
  ['rap', EventCategory.HIPHOP],
  ['latin', EventCategory.LATIN],
  ['salsa', EventCategory.LATIN],
  ['reggaeton', EventCategory.LATIN],
  ['bachata', EventCategory.LATIN],
  ['jazz', EventCategory.JAZZ],
  ['blues', EventCategory.JAZZ],
  ['rock', EventCategory.ROCK],
  ['indie', EventCategory.ROCK],
  ['punk', EventCategory.ROCK],
  ['metal', EventCategory.ROCK],
  ['pop', EventCategory.POP],
  ['electronic', EventCategory.ELECTRONIC],
  ['edm', EventCategory.ELECTRONIC],
  ['drum and bass', EventCategory.ELECTRONIC],
  ['dnb', EventCategory.ELECTRONIC],
  ['trance', EventCategory.ELECTRONIC],
  ['mixed', EventCategory.MIXED],
  ['party', EventCategory.MIXED],
  ['club', EventCategory.MIXED],
  ['clubnight', EventCategory.MIXED],
]);

/** Regex to strip HTML tags from strings */
const HTML_TAG_REGEX = /<[^>]*>/g;

/**
 * Normalize an array of raw events into validated NormalizedEvent objects.
 * Invalid events are logged and skipped (not thrown).
 */
export function normalizeEvents(
  raws: readonly RawEvent[],
  source: string,
): readonly NormalizedEvent[] {
  const results: NormalizedEvent[] = [];

  for (const raw of raws) {
    try {
      const normalized = normalizeSingle(raw);
      if (normalized !== null) {
        results.push(normalized);
      }
    } catch (error: unknown) {
      logger.warn(
        { error, sourceId: raw.sourceId, source },
        'Failed to normalize event, skipping',
      );
    }
  }

  logger.info({ input: raws.length, output: results.length, source }, 'Normalization complete');
  return results;
}

function normalizeSingle(raw: RawEvent): NormalizedEvent | null {
  // Require minimum fields
  if (!raw.title || !raw.sourceId) {
    logger.debug({ sourceId: raw.sourceId }, 'Skipping event with missing title or sourceId');
    return null;
  }

  const startDate = normalizeDate(raw.startDate);
  const endDate = normalizeDate(raw.endDate) ?? startDate;

  if (!startDate) {
    logger.debug({ sourceId: raw.sourceId }, 'Skipping event with unparsable start date');
    return null;
  }

  const lat = raw.lat;
  const lng = raw.lng;

  if (!isValidCoordinate(lat, lng)) {
    logger.debug({ sourceId: raw.sourceId, lat, lng }, 'Skipping event with invalid coordinates');
    return null;
  }

  const candidate = {
    sourceId: raw.sourceId,
    source: raw.source,
    title: stripHtml(raw.title).slice(0, 500),
    description: stripHtml(raw.description ?? ''),
    startDate,
    endDate: endDate!,
    url: raw.url ?? '',
    imageUrl: raw.imageUrl ?? null,
    venueName: stripHtml(raw.venueName ?? 'Unknown Venue'),
    venueAddress: stripHtml(raw.venueAddress ?? ''),
    city: stripHtml(raw.city ?? ''),
    lat: lat!,
    lng: lng!,
    price: extractPrice(raw.price),
    category: mapCategory(raw.category),
  };

  // Validate with Zod schema
  const parsed = normalizedEventSchema.safeParse(candidate);
  if (!parsed.success) {
    logger.debug(
      { sourceId: raw.sourceId, errors: parsed.error.flatten() },
      'Event failed schema validation',
    );
    return null;
  }

  return parsed.data as NormalizedEvent;
}

/** Attempt to parse a date string into ISO 8601 with timezone offset */
function normalizeDate(dateStr: string | undefined): string | null {
  if (!dateStr) {
    return null;
  }

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString();
  } catch {
    return null;
  }
}

/** Validate latitude and longitude ranges */
function isValidCoordinate(lat: number | undefined, lng: number | undefined): boolean {
  if (lat === undefined || lng === undefined) {
    return false;
  }
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/** Remove HTML tags from a string */
function stripHtml(text: string): string {
  return text.replace(HTML_TAG_REGEX, '').trim();
}

/** Extract a cleaned price string or return null */
function extractPrice(rawPrice: string | undefined): string | null {
  if (!rawPrice) {
    return null;
  }

  const cleaned = rawPrice.trim();
  if (!cleaned || cleaned.toLowerCase() === 'free' || cleaned === '0') {
    return 'Free';
  }

  return cleaned;
}

/** Map freetext category to EventCategory enum */
function mapCategory(rawCategory: string | undefined): EventCategory {
  if (!rawCategory) {
    return EventCategory.OTHER;
  }

  const lower = rawCategory.toLowerCase().trim();

  // Direct match
  const direct = CATEGORY_MAP.get(lower);
  if (direct) {
    return direct;
  }

  // Partial match: check if any key is contained in the category string
  for (const [key, value] of CATEGORY_MAP) {
    if (lower.includes(key)) {
      return value;
    }
  }

  return EventCategory.OTHER;
}
