import * as fs from "fs";
import { Modul, ModulAngebot, ModulTeil, transformYamlToModule } from "./transform";

const module = transformYamlToModule(fs.readFileSync("data.yaml", "utf-8"));

// Helper: get all combinations of one teil per module (from every angebot)
function getTeilCombinations(
  modules: Modul[]
): { modul: Modul; angebot: ModulAngebot; teil: ModulTeil }[][] {
  const choices = modules.map((modul) => {
    // For each angebot, collect all its teile
    return modul.angebote.flatMap((angebot) =>
      angebot.teile.map((teil) => ({ modul, angebot, teil }))
    );
  });
  // Cartesian product
  function cartesian(arr: any[][]): any[][] {
    return arr.reduce((a, b) => a.flatMap((d) => b.map((e) => [...d, e])), [[]]);
  }
  return cartesian(choices);
}

// Generate all combinations of 5 modules from the full list
function getModuleCombinations(allModules: Modul[], k: number): Modul[][] {
  const results: Modul[][] = [];
  function helper(start: number, combo: Modul[]) {
    if (combo.length === k) {
      results.push(combo.slice());
      return;
    }
    for (let i = start; i < allModules.length; i++) {
      combo.push(allModules[i]);
      helper(i + 1, combo);
      combo.pop();
    }
  }
  helper(0, []);
  return results;
}

const allModuleCombos = getModuleCombinations(module, 5);

// Build abbrev map for legend (once, outside the loop)
const abbrevMap: Record<string, string> = {};
for (const modul of module) {
  const abbr = modul.name
    .split(/\s+/)
    .map((w) => w[0].toLowerCase())
    .join("");
  abbrevMap[abbr] = modul.name;
}

for (const selectedModules of allModuleCombos) {
  const teilCombinations = getTeilCombinations(selectedModules);
  for (const combo of teilCombinations) {
    // Collect all termine for each selected teil (first gruppe only)
    const timetable = combo.flatMap(({ modul, teil }) =>
      teil.gruppen
        .slice(0, 1)
        .flatMap((gruppe) =>
          gruppe.termine.map((termin) => ({ modul: modul.name, teil: teil.name, termin }))
        )
    );

    // Check for collisions: if any two entries have the same tag+zeit, skip this combo
    const seen = new Set<string>();
    let hasCollision = false;
    for (const entry of timetable) {
      const key = `${entry.termin.tag}-${entry.termin.zeit}`;
      if (seen.has(key)) {
        hasCollision = true;
        break;
      }
      seen.add(key);
    }
    if (hasCollision) continue;

    // Zeit/Tag labels for printing
    const slotNames = [
      "08:30-10:00",
      "10:15-11:45",
      "12:00-13:30",
      "14:15-15:45",
      "16:00-17:30",
      "17:45-19:15",
    ];
    // Build table for this combination
    const table: Record<number, Record<number, typeof timetable>> = {};
    for (let slot = 0; slot < 6; slot++) {
      table[slot] = {};
      for (let day of [0, 1, 2, 3, 4, 7, 8, 9, 10, 11]) {
        table[slot][day] = timetable.filter((t) => t.termin.tag === day && t.termin.zeit === slot);
      }
    }
    // Render Markdown table
    let md = "| Zeit/Tag | Mo | Di | Mi | Do | Fr | Mo | Di | Mi | Do | Fr |\n";
    md += "|---|---|---|---|---|---|---|---|---|---|---|\n";
    for (let slot = 0; slot < 6; slot++) {
      md += `| ${slotNames[slot]} |`;
      for (let day of [0, 1, 2, 3, 4, 7, 8, 9, 10, 11]) {
        const events = table[slot][day];
        const labels = events.map((e) => {
          const abbr = e.modul
            .split(/\s+/)
            .map((w) => w[0].toLowerCase())
            .join("");
          return `${e.teil} ${abbr}`;
        });
        md += (labels.length ? labels.join("<br>") : "") + " |";
      }
      md += "\n";
    }
    console.log(md + "\n");
  }
}

// Print legend once after all tables
let legend = "**Legende:**\n";
for (const abbr of Object.keys(abbrevMap)) {
  legend += `- \`${abbr}\`: ${abbrevMap[abbr]}\n`;
}
console.log(legend);
