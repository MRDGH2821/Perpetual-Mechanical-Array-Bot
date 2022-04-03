/* eslint-disable no-await-in-loop */
/* eslint-disable no-magic-numbers */
// eslint-disable-next-line no-unused-vars
import { Client, Collection } from "discord.js";
import { crownData, spiralData } from "./HallOfFameManager.js";
import ProgressBar from "progress";
import https from "https";
import { leaderboardData } from "./LeaderboardManager.js";

/* eslint-disable no-useless-escape */
const URLregexp1 =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/gu,
  URLregexp2 =
    /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/giu;

/**
 * checks if given URL is valid or not
 * @function isURLvalid
 * @param {string} url - link/URL
 * @returns {boolean} - whether given URL is valid or not
 */
export function isURLvalid(url) {
  return URLregexp1.test(url) || URLregexp2.test(url);
}

/**
 * returns a joke
 * @function getJoke
 * @param {string} type - type of joke
 * @returns {Promise<JSON>} - returns joke in JSON format
 */
export function getJoke(type = "Any") {
  return new Promise((resolve, reject) => {
    https
      .get(
        `https://v2.jokeapi.dev/joke/${type}?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&safe-mode`,
        (res) => {
          let todo = "";

          res.on("data", (chunk) => {
            todo += chunk;
          });

          res.on("end", () => {
            resolve(JSON.parse(todo));
          });
        }
      )
      .on("error", (error) => {
        console.error(error);
        reject(error);
      });
  });
}

/**
 * sets leaderboard data into collection cache
 * @async
 * @function leaderboardSetData
 * @param {object} dataProps
 * @param {"anemo-dmg-skill"|"geo-dmg-skill"|"electro-dmg-skill"|"uni-dmg-n5"} dataProps.dmgCategory
 * @param {"open"|"solo"} dataProps.type
 * @param {Collection} dataProps.collection
 * @param {Client} dataProps.client
 */
export async function leaderboardSetData({
  dmgCategory,
  type,
  collection,
  client
}) {
  const lbData = await leaderboardData(dmgCategory, type),
    // eslint-disable-next-line sort-vars
    lbBar = new ProgressBar(
      `Refresh Started! Damage Category: ${dmgCategory}-${type}, Loading Cache: [:bar] (:current/:total), Time Taken: :elapsed second(s), ETA: :eta`,
      {
        callback: () => {
          console.log("Refresh Complete");
        },
        total: lbData.length
      }
    );
  for (const data of lbData) {
    await client.users.fetch(data.userID).then((User) => {
      const dataToPut = {
        User,
        data
      };
      collection.set(data.userID, dataToPut);
      lbBar.tick();
    });
  }
}

/**
 * sets crown data into hall of fame collection cache
 * @async
 * @function crownSetData
 * @param {object} crownSetData
 * @param {"anemo-crown"|"geo-crown"|"electro-crown"|"unaligned-crown"} crownSetData.element - crown element
 * @param {object} crownSetData.collectionObj
 * @param {Collection} crownSetData.collectionObj.one - collection of one crown users
 * @param {Collection} crownSetData.collectionObj.two - collection of two crown users
 * @param {Collection} crownSetData.collectionObj.three - collection of three crown users
 * @param {Client} crownSetData.client - client object
 */
export async function crownSetData({ element, collectionObj, client }) {
  const crownlbData = await crownData(element),
    // eslint-disable-next-line sort-vars
    crownBar = new ProgressBar(
      `Refresh Started! Crown Element: ${element}, Loading Cache: [:bar] (:current/:total), Time Taken: :elapsed second(s), ETA: :eta`,
      {
        callback: () => {
          console.log("Refresh Complete");
        },
        total: crownlbData.length
      }
    );
  for (const data of crownlbData) {
    await client.users.fetch(data.userID).then((User) => {
      const dataToPut = {
        User,
        data
      };
      if (data.crowns === 1) {
        collectionObj.one.set(data.userID, dataToPut);
      }
      if (data.crowns === 2) {
        collectionObj.two.set(data.userID, dataToPut);
      }
      if (data.crowns === 3) {
        collectionObj.three.set(data.userID, dataToPut);
      }
      crownBar.tick();
    });
  }
}

/**
 * sets spiral abyss data into hall of fame collection cache
 * @async
 * @function spiralSetData
 * @param {object} crownSetData
 * @param {"spiral-abyss-once"|"current-spiral-abyss"} crownSetData.type - spiral abyss type
 * @param {Collection} crownSetData.collection - collection of spiral abyss data
 * @param {Client} crownSetData.client - client object
 */
export async function spiralSetData({ type, collection, client }) {
  const spiralLbData = await spiralData(type),
    // eslint-disable-next-line sort-vars
    spiralBar = new ProgressBar(
      `Refresh Started! Spiral Abyss type: ${type}, Loading Cache: [:bar] (:current/:total), Time Taken: :elapsed second(s), ETA: :eta`,
      {
        callback: () => {
          console.log("Refresh Complete");
        },
        total: spiralLbData.length
      }
    );
  for (const data of spiralLbData) {
    await client.users.fetch(data.userID).then((User) => {
      const dataToPut = {
        User,
        data
      };
      collection.set(data.userID, dataToPut);
      spiralBar.tick();
    });
  }
}
