import { describe, expect, it } from 'vitest';

import {
  dockBar,
  dockClusterPlacements,
  dockDarkStep,
  dockNav,
  dockPositions,
  dockRegion,
  dockSizes,
  dockSteps,
  shortcutInset,
  shortcutTopInset,
} from '~/lib/dock-variants';

const verticalPositions = ['left', 'right'] as const;

describe('dockBar', () => {
  it('defaults to a centred cluster on the bottom edge', () => {
    expect(dockBar()).toBe(dockBar({ position: 'bottom', cluster: 'middle' }));
  });

  it('centres the cluster on the bar in every position', () => {
    // A three-track grid with the cluster in the middle `auto` track: the side
    // regions cannot push it off centre however long their contents run.
    for (const position of dockPositions) {
      expect(dockBar({ position })).toContain('grid-cols-[1fr_auto_1fr]');
    }

    for (const position of verticalPositions) {
      expect(dockBar({ position })).toContain('lg:grid-rows-[1fr_auto_1fr]');
    }
  });

  it('packs the cluster against the end it is placed at', () => {
    // The elastic track is on the far side of the cluster, so the free space
    // is all on one side of it.
    expect(dockBar({ cluster: 'left' })).toContain('grid-cols-[auto_auto_1fr]');
    expect(dockBar({ cluster: 'right' })).toContain('grid-cols-[1fr_auto_auto]');
  });

  it('lays out two tracks, not three, when there is no cluster', () => {
    expect(dockBar({ cluster: 'none' })).toContain('grid-cols-[1fr_auto]');
    expect(dockBar({ cluster: 'none' })).not.toContain('grid-cols-[1fr_auto_1fr]');
    expect(dockBar({ position: 'left', cluster: 'none' })).toContain('lg:grid-rows-[1fr_auto]');
  });

  it('gives a clusterless bar a third track when it carries a middle region', () => {
    expect(dockBar({ cluster: 'none', middleRegion: true })).toContain('grid-cols-[1fr_auto_1fr]');
    expect(dockBar({ position: 'left', cluster: 'none', middleRegion: true })).toContain(
      'lg:grid-rows-[1fr_auto_1fr]',
    );
  });

  it('pins a bar to its own edge, and only when asked', () => {
    // `fixed`, not CSS `position: sticky`: a sticky bar's on-screen position
    // depends on document height and scroll offset, both of which are
    // briefly inconsistent mid-swap under the client router, which flickered
    // the persisted bottom dock on pages taller than the viewport.
    expect(dockBar({ position: 'bottom' }).split(' ')).not.toContain('fixed');

    const bottom = dockBar({ position: 'bottom', sticky: true }).split(' ');
    expect(bottom).toContain('fixed');
    expect(bottom).toContain('inset-x-0');
    expect(bottom).toContain('bottom-0');

    const top = dockBar({ position: 'top', sticky: true }).split(' ');
    expect(top).toContain('fixed');
    expect(top).toContain('inset-x-0');
    expect(top).toContain('top-0');
  });

  it('gives a vertical bar a row template for every cluster placement', () => {
    for (const position of verticalPositions) {
      for (const cluster of dockClusterPlacements) {
        expect(dockBar({ position, cluster })).toContain('lg:grid-rows-[');
      }
    }
  });

  it('pins only from the breakpoint, below which there is no desktop to pin to', () => {
    for (const position of dockPositions) {
      const pinning = dockBar({ position })
        .split(' ')
        .filter((utility) => /fixed|inset-|top-|bottom-|left-|right-/.test(utility));

      expect(pinning.length).toBeGreaterThan(0);
      for (const utility of pinning) expect(utility.startsWith('lg:')).toBe(true);
    }
  });
});

describe('dockDarkStep', () => {
  it('mirrors a step across the ramp, so the fill inverts with the theme', () => {
    expect(dockDarkStep(900)).toBe(50);
    expect(dockDarkStep(800)).toBe(100);
    expect(dockDarkStep(50)).toBe(900);
  });

  it('is its own inverse', () => {
    for (const step of dockSteps) {
      expect(dockDarkStep(dockDarkStep(step))).toBe(step);
    }
  });
});

describe('dockBar fill and size', () => {
  it('carries no border utility — the fill is the only boundary now', () => {
    // The old 2px border lived in plain CSS on `.dock`, not as a utility
    // here; this guards against one creeping back in as the fill's classes.
    for (const step of dockSteps) {
      expect(dockBar({ step }).split(' ').some((cls) => cls.startsWith('border'))).toBe(false);
    }
  });

  it('picks a light-mode fill and its mirrored dark-mode fill from one prop', () => {
    for (const step of dockSteps) {
      const classes = dockBar({ step });
      expect(classes).toContain(`bg-leaf-${step}`);
      expect(classes).toContain(`dark:bg-leaf-${dockDarkStep(step)}`);
    }
  });

  it('defaults to the highest-contrast fill, step 900', () => {
    expect(dockBar()).toBe(dockBar({ step: 900 }));
  });

  it('sizes the bar, defaulting to its old fixed padding', () => {
    expect(dockBar()).toBe(dockBar({ size: 'regular' }));
    for (const size of dockSizes) {
      expect(dockBar({ size })).toMatch(/\bp[xy]-\d\b/);
    }
    expect(dockBar({ size: 'compact' })).not.toBe(dockBar({ size: 'spacious' }));
  });
});

describe('dockNav', () => {
  it('turns the icon row with the bar it sits on', () => {
    expect(dockNav({ position: 'bottom' })).not.toContain('flex-col');
    for (const position of verticalPositions) {
      expect(dockNav({ position })).toContain('lg:flex-col');
    }
  });
});

describe('dockRegion', () => {
  it('puts the two regions at opposite ends of the axis', () => {
    expect(dockRegion({ position: 'bottom', region: 'start' })).toContain('justify-self-start');
    expect(dockRegion({ position: 'bottom', region: 'end' })).toContain('justify-self-end');
    expect(dockRegion({ position: 'left', region: 'start' })).toContain('lg:self-start');
    expect(dockRegion({ position: 'left', region: 'end' })).toContain('lg:self-end');
  });
});

describe('shortcutInset', () => {
  it('stands the shortcut columns off only the edge a bar takes', () => {
    // The columns grow down the left, so a right-hand bar never meets them.
    expect(shortcutInset(['left'])).toBeGreaterThan(shortcutInset(['bottom']));
    expect(shortcutInset(['right'])).toBe(shortcutInset(['bottom']));
    expect(shortcutInset(['bottom', 'left'])).toBe(shortcutInset(['left']));
  });
});

describe('shortcutTopInset', () => {
  it('drops the first row below a bar on the top edge', () => {
    expect(shortcutTopInset(['top'])).toBeGreaterThan(shortcutTopInset(['bottom']));
    expect(shortcutTopInset(['bottom', 'top'])).toBe(shortcutTopInset(['top']));
  });
});
