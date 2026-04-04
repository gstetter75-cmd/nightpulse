import { describe, it, expect } from 'vitest';
import { normalizeEvents } from '../normalizer/normalize.js';
import { EventCategory } from '@nightpulse/shared';
import type { RawEvent } from '@nightpulse/shared';

const validRaw: RawEvent = {
  sourceId: 'evt-001',
  source: 'eventbrite',
  title: 'Techno Night',
  description: 'A great event',
  startDate: '2026-04-10T22:00:00.000Z',
  endDate: '2026-04-11T06:00:00.000Z',
  url: 'https://example.com/event/001',
  imageUrl: 'https://example.com/img.jpg',
  venueName: 'Berghain',
  venueAddress: 'Am Wriezener Bhf',
  city: 'Berlin',
  lat: 52.5112,
  lng: 13.4405,
  price: '15 EUR',
  category: 'techno',
};

describe('normalizeEvents', () => {
  it('normalizes a valid raw event correctly', () => {
    const result = normalizeEvents([validRaw], 'eventbrite');
    expect(result).toHaveLength(1);
    expect(result[0]!.sourceId).toBe('evt-001');
    expect(result[0]!.title).toBe('Techno Night');
    expect(result[0]!.category).toBe(EventCategory.TECHNO);
  });

  it('filters out events with invalid coordinates', () => {
    const invalid: RawEvent = { ...validRaw, lat: -91, lng: 200 };
    const result = normalizeEvents([invalid], 'eventbrite');
    expect(result).toHaveLength(0);
  });

  it('strips HTML tags from descriptions', () => {
    const withHtml: RawEvent = {
      ...validRaw,
      description: '<p>Hello <b>world</b></p>',
    };
    const result = normalizeEvents([withHtml], 'eventbrite');
    expect(result).toHaveLength(1);
    expect(result[0]!.description).toBe('Hello world');
  });

  it('maps category keywords correctly', () => {
    const testCases: Array<{ input: string; expected: EventCategory }> = [
      { input: 'techno', expected: EventCategory.TECHNO },
      { input: 'hip hop', expected: EventCategory.HIPHOP },
      { input: 'salsa', expected: EventCategory.LATIN },
      { input: 'jazz', expected: EventCategory.JAZZ },
      { input: 'edm', expected: EventCategory.ELECTRONIC },
      { input: 'party', expected: EventCategory.MIXED },
    ];

    for (const { input, expected } of testCases) {
      const raw: RawEvent = { ...validRaw, category: input };
      const result = normalizeEvents([raw], 'eventbrite');
      expect(result).toHaveLength(1);
      expect(result[0]!.category).toBe(expected);
    }
  });

  it('handles ISO 8601 date parsing', () => {
    const raw: RawEvent = {
      ...validRaw,
      startDate: '2026-04-10T22:00:00+02:00',
    };
    const result = normalizeEvents([raw], 'eventbrite');
    expect(result).toHaveLength(1);
    expect(result[0]!.startDate).toBeTruthy();
  });
});
