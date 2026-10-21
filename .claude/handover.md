# Handover

Session bootstrap. State as of 20 Oct 2026, `main` at `98ab5aa`. **Read `.claude/coding-guide.md`
before writing code** and `.claude/CLAUDE.md` for conventions. Agent-facing; `docs/` is for James.

## Where it is

Astro site with a fictional-desktop UI: one framed window per page, a translucent top bar, a
dock, desktop shortcuts, client-side routing. Windows drag, resize, minimise, maximise
(persists across pages) and close; on `lg` the window fits its content up to the bars and
scrolls inside.

Build passes, 82 tests, ~9.7 KB gz JS on content pages (`/styleguide` ~81 KB: React island).
CI (`.github/workflows/ci.yml`) runs `pnpm test` on every push and PR.

## Commands

```bash
nvm use        # Node 24 (.nvmrc); the default shell Node is too old
pnpm dev       # localhost:4321
pnpm build     # astro check && astro build
pnpm test
```

## Colour system (settled; James reviews by eye)

| | |
|---|---|
| Authority | APCA Lc (inlined in `src/components/ui/TokenPairings.tsx`). WCAG AA advisory only |
| Targets | body 90, secondary/small UI 75, tertiary 60, marks/boundaries 30, decorative lines 15 |
| Parity | Each pair's \|Lc\| roughly equal in light and dark (±5) |
| Ramps | `pumpkin`, `leaf`, `umber` (warm neutral), `ash` (grey neutral); 50–900 on one fixed lightness scale |
| Tokens | Literal OKLCH, mostly off-ramp; no token is a raw ramp step. `leaf` is unused |
| Brand | `title-bar`: pumpkin hue 53, sRGB `oklch(56% 0.142 53)` + P3 `0.162` via `@media (color-gamut: p3)`; same both themes |
| Elevation | 0 `desktop` < 1 `elevation-1` (top bar) < 2 `elevation-2` (dock) < 3 `surface` (window). Higher = lighter, more opaque, more blur, both themes |
| Bars | Frosted neutrals with alpha + `backdrop-blur`; translucent edges for separation only |
| Wallpaper | `Wallpaper.tsx` props (gradient + specular noise per theme); `desktop` token is its flat fallback |

**`/styleguide` is the colour workbench:** every ramp/token with L C H, drift deltas, live
L/C/H/A editors with eyedropper, and every pairing scored live (✓/✗, composited over the
wallpaper when translucent). Use it to check any colour change; it parses `global.css` at build.

## Window behaviour (`lg` and up)

| | |
|---|---|
| Default size | Fits content, capped at `min(80dvh, space between bars)`; `<main>` scrolls inside. CSS only: wrapper `lg:h-dvh lg:flex-none`, frame `lg:max-h-[min(80dvh,100%)]` |
| Fixed size | Any drag or resize (pointer past 3px, or arrow keys) fixes the full rect; stored in `sessionStorage` `window-rect`, re-applied pre-paint on every navigation |
| Maximise | Button or title double-click toggles. Persists across pages via `window-maximised` (holds the pre-maximise rect; empty = was in flow) |
| Reset to default | Close button only (`resetWindow`); double-click no longer resets |
| Code | Geometry + DOM wiring in `src/lib/window.ts`; UI components in `src/components/ui/Window.tsx`; `.astro` wrappers own `transition:*` |

## Outstanding

**Launch blockers:** home-page pitch; contact route (will need error/success status colours).
`src/data/site.ts` has `PLACEHOLDER` fields; work write-ups are stubs.

**Open:**
- `link-1`…`link-5` — James intends to remove them.
- `leaf` ramp and `ground` token unused — removal candidates.
- Dark window face (23%) is darker than the wallpaper's lightest corner (28%).
- Dock's top highlight is an inset `box-shadow`, against the "no shadows" rule.
- Win98 icons are Microsoft's, unlicensed. Alternatives: pixelarticons (MIT), Kenney (CC0).
- CV on the desktop contradicts `design-blueprint.md` decision 12.
- `design-system.md` §5 (inverted, borderless bars) and §9 (Start menu) are stale.
- Code-style debt from the 20 Oct conventions (comment placement, 3+-use extraction, 100-char
  comments): 33 comment lines over 100 chars (half in `window.ts`); single-use vars in
  `Window.tsx` (`minimiseGlyphClass`, `maximiseGlyphClass`, `labelClass`) and `Bar.tsx`
  (`dockCluster`, `dockNav`); `Dock.astro`'s `middle` slot has no caller.
- Arrow-key scrolling inside the window may need focus in `<main>` outside Chrome; untested.

## Verifying in a browser

Headless Chrome works. Themes: `--blink-settings=preferredColorScheme=1` is light, `=0` dark.
Hover, clicks and slider drags need the DevTools Protocol (`--remote-debugging-port`, Node's
global `WebSocket`, `Input.dispatchMouseEvent`). Keep such scripts in the scratchpad. Use the
project's Node (`nvm use`); Node 20 has no global `WebSocket`. Window flows (drag, maximise,
navigate) can be driven with `Runtime.evaluate`: dispatch `dblclick`/`keydown`, click a
`.dock-item`, then read the frame's `getBoundingClientRect()`. The Claude in Chrome extension
may not be connected.

## Working with agents

- **Agents under-report tokens about 2×.** Report the harness figure, not theirs.
- **Brief exactly**: files, line anchors, values, targets, what not to touch. Vague briefs lost
  content twice (pairings deleted; rules removed without moving them).
- **Hard rules in caps-free plain words** ("do not remove any pairing"), and ask for a
  before/after count.
- **Verify every claim** in a browser or the built HTML; reports have claimed passes that failed.
- **Small value tweaks: do them directly.** Agent startup cost exceeds the edit.
