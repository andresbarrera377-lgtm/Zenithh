import { createId } from "@/lib/utils";
import { openDb, requestToPromise, STORES, transactionDone } from "@/lib/storage/idb";
import type { Discovery, DiscoveryPatch, DiscoveryRepository, NewDiscovery } from "./types";

const STORE = STORES.discoveries;

/**
 * Local-first repository backed by IndexedDB. Photos are stored as Blobs, so a collection
 * of hundreds of specimens stays efficient and never leaves the device.
 */
export class IndexedDbDiscoveryRepository implements DiscoveryRepository {
  private db(): Promise<IDBDatabase> {
    return openDb();
  }

  async list(): Promise<Discovery[]> {
    const db = await this.db();
    const items = await requestToPromise(db.transaction(STORE, "readonly").objectStore(STORE).getAll());
    return (items as Discovery[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async get(id: string): Promise<Discovery | null> {
    const db = await this.db();
    const item = await requestToPromise(db.transaction(STORE, "readonly").objectStore(STORE).get(id));
    return (item as Discovery | undefined) ?? null;
  }

  async create(input: NewDiscovery): Promise<Discovery> {
    const now = new Date().toISOString();
    const discovery: Discovery = {
      id: createId(),
      schemaVersion: 1,
      createdAt: now,
      updatedAt: now,
      title: input.title?.trim() || input.analysis.identification.rockName,
      notes: "",
      tags: [],
      favorite: false,
      image: input.image,
      photos: input.photos,
      thumbnail: input.thumbnail,
      analysis: input.analysis,
      meta: input.meta,
      context: input.context,
      ownerId: null,
      syncState: "local",
      remoteId: null,
    };
    const db = await this.db();
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add(discovery);
    await transactionDone(tx);
    return discovery;
  }

  async update(id: string, patch: DiscoveryPatch): Promise<Discovery> {
    const db = await this.db();
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const current = (await requestToPromise(store.get(id))) as Discovery | undefined;
    if (!current) {
      tx.abort();
      throw new Error("This discovery no longer exists.");
    }
    const next: Discovery = {
      ...current,
      ...patch,
      tags: patch.tags ? normalizeTags(patch.tags) : current.tags,
      updatedAt: new Date().toISOString(),
      syncState: current.syncState === "synced" ? "pending" : current.syncState,
    };
    store.put(next);
    await transactionDone(tx);
    return next;
  }

  async remove(id: string): Promise<void> {
    const db = await this.db();
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    await transactionDone(tx);
  }
}

export function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of tags) {
    const tag = raw.trim().replace(/\s+/g, " ").slice(0, 32);
    const key = tag.toLowerCase();
    if (tag && !seen.has(key)) {
      seen.add(key);
      out.push(tag);
    }
  }
  return out.slice(0, 12);
}
