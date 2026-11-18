/** Joins class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

type Lang = "es" | "en";
const INTL: Record<Lang, string> = { es: "es-ES", en: "en-GB" };

const dateFormatters = new Map<string, Intl.DateTimeFormat>();
function formatter(lang: Lang, withTime: boolean): Intl.DateTimeFormat {
  const key = `${lang}:${withTime}`;
  let f = dateFormatters.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(INTL[lang], {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    });
    dateFormatters.set(key, f);
  }
  return f;
}

export function formatDate(iso: string, lang: Lang = "en"): string {
  return formatter(lang, false).format(new Date(iso));
}

export function formatDateTime(iso: string, lang: Lang = "en"): string {
  return formatter(lang, true).format(new Date(iso));
}

const MA_WORDS: Record<Lang, { present: string; years: string; thousand: string }> = {
  es: { present: "actualidad", years: "años", thousand: "mil años" },
  en: { present: "present", years: "years", thousand: "thousand years" },
};

function num(value: number, lang: Lang): string {
  return value.toLocaleString(lang === "es" ? "es-ES" : "en", { useGrouping: true });
}

/** Formats millions of years: 0 → "present", 0.005 → "5,000 years", 0.3 → "300 thousand years", 4.5 → "4.5 Ma", 1200 → "1,200 Ma". */
export function formatMa(value: number, lang: Lang = "en"): string {
  const w = MA_WORDS[lang];
  if (value <= 0) return w.present;
  if (value < 0.01) return `${num(Math.round(value * 1_000_000), lang)} ${w.years}`;
  if (value < 1) return `${num(Math.round(value * 1000), lang)} ${w.thousand}`;
  if (value < 10) return `${num(Number(value.toFixed(1)), lang)} Ma`;
  return `${num(Math.round(value), lang)} Ma`;
}

export function formatMaRange(min: number | null, max: number | null, lang: Lang = "en"): string | null {
  if (min == null && max == null) return null;
  if (min != null && max != null) {
    if (Math.abs(max - min) < 1e-9) return `≈ ${formatMa(min, lang)}`;
    const younger = Math.min(min, max);
    const older = Math.max(min, max);
    // Geological convention: oldest first, e.g. "485 – 299 Ma" or "525 Ma – present".
    if (younger >= 10) return `${num(Math.round(older), lang)} – ${num(Math.round(younger), lang)} Ma`;
    return `${formatMa(older, lang)} – ${formatMa(younger, lang)}`;
  }
  const only = (min ?? max) as number;
  return `≈ ${formatMa(only, lang)}`;
}

/** Small deterministic PRNG (mulberry32) so procedural art is identical on server and client. */
export function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
