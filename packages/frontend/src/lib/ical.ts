import type { DbEvent } from '@nightpulse/shared';

/**
 * Format a date string to iCal DTSTART/DTEND format (UTC).
 * Output: 20260404T235900Z
 */
function formatICalDate(dateStr: string): string {
  const d = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

/**
 * Escape special characters for iCal text values.
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generate a unique UID for the iCal event.
 */
function generateUid(eventId: string): string {
  return `${eventId}@nightpulse.app`;
}

/**
 * Generate an iCalendar (.ics) string for a given event.
 */
export function generateICalEvent(event: DbEvent): string {
  const location = [event.venueName, event.venueAddress]
    .filter(Boolean)
    .join(', ');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NightPulse//Event//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${generateUid(event.id)}`,
    `DTSTAMP:${formatICalDate(new Date().toISOString())}`,
    `DTSTART:${formatICalDate(event.startDate)}`,
    `DTEND:${formatICalDate(event.endDate)}`,
    `SUMMARY:${escapeICalText(event.title)}`,
    `LOCATION:${escapeICalText(location)}`,
    `DESCRIPTION:${escapeICalText(event.description || '')}`,
    `URL:${event.url || ''}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}
