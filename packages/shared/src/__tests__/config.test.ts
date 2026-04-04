import { describe, it, expect } from 'vitest';
import { DEFAULT_RADIUS_KM, DEFAULT_CENTER } from '../constants/config';

describe('config constants', () => {
  it('DEFAULT_RADIUS_KM is 25', () => {
    expect(DEFAULT_RADIUS_KM).toBe(25);
  });

  it('DEFAULT_CENTER is Berlin coordinates', () => {
    expect(DEFAULT_CENTER.lat).toBe(52.52);
    expect(DEFAULT_CENTER.lng).toBe(13.405);
  });
});
