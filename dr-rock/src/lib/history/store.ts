"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createChangeFeed, openDb, requestToPromise, STORES, transactionDone } from "@/lib/storage/idb";
import { createId } from "@/lib/utils";
import { HISTORY_LIMIT } from "./limits";
import type { HistoryEntry, NewHistoryEntry } from "./types";

/** Oldest scans beyond HISTORY_LIMIT are removed automatically (photos take space on the device). */
export { HISTORY_LIMIT };

const STORE = STORES.history;
const feed = createChangeFeed("dr-rock-history");

export async function addToHistory(input: NewHistoryEntry): Promise<HistoryEntry> {
  const entry: HistoryEntry = { ...input, id: createId(), createdAt: new Date().toISOString(), savedDiscoveryId: null };
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  const store = tx.objectStore(STORE);
  store.add(entry);
  // Keep the newest HISTORY_LIMIT entries: walk the createdAt index from the oldest.
  const keys = (await requestToPromise(store.index("createdAt").getAllKeys())) as IDBValidKey[];
  const excess = keys.length - HISTORY_LIMIT;
  for (let i = 0; i < excess; i++) store.delete(keys[i]);
  await transactionDone(tx);
  feed.emit();
  navigator.storage?.persist?.().catch(() => undefined);
  return entry;
}

export async function listHistory(): Promise<HistoryEntry[]> {
  const db = await openDb();
  const items = (await requestToPromise(db.transaction(STORE, "readonly").objectStore(STORE).getAll())) as HistoryEntry[];
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getHistoryEntry(id: string): Promise<HistoryEntry | null> {
  const db = await openDb();
  return ((await requestToPromise(db.transaction(STORE, "readonly").objectStore(STORE).get(id))) as HistoryEntry | undefined) ?? null;
}

export async function markHistorySaved(id: string, discoveryId: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  const store = tx.objectStore(STORE);
  const current = (await requestToPromise(store.get(id))) as HistoryEntry | undefined;
  if (current) store.put({ ...current, savedDiscoveryId: discoveryId });
  await transactionDone(tx);
  feed.emit();
}

export async function removeFromHistory(id: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).delete(id);
  await transactionDone(tx);
  feed.emit();
}

export async function clearHistory(): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).clear();
  await transactionDone(tx);
  feed.emit();
}

function useHistoryVersion() {
  return useSyncExternalStore(feed.subscribe, feed.getVersion, () => 0);
}

type AsyncState<T> = { data: T; loading: boolean; error: boolean };

export function useHistory(): AsyncState<HistoryEntry[]> {
  const v = useHistoryVersion();
  const [state, setState] = useState<AsyncState<HistoryEntry[]>>({ data: [], loading: true, error: false });
  useEffect(() => {
    let cancelled = false;
    listHistory()
      .then((data) => !cancelled && setState({ data, loading: false, error: false }))
      .catch(() => !cancelled && setState({ data: [], loading: false, error: true }));
    return () => {
      cancelled = true;
    };
  }, [v]);
  return state;
}

export function useHistoryEntry(id: string | null): AsyncState<HistoryEntry | null> {
  const v = useHistoryVersion();
  const [state, setState] = useState<AsyncState<HistoryEntry | null>>({ data: null, loading: true, error: false });
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getHistoryEntry(id)
      .then((data) => !cancelled && setState({ data, loading: false, error: false }))
      .catch(() => !cancelled && setState({ data: null, loading: false, error: true }));
    return () => {
      cancelled = true;
    };
  }, [id, v]);
  return id ? state : { data: null, loading: false, error: false };
}

/** Space used by this site's storage (photos included), when the browser reports it. */
export function useStorageEstimate(): { usage: number; quota: number } | null {
  const v = useHistoryVersion();
  const [estimate, setEstimate] = useState<{ usage: number; quota: number } | null>(null);
  useEffect(() => {
    let cancelled = false;
    navigator.storage
      ?.estimate?.()
      .then((e) => !cancelled && e.usage != null && e.quota != null && setEstimate({ usage: e.usage, quota: e.quota }))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [v]);
  return estimate;
}
