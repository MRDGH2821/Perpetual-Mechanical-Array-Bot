// eslint-disable-next-line no-unused-vars
import { Client, Collection, MessageEmbed, User } from "discord.js";
import { db } from "./firebase.cjs";
import { hallOfFameProps } from "./constants.js";

// eslint-disable-next-line no-unused-vars
const abyssCategories = [
    "spiral-abyss-once",
    "current-spiral-abyss"
  ],
  crownCategories = [
    "anemo-crown",
    "geo-crown",
    "electro-crown",
    "unaligned-crown"
  ];

/**
 * returns array of crown data
 * @async
 * @function
 * @param {string} element -  "anemo-crown", "geo-crown", "electro-crown", "unaligned-crown"
 * @param {number} topEntries - top 'N' entries, default is complete database
 * @returns {Promise<Array<{userID: string, crowns:number}>>} - array of database entries
 */
export async function crownData(element, topEntries = 0) {
  console.log("Element Crown: ", element);
  const dataArray = [];

  if (crownCategories.includes(element)) {
    await db
      .collection(element)
      .orderBy("crowns", "desc")
      .limit(topEntries)
      .get()
      .then((query) => query.forEach((docSnap) => {
        dataArray.push(docSnap);
      }));
  }
  else {
    throw new Error(`"${element}" is not a valid element`);
  }
  return dataArray;
}

/**
 *
 * @async
 * @function
 * @param {string} type
 * @param {number} topEntries
 * @returns {Promise<Array<{userID: string, timestamp?: EpochTimeStamp, withTraveler?:boolean}>>} - array of database entries
 */
export async function spiralData(type, topEntries = 0) {
  console.log("Spiral abyss type:", type);
  const dataArray = [];

  if (type === "current-spiral-abyss") {
    await db
      .collection(type)
      .orderBy("withTraveler", "desc")
      .limit(topEntries)
      .get()
      .then((query) => query.forEach((docSnap) => {
        dataArray.push(docSnap);
      }));
  }
  else if (type === "spiral-abyss-once") {
    await db
      .collection(type)
      .orderBy("timestamp", "asc")
      .limit(topEntries)
      .get()
      .then((query) => query.forEach((docSnap) => {
        dataArray.push(docSnap);
      }));
  }
  else {
    throw new Error(`"${type}" is not a valid element`);
  }
  return dataArray;
}

/**
 * @typedef crownCacheData
 * @property {User} crownCacheData.User
 * @property {object<string, number>} crownCacheData.dbEntry
 */

/**
 * generates crown fields for embeds
 * @function crownFieldGenerator
 * @param {Object} crownCache
 * @param {Collection<string, crownCacheData>} crownCache.one
 * @param {Collection<string, crownCacheData>} crownCache.two
 * @param {Collection<string, crownCacheData>} crownCache.three
 * @param {string} category
 * @returns {Array<{string, string}>}
 */
function crownFieldGenerator(crownCache, category) {
  if (category === "unaligned-crown") {
    const obj = {
      name: "\u200b",
      value: ""
    };
    for (const [, dataCache] of crownCache.one) {
      obj.value = `${dataCache.User} ${dataCache.User.tag}\n${obj.value}`;
    }
    return [obj];
  }
  const fields = [];
  let double = "",
    single = "",
    triple = "";

  for (const [, dataCache] of crownCache.one) {
    single = `${dataCache.User} ${dataCache.User.tag}\nsingle`;
  }
  fields.push({
    name: "**Single Crown**",
    value: `${single} \n-`
  });
  for (const [, dataCache] of crownCache.two) {
    double = `${dataCache.User} ${dataCache.User.tag}\nsingle`;
  }
  fields.push({
    name: "**Double Crown**",
    value: `${double} \n-`
  });
  for (const [, dataCache] of crownCache.three) {
    triple = `${dataCache.User} ${dataCache.User.tag}\nsingle`;
  }
  fields.push({
    name: "**Triple Crown**",
    value: `${triple} \n-`
  });
  return fields;
}

/**
 * @typedef spiralCacheData
 * @property {User} spiralCacheData.User
 * @property {{userID: string, timestamp?: number, withTraveler?: boolean}} spiralCacheData.data
 */

/**
 * generates spiral abyss fields
 * @function spiralFieldGenerator
 * @param {Collection<string, spiralCacheData>} spiralCache
 * @param {string} category
 */
// eslint-disable-next-line consistent-return
function spiralFieldGenerator(spiralCache, category) {
  const currentAbyss = {
      name: "**Cleared Current Spiral Abyss Cycle**",
      value: ""
    },
    currentFields = [],
    currentTraveler = {
      name: "**Cleared with Traveler**",
      value: ""
    },
    oneTimeClear = {
      name: "**Cleared Spiral Abyss 36/36 once**",
      value: ""
    };
  if (category === "current-spiral-abyss") {
    spiralCache.forEach((dataCache) => {
      if (dataCache.data.withTraveler) {
        currentTraveler.value = `${dataCache.User} ${dataCache.User.tag}\n${currentTraveler.value}`;
      }
      else {
        currentAbyss.value = `${dataCache.User} ${dataCache.User.tag}\n${currentAbyss.value}`;
      }
    });
    return [currentFields.push(currentAbyss, currentTraveler)];
  }
  else if (category === "spiral-abyss-once") {
    spiralCache.forEach((dataCache) => {
      oneTimeClear.value = `${dataCache.User} ${dataCache.User.tag}`;
    });
    return [oneTimeClear];
  }
}

/**
 * generates embeds of given category
 * @async
 * @function hallOfFameGenerate
 * @param {Client} client - client object
 * @param {string} category - hall of fame category
 */
export async function hallOfFameGenerate(client, category) {
  const hofProps = hallOfFameProps(category),
    // eslint-disable-next-line sort-vars
    hofEmbed = new MessageEmbed()
      .setTitle(`${hofProps.name}`)
      .setColor(hofProps.color)
      .setThumbnail(hofProps.icon)
      .setTimestamp();

  let hofCacheData = {};

  switch (category) {
  case "anemo-crown": {
    hofCacheData = await client.hallOfFame.anemoCrown;
    hofEmbed(crownFieldGenerator(hofCacheData, category));
    break;
  }
  case "geo-crown": {
    hofCacheData = await client.hallOfFame.geoCrown;
    hofEmbed.addFields(crownFieldGenerator(hofCacheData, category));
    break;
  }
  case "electro-crown": {
    hofCacheData = await client.hallOfFame.electroCrown;
    hofEmbed.addFields(crownFieldGenerator(hofCacheData, category));
    break;
  }
  case "unaligned-crown": {
    hofCacheData = await client.hallOfFame.geoCrown;
    hofEmbed.addFields(crownFieldGenerator(hofCacheData, category));
    break;
  }
  case "spiral-abyss-once": {
    hofCacheData = await client.hallOfFame.spiralAbyss.once;
    hofEmbed.addFields(spiralFieldGenerator(hofCacheData, category));
    break;
  }
  case "current-spiral-abyss": {
    hofCacheData = await client.hallOfFame.spiralAbyss.current;
    hofEmbed.addFields(spiralFieldGenerator(hofCacheData, category));
    break;
  }
    // no default
  }

  return hofEmbed;
}
