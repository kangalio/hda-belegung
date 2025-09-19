import { ModulTermin, TIME_SLOTS, Veranstaltungen } from "./dto";

export type Timetable = (string | undefined)[][];

/**
 * Aggregates a list of ModulTermin with associated label into a timetable.
 * Returns a 2D array [tag][zeit] = label if no collisions, otherwise undefined.
 * There are 14 possible days (tags) and 6 possible slots (zeit) per day.
 */
export function aggregateTimetable(slots: Veranstaltungen): Timetable | undefined {
  const table: Timetable = Array.from(
    { length: 14 },
    () => Array(TIME_SLOTS.length).fill(undefined) as (string | undefined)[]
  );
  for (const { termin, label } of slots) {
    if (table[termin.tag][termin.zeit] !== undefined) {
      // Collision detected
      return undefined;
    }
    table[termin.tag][termin.zeit] = label;
  }
  return table;
}

/**
 * Generates a Markdown table from a timetable (Timetable), transposed so that
 * each column is a day and each row is a slot.
 * The first row is the header (day indices), the first column is the slot index.
 * Only shows Mo-Fr labels for two weeks, skipping weekends.
 */
export function timetableToMarkdown(table: Timetable): string {
  // Only show Mo-Fr (0-4) and Mo-Fr (7-11)
  const relevantDays = [0, 1, 2, 3, 4, 7, 8, 9, 10, 11];
  const dayLabels = ["Mo", "Di", "Mi", "Do", "Fr", "Mo", "Di", "Mi", "Do", "Fr"];
  const numSlots = table[0]?.length ?? 0;
  // Ensure all relevant days exist in the table
  const safeTable = relevantDays.map((day) => table[day] ?? Array(numSlots).fill(undefined));
  // Build transposed: slots x relevant days
  const transposed: (string | undefined)[][] = Array.from({ length: numSlots }, (_, slot) =>
    safeTable.map((row) => row[slot])
  );
  return [
    `|Slot/Day|${dayLabels.join("|")}|`,
    `|-|${dayLabels.map((_) => "-").join("|")}|`,
    ...transposed.map(
      (row, i) =>
        `|${TIME_SLOTS[i].start}-${TIME_SLOTS[i].end}|${row.map((cell) => cell ?? "").join("|")}|`
    ),
  ].join("\n");
}

/**
 * Counts the number of days (rows) in the timetable that are entirely free (all slots undefined).
 */
export function countFreeDays(table: Timetable): number {
  return table.filter((row) => row.every((cell) => cell === undefined)).length;
}
