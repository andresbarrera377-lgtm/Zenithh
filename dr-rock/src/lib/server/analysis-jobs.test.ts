import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// In-memory stand-in for Netlify Blobs.
const blobs = new Map<string, unknown>();
vi.mock("@netlify/blobs", () => ({
  getStore: () => ({
    get: async (key: string) => (blobs.has(key) ? structuredClone(blobs.get(key)) : null),
    setJSON: async (key: string, value: unknown) => void blobs.set(key, structuredClone(value)),
  }),
}));

const { JOB_EXPIRY_MS, claimJob, createJob, finishJob, getJobStatus } = await import("./analysis-jobs");

const JOB = "0f8b1d2e-3c4a-4b5c-9d6e-7f8091a2b3c4";
const ok = { ok: false as const, error: { code: "AI_REFUSED" as const, message: "declined" } };

beforeEach(() => blobs.clear());
afterEach(() => vi.useRealTimers());

describe("analysis jobs", () => {
  it("claims a job once, with the right token, and drops the photo when claimed", async () => {
    await createJob(JOB, { token: "secret", images: [{ data: "AAAA", mediaType: "image/jpeg" }] });
    expect(await claimJob(JOB, "wrong")).toBeNull();
    const claimed = await claimJob(JOB, "secret");
    expect(claimed?.images[0].data).toBe("AAAA");
    expect(JSON.stringify(blobs.get(JOB))).not.toContain("AAAA");
    expect(await claimJob(JOB, "secret")).toBeNull();
  });

  it("reports pending, then the stored result", async () => {
    await createJob(JOB, { token: "t", images: [{ data: "AAAA", mediaType: "image/png" }] });
    expect(await getJobStatus(JOB)).toEqual({ state: "pending" });
    await claimJob(JOB, "t");
    expect(await getJobStatus(JOB)).toEqual({ state: "pending" });
    await finishJob(JOB, Date.now(), ok);
    expect(await getJobStatus(JOB)).toEqual({ state: "done", response: ok });
  });

  it("expires jobs that never finish and rejects malformed ids", async () => {
    vi.useFakeTimers();
    await createJob(JOB, { token: "t", images: [{ data: "AAAA", mediaType: "image/jpeg" }] });
    vi.advanceTimersByTime(JOB_EXPIRY_MS + 1);
    expect(await getJobStatus(JOB)).toEqual({ state: "expired" });
    expect(await getJobStatus("../etc/passwd")).toEqual({ state: "missing" });
    expect(await claimJob("../etc/passwd", "t")).toBeNull();
  });
});
