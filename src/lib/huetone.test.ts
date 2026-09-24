import LZString from 'lz-string';
import { describe, expect, it } from 'vitest';
import { huetonePaletteUrl, oklchPaletteUrl } from '~/lib/huetone';

describe('huetonePaletteUrl', () => {
  it('round-trips the palette back to the exact JSON huetone expects', () => {
    const hues = [
      { name: 'leaf', colors: ['#f9f4eb', '#1c160d', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000'] },
    ];
    const url = huetonePaletteUrl('techytimms', hues);
    const prefix = 'https://huetone.ardov.me/?palette=';
    expect(url.startsWith(prefix)).toBe(true);

    const decoded = JSON.parse(LZString.decompressFromEncodedURIComponent(url.slice(prefix.length)));
    expect(decoded).toEqual({
      name: 'techytimms',
      hues,
      tones: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
    });
  });
});

describe('oklchPaletteUrl', () => {
  it('formats lightness as a percent to two decimal places, chroma to three, hue raw, alpha 100', () => {
    expect(oklchPaletteUrl({ l: 0.5178, c: 0.0506, h: 80 })).toBe(
      'https://oklch-palette.vercel.app/#51.78,0.051,80,100',
    );
  });
});
