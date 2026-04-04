import { EventCategory } from '@nightpulse/shared';
import type { NormalizedEvent } from '@nightpulse/shared';
import { upsertEventsToJson } from './db/json-store.js';

/** Venue definition with realistic Berlin coordinates */
interface VenueDef {
  readonly name: string;
  readonly address: string;
  readonly lat: number;
  readonly lng: number;
  readonly website: string;
}

const VENUES: readonly VenueDef[] = [
  { name: 'Berghain', address: 'Am Wriezener Bhf, 10243 Berlin', lat: 52.5112, lng: 13.4428, website: 'https://berghain.berlin' },
  { name: 'Watergate', address: 'Falckensteinstr. 49a, 10997 Berlin', lat: 52.5015, lng: 13.4458, website: 'https://water-gate.de' },
  { name: 'Tresor', address: 'Kopenicker Str. 70, 10179 Berlin', lat: 52.5098, lng: 13.4195, website: 'https://tresorberlin.com' },
  { name: 'KitKatClub', address: 'Kopenicker Str. 76, 10179 Berlin', lat: 52.5095, lng: 13.4185, website: 'https://kitkatclub.org' },
  { name: 'About Blank', address: 'Markgrafendamm 24c, 10245 Berlin', lat: 52.5068, lng: 13.4585, website: 'https://aboutblank.li' },
  { name: 'RSO.Berlin', address: 'Gabriel-Max-Str. 20, 10245 Berlin', lat: 52.5055, lng: 13.4610, website: 'https://rso.berlin' },
  { name: 'OHM', address: 'Kopenicker Str. 70, 10179 Berlin', lat: 52.5097, lng: 13.4190, website: 'https://ohm-berlin.com' },
  { name: 'Salon zur Wilden Renate', address: 'Alt-Stralau 70, 10245 Berlin', lat: 52.4952, lng: 13.4682, website: 'https://renate.cc' },
  { name: 'Sisyphos', address: 'Hauptstr. 15, 10317 Berlin', lat: 52.4930, lng: 13.4992, website: 'https://sisyphos-berlin.net' },
  { name: 'Kater Blau', address: 'Holzmarktstr. 25, 10243 Berlin', lat: 52.5112, lng: 13.4265, website: 'https://katerblau.de' },
  { name: 'A-Trane', address: 'Bleibtreustr. 1, 10623 Berlin', lat: 52.5068, lng: 13.3229, website: 'https://a-trane.de' },
  { name: 'YAAM', address: 'An der Schillingbrucke 3, 10243 Berlin', lat: 52.5075, lng: 13.4497, website: 'https://yaam.de' },
  { name: 'Ritter Butzke', address: 'Ritterstr. 26, 10969 Berlin', lat: 52.5035, lng: 13.4095, website: 'https://rfrsh.de' },
  { name: 'SchwuZ', address: 'Rollbergstr. 26, 12053 Berlin', lat: 52.4783, lng: 13.4312, website: 'https://schwuz.de' },
  { name: 'Festsaal Kreuzberg', address: 'Skalitzer Str. 130, 10999 Berlin', lat: 52.4991, lng: 13.4283, website: 'https://festsaal-kreuzberg.de' },
  { name: 'Lido', address: 'Cuvrystr. 7, 10997 Berlin', lat: 52.4994, lng: 13.4421, website: 'https://lido-berlin.de' },
  { name: 'Columbia Theater', address: 'Columbiadamm 13-21, 10965 Berlin', lat: 52.4842, lng: 13.3841, website: 'https://columbia-theater.de' },
  { name: 'Astra Kulturhaus', address: 'Revaler Str. 99, 10245 Berlin', lat: 52.5072, lng: 13.4540, website: 'https://astra-berlin.de' },
  { name: 'Prince Charles', address: 'Prinzenstr. 85f, 10969 Berlin', lat: 52.4997, lng: 13.4080, website: 'https://princecharlesberlin.com' },
  { name: 'Bi Nuu', address: 'Schlesische Str. 5, 10997 Berlin', lat: 52.4978, lng: 13.4429, website: 'https://bi-nuu.de' },
];

/** Event templates per category */
interface EventTemplate {
  readonly titlePrefix: string;
  readonly description: string;
  readonly category: EventCategory;
}

const TEMPLATES: readonly EventTemplate[] = [
  { titlePrefix: 'Klubnacht', description: 'Harter Techno auf dem Mainfloor. Industrieller Sound trifft auf pulsierende Basslines. Das Soundsystem liefert kompromisslose Beats bis in die fruehen Morgenstunden.', category: EventCategory.TECHNO },
  { titlePrefix: 'Deep Sessions', description: 'Deep House und Melodic Techno verschmelzen zu einer hypnotischen Reise durch warme Klanglandschaften. Atmosphaerisch, emotional, unvergesslich.', category: EventCategory.HOUSE },
  { titlePrefix: 'HipHop Jam', description: 'Die besten DJs der Berliner HipHop-Szene legen auf. Klassiker, Trap und neue Beats. Open Mic fuer MCs in der zweiten Haelfte.', category: EventCategory.HIPHOP },
  { titlePrefix: 'Noche Latina', description: 'Reggaeton, Salsa, Bachata und Cumbia! Die heisseste Latin-Party der Stadt mit Live-Percussion und Tanzworkshop ab 22 Uhr.', category: EventCategory.LATIN },
  { titlePrefix: 'Jazz Night', description: 'Live-Jazz mit internationalen Musikern. Improvisierte Sessions, klassische Standards und moderne Interpretationen in intimer Atmosphaere.', category: EventCategory.JAZZ },
  { titlePrefix: 'Electronica', description: 'Experimentelle elektronische Musik zwischen Ambient, IDM und Bass. Visuelle Kunstinstallationen begleiten den Abend.', category: EventCategory.ELECTRONIC },
  { titlePrefix: 'Mixed Vibes', description: 'Genre-uebergreifende Nacht mit Live-Bands, DJs und Performance-Kunst. Von Disco ueber Funk bis zu modernen Club-Sounds.', category: EventCategory.MIXED },
  { titlePrefix: 'Acid Warehouse', description: 'Acid Techno und Industrial in roher Lagerhaus-Atmosphaere. Stroboskop, Nebel und knallharte 303-Basslines.', category: EventCategory.TECHNO },
  { titlePrefix: 'Afro House', description: 'Afrikanische Rhythmen treffen auf europaeische House-Produktionen. Percussive Grooves und spirituelle Energie auf dem Dancefloor.', category: EventCategory.HOUSE },
  { titlePrefix: 'Open Air Vibes', description: 'Sommer-Feeling im Freien mit elektronischer Musik, Food-Staenden und Chill-Areas. Perfekt fuer einen langen Tag an der frischen Luft.', category: EventCategory.ELECTRONIC },
  { titlePrefix: 'Urban Beats', description: 'Urbane Klangwelten zwischen UK Garage, Grime und Drum & Bass. Schnelle Beats und tiefe Baesse dominieren die Nacht.', category: EventCategory.HIPHOP },
  { titlePrefix: 'Minimal Monday', description: 'Reduzierter Minimal Techno zum Wochenstart. Hypnotische Loops, subtile Veraenderungen und tiefe Konzentration auf der Tanzflaeche.', category: EventCategory.TECHNO },
  { titlePrefix: 'Disco Inferno', description: 'Disco, Funk und Boogie aus den 70ern und 80ern. Spiegelkugel, Glitzer und gute Laune garantiert. Dresscode: Glamour!', category: EventCategory.MIXED },
  { titlePrefix: 'Tango Nacht', description: 'Argentinischer Tango mit Live-Orchester. Milonga ab 22 Uhr, vorher Tango-Schnupperkurs fuer Einsteiger.', category: EventCategory.LATIN },
  { titlePrefix: 'Drum & Bass Takeover', description: 'Die schnellsten Beats der Stadt! DnB, Jungle und Breakbeat auf zwei Floors. Massive Basslines und rasante Rhythmen.', category: EventCategory.ELECTRONIC },
];

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=800',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
  'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
  'https://images.unsplash.com/photo-1571935436746-b21a8cddab6b?w=800',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
  'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800',
  'https://images.unsplash.com/photo-1545128485-c400e7702796?w=800',
];

const PRICES = [null, '8 EUR', '10 EUR', '12 EUR', '14 EUR', '15 EUR', '18 EUR', '20 EUR', '22 EUR', '25 EUR'];

/** Deterministic pseudo-random based on seed */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

function generateEvents(): readonly NormalizedEvent[] {
  const events: NormalizedEvent[] = [];
  const random = seededRandom(42);
  const now = new Date();
  const twoWeeksMs = 14 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < 40; i++) {
    const venue = VENUES[i % VENUES.length]!;
    const template = TEMPLATES[i % TEMPLATES.length]!;
    const imageUrl = UNSPLASH_IMAGES[i % UNSPLASH_IMAGES.length]!;
    const price = PRICES[Math.floor(random() * PRICES.length)]!;

    // Spread events across the next 2 weeks
    const offsetMs = Math.floor(random() * twoWeeksMs);
    const startDate = new Date(now.getTime() + offsetMs);
    // Set start time between 18:00 and 23:59
    startDate.setHours(18 + Math.floor(random() * 6), Math.floor(random() * 60), 0, 0);

    // Duration between 4 and 12 hours
    const durationHours = 4 + Math.floor(random() * 9);
    const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

    const source = i % 3 === 0 ? 'eventbrite' as const : 'scraper' as const;

    events.push({
      sourceId: `demo-${String(i + 1).padStart(3, '0')}`,
      source,
      title: `${venue.name}: ${template.titlePrefix}`,
      description: template.description,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      url: venue.website,
      imageUrl,
      venueName: venue.name,
      venueAddress: venue.address,
      city: 'Berlin',
      lat: venue.lat,
      lng: venue.lng,
      price,
      category: template.category,
    });
  }

  return events;
}

async function main(): Promise<void> {
  const outputPath = new URL(
    '../../frontend/public/data/events.json',
    import.meta.url,
  ).pathname;

  const events = generateEvents();

  // eslint-disable-next-line no-console
  console.log(`Generating ${events.length} demo events...`);

  const result = await upsertEventsToJson(events, outputPath);

  // eslint-disable-next-line no-console
  console.log(`Done! Inserted: ${result.inserted}, Updated: ${result.updated}, Errors: ${result.errors.length}`);
  // eslint-disable-next-line no-console
  console.log(`Output: ${outputPath}`);
}

void main();
