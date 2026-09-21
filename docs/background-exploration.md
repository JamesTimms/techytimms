# Desktop background exploration

Options for the desktop wallpaper, measured against the live **Fallen Leaf**
palette. Rendered side by side at `/styleguide` — the numbers below decide what
is *allowed*, but only looking at them decides what is *right*.

Nothing here is applied. The live background is still the flat fill.

---

## 1. The constraint that rules out most of the field

Two things sit directly on the wallpaper and both have contrast floors:

| | Token pair | Floor | Currently |
|---|---|---|---|
| Shortcut labels | `desktop-ink` on `desktop` | 4.5 | 8.79 light / 17.81 dark |
| The window's edge | `window-edge` on `desktop` | 3.0 | 3.64 light / 4.01 dark |

A pattern varies the ground, so both have to hold at the pattern's **extreme**,
not its average. Sweeping the wallpaper's lightness while holding everything
else gives the envelope:

| Theme | Ground may range | Headroom darker | Headroom lighter |
|---|---|---|---|
| Light | 75% – 99% | **5 points** | 19 points |
| Dark | 2% – 28% | 14 points | 12 points |

**Light mode can only go five points darker before the window edge falls under
3:1.** It can go nineteen lighter. That asymmetry decides almost everything
below, and it is not obvious from looking at the wallpaper.

The cause is that `window-edge` is already close to its floor at 3.64. Darkening
the ground moves it toward the edge colour; lightening moves it away.

---

## 2. What the references actually do

Both were measured off `assets/references/scratch-board.png` rather than
described from memory.

### Monica Dinculescu — a dot grid, not a line grid

| | Measured |
|---|---|
| Spacing | **13.1px** (mean of 8 gaps, ±0.5) |
| Dot size | 1px core, antialiased to ~3px |
| Ground | `#cdf3ed` = `oklch(93.5% 0.040 185)` |
| Dot core | `#b9d7d0` = `oklch(85.5% 0.033 180)` |
| Contrast | **1.29:1** |

Two things worth taking from this. First, 1.29:1 is a usable, measurable
definition of "subtle" — far fainter than most people build. Second, and more
important:

> **Her ground sits at 93.5% lightness. Ours sits at 79.9%.**

She can afford to darken by 8 points because her ground is nearly white and
nothing structural is competing for contrast on it. On Fallen Leaf the same
8-point darkening overruns the 5-point budget and takes the window edge below
3:1. **Monica's approach does not transfer directly — the direction has to
invert.**

### Laurie Wired — a full-contrast tiling image

Lain artwork tiled edge to edge, "UNDER CONSTRUCTION" banners, animated GIFs, an
embedded audio player. Contrast is effectively full-range, and it works because
the window on top is opaque black and large enough to be its own surface.

This is the opposite pole from Monica, and James read it correctly as leaning
into the era rather than being subtle. Useful as a bound: it shows what the
window has to be like if the wallpaper is loud.

---

## 3. The Win9x Pattern lead — real, but it fails here

Windows 9x's Display Properties did separate **Pattern** from **Wallpaper**, and
Pattern was an 8×8 monochrome tile — Bricks, Weave, Thatches, Waffle — tiled
across the desktop.

**Two corrections to that lead, though.**

**The supplied screenshot does not corroborate it.** `what-was-your-go-to-internet-browser-in-the-2000s…webp`
shows Windows 2000 running a *photographic* wallpaper — grass, trees, sky. It
demonstrates the Wallpaper path, not the Pattern one, so it cannot confirm the
8×8 claim either way.

**And the authentic rendering fails our contrast floors.** Windows drew Pattern
tiles in **black** over the desktop colour — set pixels black, unset pixels the
ground. On pale straw that measures:

| | Light | Dark |
|---|---|---|
| `desktop-ink` on a black pattern line | **1.27** ✗ | 19.23 |
| `window-edge` on a black pattern line | 3.08 | 4.33 |

A shortcut label crossing a black line is at 1.27:1 — invisible. So the
period-authentic pattern and a pale wallpaper are **incompatible**, and that is
a real design tension rather than an implementation detail:

- Keep the pattern authentic (black) and the wallpaper has to be dark — which
  is Ember, the scheme James rejected as too dark.
- Keep the wallpaper pale and the pattern has to be drawn near the ground
  colour, which is a deviation from how Windows rendered it.

The geometry is period; the colour cannot be. It is rendered at `/styleguide`
as **Weave — as Windows drew it** so the failure is visible rather than
described.

---

## 4. The options

All measured at the pattern's worst extreme. Floors: 4.5 label, 3.0 edge.

| Option | Label L | Edge L | Label D | Edge D | Cost |
|---|---|---|---|---|---|
| Flat fill *(live)* | 8.79 | 3.64 | 17.81 | 4.01 | 0 B |
| **Dot grid — lifted** | **11.10** | **4.60** | 15.63 | 3.52 | ~150 B |
| Dot grid — dropped | 7.65 | 3.17 | 18.72 | 4.21 | ~150 B |
| Line grid, 24px | 11.10 | 4.60 | 15.63 | 3.52 | ~190 B |
| Weave, 8px | 11.10 | 4.60 | 15.63 | 3.52 | ~190 B |
| Weave, as Windows drew it | **1.27** ✗ | 3.08 | 19.23 | 4.33 | ~180 B |
| Diagonal hatch | 11.10 | 4.60 | 15.63 | 3.52 | ~150 B |
| Grain | 11.10 | 4.60 | 15.63 | 3.52 | ~260 B |
| Vertical sheen | 7.65 | 3.17 | 15.63 | 3.52 | ~120 B |

The lifted options all share numbers because they share a colour — the geometry
differs, the extreme does not.

### Notes per option

**Dot grid — lifted.** Monica's geometry at 16px, drawn *lighter*. Improves both
floors rather than spending them. Weakness: a lighter pattern reads as sheen
rather than texture, and is the least tactile option.

**Dot grid — dropped.** Faithful to Monica's direction. Lands at 3.17 against a
3.0 floor — legal, with almost nothing left. Any future darkening of the
wallpaper or lightening of `window-edge` breaks it.

**Line grid, 24px.** Clean, but grids read as drafting tools and design software.
Least period-specific thing here.

**Weave, 8px.** The Win9x tile size. Dense enough that it may shimmer on some
displays, and the option most likely to look like a rendering artefact.

**Diagonal hatch.** Diagonals carry direction and the eye tracks along them —
more restless than an orthogonal tile at identical contrast.

**Grain.** The only option whose cost is CPU rather than bytes; `feTurbulence` is
rasterised per tile size. It also has no period referent — 90s desktops had
ordered dithering, not film grain. Wrong era, right instinct.

**Vertical sheen.** A gradient implies a light source, which argues against a flat
desktop. Inherits the dropped variant's tight 3.17 margin at its foot.

**A tiling image (Laurie's approach).** Not implemented, and here is the costing:
a 64×64 PNG at 8-bit indexed colour is roughly 1–2 KB, plus one request, plus a
decode. It needs a second asset for dark mode, or it inverts badly. Against a
CSS pattern at ~150 B and zero requests, an image only earns its place if it
carries something CSS cannot express — actual artwork, a photograph, a logo.
For a geometric tile it is strictly worse. If James wants Lain artwork or
something hand-drawn on the desktop later, that is when this becomes the right
tool.

---

## 5. Broader notes

**Patterns belong on the wallpaper, nowhere else.** The wallpaper is the one
surface with no body text on it. Every other surface (`ground`, `surface`,
`sunk`) carries reading text, and a pattern under text costs legibility for
decoration.

**`background-attachment: fixed` is worth considering and is not free.** It makes
the wallpaper sit still while content scrolls, which reinforces "the window
moves, the desktop does not". It also forces repaints on scroll on some
compositors. Try it after picking a pattern, not before.

**Nothing here moves.** No animation, so `prefers-reduced-motion` has nothing to
suppress. If a pattern ever animates, that changes.

**The pattern colour is mixed from `--color-desktop`**, not written as a literal,
so every option survives a palette swap. The mix percentages differ per theme
because the two wallpapers sit at opposite ends of the lightness range — a
percentage that reads on pale straw is invisible on near-black.

---

## 6. Recommendation

**Dot grid — lifted.**

One reason: **it is the only option that spends no contrast.** Every other
pattern either degrades the two floors that sit on the wallpaper (dropped dots,
sheen), fails one outright (authentic weave), or matches the lifted numbers
while carrying a worse association — grids read as design tools, hatching is
restless, grain is the wrong decade.

Lifting moves the ground *away* from both the label and the window edge, so the
label improves from 8.79 to 11.10 and the edge from 3.64 to 4.60. It buys
texture and contrast headroom at the same time, which matters given
`window-edge` had 0.64 of headroom before this.

It is also the closest thing to Monica's, which is the reference James named —
same geometry, same restraint, inverted only because our ground is 13.6 points
darker than hers and cannot afford the original direction.

**The honest counter-argument:** lifted dots read as sheen rather than texture,
and if what James wants is the *feel* of a surface — something closer to
Laurie's tactility, or to paper — then lifting is too polite and the dropped
dots are the more characterful choice at the cost of nearly all the remaining
margin. That is a judgement no calculation settles, which is what `/styleguide`
is for.
