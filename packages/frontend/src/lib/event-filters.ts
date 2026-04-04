import type { DbEvent } from '@nightpulse/shared';

/**
 * Returns events whose startDate falls within the next `hoursAhead` hours.
 * Events are sorted by startDate ascending.
 */
export function getEventsForTimeRange(
  events: readonly DbEvent[],
  hoursAhead: number,
): readonly DbEvent[] {
  const now = new Date();
  const cutoff = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

  return [...events]
    .filter((e) => {
      const start = new Date(e.startDate);
      // Include events that start between now and the cutoff,
      // OR events that already started but haven't ended yet
      const end = new Date(e.endDate);
      return (start >= now && start <= cutoff) || (start <= now && end >= now);
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

/**
 * Returns events for the upcoming Saturday and Sunday.
 * If today is already Saturday/Sunday, returns events for today and/or the remaining weekend day.
 */
export function getWeekendEvents(events: readonly DbEvent[]): readonly DbEvent[] {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday

  // Calculate next Saturday
  const daysUntilSaturday = dayOfWeek === 6 ? 0 : (6 - dayOfWeek);
  const saturday = new Date(now);
  saturday.setDate(saturday.getDate() + daysUntilSaturday);
  saturday.setHours(0, 0, 0, 0);

  // Sunday is the day after Saturday
  const sunday = new Date(saturday);
  sunday.setDate(sunday.getDate() + 1);

  // End of Sunday
  const endOfSunday = new Date(sunday);
  endOfSunday.setHours(23, 59, 59, 999);

  return [...events]
    .filter((e) => {
      const start = new Date(e.startDate);
      return start >= saturday && start <= endOfSunday;
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

/**
 * Returns featured events: picks events with images from different categories.
 * Prioritizes events with images and diverse categories.
 */
export function getFeaturedEvents(
  events: readonly DbEvent[],
  count: number,
): readonly DbEvent[] {
  // Only events with images
  const withImages = events.filter((e) => e.imageUrl !== null && e.imageUrl !== '');

  if (withImages.length <= count) {
    return withImages;
  }

  // Pick from different categories for diversity
  const picked: DbEvent[] = [];
  const usedCategories = new Set<string>();

  // First pass: one per category
  for (const event of withImages) {
    if (picked.length >= count) break;
    if (!usedCategories.has(event.category)) {
      usedCategories.add(event.category);
      picked.push(event);
    }
  }

  // Second pass: fill remaining slots
  for (const event of withImages) {
    if (picked.length >= count) break;
    if (!picked.includes(event)) {
      picked.push(event);
    }
  }

  return picked;
}
