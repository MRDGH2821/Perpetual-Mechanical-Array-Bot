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
 * @function crownData
 * @param {"anemo-crown"|"geo-crown"|"electro-crown"|"unaligned-crown"} element - element of the crown
 * @param {number} topEntries - top 'N' entries, default is complete database
 * @returns {Promise<Array<{userID: string, crowns:number}>>} - array of database entries
 */
export async function crownData(element, topEntries = 0) {
  // console.log("Element Crown:", element);
  const dataArray = [];

  if (crownCategories.includes(element)) {
    await db
      .collection(element)
      .orderBy("crowns", "desc")
      .limit(topEntries)
      .get()
      .then((query) => query.forEach((docSnap) => {
        dataArray.push(docSnap.data());
      }));
    // console.log(dataArray)
  }
  else {
    throw new Error(`"${element}" is not a valid element`);
  }
  return dataArray;
}

/**
 * returns array of database entries of spiral abyss
 * @async
 * @function spiralData
 * @param {"current-spiral-abyss"|"spiral-abyss-once"} type - type of data to fetch
 * @param {number} topEntries - top 'N' entries, default is complete database
 * @returns {Promise<Array<{userID: string, timestamp?: EpochTimeStamp, withTraveler?:boolean}>>} - array of database entries
 */
export async function spiralData(type, topEntries = 0) {
  // console.log("Spiral abyss type:", type);
  const dataArray = [];

  if (type === "current-spiral-abyss") {
    await db
      .collection(type)
      .orderBy("withTraveler", "desc")
      .limit(topEntries)
      .get()
      .then((query) => query.forEach((docSnap) => {
        dataArray.push(docSnap.data());
      }));
  }
  else if (type === "spiral-abyss-once") {
    await db
      .collection(type)
      .orderBy("timestamp", "asc")
      .limit(topEntries)
      .get()
      .then((query) => query.forEach((docSnap) => {
        dataArray.push(docSnap.data());
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
 * @param {Collection<string, crownCacheData>} crownCache.one - collection of single crown users
 * @param {Collection<string, crownCacheData>} crownCache.two - collection of double crown users
 * @param {Collection<string, crownCacheData>} crownCache.three - collection of triple crown users
 * @param {"anemo-crown"|"geo-crown"|"electro-crown"|"unaligned-crown"} category - element of crown
 * @returns {Array<{string, string}>} - array of embed field objects
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
    obj.value = `${obj.value}\n-`;
    return [obj];
  }
  const fields = [];
  let double = "",
    single = "",
    triple = "";

  for (const [, dataCache] of crownCache.one) {
    single = `${dataCache.User} ${dataCache.User.tag}\n${single}`;
  }
  fields.push({
    name: "**Single Crown**",
    value: `${single} \n-`
  });
  for (const [, dataCache] of crownCache.two) {
    double = `${dataCache.User} ${dataCache.User.tag}\n${double}`;
  }
  fields.push({
    name: "**Double Crown**",
    value: `${double} \n-`
  });
  for (const [, dataCache] of crownCache.three) {
    triple = `${dataCache.User} ${dataCache.User.tag}\n${triple}`;
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
 * @param {Collection<string, spiralCacheData>} spiralCache - collection of spiral abyss data
 * @param {"current=spiral-abyss"|"spiral-abyss-once"} category - spiral abyss category
 * @returns {Array<string,string>} - array of embed field objects
 */
// eslint-disable-next-line consistent-return
function spiralFieldGenerator(spiralCache, category) {
  if (category === "current-spiral-abyss") {
    let abyssClear = "",
      abyssWithTraveler = "";
    spiralCache.forEach((dataCache) => {
      if (dataCache.data.withTraveler) {
        abyssWithTraveler = `${dataCache.User} ${dataCache.User.tag}\n${abyssWithTraveler}`;
      }
      else {
        abyssClear = `${dataCache.User} ${dataCache.User.tag}\n${abyssClear}`;
      }
    });
    const currentAbyss = {
        name: "**Cleared Current Spiral Abyss Cycle**",
        value: `${abyssClear}\n-`
      },
      currentTraveler = {
        name: "**Cleared with Traveler**",
        value: `${abyssWithTraveler}\n-`
      };
    return [
      currentAbyss,
      currentTraveler
    ];
  }
  else if (category === "spiral-abyss-once") {
    let historicalClear = "";
    spiralCache.forEach((dataCache) => {
      historicalClear = `${dataCache.User} ${dataCache.User.tag}\n${historicalClear}`;
    });
    const oneTimeClear = {
      name: "**Cleared Spiral Abyss 36/36 once**",
      value: `${historicalClear}\n-`
    };
    return [oneTimeClear];
  }
}

/**
 * generates embeds of given category
 * @async
 * @function hallOfFameGenerate
 * @param {Client} client - client object
 * @param {"anemo-crown"|"geo-crown"|"electro-crown"|"unaligned-crown"|"spiral-abyss-once"|"current-spiral-abyss"} category - hall of fame category
 * @returns {MessageEmbed} - embed of given category
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
    hofEmbed.addFields(crownFieldGenerator(hofCacheData, category));
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

/**
 * returns spiral data or crown data as per category
 * @async
 * @function hofData
 * @param {"anemo-crown"|"geo-crown"|"electro-crown"|"unaligned-crown"|"spiral-abyss-once"|"current-spiral-abyss"} category - category og data to fetch
 * @param {number} topEntries -  top 'N' entries, default is complete database
 * @returns {AsyncFunction<spiralData>|AsyncFunction<crownData>} - function call of respective category
 */
// eslint-disable-next-line consistent-return
export function hofData(category, topEntries = 0) {
  if (abyssCategories.includes(category)) {
    return spiralData(category, topEntries);
  }
  else if (crownCategories.includes(category)) {
    return crownData(category, topEntries);
  }
}
