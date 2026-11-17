/** Joins class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

/** Formats millions of years: 0 → "present", 0.005 → "5,000 years", 0.3 → "300 thousand years", 4.5 → "4.5 Ma", 1200 → "1,200 Ma". */
export function formatMa(value: number): string {
  if (value <= 0) return "present";
  if (value < 0.01) return `${Math.round(value * 1_000_000).toLocaleString("en")} years`;
  if (value < 1) return `${Math.round(value * 1000).toLocaleString("en")} thousand years`;
  if (value < 10) return `${Number(value.toFixed(1)).toLocaleString("en")} Ma`;
  return `${Math.round(value).toLocaleString("en")} Ma`;
}

export function formatMaRange(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  if (min != null && max != null) {
    if (Math.abs(max - min) < 1e-9) return `≈ ${formatMa(min)}`;
    const younger = Math.min(min, max);
    const older = Math.max(min, max);
    // Geological convention: oldest first, e.g. "485 – 299 Ma" or "525 Ma – present".
    if (younger >= 10) return `${Math.round(older).toLocaleString("en")} – ${Math.round(younger).toLocaleString("en")} Ma`;
    return `${formatMa(older)} – ${formatMa(younger)}`;
  }
  const only = (min ?? max) as number;
  return `≈ ${formatMa(only)}`;
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
