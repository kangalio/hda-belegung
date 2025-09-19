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

export type ModulPraktikumsGruppe = {
  name: string;
  termine: ModulTermin[];
};
export type ModulPraktikum = {
  gruppen: ModulPraktikumsGruppe[];
};
export type ModulAngebot = {
  name: string;
  vorlesungTermine: ModulTermin[];
  praktikum?: ModulPraktikum;
};
export type Modul = {
  name: string;
  angebote: ModulAngebot[];
};

export const TIME_SLOTS: { start: string; end: string }[] = [
  { start: "08:30", end: "10:00" },
  { start: "10:15", end: "11:45" },
  { start: "12:00", end: "13:30" },
  { start: "14:15", end: "15:45" },
  { start: "16:00", end: "17:30" },
  { start: "17:45", end: "19:15" },
];
export const NUM_DAYS = 14;

export type Veranstaltungen = {
  label: string;
  termin: ModulTermin;
}[];

export type ModulBelegung = {
  modulName: string;
  angebotName: string;
  gruppenName?: string;
  veranstaltungen: {
    label: string;
    termin: ModulTermin;
  }[];
};
