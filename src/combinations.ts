import { Modul, ModulBelegung, ModulTermin } from "./dto";

export function* generateCombinations<T>(items: T[], k: number): Generator<T[]> {
  if (k === 1) {
    for (const x of items) yield [x];
    return;
  }
  for (let i = 0; i <= items.length - k; i++) {
    const head = items[i];
    for (let tailCombinations of generateCombinations(items.slice(i + 1), k - 1)) {
      yield [head, ...tailCombinations];
    }
  }
}

export function* generateSingleModulBelegungen(modul: Modul): Generator<ModulBelegung> {
  for (const angebot of modul.angebote) {
    let veranstaltungen = angebot.vorlesungTermine.map((termin) => ({
      label: `v ${modul.name}`,
      termin,
    }));
    if (angebot.praktikum) {
      for (const gruppe of angebot.praktikum.gruppen) {
        yield {
          modulName: modul.name,
          angebotName: angebot.name,
          gruppenName: gruppe.name,
          veranstaltungen: [
            ...veranstaltungen,
            ...gruppe.termine.map((termin) => ({ label: `p ${modul.name}`, termin })),
          ],
        };
      }
    } else {
      yield {
        modulName: modul.name,
        angebotName: angebot.name,
        gruppenName: undefined,
        veranstaltungen,
      };
    }
  }
}

export function* generateModulBelegungen(modules: Modul[]): Generator<ModulBelegung[]> {
  if (modules.length === 1) {
    for (const belegung of generateSingleModulBelegungen(modules[0])) {
      yield [belegung];
    }
  } else {
    for (const belegung of generateSingleModulBelegungen(modules[0])) {
      for (const restBelegungen of generateModulBelegungen(modules.slice(1))) {
        yield [belegung, ...restBelegungen];
      }
    }
  }
}
