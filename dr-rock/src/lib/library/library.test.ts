import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LIBRARY, getEntry, searchLibrary, specimenOfTheDay } from "./index";
import { PERIODS } from "./timescale";
import { LIBRARY_CATEGORIES } from "./types";

describe("Rock Library data", () => {
  it("has unique ids and valid related links", () => {
    const ids = LIBRARY.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of LIBRARY) for (const r of e.related ?? []) expect(getEntry(r), `${e.id} → ${r}`).toBeDefined();
  });

  it("covers every category with complete entries", () => {
    for (const c of LIBRARY_CATEGORIES) expect(LIBRARY.some((e) => e.category === c)).toBe(true);
    for (const e of LIBRARY) {
      expect(e.facts.length, e.id).toBeGreaterThanOrEqual(3);
      expect(e.description.length, e.id).toBeGreaterThan(60);
      expect(e.formation.length, e.id).toBeGreaterThan(40);
      expect(e.age.length, e.id).toBeGreaterThan(5);
    }
  });

  it("has a pre-rendered illustration for every entry", () => {
    for (const e of LIBRARY) expect(existsSync(path.join(process.cwd(), "public", "library", `${e.id}.svg`)), e.id).toBe(true);
  });

  it("uses a contiguous geological time scale", () => {
    for (let i = 1; i < PERIODS.length; i++) expect(PERIODS[i].start).toBe(PERIODS[i - 1].end);
    expect(PERIODS.at(-1)!.end).toBe(0);
  });
});

describe("searchLibrary", () => {
  it("ranks name matches first and filters by category", () => {
    expect(searchLibrary("granite")[0].id).toBe("granite");
    expect(searchLibrary("volcanic", "igneous").every((e) => e.category === "igneous")).toBe(true);
    expect(searchLibrary("zzzz-no-match")).toHaveLength(0);
  });
  it("is accent-insensitive", () => {
    expect(searchLibrary("Mesózoic").some((e) => e.id === "mesozoic")).toBe(true);
  });
});

describe("specimenOfTheDay", () => {
  it("is deterministic and never a time unit", () => {
    const d = new Date("2026-11-17T12:00:00Z");
    expect(specimenOfTheDay(d).id).toBe(specimenOfTheDay(d).id);
    expect(["period", "era"]).not.toContain(specimenOfTheDay(d).category);
  });
});
