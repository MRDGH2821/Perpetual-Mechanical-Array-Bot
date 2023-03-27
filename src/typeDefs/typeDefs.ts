import type { ChatInputApplicationCommandData } from 'discord.js';
import { Collection } from 'discord.js';

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

export type KitTechnology = {
  gif: string;
  id: string;
  name: string;
};

export type TravelerKitTechs = {
  SKILL_TECHS: KitTechnology[];
  BURST_TECHS: KitTechnology[];
};

export type KitProp = {
  name: string;
  description: string;
  techs: KitTechnology[];
};

export type DamageType = 'skill' | 'burst';

export type TravelerTechProp = {
  shortName: string;
  name: string;
  description: string;
  element: ELEMENTS;
  guide: string;
} & Record<DamageType, KitProp>;

type GIFCategory =
  | 'bonkGifs'
  | 'hornyBonkGifs'
  | 'selfHornyBonkGifs'
  | 'abyssGifs'
  | 'FBIGifs'
  | 'TikTokGifs';
type ReasonCategory =
  | 'crowdSourcedBonkReasons'
  | 'crowdSourcedHornyBonkReasons'
  | 'RNGMuteReasons'
  | 'leaksMuteReasons'
  | 'banHammerReasons';
type QuoteCategory =
  | 'abyssQuotes'
  | 'RNGMuteQuotes'
  | 'FBIQuotes'
  | 'TikTokQuotes'
  | 'leakQuotes'
  | 'yoyoverseQuotes';

export type DBQuotes = GIFCategory | ReasonCategory | QuoteCategory;

export type DBQuotesCollection = Collection<DBQuotes, string[]>;
