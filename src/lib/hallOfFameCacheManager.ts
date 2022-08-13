import { ShardClient } from 'detritus-client';
import { BaseCollection } from 'detritus-utils';
import { SimpleEmbed } from '../botTypes/interfaces';
import {
  ELEMENTS,
  HallOfFameCrownCacheType,
  HallOfFameCrownQuantityCacheType,
  HallOfFameDBOptions,
  SetHallOfFameOptions,
} from '../botTypes/types';
import { getShardClient } from './BotClientExtracted';
import { ElementsArr } from './Constants';
import db from './Firestore';
import { chunkArray, elementProps, getUser } from './Utilities';

const totalCrownUsers = 20;

export const hallOfFameCache = {
  anemo: {
    one: <HallOfFameCrownQuantityCacheType> new BaseCollection(),
    two: <HallOfFameCrownQuantityCacheType> new BaseCollection(),
    three: <HallOfFameCrownQuantityCacheType> new BaseCollection(),
  },
  geo: {
    one: <HallOfFameCrownQuantityCacheType> new BaseCollection(),
    two: <HallOfFameCrownQuantityCacheType> new BaseCollection(),
    three: <HallOfFameCrownQuantityCacheType> new BaseCollection(),
  },
  electro: {
    one: <HallOfFameCrownQuantityCacheType> new BaseCollection(),
    two: <HallOfFameCrownQuantityCacheType> new BaseCollection(),
    three: <HallOfFameCrownQuantityCacheType> new BaseCollection(),
  },
  dendro: {
    one: <HallOfFameCrownQuantityCacheType> new BaseCollection(),
    two: <HallOfFameCrownQuantityCacheType> new BaseCollection(),
    three: <HallOfFameCrownQuantityCacheType> new BaseCollection(),
  },
  unaligned: {
    one: <HallOfFameCrownQuantityCacheType> new BaseCollection(),
  },
};

export function getHoFCacheObject() {
  return hallOfFameCache;
}

export async function getHallOfFameData(
  element: ELEMENTS,
  topEntries = 0,
): Promise<HallOfFameDBOptions[]> {
  return new Promise((res, rej) => {
    const dataArray: HallOfFameDBOptions[] = [];

    if (!ElementsArr.includes(element)) {
      rej(new Error(`${element} is not a valid element.`));
    }

    db.collection(`${element}-crown`)
      .orderBy('crowns', 'desc')
      .limit(topEntries)
      .get()
      .then((query) => {
        query.forEach((docSnap) => {
          dataArray.push(docSnap.data() as HallOfFameDBOptions);
        });
      })
      .then(() => res(dataArray));
  });
}

export async function setHallOfFameData(
  givenData: SetHallOfFameOptions,
  SClient: ShardClient = getShardClient(),
) {
  const { collection, element, crownQuantity } = givenData;
  await getHallOfFameData(element).then(async (entries) => {
    // console.log(entries);

    // eslint-disable-next-line no-restricted-syntax
    for (const entry of entries) {
      // eslint-disable-next-line no-await-in-loop
      const userC = await getUser(entry.userID, SClient);
      // console.log('User: ', userC);
      if (entry.crowns === crownQuantity) {
        collection.set(entry.userID, { user: userC, data: entry });
      }
    }
  });
}

function accessElementCache(element: ELEMENTS): Promise<HallOfFameCrownCacheType> {
  return new Promise<HallOfFameCrownCacheType>((resolve, reject) => {
    switch (element as ELEMENTS) {
      case 'anemo': {
        resolve(hallOfFameCache.anemo);
        break;
      }
      case 'geo': {
        resolve(hallOfFameCache.geo);
        break;
      }
      case 'electro': {
        resolve(hallOfFameCache.electro);
        break;
      }
      case 'unaligned': {
        resolve(hallOfFameCache.unaligned);
        break;
      }
      default: {
        reject(new Error(`${element} does not exist`));
        break;
      }
    }
  });
}

/**
 * Returns current status of Hall of Fame refresh
 * @returns {boolean} - If true it means refresh is complete
 */
export function isHoFRefreshComplete(): boolean {
  return process.env.HALL_OF_FAME_READY === 'true';
}

export async function publishHoFNames(
  element: ELEMENTS,
  quantity: 'one' | 'two' | 'three',
): Promise<SimpleEmbed[]> {
  let HoFSubCache: typeof hallOfFameCache.anemo.one;
  if (element === 'unaligned') {
    HoFSubCache = hallOfFameCache.unaligned.one;
  } else {
    const eleCache = await accessElementCache(element);
    HoFSubCache = eleCache[quantity]!;
  }
  const props = elementProps(element);
  return new Promise((res, rej) => {
    if (!HoFSubCache) {
      rej(new Error(`${element} - ${quantity} crown(s) cache not ready`));
    }

    const groupCache = HoFSubCache.clone();

    const chunks = chunkArray(groupCache.toArray(), totalCrownUsers);

    const embeds: SimpleEmbed[] = [];

    chunks.forEach((chunk) => {
      let value = '';

      const embed: SimpleEmbed = {
        title: `**${props.name}** ${props.emoji}`,
        color: props.color,
        thumbnail: { url: props.icon },
        description: `${props.crown} \nCrowns used: ${quantity}\n\n`,
        timestamp: new Date().toISOString(),
        fields: [],
        footer: {
          text: `${chunks.indexOf(chunk) + 1} of ${chunks.length}`,
        },
      };

      chunk.forEach((cacheData) => {
        value = `${value}\n${cacheData.user.mention}\`${cacheData.user.tag}\``;
      });
      embed.fields?.push({
        name: '\u200b',
        value: `${value}\n-`,
      });

      embeds.push(embed);
    });

    res(embeds);
  });
}
