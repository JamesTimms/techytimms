import { describe, expect, it } from 'vitest';

import {
  bar,
  barPositions,
  barRegion,
  barSizes,
  barPurposes,
  dockNav,
} from '~/components/ui/Bar.tsx';

const verticalPositions = ['left', 'right'] as const;

describe('bar', () => {
  it('defaults to the navigation fill on the bottom edge', () => {
    expect(bar()).toBe(bar({ position: 'bottom', purpose: 'dock' }));
  });

  it('centres the navigation cluster on the bar in every position', () => {
    // A three-track grid with the cluster in the middle `auto` track: the side
    // regions cannot push it off centre however long their contents run.
    for (const position of barPositions) {
      expect(bar({ position, purpose: 'dock' })).toContain('grid-cols-[1fr_auto_1fr]');
    }

    for (const position of verticalPositions) {
      expect(bar({ position, purpose: 'dock' })).toContain('lg:grid-rows-[1fr_auto_1fr]');
    }
  });

  it('lays out two tracks, not three, for a primary bar with no middle region', () => {
    expect(bar({ purpose: 'menu' })).toContain('grid-cols-[1fr_auto]');
    expect(bar({ purpose: 'menu' })).not.toContain('grid-cols-[1fr_auto_1fr]');
    expect(bar({ position: 'left', purpose: 'menu' })).toContain('lg:grid-rows-[1fr_auto]');
  });

  it('gives a primary bar a third track when it carries a middle region', () => {
    expect(bar({ purpose: 'menu', middleRegion: true })).toContain('grid-cols-[1fr_auto_1fr]');
    expect(bar({ position: 'left', purpose: 'menu', middleRegion: true })).toContain(
      'lg:grid-rows-[1fr_auto_1fr]',
    );
  });

  it('pins a bar to its own edge, and only when asked', () => {
    // `fixed`, not CSS `position: sticky`: a sticky bar's on-screen position
    // depends on document height and scroll offset, both of which are
    // briefly inconsistent mid-swap under the client router, which flickered
    // the persisted bottom dock on pages taller than the viewport.
    expect(bar({ position: 'bottom' }).split(' ')).not.toContain('fixed');

    const bottom = bar({ position: 'bottom', sticky: true }).split(' ');
    expect(bottom).toContain('fixed');
    expect(bottom).toContain('inset-x-0');
    expect(bottom).toContain('bottom-0');

    const top = bar({ position: 'top', sticky: true }).split(' ');
    expect(top).toContain('fixed');
    expect(top).toContain('inset-x-0');
    expect(top).toContain('top-0');
  });

  it('gives a vertical bar a row template for every purpose', () => {
    for (const position of verticalPositions) {
      for (const purpose of barPurposes) {
        expect(bar({ position, purpose })).toContain('lg:grid-rows-[');
      }
    }
  });

  it('pins only from the breakpoint, below which there is no desktop to pin to', () => {
    for (const position of barPositions) {
      const pinning = bar({ position })
        .split(' ')
        .filter((utility) => /fixed|inset-|top-|bottom-|left-|right-/.test(utility));

      expect(pinning.length).toBeGreaterThan(0);
      for (const utility of pinning) expect(utility.startsWith('lg:')).toBe(true);
    }
  });
});

describe('bar fill and size', () => {
  it('carries no border utility — the fill is the only boundary now', () => {
    // The old 2px border lived in plain CSS on `.dock`, not as a utility
    // here; this guards against one creeping back in as the fill's classes.
    for (const purpose of barPurposes) {
      expect(
        bar({ purpose })
          .split(' ')
          .some((cls) => cls.startsWith('border')),
      ).toBe(false);
    }
  });

  it('couples each purpose with its own light- and dark-mode fill', () => {
    expect(bar({ purpose: 'dock' })).toContain('bg-leaf-900');
    expect(bar({ purpose: 'dock' })).toContain('dark:bg-leaf-50');
    expect(bar({ purpose: 'menu' })).toContain('bg-leaf-800');
    expect(bar({ purpose: 'menu' })).toContain('dark:bg-leaf-100');
  });

  it('sizes the bar, defaulting to its old fixed padding', () => {
    expect(bar()).toBe(bar({ size: 'regular' }));
    for (const size of barSizes) {
      expect(bar({ size })).toMatch(/\bp[xy]-\d\b/);
    }
    expect(bar({ size: 'compact' })).not.toBe(bar({ size: 'spacious' }));
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

describe('barRegion', () => {
  it('puts the two regions at opposite ends of the axis', () => {
    expect(barRegion({ position: 'bottom', region: 'start' })).toContain('justify-self-start');
    expect(barRegion({ position: 'bottom', region: 'end' })).toContain('justify-self-end');
    expect(barRegion({ position: 'left', region: 'start' })).toContain('lg:self-start');
    expect(barRegion({ position: 'left', region: 'end' })).toContain('lg:self-end');
  });
});
