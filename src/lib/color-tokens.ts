// OKLCH ↔ sRGB conversion and `--color-*` token parsing.

export interface Oklch {
  l: number; // 0–1
  c: number;
  h: number; // degrees
  alpha?: number; // 0–1, absent when opaque
}

// OKLab → linear sRGB (Ottosson's matrices), unclamped so `isInSrgbGamut` sees out-of-range channels.
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

// Renders without channel clipping.
export function isInSrgbGamut(oklch: Oklch, epsilon = 1e-4): boolean {
  return oklchToLinearSrgbUnclamped(oklch).every(
    (channel) => channel >= -epsilon && channel <= 1 + epsilon,
  );
}

export function linearToGammaSrgb(channel: number): number {
  const clamped = Math.min(Math.max(channel, 0), 1);
  return clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * clamped ** (1 / 2.4) - 0.055;
}

// Inverse of oklchToHex's byte step: `#rrggbb` to gamma sRGB 0–1.
function hexToRgb01(hex: string): [number, number, number] {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!match) throw new Error(`not a #rrggbb hex colour: ${hex}`);
  const [r, g, b] = [match[1]!, match[2]!, match[3]!];
  return [r, g, b].map((byte) => parseInt(byte, 16) / 255) as [number, number, number];
}

export function linearSrgbToOklch([r, g, b]: [number, number, number]): Oklch {
  const lMix = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const mMix = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const sMix = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const l = 0.2104542553 * lMix + 0.793617785 * mMix - 0.0040720468 * sMix;
  const a = 1.9779984951 * lMix - 2.428592205 * mMix + 0.4505937099 * sMix;
  const bAxis = 0.0259040371 * lMix + 0.7827717662 * mMix - 0.808675766 * sMix;

  const hue = (Math.atan2(bAxis, a) * 180) / Math.PI;
  return { l, c: Math.hypot(a, bAxis), h: hue < 0 ? hue + 360 : hue };
}

const gammaToLinearSrgb = (channel: number) =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

export function hexToOklch(hex: string): Oklch {
  return linearSrgbToOklch(hexToRgb01(hex).map(gammaToLinearSrgb) as [number, number, number]);
}

export function oklchToHex(oklch: Oklch): string {
  const bytes = oklchToLinearSrgb(oklch)
    .map(linearToGammaSrgb)
    .map((channel) => Math.round(channel * 255));
  return `#${bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

export interface ColorToken {
  oklch: Oklch;
  /** The literal `L% C H[ / A]` from the source CSS, so display never re-derives it through floats. */
  oklchText: string;
  hex: string;
}

const TOKEN_PATTERN =
  /--color-([a-z0-9-]+):\s*oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+)\s*)?\)/g;

function parseColorTokens(css: string): Record<string, ColorToken> {
  return Object.fromEntries(
    [...css.matchAll(TOKEN_PATTERN)].map(([, name, l, c, h, alpha]) => {
      const oklch: Oklch = { l: Number(l) / 100, c: Number(c), h: Number(h) };
      if (alpha !== undefined) oklch.alpha = Number(alpha);
      const oklchText = `${l}% ${c} ${h}${alpha === undefined ? '' : ` / ${alpha}`}`;
      return [name, { oklch, oklchText, hex: oklchToHex(oklch) }];
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

// Ramps don't flip in `.dark`, so dark starts from all light tokens plus the overrides.
export function parseThemedColorTokens(css: string): ThemedColorTokens {
  const light = parseColorTokens(cssBlock(css, '@theme'));
  const dark = { ...light, ...parseColorTokens(cssBlock(css, '.dark', css.indexOf('@theme'))) };
  return { light, dark };
}
