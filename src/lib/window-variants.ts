import { cva, type VariantProps } from 'class-variance-authority';

/*
 * How period the window chrome is. One axis, three stops.
 *
 * Title-bar treatment, bevel depth and control style are not separate axes:
 * they co-vary. A period bevel with a flat title bar is not a look anyone
 * wants, and exposing them independently would offer nine combinations to
 * choose between when only three are coherent.
 *
 * `period` is the default and reproduces the existing chrome exactly, so
 * switching is opt-in and nothing regresses.
 */

/*
 * The window's face cannot mark its own edge against the wallpaper in either
 * theme, so every variant keeps an explicit border; `flat` drops the bevel,
 * never the border.
 *
 * Below `lg` the window fills the viewport and no wallpaper shows, so the
 * side borders are dropped and `border` is enough. From `lg` the edge sits on
 * the wallpaper, where `border` is only 1.87 in light mode — hence
 * `window-edge`, which is tuned for that ground rather than for panels.
 *
 * `period` needs neither: a bevel identifies itself by whichever of its two
 * edges contrasts, and one of them always does.
 */
export const windowFrame = cva('bg-surface', {
  variants: {
    chrome: {
      period: [
        'border border-border border-x-0',
        'lg:border-2 lg:border-t-bevel-light lg:border-l-bevel-light',
        'lg:border-r-bevel-dark lg:border-b-bevel-dark',
      ],
      soft: 'border border-border border-x-0 lg:border-x lg:border-window-edge lg:rounded-control',
      flat: 'border border-border border-x-0 lg:border-x lg:border-window-edge lg:rounded-control',
    },
  },
  defaultVariants: { chrome: 'period' },
});

export const titleBar = cva('flex items-center justify-between gap-3 px-2 py-1', {
  variants: {
    chrome: {
      period: [
        'border-b border-border',
        'bg-linear-to-r from-titlebar-from to-titlebar-to text-titlebar-ink',
      ],
      soft: 'border-b border-border bg-titlebar-from text-titlebar-ink',
      flat: 'border-b border-rule bg-sunk text-ink',
    },
  },
  defaultVariants: { chrome: 'period' },
});

/*
 * Win98 sized these to the bar rather than to their glyph, which is why they
 * read as a set: 16x14, tight together, each a raised bevel regardless of
 * content. The softer variants keep the footprint and drop the bevel.
 */
export const titleControl = cva(
  'flex shrink-0 items-center justify-center w-4 h-3.5 p-0 rounded-control bg-sunk text-ink',
  {
    variants: {
      chrome: {
        period: [
          'border border-border',
          'border-t-bevel-light border-l-bevel-light',
          'border-b-bevel-dark border-r-bevel-dark',
        ],
        soft: 'border border-border',
        flat: 'border border-rule',
      },
      pressable: { true: 'cursor-pointer', false: '' },
    },
    compoundVariants: [
      {
        chrome: 'period',
        pressable: true,
        class:
          'active:border-t-bevel-dark active:border-l-bevel-dark active:border-b-bevel-light active:border-r-bevel-light',
      },
    ],
    defaultVariants: { chrome: 'period', pressable: false },
  },
);

/*
 * The minimise bar sits ON the button's lower edge in Win9x rather than centred
 * in it — the single detail that most marks a title bar as period rather than
 * generic. The softer variants centre it.
 */
export const minimiseControl = cva('', {
  variants: {
    chrome: { period: 'items-end pb-0.5', soft: 'items-center', flat: 'items-center' },
  },
  defaultVariants: { chrome: 'period' },
});

/* Boxes, not characters: a glyph is sized by the font and centred on its own
 * baseline, and these three have to sit at specific places in the button. */
export const glyphMinimise = 'block w-[7px] h-[2px] bg-current';
/* A window, not an empty square: the heavier top edge is its title bar. */
export const glyphRestore = 'block w-[9px] h-[8px] border border-current border-t-2';

export type ChromeVariant = NonNullable<VariantProps<typeof windowFrame>['chrome']>;

export const chromeVariants = ['period', 'soft', 'flat'] as const satisfies readonly ChromeVariant[];

export const chromeDescriptions: Record<ChromeVariant, string> = {
  period: 'Full Win98/2000 fidelity: raised double-edged frame, gradient title bar, bottom-aligned minimise bar.',
  soft: 'Softened interpretation: flat bordered frame, solid title bar, centred controls.',
  flat: 'Near-plain modern panel: neutral title row, hairline controls, era present only in the square footprint.',
};
