import type { Locale } from "../i18n/config";
import { MARINE_FOSSILS, TERRESTRIAL_FOSSILS } from "./data/fossils";
import { MINERALS } from "./data/minerals";
import { IGNEOUS, METAMORPHIC, SEDIMENTARY } from "./data/rocks";
import { ERA_ENTRIES, PERIOD_ENTRIES } from "./data/time";
import { FOSSILS_ES } from "./data/es/fossils";
import { MINERALS_ES } from "./data/es/minerals";
import { ROCKS_A_ES } from "./data/es/rocks-a";
import { ROCKS_B_ES } from "./data/es/rocks-b";
import { TIME_ES } from "./data/es/time";
import { LIBRARY_CATEGORIES, type EntryText, type LibraryCategory, type LibraryEntry } from "./types";

/** The library in English, the language the data files are written in. */
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

/** Spanish text for every entry, keyed by id (completeness is checked in library.test.ts). */
export const LIBRARY_TEXT_ES: Record<string, EntryText> = {
  ...ROCKS_A_ES,
  ...ROCKS_B_ES,
  ...FOSSILS_ES,
  ...MINERALS_ES,
  ...TIME_ES,
};

const LIBRARY_ES: LibraryEntry[] = LIBRARY.map((e) => {
  const es = LIBRARY_TEXT_ES[e.id];
  return es ? { ...e, ...es, aka: es.aka ?? e.aka } : e;
});

const BY_LOCALE: Record<Locale, { list: LibraryEntry[]; byId: Map<string, LibraryEntry> }> = {
  en: { list: LIBRARY, byId: new Map(LIBRARY.map((e) => [e.id, e])) },
  es: { list: LIBRARY_ES, byId: new Map(LIBRARY_ES.map((e) => [e.id, e])) },
};

/** English entries by id: used so Spanish searches also match English names and tags. */
const EN_BY_ID = BY_LOCALE.en.byId;

export function getLibrary(lang: Locale = "en"): LibraryEntry[] {
  return BY_LOCALE[lang].list;
}

export function getEntry(id: string, lang: Locale = "en"): LibraryEntry | undefined {
  return BY_LOCALE[lang].byId.get(id);
}

export function getRelated(entry: LibraryEntry, lang: Locale = "en"): LibraryEntry[] {
  const byId = BY_LOCALE[lang].byId;
  return (entry.related ?? []).map((id) => byId.get(id)).filter((e): e is LibraryEntry => Boolean(e));
}

/** Public path of an entry's pre-rendered illustration. Time units have a Spanish variant (labels). */
export function libraryImage(entry: Pick<LibraryEntry, "id" | "art">, lang: Locale = "en"): string {
  return lang === "es" && entry.art.kind === "time" ? `/library/${entry.id}.es.svg` : `/library/${entry.id}.svg`;
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
 * then summary/description. All query words must match somewhere. Spanish searches also
 * match the English name and tags, so "granite" still finds "Granito".
 */
export function searchLibrary(query: string, category: LibraryCategory | "all" = "all", lang: Locale = "en"): LibraryEntry[] {
  const all = getLibrary(lang);
  const pool = category === "all" ? all : all.filter((e) => e.category === category);
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return pool;

  const scored: Array<{ entry: LibraryEntry; score: number }> = [];
  for (const entry of pool) {
    const en = lang === "en" ? undefined : EN_BY_ID.get(entry.id);
    const name = normalize(entry.name);
    const enName = normalize(en?.name ?? "");
    const aka = normalize(`${entry.aka ?? ""} ${en?.aka ?? ""}`);
    const tags = normalize(`${entry.tags.join(" ")} ${en?.tags.join(" ") ?? ""}`);
    const body = normalize(`${entry.summary} ${entry.description} ${entry.formation}`);
    let score = 0;
    let matched = true;
    for (const w of words) {
      if (name.startsWith(w)) score += 12;
      else if (name.includes(w)) score += 8;
      else if (enName.startsWith(w)) score += 10;
      else if (enName.includes(w)) score += 6;
      else if (aka.includes(w) || tags.includes(w)) score += 5;
      else if (body.includes(w)) score += 1;
      else {
        matched = false;
        break;
      }
    }
    if (matched) scored.push({ entry, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.entry);
}

/** Deterministic "specimen of the day" based on the calendar date (UTC). */
export function specimenOfTheDay(date: Date, lang: Locale = "en"): LibraryEntry {
  const pool = getLibrary(lang).filter((e) => e.category !== "period" && e.category !== "era");
  const dayNumber = Math.floor(date.getTime() / 86_400_000);
  return pool[dayNumber % pool.length];
}
