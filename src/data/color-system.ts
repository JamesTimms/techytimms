/*
 * Reference data for the styleguide's colour section. Nothing here changes a
 * colour value — every OKLCH figure the page shows is parsed from
 * src/styles/global.css at build time (see src/lib/color-tokens.ts); this
 * file only records which hue each ramp uses, and which tokens pair.
 */

export type MainHueKey = 'leaf' | 'pumpkin' | 'neutral' | 'accent';

export interface MainHueDefinition {
  key: MainHueKey;
  /** Display name for the ramp row and the huetone hue label. */
  name: string;
  hue: number;
  /** Which live 50–900 ramp in global.css this reads verbatim, or null for a derived comparison ramp. */
  liveRamp: 'leaf' | 'pumpkin' | null;
}

export const mainHues: MainHueDefinition[] = [
  { key: 'pumpkin', name: 'pumpkin', hue: 55, liveRamp: 'pumpkin' },
  { key: 'leaf', name: 'leaf', hue: 80, liveRamp: 'leaf' },
  { key: 'neutral', name: 'neutral / ink', hue: 55, liveRamp: null },
  { key: 'accent', name: 'accent / rust', hue: 44, liveRamp: null },
];

export const contrastTargets: Record<string, number> = {
  ink: 90,
  'ink-muted': 75,
  'ink-faint': 60,
  'accent-ink': 75,
  'title-bar-ink': 75,
  'desktop-ink': 75,
  accent: 30,
  border: 30,
  'window-edge': 30,
  'bar-edge': 30,
  rule: 15,
};

export interface ForegroundPairing {
  token: string;
  kind: 'text' | 'link' | 'mark' | 'boundary';
  sample?: string;
  use: string;
}

export interface BackgroundRow {
  background: string;
  foregrounds: ForegroundPairing[];
}

export const tokenPairings: BackgroundRow[] = [
  {
    background: 'surface',
    foregrounds: [
      { token: 'ink', kind: 'text', sample: 'Body text', use: 'The most legible text on a non-elevated background, such as body copy in a window.' },
      { token: 'ink-muted', kind: 'text', sample: 'Secondary', use: 'Secondary text in a window, such as a standfirst or caption.' },
      { token: 'ink-faint', kind: 'text', sample: '12 Sep 2026', use: 'Metadata in a window, such as a date.' },
    ],
  },
  {
    background: 'surface',
    foregrounds: [
      { token: 'accent-ink', kind: 'link', sample: 'A link', use: 'Links and current-page text in a window.' },
      { token: 'accent', kind: 'mark', use: 'A coloured mark in a window, never text.' },
    ],
  },
  {
    background: 'surface',
    foregrounds: [
      { token: 'border', kind: 'boundary', use: 'The edge of a control or panel in a window.' },
      { token: 'rule', kind: 'boundary', use: 'A decorative divider that marks no boundary.' },
    ],
  },
  {
    background: 'sunk',
    foregrounds: [
      { token: 'ink', kind: 'text', sample: 'Body text', use: 'Text in an inset region, such as a code block.' },
      { token: 'ink-muted', kind: 'text', sample: 'Secondary', use: 'Secondary text in an inset region.' },
      { token: 'ink-faint', kind: 'text', sample: '12 Sep 2026', use: 'Metadata in an inset region.' },
    ],
  },
  {
    background: 'title-bar',
    foregrounds: [{ token: 'title-bar-ink', kind: 'text', sample: 'about.txt', use: 'The window title and its controls.' }],
  },
  {
    background: 'menu-bar',
    foregrounds: [
      { token: 'ink-muted', kind: 'text', sample: 'Section', use: 'Text in the top bar.' },
      { token: 'accent', kind: 'mark', use: 'A status mark in the top bar.' },
      { token: 'bar-edge', kind: 'boundary', use: 'The line between the top bar and the wallpaper.' },
    ],
  },
  {
    background: 'dock',
    foregrounds: [
      { token: 'ink-muted', kind: 'text', sample: 'Home', use: 'Labels in the dock.' },
      { token: 'accent', kind: 'mark', use: 'The current-page mark in the dock.' },
      { token: 'bar-edge', kind: 'boundary', use: 'The line between the dock and the wallpaper.' },
    ],
  },
  {
    background: 'desktop',
    foregrounds: [
      { token: 'desktop-ink', kind: 'text', sample: 'About', use: 'Shortcut labels on the wallpaper.' },
      { token: 'window-edge', kind: 'boundary', use: 'A window’s outer edge on the wallpaper.' },
    ],
  },
];
