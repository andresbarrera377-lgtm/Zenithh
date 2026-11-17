"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { IndexedDbDiscoveryRepository } from "./indexeddb-repository";
import type { Discovery, DiscoveryPatch, DiscoveryRepository, NewDiscovery } from "./types";

let repository: DiscoveryRepository | null = null;

/**
 * Returns the active repository. Today this is always local (IndexedDB); when accounts are
 * added, this is the single place that decides between local and cloud-synced storage.
 */
export function getDiscoveryRepository(): DiscoveryRepository {
  repository ??= new IndexedDbDiscoveryRepository();
  return repository;
}

// ---- change notifications (same tab + other tabs) -------------------------------------

let version = 0;
const listeners = new Set<() => void>();
const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("dr-rock-collection") : null;

function emit(broadcast = true) {
  version++;
  listeners.forEach((l) => l());
  if (broadcast) channel?.postMessage("changed");
}
channel?.addEventListener("message", () => emit(false));

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function useCollectionVersion() {
  return useSyncExternalStore(
    subscribe,
    () => version,
    () => 0,
  );
}

// ---- mutations ---------------------------------------------------------------------------

export async function saveDiscovery(input: NewDiscovery): Promise<Discovery> {
  const created = await getDiscoveryRepository().create(input);
  emit();
  // Ask the browser not to evict the collection under storage pressure (best effort).
  navigator.storage?.persist?.().catch(() => undefined);
  return created;
}

export async function updateDiscovery(id: string, patch: DiscoveryPatch): Promise<Discovery> {
  const updated = await getDiscoveryRepository().update(id, patch);
  emit();
  return updated;
}

export async function deleteDiscovery(id: string): Promise<void> {
  await getDiscoveryRepository().remove(id);
  emit();
}

// ---- hooks --------------------------------------------------------------------------------

type AsyncState<T> = { data: T; loading: boolean; error: string | null };

export function useDiscoveries(): AsyncState<Discovery[]> {
  const v = useCollectionVersion();
  const [state, setState] = useState<AsyncState<Discovery[]>>({ data: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    getDiscoveryRepository()
      .list()
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((e: unknown) => !cancelled && setState({ data: [], loading: false, error: errorMessage(e) }));
    return () => {
      cancelled = true;
    };
  }, [v]);

  return state;
}

export function useDiscovery(id: string | null): AsyncState<Discovery | null> {
  const v = useCollectionVersion();
  const [state, setState] = useState<AsyncState<Discovery | null>>({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getDiscoveryRepository()
      .get(id)
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((e: unknown) => !cancelled && setState({ data: null, loading: false, error: errorMessage(e) }));
    return () => {
      cancelled = true;
    };
  }, [id, v]);

  return state;
}

/** Creates an object URL for a Blob and revokes it when the Blob changes or the component unmounts. */
export function useObjectUrl(blob: Blob | null | undefined): string | null {
  const [entry, setEntry] = useState<{ blob: Blob; url: string } | null>(null);
  useEffect(() => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    let active = true;
    queueMicrotask(() => {
      if (active) setEntry({ blob, url });
    });
    return () => {
      active = false;
      URL.revokeObjectURL(url);
    };
  }, [blob]);
  return entry && blob && entry.blob === blob ? entry.url : null;
}

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Could not access the local collection.";
}

export function useAsyncAction<A extends unknown[], R>(fn: (...args: A) => Promise<R>) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = useCallback(
    async (...args: A): Promise<R | undefined> => {
      setPending(true);
      setError(null);
      try {
        return await fn(...args);
      } catch (e) {
        setError(errorMessage(e));
        return undefined;
      } finally {
        setPending(false);
      }
    },
    [fn],
  );
  return { run, pending, error };
}
