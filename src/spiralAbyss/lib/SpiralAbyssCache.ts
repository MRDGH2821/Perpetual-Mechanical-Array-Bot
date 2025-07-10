import { container } from "@sapphire/framework";
import { type APIEmbed, Collection, type Role, time } from "discord.js";
import { parseBoolean } from "../../baseBot/lib/Utilities.js";
import { EMPTY_STRING, ROLE_IDS } from "../../lib/Constants.js";
import EnvConfig from "../../lib/EnvConfig.js";
import { publishEmbedsGenerator } from "../../lib/utils.js";
import type {
  BackupCacheFileType,
  SpiralAbyssClearTypes,
} from "../typeDefs/spiralAbyssTypes.js";
import { SAProps } from "./Utilities.js";

type CacheType = Record<SpiralAbyssClearTypes, Role["members"]>;

const { logger } = container;

export default class SpiralAbyssCache {
  static #usersPerPage = 20;

  static #cache: CacheType = {
    traveler: new Collection(),
    conqueror: new Collection(),
    sovereign: new Collection(),
  };

  public static isCacheReady() {
    return parseBoolean(process.env.SPIRAL_ABYSS_READY);
  }

  static async #fetchDB(clearType: SpiralAbyssClearTypes) {
    let roleId: ROLE_IDS.SpiralAbyss;

    switch (clearType) {
      case "traveler": {
        roleId = ROLE_IDS.SPIRAL_ABYSS.ABYSSAL_TRAVELER;
        break;
      }

      case "conqueror": {
        roleId = ROLE_IDS.SPIRAL_ABYSS.ABYSSAL_CONQUEROR;
        break;
      }

      case "sovereign": {
        roleId = ROLE_IDS.SPIRAL_ABYSS.ABYSSAL_SOVEREIGN;
        break;
      }

      default: {
        throw new Error(`Invalid Clear Type ${clearType}`);
      }
    }

    const guild = await container.client.guilds.fetch(EnvConfig.guildId);

    try {
      const role = await guild.roles.fetch(roleId);
      const guildMembers = await guild.members.fetch();
      const getMembers = () =>
        guildMembers.filter((member) => member.roles.cache.has(roleId));
      const members: Role["members"] = role ? role.members : new Collection();

      if (members.size < 1) {
        return getMembers();
      }

      return members;
    } catch (error) {
      container.logger.error(error);
      container.logger.debug("Setting self in cache");
      const myself = await guild.members.me!.fetch(true)!;
      const members: Role["members"] = new Collection();
      members.set(myself.id, myself);
      return members;
    }
  }

  public static accessCache(clearType: SpiralAbyssClearTypes) {
    const collection = this.#cache[clearType];
    if (!collection) {
      throw new Error(`'${clearType}' is not a valid Spiral Abyss Clear Type`);
    }

    return collection;
  }

  public static async prepareCache() {
    this.#cache = {
      traveler: await this.#fetchDB("traveler"),
      conqueror: await this.#fetchDB("conqueror"),
      sovereign: await this.#fetchDB("sovereign"),
    };
  }

  public static async generateEmbeds(
    clearType: SpiralAbyssClearTypes,
    usersPerPage = this.#usersPerPage,
    date = new Date(),
  ): Promise<APIEmbed[]> {
    const props = SAProps(clearType);
    return new Promise((resolve, reject) => {
      const collection = this.accessCache(clearType);
      logger.debug("Building embeds for: ", {
        "Clear Type": clearType,
        users: collection.size,
      });

      const embed: APIEmbed = {
        title: `**${props.name}** ${props.emoji}`,
        color: props.color,
        thumbnail: {
          url: props.icon,
        },
        description: `Cycle Details: \n${
          date.getDate() < 16 ? "Waxing Phase" : "Waning Phase"
        } \n${time(date, "F")}`,
        timestamp: date.toISOString(),
        fields: [],
      };

      const users = collection.map((member) => member.user);

      if (users.length < 1) {
        embed.fields?.push({
          name: EMPTY_STRING,
          value: "No members found in this section",
        });

        resolve([embed]);
      } else {
        publishEmbedsGenerator({
          users,
          embedTemplate: embed,
          usersPerPage,
        })
          .then(resolve)
          .catch(reject);
      }
    });
  }

  public static exportCacheBackup(): BackupCacheFileType {
    return {
      traveler: this.#cache.traveler.map((member) => member.id),
      conqueror: this.#cache.conqueror.map((member) => member.id),
      sovereign: this.#cache.sovereign.map((member) => member.id),
    };
  }

  public static async removeRoles() {
    for (const member of this.#cache.traveler.values()) {
      await member.roles.remove(ROLE_IDS.SPIRAL_ABYSS.ABYSSAL_TRAVELER);
    }

    for (const member of this.#cache.conqueror.values()) {
      await member.roles.remove(ROLE_IDS.SPIRAL_ABYSS.ABYSSAL_CONQUEROR);
    }

    for (const member of this.#cache.sovereign.values()) {
      await member.roles.remove(ROLE_IDS.SPIRAL_ABYSS.ABYSSAL_SOVEREIGN);
    }
  }
}
