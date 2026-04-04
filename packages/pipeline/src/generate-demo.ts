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
      { name: 'About Blank', address: 'Markgrafendamm 24c, 10245 Berlin', city: 'Berlin', lat: 52.5068, lng: 13.4585, website: 'https://aboutblank.li' },
      { name: 'Sisyphos', address: 'Hauptstr. 15, 10317 Berlin', city: 'Berlin', lat: 52.4930, lng: 13.4992, website: 'https://sisyphos-berlin.net' },
      { name: 'Kater Blau', address: 'Holzmarktstr. 25, 10243 Berlin', city: 'Berlin', lat: 52.5112, lng: 13.4265, website: 'https://katerblau.de' },
      { name: 'Ritter Butzke', address: 'Ritterstr. 26, 10969 Berlin', city: 'Berlin', lat: 52.5035, lng: 13.4095, website: 'https://rfrsh.de' },
      { name: '://about blank', address: 'Markgrafendamm 24c, 10245 Berlin', city: 'Berlin', lat: 52.5069, lng: 13.4586, website: 'https://aboutblank.li' },
      { name: 'Wilde Renate', address: 'Alt-Stralau 70, 10245 Berlin', city: 'Berlin', lat: 52.4965, lng: 13.4670, website: 'https://renfrsh.de' },
      { name: 'OHM', address: 'Köpenicker Str. 70, 10179 Berlin', city: 'Berlin', lat: 52.5097, lng: 13.4198, website: 'https://ohmberlin.com' },
      { name: 'Griessmuehle', address: 'Sonnenallee 221, 12059 Berlin', city: 'Berlin', lat: 52.4728, lng: 13.4575, website: 'https://griessmuehle.de' },
      { name: 'RSO.Berlin', address: 'Gabriel-Max-Str. 20, 10245 Berlin', city: 'Berlin', lat: 52.5055, lng: 13.4610, website: 'https://rso.berlin' },
      { name: 'Salon zur Wilden Renate', address: 'Alt-Stralau 70, 10245 Berlin', city: 'Berlin', lat: 52.4966, lng: 13.4672, website: 'https://renfrsh.de' },
      { name: 'Prince Charles', address: 'Prinzenstr. 85F, 10969 Berlin', city: 'Berlin', lat: 52.5020, lng: 13.4100, website: 'https://princecharlesberlin.com' },
      { name: 'Holzmarkt', address: 'Holzmarktstr. 25, 10243 Berlin', city: 'Berlin', lat: 52.5115, lng: 13.4270, website: 'https://holzmarkt.com' },
      { name: 'Golden Gate', address: 'Schicklerstr. 4, 10179 Berlin', city: 'Berlin', lat: 52.5140, lng: 13.4110, website: 'https://goldengate-berlin.de' },
      { name: 'Matrix', address: 'Warschauer Platz 18, 10245 Berlin', city: 'Berlin', lat: 52.5060, lng: 13.4495, website: 'https://matrixberlin.de' },
      { name: 'Sage Club', address: 'Köpenicker Str. 76, 10179 Berlin', city: 'Berlin', lat: 52.5094, lng: 13.4188, website: 'https://sage-club.de' },
      { name: 'Anomalie', address: 'Storkower Str. 123, 10407 Berlin', city: 'Berlin', lat: 52.5290, lng: 13.4510, website: 'https://anomalie-berlin.de' },
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
      { name: 'Fundbureau', address: 'Stresemannstr. 114, 22769 Hamburg', city: 'Hamburg', lat: 53.5580, lng: 9.9530, website: 'https://fundbureau.de' },
      { name: 'Kleiner Donner', address: 'Kleine Rainstr. 11, 22765 Hamburg', city: 'Hamburg', lat: 53.5530, lng: 9.9490, website: 'https://kleinerdonner.com' },
      { name: 'Baalsaal', address: 'Reeperbahn 25, 20359 Hamburg', city: 'Hamburg', lat: 53.5495, lng: 9.9618, website: 'https://baalsaal.com' },
      { name: 'Mojo Club', address: 'Reeperbahn 1, 20359 Hamburg', city: 'Hamburg', lat: 53.5493, lng: 9.9635, website: 'https://mojo.de' },
      { name: 'Cascadas', address: 'Ferdinandstr. 12, 20095 Hamburg', city: 'Hamburg', lat: 53.5530, lng: 9.9990, website: 'https://cascadas.de' },
      { name: 'Prinzenbar', address: 'Kastanienallee 20, 20359 Hamburg', city: 'Hamburg', lat: 53.5500, lng: 9.9610, website: 'https://prinzenbar.com' },
      { name: 'Kukuun', address: 'Spielbudenplatz 22, 20359 Hamburg', city: 'Hamburg', lat: 53.5490, lng: 9.9625, website: 'https://kukuun.com' },
      { name: 'Südpol', address: 'Süderstr. 112, 20097 Hamburg', city: 'Hamburg', lat: 53.5450, lng: 10.0200, website: 'https://suedpol-hamburg.de' },
      { name: 'Waagenbau', address: 'Max-Brauer-Allee 204, 22769 Hamburg', city: 'Hamburg', lat: 53.5615, lng: 9.9425, website: 'https://waagenbau.com' },
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
      { name: 'Pacha München', address: 'Maximiliansplatz 5, 80333 München', city: 'München', lat: 48.1416, lng: 11.5693, website: 'https://pachamunich.de' },
      { name: 'MMA Club', address: 'Hans-Sachs-Str. 5, 80469 München', city: 'München', lat: 48.1310, lng: 11.5730, website: 'https://mma-club.de' },
      { name: 'Backstage', address: 'Reitknechtstr. 6, 80639 München', city: 'München', lat: 48.1520, lng: 11.5360, website: 'https://backstage.eu' },
      { name: 'Charlie', address: 'Maximiliansplatz 5, 80333 München', city: 'München', lat: 48.1418, lng: 11.5697, website: 'https://charlie-muenchen.de' },
      { name: 'Cord Club', address: 'Sonnenstr. 18, 80331 München', city: 'München', lat: 48.1375, lng: 11.5640, website: 'https://cord.club' },
      { name: 'Registratur', address: 'Blumenstr. 2, 80331 München', city: 'München', lat: 48.1345, lng: 11.5715, website: 'https://registratur-muenchen.de' },
      { name: 'Kong', address: 'Maximiliansplatz 5, 80333 München', city: 'München', lat: 48.1415, lng: 11.5690, website: 'https://kong-muenchen.de' },
      { name: 'Call me Drella', address: 'Maximiliansplatz 5, 80333 München', city: 'München', lat: 48.1419, lng: 11.5698, website: 'https://callmedrella.de' },
      { name: 'Crux', address: 'Entenbachstr. 67, 81541 München', city: 'München', lat: 48.1200, lng: 11.5880, website: 'https://crux-muenchen.de' },
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
      { name: 'Artheater', address: 'Ehrenfeldgürtel 127, 50823 Köln', city: 'Köln', lat: 50.9500, lng: 6.9250, website: 'https://artheater.de' },
      { name: 'Jungle Club', address: 'Hohenstaufenring 29, 50674 Köln', city: 'Köln', lat: 50.9320, lng: 6.9440, website: 'https://jungle-club-koeln.de' },
      { name: 'Subway', address: 'Aachener Str. 82, 50674 Köln', city: 'Köln', lat: 50.9365, lng: 6.9360, website: 'https://subway-koeln.de' },
      { name: 'CBE', address: 'Bartholomäus-Schink-Str. 8, 50825 Köln', city: 'Köln', lat: 50.9480, lng: 6.9200, website: 'https://cbekoeln.de' },
      { name: 'Essigfabrik', address: 'Siegburger Str. 110, 50679 Köln', city: 'Köln', lat: 50.9340, lng: 6.9780, website: 'https://essigfabrik.de' },
      { name: 'Yuca', address: 'Kyffhäuserstr. 28, 50674 Köln', city: 'Köln', lat: 50.9310, lng: 6.9450, website: 'https://yuca-koeln.de' },
      { name: 'Club Bahnhof Ehrenfeld', address: 'Bartholomäus-Schink-Str. 8, 50825 Köln', city: 'Köln', lat: 50.9482, lng: 6.9205, website: 'https://cbekoeln.de' },
      { name: 'Heinz Gaul', address: 'Vogelsanger Str. 200, 50825 Köln', city: 'Köln', lat: 50.9490, lng: 6.9150, website: 'https://heinzgaul.de' },
      { name: 'Tsunami Club', address: 'Im Ferkulum 9, 50678 Köln', city: 'Köln', lat: 50.9280, lng: 6.9590, website: 'https://tsunami-club.de' },
      { name: 'Blue Shell', address: 'Luxemburger Str. 32, 50674 Köln', city: 'Köln', lat: 50.9290, lng: 6.9400, website: 'https://blueshell.de' },
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
      { name: 'Gibson', address: 'Zeil 85-93, 60313 Frankfurt', city: 'Frankfurt', lat: 50.1150, lng: 8.6870, website: 'https://gibson-club.de' },
      { name: 'Batschkapp', address: 'Gwinnerstr. 5, 60388 Frankfurt', city: 'Frankfurt', lat: 50.1320, lng: 8.7200, website: 'https://batschkapp.de' },
      { name: 'Velvet Club', address: 'Weserstr. 17, 60329 Frankfurt', city: 'Frankfurt', lat: 50.1070, lng: 8.6620, website: 'https://velvet-ffm.de' },
      { name: 'Nachtleben', address: 'Kurt-Schumacher-Str. 45, 60313 Frankfurt', city: 'Frankfurt', lat: 50.1135, lng: 8.6795, website: 'https://nachtleben-ffm.de' },
      { name: 'Adlib', address: 'Gutleutstr. 294, 60327 Frankfurt', city: 'Frankfurt', lat: 50.0985, lng: 8.6420, website: 'https://adlib-ffm.de' },
      { name: 'King Kamehameha', address: 'Hanauer Landstr. 192, 60314 Frankfurt', city: 'Frankfurt', lat: 50.1120, lng: 8.7050, website: 'https://king-ka.de' },
      { name: 'Pik Dame', address: 'Berger Str. 175, 60385 Frankfurt', city: 'Frankfurt', lat: 50.1235, lng: 8.7020, website: 'https://pikdame.de' },
      { name: 'Dora Brilliant', address: 'Hamburger Allee 45, 60486 Frankfurt', city: 'Frankfurt', lat: 50.1180, lng: 8.6550, website: 'https://dorabrilliant.de' },
      { name: 'U60311', address: 'Roßmarkt 16, 60311 Frankfurt', city: 'Frankfurt', lat: 50.1128, lng: 8.6775, website: 'https://u60311.de' },
      { name: 'Centralstation', address: 'Im Carree 1, 64283 Darmstadt', city: 'Frankfurt', lat: 49.8715, lng: 8.6505, website: 'https://centralstation.de' },
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
      { name: 'Zakk', address: 'Fichtenstr. 40, 40233 Düsseldorf', city: 'Düsseldorf', lat: 51.2150, lng: 6.7950, website: 'https://zakk.de' },
      { name: 'Stone', address: 'Bolkerstr. 11, 40213 Düsseldorf', city: 'Düsseldorf', lat: 51.2268, lng: 6.7730, website: 'https://stone-duesseldorf.de' },
      { name: 'Rudas Studios', address: 'Birkenstr. 15, 40233 Düsseldorf', city: 'Düsseldorf', lat: 51.2140, lng: 6.7935, website: 'https://rudas-studios.de' },
      { name: 'Sir Walter', address: 'Heinrich-Heine-Allee 36, 40213 Düsseldorf', city: 'Düsseldorf', lat: 51.2255, lng: 6.7770, website: 'https://sirwalter.de' },
      { name: '3001', address: 'Franziusstr. 22, 40219 Düsseldorf', city: 'Düsseldorf', lat: 51.2130, lng: 6.7680, website: 'https://3001-duesseldorf.de' },
      { name: 'Stahlwerk', address: 'Ronsdorfer Str. 134, 40233 Düsseldorf', city: 'Düsseldorf', lat: 51.2120, lng: 6.8020, website: 'https://stahlwerk.de' },
      { name: 'Pretty Vacant', address: 'Bilker Allee 128, 40219 Düsseldorf', city: 'Düsseldorf', lat: 51.2170, lng: 6.7730, website: 'https://prettyvacant.de' },
      { name: 'Cube', address: 'Charlottenstr. 18, 40210 Düsseldorf', city: 'Düsseldorf', lat: 51.2225, lng: 6.7870, website: 'https://cube-duesseldorf.de' },
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
      { name: 'Rocker 33', address: 'Ludwigstr. 33, 70176 Stuttgart', city: 'Stuttgart', lat: 48.7770, lng: 9.1700, website: 'https://rocker33.com' },
      { name: 'Schocken', address: 'Hirschstr. 36, 70173 Stuttgart', city: 'Stuttgart', lat: 48.7750, lng: 9.1790, website: 'https://schocken.de' },
      { name: 'Lehmann Club', address: 'Neue Brücke 2, 70173 Stuttgart', city: 'Stuttgart', lat: 48.7740, lng: 9.1810, website: 'https://lehmannclub.de' },
      { name: 'Universum', address: 'Kronenstr. 20, 70173 Stuttgart', city: 'Stuttgart', lat: 48.7730, lng: 9.1780, website: 'https://universum-stuttgart.de' },
      { name: 'Goldmarks', address: 'Torstr. 18, 70173 Stuttgart', city: 'Stuttgart', lat: 48.7760, lng: 9.1770, website: 'https://goldmarks.de' },
      { name: 'Zwölfzehn', address: 'Rotebühlplatz 28, 70173 Stuttgart', city: 'Stuttgart', lat: 48.7755, lng: 9.1745, website: 'https://zwoelfzehn.de' },
      { name: 'Bar Romantica', address: 'Liststr. 34, 70180 Stuttgart', city: 'Stuttgart', lat: 48.7694, lng: 9.1812, website: 'https://bar-romantica.de' },
      { name: 'Kellerklub', address: 'Heusteigstr. 44, 70180 Stuttgart', city: 'Stuttgart', lat: 48.7680, lng: 9.1800, website: 'https://kellerklub-stuttgart.de' },
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
      { name: 'Elsterartig', address: 'Karl-Heine-Str. 93, 04229 Leipzig', city: 'Leipzig', lat: 51.3360, lng: 12.3410, website: 'https://elsterartig.de' },
      { name: 'TV Club', address: 'Gottschedstr. 16, 04109 Leipzig', city: 'Leipzig', lat: 51.3400, lng: 12.3710, website: 'https://tv-club.de' },
      { name: 'Felsenkeller', address: 'Karl-Heine-Str. 32, 04229 Leipzig', city: 'Leipzig', lat: 51.3340, lng: 12.3500, website: 'https://felsenkeller-leipzig.de' },
      { name: 'Täubchenthal', address: 'Antonio-Vivaldi-Str. 20, 04105 Leipzig', city: 'Leipzig', lat: 51.3480, lng: 12.3700, website: 'https://taeubchenthal.com' },
      { name: 'Ilses Erika', address: 'Bernhard-Göring-Str. 152, 04277 Leipzig', city: 'Leipzig', lat: 51.3210, lng: 12.3850, website: 'https://ilseserika.de' },
      { name: 'IfZ', address: 'An den Tierkliniken 38, 04103 Leipzig', city: 'Leipzig', lat: 51.3353, lng: 12.3940, website: 'https://ifz.me' },
      { name: 'Werk 2', address: 'Kochstr. 132, 04277 Leipzig', city: 'Leipzig', lat: 51.3240, lng: 12.3815, website: 'https://werk-2.de' },
      { name: 'Elipamanoke', address: 'Zschochersche Str. 48, 04229 Leipzig', city: 'Leipzig', lat: 51.3320, lng: 12.3440, website: 'https://elipamanoke.de' },
      { name: 'Darkflower', address: 'Südplatz 3, 04275 Leipzig', city: 'Leipzig', lat: 51.3275, lng: 12.3755, website: 'https://darkflower.club' },
      { name: 'Beyerhaus', address: 'Franz-Mehring-Str. 4, 04275 Leipzig', city: 'Leipzig', lat: 51.3290, lng: 12.3760, website: 'https://beyerhaus.de' },
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
      { name: 'Kraftwerk Mitte', address: 'Wettiner Platz 10, 01067 Dresden', city: 'Dresden', lat: 51.0510, lng: 13.7280, website: 'https://kraftwerk-mitte.de' },
      { name: 'Altes Wettbüro', address: 'Antonstr. 8, 01097 Dresden', city: 'Dresden', lat: 51.0620, lng: 13.7380, website: 'https://altes-wettbuero.de' },
      { name: 'Scheune', address: 'Alaunstr. 36-40, 01099 Dresden', city: 'Dresden', lat: 51.0645, lng: 13.7560, website: 'https://scheune.org' },
      { name: 'Groove Station', address: 'Katharinenstr. 11-13, 01099 Dresden', city: 'Dresden', lat: 51.0630, lng: 13.7410, website: 'https://groovestation.de' },
      { name: 'Strasse E', address: 'Werner-Hartmann-Str. 2, 01099 Dresden', city: 'Dresden', lat: 51.0660, lng: 13.7580, website: 'https://strasse-e.de' },
      { name: 'Industrial Terrain', address: 'Leipziger Str. 33, 01097 Dresden', city: 'Dresden', lat: 51.0615, lng: 13.7310, website: 'https://industrial-terrain.de' },
      { name: 'TBA', address: 'Könneritzstr. 25, 01067 Dresden', city: 'Dresden', lat: 51.0495, lng: 13.7210, website: 'https://tba-dresden.de' },
      { name: 'Bunker', address: 'Bremer Str. 18, 01067 Dresden', city: 'Dresden', lat: 51.0530, lng: 13.7245, website: 'https://bunker-dresden.de' },
    ],
  },
  {
    city: 'Hannover',
    currency: 'EUR',
    venues: [
      { name: 'Subkultur', address: 'Engelbosteler Damm 7, 30167 Hannover', city: 'Hannover', lat: 52.3840, lng: 9.7315, website: 'https://subkultur-hannover.de' },
      { name: 'Musikzentrum', address: 'Emil-Meyer-Str. 26, 30165 Hannover', city: 'Hannover', lat: 52.3880, lng: 9.7350, website: 'https://musikzentrum-hannover.de' },
      { name: 'Chez Heinz', address: 'Liepmannstr. 7b, 30453 Hannover', city: 'Hannover', lat: 52.3715, lng: 9.7120, website: 'https://chezheinz.de' },
      { name: 'Faust', address: 'Zur Bettfedernfabrik 3, 30451 Hannover', city: 'Hannover', lat: 52.3680, lng: 9.7200, website: 'https://faustev.de' },
      { name: 'Capitol', address: 'Schwarzer Bär 2, 30449 Hannover', city: 'Hannover', lat: 52.3720, lng: 9.7250, website: 'https://capitol-hannover.de' },
      { name: 'LUX', address: 'Schwarzer Bär 2, 30449 Hannover', city: 'Hannover', lat: 52.3722, lng: 9.7252, website: 'https://lux-hannover.de' },
      { name: 'Béi Chéz Heinz', address: 'Liepmannstr. 7b, 30453 Hannover', city: 'Hannover', lat: 52.3716, lng: 9.7122, website: 'https://chezheinz.de' },
      { name: 'Broncos', address: 'Schwarzer Bär 7, 30449 Hannover', city: 'Hannover', lat: 52.3718, lng: 9.7248, website: 'https://broncos-hannover.de' },
      { name: 'Kulturpalast', address: 'Deisterstr. 24, 30449 Hannover', city: 'Hannover', lat: 52.3660, lng: 9.7260, website: 'https://kulturpalast-hannover.de' },
      { name: 'Palo Palo', address: 'Raschplatz 7, 30161 Hannover', city: 'Hannover', lat: 52.3780, lng: 9.7420, website: 'https://palopalo.de' },
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
      { name: 'Fluc', address: 'Praterstern 5, 1020 Wien', city: 'Wien', lat: 48.2190, lng: 16.3910, website: 'https://fluc.at' },
      { name: 'Camera Club', address: 'Neubaugasse 2, 1070 Wien', city: 'Wien', lat: 48.2010, lng: 16.3530, website: 'https://camera-club.at' },
      { name: 'Dual', address: 'Burggasse 70, 1070 Wien', city: 'Wien', lat: 48.2035, lng: 16.3460, website: 'https://dual.wien' },
      { name: 'Celeste', address: 'Hamburger Str. 18, 1050 Wien', city: 'Wien', lat: 48.1890, lng: 16.3520, website: 'https://celeste.wien' },
      { name: 'Sass', address: 'Karlsplatz 1, 1010 Wien', city: 'Wien', lat: 48.2006, lng: 16.3696, website: 'https://sass.at' },
      { name: 'Rote Bar', address: 'Seilerstätte 9, 1010 Wien', city: 'Wien', lat: 48.2040, lng: 16.3755, website: 'https://rotebar.at' },
      { name: 'Volksgarten', address: 'Burgring 1, 1010 Wien', city: 'Wien', lat: 48.2065, lng: 16.3605, website: 'https://volksgarten.at' },
      { name: 'Vie i Pee', address: 'Goldschlagstr. 3, 1150 Wien', city: 'Wien', lat: 48.1960, lng: 16.3320, website: 'https://vieipee.at' },
      { name: 'Das Werk', address: 'Spittelauer Lände 12, 1090 Wien', city: 'Wien', lat: 48.2280, lng: 16.3592, website: 'https://daswerk.org' },
      { name: 'Elektro Gönner', address: 'Mariahilfer Str. 101, 1060 Wien', city: 'Wien', lat: 48.1975, lng: 16.3440, website: 'https://elektrogoenner.at' },
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
      { name: 'Kaufleuten', address: 'Pelikanstr. 18, 8001 Zürich', city: 'Zürich', lat: 47.3730, lng: 8.5350, website: 'https://kaufleuten.ch' },
      { name: 'Mascotte', address: 'Theaterstr. 10, 8001 Zürich', city: 'Zürich', lat: 47.3665, lng: 8.5410, website: 'https://mascotte.ch' },
      { name: 'Plaza', address: 'Badenerstr. 109, 8004 Zürich', city: 'Zürich', lat: 47.3760, lng: 8.5250, website: 'https://plaza-zurich.ch' },
      { name: 'Exil', address: 'Hardstr. 245, 8005 Zürich', city: 'Zürich', lat: 47.3870, lng: 8.5140, website: 'https://exil-zurich.ch' },
      { name: 'Frieda\'s Büxe', address: 'Friedaustr. 23, 8003 Zürich', city: 'Zürich', lat: 47.3720, lng: 8.5270, website: 'https://friedas-buexe.ch' },
      { name: 'Sender', address: 'Kalkbreitestr. 2, 8003 Zürich', city: 'Zürich', lat: 47.3740, lng: 8.5280, website: 'https://sender-zurich.ch' },
      { name: 'Papiersaal', address: 'Kalanderpl. 6, 8045 Zürich', city: 'Zürich', lat: 47.3700, lng: 8.5230, website: 'https://papiersaal.ch' },
      { name: 'Klaus', address: 'Hardstr. 25, 8004 Zürich', city: 'Zürich', lat: 47.3775, lng: 8.5260, website: 'https://klaus-zurich.ch' },
    ],
  },
];

/** Event templates per category with city-appropriate descriptions */
interface EventTemplate {
  readonly titleSuffix: string;
  readonly description: string;
  readonly category: EventCategory;
}

const TEMPLATES: readonly EventTemplate[] = [
  { titleSuffix: 'Klubnacht', description: 'Harter Techno auf dem Mainfloor. Industrieller Sound trifft auf pulsierende Basslines. Das Soundsystem liefert kompromisslose Beats bis in die frühen Morgenstunden.', category: EventCategory.TECHNO },
  { titleSuffix: 'Deep Sessions', description: 'Deep House und Melodic Techno verschmelzen zu einer hypnotischen Reise durch warme Klanglandschaften. Atmosphärisch, emotional, unvergesslich.', category: EventCategory.HOUSE },
  { titleSuffix: 'HipHop Jam', description: 'Die besten DJs der lokalen HipHop-Szene legen auf. Klassiker, Trap und neue Beats. Open Mic für MCs in der zweiten Hälfte.', category: EventCategory.HIPHOP },
  { titleSuffix: 'Noche Latina', description: 'Reggaeton, Salsa, Bachata und Cumbia! Die heißeste Latin-Party der Stadt mit Live-Percussion und Tanzworkshop ab 22 Uhr.', category: EventCategory.LATIN },
  { titleSuffix: 'Jazz Night', description: 'Live-Jazz mit internationalen Musikern. Improvisierte Sessions, klassische Standards und moderne Interpretationen in intimer Atmosphäre.', category: EventCategory.JAZZ },
  { titleSuffix: 'Electronica', description: 'Experimentelle elektronische Musik zwischen Ambient, IDM und Bass. Visuelle Kunstinstallationen begleiten den Abend.', category: EventCategory.ELECTRONIC },
  { titleSuffix: 'Mixed Vibes', description: 'Genre-übergreifende Nacht mit Live-Bands, DJs und Performance-Kunst. Von Disco über Funk bis zu modernen Club-Sounds.', category: EventCategory.MIXED },
  { titleSuffix: 'Acid Warehouse', description: 'Acid Techno und Industrial in roher Lagerhaus-Atmosphäre. Stroboskop, Nebel und knallharte 303-Basslines.', category: EventCategory.TECHNO },
  { titleSuffix: 'Afro House', description: 'Afrikanische Rhythmen treffen auf europäische House-Produktionen. Percussive Grooves und spirituelle Energie auf dem Dancefloor.', category: EventCategory.HOUSE },
  { titleSuffix: 'Open Air Vibes', description: 'Elektronische Musik unter freiem Himmel mit Food-Ständen und Chill-Areas. Perfekt für einen langen Abend an der frischen Luft.', category: EventCategory.ELECTRONIC },
  { titleSuffix: 'Urban Beats', description: 'Urbane Klangwelten zwischen UK Garage, Grime und Drum & Bass. Schnelle Beats und tiefe Bässe dominieren die Nacht.', category: EventCategory.HIPHOP },
  { titleSuffix: 'Minimal Monday', description: 'Reduzierter Minimal Techno zum Wochenstart. Hypnotische Loops, subtile Veränderungen und tiefe Konzentration auf der Tanzfläche.', category: EventCategory.TECHNO },
  { titleSuffix: 'Disco Inferno', description: 'Disco, Funk und Boogie aus den 70ern und 80ern. Spiegelkugel, Glitzer und gute Laune garantiert. Dresscode: Glamour!', category: EventCategory.MIXED },
  { titleSuffix: 'Tango Nacht', description: 'Argentinischer Tango mit Live-Orchester. Milonga ab 22 Uhr, vorher Tango-Schnupperkurs für Einsteiger.', category: EventCategory.LATIN },
  { titleSuffix: 'Drum & Bass Takeover', description: 'Die schnellsten Beats der Stadt! DnB, Jungle und Breakbeat auf zwei Floors. Massive Basslines und rasante Rhythmen.', category: EventCategory.ELECTRONIC },
  { titleSuffix: 'Night Shift', description: 'Düstere Techno-Klänge und treibende Beats für Nachtschwärmer. Minimalistisches Lichtdesign und wummernde Bässe bis zum Morgengrauen.', category: EventCategory.TECHNO },
  { titleSuffix: 'Soulful Sunday', description: 'Soulful House und Vocal House zum Sonntag. Warme Grooves, emotionale Vocals und eine entspannte Atmosphäre zum Ausklingen.', category: EventCategory.HOUSE },
  { titleSuffix: 'Rock the Floor', description: 'Live-Bands und Rock-DJs heizen die Nacht ein. Von Classic Rock über Punk bis Indie — hier wird die Bühne zum Moshpit.', category: EventCategory.ROCK },
  { titleSuffix: 'Pop Sensation', description: 'Die größten Pop-Hits der letzten Jahrzehnte, aufgelegt von den besten DJs der Stadt. Sing-Along garantiert!', category: EventCategory.POP },
  { titleSuffix: 'Techno Mittwoch', description: 'Mittwochs wird getanzt! Roher, ungefilterter Techno in bester Tradition. Kein Dresscode, keine Kompromisse, nur Musik.', category: EventCategory.TECHNO },
];

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=800',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
  'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
  'https://images.unsplash.com/photo-1571935436746-b21a8cddab6b?w=800',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
  'https://images.unsplash.com/photo-1598387993281-d5629f206ef9?w=800',
  'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800',
];

const EUR_PRICES = [null, '8 EUR', '10 EUR', '12 EUR', '14 EUR', '15 EUR', '18 EUR', '20 EUR', '22 EUR', '25 EUR', '30 EUR'];
const CHF_PRICES = [null, '10 CHF', '15 CHF', '20 CHF', '25 CHF', '30 CHF', '35 CHF', '40 CHF'];

/** Deterministic pseudo-random based on seed */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/** Create a city slug from the city name */
function citySlug(city: string): string {
  return city
    .toLowerCase()
    .replace(/ü/g, 'ue')
    .replace(/ö/g, 'oe')
    .replace(/ä/g, 'ae')
    .replace(/ß/g, 'ss');
}

function generateEvents(): readonly NormalizedEvent[] {
  const events: NormalizedEvent[] = [];
  const random = seededRandom(42);
  const now = new Date();
  const twoWeeksMs = 14 * 24 * 60 * 60 * 1000;

  for (const cityDef of CITY_VENUES) {
    const prices = cityDef.currency === 'CHF' ? CHF_PRICES : EUR_PRICES;
    const slug = citySlug(cityDef.city);
    let cityEventIndex = 0;

    for (const venue of cityDef.venues) {
      cityEventIndex++;
      const template = TEMPLATES[cityEventIndex % TEMPLATES.length]!;
      const imageUrl = UNSPLASH_IMAGES[(cityEventIndex - 1) % UNSPLASH_IMAGES.length]!;
      const price = prices[Math.floor(random() * prices.length)]!;

      // Spread events across the next 2 weeks
      const offsetMs = Math.floor(random() * twoWeeksMs);
      const startDate = new Date(now.getTime() + offsetMs);
      // Set start time between 20:00 and 00:00
      const startHour = 20 + Math.floor(random() * 5);
      startDate.setHours(startHour >= 24 ? 0 : startHour, Math.floor(random() * 4) * 15, 0, 0);
      if (startHour >= 24) {
        startDate.setDate(startDate.getDate() + 1);
      }

      // Duration between 4 and 10 hours
      const durationHours = 4 + Math.floor(random() * 7);
      const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

      const source = cityEventIndex % 2 === 0 ? 'eventbrite' as const : 'scraper' as const;
      const eventId = `${slug}-${String(cityEventIndex).padStart(3, '0')}`;

      events.push({
        sourceId: eventId,
        source,
        title: `${venue.name}: ${template.titleSuffix}`,
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

  // Count per city
  const cityCounts = new Map<string, number>();
  for (const event of events) {
    cityCounts.set(event.city, (cityCounts.get(event.city) ?? 0) + 1);
  }
  for (const [city, count] of cityCounts) {
    // eslint-disable-next-line no-console
    console.log(`  ${city}: ${count} events`);
  }

  const result = await upsertEventsToJson(events, outputPath);

  // eslint-disable-next-line no-console
  console.log(`Done! Inserted: ${result.inserted}, Updated: ${result.updated}, Errors: ${result.errors.length}`);
  // eslint-disable-next-line no-console
  console.log(`Output: ${outputPath}`);
}

void main();
