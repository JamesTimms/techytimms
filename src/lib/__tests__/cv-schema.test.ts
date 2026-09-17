import { describe, expect, it } from "vitest";
import { certificationSchema, skillGroupSchema, workExperienceSchema } from "~/lib/cv-schema";

describe("workExperienceSchema", () => {
  it("rejects a role with no description bullets", () => {
    const result = workExperienceSchema.safeParse({
      company: "EatPing",
      role: "Technical Lead",
      period: "April 2025 - Current",
      location: "London (hybrid), UK",
      description: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("certificationSchema", () => {
  it("rejects a year that is not four digits", () => {
    expect(certificationSchema.safeParse({ name: "CKAD", year: "22" }).success).toBe(false);
  });

  it("accepts a four-digit year", () => {
    expect(certificationSchema.safeParse({ name: "CKAD", year: "2022" }).success).toBe(true);
  });
});

describe("skillGroupSchema", () => {
  it("rejects an unknown category", () => {
    const result = skillGroupSchema.safeParse({ category: "Expert", skills: ["React"] });
    expect(result.success).toBe(false);
  });
});
