import { expect, it } from "vitest";
import { generateModulBelegungen, generateCombinations } from "./combinations";
import { Modul, ModulAngebot, ModulPraktikum } from "./dto";

it("getCombinations", () => {
  expect(Array.from(generateCombinations([1, 2, 3, 4, 5], 3))).toEqual([
    [1, 2, 3],
    [1, 2, 4],
    [1, 2, 5],
    [1, 3, 4],
    [1, 3, 5],
    [1, 4, 5],
    [2, 3, 4],
    [2, 3, 5],
    [2, 4, 5],
    [3, 4, 5],
  ]);
});

it("module", () => {
  let praktikum: ModulPraktikum = {
    gruppen: [
      { name: "p1", termine: [] },
      { name: "p2", termine: [] },
    ],
  };
  let angebote: ModulAngebot[] = [
    {
      name: "v1",
      vorlesungTermine: [],
      praktikum,
    },
    {
      name: "v2",
      vorlesungTermine: [],
      praktikum,
    },
  ];
  let module: Modul[] = [
    {
      name: "m1",
      angebote,
    },
    {
      name: "m2",
      angebote,
    },
    {
      name: "m3",
      angebote: [{ name: "v1", vorlesungTermine: [], praktikum: undefined }],
    },
  ];
  // prettier-ignore
  expect(Array.from(generateModulBelegungen(module, 2))).toEqual([
    [{ moduleName: "m1", profName: "v1", praktikumName: "p1", termine: [] }, { moduleName: "m2", profName: "v1", praktikumName: "p1", termine: [] }],
    [{ moduleName: "m1", profName: "v1", praktikumName: "p1", termine: [] }, { moduleName: "m2", profName: "v1", praktikumName: "p2", termine: [] }],
    [{ moduleName: "m1", profName: "v1", praktikumName: "p1", termine: [] }, { moduleName: "m2", profName: "v2", praktikumName: "p1", termine: [] }],
    [{ moduleName: "m1", profName: "v1", praktikumName: "p1", termine: [] }, { moduleName: "m2", profName: "v2", praktikumName: "p2", termine: [] }],
    [{ moduleName: "m1", profName: "v1", praktikumName: "p2", termine: [] }, { moduleName: "m2", profName: "v1", praktikumName: "p1", termine: [] }],
    [{ moduleName: "m1", profName: "v1", praktikumName: "p2", termine: [] }, { moduleName: "m2", profName: "v1", praktikumName: "p2", termine: [] }],
    [{ moduleName: "m1", profName: "v1", praktikumName: "p2", termine: [] }, { moduleName: "m2", profName: "v2", praktikumName: "p1", termine: [] }],
    [{ moduleName: "m1", profName: "v1", praktikumName: "p2", termine: [] }, { moduleName: "m2", profName: "v2", praktikumName: "p2", termine: [] }],
    [{ moduleName: "m1", profName: "v2", praktikumName: "p1", termine: [] }, { moduleName: "m2", profName: "v1", praktikumName: "p1", termine: [] }],
    [{ moduleName: "m1", profName: "v2", praktikumName: "p1", termine: [] }, { moduleName: "m2", profName: "v1", praktikumName: "p2", termine: [] }],
    [{ moduleName: "m1", profName: "v2", praktikumName: "p1", termine: [] }, { moduleName: "m2", profName: "v2", praktikumName: "p1", termine: [] }],
    [{ moduleName: "m1", profName: "v2", praktikumName: "p1", termine: [] }, { moduleName: "m2", profName: "v2", praktikumName: "p2", termine: [] }],
    [{ moduleName: "m1", profName: "v2", praktikumName: "p2", termine: [] }, { moduleName: "m2", profName: "v1", praktikumName: "p1", termine: [] }],
    [{ moduleName: "m1", profName: "v2", praktikumName: "p2", termine: [] }, { moduleName: "m2", profName: "v1", praktikumName: "p2", termine: [] }],
    [{ moduleName: "m1", profName: "v2", praktikumName: "p2", termine: [] }, { moduleName: "m2", profName: "v2", praktikumName: "p1", termine: [] }],
    [{ moduleName: "m1", profName: "v2", praktikumName: "p2", termine: [] }, { moduleName: "m2", profName: "v2", praktikumName: "p2", termine: [] }],
    
    [{ moduleName: "m1", profName: "v1", praktikumName: "p1", termine: [] }, { moduleName: "m3", profName: "v1", praktikumName: undefined, termine: [] }],
    [{ moduleName: "m1", profName: "v1", praktikumName: "p2", termine: [] }, { moduleName: "m3", profName: "v1", praktikumName: undefined, termine: [] }],
    [{ moduleName: "m1", profName: "v2", praktikumName: "p1", termine: [] }, { moduleName: "m3", profName: "v1", praktikumName: undefined, termine: [] }],
    [{ moduleName: "m1", profName: "v2", praktikumName: "p2", termine: [] }, { moduleName: "m3", profName: "v1", praktikumName: undefined, termine: [] }],
    
    [{ moduleName: "m2", profName: "v1", praktikumName: "p1", termine: [] }, { moduleName: "m3", profName: "v1", praktikumName: undefined, termine: [] }],
    [{ moduleName: "m2", profName: "v1", praktikumName: "p2", termine: [] }, { moduleName: "m3", profName: "v1", praktikumName: undefined, termine: [] }],
    [{ moduleName: "m2", profName: "v2", praktikumName: "p1", termine: [] }, { moduleName: "m3", profName: "v1", praktikumName: undefined, termine: [] }],
    [{ moduleName: "m2", profName: "v2", praktikumName: "p2", termine: [] }, { moduleName: "m3", profName: "v1", praktikumName: undefined, termine: [] }],
  ]);
});
