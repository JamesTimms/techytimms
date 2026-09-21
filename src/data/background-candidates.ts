/*
 * Desktop background candidates for the styleguide. Reasoning, measurements and
 * the recommendation are in docs/background-exploration.md.
 *
 * `contrast` records the pattern's WORST extreme, not its average: a pattern
 * varies the ground, and a shortcut label or a window edge that happens to fall
 * on the darkest pixel is the one that has to stay legible.
 */

export interface BackgroundCandidate {
  name: string;
  /** The class applied alongside `.desktop-ground`. Empty for the live flat fill. */
  className: string;
  blurb: string;
  /** Rough source-byte cost of the CSS rule. */
  cost: string;
  /** Worst-case measurements at the pattern's extreme, both themes. */
  contrast: {
    lightInk: number;
    lightEdge: number;
    darkInk: number;
    darkEdge: number;
  };
  weakness: string;
  /** Fails a contrast floor and is shown only so the failure is visible. */
  fails?: boolean;
  live?: boolean;
}

export const backgroundCandidates: BackgroundCandidate[] = [
  {
    name: 'Flat fill',
    className: '',
    blurb: 'The current background. One solid colour, no texture.',
    cost: '0 B',
    contrast: { lightInk: 8.79, lightEdge: 3.64, darkInk: 17.81, darkEdge: 4.01 },
    weakness: 'Reads as an empty page background rather than a desktop surface.',
  },
  {
    name: 'Dot grid — lifted',
    className: 'desktop-dots-lift',
    blurb:
      'Monica’s geometry at 16px, drawn lighter than the ground instead of darker.',
    cost: '~150 B',
    contrast: { lightInk: 11.1, lightEdge: 4.6, darkInk: 15.63, darkEdge: 3.52 },
    weakness:
      'A lighter pattern reads as sheen rather than texture; it is the least tactile of the options.',
  },
  {
    name: 'Dot grid — dropped',
    className: 'desktop-dots-drop',
    blurb:
      'The same dots drawn darker, faithful to Monica’s direction rather than inverted.',
    cost: '~150 B',
    contrast: { lightInk: 7.65, lightEdge: 3.17, darkInk: 18.72, darkEdge: 4.21 },
    weakness:
      'Light mode has only five points of downward headroom, so this sits near its limit: window-edge lands at 3.17 against a 3.0 floor.',
  },
  {
    name: 'Line grid',
    className: 'desktop-grid',
    blurb: 'A 24px ruled grid, one pixel wide, lifted.',
    cost: '~190 B',
    contrast: { lightInk: 11.1, lightEdge: 4.6, darkInk: 15.63, darkEdge: 3.52 },
    weakness:
      'Grids read as drafting or design-tool chrome. It is the least period-specific option here.',
  },
  {
    name: 'Weave — 8px',
    className: 'desktop-weave',
    blurb:
      'The Win9x Pattern geometry: an 8×8 tile, at the size Windows actually used.',
    cost: '~190 B',
    contrast: { lightInk: 11.1, lightEdge: 4.6, darkInk: 15.63, darkEdge: 3.52 },
    weakness:
      'At 8px the tile is dense enough to shimmer on some displays, and it is the option most likely to look like a rendering artefact rather than a choice.',
  },
  {
    name: 'Weave — as Windows drew it',
    className: 'desktop-weave-authentic',
    blurb:
      'The same tile in black, which is how Windows rendered Patterns. Shown so the failure is visible.',
    cost: '~180 B',
    contrast: { lightInk: 1.27, lightEdge: 3.08, darkInk: 19.23, darkEdge: 4.33 },
    weakness:
      'Fails outright in light mode. A shortcut label crossing a black line drops to 1.27:1 — the period-authentic pattern and a pale wallpaper are incompatible.',
    fails: true,
  },
  {
    name: 'Diagonal hatch',
    className: 'desktop-hatch',
    blurb: 'Repeating 45° rules at 7px.',
    cost: '~150 B',
    contrast: { lightInk: 11.1, lightEdge: 4.6, darkInk: 15.63, darkEdge: 3.52 },
    weakness:
      'Diagonals carry direction, so the eye tracks along them; more restless than an orthogonal tile at the same contrast.',
  },
  {
    name: 'Grain',
    className: 'desktop-grain',
    blurb:
      'Achromatic SVG noise tiled at 140px and blended with `overlay`, after Arc. Strength differs by theme because overlay compresses on a dark base.',
    cost: '794 B raw, 241 B gzipped',
    contrast: { lightInk: 8.38, lightEdge: 3.47, darkInk: 17.64, darkEdge: 3.97 },
    weakness:
      'No period referent — 90s desktops dithered, they did not have film grain. Its cost is CPU rather than bytes: the filter rasterises once per tile size.',
    live: true,
  },
  {
    name: 'Vertical sheen',
    className: 'desktop-sheen',
    blurb: 'A gradient, light at the top, falling through the base to a slightly darker foot.',
    cost: '~120 B',
    contrast: { lightInk: 7.65, lightEdge: 3.17, darkInk: 15.63, darkEdge: 3.52 },
    weakness:
      'A gradient implies a light source and depth, which argues against a flat desktop metaphor. Its dark foot also inherits the dropped variant’s tight 3.17 margin.',
  },
];
