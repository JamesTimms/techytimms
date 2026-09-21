import { cva, type VariantProps } from 'class-variance-authority';

/*
 * Which palette the window wears. One axis, two stops.
 *
 * Each stop is a ten-step OKLCH ramp (50–900) of tints and shades built from
 * that palette's main colour — the colour its wallpaper used to be. The steps
 * live in `src/styles/global.css`; the role each step plays is decided here.
 * Only six of the ten are used — 400/600/800 are free, and the dock uses
 * 800–900 for its own fill.
 *
 * The chrome is modern rather than period: a thin border, a flat title bar and
 * flat controls. What still reads as 90s/2000s is the shape — a pixel icon and
 * a title at the left, a minimise/restore/close cluster at the right, square-ish
 * corners, and a restore glyph drawn as a little window rather than a chevron.
 * The bevels are gone; the anatomy is not.
 *
 * Step roles, and why two of them swap with the theme:
 *
 *   50   window face (light), title text
 *   100  control glyphs
 *   200  MAIN, Fallen Leaf — the rule under the title bar, light mode only
 *   300  MAIN, Pumpkin — same role, one step darker on this palette (its main
 *        colour sits at 70% lightness, not Fallen Leaf's 80%)
 *   500  window edge, both themes; control hover fill
 *   700  window face (dark)
 *   900  title bar, both themes
 *
 * One step carries the edge in both themes. It has to clear 3:1 against the
 * wallpaper behind it, and that wallpaper is a pale tint in light mode and the
 * title bar's own near-black in dark; ~52% is the narrow band that clears both
 * (3.88 and 3.57 on fallen-leaf). It is also the nearest tint to the bar the
 * dark wallpaper allows — anything closer to the bar's 14% stops being a
 * boundary at all.
 *
 * The title bar does NOT swap. It is chrome the window wears rather than a
 * surface the page sits on, and a light bar in dark mode reads as a different
 * component.
 */

export const windowPalettes = ['fallen-leaf', 'pumpkin'] as const;

export type WindowPalette = (typeof windowPalettes)[number];

/*
 * The face carries the page's body text, so it is a light TINT of the main
 * colour rather than the main colour itself. On a surface at the main colour's
 * own lightness `ink-muted` measures 3.65 and `ink-faint` 2.54; ink-faint needs
 * a surface at 99%. Tinting the face was the cheaper of the two fixes — the
 * other was a muted and faint step per palette, which makes the neutral ink
 * scale palette-dependent for the sake of one surface.
 *
 * Below `lg` the window fills the viewport, so the side borders and the radius
 * are dropped: there is no wallpaper for them to sit against.
 */
export const windowFrame = cva('border border-x-0 lg:border-x lg:rounded-window', {
  variants: {
    palette: {
      'fallen-leaf': 'bg-leaf-50 border-leaf-500 dark:bg-leaf-700',
      pumpkin: 'bg-pumpkin-50 border-pumpkin-500 dark:bg-pumpkin-700',
    },
  },
  defaultVariants: { palette: 'fallen-leaf' },
});

/*
 * The bar's own bottom rule is the main colour, and the one place the identity
 * colour appears at full strength — in LIGHT mode only. In dark the window
 * draws a single border on its outside edge and nothing internal: the rule
 * there was a bright line across the middle of the chrome, and the bar's own
 * colour is what separates it from the face (~1.6:1 — no dark bar can reach
 * 3:1 against any dark face, and the bar is chrome, not a control boundary).
 *
 * The top corners take `radius-window-inner`, the frame's radius less its 1px
 * border, so the bar's corner sits inside the frame's rather than cutting
 * across it.
 */
export const titleBar = cva(
  'flex items-center justify-between gap-3 border-b px-3 py-1.5 lg:rounded-t-window-inner dark:border-b-0',
  {
    variants: {
      palette: {
        'fallen-leaf': 'bg-leaf-900 text-leaf-50 border-leaf-200',
        pumpkin: 'bg-pumpkin-900 text-pumpkin-50 border-pumpkin-300',
      },
    },
    defaultVariants: { palette: 'fallen-leaf' },
  },
);

/*
 * Controls are a hit area and a glyph, with no box of their own: the glyph is
 * the only thing that has to be legible, and it clears 4.5:1 on the bar. Sized
 * to 24px rather than Win9x's 16x14 because these are now touch targets on a
 * bar that no longer draws their outlines.
 *
 * The glyph sits one step below the title text so the cluster reads as quieter
 * than the title; on hover the fill comes up and the glyph goes to step 50.
 */
export const titleControl = cva(
  'flex size-6 shrink-0 items-center justify-center rounded-control p-0',
  {
    variants: {
      palette: {
        'fallen-leaf': 'text-leaf-100',
        pumpkin: 'text-pumpkin-100',
      },
      pressable: { true: 'cursor-pointer', false: '' },
    },
    compoundVariants: [
      {
        palette: 'fallen-leaf',
        pressable: true,
        class: 'hover:bg-leaf-500 hover:text-leaf-50 active:bg-leaf-200 active:text-leaf-900',
      },
      {
        palette: 'pumpkin',
        pressable: true,
        class:
          'hover:bg-pumpkin-500 hover:text-pumpkin-50 active:bg-pumpkin-300 active:text-pumpkin-900',
      },
    ],
    defaultVariants: { palette: 'fallen-leaf', pressable: false },
  },
);

/* Boxes, not characters: a glyph is sized by the font and centred on its own
 * baseline, and these three have to sit at the same place in every button.
 * Thinner than the period pair — 1.5px against the old 2px — which is most of
 * what makes the cluster read as current. */
export const glyphMinimise = 'block h-[1.5px] w-[10px] bg-current';
/* A window, not an empty square: the heavier top edge is its title bar. The one
 * period detail worth keeping, because it says what the button does. */
export const glyphRestore = 'block h-[9px] w-[9px] border border-current border-t-2';

export const paletteDescriptions: Record<WindowPalette, string> = {
  'fallen-leaf':
    'Straw at 80% as the main colour. The calmest of the two: the face is barely tinted and the edge is a warm brown rather than a line of colour.',
  pumpkin:
    'Pumpkin at 70% as the main colour. Higher chroma at every step, so the edge and the rule under the title bar read as orange rather than as brown.',
};

export type PaletteVariantProps = VariantProps<typeof windowFrame>;
