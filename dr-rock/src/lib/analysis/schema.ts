import { z } from "zod";

/**
 * Structured report returned by the AI analysis.
 *
 * This schema is the single contract between the model, the API route and the UI:
 * - it is converted to JSON Schema and sent to Claude as a structured-output format,
 *   so field descriptions double as instructions for the model;
 * - the API validates the model output against it before returning anything;
 * - the UI renders it section by section.
 *
 * Numeric ranges (0–100, Mohs 1–10, …) are enforced after parsing in `normalize.ts`
 * because structured outputs do not support numeric min/max constraints.
 */

export const VERDICTS = [
  "probable_fossil",
  "inconclusive_fossil_like",
  "no_visible_fossil",
  "insufficient_image",
] as const;
export type Verdict = (typeof VERDICTS)[number];

export const CLASSIFICATIONS = ["igneous", "sedimentary", "metamorphic", "mineral", "unknown"] as const;
export type Classification = (typeof CLASSIFICATIONS)[number];

export const IMAGE_QUALITIES = ["good", "fair", "poor", "unusable"] as const;

const AgeEstimateSchema = z.object({
  summary: z
    .string()
    .describe(
      "One plain-language sentence, e.g. 'Most likely Paleozoic (Ordovician–Devonian)' or 'This rock type forms in every era; age cannot be narrowed from a photo'.",
    ),
  periods: z
    .array(z.string())
    .describe("Candidate ICS geological periods, most likely first (e.g. ['Jurassic', 'Cretaceous']). Empty if unknown."),
  era: z.string().nullable().describe("ICS era name (Paleozoic, Mesozoic, Cenozoic, or 'Precambrian'), or null if unknown."),
  minMa: z
    .number()
    .nullable()
    .describe("Youngest plausible age in millions of years ago (Ma). Null when it cannot be estimated responsibly."),
  maxMa: z
    .number()
    .nullable()
    .describe("Oldest plausible age in millions of years ago (Ma). Null when it cannot be estimated responsibly."),
  basis: z
    .string()
    .describe(
      "Why this range: what is typical for this rock type or fossil group. Must acknowledge that a photo cannot date a specimen.",
    ),
});

export const RockAnalysisSchema = z.object({
  imageAssessment: z.object({
    quality: z.enum(IMAGE_QUALITIES).describe("Usefulness of the photo for identification."),
    showsRockOrFossil: z
      .boolean()
      .describe("False if the photo does not show a rock, mineral or fossil (person, object, screenshot, etc.)."),
    subjectDescription: z.string().describe("Neutral description of what the photo shows, in one or two sentences."),
    issues: z.array(z.string()).describe("Problems limiting the analysis (blur, glare, distance, no scale, filters…). Empty if none."),
    photoTips: z.array(z.string()).describe("Concrete tips for a better photo of this specimen. 1–4 items."),
  }),

  verdict: z
    .enum(VERDICTS)
    .describe(
      "probable_fossil = diagnostic organic features clearly visible; inconclusive_fossil_like = something looks organic but is not diagnostic or a pseudofossil is comparably likely; no_visible_fossil = rock identifiable, no organic structures visible; insufficient_image = no responsible conclusion possible.",
    ),
  verdictSummary: z.string().describe("Headline explanation of the verdict in 1–2 sentences."),

  confidence: z.object({
    identification: z
      .number()
      .describe("Integer 0–100: how strongly visible evidence supports the rock identification. Photos rarely justify >85."),
    fossil: z.number().describe("Integer 0–100: how strongly visible evidence supports the chosen fossil verdict."),
    rationale: z.string().describe("Why these confidence levels — what raises and what limits them."),
  }),

  identification: z.object({
    rockName: z
      .string()
      .describe("Most probable name, e.g. 'Fossiliferous limestone', 'Basalt', 'Quartz (crystal)'. 'Unidentified' if impossible."),
    rockType: z.string().describe("More specific type or group, e.g. 'Bioclastic carbonate sedimentary rock'."),
    classification: z.enum(CLASSIFICATIONS).describe("Rock family. Use 'mineral' for a single mineral specimen."),
    alternatives: z
      .array(z.object({ name: z.string(), reason: z.string() }))
      .describe("0–3 other plausible identifications (including pseudofossils when relevant) and why."),
    fossilType: z
      .string()
      .nullable()
      .describe("Fossil type if one can be suggested (e.g. 'Brachiopod shells', 'Crinoid columnals'); null otherwise."),
    keyFeatures: z
      .array(
        z.object({
          feature: z.string().describe("Short label, e.g. 'Grain size'."),
          observation: z.string().describe("What is visible in this photo."),
          interpretation: z.string().describe("What it suggests geologically."),
        }),
      )
      .describe("2–6 visible features that justify the identification."),
  }),

  observations: z
    .object({
      texture: z.string(),
      color: z.string(),
      shape: z.string(),
      patterns: z.string(),
      structures: z.string(),
      organicImpressions: z.string().describe("Possible impressions or traces of organisms, or 'None visible'."),
      mineralFormations: z.string(),
      sedimentaryFeatures: z.string().describe("Layering, grains, ripple marks, etc., or 'Not applicable'."),
    })
    .describe("What is visible in the photo for each characteristic. Say 'Not visible in this photo' when appropriate."),

  ageAndHistory: z.object({
    rockAge: AgeEstimateSchema.describe("Estimated age of the rock itself."),
    fossilAge: AgeEstimateSchema.nullable().describe(
      "Age range of the suspected fossil organism group. Null when there is no fossil indication.",
    ),
    formationStory: z.string().describe("How this rock (and fossil, if any) most likely formed, in 3–5 sentences."),
    relatedEvents: z
      .array(z.string())
      .describe("1–4 geological or biological events linked to this rock type or period (e.g. 'Great Ordovician Biodiversification')."),
  }),

  geologicalSetting: z.object({
    environments: z.array(z.string()).describe("Geological environments where this rock typically forms or is found."),
    strata: z.string().describe("Kinds of layers or strata where it can appear."),
    depth: z
      .string()
      .describe("Depth at which it forms and depth at which it is usually found (always within the crust for fossils)."),
    favorableConditions: z.string().describe("Conditions that favour its formation (and fossil preservation, if relevant)."),
    worldRegions: z.array(z.string()).describe("Notable regions or localities with similar specimens. 2–5 items."),
    earthLayers: z
      .string()
      .describe(
        "Relate this specimen to Earth's crust, mantle and core. Fossils occur only in the crust — never claim a fossil comes from the mantle or core.",
      ),
  }),

  composition: z.object({
    minerals: z
      .array(z.object({ name: z.string(), role: z.string().describe("e.g. 'Major (~60%)', 'Accessory', 'Cement'.") }))
      .describe("Minerals it probably contains. Empty if unknown."),
    chemistry: z.string().describe("General chemical composition, e.g. 'Calcium carbonate (CaCO₃)'."),
    mohsHardness: z.object({
      min: z.number().nullable().describe("Typical minimum on the Mohs scale (1–10), or null if not identifiable."),
      max: z.number().nullable().describe("Typical maximum on the Mohs scale (1–10), or null if not identifiable."),
      note: z.string(),
    }),
    porosity: z.string().describe("Typical porosity, qualitative and/or percentage range."),
    density: z.object({
      value: z.string().nullable().describe("Typical density range, e.g. '2.5–2.7 g/cm³'. Null if no reliable value."),
      note: z.string(),
    }),
    physicalProperties: z.string().describe("Strength, durability, weathering behaviour, cleavage/fracture, lustre."),
  }),

  didYouKnow: z.array(z.string()).describe("3–5 accurate, specific curiosities about this rock or fossil."),

  paleontology: z.object({
    hasFossilIndications: z.boolean(),
    organism: z.string().nullable().describe("Possible organism represented, or null."),
    biologicalGroup: z.string().nullable().describe("e.g. 'Mollusca › Cephalopoda › Ammonoidea', or null."),
    periodLived: z.string().nullable().describe("When the group lived, with Ma range, or null."),
    habitat: z.string().nullable(),
    preservation: z.string().nullable().describe("How it could have been preserved (mold, cast, permineralization…), or null."),
    scientificImportance: z.string().nullable(),
    noFossilExplanation: z
      .string()
      .nullable()
      .describe("If no fossil indications: why this rock may not contain fossils (e.g. igneous origin). Otherwise null."),
  }),

  verificationSteps: z
    .array(z.string())
    .describe("2–5 practical ways to confirm the identification (streak, hardness, acid test, hand lens, museum/survey)."),
});

export type RockAnalysis = z.infer<typeof RockAnalysisSchema>;
export type AgeEstimate = z.infer<typeof AgeEstimateSchema>;

/** Optional context the user can add about where/how the specimen was found. */
export const FieldContextSchema = z.object({
  location: z.string().trim().max(120).optional(),
  size: z.string().trim().max(60).optional(),
  notes: z.string().trim().max(500).optional(),
});
export type FieldContext = z.infer<typeof FieldContextSchema>;

export interface AnalysisMeta {
  requestId: string;
  model: string;
  analyzedAt: string;
  durationMs: number;
}

export type AnalysisErrorCode =
  | "AI_NOT_CONFIGURED"
  | "AI_UNAVAILABLE"
  | "AI_BUSY"
  | "AI_REFUSED"
  | "AI_INVALID_RESPONSE"
  | "AI_REQUEST_REJECTED"
  | "INVALID_REQUEST"
  | "INVALID_IMAGE"
  | "UNSUPPORTED_IMAGE_TYPE"
  | "IMAGE_TOO_LARGE"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "NETWORK_ERROR"
  | "OFFLINE"
  | "UNKNOWN";

export type AnalyzeResponse =
  | { ok: true; analysis: RockAnalysis; meta: AnalysisMeta }
  | { ok: false; error: { code: AnalysisErrorCode; message: string; retryAfterSeconds?: number } };
