import { User } from 'detritus-client/lib/structures';
import { BaseCollection } from 'detritus-utils';
import { COLORS, ICONS, TravelerTypes } from '../lib/Constants';

export type CategoryProp = {
  icon: ICONS;
  name: TravelerTypes;
  skill: string;
  color: COLORS;
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
