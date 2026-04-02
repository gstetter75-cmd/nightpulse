/** Music/event categories for classification */
export enum EventCategory {
  TECHNO = 'TECHNO',
  HOUSE = 'HOUSE',
  HIPHOP = 'HIPHOP',
  LATIN = 'LATIN',
  JAZZ = 'JAZZ',
  ROCK = 'ROCK',
  POP = 'POP',
  ELECTRONIC = 'ELECTRONIC',
  MIXED = 'MIXED',
  OTHER = 'OTHER',
}

/** All valid category values as a readonly array */
export const EVENT_CATEGORIES = Object.values(EventCategory) as readonly EventCategory[];
