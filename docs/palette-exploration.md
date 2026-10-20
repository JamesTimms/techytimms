# Palette exploration

Four complete schemes for the Windows 98/2000 desktop direction, plus the
structural analysis that makes any of them work. **Exploration only — nothing
here is implemented.** `docs/design-system.md` holds the palette actually in
the code.

Every value below was computed: OKLCH → sRGB → WCAG relative luminance. The
calculator was checked against five ratios already documented in
`design-system.md` and reproduced all five exactly before anything here was
designed. Every value is given as OKLCH and hex so you can paste it somewhere
visual.

---

## 1. What actually makes a palette read as Windows 98/2000

I sampled the reference screenshot
(`assets/references/what-was-your-go-to-internet-browser-in-the-2000s-v0-dk0e90rh8b2g1.webp`)
rather than working from memory. The pixels say the look is **structural, not
chromatic**:

| Element | Sampled | As OKLCH |
|---|---|---|
| Window chrome face | `#d4d0c8` | `oklch(85.9% 0.012 85)` |
| Active title bar, left | `#30498c` | `oklch(42.2% 0.115 266)` |
| Active title bar, right | `#9abce7` | `oklch(78.5% 0.072 255)` |
| Inactive title bar, left | `#7f7f7d` | `oklch(59.6% 0.003 106)` |
| Inactive title bar, right | `#b4b4b4` | `oklch(77.0% 0.000 90)` |
| Classic desktop teal | `#008080` | `oklch(54.3% 0.093 195)` |

Four findings, and each one is a rule you can keep while changing every hue:

**1. The chrome grey is already warm.** `#d4d0c8` is hue 85 at chroma 0.012 —
not neutral grey, a warm low-chroma grey. This is a gift: the period-correct
chrome colour is *already* where the autumnal brief wants it. The existing
system's warm neutrals at hue 70 are within 15° of what Windows 2000 actually
shipped.

**2. The title bar gradient lightens *and* desaturates.** Chroma falls from
0.115 to 0.072 across the sweep while lightness climbs 42% → 78%. It is not a
lightness ramp at constant chroma. Reproducing the sweep without the chroma
fall-off is the most common way a period title bar looks wrong.

**3. Strong colour appears in exactly three places** — the title bar, links,
and selection. Everything else is grey chrome and black text. The saturated
element is the *ground*, and the chrome sits on it desaturated.

**4. The inactive title bar keeps the gradient and drops the hue.** Same 18-point
lightness sweep, chroma at essentially zero. State is signalled by saturation,
not by shape.

The consequence: **hue is the free variable.** Windows 98's specific colours came
from a 16-colour VGA-derived palette — a hardware constraint, not a design
decision. Keep the structure (warm low-chroma chrome, saturated ground, gradient
title bar with falling chroma, sparse accent) and you can put any hue through it
and it will still read as the period.

## 2. What "modern rather than nostalgic" means in execution

- **Perceptually even steps.** OKLCH lightness is perceptual, so a ramp with even
  L spacing *looks* evenly spaced. The 16-colour palette could not do this.
- **Restrained chroma in neutrals.** 0.012–0.030, never more. Chroma in the
  neutrals is what separates "warm grey" from "beige".
- **Accents chosen for contrast behaviour, not vibrancy.** Pick the accent by
  what it measures against the surfaces it lands on, then take the most
  saturated version that still passes. Never the reverse.
- **No dithering, no hard 8-bit edges, no bevels on everything.** The period look
  comes from the *structure* above, not from emulating display limitations.

## 3. The one constraint that decides everything

`design-system.md` records that `accent` on `desktop` measures 1.76 and blames
it on a shared hue. **That is wrong, and I verified it is wrong.**

Holding lightness at 44% and sweeping the wallpaper hue across the entire wheel:

| Wallpaper hue | 70 | 130 | 200 | 260 | 320 |
|---|---|---|---|---|---|
| `accent` on `desktop` | 1.78 | 1.74 | 1.73 | 1.76 | 1.80 |

Holding hue at 200 and sweeping lightness:

| Wallpaper L | 20% | 30% | 44% | 58% | 72% | 85% |
|---|---|---|---|---|---|---|
| `accent` on `desktop` | 4.06 | 3.05 | 1.73 | 1.05 | 1.80 | 2.83 |

Hue moves the ratio by 0.07 across the whole wheel. Lightness moves it from 1.05
to 4.06. **It is entirely a lightness collision.** An accent at 58% lightness
needs roughly **28–30 points of lightness separation** from the wallpaper to
clear 3:1.

This has one concrete consequence, and it is the sharpest difference between the
four schemes below: **a mid-lightness wallpaper means no accent marks on the
desktop** — no accent selection ring, no accent hover on a shortcut, no accent
anywhere on the ground. A dark wallpaper buys that ability back.

Only one scheme below is dark enough to have it.

---

## Scheme — Bracken

**Rust wallpaper, warm grey chrome, teal accent.**

Woodland floor in late October. This is the Windows 98 teal **demoted from ground to accent** — the period reference stays legible, but inverted. The most recognisably "autumn" of the four, and the one where the palette is unmistakably the point.

### Tokens

| Token | Light | Dark |
|---|---|---|
| `desktop` | `oklch(40% 0.075 40)` #693827 | `oklch(17% 0.035 40)` #1c0904 |
| `desktop-ink` | `oklch(97% 0.01 40)` #fcf3f0 | `oklch(97% 0.01 40)` #fcf3f0 |
| `surface` | `oklch(100% 0 80)` #ffffff | `oklch(21% 0.014 80)` #1c1811 |
| `ground` | `oklch(98.5% 0.006 80)` #fcfaf6 | `oklch(17% 0.012 80)` #120f0a |
| `sunk` | `oklch(95.5% 0.012 80)` #f4efe7 | `oklch(14% 0.01 80)` #0b0905 |
| `rule` | `oklch(88.5% 0.016 80)` #dfd8ce | `oklch(32% 0.018 80)` #383229 |
| `border` | `oklch(63% 0.018 80)` #8f887d | `oklch(52% 0.018 80)` #6e685e |
| `ink-faint` | `oklch(55.5% 0.024 80)` #7b7263 | `oklch(62% 0.02 80)` #8d8579 |
| `ink-muted` | `oklch(47% 0.028 80)` #635949 | `oklch(74% 0.02 80)` #b2aa9d |
| `ink` | `oklch(24% 0.03 80)` #271e0e | `oklch(93% 0.014 80)` #ede7de |
| `accent` | `oklch(55% 0.093 205)` #05818b | `oklch(78% 0.09 205)` #6bc8d3 |
| `accent-ink` | `oklch(45% 0.077 205)` #00616a | `oklch(80% 0.085 205)` #77ced8 |
| `accent-sunk` | `oklch(95.5% 0.022 205)` #e0f5f7 | `oklch(24% 0.03 205)` #0b2326 |
| `titlebar-from` | `oklch(36% 0.085 40)` #612b17 | `oklch(34% 0.08 40)` #592715 |
| `titlebar-to` | `oklch(56% 0.055 45)` #906b5a | `oklch(54% 0.055 45)` #8a6554 |
| `titlebar-ink` | `oklch(99% 0 40)` #fcfcfc | `oklch(99% 0 40)` #fcfcfc |
| `bevel-light` | `oklch(100% 0 80)` #ffffff | `oklch(56% 0.02 80)` #7b7368 |
| `bevel-dark` | `oklch(38% 0.02 80)` #484137 | `oklch(8% 0.01 80)` #020201 |

### Contrast

| Pair | Light | Dark | Min |
|---|---|---|---|
| `ink` on `ground` | 15.78 | 15.56 | 4.5 |
| `ink` on `surface` | 16.48 | 14.42 | 4.5 |
| `ink-muted` on `surface` | 6.84 | 7.68 | 4.5 |
| `ink-faint` on `ground` | 4.56 | 5.25 | 4.5 |
| `accent-ink` on `ground` | 6.88 | 10.56 | 4.5 |
| `accent-ink` on `surface` | 7.19 | 9.79 | 4.5 |
| `border` on `surface` | 3.50 | 3.21 | 3.0 |
| `border` on `sunk` | 3.07 | 3.61 | 3.0 |
| `desktop-ink` on `desktop` | 8.69 | 17.58 | 4.5 |
| `titlebar-ink` on `titlebar-from` | 10.93 | 11.79 | 4.5 |
| `titlebar-ink` on `titlebar-to` | 4.61 | 5.02 | 4.5 |
| `bevel-light` on `desktop` | 9.50 | 4.13 | 3.0 |
| `accent` on `desktop` | 2.04 | 9.93 | 3.0 |

All text pairs clear 4.5:1 and all boundary pairs clear 3:1 in both themes. In every scheme the **light** bevel edge carries the window's outer boundary in both themes, because every wallpaper here is mid-dark or darker — simpler than the current system, where which edge does the work flips by theme.

### Weaknesses

- `accent` on `desktop` is 2.04 — no accent marks on the wallpaper. Shortcut selection must use `ink`, as it does today.
- The teal accent is the one cold note in a brief that asked for warm. That tension is the scheme's character, but it is a real departure from the instruction.
- A rust wallpaper at 40% lightness is assertive. It will be the loudest thing on screen and it is behind everything.


## Scheme — Ember

**Near-black warm wallpaper, warm grey chrome, amber accent.**

A dark room with a fire in it. The chrome glows against the ground rather than competing with it. The most restrained option, and the one where the *window* is the subject and the palette is the substrate.

### Tokens

| Token | Light | Dark |
|---|---|---|
| `desktop` | `oklch(22% 0.03 55)` #25170d | `oklch(15% 0.024 55)` #130803 |
| `desktop-ink` | `oklch(97% 0.008 55)` #faf4f0 | `oklch(97% 0.008 55)` #faf4f0 |
| `surface` | `oklch(100% 0 85)` #ffffff | `oklch(21% 0.014 85)` #1b1811 |
| `ground` | `oklch(98.5% 0.006 85)` #fcfaf6 | `oklch(17% 0.012 85)` #120f09 |
| `sunk` | `oklch(95.5% 0.012 85)` #f4f0e7 | `oklch(14% 0.01 85)` #0b0905 |
| `rule` | `oklch(88.5% 0.016 85)` #ded9ce | `oklch(32% 0.018 85)` #373228 |
| `border` | `oklch(63% 0.018 85)` #8e897d | `oklch(52% 0.018 85)` #6e685d |
| `ink-faint` | `oklch(55.5% 0.024 85)` #797263 | `oklch(62% 0.02 85)` #8c8579 |
| `ink-muted` | `oklch(47% 0.028 85)` #625a49 | `oklch(74% 0.02 85)` #b1aa9d |
| `ink` | `oklch(24% 0.03 85)` #261e0e | `oklch(93% 0.014 85)` #ece7de |
| `accent` | `oklch(62% 0.13 65)` #bb731b | `oklch(80% 0.115 65)` #f1ae6b |
| `accent-ink` | `oklch(47% 0.11 60)` #864900 | `oklch(82% 0.105 65)` #f3b67a |
| `accent-sunk` | `oklch(95.5% 0.028 65)` #feeddd | `oklch(25% 0.035 65)` #2d1e0f |
| `titlebar-from` | `oklch(30% 0.055 55)` #432610 | `oklch(30% 0.055 55)` #432610 |
| `titlebar-to` | `oklch(50% 0.038 60)` #745e4e | `oklch(50% 0.038 60)` #745e4e |
| `titlebar-ink` | `oklch(99% 0 55)` #fcfcfc | `oklch(99% 0 55)` #fcfcfc |
| `bevel-light` | `oklch(100% 0 85)` #ffffff | `oklch(56% 0.02 85)` #7a7467 |
| `bevel-dark` | `oklch(38% 0.02 85)` #474236 | `oklch(8% 0.01 85)` #020201 |

### Contrast

| Pair | Light | Dark | Min |
|---|---|---|---|
| `ink` on `ground` | 15.77 | 15.56 | 4.5 |
| `ink` on `surface` | 16.47 | 14.42 | 4.5 |
| `ink-muted` on `surface` | 6.83 | 7.68 | 4.5 |
| `ink-faint` on `ground` | 4.55 | 5.25 | 4.5 |
| `accent-ink` on `ground` | 6.77 | 10.74 | 4.5 |
| `accent-ink` on `surface` | 7.07 | 9.96 | 4.5 |
| `border` on `surface` | 3.50 | 3.22 | 3.0 |
| `border` on `sunk` | 3.07 | 3.61 | 3.0 |
| `desktop-ink` on `desktop` | 15.93 | 18.05 | 4.5 |
| `titlebar-ink` on `titlebar-from` | 13.45 | 13.45 | 4.5 |
| `titlebar-ink` on `titlebar-to` | 5.89 | 5.89 | 4.5 |
| `bevel-light` on `desktop` | 17.40 | 4.24 | 3.0 |
| `accent` on `desktop` | 4.63 | 10.32 | 3.0 |

All text pairs clear 4.5:1 and all boundary pairs clear 3:1 in both themes. In every scheme the **light** bevel edge carries the window's outer boundary in both themes, because every wallpaper here is mid-dark or darker — simpler than the current system, where which edge does the work flips by theme.

### Weaknesses

- Wallpaper (hue 55) and chrome (hue 85) are both warm and close in hue, so the desktop can read as "dim chrome" rather than a distinct surface. The bevel carries the separation — at 17.40 in light mode it carries it comfortably, but it is doing real work.
- It is the least colourful scheme. If the palette is meant to be a signature, this is not it.
- A dark wallpaper in light mode is the least period-accurate choice here — Windows 98's ground was mid-lightness.


## Scheme — Moss

**Deep olive wallpaper, warm grey chrome, ochre accent.**

Lichen on stone. The most literally autumnal and the most unusual — very few sites are olive. Ochre on olive is a genuine analogous pairing rather than a manufactured complement.

### Tokens

| Token | Light | Dark |
|---|---|---|
| `desktop` | `oklch(38% 0.055 135)` #35492b | `oklch(16% 0.028 135)` #081005 |
| `desktop-ink` | `oklch(97% 0.01 135)` #f2f7f0 | `oklch(97% 0.01 135)` #f2f7f0 |
| `surface` | `oklch(100% 0 90)` #ffffff | `oklch(21% 0.014 90)` #1b1811 |
| `ground` | `oklch(98.5% 0.006 90)` #fcfaf6 | `oklch(17% 0.012 90)` #110f09 |
| `sunk` | `oklch(95.5% 0.012 90)` #f3f0e7 | `oklch(14% 0.01 90)` #0b0905 |
| `rule` | `oklch(88.5% 0.016 90)` #ddd9cd | `oklch(32% 0.018 90)` #363328 |
| `border` | `oklch(63% 0.018 90)` #8d897d | `oklch(52% 0.018 90)` #6d695d |
| `ink-faint` | `oklch(55.5% 0.024 90)` #787363 | `oklch(62% 0.02 90)` #8b8679 |
| `ink-muted` | `oklch(47% 0.028 90)` #615a49 | `oklch(74% 0.02 90)` #b0ab9d |
| `ink` | `oklch(24% 0.03 90)` #251f0e | `oklch(93% 0.014 90)` #ebe8de |
| `accent` | `oklch(60% 0.115 75)` #a87520 | `oklch(80% 0.11 75)` #e7b369 |
| `accent-ink` | `oklch(46% 0.1 70)` #7b4c00 | `oklch(82% 0.1 75)` #eabb79 |
| `accent-sunk` | `oklch(95.5% 0.026 75)` #fbeedd | `oklch(24% 0.032 75)` #281d0d |
| `titlebar-from` | `oklch(34% 0.06 135)` #2a3f1e | `oklch(32% 0.058 135)` #26391a |
| `titlebar-to` | `oklch(54% 0.042 130)` #67745a | `oklch(52% 0.042 130)` #616e55 |
| `titlebar-ink` | `oklch(99% 0 135)` #fcfcfc | `oklch(99% 0 135)` #fcfcfc |
| `bevel-light` | `oklch(100% 0 90)` #ffffff | `oklch(56% 0.02 90)` #797467 |
| `bevel-dark` | `oklch(38% 0.02 90)` #464236 | `oklch(8% 0.01 90)` #020201 |

### Contrast

| Pair | Light | Dark | Min |
|---|---|---|---|
| `ink` on `ground` | 15.76 | 15.56 | 4.5 |
| `ink` on `surface` | 16.45 | 14.42 | 4.5 |
| `ink-muted` on `surface` | 6.82 | 7.69 | 4.5 |
| `ink-faint` on `ground` | 4.55 | 5.25 | 4.5 |
| `accent-ink` on `ground` | 6.98 | 10.83 | 4.5 |
| `accent-ink` on `surface` | 7.29 | 10.03 | 4.5 |
| `border` on `surface` | 3.50 | 3.22 | 3.0 |
| `border` on `sunk` | 3.07 | 3.62 | 3.0 |
| `desktop-ink` on `desktop` | 9.02 | 17.78 | 4.5 |
| `titlebar-ink` on `titlebar-from` | 11.19 | 12.09 | 4.5 |
| `titlebar-ink` on `titlebar-to` | 4.84 | 5.27 | 4.5 |
| `bevel-light` on `desktop` | 9.81 | 4.16 | 3.0 |
| `accent` on `desktop` | 2.44 | 10.22 | 3.0 |

All text pairs clear 4.5:1 and all boundary pairs clear 3:1 in both themes. In every scheme the **light** bevel edge carries the window's outer boundary in both themes, because every wallpaper here is mid-dark or darker — simpler than the current system, where which edge does the work flips by theme.

### Weaknesses

- `accent` on `desktop` is 2.44 — again no accent on the wallpaper.
- Olive at hue 135 sits close to the register that reads as military or, if chroma creeps up, as sickly. It needs the chroma held down; 0.055 is near the ceiling.
- Ochre accent (hue 75) and olive ground (hue 135) are only 60° apart. They harmonise, but the accent never fully separates itself from the ground by hue — only by lightness.


## Scheme — Damson

**Deep plum wallpaper, warm grey chrome, burnt-orange accent.**

Dusk in November. The most modern-feeling of the four and the least period — plum was not available on a 16-colour VGA palette, which is exactly why it reads as contemporary.

### Tokens

| Token | Light | Dark |
|---|---|---|
| `desktop` | `oklch(34% 0.07 345)` #512840 | `oklch(16% 0.035 345)` #180711 |
| `desktop-ink` | `oklch(97% 0.01 345)` #faf3f7 | `oklch(97% 0.01 345)` #faf3f7 |
| `surface` | `oklch(100% 0 65)` #ffffff | `oklch(21% 0.0126 65)` #1c1712 |
| `ground` | `oklch(98.5% 0.0054 65)` #fdf9f6 | `oklch(17% 0.0108 65)` #130e0b |
| `sunk` | `oklch(95.5% 0.0108 65)` #f5efe9 | `oklch(14% 0.009 65)` #0c0806 |
| `rule` | `oklch(88.5% 0.0144 65)` #e0d7cf | `oklch(32% 0.0162 65)` #39312a |
| `border` | `oklch(63% 0.0162 65)` #90877f | `oklch(52% 0.0162 65)` #70675f |
| `ink-faint` | `oklch(55.5% 0.0216 65)` #7c7166 | `oklch(62% 0.018 65)` #8e847b |
| `ink-muted` | `oklch(47% 0.0252 65)` #65584c | `oklch(74% 0.018 65)` #b3a99f |
| `ink` | `oklch(24% 0.027 65)` #281d11 | `oklch(93% 0.0126 65)` #eee6df |
| `accent` | `oklch(58% 0.125 45)` #b65f35 | `oklch(79% 0.115 45)` #f8a27c |
| `accent-ink` | `oklch(46% 0.11 42)` #893f21 | `oklch(81% 0.105 45)` #faab88 |
| `accent-sunk` | `oklch(95.5% 0.024 45)` #ffece3 | `oklch(24% 0.034 45)` #2d1a11 |
| `titlebar-from` | `oklch(32% 0.08 345)` #4e203c | `oklch(31% 0.078 345)` #4b1e39 |
| `titlebar-to` | `oklch(52% 0.055 350)` #825c6d | `oklch(51% 0.055 350)` #7f596a |
| `titlebar-ink` | `oklch(99% 0 345)` #fcfcfc | `oklch(99% 0 345)` #fcfcfc |
| `bevel-light` | `oklch(100% 0 65)` #ffffff | `oklch(56% 0.018 65)` #7c736a |
| `bevel-dark` | `oklch(38% 0.018 65)` #494139 | `oklch(8% 0.009 65)` #030101 |

### Contrast

| Pair | Light | Dark | Min |
|---|---|---|---|
| `ink` on `ground` | 15.81 | 15.55 | 4.5 |
| `ink` on `surface` | 16.52 | 14.41 | 4.5 |
| `ink-muted` on `surface` | 6.86 | 7.67 | 4.5 |
| `ink-faint` on `ground` | 4.57 | 5.24 | 4.5 |
| `accent-ink` on `ground` | 7.15 | 10.26 | 4.5 |
| `accent-ink` on `surface` | 7.47 | 9.52 | 4.5 |
| `border` on `surface` | 3.51 | 3.21 | 3.0 |
| `border` on `sunk` | 3.07 | 3.60 | 3.0 |
| `desktop-ink` on `desktop` | 11.12 | 17.84 | 4.5 |
| `titlebar-ink` on `titlebar-from` | 12.81 | 13.26 | 4.5 |
| `titlebar-ink` on `titlebar-to` | 5.52 | 5.76 | 4.5 |
| `bevel-light` on `desktop` | 12.18 | 4.18 | 3.0 |
| `accent` on `desktop` | 2.71 | 9.74 | 3.0 |

All text pairs clear 4.5:1 and all boundary pairs clear 3:1 in both themes. In every scheme the **light** bevel edge carries the window's outer boundary in both themes, because every wallpaper here is mid-dark or darker — simpler than the current system, where which edge does the work flips by theme.

### Weaknesses

- `accent` on `desktop` is 2.71 — no accent on the wallpaper.
- Plum at hue 345 is the furthest from "warm autumnal" toward cool. It is autumn at dusk rather than autumn in daylight.
- `accent-sunk` had to be desaturated from 0.028 to 0.024 to stay inside sRGB. Any future ramp at that lightness will hit the same ceiling.

---

## Extending to ramps later

Every scheme is already a 5-step neutral ramp with semantic names:

```
surface → ground → sunk → rule → border → ink-faint → ink-muted → ink
```

The lightness steps are deliberately even, which is what makes them extendable.
When numeric ramps arrive, add a layer underneath and alias the semantic tokens
to it — markup never changes, because markup only ever names semantic tokens:

```css
--warm-0: oklch(100% 0 85);
--warm-1: oklch(98.5% 0.006 85);
/* … */
--color-ground: var(--warm-1);
```

Each scheme needs three ramps — warm neutral, accent, and wallpaper — rather
than one per token. Nothing above needs rewriting to get there.

---

## Recommendation

**Ember**, for one reason: it is the only scheme where the accent clears 3:1 on
the wallpaper (**4.63** in light mode, against 2.04–2.71 for the others).

That single number is the difference between a desktop that can show state and
one that cannot. With Ember, shortcut selection, hover and focus can use the
accent. With the other three, they must fall back to `ink` — which is what the
code does today, and it is why desktop selection currently reads as a flat dark
block rather than as something highlighted. Everything else separating these
four is taste. That one is function.

Ember is also the smallest move from where the code already sits: the in-flight
implementation has a dark wallpaper in both themes, and Ember is that structure
with a warm ground instead of a cool one.

**The honest counter-argument.** You asked for warm autumnal colour, and Ember is
the least colourful of the four — it is a warm *substrate*, not a warm
*signature*. If you want the palette itself to be the thing people remember,
take **Bracken**: rust ground with the Windows teal demoted to an accent is the
strongest idea here, and it is genuinely yours rather than a restyled default.
The price is admitting the desktop cannot carry accent marks, which is a
constraint the site already lives under and has not obviously suffered from.

Pick Ember if the window is the subject. Pick Bracken if the desktop is.

---

## Light-ground schemes

Added after James reviewed the four above: *"I think it'll be too dark for my
tastes. I'd like warm and light autumn colours, pumpkins, fallen leaves, apples
and other fruit on trees."*

These three keep light mode genuinely light and warm, and leave dark mode free
to be Ember-like. They do not replace the four above — Ember in particular
remains a strong candidate for the dark theme alone.

### Two consequences of a light wallpaper

Both follow from lightness separation, and neither is negotiable.

**The accent must be dark, not bright.** To clear 3:1 on a light wallpaper an
accent needs roughly 26–29 points of lightness *below* it:

| Wallpaper L | Accent at or below |
|---|---|
| 62% | 36% |
| 70% | 43% |
| 78% | 50% |

So the wallpaper can be bright pumpkin; the accent then has to be deep russet
or burnt umber. **A bright wallpaper and a bright accent cannot coexist** — the
same lightness collision as before, in the opposite direction.

**Shortcut labels flip to dark text.** On a 70% wallpaper, white label text is
2.65:1 and fails; dark text at 24% is 6.06:1. So `desktop-ink` becomes
theme-dependent again. Ember made it identical across themes because both its
wallpapers were dark; a light light-mode wallpaper reintroduces the flip.

**The window's raised edge swaps sides.** On these light wallpapers the *dark*
bevel carries the window boundary (3.65–5.34) and the light edge fails; in dark
mode it is the other way round. The bevel tokens must therefore both be real
colours — neither can be dropped.

**Avoid the middle.** A mid-light wallpaper around 44–55% is the worst case:
too light for white text, too dark for black. The workable regions are
genuinely light (≥62%) or genuinely dark (≤35%).


## Scheme — Pumpkin

**Bright pumpkin wallpaper, burnt-umber accent.**

The most literal reading of autumn, and the boldest wallpaper of the three.

### Tokens

| Token | Light | Dark |
|---|---|---|
| `desktop` | `oklch(70% 0.1 55)` #cf8d60 | `oklch(15% 0.024 45)` #140804 |
| `desktop-ink` | `oklch(24% 0.03 55)` #2a1b11 | `oklch(97% 0.008 45)` #faf4f1 |
| `surface` | `oklch(100% 0 85)` #ffffff | `oklch(21% 0.014 85)` #1b1811 |
| `ground` | `oklch(98.5% 0.006 85)` #fcfaf6 | `oklch(17% 0.012 85)` #120f09 |
| `sunk` | `oklch(95.5% 0.012 85)` #f4f0e7 | `oklch(14% 0.01 85)` #0b0905 |
| `rule` | `oklch(88.5% 0.016 85)` #ded9ce | `oklch(32% 0.018 85)` #373228 |
| `border` | `oklch(63% 0.018 85)` #8e897d | `oklch(52% 0.018 85)` #6e685d |
| `ink-faint` | `oklch(55.5% 0.024 85)` #797263 | `oklch(62% 0.02 85)` #8c8579 |
| `ink-muted` | `oklch(47% 0.028 85)` #625a49 | `oklch(74% 0.02 85)` #b1aa9d |
| `ink` | `oklch(24% 0.03 85)` #261e0e | `oklch(93% 0.014 85)` #ece7de |
| `accent` | `oklch(42% 0.125 40)` #832e09 | `oklch(80% 0.115 55)` #f7a974 |
| `accent-ink` | `oklch(47% 0.11 40)` #8d4226 | `oklch(82% 0.105 55)` #f9b281 |
| `accent-sunk` | `oklch(95.5% 0.03 55)` #ffebde | `oklch(25% 0.035 55)` #2f1d11 |
| `titlebar-from` | `oklch(34% 0.06 45)` #512d1c | `oklch(34% 0.06 45)` #512d1c |
| `titlebar-to` | `oklch(52% 0.042 55)` #7c6352 | `oklch(52% 0.042 55)` #7c6352 |
| `titlebar-ink` | `oklch(99% 0 55)` #fcfcfc | `oklch(99% 0 55)` #fcfcfc |
| `bevel-light` | `oklch(100% 0 85)` #ffffff | `oklch(56% 0.02 85)` #7a7467 |
| `bevel-dark` | `oklch(38% 0.02 85)` #474236 | `oklch(8% 0.01 85)` #020201 |

### Contrast

| Pair | Light | Dark | Min |
|---|---|---|---|
| `ink` on `ground` | 15.77 | 15.56 | 4.5 |
| `ink-faint` on `ground` | 4.55 | 5.25 | 4.5 |
| `accent-ink` on `ground` | 6.86 | 10.67 | 4.5 |
| `accent-ink` on `accent-sunk` | 6.22 | 9.00 | 4.5 |
| `border` on `surface` | 3.50 | 3.22 | 3.0 |
| `desktop-ink` on `desktop` | 6.02 | 18.05 | 4.5 |
| `accent` on `desktop` | 3.26 | 10.25 | 3.0 |
| `titlebar-ink` on `titlebar-from` | 11.67 | 11.67 | 4.5 |
| `titlebar-ink` on `titlebar-to` | 5.42 | 5.42 | 4.5 |
| window edge (carrying) | 3.65 (dark edge) | 4.24 (light edge) | 3.0 |

All text pairs clear 4.5:1 and all boundary pairs clear 3:1 in both themes. As with every scheme here, the control cluster is legible at the title bar's right-hand end where it actually sits; the left end is darker and would not carry it.


## Scheme — Orchard

**Light leaf-green wallpaper, deep apple red.**

Fruit on the tree rather than fallen. The only scheme whose wallpaper is not orange-family, which is what lets its accent be a true red.

### Tokens

| Token | Light | Dark |
|---|---|---|
| `desktop` | `oklch(74% 0.07 115)` #a9b17d | `oklch(15% 0.022 120)` #0a0d03 |
| `desktop-ink` | `oklch(24% 0.03 115)` #1f2110 | `oklch(97% 0.008 120)` #f4f6f0 |
| `surface` | `oklch(100% 0 85)` #ffffff | `oklch(21% 0.014 85)` #1b1811 |
| `ground` | `oklch(98.5% 0.006 85)` #fcfaf6 | `oklch(17% 0.012 85)` #120f09 |
| `sunk` | `oklch(95.5% 0.012 85)` #f4f0e7 | `oklch(14% 0.01 85)` #0b0905 |
| `rule` | `oklch(88.5% 0.016 85)` #ded9ce | `oklch(32% 0.018 85)` #373228 |
| `border` | `oklch(63% 0.018 85)` #8e897d | `oklch(52% 0.018 85)` #6e685d |
| `ink-faint` | `oklch(55.5% 0.024 85)` #797263 | `oklch(62% 0.02 85)` #8c8579 |
| `ink-muted` | `oklch(47% 0.028 85)` #625a49 | `oklch(74% 0.02 85)` #b1aa9d |
| `ink` | `oklch(24% 0.03 85)` #261e0e | `oklch(93% 0.014 85)` #ece7de |
| `accent` | `oklch(44% 0.15 28)` #94221d | `oklch(80% 0.12 110)` #c2c564 |
| `accent-ink` | `oklch(47% 0.11 28)` #8e3f36 | `oklch(82% 0.105 110)` #c8ca78 |
| `accent-sunk` | `oklch(95.5% 0.03 28)` #ffe9e5 | `oklch(25% 0.035 110)` #23230e |
| `titlebar-from` | `oklch(32% 0.06 120)` #2f3710 | `oklch(32% 0.06 120)` #2f3710 |
| `titlebar-to` | `oklch(50% 0.04 115)` #62664c | `oklch(50% 0.04 115)` #62664c |
| `titlebar-ink` | `oklch(99% 0 55)` #fcfcfc | `oklch(99% 0 55)` #fcfcfc |
| `bevel-light` | `oklch(100% 0 85)` #ffffff | `oklch(56% 0.02 85)` #7a7467 |
| `bevel-dark` | `oklch(38% 0.02 85)` #474236 | `oklch(8% 0.01 85)` #020201 |

### Contrast

| Pair | Light | Dark | Min |
|---|---|---|---|
| `ink` on `ground` | 15.77 | 15.56 | 4.5 |
| `ink-faint` on `ground` | 4.55 | 5.25 | 4.5 |
| `accent-ink` on `ground` | 6.90 | 11.12 | 4.5 |
| `accent-ink` on `accent-sunk` | 6.20 | 9.26 | 4.5 |
| `border` on `surface` | 3.50 | 3.22 | 3.0 |
| `desktop-ink` on `desktop` | 7.20 | 18.04 | 4.5 |
| `accent` on `desktop` | 3.69 | 10.69 | 3.0 |
| `titlebar-ink` on `titlebar-from` | 12.16 | 12.16 | 4.5 |
| `titlebar-ink` on `titlebar-to` | 5.77 | 5.77 | 4.5 |
| window edge (carrying) | 4.40 (dark edge) | 4.22 (light edge) | 3.0 |

All text pairs clear 4.5:1 and all boundary pairs clear 3:1 in both themes. As with every scheme here, the control cluster is legible at the title bar's right-hand end where it actually sits; the left end is darker and would not carry it.


## Scheme — Fallen Leaf

**Pale straw wallpaper, deep russet accent.**

The lightest and calmest. Closest to paper, furthest from a statement.

### Tokens

| Token | Light | Dark |
|---|---|---|
| `desktop` | `oklch(80% 0.06 80)` #d2ba92 | `oklch(16% 0.024 60)` #150b04 |
| `desktop-ink` | `oklch(24% 0.03 80)` #271e0e | `oklch(97% 0.008 60)` #f9f4f0 |
| `surface` | `oklch(100% 0 85)` #ffffff | `oklch(21% 0.014 85)` #1b1811 |
| `ground` | `oklch(98.5% 0.006 85)` #fcfaf6 | `oklch(17% 0.012 85)` #120f09 |
| `sunk` | `oklch(95.5% 0.012 85)` #f4f0e7 | `oklch(14% 0.01 85)` #0b0905 |
| `rule` | `oklch(88.5% 0.016 85)` #ded9ce | `oklch(32% 0.018 85)` #373228 |
| `border` | `oklch(63% 0.018 85)` #8e897d | `oklch(52% 0.018 85)` #6e685d |
| `ink-faint` | `oklch(55.5% 0.024 85)` #797263 | `oklch(62% 0.02 85)` #8c8579 |
| `ink-muted` | `oklch(47% 0.028 85)` #625a49 | `oklch(74% 0.02 85)` #b1aa9d |
| `ink` | `oklch(24% 0.03 85)` #261e0e | `oklch(93% 0.014 85)` #ece7de |
| `accent` | `oklch(48% 0.13 45)` #97400d | `oklch(81% 0.11 60)` #f5b076 |
| `accent-ink` | `oklch(47% 0.11 45)` #8c431f | `oklch(82% 0.105 60)` #f7b47d |
| `accent-sunk` | `oklch(95.5% 0.028 45)` #ffebe1 | `oklch(26% 0.035 60)` #312012 |
| `titlebar-from` | `oklch(34% 0.055 60)` #4d3119 | `oklch(34% 0.055 60)` #4d3119 |
| `titlebar-to` | `oklch(52% 0.038 70)` #776551 | `oklch(52% 0.038 70)` #776551 |
| `titlebar-ink` | `oklch(99% 0 55)` #fcfcfc | `oklch(99% 0 55)` #fcfcfc |
| `bevel-light` | `oklch(100% 0 85)` #ffffff | `oklch(56% 0.02 85)` #7a7467 |
| `bevel-dark` | `oklch(38% 0.02 85)` #474236 | `oklch(8% 0.01 85)` #020201 |

### Contrast

| Pair | Light | Dark | Min |
|---|---|---|---|
| `ink` on `ground` | 15.77 | 15.56 | 4.5 |
| `ink-faint` on `ground` | 4.55 | 5.25 | 4.5 |
| `accent-ink` on `ground` | 6.84 | 10.71 | 4.5 |
| `accent-ink` on `accent-sunk` | 6.19 | 8.76 | 4.5 |
| `border` on `surface` | 3.50 | 3.22 | 3.0 |
| `desktop-ink` on `desktop` | 8.79 | 17.81 | 4.5 |
| `accent` on `desktop` | 3.68 | 10.52 | 3.0 |
| `titlebar-ink` on `titlebar-from` | 11.59 | 11.59 | 4.5 |
| `titlebar-ink` on `titlebar-to` | 5.39 | 5.39 | 4.5 |
| window edge (carrying) | 5.34 (dark edge) | 4.18 (light edge) | 3.0 |

All text pairs clear 4.5:1 and all boundary pairs clear 3:1 in both themes. As with every scheme here, the control cluster is legible at the title bar's right-hand end where it actually sits; the left end is darker and would not carry it.
