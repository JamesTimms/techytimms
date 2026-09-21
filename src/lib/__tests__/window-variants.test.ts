import { describe, expect, it } from 'vitest';

import { cn } from '~/lib/cn';
import {
  paletteDescriptions,
  titleBar,
  titleControl,
  windowFrame,
  windowPalettes,
} from '~/lib/window-variants';

// The MAIN step is a different absolute lightness per palette (Fallen Leaf's
// main colour sits at 80%, Pumpkin's at 70%), so it lands on a different step
// of the shared 50–900 scale for each.
const mainStep: Record<(typeof windowPalettes)[number], number> = {
  'fallen-leaf': 200,
  pumpkin: 300,
};

describe('windowFrame', () => {
  it('defaults to Fallen Leaf, the live palette', () => {
    expect(windowFrame()).toBe(windowFrame({ palette: 'fallen-leaf' }));
  });

  it('keeps an explicit edge in both palettes, one step for both themes', () => {
    // The face cannot mark the window against the wallpaper in either theme,
    // and step 500 is the one band that clears 3:1 on both wallpapers, so the
    // edge no longer swaps.
    for (const palette of windowPalettes) {
      const classes = windowFrame({ palette });
      expect(classes).toMatch(/\sborder-\w+-500\b/);
      expect(classes).not.toMatch(/\sdark:border-/);
    }
  });

  it('draws the face from a light tint, never from the main colour', () => {
    // ink-faint is 2.54 on a surface at the main colour's own lightness.
    // Step 50 is the tint the face has to use instead.
    for (const palette of windowPalettes) {
      const classes = windowFrame({ palette });
      expect(classes).toMatch(/\sbg-\w+-50\b/);
      expect(classes).not.toMatch(new RegExp(`\\sbg-\\w+-${mainStep[palette]}\\b`));
    }
  });

  it('carries no bevel in either palette', () => {
    for (const palette of windowPalettes) {
      expect(windowFrame({ palette })).not.toContain('bevel');
    }
  });
});

describe('titleBar', () => {
  it('does not flip with the theme, unlike the frame', () => {
    for (const palette of windowPalettes) {
      expect(titleBar({ palette })).not.toContain('dark:bg-');
    }
  });

  it('rules off the bar in light mode and draws nothing internal in dark', () => {
    for (const palette of windowPalettes) {
      expect(titleBar({ palette })).toMatch(new RegExp(`\\sborder-\\w+-${mainStep[palette]}\\b`));
      expect(titleBar({ palette })).toContain('dark:border-b-0');
    }
  });
});

describe('titleControl', () => {
  it('is only pressable when asked, so decorative spans get no cursor', () => {
    expect(titleControl({ pressable: true })).toContain('cursor-pointer');
    expect(titleControl({ pressable: false })).not.toContain('cursor-pointer');
  });

  it('gives a hover and pressed fill only to the control that can be pressed', () => {
    for (const palette of windowPalettes) {
      expect(titleControl({ palette, pressable: true })).toContain('hover:bg-');
      expect(titleControl({ palette, pressable: true })).toContain('active:bg-');
      expect(titleControl({ palette, pressable: false })).not.toContain('hover:bg-');
    }
  });
});

describe('paletteDescriptions', () => {
  it('describes every palette, so the styleguide cannot render a blank one', () => {
    for (const palette of windowPalettes) {
      expect(paletteDescriptions[palette]).toBeTruthy();
    }
  });
});

describe('cn', () => {
  it('lets a later utility win over an earlier one', () => {
    expect(cn('bg-sunk', 'bg-surface')).toBe('bg-surface');
  });
});
