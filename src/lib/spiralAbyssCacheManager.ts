import { Member } from 'detritus-client/lib/structures';
import { BaseCollection } from 'detritus-utils';
import { SimpleEmbed } from '../botTypes/interfaces';
import { SpiralAbyssClearTypes } from '../botTypes/types';
import { getShardClient } from './BotClientExtracted';
import { COLORS, ICONS, ROLE_IDS } from './Constants';
import EnvConfig from './EnvConfig';
import { publishEmbedBuilder } from './Utilities';

const totalUsers = 20;

export const spiralAbyssCache = {
  abyssalConqueror: new BaseCollection<string, Member>(),
  abyssalTraveler: new BaseCollection<string, Member>(),
  abyssalSovereign: new BaseCollection<string, Member>(),
};

export function getSACacheObject() {
  return spiralAbyssCache;
}

export function setSpiralAbyssData() {
  return new Promise((res, rej) => {
    try {
      const SClient = getShardClient();
      const SACache = spiralAbyssCache;
      const SARoles = ROLE_IDS.SpiralAbyss;

      const roleMembers = (roleId: string) => SClient.roles.get(EnvConfig.guildId, roleId)?.members;

      SACache.abyssalTraveler = roleMembers(SARoles.ABYSSAL_TRAVELER) || new BaseCollection();
      console.log('Abyssal Traveler done');
      SACache.abyssalConqueror = roleMembers(SARoles.ABYSSAL_CONQUEROR) || new BaseCollection();
      console.log('Abyssal Conqueror done');
      SACache.abyssalSovereign = roleMembers(SARoles.ABYSSAL_SOVEREIGN) || new BaseCollection();
      console.log('Abyssal Sovereign done');

      res(true);
    } catch (err) {
      rej(err);
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

export function publishSANames(clearType: SpiralAbyssClearTypes): Promise<SimpleEmbed[]> {
  let SASubCache: typeof spiralAbyssCache.abyssalConqueror;
  switch (clearType) {
    case 'Abyssal Traveler': {
      SASubCache = spiralAbyssCache.abyssalTraveler;
      break;
    }
    case 'Abyssal Conqueror': {
      SASubCache = spiralAbyssCache.abyssalConqueror;
      break;
    }
    case 'Abyssal Sovereign': {
      SASubCache = spiralAbyssCache.abyssalSovereign;
      break;
    }
    default: {
      throw new Error(`${clearType} does not exist`);
    }
  }
  return new Promise((res, rej) => {
    if (!SASubCache) {
      rej(new Error(`${clearType} cache not ready`));
    }

    const groupCache = SASubCache.clone();

    const users = groupCache.toArray().map((cacheObj) => cacheObj.user);
    const date = new Date();

    const embed: SimpleEmbed = {
      title: `**Spiral Abyss Clear Board: ${clearType}**`,
      color: COLORS.SPIRAL_ABYSS,
      thumbnail: { url: ICONS.SPIRAL_ABYSS },
      description: `Cycle Details: \n${date.getDate() < 16 ? 'Waxing Phase' : 'Waning Phase'} (${
        date.getMonth() + 1
      }/${date.getFullYear()})`,
      timestamp: new Date().toISOString(),
      fields: [],
    };

    publishEmbedBuilder(users, totalUsers, embed).then(res).catch(rej);
  });
}
