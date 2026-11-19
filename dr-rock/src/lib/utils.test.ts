import { describe, expect, it } from "vitest";
import { formatBytes, formatMa, formatMaRange } from "./utils";

describe("formatMa / formatMaRange", () => {
  it("treats 0 Ma as the present", () => {
    expect(formatMa(0)).toBe("present");
    expect(formatMaRange(0, 525)).toBe("525 Ma – present");
  });
  it("lists the oldest age first, as geologists do", () => {
    expect(formatMaRange(299, 485)).toBe("485 – 299 Ma");
    expect(formatMaRange(485, 299)).toBe("485 – 299 Ma");
  });
  it("formats young ages in years", () => {
    expect(formatMa(0.005)).toBe("5,000 years");
    expect(formatMa(0.3)).toBe("300 thousand years");
    expect(formatMa(2.58)).toBe("2.6 Ma");
  });
  it("handles open ranges", () => {
    expect(formatMaRange(null, null)).toBeNull();
    expect(formatMaRange(66, null)).toBe("≈ 66 Ma");
  });
});

describe("Spanish formatting", () => {
  it("uses Spanish words and number formats", () => {
    expect(formatMa(0, "es")).toBe("actualidad");
    expect(formatMaRange(0, 525, "es")).toBe("525 Ma – actualidad");
    expect(formatMa(0.3, "es")).toBe("300 mil años");
    expect(formatMa(2.58, "es")).toBe("2,6 Ma");
  });
});


describe("formatBytes", () => {
  it("picks a readable unit", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(48 * 1024 * 1024)).toBe("48 MB");
    expect(formatBytes(1.5 * 1024 * 1024, "es")).toBe("1,5 MB");
  });
});
