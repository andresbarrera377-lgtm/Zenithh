import { z } from "zod";
import { CLASSIFICATIONS, IMAGE_QUALITIES, VERDICTS, type AgeEstimate, type RockAnalysis } from "./schema";

/**
 * Model-facing version of the report, sent to Claude as the structured-output format.
 *
 * Structured outputs compile the JSON schema into a grammar. Nullable fields are union types,
 * whose compilation cost grows exponentially, and the full report with them exceeded the API's
 * grammar size limit ("compiled grammar is too large"). This schema therefore has no unions and
 * no optional fields: "not applicable / unknown" is written as "" for text and -1 for numbers,
 * and `fromWire()` turns those back into the app's `null`s. Field descriptions double as
 * instructions for the model.
 */

const UNKNOWN = "Use '' when unknown or not applicable.";

const WireAgeSchema = z.object({
  summary: z
    .string()
    .describe(
      "One plain-language sentence, e.g. 'Most likely Paleozoic (Ordovician–Devonian)' or 'This rock type forms in every era; age cannot be narrowed from a photo'.",
    ),
  periods: z
    .array(z.string())
    .describe("Candidate ICS geological periods, most likely first (e.g. ['Jurassic', 'Cretaceous']). Empty if unknown."),
  era: z.string().describe(`ICS era name (Paleozoic, Mesozoic, Cenozoic, or 'Precambrian'). ${UNKNOWN}`),
  minMa: z.number().describe("Youngest plausible age in millions of years ago (Ma). -1 when it cannot be estimated responsibly."),
  maxMa: z.number().describe("Oldest plausible age in millions of years ago (Ma). -1 when it cannot be estimated responsibly."),
  basis: z
    .string()
    .describe("Why this range: what is typical for this rock type or fossil group. Must acknowledge that a photo cannot date a specimen."),
});

export const RockAnalysisWireSchema = z.object({
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
      .describe(`Fossil type if one can be suggested (e.g. 'Brachiopod shells', 'Crinoid columnals'). ${UNKNOWN}`),
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
    rockAge: WireAgeSchema.describe("Estimated age of the rock itself."),
    fossilAge: WireAgeSchema.describe(
      "Age range of the suspected fossil organism group. With no fossil indication: summary '', periods [], era '', minMa -1, maxMa -1, basis ''.",
    ),
    formationStory: z.string().describe("How this rock (and fossil, if any) most likely formed, in 3–5 sentences."),
    relatedEvents: z
      .array(z.string())
      .describe("1–4 geological or biological events linked to this rock type or period (e.g. 'Great Ordovician Biodiversification')."),
  }),

  geologicalSetting: z.object({
    environments: z.array(z.string()).describe("Geological environments where this rock typically forms or is found."),
    strata: z.string().describe("Kinds of layers or strata where it can appear."),
    depth: z.string().describe("Depth at which it forms and depth at which it is usually found (always within the crust for fossils)."),
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
      min: z.number().describe("Typical minimum on the Mohs scale (1–10). -1 if not identifiable."),
      max: z.number().describe("Typical maximum on the Mohs scale (1–10). -1 if not identifiable."),
      note: z.string(),
    }),
    porosity: z.string().describe("Typical porosity, qualitative and/or percentage range."),
    density: z.object({
      value: z.string().describe(`Typical density range, e.g. '2.5–2.7 g/cm³'. Use '' if there is no reliable value.`),
      note: z.string(),
    }),
    physicalProperties: z.string().describe("Strength, durability, weathering behaviour, cleavage/fracture, lustre."),
  }),

  didYouKnow: z.array(z.string()).describe("3–5 accurate, specific curiosities about this rock or fossil."),

  paleontology: z
    .object({
      hasFossilIndications: z.boolean(),
      organism: z.string().describe("Possible organism represented."),
      biologicalGroup: z.string().describe("e.g. 'Mollusca › Cephalopoda › Ammonoidea'."),
      periodLived: z.string().describe("When the group lived, with Ma range."),
      habitat: z.string(),
      preservation: z.string().describe("How it could have been preserved (mold, cast, permineralization…)."),
      scientificImportance: z.string(),
      noFossilExplanation: z
        .string()
        .describe("If there are no fossil indications: why this rock may not contain fossils (e.g. igneous origin). Otherwise ''."),
    })
    .describe(`Fields that do not apply to this specimen are ''. ${UNKNOWN}`),

  verificationSteps: z
    .array(z.string())
    .describe("2–5 practical ways to confirm the identification (streak, hardness, acid test, hand lens, museum/survey)."),
});

export type RockAnalysisWire = z.infer<typeof RockAnalysisWireSchema>;
type WireAge = z.infer<typeof WireAgeSchema>;

const text = (value: string): string | null => (value.trim() ? value : null);
const ma = (value: number): number | null => (value < 0 ? null : value);
const mohs = (value: number): number | null => (value <= 0 ? null : value);

function ageFromWire(age: WireAge): AgeEstimate {
  return { summary: age.summary, periods: age.periods, era: text(age.era), minMa: ma(age.minMa), maxMa: ma(age.maxMa), basis: age.basis };
}

function ageToWire(age: AgeEstimate | null): WireAge {
  if (!age) return { summary: "", periods: [], era: "", minMa: -1, maxMa: -1, basis: "" };
  return { ...age, era: age.era ?? "", minMa: age.minMa ?? -1, maxMa: age.maxMa ?? -1 };
}

/** Converts the model's union-free report into the app's report (sentinels → null). */
export function fromWire(wire: RockAnalysisWire): RockAnalysis {
  const { ageAndHistory, composition, identification, paleontology } = wire;
  const fossilAge = ageAndHistory.fossilAge.summary.trim() ? ageFromWire(ageAndHistory.fossilAge) : null;
  return {
    ...wire,
    identification: { ...identification, fossilType: text(identification.fossilType) },
    ageAndHistory: { ...ageAndHistory, rockAge: ageFromWire(ageAndHistory.rockAge), fossilAge },
    composition: {
      ...composition,
      mohsHardness: { ...composition.mohsHardness, min: mohs(composition.mohsHardness.min), max: mohs(composition.mohsHardness.max) },
      density: { ...composition.density, value: text(composition.density.value) },
    },
    paleontology: {
      hasFossilIndications: paleontology.hasFossilIndications,
      organism: text(paleontology.organism),
      biologicalGroup: text(paleontology.biologicalGroup),
      periodLived: text(paleontology.periodLived),
      habitat: text(paleontology.habitat),
      preservation: text(paleontology.preservation),
      scientificImportance: text(paleontology.scientificImportance),
      noFossilExplanation: text(paleontology.noFossilExplanation),
    },
  };
}

/** Inverse of `fromWire`, used to build model-shaped fixtures in tests. */
export function toWire(analysis: RockAnalysis): RockAnalysisWire {
  const { ageAndHistory, composition, identification, paleontology } = analysis;
  return {
    ...analysis,
    identification: { ...identification, fossilType: identification.fossilType ?? "" },
    ageAndHistory: { ...ageAndHistory, rockAge: ageToWire(ageAndHistory.rockAge), fossilAge: ageToWire(ageAndHistory.fossilAge) },
    composition: {
      ...composition,
      mohsHardness: { ...composition.mohsHardness, min: composition.mohsHardness.min ?? -1, max: composition.mohsHardness.max ?? -1 },
      density: { ...composition.density, value: composition.density.value ?? "" },
    },
    paleontology: {
      hasFossilIndications: paleontology.hasFossilIndications,
      organism: paleontology.organism ?? "",
      biologicalGroup: paleontology.biologicalGroup ?? "",
      periodLived: paleontology.periodLived ?? "",
      habitat: paleontology.habitat ?? "",
      preservation: paleontology.preservation ?? "",
      scientificImportance: paleontology.scientificImportance ?? "",
      noFossilExplanation: paleontology.noFossilExplanation ?? "",
    },
  };
}
