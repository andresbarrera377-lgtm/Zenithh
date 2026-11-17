"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { requestAnalysis } from "@/lib/analysis/client";
import type { AnalysisMeta, AnalyzeResponse, FieldContext, RockAnalysis } from "@/lib/analysis/schema";
import type { ProcessedImage } from "@/lib/image/process-image";

export type ScanStatus = "idle" | "ready" | "analyzing" | "done" | "error";

export type ScanError = Extract<AnalyzeResponse, { ok: false }>["error"];

export interface ScanResult {
  analysis: RockAnalysis;
  meta: AnalysisMeta;
}

interface ScanSessionValue {
  status: ScanStatus;
  image: ProcessedImage | null;
  imageUrl: string | null;
  context: FieldContext;
  result: ScanResult | null;
  error: ScanError | null;
  savedId: string | null;
  setImage: (image: ProcessedImage) => void;
  clearImage: () => void;
  setContext: (context: FieldContext) => void;
  startAnalysis: () => void;
  cancelAnalysis: () => void;
  markSaved: (id: string) => void;
  reset: () => void;
}

const ScanSessionContext = createContext<ScanSessionValue | null>(null);

/**
 * Holds the in-progress scan (image → analysis → result) while the user moves between
 * the Scan, Analysis and Results screens. Nothing here is persisted: saving to
 * My Collection is an explicit user action.
 */
export function ScanSessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [image, setImageState] = useState<ProcessedImage | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [context, setContext] = useState<FieldContext>({});
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<ScanError | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  // Warn before closing or reloading the tab while an analysis is running or its result is unsaved:
  // results live in memory only until the user saves them.
  useEffect(() => {
    const unsaved = status === "analyzing" || (status === "done" && !savedId);
    if (!unsaved) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [status, savedId]);

  const setImage = useCallback((next: ProcessedImage) => {
    abortRef.current?.abort();
    setImageState(next);
    setImageUrl(URL.createObjectURL(next.blob));
    setResult(null);
    setError(null);
    setSavedId(null);
    setStatus("ready");
  }, []);

  const clearImage = useCallback(() => {
    abortRef.current?.abort();
    setImageState(null);
    setImageUrl(null);
    setResult(null);
    setError(null);
    setSavedId(null);
    setStatus("idle");
  }, []);

  const startAnalysis = useCallback(() => {
    if (!image) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("analyzing");
    setError(null);
    setResult(null);
    setSavedId(null);

    requestAnalysis(image.blob, context, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return;
        if (response.ok) {
          setResult({ analysis: response.analysis, meta: response.meta });
          setStatus("done");
        } else {
          setError(response.error);
          setStatus("error");
        }
      })
      .catch(() => {
        // Safety net: the screen must never stay on "analyzing" if something unexpected throws.
        if (controller.signal.aborted) return;
        setError({ code: "UNKNOWN", message: "Something went wrong during the analysis. Please try again." });
        setStatus("error");
      });
  }, [image, context]);

  const cancelAnalysis = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus(image ? "ready" : "idle");
  }, [image]);

  const reset = useCallback(() => {
    clearImage();
    setContext({});
  }, [clearImage]);

  const value = useMemo<ScanSessionValue>(
    () => ({
      status,
      image,
      imageUrl,
      context,
      result,
      error,
      savedId,
      setImage,
      clearImage,
      setContext,
      startAnalysis,
      cancelAnalysis,
      markSaved: setSavedId,
      reset,
    }),
    [status, image, imageUrl, context, result, error, savedId, setImage, clearImage, startAnalysis, cancelAnalysis, reset],
  );

  return <ScanSessionContext.Provider value={value}>{children}</ScanSessionContext.Provider>;
}

export function useScanSession(): ScanSessionValue {
  const ctx = useContext(ScanSessionContext);
  if (!ctx) throw new Error("useScanSession must be used inside <ScanSessionProvider>");
  return ctx;
}
