import { describe, expect, it } from 'vitest';
import { apcaContrast, apcaContrastHex } from '~/lib/apca';

const white = { l: 1, c: 0, h: 0 };
const black = { l: 0, c: 0, h: 0 };

describe('apcaContrast', () => {
  it('matches the published reference value for black text on white', () => {
    expect(apcaContrast(black, white)).toBeCloseTo(106.04, 2);
  });

  it('matches the published reference value for white text on black', () => {
    expect(apcaContrast(white, black)).toBeCloseTo(-107.88, 2);
  });

  it('returns zero for identical text and background', () => {
    expect(apcaContrast(white, white)).toBe(0);
    expect(apcaContrast(black, black)).toBe(0);
  });

  it('is positive for dark-on-light and negative for light-on-dark', () => {
    const mid = { l: 0.5, c: 0, h: 0 };
    expect(apcaContrast(black, mid)).toBeGreaterThan(0);
    expect(apcaContrast(white, mid)).toBeLessThan(0);
  });

  it('grows in magnitude as the lightness gap widens', () => {
    const near = apcaContrast({ l: 0.4, c: 0, h: 0 }, white);
    const far = apcaContrast({ l: 0.1, c: 0, h: 0 }, white);
    expect(far).toBeGreaterThan(near);
  });
});

describe('apcaContrastHex', () => {
  it('matches apcaContrast on the same colours via OKLCH black/white', () => {
    expect(apcaContrastHex('#000000', '#ffffff')).toBeCloseTo(apcaContrast(black, white), 6);
    expect(apcaContrastHex('#ffffff', '#000000')).toBeCloseTo(apcaContrast(white, black), 6);
  });
});
