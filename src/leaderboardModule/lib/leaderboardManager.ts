import db from '@pma-lib/Firestore';
import { ElementCategories } from '@pma-types/enums';
import { LeaderboardEntryOptions } from '@pma-types/interfaces';
import leaderboardCache from 'leaderboardModule/lib/leaderboardCache';

export async function getLeaderboardData(
  dmgCategory: ElementCategories,
  groupType: 'solo' | 'open',
  topEntries = 0,
): Promise<LeaderboardEntryOptions[]> {
  const dataArray: LeaderboardEntryOptions[] = [];

  if (typeof dmgCategory !== typeof ElementCategories) {
    throw new Error(
      `${dmgCategory} is not a valid category. \nAllowed types - ${ElementCategories}`,
    );
  }
  if (!['solo', 'open'].includes(groupType.toLowerCase())) {
    throw new Error(`${groupType} is not a valid group type. Allowed types - 'solo' , 'open'`);
  }

  await db
    .collection(`${dmgCategory}-${groupType.toLowerCase()}`)
    .orderBy('score', 'desc')
    .limit(topEntries)
    .get()
    .then((query) => {
      query.forEach((docSnap) => {
        dataArray.push(docSnap.data() as LeaderboardEntryOptions);
      });
    });

  return dataArray;
}

export async function leaderboardGenerate(
  LCache: typeof leaderboardCache,
  dmgCategory: ElementCategories,
) {}
