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
import { chunkArray, getUser } from './Utilities';

const totalUsers = 20;

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
      const userC = await getUser(entry.userID, SClient);
      // console.log('User: ', userC);
      if (entry.withTraveler === withTraveler) {
        collection.set(entry.userID, { user: userC, data: entry });
      }
    }
  });
}

/**
 * Returns current status of spiral abyss refresh
 * @returns {boolean} - If true it means refresh is complete
 */
export function isSARefreshComplete(): boolean {
  return process.env.SPIRAL_ABYSS_READY === 'true';
}

export function publishSANames(withTraveler = false): Promise<SimpleEmbed[]> {
  return new Promise((res, rej) => {
    const SACache = withTraveler ? spiralAbyssCache.clearTraveler : spiralAbyssCache.clearNormal;

    const groupCache = SACache.clone();

    const chunks = chunkArray(groupCache.toArray(), totalUsers) as SpiralAbyssCacheObject[][];
    const date = new Date();

    const embeds: SimpleEmbed[] = [];

    chunks.forEach((chunk) => {
      let value = '';
      const embed: SimpleEmbed = {
        title: '**Spiral Abyss Clear Board**',
        color: COLORS.SPIRAL_ABYSS,
        thumbnail: { url: ICONS.SPIRAL_ABYSS },
        description: `Cycle Details: \n${date.getDate() < 16 ? 'Waxing Phase' : 'Waning Phase'} (${
          date.getMonth() + 1
        }/${date.getFullYear()}) \nClear Type: ${withTraveler ? 'Traveler Clear' : 'Normal Clear'}`,
        timestamp: new Date().toISOString(),
        fields: [],
        footer: {
          text: `${chunks.indexOf(chunk) + 1} of ${chunks.length}`,
        },
      };
      chunk.forEach((data) => {
        value = `${value}\n${data.user.mention} - \`${data.user.tag}\``;
      });
      embed.fields?.push({
        name: '\u200b',
        value: `${value}\n-`,
      });

      embeds.push(embed);
    });
    if (!embeds.at(0)) {
      const embed: SimpleEmbed = {
        title: '**Spiral Abyss Clear Board**',
        color: COLORS.SPIRAL_ABYSS,
        thumbnail: { url: ICONS.SPIRAL_ABYSS },
        description: `Cycle Details: \n${date.getDate() < 16 ? 'Waxing Phase' : 'Waning Phase'} (${
          date.getMonth() + 1
        }/${date.getFullYear()}) \nClear Type: ${withTraveler ? 'Traveler Clear' : 'Normal Clear'}`,
        fields: [
          {
            name: '\u200b',
            value: 'No users found who cleared spiral abyss this cycle...',
          },
        ],
        timestamp: new Date().toISOString(),
      };
      embeds.push(embed);
    }
    if (embeds.length < 1) {
      rej(new Error('Failed to build embeds'));
    } else {
      res(embeds);
    }
  });
}
