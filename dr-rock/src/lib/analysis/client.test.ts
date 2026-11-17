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
});
