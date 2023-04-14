import { container } from '@sapphire/pieces';
import { APIEmbed, Collection, Role } from 'discord.js';
import { checkBoolean } from '../../baseBot/lib/Utilities';
import { ROLE_IDS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import { publishEmbedsGenerator } from '../../lib/utils';
import type { SpiralAbyssClearTypes } from '../typeDefs/spiralAbyssTypes';
import { SAProps } from './Utilities';

type CacheType = Record<SpiralAbyssClearTypes, Role['members']>;

const { logger } = container;

export default class SpiralAbyssCache {
  static #usersPerPage = 20;

  static #cache: CacheType = {
    traveler: new Collection(),
    conqueror: new Collection(),
    sovereign: new Collection(),
  };

  static isCacheReady() {
    return checkBoolean(process.env.SPIRAL_ABYSS_READY);
  }

  static #fetchDB(clearType: SpiralAbyssClearTypes) {
    let roleId: ROLE_IDS.SpiralAbyss;

    switch (clearType) {
      case 'traveler': {
        roleId = ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER;
        break;
      }
      case 'conqueror': {
        roleId = ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR;
        break;
      }
      case 'sovereign': {
        roleId = ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN;
        break;
      }
      // no default
    }
    return container.client.guilds
      .fetch(EnvConfig.guildId)
      .then((guild) => guild.roles.fetch(roleId))
      .then((role) => {
        if (role) {
          return role.members;
        }
        throw new Error(`Cannot fetch the role whose id is ${roleId}`);
      });
  }

  static #accessCache(clearType: SpiralAbyssClearTypes) {
    const collection = this.#cache[clearType];
    if (!collection) {
      throw new Error(`'${clearType}' is not a valid Spiral Abyss Clear Type`);
    }
    return collection;
  }

  static async prepareCache() {
    this.#cache = {
      traveler: (await this.#fetchDB('traveler')) || new Collection(),
      conqueror: (await this.#fetchDB('conqueror')) || new Collection(),
      sovereign: (await this.#fetchDB('sovereign')) || new Collection(),
    };
  }

  static generateEmbeds(
    clearType: SpiralAbyssClearTypes,
    usersPerPage = this.#usersPerPage,
    date = new Date(),
  ): Promise<APIEmbed[]> {
    const props = SAProps(clearType);
    return new Promise((res, rej) => {
      const collection = this.#accessCache(clearType);
      logger.debug('Building embeds for: ', {
        'Clear Type': clearType,
        users: collection.size,
      });

      const embed: APIEmbed = {
        title: `**${props.name}** ${props.emoji}`,
        color: props.color,
        thumbnail: {
          url: props.icon,
        },
        description: `Cycle Details: \n${date.getDate() < 16 ? 'Waxing Phase' : 'Waning Phase'}`,
        timestamp: date.toISOString(),
        fields: [],
      };

      const users = collection.map((member) => member.user);

      publishEmbedsGenerator({
        users,
        embedTemplate: embed,
        usersPerPage,
      })
        .then(res)
        .catch(rej);
    });
  }
}
