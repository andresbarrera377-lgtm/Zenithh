/**
 * Analysis jobs for hosts whose request functions stop before a full analysis can finish
 * (Netlify: ~30 s). The API route stores the validated photo as a job, a background function
 * runs the analysis and stores the result, and the client polls for it.
 *
 * Storage is Netlify Blobs. The photo is removed from the job as soon as the background function
 * picks it up, so it is held only for the seconds between upload and pickup.
 * Imported by the Next.js routes and by netlify/functions/analyze-background.mts, so it uses
 * relative imports and nothing Next.js-specific.
 */
import type { Locale } from "../i18n/config";
import { getStore } from "@netlify/blobs";
import type { AnalyzeResponse, FieldContext } from "../analysis/schema";
import type { AllowedMediaType } from "./image-validation";

/** A job older than this without a result is reported as failed. */
export const JOB_EXPIRY_MS = 10 * 60 * 1000;

export interface QueuedJob {
  state: "queued";
  token: string;
  createdAt: number;
  imageBase64: string;
  mediaType: AllowedMediaType;
  context?: FieldContext;
  lang?: Locale;
}

interface ProcessingJob {
  state: "processing";
  createdAt: number;
  startedAt: number;
}

interface FinishedJob {
  state: "done";
  createdAt: number;
  finishedAt: number;
  response: AnalyzeResponse;
}

type JobRecord = QueuedJob | ProcessingJob | FinishedJob;

export type JobStatus =
  | { state: "pending" }
  | { state: "done"; response: AnalyzeResponse }
  | { state: "missing" }
  | { state: "expired" };

function store() {
  return getStore({ name: "dr-rock-analysis-jobs", consistency: "strong" });
}

async function read(jobId: string): Promise<JobRecord | null> {
  return ((await store().get(jobId, { type: "json" })) as JobRecord | null) ?? null;
}

export async function createJob(jobId: string, job: Omit<QueuedJob, "state" | "createdAt">): Promise<void> {
  const record: QueuedJob = { state: "queued", createdAt: Date.now(), ...job };
  await store().setJSON(jobId, record);
}

/**
 * Claims a queued job for processing: returns its photo and context and immediately replaces the
 * stored record with one that holds no photo. Returns null for unknown, already-claimed or
 * wrong-token jobs, so a stray or repeated call never runs (or bills) an analysis twice.
 */
export async function claimJob(jobId: string, token: string): Promise<QueuedJob | null> {
  if (!/^[\w-]{8,64}$/.test(jobId)) return null;
  const record = await read(jobId);
  if (!record || record.state !== "queued" || record.token !== token) return null;
  const processing: ProcessingJob = { state: "processing", createdAt: record.createdAt, startedAt: Date.now() };
  await store().setJSON(jobId, processing);
  return record;
}

export async function finishJob(jobId: string, createdAt: number, response: AnalyzeResponse): Promise<void> {
  const record: FinishedJob = { state: "done", createdAt, finishedAt: Date.now(), response };
  await store().setJSON(jobId, record);
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  if (!/^[\w-]{8,64}$/.test(jobId)) return { state: "missing" };
  const record = await read(jobId);
  if (!record) return { state: "missing" };
  if (record.state === "done") return { state: "done", response: record.response };
  if (Date.now() - record.createdAt > JOB_EXPIRY_MS) return { state: "expired" };
  return { state: "pending" };
}
