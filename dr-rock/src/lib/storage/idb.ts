/**
 * The app's single IndexedDB database. Version 1 held My Collection ("discoveries"); version 2
 * adds the automatic scan history ("history"). Upgrades only add stores, so nothing saved is lost.
 */
const DB_NAME = "dr-rock";
const DB_VERSION = 2;

export const STORES = { discoveries: "discoveries", history: "history" } as const;

let dbPromise: Promise<IDBDatabase> | null = null;

export function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("This browser does not support local storage for collections."));
  }
  dbPromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const name of Object.values(STORES)) {
        if (!db.objectStoreNames.contains(name)) {
          const store = db.createObjectStore(name, { keyPath: "id" });
          store.createIndex("createdAt", "createdAt");
        }
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      // Another tab upgraded the database: close this connection so the upgrade can finish.
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };
    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };
    request.onblocked = () => reject(new Error("Close other Dr.Rock tabs and try again."));
  });
  return dbPromise;
}

export function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error ?? new Error("Transaction aborted"));
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Change notifications for a store, within this tab and across tabs (BroadcastChannel), so lists
 * refresh when something is added or removed anywhere.
 */
export function createChangeFeed(name: string) {
  let version = 0;
  const listeners = new Set<() => void>();
  const channel =
    typeof window !== "undefined" && typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(name) : null;
  function notify(broadcast: boolean) {
    version++;
    listeners.forEach((l) => l());
    if (broadcast) channel?.postMessage("changed");
  }
  channel?.addEventListener("message", () => notify(false));
  return {
    emit: () => notify(true),
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getVersion: () => version,
  };
}
