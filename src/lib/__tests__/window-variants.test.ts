import { describe, expect, it } from 'vitest';

import { cn } from '~/lib/cn';
import {
  chromeVariants,
  minimiseControl,
  titleBar,
  titleControl,
  windowFrame,
} from '~/lib/window-variants';

describe('windowFrame', () => {
  it('defaults to the period chrome, so existing callers are unchanged', () => {
    expect(windowFrame()).toBe(windowFrame({ chrome: 'period' }));
  });

  it('keeps an explicit border in every variant', () => {
    // Dark mode's surface is near-identical to the wallpaper, so the fill
    // cannot mark the window's edge — only the border and bevel can.
    for (const chrome of chromeVariants) {
      expect(windowFrame({ chrome })).toContain('border-border');
    }
  });

  it('only the period variant carries the raised bevel', () => {
    expect(windowFrame({ chrome: 'period' })).toContain('bevel-light');
    expect(windowFrame({ chrome: 'soft' })).not.toContain('bevel');
    expect(windowFrame({ chrome: 'flat' })).not.toContain('bevel');
  });
});

describe('titleBar', () => {
  it('gradients only in the period variant', () => {
    expect(titleBar({ chrome: 'period' })).toContain('bg-linear-to-r');
    expect(titleBar({ chrome: 'soft' })).not.toContain('bg-linear-to-r');
    expect(titleBar({ chrome: 'flat' })).not.toContain('bg-linear-to-r');
  });

  it('drops the coloured bar entirely at the flat end', () => {
    expect(titleBar({ chrome: 'flat' })).toContain('bg-sunk');
  });
});

describe('titleControl', () => {
  it('is only pressable when asked, so decorative spans get no cursor', () => {
    expect(titleControl({ pressable: true })).toContain('cursor-pointer');
    expect(titleControl({ pressable: false })).not.toContain('cursor-pointer');
  });

  it('gives the period variant a pressed state only when it can be pressed', () => {
    expect(titleControl({ chrome: 'period', pressable: true })).toContain('active:');
    expect(titleControl({ chrome: 'period', pressable: false })).not.toContain('active:');
  });
});

describe('minimiseControl', () => {
  it('bottom-aligns the bar only in the period variant', () => {
    expect(minimiseControl({ chrome: 'period' })).toContain('items-end');
    expect(minimiseControl({ chrome: 'soft' })).toContain('items-center');
  });
});

describe('cn', () => {
  it('lets a later utility win over an earlier one', () => {
    expect(cn('bg-sunk', 'bg-surface')).toBe('bg-surface');
  });
});
