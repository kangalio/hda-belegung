import { z } from "zod";
import * as yaml from "yaml";
import { parseTermin, ModulTermin } from "./termin";

// Zod schemas for each layer
const YamlTerminSchema = z.union([z.string(), z.array(z.string())]);
const YamlGruppenSchema = z.record(z.string(), YamlTerminSchema);
const YamlTeilSchema = z.record(z.string(), z.union([YamlTerminSchema, YamlGruppenSchema]));
const YamlProfSchema = z.record(z.string(), YamlTeilSchema);
const YamlRootSchema = z.record(z.string(), YamlProfSchema);

type Modul = {
  name: string;
  angebote: ModulAngebot[];
};
type ModulAngebot = {
  prof: string;
  teile: ModulTeil[];
};
type ModulTeil = {
  name: string;
  gruppen: ModulGruppe[];
};
type ModulGruppe = {
  name: string;
  termine: ModulTermin[];
};

function transformYamlToModule(yamlString: string): Modul[] {
  const data = YamlRootSchema.parse(yaml.parse(yamlString));
  return Object.entries(data).map(([name, angebote]) => ({
    name,
    angebote: Object.entries(angebote).map(([prof, teile]) => ({
      prof,
      teile: Object.entries(teile).map(([name, gruppeOderTermin]) => ({
        name,
        gruppen: (() => {
          if (typeof gruppeOderTermin !== "object") gruppeOderTermin = { gruppe: gruppeOderTermin };
          return Object.entries(gruppeOderTermin).map(([name, termine]) => ({
            name,
            termine: (Array.isArray(termine) ? termine : [termine]).flatMap((t) => parseTermin(t)),
          }));
        })(),
      })),
    })),
  }));
}

export {
  YamlTerminSchema,
  YamlGruppenSchema,
  YamlTeilSchema,
  YamlProfSchema,
  YamlRootSchema,
  Modul,
  ModulAngebot,
  ModulTeil,
  ModulGruppe,
  transformYamlToModule,
};
