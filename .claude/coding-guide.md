# Coding guide

How code is written in this repo. Read before writing any.

## Structure

**`.astro` is the data layer. `.tsx` is the UI layer. `src/lib/` is shared logic.**

- `.astro` — pages, layouts, and thin wrappers. Owns data access (`getCollection`, `Astro.url`), Astro directives (`transition:*`, `is:inline`, `client:*`), `<head>`, and inline scripts. A component-level `.astro` file is a wrapper, not a component.
- `.tsx` — the component library, in `src/components/ui/`. Grouped, composable components with CVA variants. Renders to static HTML.
- `src/lib/` — logic used in **more than one place**, with tests.

Directives do not exist in `.tsx`, and they silently do nothing on a component tag. Anything carrying one needs an `.astro` element to own it. That is the only reason the wrappers exist.

**No `client:*` unless interaction genuinely requires it.** React's renderer is currently loaded by zero pages. The first directive changes that for every page containing that component — a bundle decision, not a component one.

## Locality

**Code lives as close to its use as possible.** Declare a function where it is used; extract it only once a second caller exists. A helper used by one component belongs in that component's file, not in `src/lib/`.

Within a file, a style definition or helper sits **immediately above the component that uses it**. Only things used by several components in the file go at the top.

Tests sit beside the file under test: `Bar.test.ts` next to `Bar.tsx`. No `__tests__/` directories.

## Composition

**Compose React components through `children` at the call site.**

```tsx
<DesktopSection rows={n}>
  {items.map((item) => <DesktopShortcut {...item} />)}
</DesktopSection>
```

Not `<DesktopGroup items={items} />`. The container knows about layout; the data stays where the caller already has it. Never introduce a data-prop wrapper to shorten a call site.

In `.astro`, named `<slot>`s serve the same purpose and can be forwarded into a framework component with `<Fragment slot="x">`.

## Props

Minimise the number and complexity of props. Derive what can be derived — a prop that restates what another prop already implies should not exist. More props with sensible defaults is fine; redundant props are not.

Variants should describe **purpose**, not appearance (`purpose="dock"`, not `step={900}`), and should couple their colour with whatever else distinguishes that role.

## Naming

One plain word where one will do, and a name you can say aloud in conversation. No `chrome`, no `manager`, no `helper`. Names carry their use without abbreviation or padding: `publishedPosts`, not `pp`, not `postsFilteredByPublishedStatus`.

`key` is not a prop in `.astro` — there is no reconciliation, so it fails type checking. It is meaningful only in `.tsx`.

## Comments

**Default to none.** If the code can be self-documenting — better names, a smaller function — do that instead.

Comment only for an unintuitive or overly complex implementation, and then keep it **extremely brief, even at the cost of accuracy**. One line beats three. A comment restating the code is worse than none.

## Styling

Tailwind first. Raw CSS only for what utilities cannot express — custom-property plumbing, `:has()`, pseudo-elements.

`.tsx` has no scoped `<style>`. Moving a component from `.astro` to `.tsx` means relocating its styles to utilities or `global.css`; scoped styles do not travel.

Colour comes from semantic tokens, never raw palette values. Contrast is carried by lightness; chroma is essentially free.

## Verification

```bash
pnpm build              # astro check && astro build
pnpm test
pnpm check:invariants   # after build
pnpm contrast
```

`check:invariants` and `contrast` exist because two classes of bug fail at **runtime**, not build: a renamed selector breaks a delegated handler silently, and an undefined `--color-*` token is valid CSS that resolves to nothing. Use them instead of hand-rolled greps or a one-off colour converter.

## Accessibility

Not optional, and computed rather than asserted.

- WCAG AA in **both** themes: 4.5:1 text, 3:1 large text and UI boundaries.
- A control that does something is a `<button>` with an accessible name. Decorative chrome is `aria-hidden`.
- Hiding something uses `hidden`, not offscreen positioning, so it leaves the accessibility tree.
- Moving or hiding a focused element drops focus to `<body>` — move focus deliberately.
- Honour `prefers-reduced-motion` from the first animation written.
