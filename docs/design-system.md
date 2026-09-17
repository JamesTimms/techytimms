# Design System

The implementable specification. `design-blueprint.md` holds the ideas and the
decisions; this file holds the values, primitives and rules that the code
implements. If the two disagree, the blueprint's section 6 wins and this file
is wrong.

Every contrast ratio below was computed, not estimated — OKLCH converted to
sRGB and run through the WCAG relative-luminance formula. All 34 checked pairs
pass.

---

## 1. Palette

Warm neutrals at **hue 70**, amber accent at **hue 70**. One hue for the whole
system: the neutrals are the accent hue at very low chroma, which is why the
greys read as warm paper rather than as dirty grey.

### Tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `ground` | `oklch(98.5% 0.006 70)` | `oklch(17% 0.012 70)` | Page background — the desktop |
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

`ink-faint` on `ground` at 4.56 (light) is the tightest pair in the system. If
you darken `ground` or lighten `ink-faint`, recheck it.

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

- **Title bar.** `sunk` fill, `border` bottom edge, title in `ink` at small size, uppercase, letter-spaced, monospace. Active windows may tint the bar `accent-sunk`.
- **Controls.** `–`, `□`, `×` at the right, in bevel panels.
- **Body.** `surface` fill, padding on Tailwind's scale.

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

## 5. Links and interactive states

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

## 6. Responsive model

PostHog's approach, as adopted in blueprint decision 2.

**Breakpoint: `lg`, 64rem / 1024px.** Below it, one window fills the viewport.
Above it, windows float on the desktop ground.

| | Below 64rem | 64rem and up |
|---|---|---|
| Ground | Not visible — the window covers it | Visible, textured |
| Window | Single, full-bleed, no outer margin | Inset, bordered, floating |
| Border | Top and bottom only | All four sides |
| Layout | One column | One column, centred, with ground showing |

**The ground texture** is a CSS gradient, not an image — a faint diagonal weave
that reads as wallpaper without a network request. It sits behind everything
and is invisible below the breakpoint.

**Identical markup at both sizes.** The window renders the same HTML either
way; only CSS differs. This matters now for layout stability and matters more
later: a component hydrated only above a breakpoint must produce identical
markup in both states, or the layout shifts when hydration fires.

---

## 7. Not in this system

Deliberately absent, so their absence is a decision:

- **Shadows.** None, anywhere. Depth comes from borders and bevels.
- **Rounded corners** beyond 2px on controls.
- **Traffic-light callout semantics.**
- **A second accent hue.** The five underline hues are one family at one lightness, not competing accents.
- **Animation**, beyond state transitions under 150ms. All of it sits behind `prefers-reduced-motion`.
- **Pixel icons**, deferred in blueprint decision 6.
- **Draggable windows**, deferred in plan §9.
