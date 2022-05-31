import { SimpleEmbed } from '@bot-types/interfaces';
import {
  DamageType,
  ElementCategories,
  ELEMENTS,
  LeaderboardCacheType,
  LeaderboardEntryOptions,
  SetLeaderboardOptions,
} from '@bot-types/types';
import { DmgCategoryTypes } from '@lib/Constants';
import db from '@lib/Firestore';
import leaderboardCache from '@lib/leaderboardCache';
import { categoryProps } from '@lib/Utilities';
import { RestClient } from 'detritus-client/lib/rest';

export async function getLeaderboardData(
  dmgCategory: ElementCategories,
  groupType: 'solo' | 'open',
  topEntries = 0,
): Promise<LeaderboardEntryOptions[]> {
  return new Promise((res, rej) => {
    const dataArray: LeaderboardEntryOptions[] = [];

    if (!DmgCategoryTypes.includes(dmgCategory)) {
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
          dataArray.push(docSnap.data() as LeaderboardEntryOptions);
        });
      })
      .then(() => res(dataArray));
  });
}

export function setLeaderboardData(givenData: SetLeaderboardOptions, RClient: RestClient) {
  const { collection, dmgCategory, typeCategory } = givenData;
  getLeaderboardData(dmgCategory, typeCategory).then((entries) => {
    entries.forEach((entry) => {
      RClient.fetchUser(entry.userID).then((user) => {
        collection.set(entry.userID, { user, data: entry });
      });
    });
  });
}

export async function showcaseLeaderboardGenerate(dmgCategory: ElementCategories) {
  const LCache = leaderboardCache;
  const [element, , dmgType] = dmgCategory.split('-');

  const props = categoryProps(dmgCategory);
  const fields: SimpleEmbed['fields'] = [];
  const leaderboardEmbed: SimpleEmbed = {
    title: `**${props.name} Damage Leaderboard**`,
    color: props.color,
    thumbnail: { url: props.icon },
    description: `Highest Damage of **${props.skill}**`,
    timestamp: `${Date.now()}`,
  };

  const cacheData: {
    solo: LeaderboardCacheType;
    open: LeaderboardCacheType;
    // @ts-ignore
  } = LCache[element as ELEMENTS][dmgType as DamageType];

  let topOpen = '';
  let topSolo = '';
  let rank = 1;
  cacheData.open.forEach((dataCache) => {
    topOpen = `${topOpen}\n${rank}. \`${dataCache.user.tag}\` - [${dataCache.data.score}](${dataCache.data.proof})}`;
    if (cacheData.open.size > 7) {
      if (rank === 7) {
        const field = {
          inline: true,
          name: '**Open Category Top 1-7**',
          value: `${topOpen} \n-`,
        };
        fields.push(field);
        topOpen = '';
      } else if (rank === 14 || rank === cacheData.open.size) {
        const field = {
          inline: true,
          name: '**Open Category Top 8-14**',
          value: `${topOpen} \n-`,
        };
        fields.push(field);
        fields.push({ name: '\u200b', value: '\u200b' });
        topOpen = '';
      }
    } else if (rank === cacheData.open.size) {
      const field = {
        name: '**Open Category Top 1-7**',
        value: `${topOpen} \n-`,
      };
      fields.push(field);
      fields.push({ name: '\u200b', value: '\u200b' });
      topOpen = '';
    }
    rank += 1;
  });
  cacheData.solo.forEach((dataCache) => {
    topSolo = `${topSolo}\n${rank}. \`${dataCache.user.tag}\` - [${dataCache.data.score}](${dataCache.data.proof})}`;
    if (cacheData.solo.size > 7) {
      if (rank === 7) {
        const field = {
          inline: true,
          name: '**Solo Category Top 1-7**',
          value: `${topSolo} \n-`,
        };
        fields.push(field);
        topOpen = '';
      } else if (rank === 14 || rank === cacheData.solo.size) {
        const field = {
          inline: true,
          name: '**Solo Category Top 8-14**',
          value: `${topSolo} \n-`,
        };
        fields.push(field);
        fields.push({ name: '\u200b', value: '\u200b' });
        topOpen = '';
      }
    } else if (rank === cacheData.solo.size) {
      const field = {
        name: '**Solo Category Top 1-7**',
        value: `${topSolo} \n-`,
      };
      fields.push(field);
      fields.push({ name: '\u200b', value: '\u200b' });
      topSolo = '';
    }
    rank += 1;
  });

  leaderboardEmbed.fields = fields;
  return leaderboardEmbed;
}
