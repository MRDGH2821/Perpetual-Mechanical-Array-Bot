import { container } from '@sapphire/pieces';
import { toTitleCase } from '@sapphire/utilities';
import { APIEmbed, Collection, User } from 'discord.js';
import { sequentialPromises } from 'yaspr';
import { checkBoolean } from '../../baseBot/lib/Utilities';
import db from '../../lib/Firestore';
import { getUser, publishEmbedsGenerator } from '../../lib/utils';
import type {
  ElementDamageCategories,
  GroupCategoryType,
  LBElements,
} from '../typeDefs/leaderboardTypeDefs';
import { leaderboardProps } from './Utilities';

type DmgDoneByType = 'skill' | 'n5';
type DBLeaderboardData = {
  elementCategory: ElementDamageCategories;
  proof: string;
  score: number;
  typeCategory: GroupCategoryType;
  userID: User['id'];
};

type DataCollection = Collection<User['id'], DBLeaderboardData>;

type GroupCache = Record<GroupCategoryType, DataCollection>;

type DamageCache = Partial<Record<DmgDoneByType, GroupCache>>;

type CacheType = Record<LBElements, DamageCache>;

const { logger } = container;

export default class LeaderboardCache {
  static #usersPerPage = 20;

  static #cache: CacheType = {
    anemo: {
      skill: {
        open: new Collection(),
        solo: new Collection(),
      },
    },
    geo: {
      skill: {
        open: new Collection(),
        solo: new Collection(),
      },
    },
    electro: {
      skill: {
        open: new Collection(),
        solo: new Collection(),
      },
    },
    dendro: {
      skill: {
        open: new Collection(),
        solo: new Collection(),
      },
    },
    uni: {
      n5: {
        open: new Collection(),
        solo: new Collection(),
      },
    },
  };

  static isCacheReady() {
    return checkBoolean(process.env.HALL_OF_FAME_READY);
  }

  static #getDamageType(element: LBElements) {
    return element === 'uni' ? 'n5' : 'skill';
  }

  static #fetchDB(
    element: LBElements,
    groupType: GroupCategoryType,
    topEntries = 0,
  ): Promise<DBLeaderboardData[]> {
    return new Promise((res, rej) => {
      const dataArray: DBLeaderboardData[] = [];

      this.#accessCache(element, groupType);
      const damageCategory = `${element}-dmg-${this.#getDamageType(element)}`;

      db.collection(`${damageCategory}-${groupType.toLowerCase()}`)
        .orderBy('score', 'desc')
        .limit(topEntries)
        .get()
        .then((query) =>
          query.forEach((docSnap) => dataArray.push(docSnap.data() as DBLeaderboardData)),
        )
        .then(() => res(dataArray))
        .catch(rej);
    });
  }

  static #accessCache(element: LBElements, groupType: GroupCategoryType): DataCollection {
    const cache = this.#cache[element];
    if (!cache) {
      throw new Error(`Cache for ${element} does not exist`);
    }

    const damageType: DmgDoneByType = this.#getDamageType(element);

    const groupCache = cache[damageType];

    const damageCategory = `${element}-dmg-${damageType}`;

    if (!groupCache) {
      throw new Error(`Cache for ${damageCategory} does not exist`);
    }

    return groupCache[groupType];
  }

  static async #prepareGroupCache(element: LBElements, groupType: GroupCategoryType) {
    const DBData = await this.#fetchDB(element, groupType);

    try {
      const collection = this.#accessCache(element, groupType);
      DBData.forEach((data) => {
        collection.set(data.userID, data);
      });
    } catch {
      logger.debug(`Skipping ${element}-dmg-${groupType}`);
    }

    logger.debug(`Cache for ${element} is ready`);
  }

  static async #prepareDamageCache(element: LBElements) {
    const categories: GroupCategoryType[] = ['solo', 'open'];
    categories.forEach((category) => this.#prepareGroupCache(element, category));
  }

  static async prepareCache() {
    const validElements = Object.keys(this.#cache) as LBElements[];

    // await sequentialPromises(validElements, this.#prepareSubCache);

    // eslint-disable-next-line no-restricted-syntax
    for (const ele of validElements) {
      // eslint-disable-next-line no-await-in-loop
      await this.#prepareDamageCache(ele);
    }
  }

  static generateEmbeds(
    element: LBElements,
    groupType: GroupCategoryType,
    usersPerPage = this.#usersPerPage,
  ): Promise<APIEmbed[]> {
    const props = leaderboardProps(element);
    return new Promise((res, rej) => {
      const collection = this.#accessCache(element, groupType);

      logger.debug('Building embeds for: ', {
        element,
        length: collection.size,
      });

      const embed: APIEmbed = {
        title: `${toTitleCase(element)} Traveler Damage Leaderboard`,
        color: props.color,
        thumbnail: {
          url: props.icon,
        },
        description: `Highest Damage of **${props.name}**`,
        timestamp: new Date().toISOString(),
        fields: [],
      };

      sequentialPromises(
        collection.map((data) => data.userID),
        getUser,
      )
        .then((users) => {
          publishEmbedsGenerator({
            users,
            embedTemplate: embed,
            usersPerPage,
          })
            .then(res)
            .catch(rej);
        })
        .catch(rej);
    });
  }
}
