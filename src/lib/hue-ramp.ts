// Builds comparison ramps for the styleguide's "every hue in the palette"
// listing, and matches real tokens onto them. Nothing here writes a token —
// see src/data/color-system.ts for that disclaimer.

import { isInSrgbGamut, oklchToHex, type ColorToken, type Oklch } from '~/lib/color-tokens';

// The exact 50–900 lightness scale the live `leaf` and `pumpkin` ramps use
// (global.css), so every hue's step 500 shares one lightness. Percent, not a
// 0–1 fraction, because every figure this scale is compared against on the
// page (a token's parsed `oklch.l * 100`) is naturally a percent.
export const RAMP_LIGHTNESS_STEPS: { step: number; lightnessPercent: number }[] = [
  { step: 50, lightnessPercent: 99 },
  { step: 100, lightnessPercent: 89.6 },
  { step: 200, lightnessPercent: 80.1 },
  { step: 300, lightnessPercent: 70.7 },
  { step: 400, lightnessPercent: 61.2 },
  { step: 500, lightnessPercent: 51.8 },
  { step: 600, lightnessPercent: 42.3 },
  { step: 700, lightnessPercent: 32.9 },
  { step: 800, lightnessPercent: 23.4 },
  { step: 900, lightnessPercent: 14 },
];

// A token written to whole-number or one-decimal precision that lands within
// a tenth of a step's published lightness is indistinguishable from having
// been placed on that step; anything further apart is a real difference, not
// rounding, and is reported as off-scale instead.
const STEP_MATCH_TOLERANCE_PERCENT = 0.1;

export function matchStepForLightness(lightnessPercent: number): number | null {
  const step = RAMP_LIGHTNESS_STEPS.find(
    ({ lightnessPercent: stepLightness }) =>
      Math.abs(stepLightness - lightnessPercent) <= STEP_MATCH_TOLERANCE_PERCENT,
  );
  return step ? step.step : null;
}

// Binary search rather than a closed form — OKLCH's gamut boundary has no
// simple expression, so the cap is found the same way any renderer clips it,
// just ahead of time and without silently discarding the excess.
export function maxChromaInGamut(lightness: number, hue: number, precision = 0.0005): number {
  let low = 0;
  let high = 0.4; // comfortably beyond any sRGB chroma ceiling at any lightness
  while (high - low > precision) {
    const mid = (low + high) / 2;
    if (isInSrgbGamut({ l: lightness, c: mid, h: hue })) low = mid;
    else high = mid;
  }
  return low;
}

export interface RampSwatch {
  step: number;
  oklch: Oklch;
  hex: string;
}

// Every step's chroma is the sRGB ceiling at that lightness and hue — not an
// interpolation between hand-picked control points the way the live leaf and
// pumpkin ramps are built. That makes this comparison-only: it shows what the
// hue could carry, not a value anyone has chosen to ship.
export function gamutMaxRamp(hue: number): RampSwatch[] {
  return RAMP_LIGHTNESS_STEPS.map(({ step, lightnessPercent }) => {
    const l = lightnessPercent / 100;
    const oklch: Oklch = { l, c: maxChromaInGamut(l, hue), h: hue };
    return { step, oklch, hex: oklchToHex(oklch) };
  });
}

// One caption format for both a live ramp step (parsed from global.css) and
// a derived one (searched by gamutMaxRamp), so the two read as one table.
export function formatOklch({ l, c, h }: Oklch): string {
  return `${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h}`;
}

export interface HueTokenUsage {
  name: string;
  lightnessPercent: number;
  step: number | null;
}

// Every token at a given hue, with the ramp step (if any) its lightness
// lands on — `excludeNamePrefix` drops a live ramp's own steps (`leaf-`,
// `pumpkin-`) from its own row, where they'd trivially "match" every step.
export function tokensForHue(
  tokens: Record<string, ColorToken>,
  hue: number,
  excludeNamePrefix?: string,
): HueTokenUsage[] {
  return Object.entries(tokens)
    .filter(
      ([name, token]) =>
        token.oklch.h === hue && !(excludeNamePrefix && name.startsWith(excludeNamePrefix)),
    )
    .map(([name, token]) => {
      const lightnessPercent = token.oklch.l * 100;
      return { name, lightnessPercent, step: matchStepForLightness(lightnessPercent) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
