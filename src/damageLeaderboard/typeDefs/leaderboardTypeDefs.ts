import type { Message, User } from "discord.js";

export type ElementDamageCategories =
  | `${N5Elements}-dmg-n5`
  | `${SkillElements}-dmg-skill`;

export type SkillElements = "anemo" | "dendro" | "electro" | "geo" | "hydro";

export type N5Elements = "uni";

export type LBElements = N5Elements | SkillElements;

export type GroupCategoryType = "open" | "solo";

export type LBRegistrationArgs = {
  contestant: User;
  element: LBElements;
  groupType: GroupCategoryType;
  proofMessage: Message;
  score: number;
  shouldForceUpdate: boolean;
};

export type DBLeaderboardData = {
  elementCategory: ElementDamageCategories;
  proof: string;
  score: number;
  typeCategory: GroupCategoryType;
  userID: User["id"];
};
