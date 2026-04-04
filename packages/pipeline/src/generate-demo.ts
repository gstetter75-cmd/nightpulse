import { EventCategory } from '@nightpulse/shared';
import type { NormalizedEvent } from '@nightpulse/shared';
import { upsertEventsToJson } from './db/json-store.js';

/** Venue definition with realistic coordinates */
interface VenueDef {
  readonly name: string;
  readonly address: string;
  readonly city: string;
  readonly lat: number;
  readonly lng: number;
  readonly website: string;
}

/** City venue collection */
interface CityVenues {
  readonly city: string;
  readonly currency: string;
  readonly venues: readonly VenueDef[];
}

const CITY_VENUES: readonly CityVenues[] = [
  {
    city: 'Berlin',
    currency: 'EUR',
    venues: [
      { name: 'Berghain', address: 'Am Wriezener Bhf, 10243 Berlin', city: 'Berlin', lat: 52.5112, lng: 13.4428, website: 'https://berghain.berlin' },
      { name: 'Watergate', address: 'Falckensteinstr. 49a, 10997 Berlin', city: 'Berlin', lat: 52.5015, lng: 13.4458, website: 'https://water-gate.de' },
      { name: 'Tresor', address: 'Köpenicker Str. 70, 10179 Berlin', city: 'Berlin', lat: 52.5098, lng: 13.4195, website: 'https://tresorberlin.com' },
      { name: 'KitKat Club', address: 'Köpenicker Str. 76, 10179 Berlin', city: 'Berlin', lat: 52.5095, lng: 13.4185, website: 'https://kitkatclub.org' },
      { name: 'Sisyphos', address: 'Hauptstr. 15, 10317 Berlin', city: 'Berlin', lat: 52.4930, lng: 13.4992, website: 'https://sisyphos-berlin.net' },
      { name: 'Kater Blau', address: 'Holzmarktstr. 25, 10243 Berlin', city: 'Berlin', lat: 52.5112, lng: 13.4265, website: 'https://katerblau.de' },
      { name: 'About Blank', address: 'Markgrafendamm 24c, 10245 Berlin', city: 'Berlin', lat: 52.5068, lng: 13.4585, website: 'https://aboutblank.li' },
      { name: 'RSO.Berlin', address: 'Gabriel-Max-Str. 20, 10245 Berlin', city: 'Berlin', lat: 52.5055, lng: 13.4610, website: 'https://rso.berlin' },
    ],
  },
  {
    city: 'Hamburg',
    currency: 'EUR',
    venues: [
      { name: 'Molotow', address: 'Nobistor 14, 22767 Hamburg', city: 'Hamburg', lat: 53.5497, lng: 9.9586, website: 'https://molotowclub.com' },
      { name: 'Uebel & Gefährlich', address: 'Feldstr. 66, 20359 Hamburg', city: 'Hamburg', lat: 53.5560, lng: 9.9672, website: 'https://uebelundgefaehrlich.com' },
      { name: 'PAL', address: 'Christoph-Probst-Weg 4, 20251 Hamburg', city: 'Hamburg', lat: 53.5792, lng: 9.9725, website: 'https://pal-hamburg.com' },
      { name: 'Gruenspan', address: 'Große Freiheit 58, 22767 Hamburg', city: 'Hamburg', lat: 53.5512, lng: 9.9574, website: 'https://gruenspan.de' },
      { name: 'Nochtspeicher', address: 'Bernhard-Nocht-Str. 69a, 20359 Hamburg', city: 'Hamburg', lat: 53.5467, lng: 9.9596, website: 'https://nochtspeicher.de' },
      { name: 'Hafenklang', address: 'Große Elbstr. 84, 22767 Hamburg', city: 'Hamburg', lat: 53.5441, lng: 9.9477, website: 'https://hafenklang.de' },
    ],
  },
  {
    city: 'München',
    currency: 'EUR',
    venues: [
      { name: 'Harry Klein', address: 'Sonnenstr. 8, 80331 München', city: 'München', lat: 48.1378, lng: 11.5656, website: 'https://harrykleinclub.de' },
      { name: 'Blitz Club', address: 'Museumsinsel 1, 80538 München', city: 'München', lat: 48.1299, lng: 11.5838, website: 'https://blitz.club' },
      { name: 'Rote Sonne', address: 'Maximiliansplatz 5, 80333 München', city: 'München', lat: 48.1417, lng: 11.5695, website: 'https://rote-sonne.com' },
      { name: 'P1', address: 'Prinzregentenstr. 1, 80538 München', city: 'München', lat: 48.1425, lng: 11.5870, website: 'https://p1-club.de' },
      { name: 'Bob Beaman', address: 'Karlsplatz 4, 80335 München', city: 'München', lat: 48.1393, lng: 11.5655, website: 'https://bobbeaman.de' },
      { name: 'Bahnwärter Thiel', address: 'Tumblingerstr. 29, 80337 München', city: 'München', lat: 48.1270, lng: 11.5590, website: 'https://bahnwaerterthiel.de' },
    ],
  },
  {
    city: 'Köln',
    currency: 'EUR',
    venues: [
      { name: 'Bootshaus', address: 'Auenweg 173, 51063 Köln', city: 'Köln', lat: 50.9569, lng: 7.0148, website: 'https://bootshaus.tv' },
      { name: 'Gewölbe', address: 'Hohenzollernbrücke, 50679 Köln', city: 'Köln', lat: 50.9412, lng: 6.9650, website: 'https://gewoelbe.club' },
      { name: 'Odonien', address: 'Hornstr. 85, 50823 Köln', city: 'Köln', lat: 50.9504, lng: 6.9218, website: 'https://odonien.de' },
      { name: 'Helios37', address: 'Heliosstr. 37, 50825 Köln', city: 'Köln', lat: 50.9508, lng: 6.9090, website: 'https://helios37.de' },
      { name: 'Sensor Club', address: 'Bonner Str. 65, 50677 Köln', city: 'Köln', lat: 50.9238, lng: 6.9570, website: 'https://sensorclub.de' },
    ],
  },
  {
    city: 'Frankfurt',
    currency: 'EUR',
    venues: [
      { name: 'Robert Johnson', address: 'Nordring 131, 63067 Offenbach', city: 'Frankfurt', lat: 50.1005, lng: 8.7703, website: 'https://robert-johnson.de' },
      { name: 'Tanzhaus West', address: 'Gutleutstr. 294, 60327 Frankfurt', city: 'Frankfurt', lat: 50.0980, lng: 8.6410, website: 'https://tanzhaus-west.de' },
      { name: 'Silbergold', address: 'Gutleutstr. 294, 60327 Frankfurt', city: 'Frankfurt', lat: 50.0982, lng: 8.6415, website: 'https://silbergold-ffm.de' },
      { name: 'Zoom', address: 'Brönnerstr. 5-9, 60313 Frankfurt', city: 'Frankfurt', lat: 50.1145, lng: 8.6828, website: 'https://zoom-frankfurt.de' },
      { name: 'Monza', address: 'Gutleutstr. 8, 60329 Frankfurt', city: 'Frankfurt', lat: 50.1058, lng: 8.6672, website: 'https://monza-club.de' },
    ],
  },
  {
    city: 'Düsseldorf',
    currency: 'EUR',
    venues: [
      { name: 'Salon des Amateurs', address: 'Grabbeplatz 4, 40213 Düsseldorf', city: 'Düsseldorf', lat: 51.2280, lng: 6.7735, website: 'https://salon-des-amateurs.de' },
      { name: 'Golzheim', address: 'Rotterdamer Str. 11, 40474 Düsseldorf', city: 'Düsseldorf', lat: 51.2470, lng: 6.7565, website: 'https://golzheim.club' },
      { name: 'Nachtresidenz', address: 'Bahnstr. 13, 40212 Düsseldorf', city: 'Düsseldorf', lat: 51.2265, lng: 6.7825, website: 'https://nachtresidenz.de' },
      { name: 'Sub', address: 'Alexanderstr. 2, 40210 Düsseldorf', city: 'Düsseldorf', lat: 51.2215, lng: 6.7890, website: 'https://sub-duesseldorf.de' },
    ],
  },
  {
    city: 'Stuttgart',
    currency: 'EUR',
    venues: [
      { name: 'Climax', address: 'Theodor-Heuss-Str. 30, 70174 Stuttgart', city: 'Stuttgart', lat: 48.7800, lng: 9.1760, website: 'https://climax-stuttgart.de' },
      { name: 'Kowalski', address: 'Lerchenstr. 11, 70176 Stuttgart', city: 'Stuttgart', lat: 48.7785, lng: 9.1680, website: 'https://kowalski-stuttgart.de' },
      { name: 'Romantica', address: 'Liststr. 32, 70180 Stuttgart', city: 'Stuttgart', lat: 48.7695, lng: 9.1810, website: 'https://romantica-stuttgart.de' },
      { name: 'White Noise', address: 'Eberhardstr. 35, 70173 Stuttgart', city: 'Stuttgart', lat: 48.7735, lng: 9.1775, website: 'https://whitenoise-stuttgart.de' },
    ],
  },
  {
    city: 'Leipzig',
    currency: 'EUR',
    venues: [
      { name: 'Distillery', address: 'Kurt-Eisner-Str. 108a, 04275 Leipzig', city: 'Leipzig', lat: 51.3260, lng: 12.3775, website: 'https://distillery.de' },
      { name: 'Institut für Zukunft', address: 'An den Tierkliniken 38, 04103 Leipzig', city: 'Leipzig', lat: 51.3352, lng: 12.3938, website: 'https://ifz.me' },
      { name: 'Conne Island', address: 'Koburger Str. 3, 04277 Leipzig', city: 'Leipzig', lat: 51.3190, lng: 12.3830, website: 'https://conne-island.de' },
      { name: 'Moritzbastei', address: 'Universitätsstr. 9, 04109 Leipzig', city: 'Leipzig', lat: 51.3380, lng: 12.3785, website: 'https://moritzbastei.de' },
      { name: 'Noch Besser Leben', address: 'Merseburger Str. 25, 04177 Leipzig', city: 'Leipzig', lat: 51.3420, lng: 12.3465, website: 'https://nochbesserleben.de' },
    ],
  },
  {
    city: 'Dresden',
    currency: 'EUR',
    venues: [
      { name: 'Objekt Klein A', address: 'Meschwitzstr. 9, 01099 Dresden', city: 'Dresden', lat: 51.0650, lng: 13.7440, website: 'https://objekt-klein-a.de' },
      { name: 'Bärenzwinger', address: 'Brühlscher Garten 1, 01067 Dresden', city: 'Dresden', lat: 51.0540, lng: 13.7460, website: 'https://baerenzwinger.de' },
      { name: 'Sektor Evolution', address: 'An der Eisenbahn 2, 01099 Dresden', city: 'Dresden', lat: 51.0680, lng: 13.7550, website: 'https://sektor-evolution.de' },
      { name: 'Club Paula', address: 'Louisenstr. 60, 01099 Dresden', city: 'Dresden', lat: 51.0640, lng: 13.7395, website: 'https://clubpaula.de' },
    ],
  },
  {
    city: 'Hannover',
    currency: 'EUR',
    venues: [
      { name: 'Subkultur', address: 'Engelbosteler Damm 7, 30167 Hannover', city: 'Hannover', lat: 52.3840, lng: 9.7315, website: 'https://subkultur-hannover.de' },
      { name: 'Musikzentrum', address: 'Emil-Meyer-Str. 26, 30165 Hannover', city: 'Hannover', lat: 52.3880, lng: 9.7350, website: 'https://musikzentrum-hannover.de' },
      { name: 'Chez Heinz', address: 'Liepmannstr. 7b, 30453 Hannover', city: 'Hannover', lat: 52.3715, lng: 9.7120, website: 'https://chezheinz.de' },
    ],
  },
  {
    city: 'Wien',
    currency: 'EUR',
    venues: [
      { name: 'Grelle Forelle', address: 'Spittelauer Lände 12, 1090 Wien', city: 'Wien', lat: 48.2278, lng: 16.3590, website: 'https://grelleforelle.com' },
      { name: 'Flex', address: 'Augartenbrücke 1, 1010 Wien', city: 'Wien', lat: 48.2125, lng: 16.3685, website: 'https://flex.at' },
      { name: 'Pratersauna', address: 'Waldsteingartenstr. 135, 1020 Wien', city: 'Wien', lat: 48.2162, lng: 16.3988, website: 'https://pratersauna.tv' },
      { name: 'Sass Music Club', address: 'Karlsplatz 1, 1010 Wien', city: 'Wien', lat: 48.2005, lng: 16.3695, website: 'https://sass.at' },
      { name: 'Techno Cafe', address: 'Taborstr. 11a, 1020 Wien', city: 'Wien', lat: 48.2170, lng: 16.3780, website: 'https://technocafe.at' },
    ],
  },
  {
    city: 'Zürich',
    currency: 'CHF',
    venues: [
      { name: 'Hive', address: 'Geroldstr. 5, 8005 Zürich', city: 'Zürich', lat: 47.3878, lng: 8.5185, website: 'https://hive-zurich.ch' },
      { name: 'Zukunft', address: 'Dienerstr. 33, 8004 Zürich', city: 'Zürich', lat: 47.3768, lng: 8.5292, website: 'https://zukunft.cl' },
      { name: 'Supermarket', address: 'Geroldstr. 17, 8005 Zürich', city: 'Zürich', lat: 47.3882, lng: 8.5195, website: 'https://supermarket.li' },
      { name: 'Kauz', address: 'Leonhardstr. 34, 8001 Zürich', city: 'Zürich', lat: 47.3780, lng: 8.5435, website: 'https://kauz.ch' },
    ],
  },
];

/** Event templates per category with city-appropriate descriptions */
interface EventTemplate {
  readonly titlePrefix: string;
  readonly description: string;
  readonly category: EventCategory;
}

const TEMPLATES: readonly EventTemplate[] = [
  { titlePrefix: 'Klubnacht', description: 'Harter Techno auf dem Mainfloor. Industrieller Sound trifft auf pulsierende Basslines. Das Soundsystem liefert kompromisslose Beats bis in die frühen Morgenstunden.', category: EventCategory.TECHNO },
  { titlePrefix: 'Deep Sessions', description: 'Deep House und Melodic Techno verschmelzen zu einer hypnotischen Reise durch warme Klanglandschaften. Atmosphärisch, emotional, unvergesslich.', category: EventCategory.HOUSE },
  { titlePrefix: 'HipHop Jam', description: 'Die besten DJs der lokalen HipHop-Szene legen auf. Klassiker, Trap und neue Beats. Open Mic für MCs in der zweiten Hälfte.', category: EventCategory.HIPHOP },
  { titlePrefix: 'Noche Latina', description: 'Reggaeton, Salsa, Bachata und Cumbia! Die heißeste Latin-Party der Stadt mit Live-Percussion und Tanzworkshop ab 22 Uhr.', category: EventCategory.LATIN },
  { titlePrefix: 'Jazz Night', description: 'Live-Jazz mit internationalen Musikern. Improvisierte Sessions, klassische Standards und moderne Interpretationen in intimer Atmosphäre.', category: EventCategory.JAZZ },
  { titlePrefix: 'Electronica', description: 'Experimentelle elektronische Musik zwischen Ambient, IDM und Bass. Visuelle Kunstinstallationen begleiten den Abend.', category: EventCategory.ELECTRONIC },
  { titlePrefix: 'Mixed Vibes', description: 'Genre-übergreifende Nacht mit Live-Bands, DJs und Performance-Kunst. Von Disco über Funk bis zu modernen Club-Sounds.', category: EventCategory.MIXED },
  { titlePrefix: 'Acid Warehouse', description: 'Acid Techno und Industrial in roher Lagerhaus-Atmosphäre. Stroboskop, Nebel und knallharte 303-Basslines.', category: EventCategory.TECHNO },
  { titlePrefix: 'Afro House', description: 'Afrikanische Rhythmen treffen auf europäische House-Produktionen. Percussive Grooves und spirituelle Energie auf dem Dancefloor.', category: EventCategory.HOUSE },
  { titlePrefix: 'Open Air Vibes', description: 'Sommer-Feeling im Freien mit elektronischer Musik, Food-Ständen und Chill-Areas. Perfekt für einen langen Tag an der frischen Luft.', category: EventCategory.ELECTRONIC },
  { titlePrefix: 'Urban Beats', description: 'Urbane Klangwelten zwischen UK Garage, Grime und Drum & Bass. Schnelle Beats und tiefe Bässe dominieren die Nacht.', category: EventCategory.HIPHOP },
  { titlePrefix: 'Minimal Monday', description: 'Reduzierter Minimal Techno zum Wochenstart. Hypnotische Loops, subtile Veränderungen und tiefe Konzentration auf der Tanzfläche.', category: EventCategory.TECHNO },
  { titlePrefix: 'Disco Inferno', description: 'Disco, Funk und Boogie aus den 70ern und 80ern. Spiegelkugel, Glitzer und gute Laune garantiert. Dresscode: Glamour!', category: EventCategory.MIXED },
  { titlePrefix: 'Tango Nacht', description: 'Argentinischer Tango mit Live-Orchester. Milonga ab 22 Uhr, vorher Tango-Schnupperkurs für Einsteiger.', category: EventCategory.LATIN },
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

const EUR_PRICES = [null, '8 EUR', '10 EUR', '12 EUR', '14 EUR', '15 EUR', '18 EUR', '20 EUR', '22 EUR', '25 EUR'];
const CHF_PRICES = [null, '10 CHF', '15 CHF', '20 CHF', '25 CHF', '30 CHF', '35 CHF', '40 CHF'];

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
  let globalIndex = 0;

  for (const cityDef of CITY_VENUES) {
    const prices = cityDef.currency === 'CHF' ? CHF_PRICES : EUR_PRICES;

    for (const venue of cityDef.venues) {
      const template = TEMPLATES[globalIndex % TEMPLATES.length]!;
      const imageUrl = UNSPLASH_IMAGES[globalIndex % UNSPLASH_IMAGES.length]!;
      const price = prices[Math.floor(random() * prices.length)]!;

      // Spread events across the next 2 weeks
      const offsetMs = Math.floor(random() * twoWeeksMs);
      const startDate = new Date(now.getTime() + offsetMs);
      // Set start time between 18:00 and 23:59
      startDate.setHours(18 + Math.floor(random() * 6), Math.floor(random() * 60), 0, 0);

      // Duration between 4 and 12 hours
      const durationHours = 4 + Math.floor(random() * 9);
      const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

      const source = globalIndex % 3 === 0 ? 'eventbrite' as const : 'scraper' as const;

      events.push({
        sourceId: `demo-${String(globalIndex + 1).padStart(3, '0')}`,
        source,
        title: `${venue.name}: ${template.titlePrefix}`,
        description: template.description,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        url: venue.website,
        imageUrl,
        venueName: venue.name,
        venueAddress: venue.address,
        city: cityDef.city,
        lat: venue.lat,
        lng: venue.lng,
        price,
        category: template.category,
      });

      globalIndex++;
    }
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
  console.log(`Generating ${events.length} demo events across ${CITY_VENUES.length} cities...`);

  const result = await upsertEventsToJson(events, outputPath);

  // eslint-disable-next-line no-console
  console.log(`Done! Inserted: ${result.inserted}, Updated: ${result.updated}, Errors: ${result.errors.length}`);
  // eslint-disable-next-line no-console
  console.log(`Output: ${outputPath}`);
}

void main();
