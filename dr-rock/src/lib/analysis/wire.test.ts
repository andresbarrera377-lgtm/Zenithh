import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { describe, expect, it } from "vitest";
import { EXAMPLE_ANALYSIS } from "./example";
import { RockAnalysisSchema } from "./schema";
import { RockAnalysisWireSchema, WIRE_JSON_SCHEMA, fromWire, parseWireReport, toWire } from "./wire";

/** Counts the schema features the structured-outputs grammar limits are about. */
function complexity(schema: unknown) {
  let unions = 0;
  let optional = 0;
  const walk = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== "object") return;
    const n = node as Record<string, unknown>;
    if (n.anyOf || n.oneOf || Array.isArray(n.type)) unions++;
    if (n.type === "object" && n.properties) {
      const required = new Set((n.required as string[]) ?? []);
      optional += Object.keys(n.properties as object).filter((k) => !required.has(k)).length;
    }
    Object.values(n).forEach(walk);
  };
  walk(schema);
  return { unions, optional };
}

describe("model-facing (wire) schema", () => {
  it("has no union types or optional fields (simple for the model to follow exactly)", () => {
    const format = zodOutputFormat(RockAnalysisWireSchema) as unknown as { schema: unknown };
    expect(complexity(format.schema)).toEqual({ unions: 0, optional: 0 });
  });

  it("round-trips the app report through the wire format", () => {
    const wire = toWire(EXAMPLE_ANALYSIS);
    expect(RockAnalysisWireSchema.safeParse(wire).success).toBe(true);
    expect(fromWire(wire)).toEqual(EXAMPLE_ANALYSIS);
  });

  it("turns '' and -1 sentinels back into nulls", () => {
    const wire = toWire(EXAMPLE_ANALYSIS);
    wire.identification.fossilType = "  ";
    wire.ageAndHistory.rockAge.era = "";
    wire.ageAndHistory.rockAge.minMa = -1;
    wire.ageAndHistory.fossilAge = { summary: "", periods: [], era: "", minMa: -1, maxMa: -1, basis: "" };
    wire.composition.mohsHardness.min = -1;
    wire.composition.mohsHardness.max = 0;
    wire.composition.density.value = "";
    wire.paleontology.organism = "";

    const out = fromWire(wire);
    expect(out.identification.fossilType).toBeNull();
    expect(out.ageAndHistory.rockAge.era).toBeNull();
    expect(out.ageAndHistory.rockAge.minMa).toBeNull();
    expect(out.ageAndHistory.rockAge.maxMa).toBe(EXAMPLE_ANALYSIS.ageAndHistory.rockAge.maxMa);
    expect(out.ageAndHistory.fossilAge).toBeNull();
    expect(out.composition.mohsHardness).toMatchObject({ min: null, max: null });
    expect(out.composition.density.value).toBeNull();
    expect(out.paleontology.organism).toBeNull();
    expect(RockAnalysisSchema.safeParse(out).success).toBe(true);
  });

  it("keeps 0 Ma (the present) as a real age", () => {
    const wire = toWire(EXAMPLE_ANALYSIS);
    wire.ageAndHistory.rockAge.minMa = 0;
    expect(fromWire(wire).ageAndHistory.rockAge.minMa).toBe(0);
  });
});

describe("parseWireReport", () => {
  const good = JSON.stringify(toWire(EXAMPLE_ANALYSIS));

  it("accepts a bare object, a fenced object and surrounding text", () => {
    expect(parseWireReport(good).ok).toBe(true);
    expect(parseWireReport("```json\n" + good + "\n```").ok).toBe(true);
    expect(parseWireReport("Here is the report:\n" + good).ok).toBe(true);
  });

  it("explains why a reply is rejected", () => {
    expect(parseWireReport("I cannot help with that.")).toMatchObject({ ok: false, reason: "no JSON object in the reply" });
    expect(parseWireReport("{ not json }")).toMatchObject({ ok: false });
    const missing = JSON.parse(good);
    delete missing.verdict;
    const result = parseWireReport(JSON.stringify(missing));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toContain("verdict");
  });

  it("ships the schema the parser validates against", () => {
    const schema = JSON.parse(WIRE_JSON_SCHEMA) as { properties: Record<string, unknown> };
    expect(Object.keys(schema.properties)).toEqual(Object.keys(RockAnalysisWireSchema.shape));
  });
});
