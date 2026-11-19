"use client";

import { Camera, CameraOff, Check, RefreshCw, SwitchCamera, X, Zap, ZapOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { captureVideoFrame, ImageProcessingError, processImageBlob, type ProcessedImage } from "@/lib/image/process-image";
import { useMessages } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

type CameraState =
  | { kind: "starting" }
  | { kind: "live" }
  | { kind: "error"; error: CameraErrorKind }
  | { kind: "captureError"; message: string };

type CameraErrorKind = "denied" | "notFound" | "busy" | "unavailable";

interface CameraCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
  zoom?: { min: number; max: number; step?: number };
  focusMode?: string[];
}

/** ImageCapture (Chrome/Android): full-sensor still photos, sharper than a video frame. */
interface ImageCaptureLike {
  takePhoto(): Promise<Blob>;
}
declare global {
  interface Window {
    ImageCapture?: new (track: MediaStreamTrack) => ImageCaptureLike;
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

function describeCameraError(error: unknown): CameraErrorKind {
  const name = error instanceof DOMException ? error.name : "";
  switch (name) {
    case "NotAllowedError":
    case "SecurityError":
      return "denied";
    case "NotFoundError":
    case "OverconstrainedError":
      return "notFound";
    case "NotReadableError":
    case "AbortError":
      return "busy";
    default:
      return "unavailable";
  }
}

export function isLiveCameraSupported(): boolean {
  return typeof window !== "undefined" && window.isSecureContext && !!navigator.mediaDevices?.getUserMedia;
}

export interface CameraShot {
  /** 1-based number of the photo being taken. */
  index: number;
  max: number;
  title: string;
  hint: string;
}

/**
 * Full-screen live camera with a scientific viewfinder.
 * Uses the rear camera by default and offers torch, zoom, tap-to-focus and camera switching where
 * supported. Stays open between shots so several photos of the specimen can be taken in a row;
 * the parent closes it when the last slot is filled or the user taps Done.
 */
export function CameraCapture({
  shot,
  canFinish,
  onCapture,
  onClose,
  onUseNativeCamera,
}: {
  shot?: CameraShot;
  canFinish?: boolean;
  onCapture: (image: ProcessedImage) => void;
  onClose: () => void;
  onUseNativeCamera: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>({ kind: "starting" });
  const t = useMessages("scan");
  const c = useMessages("capture");
  const [zoom, setZoom] = useState<{ min: number; max: number; step: number; value: number } | null>(null);
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number; key: number } | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const capsRef = useRef<CameraCapabilities>({});
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [canSwitch, setCanSwitch] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [flash, setFlash] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function start() {
      setState({ kind: "starting" });
      stopStream();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: facing },
            // Ask for 4K: the AI reads up to 2576 px, and a sharper preview helps focusing.
            width: { ideal: 3840 },
            height: { ideal: 2160 },
          },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play().catch(() => undefined);
        }
        const track = stream.getVideoTracks()[0];
        const caps = (track.getCapabilities?.() ?? {}) as CameraCapabilities;
        capsRef.current = caps;
        setTorchSupported(Boolean(caps.torch));
        setTorchOn(false);
        if (caps.zoom && caps.zoom.max > caps.zoom.min) {
          const settings = track.getSettings?.() as MediaTrackSettings & { zoom?: number };
          setZoom({ min: caps.zoom.min, max: Math.min(caps.zoom.max, caps.zoom.min * 8), step: caps.zoom.step || 0.1, value: settings?.zoom ?? caps.zoom.min });
        } else {
          setZoom(null);
        }
        if (caps.focusMode?.includes("continuous")) {
          track.applyConstraints({ advanced: [{ focusMode: "continuous" } as MediaTrackConstraintSet] }).catch(() => undefined);
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        setCanSwitch(devices.filter((d) => d.kind === "videoinput").length > 1);
        setState({ kind: "live" });
      } catch (error) {
        if (!cancelled) setState({ kind: "error", error: describeCameraError(error) });
      }
    }
    start();
    return () => {
      cancelled = true;
      stopStream();
    };
  }, [facing, attempt, stopStream]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function toggleTorch() {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn } as MediaTrackConstraintSet] });
      setTorchOn(!torchOn);
    } catch {
      setTorchSupported(false);
    }
  }

  async function applyZoom(value: number) {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track || !zoom) return;
    setZoom({ ...zoom, value });
    await track.applyConstraints({ advanced: [{ zoom: value } as MediaTrackConstraintSet] }).catch(() => undefined);
  }

  /** Tap to focus where supported (pointsOfInterest); the ring shows where the user tapped. */
  function focusAt(event: React.PointerEvent<HTMLDivElement>) {
    if (state.kind !== "live") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setFocusPoint({ x, y, key: Date.now() });
    const track = streamRef.current?.getVideoTracks()[0];
    const modes = capsRef.current.focusMode ?? [];
    if (!track || modes.length === 0) return;
    const point = { x: facing === "user" ? 1 - x : x, y };
    const mode = modes.includes("single-shot") ? "single-shot" : modes.includes("continuous") ? "continuous" : modes[0];
    track
      .applyConstraints({ advanced: [{ pointsOfInterest: [point], focusMode: mode } as unknown as MediaTrackConstraintSet] })
      .catch(() => undefined);
  }

  /** Full-resolution still when the browser supports it (and the torch is off), else the video frame. */
  async function grabImage(video: HTMLVideoElement): Promise<ProcessedImage> {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track && !torchOn && typeof window !== "undefined" && window.ImageCapture) {
      try {
        const blob = await withTimeout(new window.ImageCapture(track).takePhoto(), 6000);
        return await processImageBlob(blob);
      } catch {
        // Fall back to the video frame below.
      }
    }
    return captureVideoFrame(video);
  }

  async function capture() {
    const video = videoRef.current;
    if (!video || capturing) return;
    setCapturing(true);
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
    try {
      const image = await grabImage(video);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 1600);
      onCapture(image);
    } catch (error) {
      setState({
        kind: "captureError",
        message: error instanceof ImageProcessingError ? t.imageErrors[error.code] : t.camera.captureFailedText,
      });
    } finally {
      setCapturing(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.camera.label}
      className="fixed inset-0 z-[60] flex flex-col bg-carbon-950 animate-fade-in"
    >
      <div className="safe-top flex items-center justify-between px-4 py-3">
        <div>
          <p className="label-mono text-mineral-400">{shot ? `${c.cam.shotOf(shot.index, shot.max)} · ${shot.title}` : t.camera.title}</p>
          {shot && <p className="mt-0.5 text-xs text-granite-300">{shot.hint}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full bg-granite-800/80 text-chalk-50 ring-1 ring-granite-600/60"
          aria-label={t.camera.close}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative mx-auto flex w-full max-w-3xl flex-1 items-center justify-center overflow-hidden px-3">
        <div
          className="relative aspect-[3/4] max-h-full w-full touch-manipulation overflow-hidden rounded-3xl bg-carbon-900 ring-1 ring-granite-700 sm:aspect-[4/3]"
          onPointerUp={focusAt}
        >
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
              state.kind === "live" ? "opacity-100" : "opacity-0",
              facing === "user" && "-scale-x-100",
            )}
          />

          {state.kind === "live" && <Viewfinder />}

          {focusPoint && state.kind === "live" && (
            <span
              key={focusPoint.key}
              aria-hidden
              className="pointer-events-none absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ochre-300 animate-fade-in"
              style={{ left: `${focusPoint.x * 100}%`, top: `${focusPoint.y * 100}%` }}
            />
          )}

          {savedToast && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <span className="flex items-center gap-1.5 rounded-full bg-mineral-400 px-3 py-1.5 text-sm font-semibold text-carbon-950 shadow-lg">
                <Check className="h-4 w-4" /> {c.cam.saved}
              </span>
            </div>
          )}

          {state.kind === "starting" && (
            <div className="absolute inset-0 grid place-items-center text-granite-300">
              <div className="flex flex-col items-center gap-3">
                <Camera className="h-8 w-8 animate-pulse text-mineral-400" />
                <p className="text-sm">{t.camera.starting}</p>
              </div>
            </div>
          )}

          {(state.kind === "error" || state.kind === "captureError") && (
            <div className="absolute inset-0 grid place-items-center p-6 text-center">
              <div className="max-w-sm space-y-4">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-jasper-500/10 text-jasper-300 ring-1 ring-jasper-500/30">
                  <CameraOff className="h-6 w-6" />
                </div>
                <div className="space-y-1.5">
                  <p className="font-display text-lg font-semibold text-chalk-50">
                    {state.kind === "error" ? t.camera.errors[state.error].title : t.camera.captureFailed}
                  </p>
                  <p className="text-sm leading-relaxed text-granite-300">
                    {state.kind === "error" ? t.camera.errors[state.error].message : state.message}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <Button variant="secondary" size="sm" icon={<RefreshCw className="h-4 w-4" />} onClick={() => setAttempt((n) => n + 1)}>
                    {t.camera.tryAgain}
                  </Button>
                  <Button variant="outline" size="sm" icon={<Camera className="h-4 w-4" />} onClick={onUseNativeCamera}>
                    {t.camera.useApp}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 bg-white transition-opacity duration-150",
              flash ? "opacity-70" : "opacity-0",
            )}
          />
        </div>
      </div>

      <div className="safe-bottom px-6 pb-6 pt-4">
        {zoom && state.kind === "live" && (
          <label className="mx-auto mb-4 flex max-w-md items-center gap-3 text-xs text-granite-300">
            <span className="font-mono">{c.cam.zoom}</span>
            <input
              type="range"
              min={zoom.min}
              max={zoom.max}
              step={zoom.step}
              value={zoom.value}
              onChange={(e) => applyZoom(Number(e.target.value))}
              className="h-1 flex-1 accent-mineral-400"
            />
            <span className="w-10 text-right font-mono">{zoom.value.toFixed(1)}×</span>
          </label>
        )}
        <div className="mx-auto flex max-w-md items-center justify-between">
          <button
            type="button"
            onClick={toggleTorch}
            disabled={!torchSupported || state.kind !== "live"}
            className="grid h-12 w-12 place-items-center rounded-full bg-granite-800/80 text-chalk-50 ring-1 ring-granite-600/60 disabled:opacity-30"
            aria-label={torchOn ? t.camera.lightOff : t.camera.lightOn}
            aria-pressed={torchOn}
          >
            {torchOn ? <Zap className="h-5 w-5 text-ochre-300" /> : <ZapOff className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={capture}
            disabled={state.kind !== "live" || capturing}
            className="group relative grid h-20 w-20 place-items-center rounded-full disabled:opacity-40"
            aria-label={t.camera.shoot}
          >
            <span className="absolute inset-0 rounded-full border-4 border-chalk-50/90" />
            <span className="h-15 w-15 rounded-full bg-mineral-400 transition-transform group-active:scale-90" />
          </button>

          <button
            type="button"
            onClick={() => setFacing((f) => (f === "environment" ? "user" : "environment"))}
            disabled={!canSwitch || state.kind !== "live"}
            className="grid h-12 w-12 place-items-center rounded-full bg-granite-800/80 text-chalk-50 ring-1 ring-granite-600/60 disabled:opacity-30"
            aria-label={t.camera.switch}
          >
            <SwitchCamera className="h-5 w-5" />
          </button>
        </div>
        {canFinish && (
          <div className="mx-auto mt-4 flex max-w-md justify-center">
            <Button size="sm" variant="secondary" icon={<Check className="h-4 w-4" />} onClick={onClose}>
              {c.cam.done}
            </Button>
          </div>
        )}
        <p className="mt-4 text-center text-xs text-granite-400">
          {c.cam.focus} · {t.camera.hint}{" "}
          <button type="button" onClick={onUseNativeCamera} className="text-mineral-300 underline-offset-2 hover:underline">
            {t.camera.useAppInstead}
          </button>
        </p>
      </div>
    </div>
  );
}

function Viewfinder() {
  const t = useMessages("scan");
  const corner = "absolute h-10 w-10 border-mineral-400";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-grid-fine opacity-30" />
      <div className="absolute inset-[10%]">
        <span className={cn(corner, "left-0 top-0 rounded-tl-2xl border-l-2 border-t-2")} />
        <span className={cn(corner, "right-0 top-0 rounded-tr-2xl border-r-2 border-t-2")} />
        <span className={cn(corner, "bottom-0 left-0 rounded-bl-2xl border-b-2 border-l-2")} />
        <span className={cn(corner, "bottom-0 right-0 rounded-br-2xl border-b-2 border-r-2")} />
        <span className="absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-mineral-300/80" />
        <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-mineral-300/80" />
      </div>
      <div className="absolute inset-x-0 top-3 flex justify-center">
        <span className="label-mono rounded-full bg-carbon-950/60 px-3 py-1 text-mineral-300 backdrop-blur">
          {t.camera.align}
        </span>
      </div>
    </div>
  );
}
