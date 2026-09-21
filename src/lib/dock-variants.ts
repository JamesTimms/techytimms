import { cva, type VariantProps } from 'class-variance-authority';

/*
 * Where a bar sits, and where its icon cluster sits on it.
 *
 * Every stop is a grid of three tracks — side region, cluster, side region —
 * and the cluster placement decides which track is elastic. `middle` puts the
 * cluster in an `auto` track between two `1fr` tracks, which centres it on the
 * *bar* rather than between its neighbours, so a long section name on one side
 * cannot push it off centre. `left` and `right` collapse the `1fr` on the
 * cluster's own side, packing it against that end of the bar, behind whatever
 * the side region there is carrying. `none` drops the cluster entirely and
 * leaves the two regions at opposite ends — a bar showing nothing but the time.
 *
 * The vertical stops only apply from `lg`. Below it there is no visible
 * desktop to pin a side bar to, so they collapse to the same horizontal bar
 * carrying the same regions — which is also why the shared classes are the
 * horizontal ones and the variants only add the pinned layout.
 *
 * A bar with no cluster can fill the centre track the cluster left empty: the
 * middle region is centred on the bar the same way, so a long section name in
 * a side region cannot shift the clock off centre.
 *
 * `sticky` is the inverse of that pinning, for the widths the pinning skips. It
 * holds a bar against its edge below the breakpoint, where the pinning does
 * nothing. Despite the name it renders `fixed`, not CSS `position: sticky`:
 * a sticky bar stays in flow, so its on-screen position is a function of the
 * document's height and scroll offset. Under `<ClientRouter />` this bar is
 * `transition:persist`ed, so during a swap it is moved into a document whose
 * height and scroll position are momentarily inconsistent with each other —
 * on a page taller than the viewport, that transient state made a sticky bar
 * flicker out for a frame. `fixed` is anchored to the viewport alone, with no
 * dependency on flow height, so it has nothing to recompute mid-swap.
 *
 * The cost is that a fixed bar no longer reserves its own height in flow, so
 * whatever it sits over needs its own clearance — see the `pb-15` on
 * `WindowFrame`'s outer wrapper, sized to this bar's rendered height at
 * `regular` (0.5rem + 0.5rem padding, 2.75rem item height).
 */

export const dockPositions = [
  'top',
  'bottom',
  'left',
  'right',
] as const satisfies readonly DockPosition[];

export const dockClusterPlacements = [
  'left',
  'middle',
  'right',
  'none',
] as const satisfies readonly DockClusterPlacement[];

/*
 * The bar's fill. No border marks it against the wallpaper any more (see
 * global.css `.dock`), so the fill itself has to clear 3:1 there unaided, in
 * both themes, with nothing to help it. That is only possible by running the
 * fill opposite the site theme: the wallpaper is pale in light mode and
 * near-black in dark, so the fill goes dark in light mode and light in dark
 * mode — the same ramp step never clears both wallpapers at once (see
 * docs/design-system.md §5 for the computed table).
 *
 * `step` names the LIGHT-mode fill. The dark-mode fill is that step's mirror
 * across the ramp — `dockDarkStep(900)` is `50`, `dockDarkStep(800)` is
 * `100` — which is what makes a single prop pick a fill that works in both
 * themes: darker in light mode pairs with lighter in dark mode, always one
 * ramp step further from whichever wallpaper it is nearest.
 */
export const dockSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export type DockStep = (typeof dockSteps)[number];

const dockDarkSteps: Record<DockStep, DockStep> = {
  50: 900,
  100: 800,
  200: 700,
  300: 600,
  400: 500,
  500: 400,
  600: 300,
  700: 200,
  800: 100,
  900: 50,
};

export function dockDarkStep(step: DockStep): DockStep {
  return dockDarkSteps[step];
}

/*
 * Spelled out in full rather than built with `bg-leaf-${step}`: Tailwind's
 * scanner reads this file as text, not as executed JS, so a template literal
 * never yields a candidate class — only `dockDarkSteps` above needs the
 * number, this table needs the exact string.
 */
const dockStepClasses: Record<DockStep, string> = {
  50: 'bg-leaf-50 dark:bg-leaf-900',
  100: 'bg-leaf-100 dark:bg-leaf-800',
  200: 'bg-leaf-200 dark:bg-leaf-700',
  300: 'bg-leaf-300 dark:bg-leaf-600',
  400: 'bg-leaf-400 dark:bg-leaf-500',
  500: 'bg-leaf-500 dark:bg-leaf-400',
  600: 'bg-leaf-600 dark:bg-leaf-300',
  700: 'bg-leaf-700 dark:bg-leaf-200',
  800: 'bg-leaf-800 dark:bg-leaf-100',
  900: 'bg-leaf-900 dark:bg-leaf-50',
};

export const dockSizes = ['compact', 'regular', 'spacious'] as const;

export type DockSize = (typeof dockSizes)[number];

const dockSizeClasses: Record<DockSize, string> = {
  compact: 'px-2 py-1',
  regular: 'px-3 py-2',
  spacious: 'px-4 py-3',
};

export const dockBar = cva('dock z-20 grid items-center gap-3', {
  variants: {
    position: {
      top: 'lg:fixed lg:inset-x-0 lg:top-0',
      bottom: 'lg:fixed lg:inset-x-0 lg:bottom-0',
      left: 'lg:fixed lg:inset-y-0 lg:left-0 lg:grid-cols-none lg:px-2 lg:py-3',
      right: 'lg:fixed lg:inset-y-0 lg:right-0 lg:grid-cols-none lg:px-2 lg:py-3',
    },
    cluster: {
      left: 'grid-cols-[auto_auto_1fr]',
      middle: 'grid-cols-[1fr_auto_1fr]',
      right: 'grid-cols-[1fr_auto_auto]',
      /* Templated by compound variant instead: a clusterless bar has two
         tracks, or three when it carries a middle region. */
      none: '',
    },
    middleRegion: { true: '', false: '' },
    sticky: { true: 'fixed', false: '' },
    step: dockStepClasses,
    size: dockSizeClasses,
  },
  compoundVariants: [
    { cluster: 'none', middleRegion: false, class: 'grid-cols-[1fr_auto]' },
    { cluster: 'none', middleRegion: true, class: 'grid-cols-[1fr_auto_1fr]' },
    { position: ['left', 'right'], cluster: 'left', class: 'lg:grid-rows-[auto_auto_1fr]' },
    { position: ['left', 'right'], cluster: 'middle', class: 'lg:grid-rows-[1fr_auto_1fr]' },
    { position: ['left', 'right'], cluster: 'right', class: 'lg:grid-rows-[1fr_auto_auto]' },
    {
      position: ['left', 'right'],
      cluster: 'none',
      middleRegion: false,
      class: 'lg:grid-rows-[1fr_auto]',
    },
    {
      position: ['left', 'right'],
      cluster: 'none',
      middleRegion: true,
      class: 'lg:grid-rows-[1fr_auto_1fr]',
    },
    { position: 'top', sticky: true, class: 'inset-x-0 top-0' },
    /* The vertical stops are the bottom bar at these widths, so they stick to
       the same edge; from `lg` the pinning takes over and this is moot. */
    { position: ['bottom', 'left', 'right'], sticky: true, class: 'inset-x-0 bottom-0' },
  ],
  defaultVariants: {
    position: 'bottom',
    cluster: 'middle',
    middleRegion: false,
    sticky: false,
    step: 900,
    size: 'regular',
  },
});

export const dockCluster = cva('dock-cluster flex items-stretch justify-center gap-3', {
  variants: {
    position: {
      top: '',
      bottom: '',
      left: 'lg:flex-col lg:items-center',
      right: 'lg:flex-col lg:items-center',
    },
  },
  defaultVariants: { position: 'bottom' },
});

/*
 * The navigation row inside the cluster: every destination, one icon each, laid
 * out left to right. It follows the cluster's axis, and sits tighter than the
 * cluster's own gap so the row reads as one group rather than as loose items.
 */
export const dockNav = cva('dock-nav flex items-stretch gap-1', {
  variants: {
    position: {
      top: '',
      bottom: '',
      left: 'lg:flex-col lg:items-center',
      right: 'lg:flex-col lg:items-center',
    },
  },
  defaultVariants: { position: 'bottom' },
});

/*
 * The side regions. `bar-ink-muted`, not `ink-muted`: the bar's own fill runs
 * opposite the site theme (see `dockStepClasses` above), so its text has to
 * be the SITE'S OTHER theme's muted ink, upside down — plain `ink-muted`
 * assumes a surface that matches the current theme, which this fill never
 * does. See the `--color-bar-ink-muted` token in global.css.
 */
export const dockRegion = cva('flex min-w-0 items-center gap-2 text-xs text-bar-ink-muted', {
  variants: {
    position: { top: '', bottom: '', left: '', right: '' },
    region: {
      start: 'justify-self-start',
      middle: 'justify-self-center',
      end: 'justify-self-end',
    },
  },
  compoundVariants: [
    {
      position: ['left', 'right'],
      region: 'start',
      class: 'lg:flex-col lg:justify-self-center lg:self-start',
    },
    {
      position: ['left', 'right'],
      region: 'middle',
      class: 'lg:flex-col lg:justify-self-center lg:self-center',
    },
    {
      position: ['left', 'right'],
      region: 'end',
      class: 'lg:flex-col lg:justify-self-center lg:self-end',
    },
  ],
  defaultVariants: { position: 'bottom', region: 'start' },
});

export type DockPosition = NonNullable<VariantProps<typeof dockBar>['position']>;
export type DockClusterPlacement = NonNullable<VariantProps<typeof dockBar>['cluster']>;

/*
 * How far the desktop shortcut columns stand off the viewport edge, in rem.
 * They grow down the left-hand side, so only a bar on the left is in the way
 * of the columns themselves, and only a bar on the top is in the way of the
 * first row. A bar on the bottom is cleared by `--dock-clearance` in CSS, and
 * one on the right is never met at all.
 */
const clearEdge = 1;
const clearBar = 5;
/* The bar's own height plus the ordinary edge standoff. */
const clearTopBar = 4;

export function shortcutInset(bars: readonly DockPosition[]): number {
  return bars.includes('left') ? clearBar : clearEdge;
}

export function shortcutTopInset(bars: readonly DockPosition[]): number {
  return bars.includes('top') ? clearTopBar : clearEdge;
}
