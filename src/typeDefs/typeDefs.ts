import type {
  ActionRowData,
  ButtonComponentData,
  ChatInputApplicationCommandData,
  Collection,
  GuildMember,
} from "discord.js";
import type { ROLE_IDS } from "../lib/Constants.js";

export type JSONCmd = ChatInputApplicationCommandData;

export type ELEMENTS =
  "anemo" | "cryo" | "dendro" | "electro" | "geo" | "hydro" | "pyro" | "unaligned" | "uni";

export type KitTechnology = {
  gif: string;
  id: string;
  name: string;
}

export type TravelerKitTechs = {
  BURST_TECHS: KitTechnology[];
  SKILL_TECHS: KitTechnology[];
}

export type KitProp = {
  description: string;
  name: string;
  techs: KitTechnology[];
}

export type DamageType = "burst" | "skill";

export type TravelerTechProp = Record<DamageType, KitProp> & {
  description: string;
  element: ELEMENTS;
  guide: string;
  name: string;
  shortName: string;
};

type GIFCategory =
  "abyssGifs" | "bonkGifs" | "FBIGifs" | "hornyBonkGifs" | "selfHornyBonkGifs" | "TikTokGifs";
type ReasonCategory =
  "banHammerReasons" | "crowdSourcedBonkReasons" | "crowdSourcedHornyBonkReasons" | "leaksMuteReasons" | "RNGMuteReasons";
type QuoteCategory =
  "abyssQuotes" | "FBIQuotes" | "leakQuotes" | "RNGMuteQuotes" | "TikTokQuotes" | "yoyoverseQuotes";

export type DBQuotes = GIFCategory | QuoteCategory | ReasonCategory;

export type DBQuotesCollection = Collection<DBQuotes, string[]>;

export type RegisterCrownArgs = {
  crownID: ROLE_IDS.CROWN;
  quantity: number;
  target: GuildMember;
}

export type ValueOf<T> = T[keyof T];

export type ButtonActionRow = ActionRowData<ButtonComponentData>;
