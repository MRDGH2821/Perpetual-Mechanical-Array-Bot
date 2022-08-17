import { Member, User } from 'detritus-client/lib/structures';
import { BaseCollection } from 'detritus-utils';

export type GroupCategoryType = 'open' | 'solo';

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

export type ElementDamageCategories =
  | 'anemo-dmg-skill'
  | 'geo-dmg-skill'
  | 'electro-dmg-skill'
  | 'uni-dmg-n5';

export type LeaderboardDBOptions = {
  elementCategory: ElementDamageCategories;
  proof: string;
  score: number;
  typeCategory: GroupCategoryType;
  userID: User['id'];
};

export type SetLeaderboardOptions = {
  collection: LeaderboardElementGroupCacheType;
  dmgCategory: ElementDamageCategories;
  typeCategory: GroupCategoryType;
};

type LeaderboardCacheObject = { user: User; data: LeaderboardDBOptions };

export type LeaderboardElementGroupCacheType = BaseCollection<User['id'], LeaderboardCacheObject>;

export type LeaderboardElementCacheType = {
  open: LeaderboardElementGroupCacheType;
  solo: LeaderboardElementGroupCacheType;
};

export type HallOfFameDBOptions = { crowns: 1 | 2 | 3; userID: User['id'] };

type HallOfFameCacheObject = { user: User; data: HallOfFameDBOptions };

export type HallOfFameCrownQuantityCacheType = BaseCollection<User['id'], HallOfFameCacheObject>;

export type HallOfFameCrownCacheType = {
  one: HallOfFameCrownQuantityCacheType;
  two?: HallOfFameCrownQuantityCacheType;
  three?: HallOfFameCrownQuantityCacheType;
};

export type SetHallOfFameOptions = {
  collection: HallOfFameCrownQuantityCacheType;
  element: ELEMENTS;
  crownQuantity: 1 | 2 | 3;
};

export type CrownDBRegisterObject = {
  userID: Member['user']['id'] | User['id'];
  crowns: 1 | 2 | 3;
};

export type SpiralAbyssClearTypes = 'Abyssal Conqueror' | 'Abyssal Traveler' | 'Abyssal Sovereign';

export type JokeCategories =
  | 'Programming'
  | 'Misc'
  | 'Dark'
  | 'Pun'
  | 'Spooky'
  | 'Christmas'
  | 'Any';

export type OneJokeFormat = {
  error: boolean;
  category: JokeCategories;
  type: 'twopart' | 'single';
  joke?: string;
  setup?: string;
  delivery?: string;
  flags: {
    nsfw: boolean;
    religious: boolean;
    political: boolean;
    racist: boolean;
    sexist: boolean;
    explicit: boolean;
  };
  id: number;
  safe: boolean;
  lang: 'en' | 'cs' | 'de' | 'es' | 'fr' | 'pt';
};

export type TravelerCommandProp = {
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

type GIFCategories =
  | 'bonkGifs'
  | 'hornyBonkGifs'
  | 'selfHornyBonkGifs'
  | 'abyssGifs'
  | 'FBIGifs'
  | 'TikTokGifs';

type ReasonCategories =
  | 'crowdSourcedBonkReasons'
  | 'crowdSourcedHornyBonkReasons'
  | 'RNGMuteReasons'
  | 'leaksMuteReasons'
  | 'banHammerReasons';

type QuoteCategories =
  | 'abyssQuotes'
  | 'RNGMuteQuotes'
  | 'FBIQuotes'
  | 'TikTokQuotes'
  | 'leakQuotes'
  | 'yoyoverseQuotes';

export type DBQuotes = GIFCategories | ReasonCategories | QuoteCategories;

export type DBQuotesCollection = BaseCollection<DBQuotes, string[]>;
