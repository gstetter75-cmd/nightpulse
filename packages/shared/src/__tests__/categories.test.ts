import { describe, it, expect } from 'vitest';
import { EventCategory, EVENT_CATEGORIES } from '../constants/categories';

describe('EventCategory', () => {
  it('has all expected category values defined', () => {
    expect(EventCategory.TECHNO).toBe('TECHNO');
    expect(EventCategory.HOUSE).toBe('HOUSE');
    expect(EventCategory.HIPHOP).toBe('HIPHOP');
    expect(EventCategory.LATIN).toBe('LATIN');
    expect(EventCategory.JAZZ).toBe('JAZZ');
    expect(EventCategory.ROCK).toBe('ROCK');
    expect(EventCategory.POP).toBe('POP');
    expect(EventCategory.ELECTRONIC).toBe('ELECTRONIC');
    expect(EventCategory.MIXED).toBe('MIXED');
    expect(EventCategory.OTHER).toBe('OTHER');
  });

  it('EVENT_CATEGORIES array matches enum values', () => {
    const enumValues = Object.values(EventCategory);
    expect(EVENT_CATEGORIES).toEqual(enumValues);
    expect(EVENT_CATEGORIES).toHaveLength(enumValues.length);
  });
});
