import type { AnalysisMeta, FieldContext, RockAnalysis } from "@/lib/analysis/schema";

/**
 * A saved analysis in My Collection.
 *
 * `ownerId`, `syncState` and `remoteId` are unused in the local-only first version but are
 * part of the model so that a cloud repository (accounts + sync) can be added later without
 * migrating stored records. See docs/ARCHITECTURE.md → "Cloud sync roadmap".
 */
export interface Discovery {
  id: string;
  schemaVersion: 1;
  createdAt: string;
  updatedAt: string;
  title: string;
  notes: string;
  tags: string[];
  favorite: boolean;
  image: Blob;
  thumbnail: Blob;
  analysis: RockAnalysis;
  meta: AnalysisMeta;
  context?: FieldContext;
  ownerId: string | null;
  syncState: "local" | "pending" | "synced";
  remoteId: string | null;
}

export interface NewDiscovery {
  image: Blob;
  thumbnail: Blob;
  analysis: RockAnalysis;
  meta: AnalysisMeta;
  context?: FieldContext;
  title?: string;
}

export type DiscoveryPatch = Partial<Pick<Discovery, "title" | "notes" | "tags" | "favorite">>;

/** Storage-agnostic contract. The UI only talks to this interface. */
export interface DiscoveryRepository {
  list(): Promise<Discovery[]>;
  get(id: string): Promise<Discovery | null>;
  create(input: NewDiscovery): Promise<Discovery>;
  update(id: string, patch: DiscoveryPatch): Promise<Discovery>;
  remove(id: string): Promise<void>;
}
