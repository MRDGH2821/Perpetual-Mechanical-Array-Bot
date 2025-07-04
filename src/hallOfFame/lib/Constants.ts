import type { ELEMENTS } from "../../typeDefs/typeDefs.js";

export const HALL_OF_FAME_ELEMENT_CHOICES = [
  {
    name: "Herrscher of Wind (Anemo)",
    value: "anemo",
  },
  {
    name: "Jūnzhǔ of Earth (Geo)",
    value: "geo",
  },
  {
    name: "Ten'nō of Thunder (Electro)",
    value: "electro",
  },
  {
    name: "Raja of Evergreens (Dendro)",
    value: "dendro",
  },
  {
    name: "Monarque of Tides (Hydro)",
    value: "hydro",
  },
  {
    name: "Arbitrator of Fate (Unaligned)",
    value: "unaligned",
  },
] as { name: string; value: ELEMENTS }[];

export const RELEASED_ELEMENTS: ELEMENTS[] = [
  "anemo",
  "geo",
  "electro",
  "dendro",
  "hydro",
  "unaligned",
];
