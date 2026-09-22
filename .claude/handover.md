# Handover

Session bootstrap. **Read `.claude/coding-guide.md` before writing any code.** State as of 22 Sep 2026. Read `CLAUDE.md` alongside this for conventions and gotchas.

Agent-facing: kept out of `docs/`, which is for James.

## Where it is

A working Astro site with a fictional-desktop UI: a framed window holding the page, an
icon dock at the bottom, a status bar at the top, desktop shortcuts, and client-side
routing. Windows drag, resize, minimise, maximise, close, and reset on title double-click.

Build passes, 92 tests, ~9.1 KB gzipped JS per page.

## Commands

```bash
nvm use                  # Node 24 — the default shell Node is too old
pnpm dev                 # localhost:4321
pnpm build               # astro check && astro build
pnpm test
pnpm check:invariants    # run after build — asserts client-script hooks survive
pnpm contrast            # token contrast table, both themes
```

`check:invariants` and `contrast` exist because those two classes of bug fail at
*runtime*, not at build: a renamed selector breaks delegated handlers silently, and an
undefined `--color-*` token is valid CSS that resolves to nothing. Use them instead of
hand-rolled greps or a one-off colour converter.

## Current design state

| | |
|---|---|
| Palette | Fallen Leaf, muted. Pumpkin available as a CVA variant. Others in `palette-exploration.md` |
| Background | Grain — SVG `feTurbulence`, `saturate 0`, `mix-blend-mode: overlay` |
| Ramps | `--color-leaf-*` / `--color-pumpkin-*`, 10 steps (50–900), even lightness |
| Window | Thin border, flat title bar, `period`/`soft`/`flat` chrome variants |
| Bars | Fill runs *opposite* the site theme; no borders |

## Architecture: `.astro` is the data layer, `.tsx` is the UI layer

- **`.astro`** — pages, layouts, and thin wrappers. Owns data access (`getCollection`,
  `Astro.url`, `Astro.site`), Astro directives (`transition:*`, `is:inline`, `client:*`),
  `<head>`, and inline scripts. A component-level `.astro` file should be a wrapper, not
  a component.
- **`.tsx`** — the component library. Grouped, reusable, composable components in shared
  files, with CVA variants. Renders to static HTML; **no `client:*` unless interaction
  genuinely requires it.**
- **`src/lib/*.ts`** — pure logic with tests.

Directives do not exist in `.tsx` and silently do nothing on a component tag, so anything
carrying one needs an `.astro` element to own it. That is what the thin wrappers are for.

React's renderer is currently loaded by **zero** pages. The first `client:*` directive
changes that for every page containing that component — a bundle-level decision, not a
component-level one.

## Outstanding

**Blocking a launch** — the home-page pitch and a contact route. `src/data/site.ts` has
`PLACEHOLDER` fields. Work write-ups are stubs.

**Open decisions**

- CV sits on the desktop and in the dock's secondary group. This contradicts
  `design-blueprint.md` decision 12 ("plainly not the headline"). Unresolved.
- `Desktop.tsx` and `Desktop.astro` share a stem. Resolves fine, reads oddly.
- The GitHub dock icon is 16px beside 32px neighbours — no 32px globe is curated in
  `src/assets/icons/win98/`.
- Win98 icons are Microsoft's, protected until 2068, with no licence from the source
  site. Technically infringing, practically very low risk. Open-licence alternatives:
  pixelarticons (MIT), Tango (public domain), Kenney (CC0).
- `design-system.md` §9 still describes the Start menu, which no longer exists.

## Not verified

**Nothing has been checked in a browser** across roughly twenty changes — the window
chrome in both themes, the icon dock, both bars, sticky behaviour, drag/resize/maximise,
the sun dial, and the grain. Contrast is computed and markup is asserted; appearance is not.

`pnpm dev` and a pass over both themes at mobile and `lg` widths is the highest-value
next action.

## Working with agents

Cost lessons, learned expensively — 27 agents, ~6.1M tokens.

- **Never fork.** A fork inherits the whole conversation: 425k average versus 90k for a
  fresh agent with a targeted brief.
- **Model by risk, not diff size.** Haiku for mechanical edits with explicit values;
  Sonnet for anything deriving a value or spanning files. Haiku failed twice here, both
  times when it had to reason about *which direction* a value should move.
- **Hand over measured constraints inline** so agents don't rediscover them.
- **Batch related tweaks.** Each agent pays a fixed startup tax; three tweaks to one file
  should be one task.
- **Check small things yourself first.** Several "regressions" were two-line fixes that
  cost nothing to diagnose directly.
- **Always verify the report.** Agents have claimed passes that did not hold.
