// Asserts the hooks that client script depends on survive a build.
// These fail at runtime, not at build, so nothing else catches them.
// Usage: pnpm build && pnpm check:invariants
import { readFileSync, existsSync } from 'node:fs';

const PAGE = 'dist/index.html';

// [needle, expected occurrences] — exact counts catch duplicates as well as loss.
const REQUIRED = [
  ['id="main"', 1],
  ['id="dock-nav"', 1],
  ['id="theme-toggle"', 1],
  ['data-window-frame', 1],
  ['data-window-minimise', 1],
  ['data-window-task', 1],
  ['data-astro-transition-persist="dock"', 1],
  ['data-astro-transition-persist="status-bar"', 1],
  ['data-astro-transition-persist="persist-desktop-top"', 1],
  ['data-astro-transition-persist="persist-desktop-bottom"', 1],
];

// Present at least once; count varies with the nav.
const AT_LEAST_ONE = ['class="dock-item', 'class="tooltip', 'desktop-shortcut'];

if (!existsSync(PAGE)) {
  console.error(`${PAGE} not found — run pnpm build first`);
  process.exit(1);
}

const html = readFileSync(PAGE, 'utf8');
const count = (needle) => html.split(needle).length - 1;

let failed = 0;
for (const [needle, expected] of REQUIRED) {
  const found = count(needle);
  const ok = found === expected;
  if (!ok) failed += 1;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${needle.padEnd(48)} ${found}/${expected}`);
}
for (const needle of AT_LEAST_ONE) {
  const found = count(needle);
  const ok = found > 0;
  if (!ok) failed += 1;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${needle.padEnd(48)} ${found}/1+`);
}

// Undefined custom properties are valid CSS and fail silently — this has bitten once.
const cssText = readFileSync('src/styles/global.css', 'utf8');
const defined = new Set([...cssText.matchAll(/--color-([a-z0-9-]+)\s*:/g)].map((m) => m[1]));
const used = new Set(
  [...readFileSync('src/components/ThemeToggle.astro', 'utf8').matchAll(/var\(--color-([a-z0-9-]+)\)/g)].map(
    (m) => m[1],
  ),
);
for (const name of used) {
  if (!defined.has(name)) {
    failed += 1;
    console.log(`  FAIL undefined token --color-${name}`);
  }
}

console.log(failed ? `\n${failed} failure(s)` : '\nall invariants hold');
process.exit(failed ? 1 : 0);
