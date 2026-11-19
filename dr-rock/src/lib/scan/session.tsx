"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { requestAnalysis, type AnalysisProgress, type UploadPhoto } from "@/lib/analysis/client";
import { MAX_PHOTOS, MAX_TOTAL_PHOTO_BYTES, PHOTO_ROLES, type PhotoRole } from "@/lib/analysis/photos";
import type { AnalysisMeta, AnalyzeResponse, FieldContext, RockAnalysis } from "@/lib/analysis/schema";
import { addToHistory } from "@/lib/history/store";
import type { HistoryEntry } from "@/lib/history/types";
import { useLocale } from "@/lib/i18n/client";
import type { ProcessedImage } from "@/lib/image/process-image";
import { createId } from "@/lib/utils";

export type ScanStatus = "idle" | "ready" | "analyzing" | "done" | "error";

export type ScanError = Extract<AnalyzeResponse, { ok: false }>["error"];

export interface ScanResult {
  analysis: RockAnalysis;
  meta: AnalysisMeta;
}

export interface ScanPhoto {
  id: string;
  role: PhotoRole;
  image: ProcessedImage;
  url: string;
}

interface ScanSessionValue {
  status: ScanStatus;
  /** Up to three photos of the same specimen, ordered by role (overview, close-up, other). */
  photos: ScanPhoto[];
  /** The main photo (first one), for screens that show a single image. */
  image: ProcessedImage | null;
  imageUrl: string | null;
  context: FieldContext;
  result: ScanResult | null;
  error: ScanError | null;
  /** Which pass the server is running while analyzing (job mode only). */
  progress: AnalysisProgress | null;
  /** My Collection id once the user saved the result. */
  savedId: string | null;
  /** History id of the finished result (every result is saved there automatically). */
  historyId: string | null;
  addPhoto: (image: ProcessedImage, role?: PhotoRole) => void;
  replacePhoto: (id: string, image: ProcessedImage) => void;
  removePhoto: (id: string) => void;
  clearImage: () => void;
  setContext: (context: FieldContext) => void;
  startAnalysis: () => void;
  cancelAnalysis: () => void;
  markSaved: (id: string) => void;
  loadFromHistory: (entry: HistoryEntry) => void;
  reset: () => void;
}

const ScanSessionContext = createContext<ScanSessionValue | null>(null);

const ROLE_ORDER: Record<PhotoRole, number> = { overview: 0, closeup: 1, other: 2 };

function sortPhotos(photos: ScanPhoto[]): ScanPhoto[] {
  return [...photos].sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role]);
}

/** Photos to upload: the user's photos, plus the automatic centre detail of the main photo when it fits. */
export function buildUpload(photos: ScanPhoto[]): UploadPhoto[] {
  const upload: UploadPhoto[] = photos.map((p) => ({ blob: p.image.blob, role: p.role }));
  const detail = photos[0]?.image.detail;
  const total = upload.reduce((sum, p) => sum + p.blob.size, 0);
  if (detail && upload.length < MAX_PHOTOS && total + detail.size <= MAX_TOTAL_PHOTO_BYTES) {
    upload.push({ blob: detail, role: "detail" });
  }
  return upload;
}

/**
 * Holds the in-progress scan (photos → analysis → result) while the user moves between the
 * Scan, Analysis and Results screens. Every finished result is also stored in the on-device
 * history; saving to My Collection stays an explicit user action.
 */
export function ScanSessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [photos, setPhotos] = useState<ScanPhoto[]>([]);
  const [context, setContext] = useState<FieldContext>({});
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<ScanError | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const urlsRef = useRef(new Set<string>());

  // Revoke every object URL when the provider unmounts.
  useEffect(() => {
    const urls = urlsRef.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  // Warn before closing or reloading the tab while an analysis is running (finished results are
  // already in the history).
  useEffect(() => {
    if (status !== "analyzing") return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [status]);

  const makePhoto = useCallback((image: ProcessedImage, role: PhotoRole): ScanPhoto => {
    const url = URL.createObjectURL(image.blob);
    urlsRef.current.add(url);
    return { id: createId(), role, image, url };
  }, []);

  const dropUrl = useCallback((url: string) => {
    URL.revokeObjectURL(url);
    urlsRef.current.delete(url);
  }, []);

  /** Any change to the photos invalidates a previous result. */
  const invalidate = useCallback(() => {
    abortRef.current?.abort();
    setResult(null);
    setError(null);
    setSavedId(null);
    setHistoryId(null);
    setProgress(null);
  }, []);

  const addPhoto = useCallback(
    (image: ProcessedImage, role?: PhotoRole) => {
      invalidate();
      setPhotos((current) => {
        const target = role ?? PHOTO_ROLES.find((r) => !current.some((p) => p.role === r));
        if (!target) return current;
        const existing = current.find((p) => p.role === target);
        if (existing) dropUrl(existing.url);
        return sortPhotos([...current.filter((p) => p.role !== target), makePhoto(image, target)]);
      });
      setStatus("ready");
    },
    [invalidate, makePhoto, dropUrl],
  );

  const replacePhoto = useCallback(
    (id: string, image: ProcessedImage) => {
      invalidate();
      setPhotos((current) =>
        current.map((p) => {
          if (p.id !== id) return p;
          dropUrl(p.url);
          return makePhoto(image, p.role);
        }),
      );
      setStatus("ready");
    },
    [invalidate, makePhoto, dropUrl],
  );

  const removePhoto = useCallback(
    (id: string) => {
      invalidate();
      setPhotos((current) => {
        const gone = current.find((p) => p.id === id);
        if (gone) dropUrl(gone.url);
        const rest = current.filter((p) => p.id !== id);
        // Keep an overview: if it was removed, the next photo takes its place.
        if (rest.length > 0 && !rest.some((p) => p.role === "overview")) rest[0] = { ...rest[0], role: "overview" };
        return sortPhotos(rest);
      });
      setStatus(photos.filter((p) => p.id !== id).length > 0 ? "ready" : "idle");
    },
    [invalidate, dropUrl, photos],
  );

  const clearImage = useCallback(() => {
    invalidate();
    setPhotos((current) => {
      current.forEach((p) => dropUrl(p.url));
      return [];
    });
    setStatus("idle");
  }, [invalidate, dropUrl]);

  const lang = useLocale();
  const startAnalysis = useCallback(() => {
    if (photos.length === 0) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("analyzing");
    setProgress("analyzing");
    setError(null);
    setResult(null);
    setSavedId(null);
    setHistoryId(null);

    const sentPhotos = photos;
    const sentContext = context;
    requestAnalysis(buildUpload(sentPhotos), sentContext, controller.signal, lang, (stage) => {
      if (!controller.signal.aborted) setProgress(stage);
    })
      .then((response) => {
        if (controller.signal.aborted) return;
        setProgress(null);
        if (response.ok) {
          setResult({ analysis: response.analysis, meta: response.meta });
          setStatus("done");
          // Every result goes to the on-device history (best effort: a full or blocked storage
          // must not hide the result).
          addToHistory({
            photos: sentPhotos.map((p) => ({ blob: p.image.blob, role: p.role, width: p.image.width, height: p.image.height, quality: p.image.quality })),
            thumbnail: sentPhotos[0].image.thumbnail,
            analysis: response.analysis,
            meta: response.meta,
            context: sentContext,
          })
            .then((entry) => !controller.signal.aborted && setHistoryId(entry.id))
            .catch(() => undefined);
        } else {
          setError(response.error);
          setStatus("error");
        }
      })
      .catch(() => {
        // Safety net: the screen must never stay on "analyzing" if something unexpected throws.
        if (controller.signal.aborted) return;
        setProgress(null);
        setError({ code: "UNKNOWN", message: "Something went wrong during the analysis. Please try again." });
        setStatus("error");
      });
  }, [photos, context, lang]);

  const cancelAnalysis = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setProgress(null);
    setStatus(photos.length > 0 ? "ready" : "idle");
  }, [photos.length]);

  /** Puts a past scan's photos and notes back on the Scan screen, to add more and analyze again. */
  const loadFromHistory = useCallback(
    (entry: HistoryEntry) => {
      invalidate();
      setPhotos((current) => {
        current.forEach((p) => dropUrl(p.url));
        return sortPhotos(
          entry.photos.map((p, i) =>
            makePhoto(
              {
                blob: p.blob,
                thumbnail: i === 0 ? entry.thumbnail : p.blob,
                width: p.width,
                height: p.height,
                quality: p.quality ?? { score: "good", warnings: [], sharpness: 0, brightness: 0, contrast: 0 },
              },
              p.role,
            ),
          ),
        );
      });
      setContext(entry.context ?? {});
      setStatus(entry.photos.length > 0 ? "ready" : "idle");
    },
    [invalidate, makePhoto, dropUrl],
  );

  const reset = useCallback(() => {
    clearImage();
    setContext({});
  }, [clearImage]);

  const value = useMemo<ScanSessionValue>(
    () => ({
      status,
      photos,
      image: photos[0]?.image ?? null,
      imageUrl: photos[0]?.url ?? null,
      context,
      result,
      error,
      progress,
      savedId,
      historyId,
      addPhoto,
      replacePhoto,
      removePhoto,
      clearImage,
      setContext,
      startAnalysis,
      cancelAnalysis,
      markSaved: setSavedId,
      loadFromHistory,
      reset,
    }),
    [status, photos, context, result, error, progress, savedId, historyId, addPhoto, replacePhoto, removePhoto, clearImage, startAnalysis, cancelAnalysis, loadFromHistory, reset],
  );

  return <ScanSessionContext.Provider value={value}>{children}</ScanSessionContext.Provider>;
}

export function useScanSession(): ScanSessionValue {
  const ctx = useContext(ScanSessionContext);
  if (!ctx) throw new Error("useScanSession must be used inside <ScanSessionProvider>");
  return ctx;
}
