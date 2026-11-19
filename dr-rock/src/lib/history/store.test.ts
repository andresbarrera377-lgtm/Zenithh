import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { EXAMPLE_ANALYSIS } from "@/lib/analysis/example";
import { addToHistory, clearHistory, getHistoryEntry, listHistory, markHistorySaved, removeFromHistory } from "./store";
import { HISTORY_LIMIT } from "./limits";

const meta = { requestId: "r", model: "claude-opus-5-5", analyzedAt: new Date(0).toISOString(), durationMs: 1 };

function entry(name: string) {
  const analysis = structuredClone(EXAMPLE_ANALYSIS);
  analysis.identification.rockName = name;
  const blob = new Blob(["x"], { type: "image/jpeg" });
  return { photos: [{ blob, role: "overview" as const, width: 10, height: 10 }], thumbnail: blob, analysis, meta };
}

describe("scan history", () => {
  it("stores scans newest first, marks them saved and deletes them", async () => {
    await clearHistory();
    const a = await addToHistory(entry("A"));
    await new Promise((r) => setTimeout(r, 5));
    const b = await addToHistory(entry("B"));
    expect((await listHistory()).map((e) => e.analysis.identification.rockName)).toEqual(["B", "A"]);

    await markHistorySaved(a.id, "disc-1");
    expect((await getHistoryEntry(a.id))?.savedDiscoveryId).toBe("disc-1");

    await removeFromHistory(b.id);
    expect((await listHistory()).map((e) => e.id)).toEqual([a.id]);
  });

  it(`keeps only the newest ${HISTORY_LIMIT} scans`, async () => {
    await clearHistory();
    for (let i = 0; i < HISTORY_LIMIT + 3; i++) {
      await addToHistory(entry(`#${i}`));
      await new Promise((r) => setTimeout(r, 2));
    }
    const items = await listHistory();
    expect(items).toHaveLength(HISTORY_LIMIT);
    expect(items[0].analysis.identification.rockName).toBe(`#${HISTORY_LIMIT + 2}`);
    expect(items.at(-1)?.analysis.identification.rockName).toBe("#3");
  });
});
