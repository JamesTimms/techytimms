# techytimms.com

Personal site for James Timms — portfolio, CV and writing. Built with Astro,
TypeScript, Tailwind v4 and MDX.

Content pages ship zero client-side JavaScript.

## Requirements

Node **>= 22.12.0**. The version is pinned in `.nvmrc`:

```bash
nvm use
```

## Commands

```bash
pnpm install
pnpm dev        # dev server at http://localhost:4321
pnpm build      # astro check && astro build
pnpm preview    # serve the production build from dist/
pnpm test       # vitest
pnpm check      # type check only
```

## Layout

```
src/
  pages/            routes — index, about, cv, blog/, work/
  layouts/          BaseLayout (head, theme, nav) and ProseLayout
  components/
  content/          MDX: posts/ and work/
  content.config.ts collection schemas (Zod)
  data/             cv.ts (ported CV data), site.ts (name, url, socials)
  lib/              pure helpers — this is what the tests target
  styles/global.css Tailwind import and design tokens
docs/               the build plan
assets/             reference only — gitignored, never published
```

## How things work

**Content** lives as MDX in `src/content/`. Frontmatter is validated by Zod
schemas in `src/content.config.ts` at build time, so a malformed date or an
over-long `summary` fails `pnpm build` rather than reaching a page. Slugs come
from filenames.

**Drafts** (`draft: true`) are visible in `pnpm dev` and excluded from
production builds.

**Theme** is set by a blocking inline script in `<head>` (`BaseLayout.astro`),
which reads `localStorage` and falls back to `prefers-color-scheme` before
first paint. It must stay `is:inline` or the theme will flash.

**Colours** are semantic tokens in `src/styles/global.css` — slate neutrals
(hue 250) with an amber accent (hue 70), defined in OKLCH. Retune the palette
by changing the hue angles. Note the two accent tokens: `--color-accent` for
marks and borders, `--color-accent-ink` for text, because amber at full chroma
does not meet 4.5:1 on a light ground.

## Gotchas

- `astro check` does not work with TypeScript 7 — `typescript` is pinned to
  `^6`. See [withastro/roadmap#1321](https://github.com/withastro/roadmap/discussions/1321).
- Zod comes from `astro/zod` (Zod 4), not `astro:content`. Use `z.url()`.
- Do not annotate `getStaticPaths` with the `GetStaticPaths` type — it erases
  props inference. Declare an explicit `Props` interface instead.
- MDX rejects HTML comments. Use `{/* ... */}`.
- `assets/` holds the CV PDF for reference. It is gitignored and must not be
  published; the CV is rendered from `src/data/cv.ts` instead.

## Status

Scaffolded with placeholders. See `docs/personal-site-blueprint.md` for the
plan and the outstanding todo list.
