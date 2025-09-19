import { z } from "zod";
import * as yaml from "yaml";
import { parseTermin } from "./termin";
import { Modul, ModulTermin } from "./dto";

// Zod schemas for each layer
const YamlTerminSchema = z.union([z.string(), z.array(z.string())]);
const YamlModulAngebotSchema = z.object({
  v: YamlTerminSchema,
  p: z.optional(z.record(z.string(), YamlTerminSchema)),
});
const YamlModulSchema = z.record(z.string(), YamlModulAngebotSchema);
const YamlRootSchema = z.record(z.string(), YamlModulSchema);

export function transformYamlToModules(yamlString: string): Modul[] {
  function parseTermine(t: string | string[]): ModulTermin[] {
    return (Array.isArray(t) ? t : [t]).flatMap((term) => parseTermin(term));
  }

  const data = YamlRootSchema.parse(yaml.parse(yamlString));
  return Object.entries(data).map(([name, angebote]) => ({
    name,
    angebote: Object.entries(angebote).map(([name, { v, p }]) => ({
      name,
      vorlesungTermine: parseTermine(v),
      praktikum: p
        ? {
            gruppen: Object.entries(p).map(([name, termine]) => ({
              name,
              termine: parseTermine(termine),
            })),
          }
        : undefined,
    })),
  }));
}
