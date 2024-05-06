import type { Message, User } from 'discord.js';

export type ElementDamageCategories = `${SkillElements}-dmg-skill` | `${N5Elements}-dmg-n5`;

export type SkillElements = 'anemo' | 'geo' | 'electro' | 'dendro' | 'hydro';

export type N5Elements = 'uni';

export type LBElements = SkillElements | N5Elements;

export type GroupCategoryType = 'open' | 'solo';

export interface LBRegistrationArgs {
  contestant: User;
  element: LBElements;
  groupType: GroupCategoryType;
  score: number;
  proofMessage: Message;
  shouldForceUpdate: boolean;
}

export interface DBLeaderboardData {
  elementCategory: ElementDamageCategories;
  proof: string;
  score: number;
  typeCategory: GroupCategoryType;
  userID: User['id'];
}
