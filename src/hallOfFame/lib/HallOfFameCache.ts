import { Logger } from '@sapphire/plugin-logger';
import { range } from '@sapphire/utilities';
import { Collection, User } from 'discord.js';
import { sequentialPromises } from 'yaspr';
import { checkBoolean } from '../../baseBot/lib/Utilities';
import db from '../../lib/Firestore';
import type { ELEMENTS } from '../../typeDefs/typeDefs';

type CrownQuantity = 1 | 2 | 3;
type DBHallOfFameData = {
  crowns: CrownQuantity;
  userID: User['id'];
};

type DataCollection = Collection<User['id'], DBHallOfFameData>;

type SubCache = { 1: DataCollection } & Partial<Record<CrownQuantity, DataCollection>>;

type CacheType = Partial<Record<ELEMENTS, SubCache>>;

const logger = new Logger();

export default class HallOfFameCache {
  static #usersPerPage = 20;

  static #cache: CacheType = {
    anemo: {
      1: new Collection(),
      2: new Collection(),
      3: new Collection(),
    },
    geo: {
      1: new Collection(),
      2: new Collection(),
      3: new Collection(),
    },
    electro: {
      1: new Collection(),
      2: new Collection(),
      3: new Collection(),
    },
    dendro: {
      1: new Collection(),
      2: new Collection(),
      3: new Collection(),
    },
    unaligned: {
      1: new Collection(),
    },
  };

  static isCacheReady() {
    return checkBoolean(process.env.HALL_OF_FAME_READY);
  }

  static #fetchDB(element: ELEMENTS, topEntries = 0): Promise<DBHallOfFameData[]> {
    return new Promise((res, rej) => {
      const dataArray: DBHallOfFameData[] = [];

      const cache = this.#cache[element];
      if (!cache) {
        rej(new Error(`Cache for ${element} does not exist`));
      }
      db.collection(`${element}-crown`)
        .orderBy('crowns', 'desc')
        .limit(topEntries)
        .get()
        .then((query) =>
          query.forEach((docSnap) => dataArray.push(docSnap.data() as DBHallOfFameData)),
        )
        .then(() => res(dataArray))
        .catch(rej);
    });
  }

  static #accessCache(element: ELEMENTS, quantity: CrownQuantity) {
    const cache = this.#cache[element];

    if (!cache) {
      throw new Error(`Cache for ${element} does not exist`, {
        cause: `Got element ${element}`,
      });
    }

    const subCache = cache[quantity];

    if (!subCache) {
      throw new Error(`Sub cache for ${element} with quantity ${quantity} does not exist`, {
        cause: `Got quantity ${quantity} for element ${element}`,
      });
    }

    return subCache;
  }

  static async prepareSubCache(element: ELEMENTS) {
    const hofData = await this.#fetchDB(element);
    range(1, 3, 1).forEach((qty) => {
      try {
        const collection = this.#accessCache(element, qty as CrownQuantity);
        hofData.forEach((data) => {
          if (parseInt(`${data.crowns}`, 10) === qty) {
            collection.set(data.userID, data);
          }
        });
      } catch {
        logger.debug(`Skipping ${element}-${qty}`);
      }
    });

    logger.debug(`Cache for ${element} is ready`);
  }

  static async prepareCache() {
    const validElements = Object.keys(this.#cache) as ELEMENTS[];

    await sequentialPromises(validElements, this.prepareSubCache);
  }
}
