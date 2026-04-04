import { describe, it, expect } from 'vitest';
import { normalizedEventSchema, venueSchema } from '../validation/schemas';
import { EventCategory } from '../constants/categories';

const validEvent = {
  sourceId: 'evt-123',
  source: 'eventbrite' as const,
  title: 'Techno Night',
  description: 'A great techno event',
  startDate: '2026-04-10T22:00:00.000Z',
  endDate: '2026-04-11T06:00:00.000Z',
  url: 'https://example.com/event/123',
  imageUrl: null,
  venueName: 'Berghain',
  venueAddress: 'Am Wriezener Bhf',
  city: 'Berlin',
  lat: 52.5112,
  lng: 13.4405,
  price: '15 EUR',
  category: EventCategory.TECHNO,
};

describe('normalizedEventSchema', () => {
  it('accepts a valid normalized event', () => {
    const result = normalizedEventSchema.safeParse(validEvent);
    expect(result.success).toBe(true);
  });

  it('rejects invalid latitude (-91)', () => {
    const result = normalizedEventSchema.safeParse({ ...validEvent, lat: -91 });
    expect(result.success).toBe(false);
  });

  it('rejects invalid longitude (181)', () => {
    const result = normalizedEventSchema.safeParse({ ...validEvent, lng: 181 });
    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    const { sourceId: _, ...incomplete } = validEvent;
    const result = normalizedEventSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });
});

describe('venueSchema', () => {
  it('accepts a valid venue', () => {
    const venue = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Berghain',
      address: 'Am Wriezener Bhf',
      city: 'Berlin',
      lat: 52.5112,
      lng: 13.4405,
      website: 'https://berghain.berlin',
      imageUrl: null,
    };
    const result = venueSchema.safeParse(venue);
    expect(result.success).toBe(true);
  });

  it('rejects venue with missing city', () => {
    const venue = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Berghain',
      address: 'Am Wriezener Bhf',
      lat: 52.5112,
      lng: 13.4405,
      website: null,
      imageUrl: null,
    };
    const result = venueSchema.safeParse(venue);
    expect(result.success).toBe(false);
  });
});
