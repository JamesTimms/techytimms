// Builds comparison ramps for the styleguide's "every hue in the palette"
// listing, and matches real tokens onto them. Nothing here writes a token —
// see src/data/color-system.ts for that disclaimer.

import { isInSrgbGamut, oklchToHex, type Oklch } from '~/lib/color-tokens';

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

// The closest published step to a given lightness, however far away — for
// siting a real token's deviation from the family curve, not for deciding
// whether it counts as "on" a step.
export function nearestRampStep(lightnessPercent: number): { step: number; lightnessPercent: number } {
  return RAMP_LIGHTNESS_STEPS.reduce((closest, candidate) =>
    Math.abs(candidate.lightnessPercent - lightnessPercent) <
    Math.abs(closest.lightnessPercent - lightnessPercent)
      ? candidate
      : closest,
  );
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

// Circular hue difference in [-180, 180] — positive means `a` sits clockwise
// of `b`. Plain subtraction breaks near the 0/360 seam; nothing in this
// system's live hues is near that seam today, but the formula is cheap to
// get right once rather than to half-remember later.
export function hueDelta(a: number, b: number): number {
  const wrapped = ((((a - b + 180) % 360) + 360) % 360) - 180;
  return wrapped === -180 ? 180 : wrapped;
}

export interface HueFamily {
  key: string;
  hue: number;
}

// Exact match, not nearest: every non-link token's hue is parsed straight off
// the literal CSS text (color-tokens.ts's regex), never computed, so there is
// no float drift to tolerate — a token either sits precisely on a family's
// hue or it doesn't. Anything that matches none of `families` falls to
// `fallback` (the accent hue-drift band, in practice).
export function assignFamily(hue: number, families: HueFamily[], fallback: string): string {
  return families.find((family) => family.hue === hue)?.key ?? fallback;
}

export interface StepDeviation {
  step: number;
  pure: Oklch;
  /** Percentage points. */
  deltaL: number;
  deltaC: number;
  /** Degrees, signed — see hueDelta. */
  deltaH: number;
}

// A live token's distance from the "pure" value at its own nearest step: that
// step's own lightness, the family's base hue, and the gamut ceiling for that
// lightness/hue pair — never the token's own hue or chroma, so the deltas
// show exactly what the token spent to be different.
export function deviationFromPureStep(oklch: Oklch, familyHue: number): StepDeviation {
  const { step, lightnessPercent } = nearestRampStep(oklch.l * 100);
  const pure: Oklch = {
    l: lightnessPercent / 100,
    c: maxChromaInGamut(lightnessPercent / 100, familyHue),
    h: familyHue,
  };
  return {
    step,
    pure,
    deltaL: oklch.l * 100 - lightnessPercent,
    deltaC: oklch.c - pure.c,
    deltaH: hueDelta(oklch.h, familyHue),
  };
}

// Thresholds: 1 JND (0.02, see Goals) on the chroma axis; lightness gets the
// same figure read as percentage points; hue only registers past a few
// degrees, since drift is inert until chroma makes it visible (also Goals).
const DEVIATION_LIGHTNESS_THRESHOLD_PERCENT = 2;
const DEVIATION_CHROMA_THRESHOLD = 0.02;
const DEVIATION_HUE_THRESHOLD_DEGREES = 3;

export function isMeaningfulDeviation({ deltaL, deltaC, deltaH }: StepDeviation): boolean {
  return (
    Math.abs(deltaL) > DEVIATION_LIGHTNESS_THRESHOLD_PERCENT ||
    Math.abs(deltaC) > DEVIATION_CHROMA_THRESHOLD ||
    Math.abs(deltaH) > DEVIATION_HUE_THRESHOLD_DEGREES
  );
}

// A one-line, computed guess at why a token strayed from the pure curve —
// never hand-written per token, so retuning a value can't leave stale prose
// describing an old one. Chroma budget first: a hue shift usually happens
// because the gamut allows more chroma there at the same lightness. Both caps
// are read at the step's own lightness (`deviation.pure.l`), not the token's
// raw one, so "at the same lightness" is literally true even when the token
// also carries a small ΔL of its own.
export function deviationReason(oklch: Oklch, deviation: StepDeviation): string {
  const chromaCapAtOwnHue = maxChromaInGamut(deviation.pure.l, oklch.h);
  const chromaCapAtFamilyHue = deviation.pure.c;

  if (
    Math.abs(deviation.deltaH) > DEVIATION_HUE_THRESHOLD_DEGREES &&
    chromaCapAtOwnHue > chromaCapAtFamilyHue + 0.01
  ) {
    return `hue shifted ${Math.abs(deviation.deltaH).toFixed(0)}° toward ${oklch.h}°, where the gamut allows ${chromaCapAtOwnHue.toFixed(3)} chroma against ${chromaCapAtFamilyHue.toFixed(3)} at the family hue — more headroom at the same lightness.`;
  }
  if (Math.abs(deviation.deltaC) > DEVIATION_CHROMA_THRESHOLD) {
    return deviation.deltaC < 0
      ? 'chroma pulled back below the gamut ceiling — restrained deliberately rather than reaching for maximum saturation.'
      : "chroma raised past the family's own curve at this lightness.";
  }
  return 'lightness retuned off the shared scale, likely for its own contrast pair.';
}
