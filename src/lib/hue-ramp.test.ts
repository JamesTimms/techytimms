import { describe, expect, it } from 'vitest';
import { isInSrgbGamut } from '~/lib/color-tokens';
import {
  assignFamily,
  deviationFromPureStep,
  deviationReason,
  formatOklch,
  gamutMaxRamp,
  hueDelta,
  isMeaningfulDeviation,
  maxChromaInGamut,
  nearestRampStep,
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

describe('nearestRampStep', () => {
  it('finds the closest published step regardless of distance', () => {
    expect(nearestRampStep(14).step).toBe(900);
    expect(nearestRampStep(80).step).toBe(200); // 0.1 off 80.1, still nearest
    expect(nearestRampStep(55).step).toBe(500); // 51.8 (3.2 away) beats 42.3 (12.7 away)
  });

  it('picks 500 for a lightness roughly in the middle of the scale', () => {
    expect(nearestRampStep(50).step).toBe(500);
  });
});

describe('formatOklch', () => {
  it('renders one caption format for both live and derived swatches', () => {
    expect(formatOklch({ l: 0.14, c: 0.025, h: 80 })).toBe('14.0% 0.025 80');
  });
});

describe('hueDelta', () => {
  it('returns a plain signed difference away from the wheel seam', () => {
    expect(hueDelta(44, 55)).toBe(-11);
    expect(hueDelta(55, 44)).toBe(11);
    expect(hueDelta(55, 55)).toBe(0);
  });

  it('takes the short way round the 0/360 seam', () => {
    expect(hueDelta(5, 355)).toBe(10);
    expect(hueDelta(355, 5)).toBe(-10);
  });
});

describe('assignFamily', () => {
  const families = [
    { key: 'leaf', hue: 80 },
    { key: 'neutral', hue: 55 },
  ];

  it('matches a family only on an exact hue', () => {
    expect(assignFamily(55, families, 'accent')).toBe('neutral');
    expect(assignFamily(80, families, 'accent')).toBe('leaf');
  });

  it('falls back for a hue that matches no family, even a near miss', () => {
    expect(assignFamily(54, families, 'accent')).toBe('accent');
    expect(assignFamily(39, families, 'accent')).toBe('accent');
  });
});

describe('deviationFromPureStep', () => {
  it('reports zero deltas for a colour that already sits on the pure curve', () => {
    const pureAt600 = { l: 0.423, c: maxChromaInGamut(0.423, 55), h: 55 };
    const deviation = deviationFromPureStep(pureAt600, 55);
    expect(deviation.step).toBe(600);
    expect(deviation.deltaL).toBeCloseTo(0, 6);
    expect(deviation.deltaC).toBeCloseTo(0, 6);
    expect(deviation.deltaH).toBe(0);
  });

  it('measures a real deviation on all three axes', () => {
    // title-bar: oklch(38% 0.105 39), compared against the pumpkin family (hue 55).
    const deviation = deviationFromPureStep({ l: 0.38, c: 0.105, h: 39 }, 55);
    expect(deviation.step).toBe(600); // nearest published step to 38% is 42.3%
    expect(deviation.deltaL).toBeCloseTo(-4.3, 1);
    expect(deviation.deltaH).toBe(-16);
  });
});

describe('isMeaningfulDeviation', () => {
  it('ignores a deviation inside every threshold', () => {
    expect(isMeaningfulDeviation({ step: 500, pure: { l: 0.5, c: 0.1, h: 55 }, deltaL: 0.1, deltaC: 0.005, deltaH: 1 })).toBe(false);
  });

  it('flags a deviation that crosses any one threshold', () => {
    expect(isMeaningfulDeviation({ step: 500, pure: { l: 0.5, c: 0.1, h: 55 }, deltaL: 0, deltaC: 0, deltaH: 16 })).toBe(true);
  });
});

describe('deviationReason', () => {
  it('explains a hue shift as a chroma-budget trade when the numbers support it', () => {
    const oklch = { l: 0.38, c: 0.105, h: 39 };
    const deviation = deviationFromPureStep(oklch, 55);
    expect(deviationReason(oklch, deviation)).toMatch(/hue shifted/);
  });
});
