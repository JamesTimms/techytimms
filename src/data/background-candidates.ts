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
];
