/*
 * Reference data for the styleguide's colour section. Nothing here changes a
 * colour value — every OKLCH figure the page shows is parsed from
 * src/styles/global.css at build time (see src/lib/color-tokens.ts); this
 * file only records which hue each ramp uses and why, and the purpose of
 * each semantic token.
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

export interface TokenReference {
  token: string;
  purpose: string;
  /** Why this exists as its own token rather than reusing another one. */
  why: string;
  /** Set only for the two removal candidates the brief calls out. */
  usageNote?: string;
}

export const tokenReference: TokenReference[] = [
  {
    token: 'ground',
    purpose: 'Contrast baseline every text pair was originally solved against.',
    why: 'vs reusing `surface`: a future surface between the wallpaper and a panel needs its own reference point, without moving the one every existing ratio was checked against.',
    usageNote: '1 use, and only inside the styleguide’s own removed “bar fills” demo — 0 in real markup either before or after this change.',
  },
  {
    token: 'surface',
    purpose: 'Window and panel fill.',
    why: 'vs one fill shared with `sunk`: an inset region has to read as recessed against it, which needs two different lightnesses, not one.',
  },
  {
    token: 'sunk',
    purpose: 'Inset regions — title bars, code blocks, empty states.',
    why: 'vs no inset level: depth here comes from borders alone (no shadows), so “recessed” can only exist as a fill one step darker than `surface`.',
  },
  {
    token: 'rule',
    purpose: 'Decorative divider that carries no boundary meaning.',
    why: 'vs using `border` for every divider: `border` is deliberately dark to clear WCAG 1.4.11’s 3:1 for UI boundaries; a hairline that means nothing shouldn’t borrow a token tuned for something that does.',
  },
  {
    token: 'border',
    purpose: 'Panel and UI boundary, 3:1 minimum.',
    why: 'vs a plain hairline: 1.4.11 requires boundaries to clear 3:1, and the whole thesis is visible borders over soft shadows — a hairline would fail the first and undersell the second.',
  },
  {
    token: 'ink-faint',
    purpose: 'Tertiary text — dates, metadata.',
    why: 'vs `ink-muted` doing this job too: secondary and tertiary text need different floors (4.5 either way, but with different headroom), or metadata reads as loud as body copy.',
  },
  {
    token: 'ink-muted',
    purpose: 'Secondary body text.',
    why: 'vs one muted ink shared with `ink-faint`: see above.',
  },
  { token: 'ink', purpose: 'Primary text.', why: '—' },
  {
    token: 'accent',
    purpose: 'Marks, rings, borders. Never text.',
    why: 'vs one accent value for marks and text: saturated enough to read as a mark, it does not reach 4.5:1 as text — the two jobs need different lightness, which is the entire reason `accent-ink` exists.',
  },
  {
    token: 'accent-ink',
    purpose: 'Accent-coloured text — links, current-page state.',
    why: 'vs reusing `accent`: the text-safe half of the same hue-drift curve, darker (and redder) than `accent` in light mode.',
  },
  {
    token: 'accent-sunk',
    purpose: 'Tinted panel fill — callouts, active dock state.',
    why: 'vs plain `sunk`: a callout needs to read as accent-flavoured, not merely inset.',
  },
  {
    token: 'title-bar',
    purpose: 'The window title bar’s own fill.',
    why: 'vs a raw ramp step: the title bar is the accent’s own identity (“the rust red of the accent family”), not a tint of the window ramp, and it must flip lightness by theme — which a fixed ramp step (`pumpkin-900` in both themes, previously) cannot do.',
  },
  {
    token: 'title-bar-ink',
    purpose: 'Text and control glyphs on the title bar.',
    why: 'vs `ink`: that is tuned against `surface`/`ground`, not against `title-bar`’s own fill.',
  },
  {
    token: 'menu-bar',
    purpose: 'The top status bar’s own fill.',
    why: 'vs inverting against the theme: bars now follow it (`surface` light, `sunk` dark), so normal `ink-muted`/`accent` read on them and a `window-edge` line carries the boundary.',
  },
  {
    token: 'dock',
    purpose: 'The bottom navigation bar’s own fill.',
    why: 'Same as `menu-bar`; kept separate so the two bars can be tuned apart.',
  },
  {
    token: 'desktop',
    purpose: 'The wallpaper fill.',
    why: 'vs `ground`: the wallpaper never carries body text, so retuning it can’t be allowed to move the baseline every text pair is checked against.',
  },
  {
    token: 'desktop-ink',
    purpose: 'Shortcut labels — the only text the wallpaper carries.',
    why: 'vs `ink`: that is tuned against `ground`; the wallpaper sits at a different, theme-flipping lightness and needs its own pair.',
  },
  {
    token: 'window-edge',
    purpose: 'Window’s outer edge on the wallpaper, where no bevel draws it.',
    why: 'vs a borderless window: without it, the face and the wallpaper would have to separate by lightness alone, at whatever contrast that happens to land on — `border` alone measures 1.87 there, short of 3:1.',
    usageNote: 'Now the live (`pumpkin`) window frame’s own border — previously defined but unused, with a raw ramp step doing this job under a different name instead.',
  },
  {
    token: 'bevel-light',
    purpose: 'Raised top/left edge.',
    why: 'vs one border colour: a raised control needs only one of its two edges to clear 3:1, and which one does flips with the surround and the theme — so both bevel tokens have to be real colours, never decorative.',
  },
  {
    token: 'bevel-dark',
    purpose: 'Raised bottom/right edge.',
    why: 'Same as `bevel-light` — the other side of the same pair.',
  },
];

/*
 * Every live text/mark pairing the styleguide's "Tokens in use" section
 * renders and contrast-checks. `fgToken`/`bgToken` drive the APCA figure;
 * `fgClass`/`bgClass` are literal Tailwind utilities (not built from the
 * token name at render time) so Tailwind's build-time scanner can see them.
 * `kind: 'boundary'` pairs (border colours, never text) render as a bordered
 * swatch rather than a text sample.
 */
export interface TokenPairing {
  label: string;
  fgToken: string;
  bgToken: string;
  /** APCA Lc floor: 75 body text, 60 secondary, 45 tertiary, 30 boundaries and marks. */
  target: number;
  kind: 'text' | 'boundary';
  fgClass: string;
  bgClass: string;
  sample: string;
}

export const tokenPairings: TokenPairing[] = [
  { label: 'ink on surface', fgToken: 'ink', bgToken: 'surface', target: 75, kind: 'text', fgClass: 'text-ink', bgClass: 'bg-surface', sample: 'Body text' },
  { label: 'ink-muted on surface', fgToken: 'ink-muted', bgToken: 'surface', target: 60, kind: 'text', fgClass: 'text-ink-muted', bgClass: 'bg-surface', sample: 'Secondary text' },
  { label: 'ink-faint on surface', fgToken: 'ink-faint', bgToken: 'surface', target: 45, kind: 'text', fgClass: 'text-ink-faint', bgClass: 'bg-surface', sample: '12 Sep 2026' },
  { label: 'ink on sunk', fgToken: 'ink', bgToken: 'sunk', target: 75, kind: 'text', fgClass: 'text-ink', bgClass: 'bg-sunk', sample: 'Body text' },
  { label: 'ink-muted on sunk', fgToken: 'ink-muted', bgToken: 'sunk', target: 60, kind: 'text', fgClass: 'text-ink-muted', bgClass: 'bg-sunk', sample: 'Secondary text' },
  { label: 'ink-faint on sunk', fgToken: 'ink-faint', bgToken: 'sunk', target: 45, kind: 'text', fgClass: 'text-ink-faint', bgClass: 'bg-sunk', sample: '12 Sep 2026' },
  { label: 'accent-ink on surface (link)', fgToken: 'accent-ink', bgToken: 'surface', target: 75, kind: 'text', fgClass: 'text-accent-ink underline decoration-2 underline-offset-2', bgClass: 'bg-surface', sample: 'A link' },
  { label: 'accent on surface (mark)', fgToken: 'accent', bgToken: 'surface', target: 30, kind: 'text', fgClass: 'text-accent', bgClass: 'bg-surface', sample: '●' },
  { label: 'border on surface (boundary)', fgToken: 'border', bgToken: 'surface', target: 30, kind: 'boundary', fgClass: 'border-border', bgClass: 'bg-surface', sample: '' },
  { label: 'title-bar-ink on title-bar', fgToken: 'title-bar-ink', bgToken: 'title-bar', target: 75, kind: 'text', fgClass: 'text-title-bar-ink', bgClass: 'bg-title-bar', sample: 'about.txt' },
  { label: 'ink-muted on menu-bar', fgToken: 'ink-muted', bgToken: 'menu-bar', target: 60, kind: 'text', fgClass: 'text-ink-muted', bgClass: 'bg-menu-bar', sample: 'Section' },
  { label: 'accent on menu-bar', fgToken: 'accent', bgToken: 'menu-bar', target: 30, kind: 'text', fgClass: 'text-accent', bgClass: 'bg-menu-bar', sample: '●' },
  { label: 'ink-muted on dock', fgToken: 'ink-muted', bgToken: 'dock', target: 60, kind: 'text', fgClass: 'text-ink-muted', bgClass: 'bg-dock', sample: 'Home' },
  { label: 'accent on dock', fgToken: 'accent', bgToken: 'dock', target: 30, kind: 'text', fgClass: 'text-accent', bgClass: 'bg-dock', sample: '●' },
  { label: 'desktop-ink on desktop', fgToken: 'desktop-ink', bgToken: 'desktop', target: 75, kind: 'text', fgClass: 'text-desktop-ink', bgClass: 'bg-desktop', sample: 'About' },
  { label: 'window-edge on desktop', fgToken: 'window-edge', bgToken: 'desktop', target: 30, kind: 'boundary', fgClass: 'border-window-edge', bgClass: 'bg-desktop', sample: '' },
  { label: 'window-edge on menu-bar', fgToken: 'window-edge', bgToken: 'menu-bar', target: 30, kind: 'boundary', fgClass: 'border-window-edge', bgClass: 'bg-menu-bar', sample: '' },
  { label: 'window-edge on dock', fgToken: 'window-edge', bgToken: 'dock', target: 30, kind: 'boundary', fgClass: 'border-window-edge', bgClass: 'bg-dock', sample: '' },
];
