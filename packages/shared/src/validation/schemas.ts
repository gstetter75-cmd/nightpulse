import { z } from 'zod';
import { EventCategory } from '../constants/categories';

/** Latitude: -90 to 90 */
const latSchema = z.number().min(-90).max(90);

/** Longitude: -180 to 180 */
const lngSchema = z.number().min(-180).max(180);

/** ISO 8601 datetime string */
const isoDateSchema = z.string().datetime({ offset: true });

/** Zod schema for NormalizedEvent */
export const normalizedEventSchema = z.object({
  sourceId: z.string().min(1),
  source: z.enum(['eventbrite', 'scraper']),
  title: z.string().min(1).max(500),
  description: z.string(),
  startDate: isoDateSchema,
  endDate: isoDateSchema,
  url: z.string().url(),
  imageUrl: z.string().url().nullable(),
  venueName: z.string().min(1),
  venueAddress: z.string().min(1),
  city: z.string().min(1),
  lat: latSchema,
  lng: lngSchema,
  price: z.string().nullable(),
  category: z.nativeEnum(EventCategory),
});

/** Zod schema for Venue */
export const venueSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(300),
  address: z.string().min(1),
  city: z.string().min(1),
  lat: latSchema,
  lng: lngSchema,
  website: z.string().url().nullable(),
  imageUrl: z.string().url().nullable(),
});

/** Zod schema for Region */
export const regionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  centerLat: latSchema,
  centerLng: lngSchema,
  radiusKm: z.number().positive().max(500),
});

/** Inferred types from schemas (useful for runtime-validated data) */
export type ValidatedNormalizedEvent = z.infer<typeof normalizedEventSchema>;
export type ValidatedVenue = z.infer<typeof venueSchema>;
export type ValidatedRegion = z.infer<typeof regionSchema>;
