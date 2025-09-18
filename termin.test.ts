import { expect, describe, it } from "vitest";
import { parseTermin } from "./termin";

describe("parseTermin", () => {
  it("parses various termin strings correctly", () => {
    expect(parseTermin("Montag, 06.10.25 - 20.10.25 von 08:30 bis 10:00 wöchentlich")).toEqual([
      { tag: 0, zeit: 0 },
      { tag: 7, zeit: 0 },
    ]);
    expect(parseTermin("Dienstag, 07.10.25 - 21.10.25 von 10:15 bis 11:45 14-täglich")).toEqual([
      { tag: 1, zeit: 1 },
    ]);
    expect(parseTermin("Freitag, 10.10.25 - 24.10.25 von 17:45 bis 19:15 wöchentlich")).toEqual([
      { tag: 4, zeit: 5 },
      { tag: 11, zeit: 5 },
    ]);
    expect(parseTermin("Mittwoch, 08.10.25 - 22.10.25 von 12:00 bis 13:30 14-täglich")).toEqual([
      { tag: 2, zeit: 2 },
    ]);
    expect(parseTermin("Donnerstag, 09.10.25 - 23.10.25 von 12:00 bis 13:30 wöchentlich")).toEqual([
      { tag: 3, zeit: 2 },
      { tag: 10, zeit: 2 },
    ]);
    expect(parseTermin("Samstag, 11.10.25 - 25.10.25 von 16:00 bis 17:30 14-täglich")).toEqual([
      { tag: 5, zeit: 4 },
    ]);
    expect(parseTermin("Sonntag, 12.10.25 - 26.10.25 von 14:15 bis 15:45 wöchentlich")).toEqual([
      { tag: 6, zeit: 3 },
      { tag: 13, zeit: 3 },
    ]);
    expect(parseTermin("Montag, 13.10.25 - 27.10.25 von 08:30 bis 10:00 14-täglich")).toEqual([
      { tag: 7, zeit: 0 },
    ]);
    expect(parseTermin("Dienstag, 07.10.25 - 13.10.25 von 10:15 bis 11:45 wöchentlich")).toEqual([
      { tag: 1, zeit: 1 },
      { tag: 8, zeit: 1 },
    ]);
    expect(parseTermin("Sonntag, 19.10.25 - 19.10.25 von 17:45 bis 19:15 14-täglich")).toEqual([
      { tag: 13, zeit: 5 },
    ]);
  });

  it("throws on unparsable strings", () => {
    expect(() => parseTermin("invalid string")).toThrow();
  });
});
