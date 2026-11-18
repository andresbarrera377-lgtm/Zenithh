/**
 * Geological time scale (International Chronostratigraphic Chart, ICS v2023/09).
 * Ages in millions of years ago (Ma). Colours are the official ICS/CGMW colours.
 */
export interface TimeUnit {
  id: string;
  name: string;
  /** Spanish name (official Spanish ICS terms). */
  nameEs: string;
  start: number;
  end: number;
  color: string;
}

export const EONS_PRECAMBRIAN: TimeUnit = {
  id: "precambrian",
  name: "Precambrian",
  nameEs: "Precámbrico",
  start: 4567,
  end: 538.8,
  color: "#F74370",
};

export const ERAS: TimeUnit[] = [
  { id: "paleozoic", name: "Paleozoic", nameEs: "Paleozoico", start: 538.8, end: 251.902, color: "#99C08D" },
  { id: "mesozoic", name: "Mesozoic", nameEs: "Mesozoico", start: 251.902, end: 66.0, color: "#67C5CA" },
  { id: "cenozoic", name: "Cenozoic", nameEs: "Cenozoico", start: 66.0, end: 0, color: "#F2F91D" },
];

export const PERIODS: TimeUnit[] = [
  { id: "cambrian", name: "Cambrian", nameEs: "Cámbrico", start: 538.8, end: 485.4, color: "#7FA056" },
  { id: "ordovician", name: "Ordovician", nameEs: "Ordovícico", start: 485.4, end: 443.8, color: "#009270" },
  { id: "silurian", name: "Silurian", nameEs: "Silúrico", start: 443.8, end: 419.2, color: "#B3E1B6" },
  { id: "devonian", name: "Devonian", nameEs: "Devónico", start: 419.2, end: 358.9, color: "#CB8C37" },
  { id: "carboniferous", name: "Carboniferous", nameEs: "Carbonífero", start: 358.9, end: 298.9, color: "#67A599" },
  { id: "permian", name: "Permian", nameEs: "Pérmico", start: 298.9, end: 251.902, color: "#F04028" },
  { id: "triassic", name: "Triassic", nameEs: "Triásico", start: 251.902, end: 201.4, color: "#812B92" },
  { id: "jurassic", name: "Jurassic", nameEs: "Jurásico", start: 201.4, end: 145.0, color: "#34B2C9" },
  { id: "cretaceous", name: "Cretaceous", nameEs: "Cretácico", start: 145.0, end: 66.0, color: "#7FC64E" },
  { id: "paleogene", name: "Paleogene", nameEs: "Paleógeno", start: 66.0, end: 23.03, color: "#FD9A52" },
  { id: "neogene", name: "Neogene", nameEs: "Neógeno", start: 23.03, end: 2.58, color: "#FFE619" },
  { id: "quaternary", name: "Quaternary", nameEs: "Cuaternario", start: 2.58, end: 0, color: "#F9F97F" },
];

export function unitName(unit: TimeUnit, lang: "es" | "en"): string {
  return lang === "es" ? unit.nameEs : unit.name;
}

export function eraOfPeriod(periodId: string): TimeUnit | undefined {
  const p = PERIODS.find((x) => x.id === periodId);
  if (!p) return undefined;
  return ERAS.find((e) => p.start <= e.start && p.end >= e.end);
}

/**
 * Position (0–1) on a display axis where the Precambrian is compressed into the first 16%
 * and the Phanerozoic (538.8 Ma → today) is linear over the remaining 84%.
 * This keeps the periods readable while still showing deep time.
 */
export const PRECAMBRIAN_SHARE = 0.16;

export function timeToPosition(ma: number): number {
  const phanero = EONS_PRECAMBRIAN.end;
  if (ma >= phanero) {
    const t = (EONS_PRECAMBRIAN.start - Math.min(ma, EONS_PRECAMBRIAN.start)) / (EONS_PRECAMBRIAN.start - phanero);
    return t * PRECAMBRIAN_SHARE;
  }
  return PRECAMBRIAN_SHARE + ((phanero - Math.max(ma, 0)) / phanero) * (1 - PRECAMBRIAN_SHARE);
}
