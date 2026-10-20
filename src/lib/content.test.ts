import { describe, expect, it } from "vitest";
import {
  byExplicitOrder,
  excludeDrafts,
  featuredFirst,
  newestFirst,
  toIsoDate,
} from "~/lib/content";

const post = (draft: boolean, publishedAt: string) => ({
  data: { draft, publishedAt: new Date(publishedAt) },
});

const project = (featured: boolean, order: number) => ({
  data: { featured, order },
});

describe("excludeDrafts", () => {
  it("drops drafts in production", () => {
    const entries = [post(false, "2026-01-01"), post(true, "2026-01-02")];
    expect(excludeDrafts(entries, true)).toHaveLength(1);
  });

  it("keeps drafts outside production so they can be previewed", () => {
    const entries = [post(false, "2026-01-01"), post(true, "2026-01-02")];
    expect(excludeDrafts(entries, false)).toHaveLength(2);
  });
});

describe("newestFirst", () => {
  it("sorts most recent first", () => {
    const sorted = newestFirst([post(false, "2026-01-01"), post(false, "2026-06-01")]);
    expect(toIsoDate(sorted[0]!.data.publishedAt)).toBe("2026-06-01");
  });

  it("does not mutate the input", () => {
    const entries = [post(false, "2026-01-01"), post(false, "2026-06-01")];
    newestFirst(entries);
    expect(toIsoDate(entries[0]!.data.publishedAt)).toBe("2026-01-01");
  });
});

describe("featuredFirst", () => {
  it("puts featured entries ahead, then respects order", () => {
    const sorted = featuredFirst([
      project(false, 0),
      project(true, 2),
      project(true, 1),
    ]);
    expect(sorted.map((entry) => entry.data.order)).toEqual([1, 2, 0]);
  });
});

describe("byExplicitOrder", () => {
  it("sorts ascending by order", () => {
    const sorted = byExplicitOrder([project(false, 3), project(false, 1)]);
    expect(sorted.map((entry) => entry.data.order)).toEqual([1, 3]);
  });
});
