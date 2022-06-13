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
import { chunkArray, constructField, elementProps } from './Utilities';

const totalCrownUsers = 26;

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
      const userC = SClient.users.get(entry.userID) || (await SClient.rest.fetchUser(entry.userID));
      if (!SClient.users.has(userC.id)) {
        SClient.users.set(userC.id, userC);
      }
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

export async function showcaseHallOfFameGenerate(element: ELEMENTS) {
  const props = elementProps(element);

  const hallOfFameEmbed: SimpleEmbed = {
    title: `**${props.name}** ${props.emoji}`,
    description: props.crown,
    color: props.color,
    thumbnail: { url: props.icon },
    timestamp: new Date().toISOString(),
    fields: [],
  };

  const fields = hallOfFameEmbed.fields!;

  const cacheData = await accessElementCache(element);

  if (!cacheData.two) {
    hallOfFameEmbed.description = `${hallOfFameEmbed.description}\n\n${constructField(
      cacheData.one,
      totalCrownUsers,
    )}`;
    return hallOfFameEmbed;
  }

  fields.push({
    name: '**Single Crowners**',
    value: constructField(cacheData.one, totalCrownUsers),
  });

  if (cacheData.two) {
    fields.push({
      name: '**Double Crowners**',
      value: constructField(cacheData.two, totalCrownUsers),
    });
  }

  if (cacheData.three) {
    fields.push({
      name: '**Triple Crowners**',
      value: constructField(cacheData.three, totalCrownUsers),
    });
  }

  hallOfFameEmbed.fields?.concat(fields);
  // Debugging.leafDebug(leaderboardEmbed, true);
  return hallOfFameEmbed;
}

export async function hallOfFameViewGenerate(
  element: ELEMENTS,
  quantity: 'one' | 'two' | 'three',
): Promise<SimpleEmbed[]> {
  const elementCache = await accessElementCache(element);

  const groupCache = elementCache[quantity];

  if (!groupCache) {
    throw new Error(`${element} traveler cannot have ${quantity} crowns`);
  }

  const chunks = chunkArray(groupCache.toArray(), 10);

  const embeds: SimpleEmbed[] = [];

  const props = elementProps(element);
  chunks.forEach((chunk) => {
    const embed: SimpleEmbed = {
      title: `**${props.name}** ${props.emoji}`,
      color: props.color,
      thumbnail: { url: props.icon },
      description: `${props.crown} \nCrowns used: ${quantity}\n\n`,
      timestamp: new Date().toISOString(),
      footer: {
        text: `${chunks.indexOf(chunk) + 1} of ${chunks.length}`,
      },
    };

    chunk.forEach((cacheData) => {
      embed.description = `${embed.description}\n${cacheData.user.mention}\`${cacheData.user.tag}\``;
    });
    embeds.push(embed);
  });

  if (!embeds.at(0)) {
    const embed: SimpleEmbed = {
      title: `**${props.name}** ${props.emoji}`,
      color: props.color,
      thumbnail: { url: props.icon },
      description: `No users found who used ${quantity} crown(s)...`,
      timestamp: new Date().toISOString(),
    };
    embeds.push(embed);
  }

  return embeds;
}

/**
 * Returns current status of Hall of Fame refresh
 * @returns {boolean} - If true it means refresh is complete
 */
export function isHoFRefreshComplete(): boolean {
  return process.env.HALL_OF_FAME_READY === 'true';
}
