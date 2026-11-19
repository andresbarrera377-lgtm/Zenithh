import type { PhotoRole } from "@/lib/analysis/photos";
import type { AnalysisMeta, FieldContext, RockAnalysis } from "@/lib/analysis/schema";
import type { PhotoQuality } from "@/lib/image/quality";

export interface HistoryPhoto {
  blob: Blob;
  role: PhotoRole;
  width: number;
  height: number;
  quality?: PhotoQuality;
}

/**
 * One finished analysis, saved automatically on this device: the photos that were sent, the
 * report and the notes/tests. Unlike My Collection (what the user chooses to keep), the history
 * keeps every scan, newest first, up to HISTORY_LIMIT entries.
 */
export interface HistoryEntry {
  id: string;
  createdAt: string;
  photos: HistoryPhoto[];
  thumbnail: Blob;
  analysis: RockAnalysis;
  meta: AnalysisMeta;
  context?: FieldContext;
  /** Set when the scan was also saved to My Collection. */
  savedDiscoveryId: string | null;
}

export type NewHistoryEntry = Omit<HistoryEntry, "id" | "createdAt" | "savedDiscoveryId">;
