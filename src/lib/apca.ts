import { hexToRgb01, linearToGammaSrgb, oklchToLinearSrgb, type Oklch } from '~/lib/color-tokens';

// APCA-W3 0.1.9 (the SAPC/APCA "bridge" formula), transcribed from the
// published constants — not WCAG 2's ratio. Verified against the two
// documented reference values: black-on-white is Lc 106.04, white-on-black
// is Lc -107.88 (see apca.test.ts).

const RED_WEIGHT = 0.2126729;
const GREEN_WEIGHT = 0.7151522;
const BLUE_WEIGHT = 0.072175;
const GAMMA = 2.4;

// Soft-clamps luminance near black — APCA's own correction for the eye's
// reduced sensitivity to very low light, not a bug in the power curve above.
const BLACK_CLAMP_THRESHOLD = 0.022;
const BLACK_CLAMP_EXPONENT = 1.414;
const MIN_DISCERNIBLE_DELTA = 0.0005;

const NORMAL_BACKGROUND_EXPONENT = 0.56;
const NORMAL_TEXT_EXPONENT = 0.57;
const REVERSE_TEXT_EXPONENT = 0.62;
const REVERSE_BACKGROUND_EXPONENT = 0.65;
const SCALE = 1.14;
const LOW_CONTRAST_CLIP = 0.1;
const OFFSET = 0.027;

// Not true linear light: APCA applies its power curve straight to the
// gamma-encoded channel as its own pseudo-linearisation, per spec.
function apcaLuminanceFromGamma([r, g, b]: [number, number, number]): number {
  return r ** GAMMA * RED_WEIGHT + g ** GAMMA * GREEN_WEIGHT + b ** GAMMA * BLUE_WEIGHT;
}

function apcaLuminance(oklch: Oklch): number {
  return apcaLuminanceFromGamma(oklchToLinearSrgb(oklch).map(linearToGammaSrgb) as [number, number, number]);
}

function clampNearBlack(y: number): number {
  return y > BLACK_CLAMP_THRESHOLD ? y : y + (BLACK_CLAMP_THRESHOLD - y) ** BLACK_CLAMP_EXPONENT;
}

// Signed: positive is dark text on light, negative is light on dark. The two
// polarities use different exponents, so the sign carries meaning.
function apcaContrastFromLuminance(textY: number, backgroundY: number): number {
  if (Math.abs(backgroundY - textY) < MIN_DISCERNIBLE_DELTA) return 0;

  if (backgroundY > textY) {
    const contrast =
      (backgroundY ** NORMAL_BACKGROUND_EXPONENT - textY ** NORMAL_TEXT_EXPONENT) * SCALE;
    return (contrast < LOW_CONTRAST_CLIP ? 0 : contrast - OFFSET) * 100;
  }

  const contrast =
    (backgroundY ** REVERSE_BACKGROUND_EXPONENT - textY ** REVERSE_TEXT_EXPONENT) * SCALE;
  return (contrast > -LOW_CONTRAST_CLIP ? 0 : contrast + OFFSET) * 100;
}

export function apcaContrast(text: Oklch, background: Oklch): number {
  return apcaContrastFromLuminance(clampNearBlack(apcaLuminance(text)), clampNearBlack(apcaLuminance(background)));
}

// Same formula, fed sRGB hex directly — for palette candidates that are only
// ever specified as hex (they must render both themes at once, so they can't
// use theme-dependent OKLCH tokens; see palette-candidates.ts).
export function apcaContrastHex(text: string, background: string): number {
  return apcaContrastFromLuminance(
    clampNearBlack(apcaLuminanceFromGamma(hexToRgb01(text))),
    clampNearBlack(apcaLuminanceFromGamma(hexToRgb01(background))),
  );
}
