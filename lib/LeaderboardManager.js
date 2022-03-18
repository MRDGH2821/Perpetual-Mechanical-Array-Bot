/* eslint-disable no-magic-numbers */
// eslint-disable-next-line no-unused-vars
import { Client, MessageEmbed } from "discord.js";
import { db } from "./firebase.cjs";
import { elementIcon } from "./constants.js";
import { hyperlink } from "@discordjs/builders";

const elementCategories = [
  "anemo-dmg-skill",
  "geo-dmg-skill",
  "electro-dmg-skill",
  "uni-dmg-n5"
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
  console.log("type:", type);
  const dataArray = [];
  if (elementCategories.includes(element)) {
    if (
      type.toLowerCase().startsWith("solo") ||
      type.toLowerCase().startsWith("open")
    ) {
      await db
        .collection(`${element}-${type.toLowerCase()}`)
        .orderBy("score", "desc")
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
    fields = [],
    leaderboardEmbed = new MessageEmbed()
      .setTitle(`${dmgProps.name} Damage Leaderboard`)
      .setColor(dmgProps.color)
      .setThumbnail(dmgProps.icon)
      .setDescription(`Highest Damage number of **${dmgProps.skill}**`)
      .setTimestamp();
  let leaderboardCacheData = {},
    rank = 1,
    topOpen = "",
    topSolo = "";
  switch (dmgCategory) {
  case "anemo-dmg-skill": {
    leaderboardCacheData = await client.leaderboards.anemo.skill;
    break;
  }
  case "geo-dmg-skill": {
    leaderboardCacheData = await client.leaderboards.geo.skill;
    break;
  }
  case "electro-dmg-skill": {
    leaderboardCacheData = await client.leaderboards.electro.skill;
    break;
  }
  case "uni-dmg-n5": {
    leaderboardCacheData = await client.leaderboards.universal.n5;
    break;
  }
    // no default
  }
  for (const [, dataCache] of leaderboardCacheData.open) {
    topOpen = `${topOpen}\n${rank}. \`${dataCache.User.tag}\` - ${hyperlink(
      `${dataCache.data.score}`,
      dataCache.data.proof
    )}`;
    if (leaderboardCacheData.open.size > 7) {
      if (rank === 7) {
        const field = {
          inline: true,
          name: "**Open Category Top 1-7**",
          value: `${topOpen} \n-`
        };
        fields.push(field);
        topOpen = "";
      }
      else if (rank === 15 || rank === leaderboardCacheData.open.size) {
        const field = {
          inline: true,
          name: "**Open Category Top 8-14**",
          value: `${topOpen} \n-`
        };
        fields.push(field);
        fields.push({ name: "\u200b", value: "\u200b" });
        topOpen = "";
        break;
      }
    }
    else if (rank === leaderboardCacheData.open.size) {
      const field = {
        name: "**Open Category Top 1-7**",
        value: `${topOpen} \n-`
      };
      fields.push(field);
      fields.push({ name: "\u200b", value: "\u200b" });
      topSolo = "";
      break;
    }
    rank += 1;
  }
  rank = 1;

  for (const [, dataCache] of leaderboardCacheData.solo) {
    topSolo = `${topSolo}\n${rank}. \`${dataCache.User.tag}\` - ${hyperlink(
      `${dataCache.data.score}`,
      dataCache.data.proof
    )}`;

    if (leaderboardCacheData.solo.size > 7) {
      if (rank === 7) {
        const field = {
          inline: true,
          name: "**Solo Category Top 1-7**",
          value: `${topSolo} \n-`
        };
        fields.push(field);
        topSolo = "";
      }
      else if (rank === 15 || rank === leaderboardCacheData.solo.size) {
        const field = {
          inline: true,
          name: "**Solo Category Top 8-14**",
          value: `${topSolo} \n-`
        };
        fields.push(field);
        topSolo = "";
        break;
      }
    }
    else if (rank === leaderboardCacheData.solo.size) {
      const field = {
        name: "**Solo Category Top 1-7**",
        value: `${topSolo} \n-`
      };
      fields.push(field);
      topSolo = "";
      break;
    }

    rank += 1;
  }
  leaderboardEmbed.addFields(fields);

  return leaderboardEmbed;
}
