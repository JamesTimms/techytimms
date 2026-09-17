# Personal Site Blueprint — Astro

Build plan for the personal site at techytimms.com.

| | |
|---|---|
| **Job to be done** | Credibility + a durable address |
| **Readers** | Recruiters · engineering peers · future you |
| **Stack** | Astro · TypeScript · Tailwind v4 · MDX · Zod |
| **Domain** | `techytimms.com` (apex — `terminal.` subdomain is already taken by the CRT site) |
| **Status** | Rev B — plan only, build is yours |

> **Built against Astro 7.3.3** (scaffolded 17 Sep 2026). Three things differ from earlier guidance:
> - Astro requires **Node >= 22.12.0**. The repo pins 24.19.0 in `.nvmrc`; nvm has it.
> - Zod comes from `astro/zod` (a re-export supporting **Zod 4**), not from `astro:content`. So `z.url()`, not `z.string().url()`.
> - `astro check` cannot use **TypeScript 7** — the native compiler does not expose the programmatic API it needs. `typescript` is pinned to `^6` until [withastro/roadmap#1321](https://github.com/withastro/roadmap/discussions/1321) lands.

---

## 1. What this site has to do

Three readers, and they behave very differently. Designing for all three at once is how personal sites end up as a bland grid of cards, so pin what each one needs and let that drive the information architecture.

**A recruiter gives you about fifteen seconds.** They need, above the fold and without scrolling: what you do, where you have done it, and how to contact you. No hero animation standing between them and that.

**A peer is judging craft.** They will read one project write-up properly and look at how the site itself is built — view source, check the network tab, notice whether the theme toggle flashes. This reader is why performance and typography are worth the time, and why one real write-up beats six thin ones.

**Future you needs it to still work in three years.** That argues for content in git, few dependencies, boring infrastructure, and nothing that breaks when a service changes its pricing. Every dependency below should justify itself against this.

### The CV question

You would rather not put the PDF online, but the contents are fine. So: **no downloadable PDF, no `/cv.pdf` route.** Instead, port `techytimms/src/data/james.ts` into this site as typed data and render it as HTML — experience, skills, education, certifications, achievements. That is what the terminal site already does; this is the same content in a form a recruiter can skim rather than type commands at.

`assets/James_Timms_CV.pdf` stays out of `public/` and out of git. Add it to `.gitignore` on day one so it cannot be committed by accident.

---

## 2. Stack decisions

| Concern | Choice | Why | Instead of |
|---|---|---|---|
| **Framework** | Astro | Islands architecture: pages ship zero JS unless a component asks for it. The right tool for a content-and-credential site, and the one you are curious about. | Next.js — you already demonstrate that stack at EatPing, and `techytimms` covers React/Vite. Nothing left to prove here. |
| **Styling** | Tailwind v4 via `@tailwindcss/vite` | Same setup you already run in `techytimms`, so no new muscle memory. CSS-first `@theme` config keeps tokens in one file. | CSS Modules and hand-written CSS — **deferred until a real use case appears**, not adopted pre-emptively. |
| **Content** | MDX via `@astrojs/mdx` | Markdown simplicity, with an escape hatch to drop in a component when a post needs one. | Plain Markdown. Simpler, but you lose the escape hatch entirely. |
| **Schema / validation** | Zod 4, via `astro/zod` | Astro validates collection frontmatter with Zod **at build time** — a malformed date or missing summary fails `astro build`, not the page. Exactly the compile-level checking you want, and it is native rather than bolted on. | Runtime checks, or no checks. Both let bad content reach production. |
| **Code blocks** | *Undecided — see note* | Astro ships Shiki highlighting built in, and `expressive-code` is the common upgrade. Both highlight at build time with no client JS. | — |
| **Theme toggle** | Hand-rolled inline script | See below — in Astro this is genuinely the right answer, not a compromise. | A library. There is no `next-themes` equivalent because Astro does not have the problem `next-themes` exists to solve. |
| **Hosting** | *Open* | Revisit once the stack settles. Astro deploys as static output almost anywhere. | — |
| **Analytics** | *Open* | Same. | — |

### Note on code blocks (for your separate session)

You asked what this is: it is **syntax highlighting for code blocks in blog posts**. The question is which highlighter, and whether it runs at build time or in the browser. Worth a proper look at Shiki-built-into-Astro vs. `expressive-code` vs. alternatives — the differences are in features like line highlighting, diff rendering, filename headers, and copy buttons, not in output quality. Flagged here, not decided.

### Why no theme-toggle library in Astro

`next-themes` exists because React hydrates: the server renders HTML, React re-renders on the client, and if the two disagree about the theme you get a flash or a hydration error. The library's whole job is managing that mismatch.

Astro pages are static HTML by default — there is no hydration pass to disagree with. So the entire solution is a blocking `<script is:inline>` in `<head>` that reads `localStorage`, falls back to `matchMedia('(prefers-color-scheme: dark)')`, and sets a class on `<html>` before the first paint. Roughly ten lines, no dependency, no flash. The toggle button itself can be a tiny island or plain inline script.

The one rule: that script must be `is:inline` and in the `<head>`, or Astro will bundle it and it will run too late.

---

## 3. Routes and repo layout

```
src/
  pages/
    index.astro              # pitch, recent posts, featured projects
    about.astro
    cv.astro                 # rendered from typed data — no PDF
    work/index.astro
    work/[...slug].astro
    blog/index.astro
    blog/[...slug].astro
    rss.xml.ts
  content.config.ts          # collections + Zod schemas (Astro 5 location)
  content/
    posts/*.mdx
    work/*.mdx
  layouts/
    BaseLayout.astro         # <head>, theme script, header, footer
    ProseLayout.astro        # shared by posts and work write-ups
  components/
  data/
    cv.ts                    # ported from techytimms/src/data/james.ts
    site.ts                  # name, url, socials — single source of truth
  lib/                       # pure functions; this is what unit tests target
  styles/
    global.css               # @import "tailwindcss" + @theme tokens
public/
astro.config.mjs
```

### What changes from the Next.js layout

| Next.js | Astro |
|---|---|
| `app/**/page.tsx` | `src/pages/**/*.astro` — file-based, but no `page.tsx` convention |
| `[slug]` | `[...slug]` for content collections (rest params handle nested paths) |
| `generateStaticParams()` | `getStaticPaths()` — same job, returns params *and* props together |
| `generateMetadata()` | Props passed to a layout; no separate metadata API |
| Velite / content-collections | **Built in.** `astro:content` with Zod schemas — no third-party content layer needed |
| `lib/metadata.ts` | Props on `BaseLayout.astro`, with defaults from `src/data/site.ts` |
| `next/image` | `astro:assets` — `<Image />` with build-time optimisation |
| `metadataBase` | `site` in `astro.config.mjs` — **same trap**: omit it and sitemap and RSS emit relative URLs |

### Collections with Zod

This is the part that should appeal. One file defines the shape, and the build enforces it:

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string().max(70),
    summary: z.string().max(160),   // feeds meta description, RSS, OG card
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(160),
    role: z.string(),
    stack: z.array(z.string()),
    outcome: z.string(),            // the sentence recruiters actually read
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { posts, work };
```

`getCollection("posts")` then returns fully typed entries, and the `max(160)` on `summary` means an over-long meta description is a build failure rather than a truncated Google result.

Apply the same discipline to the CV data: give `src/data/cv.ts` a Zod schema and parse it at module load. The current `james.ts` is typed but unvalidated — a Zod parse turns a typo in a date range into an error you see immediately.

> **Trap.** Derive slugs from filenames, not a frontmatter field. One source of truth means you cannot ship two posts claiming the same URL, and renaming a file is the whole rename.

---

## 4. Colour and typography

### The considerations that actually matter

1. **Contrast is a hard requirement, not a preference.** WCAG AA is 4.5:1 for body text, 3:1 for large text and UI boundaries. Check both themes — a palette that passes in light routinely fails in dark.
2. **Work in OKLCH.** The first number is perceived lightness, so two colours with the same L *look* equally light regardless of hue. Ramps become predictable arithmetic instead of guesswork, and you can change the whole site's accent by editing one hue angle.
3. **Bias the neutrals.** Pure grey reads as unconsidered. Nudge greys a few degrees toward your accent hue and the palette reads as designed — at low chroma (0.005–0.025) nobody consciously sees it, they just notice it looks intentional.
4. **Dark mode is not inversion.** Accent chroma must come *down* on a dark ground or saturated colours vibrate and glow. Expect to hand-tune the dark accent rather than flip a value.
5. **Spend saturation in one place.** One accent, used sparingly, reads as confident. Two compete. Semantic colours (success, warning, error) are a separate concern and do not count as your accent.
6. **Name tokens semantically.** `--color-ink-muted`, not `--color-slate-600`. A palette change should touch one file, and semantic names survive a hue change.
7. **Colour is never the only signal.** Anything conveyed by colour also needs shape, text, or position — links get underlines, not just a colour.

### Draft palette

Slate neutrals with a blue bias, one warm amber accent. Amber against cool slate is distinctive without being loud, and it avoids competing with the CRT-green identity of `terminal.techytimms.com`. Tweak freely — the two hue angles are the only numbers you need to touch.

```css
/* src/styles/global.css */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* neutrals — hue 250, chroma kept under 0.02 */
  --color-ground:       oklch(98.5% 0.004 250);
  --color-surface:      oklch(100%  0     0);
  --color-sunk:         oklch(96%   0.006 250);
  --color-border:       oklch(90%   0.010 250);
  --color-ink-faint:    oklch(62%   0.018 250);
  --color-ink-muted:    oklch(50%   0.022 250);
  --color-ink:          oklch(24%   0.026 250);

  /* accent — hue 70, amber */
  --color-accent:       oklch(58%   0.130 70);
  --color-accent-ink:   oklch(45%   0.110 70);  /* text-safe on light ground */
  --color-accent-sunk:  oklch(95%   0.030 70);  /* tinted callout background */
}

.dark {
  --color-ground:       oklch(17%   0.016 250);
  --color-surface:      oklch(21%   0.018 250);
  --color-sunk:         oklch(14%   0.014 250);
  --color-border:       oklch(30%   0.020 250);
  --color-ink-faint:    oklch(58%   0.020 250);
  --color-ink-muted:    oklch(72%   0.018 250);
  --color-ink:          oklch(93%   0.012 250);

  --color-accent:       oklch(78%   0.110 70);  /* lighter, less chroma */
  --color-accent-ink:   oklch(80%   0.105 70);
  --color-accent-sunk:  oklch(24%   0.035 70);
}
```

**Why two accent tokens.** Amber at full chroma does not reach 4.5:1 against white, so `--color-accent` is for marks, borders, focus rings and underlines, while `--color-accent-ink` is the darkened variant for anything that is actual text. This is the single most common way a nice-looking palette fails an audit.

**Alternates.** Change the hue angle on the three accent tokens and nothing else:

| Direction | Hue | Reads as |
|---|---|---|
| Amber *(drafted)* | 70 | Warm, editorial, distinctive |
| Teal | 190 | Technical, calm, closer to the terminal site |
| Violet | 290 | Modern, product-y; hardest to keep tasteful |

### Typography and spacing

Sensible defaults now, revisit once you pick a face.

- **Fonts:** Tailwind's default `font-sans` system stack for v1. It costs nothing, has zero layout shift, and looks native on every platform. Swap in a real face later — that is a one-token change.
- **Spacing:** use Tailwind's scale as shipped. It is a well-judged default and deviating early buys nothing.
- **Prose width:** cap running text around 65 characters. The single biggest readability lever.
- **Revisit after choosing a font:** line-height, heading tracking, and the vertical rhythm between headings and paragraphs are all font-specific. Do not tune them against the system stack and then change the font.

---

## 5. SEO, RSS, and social cards

Unchanged in substance from Rev A; the Astro implementations differ.

- **`site` in `astro.config.mjs` is mandatory.** Sitemap and RSS build absolute URLs from it. Omit it and both emit broken relative links, silently.
- **Metadata through the layout.** `BaseLayout.astro` takes `title`, `description`, `image` and `canonical` as props, with defaults pulled from `src/data/site.ts`. No separate metadata API to learn.
- **Sitemap:** the `@astrojs/sitemap` integration, generated at build from the routes that exist.
- **RSS:** `@astrojs/rss` in `src/pages/rss.xml.ts`, mapping `getCollection("posts")` to items. Add `<link rel="alternate" type="application/rss+xml">` to the head so readers autodiscover it.
- **OG images:** either a generated endpoint (`astro-og-canvas` or a Satori-based route) or a single well-made static fallback. The static fallback is a perfectly respectable v1 — generated cards are a nice-to-have.
- **Structured data:** a `BlogPosting` JSON-LD block per post, and a `Person` block on the CV page. Cheap, and it is what search results read.
- **Verify by pasting** a post URL into Slack and iMessage before calling it done. Card previews fail in ways nothing else surfaces.

---

## 6. Todo

**Setup** — done
- [x] Astro 7.3.3 scaffolded manually (create-astro was not used, to avoid touching `assets/`)
- [x] `@astrojs/mdx`, `@astrojs/sitemap`, Tailwind v4 via `@tailwindcss/vite`
- [x] `tsconfig.json` extends `astro/tsconfigs/strictest`, with a `~/*` path alias
- [x] `site: "https://techytimms.com"` set in `astro.config.mjs`
- [x] `.nvmrc` pinned to 24.19.0; `engines.node >= 22.12.0`
- [x] `.gitignore` excludes `assets/` and `*.pdf`
- [x] Vitest configured and running

**Foundations** — done
- [x] Design tokens in `src/styles/global.css` — slate/amber palette, both themes
- [x] `BaseLayout.astro` with metadata props, skip link, header, footer
- [x] Blocking `is:inline` theme script in `<head>`; `ThemeToggle.astro`
- [x] `reduced-motion` and `:focus-visible` handled in base styles

**Content model** — done
- [x] `src/content.config.ts` — `posts` and `work` collections with Zod schemas
- [x] `james.ts` ported to `src/data/cv.ts`, parsed through `src/lib/cv-schema.ts`
- [x] `src/data/site.ts` with placeholders for the unconfirmed fields
- [x] `src/lib/content.ts` — draft exclusion, sorting, date formatting
- [x] 10 unit tests across content helpers and the CV schema

**Pages** — placeholder versions live
- [x] `/`, `/about`, `/cv`, `/blog`, `/blog/[...slug]`, `/work`, `/work/[...slug]`
- [x] `ProseLayout.astro` shared by posts and work write-ups
- [ ] Replace the home-page pitch placeholder with real copy
- [ ] Verify no theme flash on hard refresh in both OS settings
- [ ] Deploy and point the apex domain at it

**Still to do**
- [ ] Decide the code-block highlighter (separate session), then wire it up
- [ ] RSS at `/rss.xml` via `@astrojs/rss`
- [ ] JSON-LD (`BlogPosting` per post, `Person` on `/cv`)
- [ ] OG images — static fallback is fine for v1
- [ ] Real favicon (there is a placeholder SVG)
- [ ] Prettier + ESLint carried over from `techytimms`
- [ ] Analytics, once hosting is decided

**Content** *(blocking — see section 8)*
- [ ] Write the one-line pitch
- [ ] Fill in the two work write-ups (both are stubs; EatPing is `draft: true`)
- [ ] Decide the contact route
- [ ] First blog post (the current one is a `draft: true` placeholder)

---

## 7. Conventions and constraints

**Not doing i18n.** English-speaking audience only. Decided now so it is never half-implemented.

**Comments.** Only where the code is not self-documenting — a non-obvious workaround, a business rule, a "why" that the code cannot express. No comments restating what the line below does.

**Naming.** Variables should convey their core use without being either abbreviated or padded. `publishedPosts`, not `pp` and not `postsFilteredByPublishedStatus`. If a name needs a comment to be understood, the name is wrong.

**Testing.** Vitest, with a deliberately small suite on the things that would actually hurt if they broke:

- Collection filtering and sorting (draft exclusion, date ordering) — a bug here silently publishes a draft
- The CV Zod schema — it should reject malformed data, so test that it does
- Date and slug formatting helpers
- Any interactive island, if one appears

Note that `.astro` components are awkward to unit test — Astro's Container API exists but is a rougher edge than the rest of the framework. Keep logic in `src/lib/` as pure functions and test those. The components stay thin enough not to need coverage.

**Not doing, and why:**

| Deferred | Revisit when |
|---|---|
| CSS Modules / hand-written CSS | A real use case Tailwind cannot express |
| i18n | Never — decided |
| A headless CMS | Only if you stop enjoying git |
| Newsletter capture | After the third post |
| Comments | Moderation is the real cost |
| E2E tests | If a release breaks something twice |
| Interactive MDX components | When a specific post needs one to make its point |

---

## 8. Content — what exists and what is missing

### Already available in `techytimms/src/data/james.ts`

| Content | Status |
|---|---|
| About paragraphs | ✅ Three, good voice — usable close to as-is |
| Skills, three tiers (Core / Strong / Working) | ✅ ~50 entries |
| Work experience | ✅ 11 roles, 2013 → present, with detailed bullets |
| Education | ✅ BSc Computer Science, Aberystwyth |
| Certifications | ✅ CKAD, YC Startup School, AWS CP, GCP ACE |
| Achievements | ✅ Three, and they are genuinely distinctive |
| GitHub handle | ✅ `JamesTimms` |
| Domain | ✅ `techytimms.com` |

### Missing — needed before launch

1. **A one-line pitch.** The single most important sentence on the site and the one thing the CV data does not contain. The about paragraphs are personality; this is positioning. Something in the register of *"Technical lead and founder. I build the whole stack — product, backend, infra — for early-stage companies."* Needs to be yours, and specific enough that it could not sit on someone else's site.

2. **Three projects, with outcomes.** There is no projects data anywhere in `techytimms` — the terminal is itself a project, but it is not described as one. For each, one line on the problem and one on the outcome. Candidates from the CV:
   - **The terminal** (`terminal.techytimms.com`) — Win95 CRT interface, React + TanStack Router, open source
   - **EatPing** — contractor low-code project → full startup stack, 8000 meals/week, $2.6m ARR
   - **Mappa** — CTO and co-founder, 1000+ users, Geovation accelerator
   - **RaavaVPN / Fire Ferrets** — 500+ customers, built and run solo
   - Plus whatever you are authoring next, since you mentioned several are coming

3. **Contact route.** Not in the data. An email you will check, a form, or LinkedIn. Recruiters need one obvious path. *(I have your personal address from the session context but have deliberately not assumed you want it published — tell me which address, or a form.)*

4. **Social links.** Only GitHub is discoverable. LinkedIn almost certainly belongs here given the recruiter audience. Anything else?

5. **Photo, or a decision not to have one.** `techytimms/public/` has desk photos but no portrait.

6. **Apex vs. subdomain.** `terminal.techytimms.com` is taken. Confirm the new site is the apex `techytimms.com`, and decide whether the apex links prominently to the terminal — it is a strong showcase piece and currently has no front door.

7. **First post idea.** Something you debugged or decided recently beats something ambitious. The AI meal-substitution work, the low-code migration, or the FastAPI → GCP move all have a real post in them.

Placeholders are fine for all of the above while building. The two that genuinely block a launch are the pitch and the contact route.

> **The failure mode.** Personal sites overwhelmingly die with a beautiful theme toggle and no content. The design system is the fun part and it is infinitely extensible, which is exactly why it will absorb every evening you give it. Get the pitch, the CV page, and a contact link live on the apex domain before you let yourself touch a custom cursor.
