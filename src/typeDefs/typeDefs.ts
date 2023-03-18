import type { ChatInputApplicationCommandData } from 'discord.js';

export type JSONCmd = ChatInputApplicationCommandData;

export type ELEMENTS =
  | 'anemo'
  | 'geo'
  | 'electro'
  | 'dendro'
  | 'hydro'
  | 'pyro'
  | 'cryo'
  | 'unaligned'
  | 'uni';

export type TravelerTechProp = {
  shortName: string;
  name: string;
  element: ELEMENTS;
  skill: {
    name: string;
    techs: {
      gif: string;
      id: string;
      name: string;
    }[];
  };
  burst: {
    name: string;
    techs: {
      gif: string;
      id: string;
      name: string;
    }[];
  };
  guide: string;
};
