import { describe, expect, it } from 'vitest';

import { cn } from '~/lib/cn';
import {
  clampPosition,
  clampRect,
  clampSize,
  defaultConstraints,
  handleDirections,
  maximisedRect,
  paletteDescriptions,
  resizeRect,
  titleBar,
  titleControl,
  windowFrame,
  windowPalettes,
} from '~/lib/window';

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

const viewport = { width: 1280, height: 800 };
const noBars = { top: 0, bottom: 0 };
const bars = { top: 32, bottom: 48 };

describe('clampSize', () => {
  it('leaves a size already within bounds untouched', () => {
    expect(clampSize(600, 400, viewport, noBars)).toEqual({ width: 600, height: 400 });
  });

  it('floors width and height at the minimums', () => {
    expect(clampSize(10, 10, viewport, noBars)).toEqual({
      width: defaultConstraints.minWidth,
      height: defaultConstraints.minHeight,
    });
  });

  it('caps width at the viewport when narrower than maxWidth', () => {
    const narrow = { width: 400, height: 800 };
    expect(clampSize(2000, 200, narrow, noBars).width).toBe(400);
  });

  it('caps height to leave both bars clear', () => {
    expect(clampSize(600, 5000, viewport, bars).height).toBe(
      viewport.height - bars.top - bars.bottom,
    );
  });
});

describe('clampPosition', () => {
  it('leaves a position already on screen untouched', () => {
    expect(clampPosition(100, 100, 600, 400, viewport, noBars)).toEqual({ left: 100, top: 100 });
  });

  it('does not let the frame be dragged fully off the left or right edge', () => {
    const { visibleEdge } = defaultConstraints;
    const width = 600;

    const draggedFarLeft = clampPosition(-5000, 100, width, 400, viewport, noBars);
    expect(draggedFarLeft.left).toBe(visibleEdge - width);

    const draggedFarRight = clampPosition(5000, 100, width, 400, viewport, noBars);
    expect(draggedFarRight.left).toBe(viewport.width - visibleEdge);
  });

  it('keeps the top at or below the top bar', () => {
    expect(clampPosition(0, -100, 600, 400, viewport, bars).top).toBe(bars.top);
  });

  it('keeps at least the visible edge clear of the bottom bar', () => {
    const result = clampPosition(0, 5000, 600, 400, viewport, bars);
    expect(result.top).toBe(viewport.height - bars.bottom - defaultConstraints.visibleEdge);
  });
});

describe('clampRect', () => {
  it('clamps size before position, so an oversized rect still lands on screen', () => {
    const rect = { left: -9000, top: -9000, width: 9000, height: 9000 };
    const result = clampRect(rect, viewport, bars);
    expect(result.width).toBeLessThanOrEqual(defaultConstraints.maxWidth);
    expect(result.height).toBeLessThanOrEqual(viewport.height - bars.top - bars.bottom);
    expect(result.left).toBeGreaterThanOrEqual(defaultConstraints.visibleEdge - result.width);
    expect(result.top).toBeGreaterThanOrEqual(bars.top);
  });
});

describe('maximisedRect', () => {
  it('fills the viewport width and the height left by both bars', () => {
    expect(maximisedRect(viewport, bars)).toEqual({
      left: 0,
      top: bars.top,
      width: viewport.width,
      height: viewport.height - bars.top - bars.bottom,
    });
  });

  it('is not capped at defaultConstraints.maxWidth/maxHeight on a large screen', () => {
    const wide = { width: 3000, height: 2000 };
    const result = maximisedRect(wide, noBars);
    expect(result.width).toBe(wide.width);
    expect(result.width).toBeGreaterThan(defaultConstraints.maxWidth);
    expect(result.height).toBe(wide.height);
    expect(result.height).toBeGreaterThan(defaultConstraints.maxHeight);
  });

  it('never goes negative when the bars claim more than the viewport', () => {
    const tiny = { width: 400, height: 50 };
    expect(maximisedRect(tiny, bars).height).toBe(0);
  });
});

describe('resizeRect', () => {
  const base = { left: 200, top: 150, width: 600, height: 400 };

  it('grows from the right/bottom edges without moving the frame', () => {
    const result = resizeRect(base, 'se', 50, 30, viewport, noBars);
    expect(result.width).toBe(650);
    expect(result.height).toBe(430);
    expect(result.left).toBe(base.left);
    expect(result.top).toBe(base.top);
  });

  it('growing from the left/top edges keeps the opposite edge anchored', () => {
    const result = resizeRect(base, 'nw', -50, -30, viewport, noBars);
    expect(result.width).toBe(650);
    expect(result.height).toBe(430);
    // The right edge (left + width) is unchanged.
    expect(result.left + result.width).toBe(base.left + base.width);
    expect(result.top + result.height).toBe(base.top + base.height);
  });

  it('does not shrink past the minimum size', () => {
    const result = resizeRect(base, 'e', -10000, 0, viewport, noBars);
    expect(result.width).toBe(defaultConstraints.minWidth);
  });

  it('shrinking from the west edge still anchors the east edge at the floor', () => {
    const result = resizeRect(base, 'w', 10000, 0, viewport, noBars);
    expect(result.width).toBe(defaultConstraints.minWidth);
    expect(result.left + result.width).toBe(base.left + base.width);
  });

  it('a single-axis handle leaves the other axis untouched', () => {
    const result = resizeRect(base, 'n', 999, -20, viewport, noBars);
    expect(result.width).toBe(base.width);
    expect(result.height).toBe(base.height + 20);
  });

  it('covers all eight compass directions', () => {
    expect(handleDirections).toHaveLength(8);
    for (const direction of handleDirections) {
      expect(() => resizeRect(base, direction, 10, 10, viewport, noBars)).not.toThrow();
    }
  });
});
