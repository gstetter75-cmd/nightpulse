import type { DbEvent } from '@nightpulse/shared';

export interface VenueInfo {
  readonly slug: string;
  readonly name: string;
  readonly address: string;
  readonly city: string;
  readonly lat: number;
  readonly lng: number;
  readonly description: string;
  readonly imageUrl: string;
  readonly website?: string;
  readonly genres: readonly string[];
  readonly capacity?: 'Klein' | 'Mittel' | 'Groß';
}

export const VENUES: readonly VenueInfo[] = [
  {
    slug: 'berghain',
    name: 'Berghain',
    address: 'Am Wriezener Bhf, 10243 Berlin',
    city: 'Berlin',
    lat: 52.5112,
    lng: 13.4428,
    description:
      'Das Berghain gilt als einer der berühmtesten Technoclubs der Welt. In einem ehemaligen Heizkraftwerk an der Grenze von Friedrichshain und Kreuzberg gelegen, ist es bekannt für sein kompromissloses Soundsystem und legendäre Klubnächte, die oft bis Montag dauern.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    website: 'https://berghain.berlin',
    genres: ['Techno', 'House', 'Industrial'],
    capacity: 'Groß',
  },
  {
    slug: 'watergate',
    name: 'Watergate',
    address: 'Falckensteinstr. 49a, 10997 Berlin',
    city: 'Berlin',
    lat: 52.5015,
    lng: 13.4458,
    description:
      'Direkt an der Spree in Kreuzberg bietet das Watergate zwei Floors mit Panoramafenstern und einer Wasserterrasse. Der Club ist bekannt für Deep House, Melodic Techno und internationale DJ-Bookings auf höchstem Niveau.',
    imageUrl: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800',
    website: 'https://water-gate.de',
    genres: ['Deep House', 'Melodic Techno', 'Tech House'],
    capacity: 'Mittel',
  },
  {
    slug: 'tresor',
    name: 'Tresor',
    address: 'Köpenicker Str. 70, 10179 Berlin',
    city: 'Berlin',
    lat: 52.5098,
    lng: 13.4195,
    description:
      'Der Tresor ist eine Berliner Institution und Pionier der deutschen Techno-Szene seit 1991. Im Untergeschoss eines ehemaligen Kaufhauses pulsiert roher, harter Techno durch die Betonwände. Der Globus-Floor bietet ein breiteres Spektrum elektronischer Musik.',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    website: 'https://tresorberlin.com',
    genres: ['Techno', 'Industrial', 'Electro'],
    capacity: 'Groß',
  },
  {
    slug: 'kitkat-club',
    name: 'KitKat Club',
    address: 'Köpenicker Str. 76, 10179 Berlin',
    city: 'Berlin',
    lat: 52.5095,
    lng: 13.4185,
    description:
      'Der KitKat Club ist Berlins berühmtester Fetisch- und Partyclub. Neben dem legendären Dresscode bietet der Club ein vielfältiges Musikprogramm von Techno über House bis hin zu Latin-Nächten. Ein Ort der Freiheit und Selbstentfaltung.',
    imageUrl: 'https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=800',
    website: 'https://kitkatclub.org',
    genres: ['Techno', 'House', 'Latin'],
    capacity: 'Mittel',
  },
  {
    slug: 'about-blank',
    name: 'About Blank',
    address: 'Markgrafendamm 24c, 10245 Berlin',
    city: 'Berlin',
    lat: 52.5068,
    lng: 13.4585,
    description:
      'Das About Blank in Friedrichshain ist ein selbstverwalteter Club mit politischem Anspruch. Neben Techno und House auf zwei Indoor-Floors gibt es einen weitläufigen Garten für Open-Air-Events. Bekannt für progressive Kulturveranstaltungen und queere Partys.',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
    website: 'https://aboutblank.li',
    genres: ['Techno', 'House', 'Experimental'],
    capacity: 'Mittel',
  },
  {
    slug: 'sisyphos',
    name: 'Sisyphos',
    address: 'Hauptstr. 15, 10317 Berlin',
    city: 'Berlin',
    lat: 52.493,
    lng: 13.4992,
    description:
      'Das Sisyphos in Rummelsburg ist ein Open-Air-Paradies auf einem ehemaligen Fabrikgelände. Mit mehreren Floors, Strand, Garten und Baumhaus bietet es ein einzigartiges Festival-Feeling. Die Sonntags-Sessions sind legendär und können bis Dienstag dauern.',
    imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800',
    website: 'https://sisyphos-berlin.net',
    genres: ['House', 'Techno', 'Electronica'],
    capacity: 'Groß',
  },
  {
    slug: 'kater-blau',
    name: 'Kater Blau',
    address: 'Holzmarktstr. 25, 10243 Berlin',
    city: 'Berlin',
    lat: 52.5112,
    lng: 13.4265,
    description:
      'Am Holzmarkt an der Spree gelegen, vereint Kater Blau drei Floors mit einem eklektischen Mix aus House, Electronica und Live-Musik. Die verwinkelte Architektur und der Spreegarten schaffen eine magische Atmosphäre zwischen Kunst und Club.',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    website: 'https://katerblau.de',
    genres: ['House', 'Electronica', 'Live'],
    capacity: 'Mittel',
  },
  {
    slug: 'schwuz',
    name: 'SchwuZ',
    address: 'Rollbergstr. 26, 12053 Berlin',
    city: 'Berlin',
    lat: 52.4783,
    lng: 13.4312,
    description:
      'Das SchwuZ in Neukölln ist einer der ältesten queeren Clubs Berlins. Auf drei Floors wird alles von Pop über Latin bis Techno gespielt. Ein safe space für die LGBTQ+-Community mit legendären Themenpartys und einer herzlichen Atmosphäre.',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
    website: 'https://schwuz.de',
    genres: ['Pop', 'Latin', 'Techno'],
    capacity: 'Mittel',
  },
  {
    slug: 'ritter-butzke',
    name: 'Ritter Butzke',
    address: 'Ritterstr. 26, 10969 Berlin',
    city: 'Berlin',
    lat: 52.5035,
    lng: 13.4095,
    description:
      'Der Ritter Butzke in Kreuzberg besticht durch seine kunstvolle Gestaltung und ein durchdachtes Musikprogramm. Drei Floors bieten Melodic House, Progressive und Techno in einer Atmosphäre, die Clubbing mit Kunsterlebnis verbindet.',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    website: 'https://rfrsh.de',
    genres: ['Melodic House', 'Progressive', 'Techno'],
    capacity: 'Mittel',
  },
  {
    slug: 'a-trane',
    name: 'A-Trane',
    address: 'Bleibtreustr. 1, 10623 Berlin',
    city: 'Berlin',
    lat: 52.5068,
    lng: 13.3229,
    description:
      'Der A-Trane in Charlottenburg ist Berlins renommiertester Jazzclub. Seit über 30 Jahren treten hier internationale Jazz-Größen in intimer Atmosphäre auf. Die Jam Sessions am Samstag sind ein Pflichttermin für jeden Musikliebhaber.',
    imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
    website: 'https://a-trane.de',
    genres: ['Jazz', 'Blues', 'Swing'],
    capacity: 'Klein',
  },
  {
    slug: 'yaam',
    name: 'YAAM',
    address: 'An der Schillingbrücke 3, 10243 Berlin',
    city: 'Berlin',
    lat: 52.5075,
    lng: 13.4497,
    description:
      'Das YAAM (Young African Art Market) am Spreeufer ist Berlins Hotspot für karibische und afrikanische Kultur. Reggae, Dancehall, HipHop und Afrobeats unter freiem Himmel, dazu Beachvolleyball, Graffiti-Walls und Street Food aus aller Welt.',
    imageUrl: 'https://images.unsplash.com/photo-1571935436746-b21a8cddab6b?w=800',
    website: 'https://yaam.de',
    genres: ['HipHop', 'Reggae', 'Afrobeats'],
    capacity: 'Groß',
  },
  {
    slug: 'lido',
    name: 'Lido',
    address: 'Cuvrystr. 7, 10997 Berlin',
    city: 'Berlin',
    lat: 52.4994,
    lng: 13.4421,
    description:
      'Das Lido in Kreuzberg ist ein vielseitiger Live-Musik-Venue in einem ehemaligen Kino. Von Indie Rock über Electronic bis Punk finden hier Konzerte und Clubnächte in einem Raum mit hervorragender Akustik und unverwechselbarer Atmosphäre statt.',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    website: 'https://lido-berlin.de',
    genres: ['Indie', 'Rock', 'Electronic'],
    capacity: 'Mittel',
  },
  {
    slug: 'ohm',
    name: 'OHM',
    address: 'Köpenicker Str. 70, 10179 Berlin',
    city: 'Berlin',
    lat: 52.5097,
    lng: 13.4198,
    description:
      'Im selben Gebäudekomplex wie der Tresor befindet sich das OHM, ein intimer Club für experimentelle elektronische Musik. Ambient, Noise, Modular-Synthesizer und Klangkunst finden hier ein Zuhause. Ein Ort für musikalische Grenzgänger.',
    imageUrl: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=800',
    website: 'https://ohm-berlin.com',
    genres: ['Ambient', 'Experimental', 'Modular'],
    capacity: 'Klein',
  },
  {
    slug: 'renate',
    name: 'Renate',
    address: 'Alt-Stralau 70, 10245 Berlin',
    city: 'Berlin',
    lat: 52.4955,
    lng: 13.4685,
    description:
      'Die Else / Renate an der Spree in Stralau ist ein verwunschener Club in einem ehemaligen Mietshaus. Jeder Raum ist individuell gestaltet, vom Wohnzimmer bis zur Dachterrasse. House und Techno erklingen in einem labyrinthartigen Wunderland.',
    imageUrl: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800',
    genres: ['House', 'Techno', 'Disco'],
    capacity: 'Mittel',
  },
  {
    slug: 'festsaal-kreuzberg',
    name: 'Festsaal Kreuzberg',
    address: 'Skalitzer Str. 130, 10999 Berlin',
    city: 'Berlin',
    lat: 52.4991,
    lng: 13.4283,
    description:
      'Der Festsaal Kreuzberg ist ein multikultureller Veranstaltungsort im Herzen von Kreuzberg. Von Konzerten über Clubnächte bis hin zu Kunstausstellungen und politischen Events bietet der Saal Platz für genreübergreifende Kultur.',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    website: 'https://festsaal-kreuzberg.de',
    genres: ['Mixed', 'Live', 'Indie'],
    capacity: 'Groß',
  },
] as const;

/**
 * Find a venue by its slug.
 */
export function getVenueBySlug(slug: string): VenueInfo | undefined {
  return VENUES.find((v) => v.slug === slug);
}

/**
 * Get all events matching a given venue name (case-insensitive).
 */
export function getEventsForVenue(venueName: string, events: readonly DbEvent[]): readonly DbEvent[] {
  const normalized = venueName.toLowerCase();
  return events.filter((e) => e.venueName.toLowerCase() === normalized);
}
