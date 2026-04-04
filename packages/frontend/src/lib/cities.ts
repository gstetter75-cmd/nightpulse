export interface City {
  readonly slug: string;
  readonly name: string;
  readonly lat: number;
  readonly lng: number;
  readonly country: string;
  readonly emoji: string;
}

export const CITIES: readonly City[] = [
  { slug: 'berlin', name: 'Berlin', lat: 52.52, lng: 13.405, country: 'DE', emoji: '\u{1F43B}' },
  { slug: 'hamburg', name: 'Hamburg', lat: 53.5511, lng: 9.9937, country: 'DE', emoji: '\u2693' },
  { slug: 'muenchen', name: 'M\u00FCnchen', lat: 48.1351, lng: 11.582, country: 'DE', emoji: '\u{1F3D4}\uFE0F' },
  { slug: 'koeln', name: 'K\u00F6ln', lat: 50.9375, lng: 6.9603, country: 'DE', emoji: '\u26EA' },
  { slug: 'frankfurt', name: 'Frankfurt', lat: 50.1109, lng: 8.6821, country: 'DE', emoji: '\u{1F3D9}\uFE0F' },
  { slug: 'duesseldorf', name: 'D\u00FCsseldorf', lat: 51.2277, lng: 6.7735, country: 'DE', emoji: '\u{1F3A8}' },
  { slug: 'stuttgart', name: 'Stuttgart', lat: 48.7758, lng: 9.1829, country: 'DE', emoji: '\u{1F697}' },
  { slug: 'leipzig', name: 'Leipzig', lat: 51.3397, lng: 12.3731, country: 'DE', emoji: '\u{1F3B5}' },
  { slug: 'dresden', name: 'Dresden', lat: 51.0504, lng: 13.7373, country: 'DE', emoji: '\u{1F3DB}\uFE0F' },
  { slug: 'hannover', name: 'Hannover', lat: 52.3759, lng: 9.732, country: 'DE', emoji: '\u{1F33F}' },
  { slug: 'wien', name: 'Wien', lat: 48.2082, lng: 16.3738, country: 'AT', emoji: '\u{1F3BB}' },
  { slug: 'zuerich', name: 'Z\u00FCrich', lat: 47.3769, lng: 8.5417, country: 'CH', emoji: '\u{1F3E6}' },
] as const;

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function findNearestCity(lat: number, lng: number): City {
  let nearest = CITIES[0];
  let minDist = Infinity;

  for (const city of CITIES) {
    const dLat = city.lat - lat;
    const dLng = city.lng - lng;
    const dist = dLat * dLat + dLng * dLng;
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }

  return nearest;
}
