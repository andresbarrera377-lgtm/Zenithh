/**
 * Integration test for POST /api/analyze.
 * The real Anthropic SDK is used, pointed at a local stub of the Messages API, so the
 * full path (validation → SDK call → structured-output parsing → normalization) runs.
 */
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import sharp from "sharp";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { EXAMPLE_ANALYSIS } from "@/lib/analysis/example";
import { toWire } from "@/lib/analysis/wire";
import type { AnalyzeResponse } from "@/lib/analysis/schema";

type StubReply = { status?: number; body: unknown };
let nextReply: StubReply;
let lastRequestBody: Record<string, unknown> | null = null;
let lastBetaHeader: string | undefined;
let server: Server;

function message(content: unknown[], stop_reason = "end_turn") {
  return {
    id: "msg_test",
    type: "message",
    role: "assistant",
    model: "claude-opus-5-5",
    content,
    stop_reason,
    stop_sequence: null,
    usage: { input_tokens: 10, output_tokens: 10 },
  };
}

beforeAll(async () => {
  server = createServer((req, res) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      lastRequestBody = raw ? JSON.parse(raw) : null;
      lastBetaHeader = req.headers["anthropic-beta"] as string | undefined;
      res.writeHead(nextReply.status ?? 200, { "content-type": "application/json" });
      res.end(JSON.stringify(nextReply.body));
    });
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  const { port } = server.address() as AddressInfo;
  process.env.ANTHROPIC_BASE_URL = `http://127.0.0.1:${port}`;
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  vi.resetModules();
  lastRequestBody = null;
  lastBetaHeader = undefined;
  delete process.env.DR_ROCK_SERVER_FALLBACKS;
  delete process.env.DR_ROCK_DEBUG_ERRORS;
  process.env.ANTHROPIC_API_KEY = "test-key";
  process.env.RATE_LIMIT_MAX = "100";
});

async function photo(width = 640, height = 480, format: "jpeg" | "png" = "jpeg"): Promise<Blob> {
  const img = sharp({ create: { width, height, channels: 3, background: { r: 120, g: 110, b: 100 } } });
  const buf = format === "jpeg" ? await img.jpeg().toBuffer() : await img.png().toBuffer();
  return new Blob([new Uint8Array(buf)], { type: `image/${format}` });
}

async function post(form: FormData): Promise<{ status: number; body: AnalyzeResponse }> {
  const { POST } = await import("@/app/api/analyze/route");
  const res = await POST(new Request("http://localhost/api/analyze", { method: "POST", body: form }));
  return { status: res.status, body: (await res.json()) as AnalyzeResponse };
}

describe("POST /api/analyze", () => {
  it("sends the server-side fallback beta by default", async () => {
    nextReply = { body: message([{ type: "text", text: JSON.stringify(toWire(EXAMPLE_ANALYSIS)) }]) };
    const form = new FormData();
    form.append("image", await photo(), "rock.jpg");
    const { status } = await post(form);
    expect(status).toBe(200);
    expect(lastBetaHeader).toContain("server-side-fallback-2026-07-01");
    expect(lastRequestBody?.fallbacks).toBe("default");
  });

  it("returns the upstream error detail only when DR_ROCK_DEBUG_ERRORS=on", async () => {
    const rejection = { status: 400, body: { type: "error", error: { type: "invalid_request_error", message: "unsupported thing" } } };
    const form = () => {
      const f = new FormData();
      return photo().then((p) => (f.append("image", p, "rock.jpg"), f));
    };
    nextReply = rejection;
    const quiet = await post(await form());
    expect(quiet.status).toBe(422);
    expect(quiet.body.ok === false && quiet.body.error.detail).toBeFalsy();

    process.env.DR_ROCK_DEBUG_ERRORS = "on";
    nextReply = rejection;
    const verbose = await post(await form());
    expect(verbose.body.ok === false && verbose.body.error.detail).toContain("unsupported thing");
  });

  it("uses GA structured outputs with no beta header when fallbacks are off (AI gateways)", async () => {
    process.env.DR_ROCK_SERVER_FALLBACKS = "off";
    nextReply = { body: message([{ type: "text", text: JSON.stringify(toWire(EXAMPLE_ANALYSIS)) }]) };
    const form = new FormData();
    form.append("image", await photo(), "rock.jpg");
    const { status, body } = await post(form);
    expect(status).toBe(200);
    expect(body.ok).toBe(true);
    expect(lastBetaHeader).toBeUndefined();
    expect(lastRequestBody).not.toHaveProperty("fallbacks");
    expect(lastRequestBody).not.toHaveProperty("output_config.format");
    expect(String(lastRequestBody?.system)).toContain("<json_schema>");
  });

  it("returns a validated, normalized report from the model", async () => {
    nextReply = { body: message([{ type: "text", text: JSON.stringify(toWire(EXAMPLE_ANALYSIS)) }]) };
    const form = new FormData();
    form.append("image", await photo(), "rock.jpg");
    form.append("context", JSON.stringify({ location: "Gotland, Sweden" }));

    const { status, body } = await post(form);
    expect(status).toBe(200);
    expect(body.ok).toBe(true);
    if (!body.ok) return;
    expect(body.analysis.identification.rockName).toBe("Fossiliferous limestone");
    expect(body.meta.model).toBe("claude-opus-5-5");

    // The request sent to the model: image + structured output schema + server-side fallback.
    const sent = lastRequestBody as { messages: Array<{ content: Array<{ type: string; text?: string }> }>; output_config: Record<string, unknown>;
      system: unknown; fallbacks: string };
    expect(sent.messages[0].content[0].type).toBe("image");
    expect(sent.messages[0].content[1].text).toContain("Gotland, Sweden");
    expect(sent.output_config).toEqual({ effort: "high" });
    expect(String(sent.system)).toContain("<json_schema>");
    expect(sent.fallbacks).toBe("default");
  });

  it("refuses to answer when no API key is configured (never fabricates)", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const form = new FormData();
    form.append("image", await photo(), "rock.jpg");
    const { status, body } = await post(form);
    expect(status).toBe(503);
    expect(body).toMatchObject({ ok: false, error: { code: "AI_NOT_CONFIGURED" } });
  });

  it("maps a model refusal to AI_REFUSED", async () => {
    nextReply = { body: message([], "refusal") };
    const form = new FormData();
    form.append("image", await photo(), "rock.jpg");
    const { status, body } = await post(form);
    expect(status).toBe(422);
    expect(body).toMatchObject({ ok: false, error: { code: "AI_REFUSED" } });
  });

  it("accepts a report wrapped in a Markdown code fence", async () => {
    nextReply = { body: message([{ type: "text", text: "```json\n" + JSON.stringify(toWire(EXAMPLE_ANALYSIS)) + "\n```" }]) };
    const form = new FormData();
    form.append("image", await photo(), "rock.jpg");
    const { status, body } = await post(form);
    expect(status).toBe(200);
    expect(body.ok).toBe(true);
  });

  it("rejects JSON that does not match the report schema", async () => {
    const partial = { ...toWire(EXAMPLE_ANALYSIS), verdict: "definitely_a_dinosaur" };
    nextReply = { body: message([{ type: "text", text: JSON.stringify(partial) }]) };
    const form = new FormData();
    form.append("image", await photo(), "rock.jpg");
    const { status, body } = await post(form);
    expect(status).toBe(502);
    expect(body).toMatchObject({ ok: false, error: { code: "AI_INVALID_RESPONSE" } });
  });

  it("reports malformed model output instead of showing it", async () => {
    nextReply = { body: message([{ type: "text", text: '{"verdict":"probable_fossil"}' }]) };
    const form = new FormData();
    form.append("image", await photo(), "rock.jpg");
    const { status, body } = await post(form);
    expect(status).toBe(502);
    expect(body).toMatchObject({ ok: false, error: { code: "AI_INVALID_RESPONSE" } });
  });

  it("maps provider outages to AI_UNAVAILABLE", async () => {
    nextReply = { status: 500, body: { type: "error", error: { type: "api_error", message: "boom" } } };
    const form = new FormData();
    form.append("image", await photo(), "rock.jpg");
    const { body } = await post(form);
    expect(body).toMatchObject({ ok: false, error: { code: "AI_UNAVAILABLE" } });
  }, 30_000);

  it("rejects files that are not images", async () => {
    const form = new FormData();
    form.append("image", new Blob(["not an image at all, just text"], { type: "image/jpeg" }), "fake.jpg");
    const { status, body } = await post(form);
    expect(status).toBe(415);
    expect(body).toMatchObject({ ok: false, error: { code: "UNSUPPORTED_IMAGE_TYPE" } });
  });

  it("rejects images that are too small to analyze", async () => {
    const form = new FormData();
    form.append("image", await photo(120, 100, "png"), "tiny.png");
    const { status, body } = await post(form);
    expect(status).toBe(400);
    expect(body).toMatchObject({ ok: false, error: { code: "INVALID_IMAGE" } });
  });

  it("caps the upload size even without a Content-Length header", async () => {
    const chunk = new Uint8Array(1024 * 1024);
    let sent = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        if (sent >= 8) return controller.close();
        sent++;
        controller.enqueue(chunk);
      },
    });
    const { POST } = await import("@/app/api/analyze/route");
    const res = await POST(
      new Request("http://localhost/api/analyze", {
        method: "POST",
        body: stream,
        headers: { "content-type": "multipart/form-data; boundary=x" },
        // @ts-expect-error `duplex` is required by undici for streaming bodies
        duplex: "half",
      }),
    );
    expect(res.status).toBe(413);
    expect(sent).toBeLessThan(8); // stopped reading early
  });

  it("rejects requests without an image", async () => {
    const { status, body } = await post(new FormData());
    expect(status).toBe(400);
    expect(body).toMatchObject({ ok: false, error: { code: "INVALID_REQUEST" } });
  });
});

describe("POST /api/analyze in Netlify job mode", () => {
  it("stores the job, starts the background function and answers 202", async () => {
    process.env.DR_ROCK_JOB_MODE = "netlify-background";
    const created: Array<{ id: string; job: Record<string, unknown> }> = [];
    vi.doMock("@/lib/server/analysis-jobs", () => ({
      createJob: async (id: string, job: Record<string, unknown>) => void created.push({ id, job }),
    }));
    const realFetch = globalThis.fetch;
    const started: Array<{ url: string; body: string }> = [];
    vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
      started.push({ url: String(url), body: String(init.body) });
      return new Response(null, { status: 202 });
    });
    try {
      const form = new FormData();
      form.append("image", await photo(), "rock.jpg");
      const { POST } = await import("@/app/api/analyze/route");
      const res = await POST(new Request("https://dr-rock.example/api/analyze", { method: "POST", body: form }));
      const body = await res.json();
      expect(res.status).toBe(202);
      expect(body).toMatchObject({ pending: true, jobId: created[0].id });
      expect(created[0].job).toMatchObject({ mediaType: "image/jpeg" });
      expect(started[0].url).toBe("https://dr-rock.example/.netlify/functions/analyze-background");
      expect(JSON.parse(started[0].body)).toEqual({ jobId: created[0].id, token: created[0].job.token });
      expect(lastRequestBody).toBeNull(); // no AI call from the request itself
    } finally {
      vi.stubGlobal("fetch", realFetch);
      vi.doUnmock("@/lib/server/analysis-jobs");
      delete process.env.DR_ROCK_JOB_MODE;
    }
  });

  it("reports AI_UNAVAILABLE when the background function cannot start", async () => {
    process.env.DR_ROCK_JOB_MODE = "netlify-background";
    vi.doMock("@/lib/server/analysis-jobs", () => ({ createJob: async () => undefined }));
    const realFetch = globalThis.fetch;
    vi.stubGlobal("fetch", async () => new Response(null, { status: 404 }));
    try {
      const form = new FormData();
      form.append("image", await photo(), "rock.jpg");
      const { status, body } = await post(form);
      expect(status).toBe(503);
      expect(body).toMatchObject({ ok: false, error: { code: "AI_UNAVAILABLE" } });
    } finally {
      vi.stubGlobal("fetch", realFetch);
      vi.doUnmock("@/lib/server/analysis-jobs");
      delete process.env.DR_ROCK_JOB_MODE;
    }
  });
});

describe("GET /api/analyze/jobs/[id]", () => {
  async function get(state: unknown) {
    vi.resetModules();
    vi.doMock("@/lib/server/analysis-jobs", () => ({ getJobStatus: async () => state }));
    vi.doMock("next/server", () => ({ connection: async () => undefined }));
    try {
      const { GET } = await import("@/app/api/analyze/jobs/[id]/route");
      const res = await GET(new Request("http://localhost/api/analyze/jobs/abc12345"), { params: Promise.resolve({ id: "abc12345" }) });
      return { status: res.status, body: await res.json() };
    } finally {
      vi.doUnmock("@/lib/server/analysis-jobs");
      vi.doUnmock("next/server");
    }
  }

  it("maps job states to responses", async () => {
    expect(await get({ state: "pending" })).toEqual({ status: 200, body: { pending: true, jobId: "abc12345", pollAfterMs: 2500 } });
    const done = { ok: false, error: { code: "AI_REFUSED", message: "declined" } };
    expect(await get({ state: "done", response: done })).toEqual({ status: 200, body: done });
    expect((await get({ state: "expired" })).body).toMatchObject({ ok: false, error: { code: "TIMEOUT" } });
    expect((await get({ state: "missing" })).status).toBe(404);
  });
});
