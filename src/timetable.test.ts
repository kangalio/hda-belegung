import { describe, it, expect } from "vitest";
import { aggregateTimetable, timetableToMarkdown, countFreeDays } from "./timetable";
import { ModulTermin } from "./dto";

describe("aggregateTimetable", () => {
  it("aggregates non-colliding slots", () => {
    const slots = [
      { termin: { tag: 0, zeit: 1 }, label: "A" },
      { termin: { tag: 0, zeit: 2 }, label: "B" },
      { termin: { tag: 1, zeit: 1 }, label: "C" },
    ];
    const result = aggregateTimetable(slots);
    expect(Array.isArray(result)).toBe(true);
    if (!result) throw new Error("result is undefined");
    expect(result[0][1]).toBe("A");
    expect(result[0][2]).toBe("B");
    expect(result[1][1]).toBe("C");
  });

  it("returns undefined on collision", () => {
    const slots = [
      { termin: { tag: 0, zeit: 1 }, label: "A" },
      { termin: { tag: 0, zeit: 1 }, label: "B" }, // collision
    ];
    expect(aggregateTimetable(slots)).toBeUndefined();
  });
});

describe("timetableToMarkdown", () => {
  it("generates a markdown table from a timetable (transposed)", () => {
    // 3 days, 6 slots per day
    const table: (string | undefined)[][] = [
      [undefined, "A", undefined, undefined, undefined, undefined], // day 0
      [undefined, undefined, undefined, undefined, undefined, undefined], // day 1
      ["B", undefined, "C", undefined, undefined, undefined], // day 2
    ];
    const md = timetableToMarkdown(table);
    expect(md).toContain("Slot/Day | Day 0 | Day 1 | Day 2");
    expect(md).toContain("0 |  |  | B");
    expect(md).toContain("1 | A |  | ");
    expect(md).toContain("2 |  |  | C");
  });
});

describe("countFreeDays", () => {
  it("counts days with all slots undefined", () => {
    const table: (string | undefined)[][] = [
      [undefined, undefined, undefined, undefined, undefined, undefined],
      ["A", undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined, undefined],
    ];
    expect(countFreeDays(table)).toBe(2);
  });
});
