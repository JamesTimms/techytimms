import { describe, expect, it } from 'vitest';
import {
  cssBlock,
  hexToRgb01,
  hexToOklch,
  isInSrgbGamut,
  oklchToHex,
  parseColorTokens,
  parseThemedColorTokens,
  requireToken,
} from '~/lib/color-tokens';

describe('oklchToHex', () => {
  it('converts pure white and black', () => {
    expect(oklchToHex({ l: 1, c: 0, h: 0 })).toBe('#ffffff');
    expect(oklchToHex({ l: 0, c: 0, h: 0 })).toBe('#000000');
  });
});

describe('hexToOklch', () => {
  it('round-trips through oklchToHex', () => {
    for (const hex of ['#ffffff', '#000000', '#c2410c', '#3b82f6', '#7a5c3e']) {
      expect(oklchToHex(hexToOklch(hex))).toBe(hex);
    }
  });
});

describe('hexToRgb01', () => {
  it('inverts oklchToHex’s own byte rounding', () => {
    expect(hexToRgb01('#ffffff')).toEqual([1, 1, 1]);
    expect(hexToRgb01('#000000')).toEqual([0, 0, 0]);
    expect(hexToRgb01('#8040c0')[1]).toBeCloseTo(0x40 / 255, 6);
  });

  it('throws on a value that is not #rrggbb', () => {
    expect(() => hexToRgb01('white')).toThrow(/not a #rrggbb/);
  });
});

describe('isInSrgbGamut', () => {
  it('accepts achromatic colours at any lightness', () => {
    expect(isInSrgbGamut({ l: 0.5, c: 0, h: 0 })).toBe(true);
  });

  it('rejects chroma sRGB cannot display at that lightness and hue', () => {
    expect(isInSrgbGamut({ l: 0.5, c: 0.35, h: 145 })).toBe(false);
  });
});

describe('parseColorTokens', () => {
  it('extracts name, numeric value and the literal source text', () => {
    const tokens = parseColorTokens('--color-ink: oklch(24% 0.03 85);');
    const ink = requireToken(tokens, 'ink');
    expect(ink.oklch).toEqual({ l: 0.24, c: 0.03, h: 85 });
    expect(ink.oklchText).toBe('24% 0.03 85');
    expect(ink.hex).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('reads an optional alpha', () => {
    const menuBar = requireToken(parseColorTokens('--color-elevation-1: oklch(97% 0.02 60 / 0.55);'), 'elevation-1');
    expect(menuBar.oklch).toEqual({ l: 0.97, c: 0.02, h: 60, alpha: 0.55 });
    expect(menuBar.oklchText).toBe('97% 0.02 60 / 0.55');
  });

  it('ignores declarations that are not oklch colours', () => {
    const tokens = parseColorTokens('--radius-panel: 0px;');
    expect(tokens).toEqual({});
  });
});

describe('cssBlock', () => {
  it('extracts a top-level block without being truncated by a nested rule', () => {
    const css = '@theme { --color-a: oklch(50% 0 0); .nested { color: red; } }';
    expect(cssBlock(css, '@theme')).toContain('--color-a');
    expect(cssBlock(css, '@theme')).toContain('.nested');
  });

  it('throws for an unbalanced block', () => {
    expect(() => cssBlock('@theme { unterminated', '@theme')).toThrow(/unbalanced/);
  });
});

describe('parseThemedColorTokens', () => {
  it('layers .dark overrides on top of every light token', () => {
    const css = `
      @theme {
        --color-ink: oklch(24% 0.03 85);
        --color-leaf-900: oklch(14% 0.025 80);
      }
      .dark {
        --color-ink: oklch(93% 0.014 85);
      }
    `;
    const { light, dark } = parseThemedColorTokens(css);
    expect(requireToken(light, 'ink').oklchText).toBe('24% 0.03 85');
    expect(requireToken(dark, 'ink').oklchText).toBe('93% 0.014 85');
    // Ramp tokens carry no .dark override — the same step in both themes.
    expect(requireToken(dark, 'leaf-900').oklchText).toBe(requireToken(light, 'leaf-900').oklchText);
  });
});
