# Design System

The implementable specification. `design-blueprint.md` holds the ideas and the
decisions; this file holds the values, primitives and rules that the code
implements. If the two disagree, the blueprint's section 6 wins and this file
is wrong.

Every contrast ratio below was computed, not estimated — OKLCH converted to
sRGB and run through the WCAG relative-luminance formula. All 42 checked pairs
pass.

---

## 1. Palette

**Live scheme: Fallen Leaf.** Pale straw wallpaper, warm greys at **hue 85**,
deep russet accent at **hue 45**. The greys are low-chroma warm rather than
neutral, which is what makes them read as paper rather than as dirty grey.

The neutrals and the accent no longer share a hue, and that is deliberate: the
accent has to clear 3:1 against the wallpaper for the desktop to be able to show
selection, and on a pale wallpaper that needs the accent dark and saturated.
Hue is the free variable — see §1.3.

Six alternative schemes are specified in `docs/palette-exploration.md` and
rendered as swatches at `/styleguide`, where the live one is badged. Swapping is
a block replacement: everything colour-bearing in `global.css` sits between the
two `PALETTE` markers.

### Tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `ground` | `oklch(98.5% 0.006 85)` | `oklch(17% 0.012 85)` | Contrast baseline; no current markup use |
| `surface` | `oklch(100% 0 85)` | `oklch(21% 0.014 85)` | Panel and window fill |
| `sunk` | `oklch(95.5% 0.012 85)` | `oklch(14% 0.010 85)` | Inset areas, code blocks, title bars |
| `rule` | `oklch(88.5% 0.016 85)` | `oklch(32% 0.018 85)` | Decorative dividers only |
| `border` | `oklch(63% 0.018 85)` | `oklch(52% 0.018 85)` | Panel borders. **Not** the window's outer edge |
| `window-edge` | `oklch(47% 0.018 85)` | `oklch(55% 0.018 85)` | Window outer edge on the wallpaper, where no bevel draws it |
| `ink-faint` | `oklch(55.5% 0.024 85)` | `oklch(62% 0.020 85)` | Tertiary text: dates, metadata |
| `ink-muted` | `oklch(47% 0.028 85)` | `oklch(74% 0.020 85)` | Secondary body text |
| `ink` | `oklch(24% 0.030 85)` | `oklch(93% 0.014 85)` | Primary text |
| `accent` | `oklch(48% 0.130 45)` | `oklch(81% 0.110 60)` | Marks, rings, borders — **never text** |
| `accent-ink` | `oklch(47% 0.110 45)` | `oklch(82% 0.105 60)` | Accent **text** |
| `accent-sunk` | `oklch(95.5% 0.024 45)` | `oklch(26% 0.035 60)` | Tinted panel fill |
| `desktop` | `oklch(80% 0.034 80)` | `oklch(16% 0.014 60)` | The wallpaper — **pale** in light, near-black in dark. Muted per decision 15 |
| `desktop-ink` | `oklch(24% 0.022 80)` | `oklch(97% 0.006 60)` | Shortcut labels. **Flips** |
| `titlebar-from` | `oklch(34% 0.04 60)` | *same* | Title bar gradient, left/dark end |
| `titlebar-to` | `oklch(52% 0.027 70)` | *same* | Title bar gradient, right/light end |
| `titlebar-ink` | `oklch(99% 0 55)` | *same* | Title text. Does not flip |
| `bevel-light` | `oklch(100% 0 85)` | `oklch(56% 0.020 85)` | Raised top/left edge |
| `bevel-dark` | `oklch(38% 0.020 85)` | `oklch(8% 0.010 85)` | Raised bottom/right edge |

`accent-sunk` is published in `palette-exploration.md` at chroma 0.028, which
clips red in sRGB. 0.024 is the most that fits and costs 0.04 of contrast.

### `desktop` is not `ground`

`ground` is the contrast baseline — seventeen pairs per theme are measured
against it. `desktop` is the wallpaper the window sits on, and it never carries
text. They are separate tokens so that retuning the wallpaper cannot silently
invalidate the text contrast table.

`ground` is currently referenced by no markup at all; `body` paints `desktop`.
It stays because it is the baseline the type tokens were solved against, and
because any future surface that sits between the wallpaper and a panel will
want it.

### Two tokens that need explaining

**`border` vs `rule`.** `border` is deliberately dark — mid-grey in light mode,
not a hairline. Two reasons, and they agree: WCAG 1.4.11 requires 3:1 for UI
boundaries, and the design's whole thesis is *visible borders, flat fills, no
shadows*. A hairline would fail the guideline and undersell the look. `rule` is
the hairline, reserved for decorative separation where no boundary is being
communicated — it is exempt from 1.4.11 precisely because it carries no meaning.

If you find yourself reaching for `rule` to separate two panels, use `border`.
`rule` is for dividing a list, not for defining an object.

**`accent` vs `accent-ink`.** Amber at the chroma that looks right as a mark
does not reach 4.5:1 as text on a light ground. `accent` is for underlines,
focus rings, borders and marks. `accent-ink` is the only accent value allowed
on text. This split is the most common way a palette that looks fine fails an
audit.

### Verified contrast

Light theme:

| Pair | Ratio | Min | |
|---|---|---|---|
| `ink` on `ground` | 15.80 | 4.5 | ✅ |
| `ink` on `surface` | 16.51 | 4.5 | ✅ |
| `ink` on `sunk` | 14.68 | 4.5 | ✅ |
| `ink-muted` on `ground` | 6.56 | 4.5 | ✅ |
| `ink-muted` on `surface` | 6.85 | 4.5 | ✅ |
| `ink-muted` on `sunk` | 6.10 | 4.5 | ✅ |
| `ink-faint` on `ground` | 4.56 | 4.5 | ✅ |
| `ink-faint` on `surface` | 4.77 | 4.5 | ✅ |
| `accent-ink` on `ground` | 7.28 | 4.5 | ✅ |
| `accent-ink` on `surface` | 7.61 | 4.5 | ✅ |
| `accent-ink` on `accent-sunk` | 6.55 | 4.5 | ✅ |
| `ink` on `accent-sunk` | 14.22 | 4.5 | ✅ |
| `border` on `surface` | 3.51 | 3.0 | ✅ |
| `border` on `ground` | 3.36 | 3.0 | ✅ |
| `border` on `sunk` | 3.12 | 3.0 | ✅ |
| `accent` on `ground` | 4.21 | 3.0 | ✅ |
| `accent` on `surface` | 4.40 | 3.0 | ✅ |

Dark theme:

| Pair | Ratio | Min | |
|---|---|---|---|
| `ink` on `ground` | 15.55 | 4.5 | ✅ |
| `ink` on `surface` | 14.41 | 4.5 | ✅ |
| `ink` on `sunk` | 16.18 | 4.5 | ✅ |
| `ink-muted` on `ground` | 8.28 | 4.5 | ✅ |
| `ink-muted` on `surface` | 7.67 | 4.5 | ✅ |
| `ink-muted` on `sunk` | 8.61 | 4.5 | ✅ |
| `ink-faint` on `ground` | 5.24 | 4.5 | ✅ |
| `ink-faint` on `surface` | 4.86 | 4.5 | ✅ |
| `accent-ink` on `ground` | 10.08 | 4.5 | ✅ |
| `accent-ink` on `surface` | 9.34 | 4.5 | ✅ |
| `accent-ink` on `accent-sunk` | 8.70 | 4.5 | ✅ |
| `ink` on `accent-sunk` | 13.43 | 4.5 | ✅ |
| `border` on `surface` | 3.21 | 3.0 | ✅ |
| `border` on `ground` | 3.46 | 3.0 | ✅ |
| `border` on `sunk` | 3.61 | 3.0 | ✅ |
| `accent` on `ground` | 9.39 | 3.0 | ✅ |
| `accent` on `surface` | 8.71 | 3.0 | ✅ |

Wallpaper and taskbar pairs:

| Pair | Light | Dark | Min | |
|---|---|---|---|---|
| `ink` on `desktop` (shortcut label) | 6.60 | 16.28 | 4.5 | ✅ |
| `surface` on `ink` (selected label) | 16.51 | 14.41 | 4.5 | ✅ |
| `bevel-light` on `desktop` | 2.50 | 3.95 | 3.0 | one edge |
| `bevel-dark` on `desktop` | 4.02 | 1.04 | 3.0 | one edge |
| `bevel-light` on `sunk` | 1.12 | 3.92 | 3.0 | one edge |
| `bevel-dark` on `sunk` | 8.93 | 1.04 | 3.0 | one edge |
| `ink` on `sunk` | 14.68 | 16.18 | 4.5 | ✅ |
| `ink-muted` on `sunk` | 6.10 | 8.61 | 4.5 | ✅ |
| `border` on `sunk` | 3.12 | 3.61 | 3.0 | ✅ |

`ink-faint` on `ground` at 4.56 (light) is the tightest pair in the system. If
you darken `ground` or lighten `ink-faint`, recheck it.

### 1.3 Accent on the wallpaper is a lightness problem

**`accent` on `desktop` is 3.68 in light mode and 10.52 in dark** — usable in
both, where earlier schemes could not manage it at all.

Two earlier schemes failed this pair, and the first diagnosis was wrong. It
blamed the shared hue. Sweeping the wallpaper across the entire hue wheel at
fixed lightness moves the ratio by less than 0.1; sweeping *lightness* at fixed
hue moves it from 1.05 to 4.6. **It is entirely a lightness collision.**

The rule that falls out, and the one to check before retuning anything:

> An accent needs roughly **26–30 points of lightness separation** from the
> wallpaper to clear 3:1. Which direction does not matter — darker on a pale
> wallpaper, lighter on a dark one.

Fallen Leaf takes the first route: an 80% wallpaper with a 48% accent, 32 points
apart. That is the tightest margin in this scheme, so recheck it before moving
either token.

A corollary worth knowing: a **mid-lightness wallpaper around 44–55% is the
worst case**, too light to carry light text and too dark to carry dark text. The
workable regions are genuinely pale or genuinely dark, not the middle.

**`ink-faint` is not usable on `sunk` in light mode** — it lands at 4.24. The
taskbar's secondary text uses `ink-muted` for that reason. `sunk` is a darker
fill than `ground`, so any pair verified only against `ground` needs rechecking
before it moves onto a sunk surface.

Dark-theme separation between the wallpaper and the fills above it is low as a
WCAG ratio, and that ratio is a poor model at the dark end of the range. The
perceptual gap is real (21% and 14% against 13.5% lightness), but the boundary
that carries the signal is the raised edge at 3.95, not the fill.

### Extending to full ramps later

Plan §9 defers hand-built ramps of ~5 steps per hue. The tokens above are
*already* a 5-step neutral ramp with semantic names rather than numeric ones:

```
surface → ground → sunk → rule → border → ink-faint → ink-muted → ink
```

When the ramps arrive, the change is to add a numeric layer underneath and
redefine the semantic tokens as aliases:

```css
--neutral-0: …;  --neutral-1: …;  /* etc. */
--color-ground: var(--neutral-1);
```

Nothing in the markup changes, because the markup only ever names semantic
tokens. That is the reason for the rule below.

> **Never use a raw Tailwind palette colour in markup.** Not `text-stone-600`,
> not `border-gray-200`. Only the semantic tokens. This is what makes a palette
> change a one-file edit.

---

## 2. Type and spacing

**Deliberate, and staying:**

- Tailwind's spacing scale, unmodified. It is well-judged and deviating early buys nothing.
- Running text capped near 65 characters (`max-w-prose`).
- Headings use `text-balance`; body copy does not.

**Provisional, pending a font choice:**

- The type scale itself. Currently Tailwind defaults on the system `font-sans` stack.
- Line heights, heading tracking, and the vertical rhythm between headings and paragraphs. All three are font-specific — tuning them against the system stack and then changing the face would waste the work twice.
- The monospace stack, currently unset. The 2000s chrome wants a mono face for title bars and metadata; system mono is the placeholder.

Title bars and metadata labels use uppercase with positive letter-spacing. That
is deliberate and survives a font change, because it is a treatment, not a face.

---

## 3. The bordered-panel primitive

One primitive. Callouts, cards, buttons and window frames are all variants of
it. If something on the site needs a container, it is a panel.

**Base:** 1px `border` border, `surface` fill, square corners, no shadow, ever.

| Variant | Fill | Border | Used for |
|---|---|---|---|
| `default` | `surface` | `border` | Cards, list items that need bounding, window bodies |
| `sunk` | `sunk` | `border` | Inset regions, code blocks, empty states |
| `accent` | `accent-sunk` | `accent` | Callouts and notes |
| `bevel` | `surface` | `border` + light top/left, dark bottom/right | Buttons and controls only |

**The bevel is the period detail.** Windows 9x/2000 raised controls by painting
the top and left edges light and the bottom and right edges dark. It reads as
three-dimensional without a single shadow, which is exactly the constraint this
design already has. Pressed state inverts the bevel.

**Two rings, not one.** A Win9x raised button is a 2px *double* bevel: outer
light over inner light on the top-left, outer dark over inner dark on the
bottom-right. `.panel-bevel` carries the outer ring on its border and the inner
ring on a `::before` pseudo-element, so the effect stays a border treatment
rather than an inset shadow.

**Which edge identifies the control flips by theme.** The earlier rule — "a
bevel is identified by its lighter edge" — holds for the window against the
wallpaper, where the wallpaper is mid-dark. It does *not* hold for controls
sitting on a near-white panel. Measured against `sunk`:

| Edge | Light | Dark |
|---|---|---|
| `bevel-light` on `sunk` | 1.12 | **3.04** |
| `bevel-dark` on `sunk` | **8.93** | 1.04 |
| `border` (inner ring) on `sunk` | 3.12 | 3.61 |

In light mode the dark edge does the work; in dark mode the light edge does. The
general rule is therefore **at least one edge must clear 3:1 against the
surrounding fill**, not "the light one must". The inner `border` ring clears 3:1
in both themes independently, so the control boundary is compliant either way.

`.panel-bevel` previously lit its edges with `surface`/`ink-faint`. Those two
inverse-order in dark mode — `ink-faint` is *lighter* than `surface` there — so
every control rendered as pressed. Fixed to use the bevel tokens.

**Corner radius.** `0` for panels and windows. `2px` for controls. Nothing else.
2000s chrome is square; a rounded corner anywhere reads as a different decade.

**Callouts carry no traffic-light semantics.** No green success, no red error,
no amber warning. A callout is a panel, the border does the work, and if a
callout needs to say something is wrong it says so in words. This is the
explicit note from the blueprint about Sara Soueidan's callouts.

---

## 4. Window chrome

The signature element. A panel with a title bar.

### One window per page

`WindowFrame.astro` is the only window. One per document, rendered by
`BaseLayout`, wrapping `<main>`, carrying `transition:name="window"` and
`data-window-frame`.

**`Window.astro` is deleted.** It was an inner content panel used several times
per page, which made a window mean "a section" and a window mean "a page" at the
same time. Sections now use the group box — see §13. A window means a page.

### Anatomy

```
┌──────────────────────────────────────┐  ← 1px border
│ about.txt                  – □ ×     │  ← title bar: sunk fill, border-bottom
├──────────────────────────────────────┤
│                                      │
│   content                            │  ← surface fill, padded
│                                      │
└──────────────────────────────────────┘
```

- **Title bar.** A horizontal gradient, `titlebar-from` at the left to `titlebar-to` at the right, `border` bottom edge, a 16px pixel icon, then the title in `titlebar-ink`.
- **Controls.** Minimise, restore and close at the right, in bevel panels.
- **Body.** `surface` fill, padding on Tailwind's scale.

### The gradient, and why it is narrower than Windows'

Sampled from the reference screenshot, the Windows 2000 title bar runs
`#101b4c` to `#a3c8ee`. White text on the left end is 16.37:1; on the right end
it is **1.74:1**. Windows got away with that because its title is short and
left-aligned, so the text never reaches the pale end.

Ours cannot: titles are full paths and the controls sit at the right. The ramp
is therefore compressed to fourteen lightness points, solved so both ends clear
4.5:1 with `titlebar-ink`:

| End | Light | Dark | Min | |
|---|---|---|---|---|
| `titlebar-ink` on `titlebar-from` | 10.74 | 9.90 | 4.5 | ✅ |
| `titlebar-ink` on `titlebar-to` | 5.96 | 5.45 | 4.5 | ✅ |

**The direction is load-bearing, not decorative.** The controls sit at the right,
which is the light end. In dark mode a control clears 3:1 against that end
(3.70 via its dark edge) but *not* against the dark end (2.04). Reverse the
gradient and the controls disappear in dark mode. Windows' gradient direction
and its control placement are not independent choices.

### Glyphs are drawn, not typed

`–`, `□` and `×` as characters are sized by the font, centred on their own
baseline, and vary by platform. All three needed to sit at specific places at
specific sizes, so they are boxes:

| Glyph | Construction | Why |
|---|---|---|
| Minimise | 7×2px bar, flex-end, 2px from the bottom | **Sits on the button's lower edge, not centred.** The single detail that most marks a title bar as Win9x rather than generic |
| Restore | 9×8px outline, `border-top-width: 2px` | It is a window, not a square — the heavy top edge is its title bar |
| Close | Two 9×2px bars at ±45° | Fills the button the way the character never did |

Controls are 16×14px — sized to the bar rather than to their glyph, which is
what makes them read as a set.

### The title bar is the window's only chrome

Navigation lives in the Start menu (blueprint decision 8), so the window has no
header row, no menu bar and no in-window nav. What remains is content identity:
icon, title, decorative controls. A window that also carried navigation would be
competing with the taskbar for the same job.

### Controls are decorative, and must be marked as such

Window management is out of scope (plan §9). The controls therefore do nothing.

**They must not be rendered as `<button>`.** A focusable control that does
nothing is an accessibility trap: it takes a tab stop, announces itself as
actionable to a screen reader, and then fails to act. Render them as
`aria-hidden="true"` spans until they have behaviour.

When draggable windows arrive, they become real buttons with real labels — and
that is the moment the component needs to become a React island.

### Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | — | Shown in the title bar |
| `icon` | `IconName` | — | 16px pixel icon at the left of the title bar |
| `controls` | `boolean` | `true` | Decorative chrome on/off |
| `minimisable` | `boolean` | `false` | Turns minimise into a real button |

`tone` is gone: it tinted the bar `accent-sunk` for `Window.astro`, and the bar
now carries a gradient that is not a per-instance choice.

Position and size are **not** props. On a static component they would be
inline styles that break the responsive model. They arrive with the React
version, when windows can actually be moved.

### Why this is `.astro`, not React

The blueprint's decision 1 says "built as one React component". It is currently
a `.astro` component instead, and the reason is that the thing React would buy
— `client:media` hydration for interactive chrome — has nothing to hydrate.
Draggable windows are out of scope, so the chrome is decorative, so the
component is pure markup.

Adding `@astrojs/react` now would add a renderer, a dependency and a build step
to ship zero behaviour. The props surface above is deliberately the one a React
version would take, so the swap is mechanical when window management lands.

**Note for that day:** `client:*` directives only work on framework components
imported directly into a `.astro` file. A `.astro` component cannot take
`client:media`. Converting is the step that unlocks per-breakpoint hydration.

---

## 5. The desktop and the taskbar

### The wallpaper

`oklch(80% 0.034 80)` (`#c9bca6`) in light — pale straw, the colour of a fallen
leaf — and `oklch(16% 0.014 60)` (`#120c07`) in dark, carrying a grain overlay.

**Muted per decision 15.** The chroma was halved from 0.06; lightness did not
move. That distinction matters: the wallpaper has only five points of downward
lightness headroom before `window-edge` falls under 3:1, but **chroma is nearly
free** — dropping it from 0.060 to 0.014 moves `window-edge` by 0.01 and
`desktop-ink` by 0.03, both upward. Muting a surface is therefore a safe
operation in a way that darkening it is not.

#### The grain

Arc's technique, not a Windows one: an achromatic SVG noise tile blended with
`overlay` rather than composited straight over the fill.

- **`overlay`, because it scales against the base** instead of pulling toward
  absolute black or white, so it spends less contrast. At equal strength a plain
  composite drops `window-edge` to 3.28; overlay holds 3.52.
- **`saturate 0`, because raw `feTurbulence` varies all four channels** and
  tints the wallpaper with coloured speckle. Grain should vary lightness only.
- **`stitchTiles='stitch'`**, or the 140px tile shows a seam where it repeats.
- **Different strength per theme — 0.07 light, 0.10 dark.** Overlay is not
  symmetric: its multiply branch compresses hard on a near-black base, so the
  same value that reads as grain on pale straw is nearly invisible at 16%.

**Both strengths hold their floors even if the blend mode is dropped.** A body
background propagates to the canvas and whether `background-blend-mode` survives
that could not be verified here, so the contrast floor does not rest on it.
Dark at 0.22 looks better and breaks `window-edge` to 2.07 unblended; 0.10 holds
3.15 either way.

Cost: **794 B raw, 241 B gzipped**, on every page. Its real cost is CPU — the
filter rasterises once per tile size.

**The wallpaper carries no body text**, which is why it can sit at a lightness
no text surface could. Shortcut labels are the only thing on it.

**It is the surface with the widest theme swing in the system**, 80% to 16%.
Two consequences follow, and both were different under the previous dark-in-
both-themes wallpaper:

- **`desktop-ink` flips.** Pale straw cannot carry light text: white on this
  wallpaper is 1.82, dark text is 8.80. This is a pair to keep in sync.
- **Selection still inverts to wallpaper-on-label** — `desktop-ink` fill,
  `desktop` text. It needs no token of its own and cannot drift out of contrast
  with the ground, because it *is* the ground. Win98 marked selection the same
  way, so the constraint and the period behaviour agree.

`accent` is now usable on the wallpaper at 3.69, where earlier schemes could
not manage it — see §1.3. Selection does not use it, because inverting the
label is both more period and more robust to a wallpaper change.

| Pair | Light | Dark | Min | |
|---|---|---|---|---|
Measured at the grain's **extremes**, not its mean — a label or an edge falling
on the darkest speck is the one that has to stay legible.

| Pair | Light | Dark | Min | |
|---|---|---|---|---|
| `desktop-ink` on `desktop` (label) | 8.38 | 17.64 | 4.5 | ✅ |
| `desktop` on `desktop-ink` (selected) | 8.38 | 17.64 | 4.5 | ✅ |
| `accent` on `desktop` (marks) | 3.51 | 10.41 | 3.0 | ✅ |
| window edge, carrying side | 5.09 (dark) | 4.14 (light) | 3.0 | ✅ |
| `window-edge` on `desktop` | 3.47 | 3.97 | 3.0 | ✅ |

### Why the window's outer edge is a bevel

Above the breakpoint the window frame switches from a 1px `border` to a 2px
raised bevel. This is not period decoration — it is load-bearing.

`border` is tuned to sit on near-white panels and reaches only 1.87 against the
pale wallpaper. A bevel does reach it, because it has two edges and only needs
one of them to clear.

**Which edge carries flips with the theme, because this wallpaper does:**

| Edge | Light theme (80% wallpaper) | Dark theme (16% wallpaper) |
|---|---|---|
| `bevel-light` on `desktop` | 1.88 | **4.18** |
| `bevel-dark` on `desktop` | **5.34** | 1.07 |

> The rule is **at least one edge clears 3:1**, never *the lighter edge clears
> 3:1*. Both bevel tokens must stay real colours; neither is ever decorative.

This has now flipped twice across three wallpapers, so treat it as a property to
re-derive on every palette change rather than a fact to remember. It is the
single most likely thing to regress silently, because a bevel with no contrast
still *looks* like a border in a screenshot.

The same rule governs controls and grooves, where the surround is a light panel
rather than the wallpaper — there `bevel-dark` carries in light mode at 8.79 and
`bevel-light` in dark at 4.28.

### The `soft` and `flat` variants need `window-edge`

Only `period` draws a bevel. `soft` and `flat` mark the window with a single
flat border, and `border` at 1.87 cannot do it on the pale wallpaper.

`window-edge` exists for exactly that: **47% in light, 55% in dark, clearing 3.64
and 4.01.** A panel boundary on near-white and a window boundary on the wallpaper
are different jobs against different grounds, so they get different tokens —
the same reasoning that keeps `desktop` separate from `ground`.

Below the `lg` breakpoint the window fills the viewport, no wallpaper is visible,
and plain `border` is sufficient.

### Taskbar

Screen chrome, not window chrome. It sits outside the window in the DOM,
because it belongs to the desktop and outlives whatever page is open.

| Region | Contents | Rationale |
|---|---|---|
| Start | The Start button and its menu | Carries the entire site navigation — see section 9 |
| Task area | Empty | On a real taskbar this holds task buttons. With one window whose title bar is directly above, a task button would be a second label for the same thing |
| Tray | Theme toggle, `©` year | A theme toggle *is* a system setting, which is what a tray holds |

The pinned strip is gone. CV, GitHub and Terminal were there; all navigation now
sits in the Start menu, and Terminal moved to `/work` as a project entry
(blueprint decision 9).

**Position.** Fixed above 64rem, static below it. On a desktop the bar is
screen furniture and must be pinned; on a phone there is no visible desktop to
pin it to, and a fixed bottom bar there fights browser chrome, the home
indicator and `100vh`. Below the breakpoint the body is a flex column and the
window takes the remaining height, so the bar still lands at the bottom of the
first screen without being fixed.

`padding-bottom: env(safe-area-inset-bottom)` covers the one case where it *is*
fixed on a device with a home indicator — a landscape tablet at exactly 1024px.

**Clearance.** The desktop wrapper carries `lg:pb-24` so a full-height window's
lower edge stays clear of the fixed bar rather than sliding under it.

### Rejected, and why

- **A clock.** Rendered at build time it would be a wrong time, permanently. Making it real costs an island and the zero-JS guarantee on every page, to display something the operating system already shows two inches away.
- **Task buttons.** There is one window and its title bar is directly above. A task button would be a second label for the same thing — pastiche with no function.
- **A start *menu*.** ~~Needs JavaScript~~ — superseded. `<details>`/`<summary>` is a native disclosure, so the menu ships with zero JavaScript. It is now the site's entire navigation; see section 9.

---

## 6. Links and interactive states

### Coloured underlines

From Cassidy Williams' site: navigable text carries varied underline colour.
Adapted rather than copied.

**The rule: colour varies, the underline does not.** The underline is always
present, so colour is never the only signal — which satisfies the "colour is
never the only cue" requirement. Link *text* stays `ink` or `accent-ink`; only
`text-decoration-color` varies.

Five autumnal hues, all verified ≥3:1 against `ground` in both themes:

| Slot | Hue | Light | Dark | Light ratio | Dark ratio |
|---|---|---|---|---|---|
| 1 | 25 — brick | `oklch(55% 0.13 25)` | `oklch(76% 0.11 25)` | 4.95 | 8.52 |
| 2 | 45 — rust | `oklch(55% 0.13 45)` | `oklch(76% 0.11 45)` | 4.90 | 8.60 |
| 3 | 70 — amber | `oklch(55% 0.13 70)` | `oklch(76% 0.11 70)` | 4.77 | 8.75 |
| 4 | 95 — ochre | `oklch(55% 0.13 95)` | `oklch(76% 0.11 95)` | 4.62 | 8.94 |
| 5 | 125 — olive | `oklch(55% 0.13 125)` | `oklch(76% 0.11 125)` | 4.48 | 9.17 |

Green beyond hue ~140 is excluded: it drifts out of the autumnal range and
starts competing with the CRT green of `terminal.techytimms.com`.

**Assignment is deterministic, from the href.** A hash of the destination
selects the slot, so a given link is the same colour everywhere on the site and
across builds. Random assignment would flicker between rebuilds; positional
assignment would change when content is reordered. The function lives in
`src/lib/link-accent.ts` with a test, because it is logic, not markup.

### States

- **Rest:** underline in the assigned hue, `underline-offset: 0.2em`, 2px thickness.
- **Hover:** text shifts to `accent-ink`, underline thickens to 3px. No colour change — the hue is the link's identity.
- **Focus:** 2px `accent` outline, 2px offset. Never removed, never replaced by the hover treatment.
- **Current page:** `aria-current="page"` plus `accent-ink` text. The attribute is the signal; colour reinforces it.

---

## 7. Responsive model

PostHog's approach, as adopted in blueprint decision 2.

**Breakpoint: `lg`, 64rem / 1024px.** Below it, one window fills the viewport.
Above it, windows float on the desktop ground.

| | Below 64rem | 64rem and up |
|---|---|---|
| Wallpaper | Not visible — the window covers it | Visible: one flat fill |
| Window | Single, full-bleed, fills height above the taskbar | Inset, `max-w-4xl`, sized to content |
| Window edge | 1px `border`, top and bottom only | 2px raised bevel, all four sides |
| Taskbar | Static, after the window in flow | Fixed to the bottom of the viewport |
| Layout | One column | One column, centred, wallpaper either side |

**Wallpaper margin is guaranteed**, not incidental: the outer wrapper carries
`lg:px-10` and the window is capped at `max-w-4xl`, so the wallpaper is visible
at every width above the breakpoint rather than only on wide screens.

**Identical markup at both sizes.** The window renders the same HTML either
way; only CSS differs. This matters now for layout stability and matters more
later: a component hydrated only above a breakpoint must produce identical
markup in both states, or the layout shifts when hydration fires.

---

## 8. Not in this system

Deliberately absent, so their absence is a decision:

- **Shadows.** None, anywhere. Depth comes from borders and bevels.
- **Rounded corners** beyond 2px on controls.
- **Traffic-light callout semantics.**
- **A second accent hue.** The five underline hues are one family at one lightness, not competing accents.
- **Animation**, beyond state transitions under 150ms. All of it sits behind `prefers-reduced-motion`.
- **Draggable windows**, deferred in plan §9.
- **A taskbar clock or task buttons** — see section 5.
- **Escape-to-close and click-outside-to-close** on the Start menu — both need JavaScript; see section 9.
- **Icons outside the curated set.** The source library is 2393 files; only what is used is committed.

---

## 9. The Start menu

All site navigation, behind one button. Blueprint decision 8, and per the
blueprint's *"Navigation behind Start is the intent, not a compromise"* this is
the design working rather than a trade-off being absorbed.

### Zero JavaScript, by using the platform

`<details>`/`<summary>`. A native disclosure widget: it opens, closes, takes
focus, and announces its expanded state to a screen reader without a line of
script. `list-style: none` plus `::-webkit-details-marker { display: none }`
removes the default triangle — both are needed, because WebKit still ships the
shadow-DOM marker.

**What it does not give:** Escape to dismiss, and click-outside to dismiss.
Both need JavaScript. The menu ships without them.

### Anatomy

```
┌──┬────────────────────────┐
│  │  🖥  Home              │
│ J│  👤  About             │
│ A│  💼  Work              │
│ M│  📝  Blog              │
│ E│  📜  CV                │
│ S│ ───────────────────    │  ← separator
│  │  🌐  GitHub            │
└──┴────────────────────────┘
   ▲ branding gutter, reading bottom-to-top
┌────────┐
│ ▣ Start│  ← summary, raised bevel; pressed while open
└────────┘
```

- **Gutter.** `accent-sunk` fill, `accent-ink` text, `writing-mode: vertical-rl` plus a 180° rotation so it reads bottom-to-top as Win9x did. `aria-hidden` — it is the site name repeated, not information.
- **Items.** 32px pixel icon, label, `accent-sunk` fill on hover and focus.
- **Separator.** Groups places within this site from somewhere else entirely.
- **Position.** `bottom: calc(100% + 0.375rem)` on the button, so it opens upward from the taskbar.

### Prominence, and why

The Start button is the largest, heaviest control on screen. Not to rescue a
recruiter's fifteen-second skim — the blueprint retired that framing — but
because navigation nobody can find is bad design for every reader.

### Skip link

"Skip to **navigation**", targeting the summary, not "skip to content". With
nav in the taskbar, content already comes first in the DOM; the navigation is
what is far away.

### CV placement

`/cv` sits **below the separator, beside GitHub**, in the group Win98 reserves
for entries that are not places on this machine in the same sense as the pages
above. It appears there and nowhere else: no taskbar shortcut, no desktop
shortcut, no home-page call to action. Reachable, not foregrounded — build
plan §1.

That the desktop shortcuts duplicate About, Work and Blog but *not* CV is the
reader order made visible: the things James wants seen are on the desk, and the
thing a recruiter wants is one click away in a menu.

---

## 10. Icons

Windows 98 icons from **[win98icons.alexmeub.com](https://win98icons.alexmeub.com/)**.

> The credit currently lives only here. A `/colophon` page is where it belongs
> and does not exist yet — see the build plan's todo.

### Curated, not vendored

The source set is 2393 files and 11MB, in gitignored `assets/`. Only icons
actually referenced are committed: **8 files, 40KB**, in `src/assets/icons/win98/`.

Filenames on disk keep their source names so each icon stays traceable to the
set; `src/lib/icons.ts` maps semantic names onto them, which is what makes this
a library rather than scattered `<img>` tags.

| Name | Source file | Size | Used for |
|---|---|---|---|
| `home` | `computer_explorer_2k-0.png` | 32 | Start menu |
| `about` | `address_book_user.png` | 32 | Start menu |
| `work` | `briefcase-0.png` | 32 | Start menu |
| `blog` | `notepad_file-0.png` | 32 | Start menu |
| `cv` | `certificate_2-0.png` | 32 | Start menu |
| `start` | `computer_explorer_2k-1.png` | 16 | Start button |
| `external` | `globe_map-1.png` | 16 | Off-site links |
| `document` | `file_lines-1.png` | 16 | Window title bar |

### Native size only

`Icon.astro` takes `width` and `height` from the imported image's own metadata,
so an icon can only ever render at its intrinsic 16, 32 or 48px. A fractional
size is not expressible through the component rather than merely discouraged —
pixel art resampled off-grid is the fastest way to make period chrome look cheap.

`image-rendering: pixelated` on every icon, so any browser-side scaling keeps
hard edges.

### Why `src/assets/`, and a plain `<img>`

**`src/assets/` over `public/`:** imports are checked at build time, so a typo
fails `pnpm build` instead of 404ing silently, and each import carries its own
intrinsic dimensions — which is what makes the native-size guarantee possible.
Emitted files are content-hashed.

**A plain `<img>` over `<Image>`:** `astro:assets` would re-encode to WebP and
resample, destroying both the palette and the hard pixel edges. Verified: the
emitted files are byte-identical to the sources.

### Size suffixes are not consistent

The set's `-0`…`-5` suffixes do **not** map to fixed sizes. `briefcase-0` is
32px; `globe_map-0` is 48px; `joystick-0` is 16px. Read the actual dimensions
before adding an icon — do not infer from the suffix.

---

## 11. The desktop

### Files

| File | Holds | Why there |
|---|---|---|
| `Desktop.tsx` | `DesktopShortcut`, `DesktopSection`, and `DesktopGroup` (default) | The React parts — the only React in the codebase |
| `Desktop.astro` | `Desktop`: the skip link and both persisted groups | `transition:persist` is a template directive with no JSX equivalent |

`BaseLayout` renders the whole desktop as `<Desktop currentPath={currentPath} />`.

`DesktopGroup` pairs a section with its items so the caller passes navigation
data rather than repeating the same `map` for each group.

### Shortcuts

React, and the only React in the codebase.

**They render without a `client:*` directive**, so React is an authoring API
here and nothing hydrates. No `astro-island` elements are emitted and no page
loads a script. The props-driven surface is the point; the runtime cost is zero.

One caveat worth knowing: adding `@astrojs/react` makes the build emit
`dist/_astro/client.*.js` (~220KB), React's client entrypoint. **No HTML
references it**, so no visitor downloads it — but it is now in the deploy
artifact, and `find dist -name '*.js' | wc -l` returns 1 rather than 0. The
honest metric is "no page loads JavaScript", not "no .js exists".

| Prop | Default | |
|---|---|---|
| `icon` | — | `IconName` from the icon library |
| `label` | — | Visible text |
| `href` | — | Destination |
| `external` | `false` | Adds `rel`, and an off-screen note for assistive tech |
| `labelOverflow` | `'wrap'` | `'wrap'` breaks onto two lines like Win98; `'truncate'` keeps one line |
| `selected` | `false` | The selection highlight |
| `className` / `style` | — | Passthrough, and how drag would pass coordinates later |

**Placement is deliberately not a prop.** The layout owns it, so shortcuts stay
flow-positioned. If drag arrives, the layout switches to absolute positioning
and passes coordinates through `style` — the shortcut does not change.

### Layout

`Desktop.tsx` owns placement. Win98 fills the first column top to bottom before
starting a second, which is `grid-auto-flow: column` with a fixed row count —
native CSS, nothing measured at runtime, nothing hand-positioned.

| Prop | Default | |
|---|---|---|
| `align` | `"left"` | Which edge the columns grow from |
| `anchor` | `"top"` | Edge the group is pinned to; `"bottom"` clears the taskbar and fills upwards |
| `rows` | — | Items per column before wrapping; pass `desktopRows(items)` |
| `gap` | `0.75` | Gap between shortcuts, rem |
| `inset` | `1` | Distance from the viewport edges, rem |
| `label` | `"Desktop shortcuts"` | The `nav` accessible name |

### Why they start at `xl`, not `lg`

The window is `max-w-4xl` (896px) inside 40px of padding. At `lg` (1024px) that
leaves about 24px of wallpaper either side — not enough for a 32px icon and a
label, so shortcuts would overlap the window or clip. From `xl` (1280px) there
is roughly 150px a side, which is comfortable.

Below `xl` they are not rendered at all. That is safe because **the shortcuts
are additive**: every destination on the desk is also in the Start menu, so
nothing becomes unreachable.

### Two sets of the same links

About, Work and Blog appear on the desktop *and* in the Start menu. For a screen
reader that is the same destination announced twice, so the two are distinct
landmarks with distinct names — `nav[aria-label="Desktop shortcuts"]` and
`nav[aria-label="Site"]` — and a user can tell which list they are in from the
landmark, not from the link text.

`src/lib/navigation.ts` is the single source for both. Shortcuts are marked
per-item with `onDesktop` rather than sliced by index, so reordering the menu
cannot silently change what appears on the desk.

### Selection, not a focus ring

Hover, focus and selection all invert the label — `ink` fill, `surface` text —
rather than drawing an accent ring. It is what Win98 does, and it is robust to a
palette change: an inverted label cannot fall out of contrast with the wallpaper
because it *is* the wallpaper. `accent` does now clear 3:1 on the wallpaper
(3.68), so a ring would be legible — but it would have to be re-verified on
every scheme, and inversion never does.

---

## 12. Routing and window state

Blueprint decision 14. Navigation is client-side; minimise is DOM hiding rather
than a window manager.

### `<ClientRouter />`

In `BaseLayout.astro`'s `<head>`. Every route remains a real URL serving a
complete document — the router intercepts navigation, it does not replace the
pages. Verified: each route still carries its own `<title>` and full `<main>`
content in the built output, so crawlers and a no-JavaScript visitor are
unaffected.

**Never render more than one route's content into a single document.** That
would publish the same content at several URLs. The window shows exactly one
route, which is why minimise hides it rather than swapping it.

### What is persisted, and the cost of persisting it

| Element | Treatment | Why |
|---|---|---|
| Taskbar | `transition:persist="taskbar"` | Screen chrome. It outlives the document, and its listeners come with it. |
| Desktop shortcuts | `transition:persist="persist-desktop-top"` / `"persist-desktop-bottom"` | Same, and the press handlers are bound to these exact elements. |
| Window frame | `transition:name="window"` | Morphs rather than cross-fades, so it reads as one window showing new content. Deliberately **not** persisted — it must arrive un-minimised. |
| `<main>` | `transition:animate="fade"` | The content is what changed; it should be what visibly changes. |

**Transition directives apply to elements, not component tags.** Putting
`transition:persist` on `<Taskbar />` or `<Desktop />` silently does nothing —
it must sit on the rendered element. The taskbar carries it on its own root;
the two desktop groups are wrapped in a bare `<div>` inside `Desktop.astro`,
which is layout-neutral because `.desktop-shortcuts` is `display: none` below
`xl` and `position: fixed` above it.

**This is why the desktop has an `.astro` file at all.** A React component
cannot use the directive. It *could* emit `data-astro-transition-persist`
directly — the router matches persisted elements with a plain
`querySelectorAll('[data-astro-transition-persist]')`, so it never sees the
directive and cannot tell who wrote the attribute. That was rejected: the
attribute name is an internal constant, and if a future Astro renamed it the
markup would still look correct while persistence silently stopped. This project
has already lost persistence silently once, from the component-tag trap above.
Using the directive keeps the compiler and the router on the same version by
construction.

**Persistence makes server-rendered state stale.** The chrome kept after a
navigation is the *previous* page's markup, so `aria-current="page"` would keep
pointing at the page just left — a statement of fact to a screen reader, and a
false one. `syncCurrentPage()` reconciles it on every `astro:page-load`.

This is the real cost of persisting chrome: current-page marking now has two
sources, the server render and the client fixup, and they have to agree. The
alternative was to let the chrome rebuild, which is correct by construction but
gives up the continuity the metaphor depends on — the desktop should not redraw
when you open a document.

The Start menu is closed on navigation for the same reason: Windows closes it
when you pick an item, and persistence would otherwise leave it hanging open
over the page it just opened.

### Scripts under the router

Bundled module scripts run **once** for the life of the session. Anything that
must run per navigation registers an `astro:page-load` listener, which fires on
the initial load as well as every subsequent navigation — so it is the only
hook needed.

| Script | Form | Handling |
|---|---|---|
| Theme | `is:inline` in `<head>` | Must stay blocking and inline, or the theme flashes before first paint. The router swaps the root element's attributes, dropping the `dark` class, so it re-applies on `astro:after-swap` — the last moment before the new page paints. |
| Desktop chrome | bundled module | Registers one `astro:page-load` listener. |
| Theme toggle click | delegated | Bound once on `document`, not per instance: the button sits in persisted chrome, and binding per render would stack handlers on the same element. |

Anything bound to a persisted element needs an idempotency guard, since the
element survives while the binding code may run again. `desktop-shortcuts.ts`
marks each shortcut `data-press-wired`; without it, one press would open two
tabs.

### Minimise

The window's minimise control is a real `<button>`; maximise and close remain
decorative `aria-hidden` spans, because there is nothing to maximise to and
nowhere to close to. The container must not be `aria-hidden` — that would hide
the real button while leaving it focusable, which is worse than either.

- **`hidden`, not offscreen.** A minimised window must leave the accessibility
  tree, or a screen reader still reads a window the user has put away.
- **Focus follows the window.** Hiding the focused element drops focus to
  `<body>` and loses a keyboard user's place, so minimising moves focus to the
  task button and restoring moves it back.
- **The task button appears only while minimised.** Alongside a visible window
  it would be a second label for the thing whose title bar is directly above.
  Its accessible name is "Restore" plus the window title; the title alone reads
  as a bare label rather than a control.
- **Navigation restores the window.** Following a link is a request to read
  something, so arriving minimised would hide the very thing that was asked
  for. The frame is rebuilt each navigation and returns open by construction;
  the persisted task button is reset explicitly.
- **Without JavaScript the window never minimises**, so the task button never
  shows. Nothing is lost.

### Secondary windows are not built

Windows that are *not* routes — an About box, a colophon, a properties dialog —
are the natural extension, and there is no content for them yet. `WindowFrame.astro` is currently
specific to the page window; a second window would generalise it, and `TitleBar`
already gates the working control behind `minimisable`, so a secondary window
keeps decorative chrome until it has behaviour.

Adding one would need: a stable id per window so the tray can address more than
one, `setMinimised` generalised from "the window" to "a window", and the tray
rendering a button per open window instead of the single one. The z-order
question only arrives if two can overlap.

### Cost

| | Raw | Gzipped |
|---|---|---|
| `ClientRouter` | 16.4 KB | 5.7 KB |
| Desktop chrome (inlined) | 2.6 KB | — |
| Theme (inlined, blocking) | 0.7 KB | — |

The React renderer (`client.*.js`, 216 KB) is still emitted and still
referenced by nothing, because no component is hydrated.

**The honest claim is now "every page loads about 6 KB of JavaScript", not
"zero JavaScript".** The zero-JS default was traded deliberately, per blueprint
decision 14 and the standing "minimal, not forbidden" stance.

---

## 13. The group box

How a page separates its sections, and the replacement for the inner
`Window.astro`.

**A window inside a window undermines the metaphor.** If a window means a page,
it cannot also mean "a list of skills". Win9x had a device for exactly this job
and it is not a window: the group box, an inset groove with its label breaking
the top edge.

### `<section>` and a heading, not `<fieldset>` and `<legend>`

A group box is literally what a `<fieldset>` renders, and the HTML spec does
permit fieldset for "other content". It is still the wrong element here:

- Assistive technology announces a fieldset as a form **group**. Wrapped around
  prose, achievements and a definition list, that is misleading.
- `<fieldset>` carries a `min-width: min-content` default that breaks flex and
  grid children — a well-known layout trap.
- None of this content is form controls.

So the groove is a **visual** treatment and a real heading carries the
structure.

### It fixes the heading outline

This is not a like-for-like swap. The window titles it replaces were `<span>`s,
so page sections were absent from the document outline entirely — `/cv` went
from `<h1>CV` straight to `<h2>` on each role, with "skills", "experience",
"education" and "certifications" represented nowhere.

The group label is now an `h2`, and the roles inside `experience` moved to `h3`.
Every page reads `h1 → h2 → h3` with no skipped levels.

`level` is a prop (`2 | 3`) for sections whose own content already starts at h2.

### Where it is not used

- **`ProseLayout`.** Its label would have repeated the `<h1>` directly above it, and an article inside the page window does not need a second container. The prose renders bare.
- **`work/index` and `blog/index`** kept a group box but relabelled off their `<h1>`: "projects" and "posts", not "work" and "blog".

### Construction

Two 1px rings, the inner offset by one pixel, in opposite bevel order — a
carved channel rather than a doubled border. The label is absolutely positioned
over the top edge with a `surface` background punching a gap in it.

| Feature | Light | Dark | |
|---|---|---|---|
| Groove on `surface`, via dark edge | 10.04 | 1.17 | ✅ light |
| Groove on `surface`, via light edge | 1.00 | 3.49 | ✅ dark |
| `ink-muted` label on `surface` | 6.85 | 7.67 | ✅ both |

The groove follows the same **one edge must clear 3:1** rule as every other
bevelled feature, and like the controls it is the opposite edge in each theme.


---

## 14. Chrome variants

James is undecided about how period the chrome should be, so it is a prop
rather than a fixed decision. `src/lib/window-variants.ts` defines the axis with
CVA; `WindowFrame` and `TitleBar` both take `chrome`.

| Variant | Frame | Title bar | Controls |
|---|---|---|---|
| `period` *(default)* | Raised double-edged bevel above `lg` | Gradient, `titlebar-ink` | Bevelled, minimise bar bottom-aligned |
| `soft` | Flat border, 2px radius | Solid `titlebar-from` | Flat border, controls centred |
| `flat` | Flat border, 2px radius | Neutral `sunk` bar with `ink` text | Hairline `rule` border, centred |

**One axis, not several.** Title-bar treatment, bevel depth and control style
co-vary: a period bevel with a flat title bar is not a look anyone wants.
Exposing them independently would offer nine combinations where three are
coherent.

`period` reproduces the previous chrome exactly, so switching is opt-in.

### Every variant keeps a border

On a dark wallpaper the window's `surface` measures close to 1:1 against
`desktop` — the fill cannot mark the window's edge. Only `border` and the raised
bevel can. `flat` therefore drops the bevel, never the border. Any future
variant must keep one of the two.

### The Tailwind / CSS boundary

Utilities cover the frame borders and fills, the title-bar gradient, the control
geometry and its bevel colours, the active state, and the minimise and restore
glyph boxes.

**One rule stays CSS:** `.title-glyph-close`. It is two bars rotated in opposite
directions, needing `::before` and `::after` with different transforms.
Expressible as utilities, but the class string runs longer than the rule and
reads far worse.

`cn()` (`src/lib/cn.ts`) combines `clsx` and `tailwind-merge` so a caller's
`class` can override a variant class by intent rather than by source order.

**None of this ships.** `cva`, `clsx` and `tailwind-merge` run at build time
only — the components are `.astro` and render server-side, so the per-page
payload is unchanged.

### Comparing them

`/styleguide` renders all three against real content, plus the palette
candidates as swatches. It carries `noindex` and is filtered out of the sitemap
in `astro.config.mjs`. It deliberately does not use `WindowFrame`, which owns
`data-window-frame`, `id="main"` and `transition:name="window"` — all
document-unique — and composes the variant classes onto plain markup instead.
