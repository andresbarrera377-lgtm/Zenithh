"use client";

import { AlertOctagon, ArrowLeft, Clock, RefreshCw, ScanLine, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState, Panel } from "@/components/ui/primitives";
import type { AnalysisErrorCode } from "@/lib/analysis/schema";
import { useScanSession } from "@/lib/scan/session";
import { cn } from "@/lib/utils";

export const SCAN_MESSAGES = [
  "Examining mineral structures…",
  "Searching for fossil patterns…",
  "Analyzing geological characteristics…",
  "Measuring grain size and texture…",
  "Comparing with known rock types…",
  "Estimating geological age range…",
  "Compiling scientific report…",
];

const ERROR_TITLES: Partial<Record<AnalysisErrorCode, string>> = {
  AI_NOT_CONFIGURED: "AI analysis unavailable",
  AI_UNAVAILABLE: "AI service unreachable",
  AI_BUSY: "AI service busy",
  AI_REFUSED: "Image not analyzed",
  AI_INVALID_RESPONSE: "Incomplete AI response",
  AI_REQUEST_REJECTED: "Image could not be processed",
  RATE_LIMITED: "Too many analyses",
  TIMEOUT: "Analysis timed out",
  NETWORK_ERROR: "Connection problem",
  OFFLINE: "You're offline",
  IMAGE_TOO_LARGE: "Image too large",
  UNSUPPORTED_IMAGE_TYPE: "Unsupported image",
  INVALID_IMAGE: "Invalid image",
};

const NON_RETRYABLE: AnalysisErrorCode[] = ["AI_NOT_CONFIGURED", "UNSUPPORTED_IMAGE_TYPE", "INVALID_IMAGE", "IMAGE_TOO_LARGE"];

export function AnalysisScreen() {
  const router = useRouter();
  const { status, imageUrl, error, startAnalysis, cancelAnalysis } = useScanSession();

  useEffect(() => {
    if (status === "done") router.replace("/app/results");
  }, [status, router]);

  if (status === "idle" || !imageUrl) {
    return (
      <EmptyState
        icon={<ScanLine className="h-6 w-6" />}
        title="No specimen to analyze"
        description="Take or upload a photo of a rock first."
        action={<ButtonLink href="/app/scan">Scan a rock</ButtonLink>}
      />
    );
  }

  if (status === "error" && error) {
    const retryable = !NON_RETRYABLE.includes(error.code);
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Panel className="overflow-hidden p-0">
          <div className="relative h-48 bg-carbon-900">
            <Image src={imageUrl} alt="Specimen" fill unoptimized className="object-cover opacity-40 grayscale" />
            <div className="absolute inset-0 grid place-items-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-jasper-500/15 text-jasper-300 ring-1 ring-jasper-500/40 backdrop-blur">
                <AlertOctagon className="h-8 w-8" />
              </span>
            </div>
          </div>
          <div className="space-y-4 p-6 text-center">
            <h2 className="font-display text-2xl font-semibold text-chalk-50">{ERROR_TITLES[error.code] ?? "Analysis failed"}</h2>
            <p className="leading-relaxed text-granite-300">{error.message}</p>
            <p className="text-sm text-granite-500">
              No identification was generated — Dr.Rock never shows results the AI did not produce.
              {error.retryAfterSeconds ? ` Try again in about ${Math.ceil(error.retryAfterSeconds / 60)} min.` : ""}
            </p>
            <div className="flex flex-col justify-center gap-2 pt-2 sm:flex-row">
              {retryable && (
                <Button onClick={startAnalysis} icon={<RefreshCw className="h-4 w-4" />}>
                  Try again
                </Button>
              )}
              <ButtonLink href="/app/scan" variant="secondary" icon={<ArrowLeft className="h-4 w-4" />}>
                Back to scan
              </ButtonLink>
            </div>
          </div>
        </Panel>
      </div>
    );
  }

  if (status === "ready") {
    return (
      <EmptyState
        icon={<X className="h-6 w-6" />}
        title="Analysis cancelled"
        description="Your photo is still ready. You can analyze it again or choose a different one."
        action={
          <div className="flex gap-2">
            <Button onClick={startAnalysis}>Analyze again</Button>
            <ButtonLink href="/app/scan" variant="secondary">
              Back to scan
            </ButtonLink>
          </div>
        }
      />
    );
  }

  return <Scanning imageUrl={imageUrl} onCancel={cancelAnalysis} />;
}

function Scanning({ imageUrl, onCancel }: { imageUrl: string; onCancel: () => void }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const started = Date.now();
    const msg = setInterval(() => setMessageIndex((i) => (i + 1) % SCAN_MESSAGES.length), 2600);
    const clock = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => {
      clearInterval(msg);
      clearInterval(clock);
    };
  }, []);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-carbon-900 ring-1 ring-granite-700 sm:aspect-[16/10]">
        <Image src={imageUrl} alt="Specimen being analyzed" fill unoptimized className="object-cover" />
        <ScannerOverlay />
      </div>

      <div className="space-y-5 text-center" aria-live="polite">
        <div className="label-mono flex items-center justify-center gap-2 text-mineral-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mineral-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mineral-400" />
          </span>
          Analysis in progress
        </div>
        <p key={messageIndex} className="animate-fade-up font-display text-2xl font-semibold text-chalk-50 sm:text-3xl">
          {SCAN_MESSAGES[messageIndex]}
        </p>
        <div className="mx-auto h-1 w-56 overflow-hidden rounded-full bg-granite-800">
          <div className="h-full w-1/3 animate-indeterminate rounded-full bg-mineral-400" />
        </div>
        <p className="flex items-center justify-center gap-2 font-mono text-xs text-granite-400">
          <Clock className="h-3.5 w-3.5" /> {mm}:{ss} elapsed · usually 20–90 s
        </p>
        <Button variant="ghost" size="sm" onClick={onCancel} icon={<X className="h-4 w-4" />}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

/** Animated scanner HUD drawn over the specimen photo. */
export function ScannerOverlay({ className }: { className?: string }) {
  const corner = "absolute h-12 w-12 border-mineral-300";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <div className="absolute inset-0 bg-carbon-950/25" />
      <div className="absolute inset-0 bg-grid-fine opacity-60" />
      {/* sweeping laser */}
      <div className="absolute inset-x-0 h-24 -translate-y-1/2 animate-scan">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-mineral-400/25 to-transparent" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-mineral-300 shadow-[0_0_18px_4px_rgba(79,227,164,0.7)]" />
      </div>
      {/* points of interest */}
      {[
        ["24%", "30%", "0s"],
        ["62%", "44%", "0.8s"],
        ["40%", "68%", "1.6s"],
        ["74%", "22%", "2.2s"],
      ].map(([left, top, delay]) => (
        <span key={left + top} className="absolute" style={{ left, top }}>
          <span className="absolute -left-4 -top-4 h-8 w-8 animate-pulse-ring rounded-full border border-mineral-300" style={{ animationDelay: delay }} />
          <span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-mineral-300" />
        </span>
      ))}
      <div className="absolute inset-5">
        <span className={cn(corner, "left-0 top-0 rounded-tl-2xl border-l-2 border-t-2")} />
        <span className={cn(corner, "right-0 top-0 rounded-tr-2xl border-r-2 border-t-2")} />
        <span className={cn(corner, "bottom-0 left-0 rounded-bl-2xl border-b-2 border-l-2")} />
        <span className={cn(corner, "bottom-0 right-0 rounded-br-2xl border-b-2 border-r-2")} />
      </div>
      <div className="label-mono absolute left-7 top-7 rounded bg-carbon-950/70 px-2 py-1 text-mineral-300">DR.ROCK · VISUAL ANALYSIS</div>
      <div className="label-mono absolute bottom-7 right-7 rounded bg-carbon-950/70 px-2 py-1 text-mineral-300">
        <span className="animate-blink">▮</span> PROCESSING
      </div>
    </div>
  );
}
