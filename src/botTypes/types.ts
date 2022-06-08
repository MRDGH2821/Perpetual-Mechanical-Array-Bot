import { Member, User } from 'detritus-client/lib/structures';
import { BaseCollection } from 'detritus-utils';
// eslint-disable-next-line import/no-cycle
import { COLORS, ICONS, TravelerTypes } from '../lib/Constants';

export type CategoryProp = {
  icon: ICONS;
  name: TravelerTypes;
  skill: string;
  color: COLORS;
};

export type ElementProp = {
  icon: ICONS;
  name: string;
  crown: string;
  color: COLORS;
  emoji: string;
};

export type DamageType = 'skill' | 'n5';

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

export type HallOfFameCategories =
  | 'anemo-crown'
  | 'geo-crown'
  | 'electro-crown'
  | 'unaligned-crown'
  | 'spiral-abyss-current';

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

export type LeaderboardCacheObject = { user: User; data: LeaderboardDBOptions };

export type LeaderboardElementGroupCacheType = BaseCollection<User['id'], LeaderboardCacheObject>;

export type LeaderboardElementCacheType = {
  open: LeaderboardElementGroupCacheType;
  solo: LeaderboardElementGroupCacheType;
};

export type HallOfFameDBOptions = { crowns: 1 | 2 | 3; userID: User['id'] };

export type HallOfFameCacheObject = { user: User; data: HallOfFameDBOptions };

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

export type AbyssDBRegisterObject = {
  userID: Member['user']['id'] | User['id'];
  withTraveler: boolean;
  currentMonth: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | number;
  currentYear: number;
  lunarPhase: 'waxing' | 'waning';
};
