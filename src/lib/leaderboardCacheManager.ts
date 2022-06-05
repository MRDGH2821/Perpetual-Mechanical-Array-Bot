import { BaseCollection } from 'detritus-utils';
import { ShardClient } from 'detritus-client';
import { SimpleEmbed } from '../botTypes/interfaces';
import {
  ElementDamageCategories,
  ELEMENTS,
  LeaderboardElementGroupCacheType,
  LeaderboardDBOptions,
  SetLeaderboardOptions,
  GroupCategoryType,
  LeaderboardElementCacheType,
} from '../botTypes/types';
import db from './Firestore';
import { categoryProps } from './Utilities';
import { EleDmgCategoriesArr } from './Constants';
import { getShardClient } from './BotClientExtracted';

const totalRanks = 7;

export const leaderboardCache = {
  anemo: {
    skill: {
      open: <LeaderboardElementGroupCacheType> new BaseCollection(),
      solo: <LeaderboardElementGroupCacheType> new BaseCollection(),
    },
  },
  geo: {
    skill: {
      open: <LeaderboardElementGroupCacheType> new BaseCollection(),
      solo: <LeaderboardElementGroupCacheType> new BaseCollection(),
    },
  },
  electro: {
    skill: {
      open: <LeaderboardElementGroupCacheType> new BaseCollection(),
      solo: <LeaderboardElementGroupCacheType> new BaseCollection(),
    },
  },
  dendro: {
    skill: {
      open: <LeaderboardElementGroupCacheType> new BaseCollection(),
      solo: <LeaderboardElementGroupCacheType> new BaseCollection(),
    },
  },
  uni: {
    n5: {
      open: <LeaderboardElementGroupCacheType> new BaseCollection(),
      solo: <LeaderboardElementGroupCacheType> new BaseCollection(),
    },
  },
};

export function getLBCacheObject() {
  return leaderboardCache;
}

export async function getLeaderboardData(
  dmgCategory: ElementDamageCategories,
  groupType: GroupCategoryType,
  topEntries = 0,
): Promise<LeaderboardDBOptions[]> {
  return new Promise((res, rej) => {
    const dataArray: LeaderboardDBOptions[] = [];

    if (!EleDmgCategoriesArr.includes(dmgCategory)) {
      rej(
        new Error(
          `${dmgCategory} is not a valid category. \nAllowed types follow this pattern - <element>-dmg-<dmg type>`,
        ),
      );
    }
    if (!['solo', 'open'].includes(groupType.toLowerCase())) {
      rej(new Error(`${groupType} is not a valid group type. Allowed types - 'solo' , 'open'`));
    }

    db.collection(`${dmgCategory}-${groupType.toLowerCase()}`)
      .orderBy('score', 'desc')
      .limit(topEntries)
      .get()
      .then((query) => {
        query.forEach((docSnap) => {
          dataArray.push(docSnap.data() as LeaderboardDBOptions);
        });
      })
      .then(() => res(dataArray));
  });
}

export async function setLeaderboardData(
  givenData: SetLeaderboardOptions,
  SClient: ShardClient = getShardClient(),
) {
  const { collection, dmgCategory, typeCategory } = givenData;
  await getLeaderboardData(dmgCategory, typeCategory).then(async (entries) => {
    // console.log(entries);

    // eslint-disable-next-line no-restricted-syntax
    for (const entry of entries) {
      // eslint-disable-next-line no-await-in-loop
      const userC = SClient.users.get(entry.userID) || (await SClient.rest.fetchUser(entry.userID));
      SClient.users.set(userC.id, userC);
      // console.log('User: ', userC);
      collection.set(entry.userID, { user: userC, data: entry });
    }
  });
}

function accessElementCache(
  dmgCategory: ElementDamageCategories,
): Promise<LeaderboardElementCacheType> {
  const [element, ,] = dmgCategory.split('-');
  return new Promise<LeaderboardElementCacheType>((resolve, reject) => {
    switch (element as ELEMENTS) {
      case 'anemo': {
        resolve(leaderboardCache.anemo.skill);
        break;
      }
      case 'geo': {
        resolve(leaderboardCache.geo.skill);
        break;
      }
      case 'electro': {
        resolve(leaderboardCache.electro.skill);
        break;
      }
      case 'uni': {
        resolve(leaderboardCache.uni.n5);
        break;
      }
      default: {
        reject(new Error(`${dmgCategory} does not exist`));
        break;
      }
    }
  });
}

export async function showcaseLeaderboardGenerate(dmgCategory: ElementDamageCategories) {
  const props = categoryProps(dmgCategory);

  const leaderboardEmbed: SimpleEmbed = {
    title: `**${props.name} Damage Leaderboard**`,
    color: props.color,
    thumbnail: { url: props.icon },
    description: `Highest Damage of **${props.skill}**`,
    timestamp: new Date().toISOString(),
    fields: [],
  };

  const fields = leaderboardEmbed.fields!;

  const cacheData = await accessElementCache(dmgCategory);

  let topOpen = '';
  let topSolo = '';
  let rank = 1;
  cacheData.open.every((dataCache) => {
    topOpen = `${topOpen}\n${rank}. \`${dataCache.user.tag}\` - [${dataCache.data.score}](${dataCache.data.proof})`;
    if (cacheData.open.size > totalRanks) {
      if (rank === totalRanks) {
        const field = {
          inline: true,
          name: `**Open Category Top 1-${totalRanks}**`,
          value: `${topOpen} \n-`,
        };
        fields.push(field);
        topOpen = '';
      } else if (rank === totalRanks * 2 || rank === cacheData.open.size) {
        const field = {
          inline: true,
          name: `**Open Category Top ${totalRanks + 1}-${totalRanks * 2}**`,
          value: `${topOpen} \n-`,
        };
        fields.push(field);
        fields.push({ name: '\u200b', value: '\u200b' });
        topOpen = '';
        return false;
      }
    }
    if (rank === cacheData.open.size) {
      const field = {
        name: `**Open Category Top 1-${totalRanks}**`,
        value: `${topOpen} \n-`,
      };
      fields.push(field);
      fields.push({ name: '\u200b', value: '\u200b' });
      topOpen = '';

      return false;
    }

    rank += 1;
    return true;
  });
  rank = 1;
  cacheData.solo.every((dataCache) => {
    topSolo = `${topSolo}\n${rank}. \`${dataCache.user.tag}\` - [${dataCache.data.score}](${dataCache.data.proof})`;
    if (cacheData.solo.size > totalRanks) {
      if (rank === totalRanks) {
        const field = {
          inline: true,
          name: `**Solo Category Top 1-${totalRanks}**`,
          value: `${topSolo} \n-`,
        };
        fields.push(field);
        topSolo = '';
      } else if (rank === totalRanks * 2 || rank === cacheData.solo.size) {
        const field = {
          inline: true,
          name: `**Solo Category Top ${totalRanks + 1}-${totalRanks * 2}**`,
          value: `${topSolo} \n-`,
        };
        fields.push(field);
        topSolo = '';
        return false;
      }
    }
    if (rank === cacheData.solo.size) {
      const field = {
        name: `**Solo Category Top 1-${totalRanks}**`,
        value: `${topSolo} \n-`,
      };
      fields.push(field);
      fields.push({ name: '\u200b', value: '\u200b' });
      topSolo = '';

      return false;
    }
    rank += 1;
    return true;
  });

  leaderboardEmbed.fields?.concat(fields);
  // Debugging.leafDebug(leaderboardEmbed, true);
  return leaderboardEmbed;
}
