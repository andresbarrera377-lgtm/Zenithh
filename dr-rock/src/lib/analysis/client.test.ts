import { afterEach, describe, expect, it, vi } from "vitest";
import { requestAnalysis } from "./client";
import { EXAMPLE_ANALYSIS } from "./example";

const okBody = {
  ok: true,
  analysis: EXAMPLE_ANALYSIS,
  meta: { requestId: "r1", model: "claude-opus-5-5", analyzedAt: new Date(0).toISOString(), durationMs: 1 },
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("requestAnalysis", () => {
  it("works in browsers without AbortSignal.any / AbortSignal.timeout (Safari < 17.4)", async () => {
    const any = AbortSignal.any;
    const timeout = AbortSignal.timeout;
    // @ts-expect-error simulate an older browser
    delete AbortSignal.any;
    // @ts-expect-error simulate an older browser
    delete AbortSignal.timeout;
    vi.stubGlobal("fetch", vi.fn(async () => Response.json(okBody)));
    try {
      const res = await requestAnalysis(new Blob(["x"], { type: "image/jpeg" }), undefined, new AbortController().signal);
      expect(res.ok).toBe(true);
    } finally {
      AbortSignal.any = any;
      AbortSignal.timeout = timeout;
    }
  });

  it("reports cancellation without throwing", async () => {
    const controller = new AbortController();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url: string, init: RequestInit) =>
          new Promise((_resolve, reject) => {
            init.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
          }),
      ),
    );
    const pending = requestAnalysis(new Blob(["x"]), undefined, controller.signal);
    controller.abort();
    await expect(pending).resolves.toMatchObject({ ok: false, error: { code: "TIMEOUT" } });
  });

  it("turns network failures into a typed error", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("Failed to fetch"))));
    await expect(requestAnalysis(new Blob(["x"]), undefined)).resolves.toMatchObject({ ok: false, error: { code: "NETWORK_ERROR" } });
  });

  it("only sends non-empty field notes", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => Response.json(okBody));
    vi.stubGlobal("fetch", fetchMock);
    await requestAnalysis(new Blob(["x"]), { location: "  Dover  ", notes: "   " });
    const form = fetchMock.mock.calls[0][1]?.body as FormData;
    expect(JSON.parse(form.get("context") as string)).toEqual({ location: "Dover" });
  });

  it("sends the report language when given", async () => {
    const fetchMock = vi.fn(async () => Response.json(okBody));
    vi.stubGlobal("fetch", fetchMock);
    await requestAnalysis(new Blob(["x"]), undefined, undefined, "es");
    const form = (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as FormData;
    expect(form.get("lang")).toBe("es");
  });
});

describe("requestAnalysis with background jobs (Netlify)", () => {
  const photo = () => new Blob(["x"], { type: "image/jpeg" });
  const pending = (jobId = "job-12345678") => Response.json({ pending: true, jobId, pollAfterMs: 1 }, { status: 202 });

  it("polls the job until the report is ready", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(pending())
      .mockResolvedValueOnce(Response.json({ pending: true, jobId: "job-12345678", pollAfterMs: 1 }))
      .mockResolvedValueOnce(Response.json(okBody));
    vi.stubGlobal("fetch", fetchMock);

    const res = await requestAnalysis(photo(), undefined);
    expect(res.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(String(fetchMock.mock.calls[1][0])).toBe("/api/analyze/jobs/job-12345678");
  });

  it("returns the job's error report as-is", async () => {
    const failed = { ok: false, error: { code: "AI_REFUSED", message: "declined" } };
    vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockResolvedValueOnce(pending()).mockResolvedValueOnce(Response.json(failed)));
    const res = await requestAnalysis(photo(), undefined);
    expect(res).toEqual(failed);
  });

  it("rides out a few dropped connections while polling", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockResolvedValueOnce(pending())
        .mockRejectedValueOnce(new TypeError("network"))
        .mockRejectedValueOnce(new TypeError("network"))
        .mockResolvedValueOnce(Response.json(okBody)),
    );
    const res = await requestAnalysis(photo(), undefined);
    expect(res.ok).toBe(true);
  });

  it("gives up with NETWORK_ERROR after repeated polling failures", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(pending()).mockRejectedValue(new TypeError("network"));
    vi.stubGlobal("fetch", fetchMock);
    const res = await requestAnalysis(photo(), undefined);
    expect(res).toMatchObject({ ok: false, error: { code: "NETWORK_ERROR" } });
  });

  it("stops polling when cancelled", async () => {
    const controller = new AbortController();
    const fetchMock = vi.fn<typeof fetch>().mockImplementation(async (url) => {
      if (String(url).includes("/jobs/")) controller.abort();
      return String(url).includes("/jobs/") ? Response.json({ pending: true, jobId: "job-12345678", pollAfterMs: 1 }) : pending();
    });
    vi.stubGlobal("fetch", fetchMock);
    const res = await requestAnalysis(photo(), undefined, controller.signal);
    expect(res).toMatchObject({ ok: false, error: { code: "TIMEOUT", message: "The analysis was cancelled." } });
  });
});
