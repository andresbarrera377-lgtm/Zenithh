import type { AnalyzeResponse, FieldContext } from "./schema";

/** Upper bound for a single analysis request from the browser. */
const CLIENT_TIMEOUT_MS = 4.5 * 60 * 1000;

function failure(code: Extract<AnalyzeResponse, { ok: false }>["error"]["code"], message: string): AnalyzeResponse {
  return { ok: false, error: { code, message } };
}

/**
 * Sends a prepared image to the Dr.Rock backend. Never throws: every failure is returned
 * as a typed error so the UI can show an honest message instead of a fake result.
 */
export async function requestAnalysis(
  image: Blob,
  context: FieldContext | undefined,
  signal?: AbortSignal,
): Promise<AnalyzeResponse> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return failure("OFFLINE", "You appear to be offline. Connect to the internet to analyze a rock.");
  }

  const form = new FormData();
  form.append("image", image, "specimen.jpg");
  const cleaned = cleanContext(context);
  if (cleaned) form.append("context", JSON.stringify(cleaned));

  const timeout = AbortSignal.timeout(CLIENT_TIMEOUT_MS);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let response: Response;
  try {
    response = await fetch("/api/analyze", { method: "POST", body: form, signal: combined });
  } catch (error) {
    if (signal?.aborted) return failure("TIMEOUT", "The analysis was cancelled.");
    if (timeout.aborted) return failure("TIMEOUT", "The analysis took too long. Please try again.");
    if (error instanceof TypeError) {
      return failure("NETWORK_ERROR", "Could not reach the Dr.Rock server. Check your connection and try again.");
    }
    return failure("UNKNOWN", "Something went wrong while sending the image.");
  }

  try {
    const body = (await response.json()) as AnalyzeResponse;
    if (body && typeof body === "object" && "ok" in body) return body;
  } catch {
    // Non-JSON (e.g. platform error page).
  }
  if (response.status === 413) return failure("IMAGE_TOO_LARGE", "The image is too large for the server.");
  if (response.status === 504) return failure("TIMEOUT", "The server took too long to respond. Please try again.");
  return failure("UNKNOWN", `The server returned an unexpected response (${response.status}).`);
}

function cleanContext(context: FieldContext | undefined): FieldContext | null {
  if (!context) return null;
  const entries = Object.entries(context).filter(([, v]) => typeof v === "string" && v.trim().length > 0);
  return entries.length ? (Object.fromEntries(entries.map(([k, v]) => [k, (v as string).trim()])) as FieldContext) : null;
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
