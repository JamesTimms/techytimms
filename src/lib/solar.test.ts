import { describe, expect, it } from 'vitest';

import { describeSky, solarDeclination, solarElevation, ukObserver } from '~/lib/solar';

/* Solar noon over Greenwich is within half a minute of 12:00 UTC, so these are
   read as the textbook noon elevations: 90 - latitude + declination. */
const summerNoon = new Date('2026-06-21T12:00:00Z');
const winterNoon = new Date('2026-12-21T12:00:00Z');
const equinoxNoon = new Date('2026-03-20T12:00:00Z');

describe('solarDeclination', () => {
  it('reaches the axial tilt at the solstices and zero at the equinox', () => {
    expect(solarDeclination(summerNoon)).toBeCloseTo(23.44, 1);
    expect(solarDeclination(winterNoon)).toBeCloseTo(-23.44, 1);
    // The cosine model costs about a degree at the equinoxes, which is the
    // price of not carrying an equation of time.
    expect(Math.abs(solarDeclination(equinoxNoon))).toBeLessThan(1.5);
  });
});

describe('solarElevation', () => {
  it('matches the noon elevation for the latitude', () => {
    expect(solarElevation(summerNoon)).toBeCloseTo(90 - 51.5 + 23.44, 0);
    expect(solarElevation(winterNoon)).toBeCloseTo(90 - 51.5 - 23.44, 0);
    expect(Math.abs(solarElevation(equinoxNoon) - (90 - 51.5))).toBeLessThan(1.5);
  });

  it('puts the sun below the horizon at midnight', () => {
    expect(solarElevation(new Date('2026-12-21T00:00:00Z'))).toBeLessThan(-50);
    expect(solarElevation(new Date('2026-06-21T00:00:00Z'))).toBeLessThan(0);
  });

  it('is symmetric about solar noon', () => {
    const before = solarElevation(new Date('2026-06-21T09:00:00Z'));
    const after = solarElevation(new Date('2026-06-21T15:00:00Z'));
    expect(before).toBeCloseTo(after, 0);
  });

  it('never leaves the range a sine can produce', () => {
    for (let hour = 0; hour < 24; hour += 1) {
      const elevation = solarElevation(new Date(Date.UTC(2026, 6, 4, hour)));
      expect(elevation).toBeGreaterThanOrEqual(-90);
      expect(elevation).toBeLessThanOrEqual(90);
    }
  });

  it('reads a different sky for a different observer', () => {
    const tropics = solarElevation(winterNoon, { latitude: 0, longitude: 0 });
    expect(tropics).toBeGreaterThan(solarElevation(winterNoon, ukObserver));
  });
});

describe('describeSky', () => {
  it('shows the sun above the horizon and the moon below it', () => {
    expect(describeSky(30).body).toBe('sun');
    expect(describeSky(0).body).toBe('sun');
    expect(describeSky(-0.5).body).toBe('moon');
  });

  it('raises the visible body as the sun gets further from the horizon', () => {
    expect(describeSky(0).height).toBe(0);
    expect(describeSky(31).height).toBeCloseTo(0.5, 1);
    // Either body, so a deep midwinter midnight lifts the moon rather than burying it.
    expect(describeSky(-31).height).toBeCloseTo(0.5, 1);
    expect(describeSky(85).height).toBe(1);
  });

  it('states the elevation in words for anyone who cannot see the picture', () => {
    expect(describeSky(12.4).label).toBe('Daytime: the sun is 12 degrees above the horizon.');
    expect(describeSky(-12.4).label).toBe('Night-time: the sun is 12 degrees below the horizon.');
  });
});
