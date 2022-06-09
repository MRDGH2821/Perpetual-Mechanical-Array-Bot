import { ShardClient } from 'detritus-client';
import { BaseCollection } from 'detritus-utils';
import { SimpleEmbed } from '../botTypes/interfaces';
import {
  AbyssDBRegisterObject,
  SetSpiralAbyssOptions,
  SpiralAbyssCacheObject,
  SpiralAbyssGroupCacheType,
} from '../botTypes/types';
import { getShardClient } from './BotClientExtracted';
import { COLORS, ICONS } from './Constants';
import db from './Firestore';

const totalUsers = 26;

export const spiralAbyssCache = {
  clearNormal: <SpiralAbyssGroupCacheType> new BaseCollection(),
  clearTraveler: <SpiralAbyssGroupCacheType> new BaseCollection(),
};

export function getSACacheObject() {
  return spiralAbyssCache;
}

export async function getSpiralAbyssData(): Promise<AbyssDBRegisterObject[]> {
  return new Promise((res, rej) => {
    const dataArray: AbyssDBRegisterObject[] = [];

    db.collection('spiral-abyss-current')
      .orderBy('withTraveler', 'desc')
      .get()
      .then((query) => {
        query.forEach((docSnap) => {
          dataArray.push(docSnap.data() as AbyssDBRegisterObject);
        });
      })
      .then(() => res(dataArray))
      .catch(rej);
  });
}

export async function setSpiralAbyssData(
  givenData: SetSpiralAbyssOptions,
  SClient: ShardClient = getShardClient(),
) {
  const { collection, withTraveler } = givenData;
  await getSpiralAbyssData().then(async (entries) => {
    // console.log(entries);

    // eslint-disable-next-line no-restricted-syntax
    for (const entry of entries) {
      // eslint-disable-next-line no-await-in-loop
      const userC = SClient.users.get(entry.userID) || (await SClient.rest.fetchUser(entry.userID));
      if (!SClient.users.has(userC.id)) {
        SClient.users.set(userC.id, userC);
      }
      // console.log('User: ', userC);
      if (entry.withTraveler === withTraveler) {
        collection.set(entry.userID, { user: userC, data: entry });
      }
    }
  });
}

function constructField(collection: SpiralAbyssGroupCacheType) {
  let str = '';

  const selected: SpiralAbyssCacheObject[] = collection
    .toArray()
    .sort(() => Math.random() - 0.5)
    .slice(0, totalUsers);

  if (selected.length > 0) {
    selected.forEach((data) => {
      str = `${str}\n${data.user.mention} \`${data.user.tag}\``;
    });
  } else {
    str = `${str}\n*No users found...*`;
  }
  str = `${str}\n-`;
  return str;
}

export async function showcaseSpiralAbyssGenerate(withTraveler: boolean = false) {
  const date = new Date();

  const spiralAbyssEmbed: SimpleEmbed = {
    title: '**Spiral Abyss Clear Board**',
    color: COLORS.SPIRAL_ABYSS,
    thumbnail: { url: ICONS.SPIRAL_ABYSS },
    description: `Cycle Details: \n${date.getDate() < 16 ? 'Waxing Phase' : 'Waning Phase'} (${
      date.getMonth() + 1
    }/${date.getFullYear()}) `,
    timestamp: new Date().toISOString(),
    fields: [],
  };

  const fields = spiralAbyssEmbed.fields!;

  if (!withTraveler) {
    fields.push({
      name: '**Cleared current Spiral Abyss Cycle**',
      value: constructField(spiralAbyssCache.clearNormal),
    });
  } else {
    fields.push({
      name: '**Cleared with Traveler**',
      value: constructField(spiralAbyssCache.clearTraveler),
    });
  }
  spiralAbyssEmbed.fields?.concat(fields);
  // Debugging.leafDebug(leaderboardEmbed, true);
  return spiralAbyssEmbed;
}

function chunkArray(array: any[], size: number): any[] {
  const result = [];
  const arrayCopy = [...array];
  while (arrayCopy.length > 0) {
    result.push(arrayCopy.splice(0, size));
  }
  return result;
}

export async function spiralAbyssViewGenerate(withTraveler: boolean): Promise<SimpleEmbed[]> {
  const SACache = withTraveler ? spiralAbyssCache.clearTraveler : spiralAbyssCache.clearNormal;

  const groupCache = SACache.clone();

  const chunks = chunkArray(groupCache.toArray(), 10) as SpiralAbyssCacheObject[][];

  const embeds: SimpleEmbed[] = [];

  const date = new Date();

  chunks.forEach((chunk) => {
    const embed: SimpleEmbed = {
      title: '**Spiral Abyss Clear Board**',
      color: COLORS.SPIRAL_ABYSS,
      thumbnail: { url: ICONS.SPIRAL_ABYSS },
      description: `Cycle Details: \n${date.getDate() < 16 ? 'Waxing Phase' : 'Waning Phase'} (${
        date.getMonth() + 1
      }/${date.getFullYear()}) `,
      timestamp: new Date().toISOString(),
      footer: {
        text: `${chunks.indexOf(chunk) + 1} of ${chunks.length}`,
      },
    };

    chunk.forEach((cacheData) => {
      embed.description = `${embed.description}\n${cacheData.user.mention} - ${cacheData.user.tag}`;
    });
    embeds.push(embed);
  });

  return embeds;
}

/**
 * Returns current status of leaderboard refresh
 * @returns {boolean} - If true it means refresh is complete
 */
export function isSARefreshComplete(): boolean {
  return process.env.SPIRAL_ABYSS_READY === 'true';
}
