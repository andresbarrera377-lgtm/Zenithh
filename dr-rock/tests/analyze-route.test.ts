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
/** Replies used in order before falling back to `nextReply` (first pass, review pass…). */
let replyQueue: StubReply[] = [];
let lastRequestBody: Record<string, unknown> | null = null;
let requestBodies: Array<Record<string, unknown>> = [];
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
      if (lastRequestBody) requestBodies.push(lastRequestBody);
      lastBetaHeader = req.headers["anthropic-beta"] as string | undefined;
      const reply = replyQueue.shift() ?? nextReply;
      res.writeHead(reply.status ?? 200, { "content-type": "application/json" });
      res.end(JSON.stringify(reply.body));
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
  requestBodies = [];
  replyQueue = [];
  lastBetaHeader = undefined;
  delete process.env.DR_ROCK_REVIEW;
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

    // First pass: photo label + photo (cached) + prompt, with the schema and server-side fallback.
    type Sent = { messages: Array<{ content: Array<{ type: string; text?: string; cache_control?: unknown }> }>; output_config: Record<string, unknown>;
      system: unknown; fallbacks: string };
    expect(requestBodies).toHaveLength(2);
    const sent = requestBodies[0] as Sent;
    expect(sent.messages[0].content[0].text).toContain("Photo 1 of 1");
    expect(sent.messages[0].content[1]).toMatchObject({ type: "image", cache_control: { type: "ephemeral" } });
    expect(sent.messages[0].content[2].text).toContain("Gotland, Sweden");
    expect(sent.output_config).toEqual({ effort: "high" });
    expect(String(sent.system)).toContain("<json_schema>");
    expect(sent.fallbacks).toBe("default");

    // Second pass: same photos, then the draft to review.
    const review = requestBodies[1] as Sent;
    expect(review.messages[0].content[1]).toMatchObject({ type: "image", cache_control: { type: "ephemeral" } });
    expect(review.messages[0].content[2].text).toContain("<draft_report>");
    expect(body.meta).toMatchObject({ reviewed: true, photoCount: 1 });
  });

  it("sends several photos with their roles, and rejects more than three", async () => {
    nextReply = { body: message([{ type: "text", text: JSON.stringify(toWire(EXAMPLE_ANALYSIS)) }]) };
    const form = new FormData();
    form.append("image", await photo(), "a.jpg");
    form.append("image", await photo(800, 600), "b.jpg");
    form.append("photoRoles", JSON.stringify(["overview", "closeup"]));
    const { status, body } = await post(form);
    expect(status).toBe(200);
    expect(body.ok && body.meta.photoCount).toBe(2);
    const content = (requestBodies[0] as { messages: Array<{ content: Array<{ type: string; text?: string }> }> }).messages[0].content;
    expect(content.map((c) => c.type)).toEqual(["text", "image", "text", "image", "text"]);
    expect(content[0].text).toContain("Photo 1 of 2 — overview");
    expect(content[2].text).toContain("Photo 2 of 2 — close-up");
    expect(content[4].text).toContain("the 2 photos above");

    const tooMany = new FormData();
    for (let i = 0; i < 4; i++) tooMany.append("image", await photo(), `${i}.jpg`);
    expect((await post(tooMany)).status).toBe(400);
  });

  it("uses the corrected report from the review pass", async () => {
    const corrected = structuredClone(EXAMPLE_ANALYSIS);
    corrected.identification.rockName = "Corrected limestone";
    replyQueue = [
      { body: message([{ type: "text", text: JSON.stringify(toWire(EXAMPLE_ANALYSIS)) }]) },
      { body: message([{ type: "text", text: JSON.stringify(toWire(corrected)) }]) },
    ];
    const form = new FormData();
    form.append("image", await photo(), "rock.jpg");
    const { body } = await post(form);
    expect(body.ok && body.analysis.identification.rockName).toBe("Corrected limestone");
    expect(body.ok && body.meta.reviewed).toBe(true);
  });

  it("keeps the first report when the review pass fails", async () => {
    replyQueue = [
      { body: message([{ type: "text", text: JSON.stringify(toWire(EXAMPLE_ANALYSIS)) }]) },
      { body: message([{ type: "text", text: "not json" }]) },
    ];
    const form = new FormData();
    form.append("image", await photo(), "rock.jpg");
    const { status, body } = await post(form);
    expect(status).toBe(200);
    expect(body.ok && body.analysis.identification.rockName).toBe("Fossiliferous limestone");
    expect(body.ok && body.meta.reviewed).toBe(false);

    replyQueue = [
      { body: message([{ type: "text", text: JSON.stringify(toWire(EXAMPLE_ANALYSIS)) }]) },
      { status: 529, body: { type: "error", error: { type: "overloaded_error", message: "busy" } } },
      { status: 529, body: { type: "error", error: { type: "overloaded_error", message: "busy" } } },
    ];
    const again = new FormData();
    again.append("image", await photo(), "rock.jpg");
    const second = await post(again);
    expect(second.status).toBe(200);
    expect(second.body.ok && second.body.meta.reviewed).toBe(false);
  });

  it("makes a single call when the review pass is turned off", async () => {
    process.env.DR_ROCK_REVIEW = "off";
    nextReply = { body: message([{ type: "text", text: JSON.stringify(toWire(EXAMPLE_ANALYSIS)) }]) };
    const form = new FormData();
    form.append("image", await photo(), "rock.jpg");
    const { body } = await post(form);
    expect(requestBodies).toHaveLength(1);
    expect(body.ok && body.meta.reviewed).toBe(false);
  });

  it("puts the user's field tests in the prompt", async () => {
    nextReply = { body: message([{ type: "text", text: JSON.stringify(toWire(EXAMPLE_ANALYSIS)) }]) };
    const form = new FormData();
    form.append("image", await photo(), "rock.jpg");
    form.append("context", JSON.stringify({ tests: { fizz: "strong", hardness: "medium", streak: "white" } }));
    expect((await post(form)).status).toBe(200);
    const prompt = (requestBodies[0] as { messages: Array<{ content: Array<{ text?: string }> }> }).messages[0].content[2].text;
    expect(prompt).toContain("Vinegar test: fizzes strongly");
    expect(prompt).toContain("a steel knife scratches it but a fingernail does not");
    expect(prompt).toContain("Streak colour: white");

    const bad = new FormData();
    bad.append("image", await photo(), "rock.jpg");
    bad.append("context", JSON.stringify({ tests: { fizz: "maybe" } }));
    expect((await post(bad)).status).toBe(400);
  });

  it("asks for the report in the language the app sends", async () => {
    nextReply = { body: message([{ type: "text", text: JSON.stringify(toWire(EXAMPLE_ANALYSIS)) }]) };
    const form = new FormData();
    form.append("image", await photo(), "rock.jpg");
    form.append("lang", "es");
    expect((await post(form)).status).toBe(200);
    const sent = requestBodies[0] as { messages: Array<{ content: Array<{ text?: string }> }> };
    expect(sent.messages[0].content[2].text).toContain("Report language: Spanish");
  });

  it("falls back to the default language (Spanish) for an unknown one with no other hint", async () => {
    nextReply = { body: message([{ type: "text", text: JSON.stringify(toWire(EXAMPLE_ANALYSIS)) }]) };
    const form = new FormData();
    form.append("image", await photo(), "rock.jpg");
    form.append("lang", "xx");
    expect((await post(form)).status).toBe(200);
    const sent = requestBodies[0] as { messages: Array<{ content: Array<{ text?: string }> }> };
    expect(sent.messages[0].content[2].text).toContain("Report language: Spanish");
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
      expect(created[0].job).toMatchObject({ images: [{ mediaType: "image/jpeg" }] });
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
