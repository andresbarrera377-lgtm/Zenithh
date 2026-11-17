import { MARINE_FOSSILS, TERRESTRIAL_FOSSILS } from "./data/fossils";
import { MINERALS } from "./data/minerals";
import { IGNEOUS, METAMORPHIC, SEDIMENTARY } from "./data/rocks";
import { ERA_ENTRIES, PERIOD_ENTRIES } from "./data/time";
import { LIBRARY_CATEGORIES, type LibraryCategory, type LibraryEntry } from "./types";

export const LIBRARY: LibraryEntry[] = [
  ...IGNEOUS,
  ...SEDIMENTARY,
  ...METAMORPHIC,
  ...MARINE_FOSSILS,
  ...TERRESTRIAL_FOSSILS,
  ...MINERALS,
  ...PERIOD_ENTRIES,
  ...ERA_ENTRIES,
];

const BY_ID = new Map(LIBRARY.map((e) => [e.id, e]));

export function getEntry(id: string): LibraryEntry | undefined {
  return BY_ID.get(id);
}

export function getRelated(entry: LibraryEntry): LibraryEntry[] {
  return (entry.related ?? []).map((id) => BY_ID.get(id)).filter((e): e is LibraryEntry => Boolean(e));
}

export function countByCategory(): Record<LibraryCategory, number> {
  return Object.fromEntries(
    LIBRARY_CATEGORIES.map((c) => [c, LIBRARY.filter((e) => e.category === c).length]),
  ) as Record<LibraryCategory, number>;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Simple ranked search: name matches score highest, then alternative names and tags,
 * then summary/description. All query words must match somewhere.
 */
export function searchLibrary(query: string, category: LibraryCategory | "all" = "all"): LibraryEntry[] {
  const pool = category === "all" ? LIBRARY : LIBRARY.filter((e) => e.category === category);
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return pool;

  const scored: Array<{ entry: LibraryEntry; score: number }> = [];
  for (const entry of pool) {
    const name = normalize(entry.name);
    const aka = normalize(entry.aka ?? "");
    const tags = normalize(entry.tags.join(" "));
    const body = normalize(`${entry.summary} ${entry.description} ${entry.formation}`);
    let score = 0;
    let all = true;
    for (const w of words) {
      if (name.startsWith(w)) score += 12;
      else if (name.includes(w)) score += 8;
      else if (aka.includes(w) || tags.includes(w)) score += 5;
      else if (body.includes(w)) score += 1;
      else {
        all = false;
        break;
      }
    }
    if (all) scored.push({ entry, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.entry);
}

/** Deterministic "specimen of the day" based on the calendar date (UTC). */
export function specimenOfTheDay(date: Date): LibraryEntry {
  const pool = LIBRARY.filter((e) => e.category !== "period" && e.category !== "era");
  const dayNumber = Math.floor(date.getTime() / 86_400_000);
  return pool[dayNumber % pool.length];
}
