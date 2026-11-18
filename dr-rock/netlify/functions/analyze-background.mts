/**
 * Netlify background function (up to 15 min) that runs one Dr.Rock analysis job.
 * The API route stores the photo as a job and calls this with { jobId, token }; the result is
 * written back to the job for the client to poll. Never throws: Netlify retries background
 * functions that fail, and a retry would run (and bill) the same analysis again.
 */
import { runAnalysis } from "../../src/lib/ai/analyze-core";
import { claimJob, finishJob } from "../../src/lib/server/analysis-jobs";

async function analyzeBackground(request: Request): Promise<void> {
  let jobId = "";
  let token = "";
  try {
    const body = (await request.json()) as { jobId?: unknown; token?: unknown };
    jobId = String(body.jobId ?? "");
    token = String(body.token ?? "");
  } catch {
    return;
  }

  let job;
  try {
    job = await claimJob(jobId, token);
  } catch (error) {
    console.error(`[dr-rock] ${jobId} could not claim job`, error);
    return;
  }
  if (!job) return;

  const { body } = await runAnalysis(
    { imageBase64: job.imageBase64, mediaType: job.mediaType, context: job.context },
    jobId,
    job.createdAt,
  );
  try {
    await finishJob(jobId, job.createdAt, body);
  } catch (error) {
    console.error(`[dr-rock] ${jobId} could not store the result`, error);
  }
}

export default analyzeBackground;

export const config = { background: true };
