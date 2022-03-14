/* eslint-disable no-magic-numbers */
// eslint-disable-next-line no-unused-vars
import { Client, MessageEmbed } from 'discord.js';
import { db } from './firebase.cjs';
import { elementIcon } from './constants.js';
import { hyperlink } from '@discordjs/builders';

const elementCategories = [
  'anemo-dmg-skill',
  'geo-dmg-skill',
  'electro-dmg-skill',
  'uni-dmg-n5'
];

/**
 * returns array of data sorted by score from database
 * @async
 * @function leaderboardData
 * @param {string} element -'anemo-dmg-skill', 'geo-dmg-skill', 'electro-dmg-skill', 'uni-dmg-n5'
 * @param {string} type - solo or open, default solo
 * @param {number} topEntries - top 'N' entries, default is complete database
 * @returns {Promise<Array<{elementCategory: string, userID: string, typeCategory: string, proof: string, score: number}>>} - array of database entries
 */
export async function leaderboardData(element, type, topEntries = 0) {
  console.log('type:', type);
  const dataArray = [];
  if (elementCategories.includes(element)) {
    if (
      type.toLowerCase().startsWith('solo') ||
      type.toLowerCase().startsWith('open')
    ) {
      await db
        .collection(`${element}-${type.toLowerCase()}`)
        .orderBy('score', 'desc')
        .limit(topEntries)
        .get()
        .then((query) => {
          query.forEach((docSnap) => {
            dataArray.push(docSnap.data());
          });
        });
    }
    else {
      throw new Error(`"${type}" is not a valid type`);
    }
  }
  else {
    throw new Error(`"${element}" is not a valid element`);
  }
  return dataArray;
}

// console.log(await leaderboardData(elementCategories[1], 'solo'));

/**
 * @async
 * @function
 * @param {Client} client - bot client
 * @param {string} dmgCategory - damage category
 * @returns {MessageEmbed} - Embed leaderboard
 */
export async function leaderboardGenerate(client, dmgCategory) {
  const dmgProps = elementIcon(dmgCategory),
    leaderboardEmbed = new MessageEmbed()
      .setTitle(`${dmgProps.name} Damage Leaderboard`)
      .setColor(dmgProps.color)
      .setThumbnail(dmgProps.icon)
      .setDescription(`Highest Damage number of **${dmgProps.skill}**`);
  let leaderboardCacheData = {},
    rank = 1,
    topOpen = '',
    topSolo = '';
  switch (dmgCategory) {
  case 'anemo-dmg-skill': {
    leaderboardCacheData = await client.leaderboards.anemo.skill;
    break;
  }
  case 'geo-dmg-skill': {
    leaderboardCacheData = await client.leaderboards.geo.skill;
    break;
  }
  case 'electro-dmg-skill': {
    leaderboardCacheData = await client.leaderboards.electro.skill;
    break;
  }
  case 'uni-dmg-n5': {
    leaderboardCacheData = await client.leaderboards.universal.n5;
    break;
  }
    // no default
  }
  for (const [, dataCache] of leaderboardCacheData.open) {
    if (rank === 14) {
      break;
    }
    topOpen = `${topOpen}\n${rank}. \`${dataCache.User.tag}\` - ${hyperlink(
      `${dataCache.data.score}`,
      dataCache.data.proof
    )}`;
    rank += 1;
  }
  rank = 1;
  for (const [, dataCache] of leaderboardCacheData.solo) {
    if (rank === 14) {
      break;
    }
    topSolo = `${topSolo}\n${rank}. \`${dataCache.User.tag}\` - ${hyperlink(
      `${dataCache.data.score}`,
      dataCache.data.proof
    )}`;
    rank += 1;
  }
  leaderboardEmbed.addFields([
    {
      name: '**Solo Category**',
      value: `${topSolo} `
    },
    {
      inline: true,
      name: '**Open Category**',
      value: `${topOpen} `
    }
  ]);

  return leaderboardEmbed;
}
