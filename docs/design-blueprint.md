# Design Blueprint

A scratch board, not a specification. Everything below is raw material to draw
from, recombine, and argue with. Nothing here gets copied outright.

Sources: the Excalidraw board (`assets/scratch-board.png`, 15 annotated
captures) and the research list in `personal-site-inspiration.md`.

---

## 1. The thesis

In your own words:

> I think I'd prefer heavily stylised flare with a core sensible and clean design.

That is the whole brief, and it is a good one. It also names the failure mode:
stylised flare *replacing* the clean core, rather than sitting on top of it. A
recruiter still has to find what you do in fifteen seconds.

Practically: **the structure stays boring, the surface gets loud.** Layout,
type scale, spacing, contrast and reading width behave themselves. Texture,
colour, iconography, framing devices and the occasional easter egg carry the
personality.

### You already have the identity

The strongest signal in the board is not any single site — it is that your
picks cluster hard around **nostalgic desktop computing**:

- Monica Dinculescu — *"feels like an old mac desktop… nostalgic design, especially for late 90s, early 2000s"*
- Laurie Wired — *"I love the intentional 90s/2000s styling"*
- Lynn Fisher — *"the site being paper"*
- Tania Rascia — *"use of pixel icons"*
- Jenn Schiffer — *"the background changes based on where your cursor has been"*
- Emma Bostian / Jenn Schiffer / Sara Soueidan — blocky bordered buttons, cards and callouts

And you have already built exactly this once: `terminal.techytimms.com` is a
Windows 95 CRT boot sequence. That is not a coincidence, it is your taste.

**The proposal: same world, one era later.** The terminal is the 1995 machine.
`techytimms.com` is the desktop you'd find it on around 1999–2003 — windows,
chrome, pixel icons, a wallpaper texture — rendered with 2026 typography,
contrast and performance. It gives you the "something real and tangible" you
asked for, it makes the apex site and the terminal site read as one person, and
it gives the terminal the front door it currently lacks.

It also has a natural escape hatch: the desktop metaphor can be as light as
framed panels and pixel icons, or as heavy as draggable windows. Start light.

---

## 2. Scratch board, by element

Organised by what each idea is *for*, since that is how you will use it.

### Hero and identity

| Source | The idea | Note |
|---|---|---|
| Cassidy Williams | Mini-hero above the nav — photo, one-line role, location | You liked both this *and* the absence of a top-level nav |
| Stephanie Eckles | Hero carrying pronouns, title, social links, and skill headliners | The most information-dense hero on the board, still calm |
| Emma Bostian | Big declarative statement — "I build teams that ship good software" | Positioning as a sentence, not a job title |
| Tania Rascia | Left sidebar, nav demoted to bottom-left | *"turns the focus onto her and her projects vs what recruiters want to see"* |

**Tension to resolve.** Tania's demoted nav and Stephanie's information-dense
hero pull in opposite directions. Tania's works because her site is a blog and
the sidebar is always present. If recruiters are a named audience, the hero
has to carry the pitch — so: Stephanie's *content*, Cassidy's *placement*,
Tania's *restraint about chrome*.

### The desktop metaphor, done properly

| Source | The idea |
|---|---|
| **PostHog** ([posthog.com](https://posthog.com/)) | A fully realised desktop vibe that has survived several redesigns — the core is iconic enough to be the brand. **The reference implementation for this direction.** |
| Monica Dinculescu | Old-Mac desktop feel; nostalgic late-90s/early-2000s |
| Laurie Wired | Intentional 90s/2000s styling, committed all the way |

PostHog is the most useful single reference on this board because it answers
the question the others do not: *how does a desktop metaphor behave on a
phone?* Its answer — one window spanning the full viewport on mobile, floating
windows on a desktop ground above a breakpoint — is the model adopted here.

### Links, buttons and blocks

| Source | The idea |
|---|---|
| Cassidy Williams | Many different colours used to underline links and navigable elements |
| Emma Bostian | Blocky buttons and cards with visible borders, plus text underlining |
| Wizard Zines | Chunky buttons, soft pastel fills |
| Jenn Schiffer | Blocky everything; background reacts to where the cursor has been |
| Sara Soueidan | Boxy callouts with real borders, not Tailwind's default traffic-light tints |

This is the most consistent thread on the whole board. **Visible borders,
flat fills, no soft shadows.** It suits the desktop-chrome direction exactly,
and it is cheap to build: one bordered-panel primitive covers callouts, cards,
buttons and window frames.

Your note about Sara's callouts is worth making explicit: the default
`info / warning / success` colour semantics are wrong here. A callout should
read as a *panel*, with the border doing the work and colour used sparingly.

### Colour and texture

| Source | The idea |
|---|---|
| Lynn Fisher | Paper ground; dark mode becomes card or denim |
| Tania Rascia | Warm palette, pixel icons |
| Wizard Zines | Soft pastels — *"unsure if the colours are ideal for me"* |
| Stephanie Eckles | Liked the theme, *"perhaps not ideal — I'd prefer autumnal"* |
| Stephanie Stimac | Committed "web witch" identity that still reads professional |

**Autumnal is the stated direction.** Usefully, the palette already shipped is
half-way there: the amber accent (hue 70) is autumnal, the slate neutrals
(hue 250) are not. Shifting the neutral hue from 250 to somewhere around 60–80
at very low chroma turns cool grey into warm paper without touching anything
else — it is a one-number change in `global.css`.

Lynn Fisher's material swap is the best texture idea on the board: light mode
is *paper*, dark mode is a different *material* rather than the same paper
dimmed. Worth stealing the concept, not the execution.

### Blog and reading

| Source | The idea |
|---|---|
| Lea Verou | Read time + post date as a compact summary line; "on this page" contents |
| Maggie Appleton | "Planted on" / "last tended on" instead of published/updated |
| Maggie Appleton | Patterns section — a collection of observations, not posts |
| Tania Rascia | Homepage "shelves", latest, projects — previews of every other page |
| Tania Rascia | Brief timeline; small resume/source section |

Lea's post header is a straightforward win and cheap to add. Maggie's
"planted/tended" language is charming but commits you to actually tending —
only adopt it if you will.

Tania's homepage model is the strongest structural idea here: **the homepage is
a set of previews into every other section**, which is what makes a site with a
thin blog still feel alive. Given your uncertainty about committing to writing,
this matters more than any single blog feature.

### Meta and craft

| Source | The idea |
|---|---|
| Una Kravets | `/colophon` — a page about how the site itself is designed and built |
| Miriam Suzanne | Live style customiser (fonts, sizes, alignment, theme) |
| Lynn Fisher | Whole-site redesign annually, every past version kept live |

You flagged Miriam's style switcher as *"maybe not ideal as I'm not a design
specialist"* — agreed, and it is a large build. A colophon is the cheap
version of the same instinct: it shows the craft without needing a UI for it.

### Collections as content

| Source | The idea |
|---|---|
| Maggie Appleton | Library of books read, with ratings/notes |
| Tania Rascia | Shelves on the homepage |

This is where your own ideas landed too — see section 4.

---

## 3. Other inspirations named

Not site references, but voice and atmosphere references. Worth recording
because they will shape copy and mood more than layout.

- **Alberta Tech** — the vibe of the videos; site itself is simple.
- **Sebastian Lague** — no site, but the register of the programming videos: calm, curious, visual.
- **Serial Experiments Lain** — *deferred; you will say where and when.* The anime you want subtle references to. Handle carefully: the obvious reading is CRT scanlines and glitch text, which is both overdone and already spent on the terminal site. The less obvious and more interesting readings are *layered windows*, *wires and connection*, *the boundary between a person and their machine* — closer to the desktop direction anyway.
- **Laurie Wired** — does the Lain-inspired thing overtly, including a bitcrushed *Duvet*. Evidence it can work; also evidence that doing it the same way would read as derivative.

---

## 4. Your own ideas

These came from you, not from the board, and they are the most distinctive
material here.

**Hobbies, made physical.** Magic: the Gathering, foraging (apple trees),
gaming. The polaroid idea — photographs framed and pegged on a line, so the
visitor is standing in *your space* — is the single best idea in this document.
It delivers "tangible" without needing a metaphor explained, and it composes
perfectly with the desktop direction (a pinboard is furniture).

**A library section.** Books read, with notes. Plus the confession post: a book
*buying* habit without a matching reading habit, illustrated with a photo of
the shelf of unread books. That post is genuinely good — specific, self-aware,
and it justifies the section existing.

**A console corner / games played.** Same shape as the library.

**MTG.** Split into two, deliberately:

- *In scope, later:* a **"decks I'm playing"** page. Deck lists imported into a
  data file, rendered through the same MDX pipeline as posts, with card art
  pulled from an API. Read-only, low risk, genuinely personal.
- *Out of scope:* the **import/export tool**. Deck-list parsing, Arena/MTGO
  formats, matchup matrices, sideboard guides — that is a product, and it would
  eat the site's entire build budget. Its own project, linked from the site the
  way the terminal is.

---

## 5. Notes for later

Explicitly parked, so they are not forgotten.

| Item | Trigger to revisit |
|---|---|
| **GitHub profile README** — Cassidy's is a good model | Cheap, high visibility, do it independently of the site |
| **TinaCMS** | Only if editing MDX in git becomes the thing stopping you writing |
| **utterances** for blog comments | After there are posts worth commenting on |
| **Open-sourcing the site / a blog template**, as Cassidy does | Once it is something you would want copied |
| **A colophon page** | After the design language settles — it is the write-up of this document |
| **Annual redesign, past versions kept live** (Lynn Fisher) | Year two, if the site is still fun |
| **A screensaver** — idle-triggered, over the desktop ground | Once the desktop metaphor is settled and the chrome is stable |

### On the screensaver

The most natural flourish the desktop metaphor offers, and the one place where
going fully period costs nothing in usability — it only runs when nobody is
using the site.

Worth knowing before it gets built:

- **It needs JavaScript.** Idle detection and teardown-on-input are a few lines;
  the animation itself can be CSS or canvas. This is a clear case for the
  "minimal, not forbidden" stance rather than a reason to avoid it.
- **`prefers-reduced-motion` is not optional here.** A full-viewport animation is
  exactly what that preference exists to suppress. Respecting it means the
  screensaver simply never runs for those users.
- **Any input must dismiss it instantly** — pointer, key, scroll, touch. A
  flourish that traps someone is a bug.
- **This is the obvious home for a Lain reference**, whenever James decides to
  place one. A screensaver is ambient, opt-out by definition, and seen only by
  people who lingered — which is the right audience for something oblique.

---

## 6. Decisions

Resolved from the open questions.

1. **Framed panels with 2000s Windows chrome.** Title bar, the expected
   minimise/maximise/close controls, hard borders. Built as one React component
   configured by props (position, size, title, whether the chrome is live), so
   the whole site composes from it.
2. **Mobile-first, PostHog's model.** One window spanning the full page on
   mobile; floating windows on a desktop ground at larger breakpoints. **This
   does not need Next.js** — see below.
3. **Blog: committed.** Built to work with zero posts, so the empty state has
   to read as deliberate rather than broken. Removable later if the writing
   does not happen.
4. **Library — "digital bookshelf".** Books and video games in one section, with
   games presented as PS1/PS2 disc cases. Separate MTG decks page comes later.
5. **Warm neutrals with a subtle seasonal palette.**
6. **Annual-redesign idea: out of scope.** Pixel icons are now in scope — see decision 10.

7. **Full Windows 98/2000 fidelity, excluding colour.** Duplicate the geometry
   visually — bevels, control sizing, title-bar anatomy, menu structure, icon
   treatment. Colour does not come from Windows; it comes from our own warm
   palette. Think of it as a custom *Plus!* theme: period-correct shapes
   wearing our colours.
8. **The Start menu is the site navigation.** All navigation leaves the window
   chrome. The window shows content only.
9. **`terminal.techytimms.com` moves out of the taskbar** and becomes a project
   entry on `/work`, until James decides what the taskbar should carry instead.
10. **Windows 98 icons** from [win98icons.alexmeub.com](https://win98icons.alexmeub.com/),
   used as an icon library. Credit belongs in the colophon.

11. **Desktop shortcuts duplicate the main navigation** (About, Work, Blog —
   not CV). Built as a React shortcut component with a props-driven API, plus a
   layout component owning placement. Win98 flow: left-aligned, filling the
   first column vertically before starting a second.
12. **CV sits beside GitHub at the foot of the Start menu.** Reachable, and
   plainly not the site's headline — consistent with the reader order.
13. **The desktop ground gets lighter**, and becomes the base the colour schemes
   layer onto rather than a fixed backdrop.

### Fidelity: the resolution question, answered

James was unsure between "16, 24, 32 bit style" and a modern take. The
distinction dissolves once you split it in two, and the thesis already says how:
**period-authentic ornament, modern ergonomics.**

- **Icons stay authentically pixelated.** The set ships 16, 32 and 48px variants
  at period colour depth. Use them at **native size only**, never scaled to
  fractional values, with `image-rendering: pixelated`. A 16px icon rendered at
  17px is the single fastest way to make this look cheap.
- **Geometry is period.** Bevel widths, border weights, control proportions,
  the title-bar anatomy — copy these faithfully.
- **Type, spacing and hit targets are modern.** Do not reproduce 11px MS Sans
  Serif or 16px hit targets. Text stays at the current scale and remains AA
  legible; interactive targets stay comfortable on touch.

That split is exactly "heavily stylised flare with a core sensible and clean
design", applied at the pixel level.

### Navigation behind Start is the intent, not a compromise

An earlier draft treated hiding navigation as a cost to mitigate for the
recruiter audience. That reading is obsolete: **the site is James's first and
recruiters' last** (build plan, section 1).

The Start menu holding all navigation is the design working, not a compromise.
What follows:

- The Start button still has to be **unmistakably the way in** — not to rescue a
  fifteen-second skim, but because navigation nobody can find is bad design for
  every reader, James included.
- **CV is reachable but deliberately tucked away.** It sits in the Start menu
  like everything else. No taskbar shortcut, no home-page call to action, no
  treatment implying it is the site's purpose.
- The home page is free to lead with whatever is most *his* — projects,
  collections, the desktop itself — rather than a pitch aimed at a stranger.

### Zero JavaScript and a popup menu

A Start menu opens and closes, which sounds like it needs an island. It does
not: `<details>`/`<summary>` is a native disclosure widget — keyboard
accessible, screen-reader announced, zero JavaScript.

What `<details>` does not give: click-outside-to-close, and Escape to dismiss.
Both need a few lines of JS.

**Standing position: minimal JavaScript, not none.** Zero-JS is a strong default
because it is usually achievable and keeps content pages fast — but where
JavaScript buys genuinely better functionality, propose it with what it costs
and James decides. Ship the CSS-only menu first; if the missing dismiss
behaviours annoy in use, they are worth a few lines.

### Why Astro still fits

The responsive window behaviour is CSS breakpoints plus one interactive
component — Astro handles it, and handles it *better* than Next.js would.

Astro's `client:media` directive hydrates a component only when a media query
matches:

```astro
<Window client:media="(min-width: 64rem)" title="about.txt">
```

Mobile gets the server-rendered window as static HTML with **zero JavaScript**;
desktop loads the interactive chrome. Next.js has no per-breakpoint hydration
equivalent — it would ship the window JavaScript to phones that can never use
it. The islands model is the right tool here, not a constraint to work around.

The one thing to watch: a component rendered server-side and hydrated only
above a breakpoint must produce identical markup in both states, or the layout
shifts when hydration kicks in. Keep the window's static and interactive
renders visually identical; only the behaviour differs.

---

## 7. Scope reality check

This document describes considerably more site than currently exists. The
build plan's Phase 1 — pitch, about, CV, contact, live on the apex — is still
the thing that makes the site useful, and none of the above changes that.

Suggested order: settle the **palette shift** and the **bordered-panel
primitive** first, since everything else inherits from them. Both are small,
both are reversible, and both are visible immediately. Sections, collections
and the desktop metaphor come after there is something to frame.

Next step is to fold the resolved decisions back into
`personal-site-blueprint.md` sections 4 and 6, and to revise the layout
accordingly.
