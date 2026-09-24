// OKLCH → sRGB conversion and `--color-*` token parsing, shared by the
// styleguide's colour-system reference and by `apca.ts`. Kept separate from
// `apca.ts` so the APCA formula file stays a direct transcription of the spec.

export interface Oklch {
  l: number; // 0–1
  c: number;
  h: number; // degrees
}

// OKLab → linear sRGB, Björn Ottosson's published matrices — the same ones
// `scripts/contrast.mjs` uses, duplicated there rather than imported because
// that script runs outside Vite's module resolution. Unclamped, so a caller
// that needs to know whether a colour actually fits sRGB (`isInSrgbGamut`)
// can see the out-of-range channel before it gets clipped away.
function oklchToLinearSrgbUnclamped({ l, c, h }: Oklch): [number, number, number] {
  const hueRadians = (h * Math.PI) / 180;
  const a = c * Math.cos(hueRadians);
  const b = c * Math.sin(hueRadians);

  const lMix = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mMix = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sMix = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    4.0767416621 * lMix - 3.3077115913 * mMix + 0.2309699292 * sMix,
    -1.2684380046 * lMix + 2.6097574011 * mMix - 0.3413193965 * sMix,
    -0.0041960863 * lMix - 0.7034186147 * mMix + 1.707614701 * sMix,
  ];
}

export function oklchToLinearSrgb(oklch: Oklch): [number, number, number] {
  return oklchToLinearSrgbUnclamped(oklch).map((channel) =>
    Math.min(Math.max(channel, 0), 1),
  ) as [number, number, number];
}

// Whether a colour renders without channel clipping, i.e. without silently
// being pulled onto the gamut boundary by oklchToLinearSrgb's clamp.
export function isInSrgbGamut(oklch: Oklch, epsilon = 1e-4): boolean {
  return oklchToLinearSrgbUnclamped(oklch).every(
    (channel) => channel >= -epsilon && channel <= 1 + epsilon,
  );
}

export function linearToGammaSrgb(channel: number): number {
  const clamped = Math.min(Math.max(channel, 0), 1);
  return clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * clamped ** (1 / 2.4) - 0.055;
}

// The inverse of oklchToHex's own byte step — parses `#rrggbb` back to gamma
// sRGB 0–1, for callers (APCA on hex palette candidates) that never touch OKLCH.
export function hexToRgb01(hex: string): [number, number, number] {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!match) throw new Error(`not a #rrggbb hex colour: ${hex}`);
  const [r, g, b] = [match[1]!, match[2]!, match[3]!];
  return [r, g, b].map((byte) => parseInt(byte, 16) / 255) as [number, number, number];
}

export function oklchToHex(oklch: Oklch): string {
  const bytes = oklchToLinearSrgb(oklch)
    .map(linearToGammaSrgb)
    .map((channel) => Math.round(channel * 255));
  return `#${bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

export interface ColorToken {
  oklch: Oklch;
  /** The literal `L% C H` from the source CSS, so display never re-derives it through floats. */
  oklchText: string;
  hex: string;
}

const TOKEN_PATTERN =
  /--color-([a-z0-9-]+):\s*oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)/g;

export function parseColorTokens(css: string): Record<string, ColorToken> {
  return Object.fromEntries(
    [...css.matchAll(TOKEN_PATTERN)].map(([, name, l, c, h]) => {
      const oklch: Oklch = { l: Number(l) / 100, c: Number(c), h: Number(h) };
      return [name, { oklch, oklchText: `${l}% ${c} ${h}`, hex: oklchToHex(oklch) }];
    }),
  );
}

/** Brace-balanced block extraction, so a nested rule inside `@theme` or `.dark` can't truncate the match. */
export function cssBlock(css: string, header: string, from = 0): string {
  const open = css.indexOf('{', css.indexOf(header, from));
  let depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    else if (css[i] === '}' && (depth -= 1) === 0) return css.slice(open + 1, i);
  }
  throw new Error(`unbalanced block: ${header}`);
}

/** Throws rather than returning `undefined` — a missing token here is a typo in the caller, not a state worth rendering around. */
export function requireToken(tokens: Record<string, ColorToken>, name: string): ColorToken {
  const token = tokens[name];
  if (!token) throw new Error(`no --color-${name} token found in global.css`);
  return token;
}

export interface ThemedColorTokens {
  light: Record<string, ColorToken>;
  dark: Record<string, ColorToken>;
}

// The ramps (`leaf-*`, `pumpkin-*`) never appear in `.dark` — they don't flip
// with the theme, the roles pick different steps instead — so `dark` here
// starts from every light token and layers the `.dark` overrides on top.
export function parseThemedColorTokens(css: string): ThemedColorTokens {
  const light = parseColorTokens(cssBlock(css, '@theme'));
  const dark = { ...light, ...parseColorTokens(cssBlock(css, '.dark', css.indexOf('@theme'))) };
  return { light, dark };
}
