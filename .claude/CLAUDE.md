# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`techytimms.com` — personal site for James Timms (portfolio, CV, writing). Astro 7 + TypeScript + Tailwind v4 + MDX, statically built. Content pages ship zero client-side JavaScript; keep it that way unless a page genuinely needs an island.

`README.md` is the human-facing overview. `docs/personal-site-blueprint.md` is the build plan and the source of truth for scope, conventions and the outstanding todo list — read it before starting substantial work. `docs/design-blueprint.md` is scratch material, not a specification.

## Commands

Package manager is **pnpm**. Node **>= 22.12.0** is required and pinned in `.nvmrc`.

```bash
nvm use                    # the default shell Node is older and Astro will refuse to run
pnpm dev                   # dev server at http://localhost:4321
pnpm build                 # astro check && astro build
pnpm preview               # serve dist/
pnpm check                 # astro check (type check only, no build)
pnpm test                  # vitest run
pnpm test:watch
pnpm test src/lib/__tests__/content.test.ts   # a single file
pnpm test -t "drops drafts in production"      # a single test by name
```

Prettier is configured (`.prettierrc.mjs`) but is not wired into a script and has never been run repo-wide — quote style is inconsistent across files. Match the file you are editing; do not mass-reformat.

## Architecture

**Content is files, not a CMS.** MDX under `src/content/posts/` and `src/content/work/`, loaded by glob loaders in `src/content.config.ts`. Slugs come from filenames. Frontmatter is validated by Zod at build time, so a malformed date or an over-long `summary` fails `pnpm build` rather than reaching a page. The `summary` cap of 160 chars is deliberate — it feeds the meta description, RSS and social cards.

**`.astro` is the data layer, `.tsx` is the UI layer.** `.astro` owns data access (`getCollection`, `Astro.url`), Astro directives (`transition:*`, `is:inline`, `client:*`) and `<head>`; a component-level `.astro` file should be a thin wrapper, not a component. `.tsx` holds the grouped, composable component library with CVA variants, rendered to static HTML — **no `client:*` unless interaction genuinely requires it**, because the first one loads React's renderer on every page containing that component. Directives do not exist in `.tsx` and silently do nothing on a component tag, which is what the wrappers are for.

**Logic lives in `src/lib/`, not in components.** `.astro` files are awkward to unit test, so filtering, sorting and formatting are pure functions in `src/lib/content.ts` and the page templates stay thin. Tests target `src/lib/` only. New page logic belongs in a lib function with a test, not inline in the template.

**Draft handling is a correctness concern.** `excludeDrafts()` passes drafts through in dev and filters them in production (`import.meta.env.PROD`). A bug here silently publishes unfinished work, which is why it is tested. It takes the production flag as an injectable argument so tests can drive both branches.

**The CV is data, not a document.** `src/data/cv.ts` holds the content, validated against `src/lib/cv-schema.ts` (Zod) at import time; `src/pages/cv.astro` renders it. The source PDF in `assets/` is reference only — it is gitignored and must never be published.

**`src/data/site.ts`** is the single source for name, URL, tagline, description and socials. Several fields are still `PLACEHOLDER` and marked as such; confirm with the user before treating them as real. `astro.config.mjs` `site` is what sitemap and RSS build absolute URLs from.

**Theme** is applied by a blocking `is:inline` script in `<head>` (`src/layouts/BaseLayout.astro`) reading `localStorage` then `prefers-color-scheme`. It must stay inline and in `<head>` — bundling it runs it after first paint and the theme flashes.

**Colour** is semantic OKLCH tokens in `src/styles/global.css`: slate neutrals at hue 250, amber accent at hue 70. Retune by changing the hue angles, not individual values. Use the tokens (`ink`, `ink-muted`, `ink-faint`, `ground`, `surface`, `sunk`, `border`, `accent`, `accent-ink`) rather than raw Tailwind palette colours. `--color-accent` is for marks, borders and rings; `--color-accent-ink` is the darkened variant for text, because amber at full chroma does not reach 4.5:1 on a light ground.

## Gotchas

- `astro check` does not work under TypeScript 7 — `typescript` is pinned to `^6`. See [withastro/roadmap#1321](https://github.com/withastro/roadmap/discussions/1321).
- Import Zod from `astro/zod` (Zod 4), not from `astro:content`. Use `z.url()`, not `z.string().url()`.
- Do not annotate `getStaticPaths` with the `GetStaticPaths` type — it erases props inference. Declare an explicit `Props` interface instead.
- MDX rejects HTML comments. Use `{/* ... */}`.
- `tsconfig.json` sets `paths` with no `baseUrl` (deprecated in TS 6, removed in 7), so alias targets are written relative to the config file: `"~/*": ["./src/*"]`. Vitest resolves `~` separately in `vitest.config.ts` — changing one alias means changing both.

## Conventions

**Read `.claude/coding-guide.md` before writing code.** It is the full statement of how code is written here; what follows is the short form.

- **Documents and reports are extremely concise, even at the cost of accuracy.** State conclusions, not reasoning. No "considered but rejected", no restating the brief, no narration. Tables over prose. A design note is a reference, not a transcript.
- **One element at a time.** Iterate on a single component per task rather than making sweeping changes across the site.
- **No i18n.** Decided and closed; do not add scaffolding for it.
- **Default to no comment.** If the code can be self-documenting — better names, a smaller function — do that instead. Comment only for an unintuitive or overly complex implementation, and then keep it **extremely brief, even at the cost of accuracy**. One line beats three; a comment restating the code is worse than none.
- **Compose React components with the children pattern.** Container components take `children`; the call site does the mapping:
  ```tsx
  <DesktopSection rows={n}>
    {items.map((item) => <DesktopShortcut {...item} />)}
  </DesktopSection>
  ```
  Not a wrapper that takes the data and maps internally (`<DesktopGroup items={items} />`). This avoids prop drilling and global state, and keeps the composition readable in one file. Do not introduce a data-prop wrapper to shorten a call site.
- **`key` is not a prop in `.astro` templates.** Astro has no reconciliation, so `key` is passed through as an unknown prop and fails type checking. Omit it when mapping inside `.astro` files; it is only meaningful inside `.tsx`.
- **Names carry their use without abbreviation or padding**: `publishedPosts`, not `pp`, not `postsFilteredByPublishedStatus`. A name needing a comment is the wrong name.
- **Tests stay deliberately small** — draft exclusion, ordering, the CV schema rejecting bad data, date and slug formatting. Do not add coverage for thin templates.
- Deferred by decision, do not introduce unasked: hand-written CSS, a headless CMS, newsletter capture, comments, E2E tests, interactive MDX components.

## Status

Working desktop-metaphor UI: framed window, icon dock, status bar, desktop shortcuts,
client-side routing, draggable/resizable windows. Build passes, 92 tests, ~9.1 KB gz JS.

`.claude/handover.md` is the current-state summary — read it first. `docs/personal-site-blueprint.md`
§6 tracks the todo list and §9 what is out of scope; `docs/design-blueprint.md` holds the
numbered design decisions. The two items blocking a launch are the home-page pitch and a
contact route.

**Nothing has been verified in a browser.** Contrast is computed and markup asserted;
appearance is not.

## Notes from James

<!-- Add project-specific instructions here. Anything below is read by every Claude Code session in this repo. -->
