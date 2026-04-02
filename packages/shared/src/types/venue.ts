/** Venue where events take place */
export interface Venue {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly city: string;
  readonly lat: number;
  readonly lng: number;
  readonly website: string | null;
  readonly imageUrl: string | null;
}
