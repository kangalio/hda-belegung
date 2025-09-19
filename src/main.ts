import * as fs from "fs";
import { transformYamlToModules } from "./transform";
import { generateCombinations, generateModulBelegungen } from "./combinations";
import { aggregateTimetable, countFreeDays, timetableToMarkdown } from "./timetable";

const allModules = transformYamlToModules(fs.readFileSync("data.yaml", "utf-8"));

for (let chosenModules of generateCombinations(allModules, 5)) {
  for (const modulBelegungen of generateModulBelegungen(chosenModules)) {
    const timetable = aggregateTimetable(modulBelegungen.flatMap((b) => b.veranstaltungen));
    if (!timetable) continue;

    const freeDays = countFreeDays(timetable);
    if (freeDays < 8) continue;

    console.log(`# ${chosenModules.map((m) => m.name).join(", ")}`);
    console.log();
    for (const modulBelegung of modulBelegungen) {
      console.log(
        `- ${modulBelegung.modulName} - ${modulBelegung.angebotName} - ${
          modulBelegung.gruppenName ?? "(kein Praktikum)"
        }`
      );
    }
    console.log();
    console.log(timetableToMarkdown(timetable));
    console.log();
  }
}
