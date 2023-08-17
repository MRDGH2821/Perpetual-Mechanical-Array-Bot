import { container } from '@sapphire/pieces';
import { s, type SchemaOf } from '@sapphire/shapeshift';
import { chunk, deepClone, toTitleCase } from '@sapphire/utilities';
import { Collection, User, type APIEmbed } from 'discord.js';
import { parseBoolean } from '../../baseBot/lib/Utilities';
import { EMPTY_STRING } from '../../lib/Constants';
import db from '../../lib/Firestore';
import { getUser } from '../../lib/utils';
import type {
  DBLeaderboardData,
  ElementDamageCategories,
  GroupCategoryType,
  LBElements,
} from '../typeDefs/leaderboardTypeDefs';
import { leaderboardProps, parseLBElement, proofLinkValidator } from './Utilities';

type DmgDoneByType = 'skill' | 'n5';

type DataCollection = Collection<User['id'], DBLeaderboardData>;

type GroupCache = Record<GroupCategoryType, DataCollection>;

type DamageCache = Partial<Record<DmgDoneByType, GroupCache>>;

type CacheType = Record<LBElements, DamageCache>;

const { logger } = container;

type LeaderboardDBDataSchemaType = SchemaOf<DBLeaderboardData>;

const LeaderboardDBDataSchema: LeaderboardDBDataSchemaType = s.object({
  score: s.number.default(0),
  userID: s.string,
  proof: proofLinkValidator,
  elementCategory: s
    .literal<ElementDamageCategories>('anemo-dmg-skill')
    .or(s.literal<ElementDamageCategories>('geo-dmg-skill'))
    .or(s.literal<ElementDamageCategories>('electro-dmg-skill'))
    .or(s.literal<ElementDamageCategories>('dendro-dmg-skill'))
    .or(s.literal<ElementDamageCategories>('hydro-dmg-skill'))
    .or(s.literal<ElementDamageCategories>('uni-dmg-n5')),
  typeCategory: s.literal<GroupCategoryType>('open').or(s.literal<GroupCategoryType>('solo')),
});

const NOT_FOUND = 'No members found in this section';

export default class LeaderboardCache {
  static #usersPerPage = 7;

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
    hydro: {
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
    return parseBoolean(process.env.HALL_OF_FAME_READY);
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
        .then((query) => query.forEach((docSnap) => {
          const data = docSnap.data();
          const parsedData = LeaderboardDBDataSchema.parse(data);
          dataArray.push(parsedData);
        }))
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

    logger.debug(`Cache for ${element}-dmg-${groupType} is ready`);
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

  static getScore(userID: User['id'], element: LBElements, groupType: GroupCategoryType) {
    const collection = this.#accessCache(element, groupType);
    return collection.get(userID);
  }

  private static collectionToArray(element: LBElements, groupType: GroupCategoryType) {
    return this.#accessCache(element, groupType)
      .clone()
      .sort((data1, data2) => data2.score - data1.score)
      .map((data) => data);
  }

  static async getRank(userID: User['id'], element: LBElements, groupType: GroupCategoryType) {
    const array = this.collectionToArray(element, groupType).map((data) => data.userID);
    return array.indexOf(userID) + 1;
  }

  static async registerScore(dbData: DBLeaderboardData): Promise<void> {
    const element = parseLBElement(dbData.elementCategory);
    const collection = this.#accessCache(element, dbData.typeCategory);
    return new Promise((res, rej) => {
      db.collection(`${dbData.elementCategory}-${dbData.typeCategory}`)
        .doc(dbData.userID)
        .set(dbData)
        .then(() => {
          container.logger.debug('Leaderboard Entry Submitted!');
          collection.set(dbData.userID, dbData);
          res();
        })
        .catch(rej);
    });
  }

  static async #rankBuilder(
    element: LBElements,
    groupType: GroupCategoryType,
    usersPerPage = this.#usersPerPage,
  ): Promise<string[]> {
    const array = this.collectionToArray(element, groupType);

    if (array.length < 1) {
      return [NOT_FOUND, NOT_FOUND];
    }

    const chunks = chunk(array, usersPerPage);

    let rank = 1;
    const pages: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const piece of chunks) {
      const lines: string[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const data of piece) {
        // eslint-disable-next-line no-await-in-loop
        const user = await getUser(data.userID);
        const { tag } = user;
        const line = `${rank}. \`${tag}\` [${data.score}](${data.proof})`;
        rank += 1;
        lines.push(line);
      }
      const page = lines.join('\n');
      pages.push(page);
    }
    if (pages.length <= 0) {
      pages.push(NOT_FOUND, NOT_FOUND);
    }
    return pages;
  }

  static async #rankEmbedGenerator(
    element: LBElements,
    groupType: GroupCategoryType,
    embedTemplate: APIEmbed,
    usersPerPage = this.#usersPerPage,
  ): Promise<APIEmbed[]> {
    return new Promise((res, rej) => {
      this.#rankBuilder(element, groupType, usersPerPage)
        .then((rankPages) => {
          const embeds: Array<typeof embedTemplate> = [];

          rankPages.forEach((page) => {
            const embed = deepClone(embedTemplate);
            embed.fields?.push({
              name: EMPTY_STRING,
              value: page || NOT_FOUND,
            });

            embed.footer = {
              text: `${rankPages.indexOf(page) + 1} of ${rankPages.length}`,
            };

            embeds.push(embed);
          });
          res(embeds);
        })
        .catch(rej);
    });
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
        users: collection.size,
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

      this.#rankEmbedGenerator(element, groupType, embed, usersPerPage).then(res).catch(rej);
    });
  }

  static generateSummaryEmbed(element: LBElements) {
    const props = leaderboardProps(element);

    container.logger.debug('Generating Leaderboard summary for:', element);
    return new Promise<APIEmbed>((res, rej) => {
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

      this.#rankBuilder(element, 'open', 7)
        .then(
          (openRanks) => embed.fields?.push(
            { name: '**Open Category Top 1-7**', value: openRanks[0] || NOT_FOUND, inline: true },
            {
              name: '**Open Category Top 8-14**',
              value: openRanks[1] || NOT_FOUND,
              inline: true,
            },
          ),
        )
        .then(
          () => embed.fields?.push({
            name: EMPTY_STRING,
            value: EMPTY_STRING,
          }),
        )
        .then(() => this.#rankBuilder(element, 'solo', 7))
        .then((soloRanks) => {
          embed.fields?.push(
            { name: '**Solo Category Top 1-7**', value: soloRanks[0] || NOT_FOUND, inline: true },
            {
              name: '**Solo Category Top 8-14**',
              value: soloRanks[1] || NOT_FOUND,
              inline: true,
            },
          );
        })
        .catch(rej);

      res(embed);
    });
  }
}
