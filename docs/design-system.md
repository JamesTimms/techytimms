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

Warm neutrals at **hue 70**, amber accent at **hue 70**. One hue for the whole
system: the neutrals are the accent hue at very low chroma, which is why the
greys read as warm paper rather than as dirty grey.

### Tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `ground` | `oklch(98.5% 0.006 70)` | `oklch(17% 0.012 70)` | Contrast baseline; no current markup use |
| `surface` | `oklch(100% 0 70)` | `oklch(21% 0.014 70)` | Panel and window fill |
| `sunk` | `oklch(96% 0.010 70)` | `oklch(14% 0.010 70)` | Inset areas, code blocks, title bars |
| `rule` | `oklch(88.5% 0.014 70)` | `oklch(32% 0.018 70)` | Decorative dividers only |
| `border` | `oklch(63% 0.016 70)` | `oklch(52% 0.018 70)` | Structural borders — the signature |
| `ink-faint` | `oklch(55.5% 0.022 70)` | `oklch(62% 0.020 70)` | Tertiary text: dates, metadata |
| `ink-muted` | `oklch(47% 0.026 70)` | `oklch(74% 0.020 70)` | Secondary body text |
| `ink` | `oklch(24% 0.028 70)` | `oklch(93% 0.014 70)` | Primary text |
| `accent` | `oklch(58% 0.130 70)` | `oklch(78% 0.110 70)` | Marks, rings, borders — **never text** |
| `accent-ink` | `oklch(45% 0.110 70)` | `oklch(80% 0.105 70)` | Accent **text** |
| `accent-sunk` | `oklch(95% 0.030 70)` | `oklch(24% 0.035 70)` | Tinted panel fill |
| `desktop` | `oklch(72% 0.055 70)` | `oklch(13.5% 0.018 70)` | The wallpaper — now carries shortcut labels |
| `bevel-light` | `oklch(100% 0 70)` | `oklch(54% 0.020 70)` | Raised top/left edge |
| `bevel-dark` | `oklch(38% 0.020 70)` | `oklch(8% 0.010 70)` | Raised bottom/right edge |

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

**`accent` is not usable on `desktop` in light mode** — it lands at 1.76. The
accent and the wallpaper are both hue 70, and at 58%/72% lightness they are
nearly the same colour. This is the cost of a one-hue system: any mid-light warm
surface collides with the accent. Desktop shortcut focus and selection therefore
use `ink`, not `accent`. Check this pair before putting an accent mark anywhere
on the wallpaper.

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

- **Title bar.** `sunk` fill, `border` bottom edge, a 16px pixel icon, then the title in `ink` at small size, uppercase, letter-spaced, monospace. Active windows may tint the bar `accent-sunk`.
- **Controls.** `–`, `□`, `×` at the right, in bevel panels.
- **Body.** `surface` fill, padding on Tailwind's scale.

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
| `tone` | `"default" \| "accent"` | `"default"` | Accent tints the title bar |
| `controls` | `boolean` | `true` | Decorative chrome on/off |
| `floating` | `boolean` | `false` | Opts into desktop offset positioning |
| `class` | `string` | — | Escape hatch for per-instance sizing |

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

`desktop` is a warm tan in light mode (`#bb9f7f`) and a warm near-black in dark.
A window reads as sitting *on* something only when that something is a different
material, and the original 1.5% lightness gap between `ground` and `surface` was
not one.

**The two themes lightened by very different amounts, and that is a constraint
rather than a preference.** Light went 50% → 72%. Dark went 11% → 13.5% only,
because the dark theme's raised edge is carried by `bevel-light` at 54%, and a
bevel near 50% clears 3:1 only while the wallpaper stays near-black. There is no
mid-lightness dark wallpaper that works with this bevel system: `bevel-dark` sits
at 8% and cannot carry the other side either. A genuinely light dark-mode
wallpaper would need a dedicated outline token for the window edge, which is a
larger change than retuning one value.

The dark wallpaper also stays *below* `sunk` (14%) deliberately. Between `sunk`
and `surface` (21%) it would sit at almost the same luminance as both fills it
has to be distinguished from.

Three layers, all CSS, no image request:

1. **Base fill** — `desktop`.
2. **Vignette** — a radial gradient lit from above, at 16% `bevel-light`. This is what stops a flat fill reading as "page background".
3. **Weave** — the original 45° hatch, at 14% `bevel-dark`.

`background-attachment: fixed` keeps the wallpaper still while the window
scrolls, which is how a desktop behaves and how a page does not.

### Why the window's outer edge is a bevel

Above the breakpoint the window frame switches from a 1px `border` to a 2px
raised bevel. This is not period decoration — it is load-bearing.

`border` cannot reach 3:1 against the wallpaper at any wallpaper value that still
reads as a wallpaper. A bevel can, because it has two edges and only needs one of
them to clear.

**Which edge does the work flips with the surround, and flipped when the
wallpaper lightened.** On the old mid-dark wallpaper the light edge carried.
On today's light wallpaper the *dark* edge carries and the light edge is
invisible:

| Edge | Light theme | Dark theme |
|---|---|---|
| `bevel-light` on `desktop` | 2.50 | **3.95** |
| `bevel-dark` on `desktop` | **4.02** | 1.04 |

The rule is *at least one edge clears 3:1*, never *the lighter edge clears 3:1*.
Assuming the latter is how the control bevels were wrong before, and it is how
they would go wrong again after any retune of `desktop`.

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
| Wallpaper | Not visible — the window covers it | Visible: fill, vignette and weave |
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

### Shortcuts

`DesktopShortcut.tsx` and `Desktop.tsx` — React, and the only React in the
codebase.

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
rather than drawing an accent ring. Two reasons, and they agree: it is what
Win98 does, and `accent` on the light wallpaper is 1.76:1, so an accent ring
would be invisible in light mode.
