import * as fs from "fs";
import * as yaml from "yaml";
import { z } from "zod";
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

function transformYamlToModule(data: z.infer<typeof YamlRootSchema>): Modul[] {
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

const module = transformYamlToModule(
  YamlRootSchema.parse(yaml.parse(fs.readFileSync("data.yaml", "utf-8")))
);
