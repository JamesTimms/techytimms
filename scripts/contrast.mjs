// Dumps WCAG contrast for the token pairs that matter, both themes.
// Usage: pnpm contrast
import { readFileSync } from 'node:fs';

const css = readFileSync('src/styles/global.css', 'utf8');

// [foreground, background, minimum] — edit this list as the design changes.
// A background may be a token name, or { light, dark } where it differs by theme
// (the bars fill from the ramp in the opposite direction to the site theme).
const PAIRS = [
  ['ink', 'ground', 4.5],
  ['ink', 'surface', 4.5],
  ['ink-muted', 'surface', 4.5],
  ['ink-faint', 'ground', 4.5],
  ['accent-ink', 'ground', 4.5],
  ['border', 'surface', 3],
  ['border', 'sunk', 3],
  ['window-edge', 'desktop', 3],
  ['desktop-ink', 'desktop', 4.5],
  ['bar-ink-muted', { light: 'leaf-900', dark: 'leaf-50' }, 4.5],
  ['bar-accent', { light: 'leaf-900', dark: 'leaf-50' }, 4.5],
];

function luminance(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.min(Math.max(v, 0), 1));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

const ratio = (a, b) => {
  const [hi, lo] = [luminance(...a), luminance(...b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// Brace-balanced block, so a nested rule can't truncate it.
function block(header, from = 0) {
  const open = css.indexOf('{', css.indexOf(header, from));
  let depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    else if (css[i] === '}' && (depth -= 1) === 0) return css.slice(open + 1, i);
  }
  throw new Error(`unbalanced block: ${header}`);
}

const parse = (text) =>
  Object.fromEntries(
    [...text.matchAll(/--color-([a-z0-9-]+):\s*oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)/g)].map(
      ([, name, L, C, H]) => [name, [Number(L) / 100, Number(C), Number(H)]],
    ),
  );

const light = parse(block('@theme'));
const dark = { ...light, ...parse(block('.dark', css.indexOf('@theme'))) };

let failed = 0;
for (const [label, tokens] of [['LIGHT', light], ['DARK', dark]]) {
  console.log(`\n${label}`);
  for (const [fg, background, min] of PAIRS) {
    const bg = typeof background === 'string' ? background : background[label.toLowerCase()];
    if (!tokens[fg] || !tokens[bg]) {
      console.log(`  ${fg} on ${bg}  — token missing`);
      continue;
    }
    const value = ratio(tokens[fg], tokens[bg]);
    const ok = value >= min;
    if (!ok) failed += 1;
    console.log(
      `  ${fg.padEnd(14)} on ${bg.padEnd(14)} ${value.toFixed(2).padStart(6)}:1  need ${min}  ${ok ? 'pass' : 'FAIL'}`,
    );
  }
}
console.log(failed ? `\n${failed} failing pair(s)` : '\nall pairs pass');
process.exit(failed ? 1 : 0);
