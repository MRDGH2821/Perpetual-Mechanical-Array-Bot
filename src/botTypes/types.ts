import { BaseCollection } from 'detritus-utils';
import { User, Webhook } from 'detritus-client/lib/structures';
import { COLORS, ICONS, TravelerTypes } from 'lib/Constants';
import { RestClient } from 'detritus-client/lib/rest';
import { ShardClient } from 'detritus-client';

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

export type LeaderboardUpdateEventArgs = {
  webhook?: Webhook;
  RClient?: RestClient;
  SClient?: ShardClient;
};
