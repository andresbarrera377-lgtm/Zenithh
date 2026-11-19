import type { Locale } from "../i18n/config";
import type { UploadRole } from "./photos";
import type { AnalyzeResponse, FieldContext, FieldTests } from "./schema";

/** Upper bound for a whole analysis from the browser (two AI passes with several photos). */
const CLIENT_TIMEOUT_MS = 8 * 60 * 1000;

export type AnalysisProgress = "analyzing" | "reviewing";

function failure(code: Extract<AnalyzeResponse, { ok: false }>["error"]["code"], message: string): AnalyzeResponse {
  return { ok: false, error: { code, message } };
}

/** Body of a 202 from hosts that run the analysis as a background job (see analysis-jobs.ts). */
interface JobAccepted {
  pending: true;
  jobId: string;
  pollAfterMs?: number;
  stage?: AnalysisProgress;
}

const DEFAULT_POLL_MS = 2500;
const MAX_POLL_NETWORK_FAILURES = 3;

function isPending(body: unknown): body is JobAccepted {
  return !!body && typeof body === "object" && (body as JobAccepted).pending === true && typeof (body as JobAccepted).jobId === "string";
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null; // Non-JSON (e.g. a platform error page).
  }
}

function toResult(response: Response, body: unknown): AnalyzeResponse {
  if (body && typeof body === "object" && "ok" in body) return body as AnalyzeResponse;
  if (response.status === 413) return failure("IMAGE_TOO_LARGE", "The image is too large for the server.");
  if (response.status === 504) return failure("TIMEOUT", "The server took too long to respond. Please try again.");
  return failure("UNKNOWN", `The server returned an unexpected response (${response.status}).`);
}

function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * Sends a prepared image to the Dr.Rock backend and returns the report. On hosts that run the
 * analysis as a background job the server answers 202 with a job id, and this polls until the
 * report is ready. Never throws: every failure is returned as a typed error so the UI can show an
 * honest message instead of a fake result.
 */
export interface UploadPhoto {
  blob: Blob;
  role?: UploadRole;
}

export async function requestAnalysis(
  photos: Blob | UploadPhoto[],
  context: FieldContext | undefined,
  signal?: AbortSignal,
  /** Language the AI writes the report in. */
  lang?: Locale,
  /** Called with the server's progress ("analyzing", then "reviewing") while a job runs. */
  onProgress?: (stage: AnalysisProgress) => void,
): Promise<AnalyzeResponse> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return failure("OFFLINE", "You appear to be offline. Connect to the internet to analyze a rock.");
  }

  const list: UploadPhoto[] = photos instanceof Blob ? [{ blob: photos }] : photos;
  const form = new FormData();
  list.forEach((photo, i) => form.append("image", photo.blob, `specimen-${i + 1}.jpg`));
  if (list.some((p) => p.role)) form.append("photoRoles", JSON.stringify(list.map((p) => p.role ?? null)));
  const cleaned = cleanContext(context);
  if (cleaned) form.append("context", JSON.stringify(cleaned));
  if (lang) form.append("lang", lang);

  // Combine the caller's cancel signal with a timeout manually: AbortSignal.any/timeout are
  // missing in Safari before 17.4, and using them there made the analysis hang forever.
  // The timeout covers the whole wait, upload and polling included.
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, CLIENT_TIMEOUT_MS);
  const onCancel = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener("abort", onCancel, { once: true });

  try {
    const response = await fetch("/api/analyze", { method: "POST", body: form, signal: controller.signal });
    const body = await readJson(response);
    if (!isPending(body)) return toResult(response, body);

    const jobUrl = `/api/analyze/jobs/${encodeURIComponent(body.jobId)}`;
    let wait = body.pollAfterMs ?? DEFAULT_POLL_MS;
    let networkFailures = 0;
    for (;;) {
      await delay(wait, controller.signal);
      let poll: Response;
      try {
        poll = await fetch(jobUrl, { cache: "no-store", signal: controller.signal });
      } catch (error) {
        // A dropped connection while waiting (mobile networks) is retried a few times.
        if (controller.signal.aborted || ++networkFailures > MAX_POLL_NETWORK_FAILURES) throw error;
        continue;
      }
      networkFailures = 0;
      const next = await readJson(poll);
      if (isPending(next)) {
        if (next.stage === "analyzing" || next.stage === "reviewing") onProgress?.(next.stage);
        wait = next.pollAfterMs ?? DEFAULT_POLL_MS;
        continue;
      }
      return toResult(poll, next);
    }
  } catch (error) {
    if (timedOut) return failure("TIMEOUT", "The analysis took too long. Please try again.");
    if (signal?.aborted) return failure("TIMEOUT", "The analysis was cancelled.");
    if (error instanceof TypeError) {
      return failure("NETWORK_ERROR", "Could not reach the Dr.Rock server. Check your connection and try again.");
    }
    return failure("UNKNOWN", "Something went wrong while sending the image.");
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onCancel);
  }
}

/** Drops empty notes and untested items; returns null when nothing is left to send. */
export function cleanContext(context: FieldContext | undefined): FieldContext | null {
  if (!context) return null;
  const out: FieldContext = {};
  for (const key of ["location", "size", "notes"] as const) {
    const value = context[key]?.trim();
    if (value) out[key] = value;
  }
  const tests: FieldTests = {};
  for (const [key, value] of Object.entries(context.tests ?? {})) {
    const v = typeof value === "string" ? value.trim() : value;
    if (v) (tests as Record<string, unknown>)[key] = v;
  }
  if (Object.keys(tests).length > 0) out.tests = tests;
  return Object.keys(out).length > 0 ? out : null;
}

export async function fetchAiStatus(): Promise<{ configured: boolean; model: string | null } | null> {
  try {
    const res = await fetch("/api/health", { cache: "no-store" });
    if (!res.ok) return null;
    const body = (await res.json()) as { ai?: { configured: boolean; model: string | null } };
    return body.ai ?? null;
  } catch {
    return null;
  }
}
