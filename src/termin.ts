export type ModulTermin = {
  // Um zweiwöchige Termine abzubilden, sind die Tagindizes Teil eines 14-tägigen Rasters.
  // Wöchentliche Termine werden dargestellt als zwei Termine.
  // 0 = Mo 06.10.
  // 6 = So 12.10.
  // 7 = Mo 13.10.
  // 13 = So 19.10.
  tag: number;
  // 0 = 8:30-10:00
  // 1 = 10:15-11:45
  // 2 = 12:00-13:30
  // 3 = 14:15-15:45
  // 4 = 16:00-17:30
  // 5 = 17:45-19:15
  zeit: number;
};

function parseGermanDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split(".").map(Number);
  return new Date(Date.UTC(2000 + year, month - 1, day));
}

function getTimeSlotIndex(timeStr: string, type: "start" | "end"): number {
  const TIME_SLOTS: { start: string; end: string }[] = [
    { start: "08:30", end: "10:00" },
    { start: "10:15", end: "11:45" },
    { start: "12:00", end: "13:30" },
    { start: "14:15", end: "15:45" },
    { start: "16:00", end: "17:30" },
    { start: "17:45", end: "19:15" },
  ];
  const index = TIME_SLOTS.findIndex((slot) => slot[type] === timeStr);
  if (index === -1) throw new Error(`Invalid time slot found in schedule: ${timeStr}`);
  return index;
}

function parseTerminString(str: string): [string, string, string, string, string, string, string] {
  const terminRegex =
    /(\w+), (\d{2}\.\d{2}\.\d{2}) - (\d{2}\.\d{2}\.\d{2}) von (\d{2}:\d{2}) bis (\d{2}:\d{2}) (wöchentlich|14-täglich)/;
  const match = str.match(terminRegex);
  if (!match) {
    throw new Error(`Could not parse termin string: "${str}"`);
  }
  // Remove the full match at index 0
  return match.slice(1) as [string, string, string, string, string, string, string];
}

export function parseTermin(str: string): ModulTermin[] {
  const SEMESTER_START_EPOCH = new Date("2025-10-06T00:00:00.000Z");
  const result: ModulTermin[] = [];

  const [
    ,
    startDateStr, // not needed for biweekly cycle
    ,
    startTimeStr, // not needed for biweekly cycle
    ,
    frequency,
  ] = parseTerminString(str);
  const startDate = parseGermanDate(startDateStr);
  // Calculate the tag index (0-13) for the first occurrence in the biweekly cycle
  const tag = Math.round(
    (startDate.getTime() - SEMESTER_START_EPOCH.getTime()) / (1000 * 60 * 60 * 24)
  );
  const zeit = getTimeSlotIndex(startTimeStr, "start");
  // For weekly, add both week 1 and week 2; for 14-täglich, only one occurrence
  if (frequency === "wöchentlich") {
    if (tag >= 0 && tag <= 6) result.push({ tag, zeit });
    if (tag + 7 >= 0 && tag + 7 <= 13) result.push({ tag: tag + 7, zeit });
  } else if (frequency === "14-täglich") {
    if (tag >= 0 && tag <= 13) result.push({ tag, zeit });
  }
  return result;
}
