/** Geographic region for filtering events */
export interface Region {
  readonly id: string;
  readonly name: string;
  readonly centerLat: number;
  readonly centerLng: number;
  readonly radiusKm: number;
}
