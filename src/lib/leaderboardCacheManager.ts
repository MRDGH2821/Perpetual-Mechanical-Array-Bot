import { ShardClient } from 'detritus-client';
import { BaseCollection } from 'detritus-utils';
import { SimpleEmbed } from '../botTypes/interfaces';
import {
  ElementDamageCategories,
  ELEMENTS,
  GroupCategoryType,
  LeaderboardDBOptions,
  LeaderboardElementCacheType,
  LeaderboardElementGroupCacheType,
  SetLeaderboardOptions,
} from '../botTypes/types';
import { getShardClient } from './BotClientExtracted';
import { EleDmgCategoriesArr } from './Constants';
import db from './Firestore';
import { categoryProps, chunkArray } from './Utilities';

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
      if (!SClient.users.has(userC.id)) {
        SClient.users.set(userC.id, userC);
      }
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

function constructRanks(
  groupCache: LeaderboardElementGroupCacheType,
  groupType: GroupCategoryType,
) {
  const fields: SimpleEmbed['fields'] = [];
  let rank = 1;
  let topPeople = '';

  const groupTitle = groupType.charAt(0).toUpperCase() + groupType.slice(1);
  groupCache.every((dataCache) => {
    topPeople = `${topPeople}\n${rank}. \`${dataCache.user.tag}\` - [${dataCache.data.score}](${dataCache.data.proof})`;
    if (groupCache.size > totalRanks) {
      if (rank === totalRanks) {
        const field = {
          inline: true,
          name: `**${groupTitle} Category Top 1-${totalRanks}**`,
          value: `${topPeople} \n-`,
        };
        fields.push(field);
        topPeople = '';
      } else if (rank === totalRanks * 2 || rank === groupCache.size) {
        const field = {
          inline: true,
          name: `**${groupTitle} Category Top ${totalRanks + 1}-${totalRanks * 2}**`,
          value: `${topPeople} \n-`,
        };
        fields.push(field);
        // fields.push({ name: '\u200b', value: dashLines });
        topPeople = '';
        return false;
      }
    }
    if (rank === groupCache.size) {
      const field = {
        name: `**${groupTitle} Category Top 1-${totalRanks}**`,
        value: `${topPeople} \n-`,
      };
      fields.push(field);
      // fields.push({ name: '\u200b', value: dashLines });
      topPeople = '';

      return false;
    }

    rank += 1;
    return true;
  });
  return fields;
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

  const dashLines = '\u200b';
  // dash lines which were rejected. First one is suited for mobile, 2nd one for PC
  // '--------------------------------------------------';
  // '----------------------------------------------------------------------------';

  fields.push(...constructRanks(cacheData.open, 'open'));
  fields.push({ name: '\u200b', value: dashLines });
  fields.push(...constructRanks(cacheData.solo, 'solo'));

  return leaderboardEmbed;
}

export async function leaderboardViewGenerate(
  dmgCategory: ElementDamageCategories,
  groupType: GroupCategoryType,
): Promise<SimpleEmbed[]> {
  const elementCache = await accessElementCache(dmgCategory);

  const groupCache = elementCache[groupType].clone();

  const chunks = chunkArray(groupCache.toArray(), 10);

  const embeds: SimpleEmbed[] = [];

  let rank = 1;
  /* jscpd:ignore-start */
  chunks.forEach((chunk) => {
    const props = categoryProps(dmgCategory);
    const embed: SimpleEmbed = {
      title: `**${props.name} Damage ${groupType} Leaderboard**\n`,
      color: props.color,
      thumbnail: { url: props.icon },
      description: `Highest Damage of **${props.skill}\n**`,
      timestamp: new Date().toISOString(),
      footer: {
        text: `${chunks.indexOf(chunk) + 1} of ${chunks.length}`,
      },
    };

    chunk.forEach((cacheData) => {
      embed.description = `${embed.description}\n${rank}.\`${cacheData.user.tag}\` - [${cacheData.data.score}](${cacheData.data.proof})`;
      rank += 1;
    });
    embeds.push(embed);
  });
  /* jscpd:ignore-end */
  return embeds;
}

/**
 * Returns current status of leaderboard refresh
 * @returns {boolean} - If true it means refresh is complete
 */
export function isLBRefreshComplete(): boolean {
  return process.env.LEADERBOARD_READY === 'true';
}
