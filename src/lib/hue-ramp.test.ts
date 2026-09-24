import { describe, expect, it } from 'vitest';
import { isInSrgbGamut } from '~/lib/color-tokens';
import {
  formatOklch,
  gamutMaxRamp,
  matchStepForLightness,
  maxChromaInGamut,
  tokensForHue,
} from '~/lib/hue-ramp';

describe('maxChromaInGamut', () => {
  it('shrinks toward the extremes, where sRGB has almost no chroma to give', () => {
    // Not exactly zero at l=0/1 — the cubic OKLab→LMS terms let a sliver of
    // chroma round-trip within isInSrgbGamut's epsilon even at pure black or
    // white — but it stays far below the ceiling at a working lightness.
    expect(maxChromaInGamut(0, 85)).toBeLessThan(0.05);
    expect(maxChromaInGamut(1, 85)).toBeLessThan(0.05);
    expect(maxChromaInGamut(0.5, 85)).toBeGreaterThan(0.05);
  });

  it('finds a chroma just inside the gamut boundary', () => {
    const cap = maxChromaInGamut(0.5, 40);
    expect(isInSrgbGamut({ l: 0.5, c: cap, h: 40 })).toBe(true);
    expect(isInSrgbGamut({ l: 0.5, c: cap + 0.01, h: 40 })).toBe(false);
  });

  it('varies by hue at the same lightness, since hues clip at different rates', () => {
    // hue 85 (warm neutral) and hue 55 (pumpkin/russet) sit far enough apart
    // on the wheel that their sRGB ceilings at mid-lightness are not equal.
    expect(maxChromaInGamut(0.5, 85)).not.toBeCloseTo(maxChromaInGamut(0.5, 55), 3);
  });
});

describe('gamutMaxRamp', () => {
  it('returns all ten steps, each within the sRGB gamut', () => {
    const ramp = gamutMaxRamp(85);
    expect(ramp).toHaveLength(10);
    expect(ramp.map((swatch) => swatch.step)).toEqual([
      50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
    ]);
    for (const swatch of ramp) {
      expect(isInSrgbGamut(swatch.oklch)).toBe(true);
      expect(swatch.hex).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});

describe('matchStepForLightness', () => {
  it('matches a lightness within a tenth of a percent of a published step', () => {
    expect(matchStepForLightness(14)).toBe(900);
    expect(matchStepForLightness(80.1)).toBe(200);
    expect(matchStepForLightness(80)).toBe(200); // within tolerance, not exact
  });

  it('returns null for a lightness that sits off every step', () => {
    expect(matchStepForLightness(55)).toBeNull();
    expect(matchStepForLightness(42)).toBeNull(); // 0.3 from step 600 (42.3) — too far
  });
});

describe('formatOklch', () => {
  it('renders one caption format for both live and derived swatches', () => {
    expect(formatOklch({ l: 0.14, c: 0.025, h: 80 })).toBe('14.0% 0.025 80');
  });
});

describe('tokensForHue', () => {
  const tokens = {
    ink: { oklch: { l: 0.24, c: 0.03, h: 85 }, oklchText: '24% 0.03 85', hex: '#000000' },
    ground: { oklch: { l: 0.985, c: 0.006, h: 85 }, oklchText: '98.5% 0.006 85', hex: '#ffffff' },
    accent: { oklch: { l: 0.42, c: 0.125, h: 40 }, oklchText: '42% 0.125 40', hex: '#000000' },
    'leaf-900': { oklch: { l: 0.14, c: 0.025, h: 80 }, oklchText: '14% 0.025 80', hex: '#000000' },
  };

  it('filters to the given hue and reports each token’s matched step', () => {
    const usage = tokensForHue(tokens, 85);
    expect(usage.map((entry) => entry.name)).toEqual(['ground', 'ink']);
    expect(usage.find((entry) => entry.name === 'ink')?.step).toBeNull();
  });

  it('excludes a ramp’s own steps from its own row', () => {
    const usage = tokensForHue(tokens, 80, 'leaf-');
    expect(usage).toEqual([]);
  });
});
