import { BaseCollection } from 'detritus-utils';
import { User } from 'detritus-client/lib/structures';
import { COLORS, ICONS, TravelerTypes } from 'lib/Constants';

export type CategoryProp = {
  icon: ICONS;
  name: TravelerTypes;
  skill: string;
  color: COLORS;
};

export type DamageType = 'skill' | 'n5';

export type ELEMENTS =
  | 'anemo'
  | 'geo'
  | 'electro'
  | 'dendro'
  | 'hydro'
  | 'pyro'
  | 'cryo'
  | 'unaligned';

export type ElementDamageCategories =
  | 'anemo-dmg-skill'
  | 'geo-dmg-skill'
  | 'electro-dmg-skill'
  | 'uni-dmg-n5';

export type LeaderboardDBOptions = {
  elementCategory: ElementDamageCategories;
  proof: string;
  score: number;
  typeCategory: 'solo' | 'open';
  userID: User['id'];
};

export type SetLeaderboardOptions = {
  collection: LeaderboardCacheType;
  dmgCategory: ElementDamageCategories;
  typeCategory: 'solo' | 'open';
};

export type LeaderboardCacheType = BaseCollection<
User['id'],
{ user: User; data: LeaderboardDBOptions }
>;
