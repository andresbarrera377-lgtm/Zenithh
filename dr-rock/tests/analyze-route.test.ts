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
import type { AnalyzeResponse } from "@/lib/analysis/schema";

type StubReply = { status?: number; body: unknown };
let nextReply: StubReply;
let lastRequestBody: Record<string, unknown> | null = null;
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
  it("returns a validated, normalized report from the model", async () => {
    nextReply = { body: message([{ type: "text", text: JSON.stringify(EXAMPLE_ANALYSIS) }]) };
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
    const sent = lastRequestBody as { messages: Array<{ content: Array<{ type: string; text?: string }> }>; output_config: { format: { type: string } }; fallbacks: string };
    expect(sent.messages[0].content[0].type).toBe("image");
    expect(sent.messages[0].content[1].text).toContain("Gotland, Sweden");
    expect(sent.output_config.format.type).toBe("json_schema");
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

  it("rejects requests without an image", async () => {
    const { status, body } = await post(new FormData());
    expect(status).toBe(400);
    expect(body).toMatchObject({ ok: false, error: { code: "INVALID_REQUEST" } });
  });
});
