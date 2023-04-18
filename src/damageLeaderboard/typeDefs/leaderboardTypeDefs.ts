import type { Message, User } from 'discord.js';

export type ElementDamageCategories =
  | 'anemo-dmg-skill'
  | 'geo-dmg-skill'
  | 'electro-dmg-skill'
  | 'dendro-dmg-skill'
  | 'uni-dmg-n5';

export type SkillElements = 'anemo' | 'geo' | 'electro' | 'dendro';

export type N5Elements = 'uni';

export type LBElements = SkillElements | N5Elements;

export type GroupCategoryType = 'open' | 'solo';

export type LBRegistrationArgs = {
  contestant: User;
  element: LBElements;
  groupType: GroupCategoryType;
  score: number;
  proofMessage: Message;
  shouldForceUpdate: boolean;
};

export type DBLeaderboardData = {
  elementCategory: ElementDamageCategories;
  proof: string;
  score: number;
  typeCategory: GroupCategoryType;
  userID: User['id'];
};
