// Deep links into two external OKLCH tools, generated at build time so the
// styleguide never hand-maintains a URL a ramp could drift out of sync with.

// Default import, not named: lz-string ships as a single CommonJS
// `module.exports = {...}` object, and Astro's prerenderer runs the built
// output through Node's real ESM loader, which — unlike Vite/esbuild's more
// permissive dev-time interop — only synthesises a `default` export for a
// plain CJS module, not named ones.
import LZString from 'lz-string';
import type { Oklch } from '~/lib/color-tokens';

const { compressToEncodedURIComponent } = LZString;

export const HUETONE_TONES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const;

export interface HuetoneHue {
  name: string;
  /** Ten hex swatches, 50 through 900, matching HUETONE_TONES. */
  colors: string[];
}

// huetone.ardov.me reads this exact shape off `?palette=` — {name, hues, tones}
// — decoded with lz-string's own decompressFromEncodedURIComponent, so this
// has to use the matching compress call, not a generic base64 encoding.
export function huetonePaletteUrl(name: string, hues: HuetoneHue[]): string {
  const palette = { name, hues, tones: [...HUETONE_TONES] };
  return `https://huetone.ardov.me/?palette=${compressToEncodedURIComponent(JSON.stringify(palette))}`;
}

// oklch-palette.vercel.app seeds itself from a `#L,C,H,A` hash fragment, read
// via `location.hash.slice(1).split(',')` in its own source — L is a percent,
// A is alpha out of 100 (not a fourth colour channel), so a fully opaque seed
// always ends in ",100".
export function oklchPaletteUrl(oklch: Oklch): string {
  const lightnessPercent = (oklch.l * 100).toFixed(2);
  const chroma = oklch.c.toFixed(3);
  return `https://oklch-palette.vercel.app/#${lightnessPercent},${chroma},${oklch.h},100`;
}
