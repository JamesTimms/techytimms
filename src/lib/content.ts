type Draftable = { data: { draft: boolean } };
type Dated = { data: { publishedAt: Date } };
type Ordered = { data: { order: number; featured: boolean } };

export function excludeDrafts<T extends Draftable>(
  entries: T[],
  isProduction = import.meta.env.PROD,
): T[] {
  // Drafts are visible while developing so they can be previewed, and dropped
  // from production builds so they cannot leak.
  return isProduction ? entries.filter((entry) => !entry.data.draft) : entries;
}

export function newestFirst<T extends Dated>(entries: T[]): T[] {
  return [...entries].sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );
}

export function byExplicitOrder<T extends Ordered>(entries: T[]): T[] {
  return [...entries].sort((a, b) => a.data.order - b.data.order);
}

export function featuredFirst<T extends Ordered>(entries: T[]): T[] {
  return byExplicitOrder(entries).sort(
    (a, b) => Number(b.data.featured) - Number(a.data.featured),
  );
}

export function formatDate(date: Date, locale = "en-GB"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function toIsoDate(date: Date): string {
  return date.toISOString().split("T")[0] ?? "";
}
