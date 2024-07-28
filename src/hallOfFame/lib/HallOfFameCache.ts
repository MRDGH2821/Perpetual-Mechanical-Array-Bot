import { container } from '@sapphire/framework';
import { s, type SchemaOf } from '@sapphire/shapeshift';
import { range } from '@sapphire/utilities';
import { type APIEmbed, Collection, type User } from 'discord.js';
import { sequentialPromises } from 'yaspr';
import { parseBoolean } from '../../baseBot/lib/Utilities';
import { EMPTY_STRING } from '../../lib/Constants';
import db from '../../lib/Database/Firestore';
import { getUser, publishEmbedsGenerator } from '../../lib/utils';
import type { ELEMENTS } from '../../typeDefs/typeDefs';
import { crownProps } from './Utilities';

type CrownQuantity = 1 | 2 | 3;
interface DBHallOfFameData {
  crowns: CrownQuantity;
  userID: User['id'];
}

type DataCollection = Collection<User['id'], DBHallOfFameData>;

type SubCache = { 1: DataCollection } & Partial<Record<CrownQuantity, DataCollection>>;

type CacheType = Partial<Record<ELEMENTS, SubCache>>;

const { logger } = container;

type HoFDataSchemaType = SchemaOf<DBHallOfFameData>;

const HoFDataSchema: HoFDataSchemaType = s.object({
  crowns: s
    .literal<CrownQuantity>(1)
    .or(s.literal<CrownQuantity>(2))
    .or(s.literal<CrownQuantity>(3))
    .default(1),
  userID: s.string,
});

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
    hydro: {
      1: new Collection(),
      2: new Collection(),
      3: new Collection(),
    },
    unaligned: {
      1: new Collection(),
    },
  };

  static isCacheReady() {
    return parseBoolean(process.env.HALL_OF_FAME_READY);
  }

  static async #fetchDB(element: ELEMENTS, topEntries = 0): Promise<DBHallOfFameData[]> {
    return new Promise((resolve, reject) => {
      const dataArray: DBHallOfFameData[] = [];

      const cache = this.#cache[element];
      if (!cache) {
        reject(new Error(`Cache for ${element} does not exist`));
      }
      db.collection(`${element}-crown`)
        .orderBy('crowns', 'desc')
        .limit(topEntries)
        .get()
        .then((query) =>
          query.forEach((docSnap) => {
            const data = docSnap.data();
            const validatedData = HoFDataSchema.parse(data);
            dataArray.push(validatedData);
          }),
        )
        .then(() => resolve(dataArray))
        .catch(reject);
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

  static async #prepareSubCache(element: ELEMENTS) {
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

    // await sequentialPromises(validElements, this.#prepareSubCache);

    // eslint-disable-next-line no-restricted-syntax
    for (const ele of validElements) {
      // eslint-disable-next-line no-await-in-loop
      await this.#prepareSubCache(ele);
    }
  }

  static async generateEmbeds(
    element: ELEMENTS,
    quantity: CrownQuantity,
    usersPerPage = this.#usersPerPage,
  ): Promise<APIEmbed[]> {
    const props = crownProps(element);
    return new Promise((resolve, reject) => {
      const collection = this.#accessCache(element, quantity);

      logger.debug('Building embeds for: ', {
        element,
        users: collection.size,
      });

      const embed: APIEmbed = {
        title: `**${props.name}** ${props.emoji}`,
        color: props.color,
        thumbnail: {
          url: props.icon,
        },
        description: `${props.description}\nCrowns used: ${quantity}\n\n`,
        timestamp: new Date().toISOString(),
        fields: [],
      };

      sequentialPromises(
        collection.map((data) => data.userID),
        getUser,
      )
        .then(async (users) => {
          if (users.length < 1) {
            embed.fields?.push({
              name: EMPTY_STRING,
              value: 'No members found in this section',
            });

            return resolve([embed]);
          }
          return publishEmbedsGenerator({
            users,
            embedTemplate: embed,
            usersPerPage,
          })
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    });
  }

  static isUserInCache(userID: User['id']) {
    const anemo = {
      1: this.#accessCache('anemo', 1).has(userID),
      2: this.#accessCache('anemo', 2).has(userID),
      3: this.#accessCache('anemo', 3).has(userID),
    };

    const geo = {
      1: this.#accessCache('geo', 1).has(userID),
      2: this.#accessCache('geo', 2).has(userID),
      3: this.#accessCache('geo', 3).has(userID),
    };

    const electro = {
      1: this.#accessCache('electro', 1).has(userID),
      2: this.#accessCache('electro', 2).has(userID),
      3: this.#accessCache('electro', 3).has(userID),
    };

    const dendro = {
      1: this.#accessCache('dendro', 1).has(userID),
      2: this.#accessCache('dendro', 2).has(userID),
      3: this.#accessCache('dendro', 3).has(userID),
    };

    const hydro = {
      1: this.#accessCache('hydro', 1).has(userID),
      2: this.#accessCache('hydro', 2).has(userID),
      3: this.#accessCache('hydro', 3).has(userID),
    };

    const unaligned = {
      1: this.#accessCache('unaligned', 1).has(userID),
    };

    return {
      anemo,
      geo,
      electro,
      dendro,
      hydro,
      unaligned,
    };
  }
}
