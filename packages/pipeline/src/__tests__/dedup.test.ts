import { describe, it, expect } from 'vitest';
import { deduplicateEvents } from '../dedup/dedup.js';
import { EventCategory } from '@nightpulse/shared';
import type { NormalizedEvent } from '@nightpulse/shared';

const makeEvent = (overrides: Partial<NormalizedEvent> = {}): NormalizedEvent => ({
  sourceId: 'evt-001',
  source: 'eventbrite',
  title: 'Techno Night',
  description: 'A great event',
  startDate: '2026-04-10T22:00:00.000Z',
  endDate: '2026-04-11T06:00:00.000Z',
  url: 'https://example.com/event/001',
  imageUrl: null,
  venueName: 'Berghain',
  venueAddress: 'Am Wriezener Bhf',
  city: 'Berlin',
  lat: 52.5112,
  lng: 13.4405,
  price: null,
  category: EventCategory.TECHNO,
  ...overrides,
});

describe('deduplicateEvents', () => {
  it('returns empty array for empty input', () => {
    const result = deduplicateEvents([]);
    expect(result).toEqual([]);
  });

  it('returns same array when no duplicates', () => {
    const events = [
      makeEvent({ sourceId: 'evt-001' }),
      makeEvent({ sourceId: 'evt-002' }),
    ];
    const result = deduplicateEvents(events);
    expect(result).toHaveLength(2);
  });

  it('deduplicates events with same source+sourceId', () => {
    const events = [
      makeEvent({ sourceId: 'evt-001' }),
      makeEvent({ sourceId: 'evt-001' }),
    ];
    const result = deduplicateEvents(events);
    expect(result).toHaveLength(1);
  });

  it('keeps the event with more complete data', () => {
    const sparse = makeEvent({ sourceId: 'evt-001', description: '', imageUrl: null });
    const complete = makeEvent({
      sourceId: 'evt-001',
      description: 'Detailed description',
      imageUrl: 'https://example.com/img.jpg',
    });
    const result = deduplicateEvents([sparse, complete]);
    expect(result).toHaveLength(1);
    expect(result[0]!.description).toBe('Detailed description');
    expect(result[0]!.imageUrl).toBe('https://example.com/img.jpg');
  });
});
