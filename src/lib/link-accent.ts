const UNDERLINE_SLOTS = 5;

/*
 * Links carry one of five autumnal underline hues. The slot is derived from the
 * destination so a given link is the same colour on every page and across
 * rebuilds — random assignment would flicker between builds, and positional
 * assignment would change whenever content is reordered.
 */
export function underlineSlot(href: string): number {
  let hash = 2166136261;
  for (let index = 0; index < href.length; index++) {
    hash ^= href.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (Math.abs(hash) % UNDERLINE_SLOTS) + 1;
}

export function linkClass(href: string): string {
  return `link link-${underlineSlot(href)}`;
}
