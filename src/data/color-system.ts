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
  { key: 'leaf', name: 'leaf', hue: 80, liveRamp: 'leaf' },
  { key: 'pumpkin', name: 'pumpkin', hue: 55, liveRamp: 'pumpkin' },
  { key: 'neutral', name: 'neutral / ink', hue: 85, liveRamp: null },
  { key: 'accent', name: 'accent', hue: 40, liveRamp: null },
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
    why: 'vs reusing `accent`: the text-safe half of the same hue. See the “bug” flagged in Main colours — it is currently lighter than `accent`, not darker.',
  },
  {
    token: 'accent-sunk',
    purpose: 'Tinted panel fill — callouts, active dock state.',
    why: 'vs plain `sunk`: a callout needs to read as accent-flavoured, not merely inset.',
  },
  {
    token: 'bar-ink-muted',
    purpose: 'Text and icons on a bar whose fill runs opposite the site theme.',
    why: 'vs reusing `ink-muted`: that token assumes a surface matching the current theme. The bars invert (dark fill in light mode, light in dark), so the text on them needs the other theme’s muted ink.',
  },
  {
    token: 'bar-accent',
    purpose: 'Marks and icons on that same inverted bar fill.',
    why: 'Same inversion as `bar-ink-muted`, for accent.',
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
    usageNote: '0 uses. Defined in global.css, referenced by no CSS or markup.',
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
