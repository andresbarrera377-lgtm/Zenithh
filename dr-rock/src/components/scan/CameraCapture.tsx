"use client";

import { Camera, CameraOff, RefreshCw, SwitchCamera, X, Zap, ZapOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { captureVideoFrame, ImageProcessingError, type ProcessedImage } from "@/lib/image/process-image";
import { cn } from "@/lib/utils";

type CameraState =
  | { kind: "starting" }
  | { kind: "live" }
  | { kind: "error"; title: string; message: string };

interface TorchCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
}

function describeCameraError(error: unknown): { title: string; message: string } {
  const name = error instanceof DOMException ? error.name : "";
  switch (name) {
    case "NotAllowedError":
    case "SecurityError":
      return {
        title: "Camera permission denied",
        message:
          "Allow camera access for this site in your browser settings, or use your device's camera app with the button below.",
      };
    case "NotFoundError":
    case "OverconstrainedError":
      return { title: "No camera found", message: "This device has no available camera. You can upload a photo instead." };
    case "NotReadableError":
    case "AbortError":
      return {
        title: "Camera is busy",
        message: "Another app may be using the camera. Close it and try again, or upload a photo instead.",
      };
    default:
      return { title: "Camera unavailable", message: "The camera could not be started. You can upload a photo instead." };
  }
}

export function isLiveCameraSupported(): boolean {
  return typeof window !== "undefined" && window.isSecureContext && !!navigator.mediaDevices?.getUserMedia;
}

/**
 * Full-screen live camera with a scientific viewfinder.
 * Uses the rear camera by default and offers torch + camera switching where supported.
 */
export function CameraCapture({
  onCapture,
  onClose,
  onUseNativeCamera,
}: {
  onCapture: (image: ProcessedImage) => void;
  onClose: () => void;
  onUseNativeCamera: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>({ kind: "starting" });
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
            width: { ideal: 2560 },
            height: { ideal: 1440 },
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
        const caps = (track.getCapabilities?.() ?? {}) as TorchCapabilities;
        setTorchSupported(Boolean(caps.torch));
        setTorchOn(false);
        const devices = await navigator.mediaDevices.enumerateDevices();
        setCanSwitch(devices.filter((d) => d.kind === "videoinput").length > 1);
        setState({ kind: "live" });
      } catch (error) {
        if (!cancelled) setState({ kind: "error", ...describeCameraError(error) });
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

  async function capture() {
    const video = videoRef.current;
    if (!video || capturing) return;
    setCapturing(true);
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
    try {
      const image = await captureVideoFrame(video);
      stopStream();
      onCapture(image);
    } catch (error) {
      setState({
        kind: "error",
        title: "Capture failed",
        message: error instanceof ImageProcessingError ? error.message : "The photo could not be captured. Please try again.",
      });
    } finally {
      setCapturing(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Camera"
      className="fixed inset-0 z-[60] flex flex-col bg-carbon-950 animate-fade-in"
    >
      <div className="safe-top flex items-center justify-between px-4 py-3">
        <p className="label-mono text-mineral-400">Specimen camera</p>
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full bg-granite-800/80 text-chalk-50 ring-1 ring-granite-600/60"
          aria-label="Close camera"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative mx-auto flex w-full max-w-3xl flex-1 items-center justify-center overflow-hidden px-3">
        <div className="relative aspect-[3/4] max-h-full w-full overflow-hidden rounded-3xl bg-carbon-900 ring-1 ring-granite-700 sm:aspect-[4/3]">
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

          {state.kind === "starting" && (
            <div className="absolute inset-0 grid place-items-center text-granite-300">
              <div className="flex flex-col items-center gap-3">
                <Camera className="h-8 w-8 animate-pulse text-mineral-400" />
                <p className="text-sm">Starting camera… allow access if your browser asks.</p>
              </div>
            </div>
          )}

          {state.kind === "error" && (
            <div className="absolute inset-0 grid place-items-center p-6 text-center">
              <div className="max-w-sm space-y-4">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-jasper-500/10 text-jasper-300 ring-1 ring-jasper-500/30">
                  <CameraOff className="h-6 w-6" />
                </div>
                <div className="space-y-1.5">
                  <p className="font-display text-lg font-semibold text-chalk-50">{state.title}</p>
                  <p className="text-sm leading-relaxed text-granite-300">{state.message}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <Button variant="secondary" size="sm" icon={<RefreshCw className="h-4 w-4" />} onClick={() => setAttempt((n) => n + 1)}>
                    Try again
                  </Button>
                  <Button variant="outline" size="sm" icon={<Camera className="h-4 w-4" />} onClick={onUseNativeCamera}>
                    Use camera app
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

      <div className="safe-bottom px-6 pb-6 pt-5">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <button
            type="button"
            onClick={toggleTorch}
            disabled={!torchSupported || state.kind !== "live"}
            className="grid h-12 w-12 place-items-center rounded-full bg-granite-800/80 text-chalk-50 ring-1 ring-granite-600/60 disabled:opacity-30"
            aria-label={torchOn ? "Turn light off" : "Turn light on"}
            aria-pressed={torchOn}
          >
            {torchOn ? <Zap className="h-5 w-5 text-ochre-300" /> : <ZapOff className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={capture}
            disabled={state.kind !== "live" || capturing}
            className="group relative grid h-20 w-20 place-items-center rounded-full disabled:opacity-40"
            aria-label="Take photo"
          >
            <span className="absolute inset-0 rounded-full border-4 border-chalk-50/90" />
            <span className="h-15 w-15 rounded-full bg-mineral-400 transition-transform group-active:scale-90" />
          </button>

          <button
            type="button"
            onClick={() => setFacing((f) => (f === "environment" ? "user" : "environment"))}
            disabled={!canSwitch || state.kind !== "live"}
            className="grid h-12 w-12 place-items-center rounded-full bg-granite-800/80 text-chalk-50 ring-1 ring-granite-600/60 disabled:opacity-30"
            aria-label="Switch camera"
          >
            <SwitchCamera className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-granite-400">
          Fill the frame with the rock, keep it sharp and well lit.{" "}
          <button type="button" onClick={onUseNativeCamera} className="text-mineral-300 underline-offset-2 hover:underline">
            Use your camera app instead
          </button>
        </p>
      </div>
    </div>
  );
}

function Viewfinder() {
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
          Align specimen
        </span>
      </div>
    </div>
  );
}
