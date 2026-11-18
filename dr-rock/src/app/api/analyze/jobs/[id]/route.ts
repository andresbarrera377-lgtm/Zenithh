import { connection } from "next/server";
import type { AnalyzeResponse } from "@/lib/analysis/schema";
import { getJobStatus } from "@/lib/server/analysis-jobs";

const NO_STORE = { "Cache-Control": "no-store" };

function failure(status: number, code: "INVALID_REQUEST" | "TIMEOUT" | "AI_UNAVAILABLE", message: string): Response {
  const body: AnalyzeResponse = { ok: false, error: { code, message } };
  return Response.json(body, { status, headers: NO_STORE });
}

/** Status of a background analysis job (job mode only): pending, the final report, or an error. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  await connection();
  const { id } = await params;

  let status;
  try {
    status = await getJobStatus(id);
  } catch (error) {
    console.error(`[dr-rock] ${id} could not read job status`, error);
    return failure(503, "AI_UNAVAILABLE", "Could not check the analysis status. Please try again.");
  }

  switch (status.state) {
    case "pending":
      return Response.json({ pending: true, jobId: id, pollAfterMs: 2500 }, { headers: NO_STORE });
    case "done":
      return Response.json(status.response, { headers: NO_STORE });
    case "expired":
      return failure(504, "TIMEOUT", "The analysis took too long. Please try again.");
    case "missing":
      return failure(404, "INVALID_REQUEST", "This analysis could not be found. Please start a new one.");
  }
}
